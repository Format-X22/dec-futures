import * as sleep from 'sleep-promise';
import BigNumber from 'bignumber.js';
import { Inject, Injectable } from '@nestjs/common';
import { EMarketKey } from '@app/shared/entity.enum';
import { AbstractMarketService } from './abstract-market.service';
import { Funding } from '@app/shared/funding.schema';
import request, { gql } from 'graphql-request';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

type TV1TheGraphApiResponse = {
    fundingRateUpdatedEvents: Array<{
        amm: string;
        rate: string;
        timestamp: string;
    }>;
};

type TV1MetadataResponse = {
    layers: {
        layer2: {
            contracts: {
                [key: string]: {
                    name: string;
                    address: string;
                };
            };
        };
    };
};

const V1_METADATA_URL = 'https://metadata.perp.exchange/production.json';
const V1_THE_GRAPH_API = 'https://api.thegraph.com/subgraphs/name/perpetual-protocol/perp-position-subgraph';
const V1_API_PAGE_SIZE = 100;
const V1_API_MAX_SKIP = 5000;
const V1_DECIMALS_DIV = new BigNumber(10).pow(18);
const V1_QUOTE = 'USDC';
const V1_DELAY = 1000;

@Injectable()
export class PerpService extends AbstractMarketService {
    @Inject()
    private httpService: HttpService;

    public name = EMarketKey.PERP;
    private ammToPair: Map<string, string> = new Map();

    constructor(...args: ConstructorParameters<typeof AbstractMarketService>) {
        super(...args);

        // TODO -
    }

    async iteration(): Promise<void> {
        if (!this.ammToPair.size) {
            await this.syncAmmPairs();
        }

        await this.updateV1NextFunding();
        await sleep(V1_DELAY);
        await this.updateV1History();
        await sleep(V1_DELAY);
    }

    private async updateV1NextFunding(): Promise<void> {
        // TODO -
    }

    private async updateV1History(): Promise<void> {
        const result: Array<Funding> = await this.extractV1HistoryData();

        await this.saveV1HistoryData(result);
    }

    private async extractV1HistoryData(): Promise<Array<Funding>> {
        let skip = 0;
        const result: Array<Funding> = [];

        while (true) {
            const query = this.makeV1Query(skip);
            const response: TV1TheGraphApiResponse = await request(V1_THE_GRAPH_API, query);

            if (!response?.fundingRateUpdatedEvents?.length) {
                break;
            }

            for (const rawData of response.fundingRateUpdatedEvents) {
                result.push({
                    marketKey: EMarketKey.PERP,
                    payDate: new Date(Number(rawData.timestamp) * 1000),
                    base: this.ammToPair.get(String(rawData.amm)),
                    quote: V1_QUOTE,
                    rate: new BigNumber(rawData.rate).div(V1_DECIMALS_DIV).toNumber(),
                });
            }

            skip += V1_API_PAGE_SIZE;

            if (skip > V1_API_MAX_SKIP) {
                break;
            }

            await sleep(V1_DELAY);
        }

        return result;
    }

    private async saveV1HistoryData(data: Array<Funding>): Promise<void> {
        for (const fundingData of data) {
            await this.fundingModel.updateOne(
                {
                    marketKey: fundingData.marketKey,
                    base: fundingData.base,
                    payDate: fundingData.payDate,
                },
                { $set: { ...fundingData } },
                { upsert: true },
            );
        }
    }

    private makeV1Query(skip: number): string {
        return gql`
            {
                fundingRateUpdatedEvents(
                    skip: ${skip},
                    first: ${V1_API_PAGE_SIZE},
                    orderBy: blockNumber,
                    orderDirection: desc
                ) {
                    amm
                    rate
                    timestamp
                }
            }
        `;
    }

    @Cron(CronExpression.EVERY_10_MINUTES)
    private async syncAmmPairs(): Promise<void> {
        const metadataResponse: AxiosResponse<TV1MetadataResponse> = await this.httpService
            .get(V1_METADATA_URL)
            .toPromise();

        for (const [contractName, data] of Object.entries(metadataResponse.data.layers.layer2.contracts)) {
            if (data.name === 'Amm') {
                this.ammToPair.set(data.address.toLowerCase(), contractName);
            }
        }
    }
}
