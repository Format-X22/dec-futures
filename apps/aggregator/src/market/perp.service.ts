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
import { BigNumber as EthersBigNumber, Contract, providers, Wallet } from 'ethers';
import * as AmmArtifact from '@perp/contract/build/contracts/src/Amm.sol/Amm.json';
import * as moment from 'moment';

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

const XDAI_URL = 'https://rpc.xdaichain.com/';
const XDAI_LAYER_2_PROVIDER = new providers.JsonRpcProvider(XDAI_URL);
const XDAI_LAYER_2_WALLET = Wallet.createRandom().connect(XDAI_LAYER_2_PROVIDER);
const ETH_DAY = 24 * 60 * 60;

@Injectable()
export class PerpService extends AbstractMarketService {
    @Inject()
    private httpService: HttpService;
    public name = EMarketKey.PERP;
    private ammToPair: Map<string, string> = new Map();

    async onModuleInit(): Promise<void> {
        const data = await this.fundingModel.find({ marketKey: EMarketKey.PERP }, { _id: true, base: true });

        for (const { _id, base } of data) {
            await this.fundingModel.updateOne({ _id }, { $set: { base: base.replace('USDC', '') } });
        }
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
        const result: Array<Funding> = [];

        for (const [ammAddress, pair] of this.ammToPair.entries()) {
            const secondsSinceHour = moment().minutes() * 60;
            const amm = new Contract(ammAddress, AmmArtifact.abi, XDAI_LAYER_2_WALLET);
            const [rawTwapPrice]: [EthersBigNumber] = await amm.getTwapPrice(secondsSinceHour);
            const twap: BigNumber = new BigNumber(rawTwapPrice.toString()).div(V1_DECIMALS_DIV);
            const [rawUnderlyingTwapPrice]: [EthersBigNumber] = await amm.getUnderlyingTwapPrice(secondsSinceHour);
            const underlying: BigNumber = new BigNumber(rawUnderlyingTwapPrice.toString()).div(V1_DECIMALS_DIV);
            const rawFundingPeriod: EthersBigNumber = await amm.fundingPeriod();
            const rate: number = twap
                .minus(underlying)
                .div(underlying)
                .times(new BigNumber(rawFundingPeriod.toString()).div(ETH_DAY))
                .times(100)
                .toNumber();

            result.push({
                marketKey: EMarketKey.PERP,
                payDate: moment().startOf('hour').add(1, 'hour').add(1, 'minute').utc().toDate(),
                base: pair.replace('USDC', ''),
                quote: V1_QUOTE,
                rate,
            });
        }

        await this.saveV1HistoryData(result);
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
                    base: this.ammToPair.get(String(rawData.amm)).replace('USDC', ''),
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
