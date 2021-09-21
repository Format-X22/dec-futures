import { Injectable } from '@nestjs/common';
import { EMarketKey } from '@app/shared/entity.enum';
import { DydxClient } from '@dydxprotocol/v3-client';
import * as moment from 'moment';
import { AbstractMarketService } from './abstract-market.service';
import { Funding } from '@app/shared/funding.schema';
import { DydxMarket } from '@dydxprotocol/starkex-lib';
import * as sleep from 'sleep-promise';

// Fix Web3 types definition error in commonjs mode
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

type THistory = Array<{
    rate: number;
    payDate: Date;
}>;

const API = 'https://api.dydx.exchange';
const API_CALL_DELAY = 1000;

@Injectable()
export class DxDyService extends AbstractMarketService {
    public name = EMarketKey.DXDY;
    private web3 = new Web3();
    private client: DydxClient;

    constructor(...args: ConstructorParameters<typeof AbstractMarketService>) {
        super(...args);

        this.client = new DydxClient(API, { web3: this.web3 });
    }

    async iteration(): Promise<void> {
        let lastDate: Date | null = await this.getLastFundingDate();

        if (lastDate === null) {
            lastDate = this.makeEmptyHistoryDeepDate();
        }

        for (const pair of await this.getPairs()) {
            await this.syncToLastKnownDate(pair, lastDate);
            await sleep(API_CALL_DELAY);
        }
    }

    private async getLastFundingDate(): Promise<Date | null> {
        const last: Funding | null = await this.fundingModel.findOne(
            { marketKey: this.name },
            { payDate: 1 },
            { sort: { payDate: -1 } },
        );

        return last?.payDate || null;
    }

    private makeEmptyHistoryDeepDate(): Date {
        return moment().subtract(1, 'month').toDate();
    }

    private async syncToLastKnownDate(pair: DydxMarket, date: Date): Promise<void> {
        const history: THistory = [];
        let lastDate: Date | null = null;

        const currentMarketData = await this.client.public.getMarkets(pair);
        const pairData = currentMarketData.markets[pair];

        history.push({
            rate: Number(pairData.nextFundingRate),
            payDate: new Date(pairData.nextFundingAt),
        });

        while (true) {
            const currentHistory = await this.getFundingHistory(pair, lastDate);

            if (!currentHistory.length) {
                await this.saveHistory(pair, history);
                break;
            }

            const isHistoryContainsNotOnlyNextFundingData = history.length > 1;

            if (isHistoryContainsNotOnlyNextFundingData) {
                history.pop();
            }

            history.push(...currentHistory);
            lastDate = currentHistory[currentHistory.length - 1].payDate;

            if (lastDate <= date) {
                await this.saveHistory(pair, history);
                break;
            }

            await sleep(API_CALL_DELAY);
        }
    }

    private async saveHistory(pair: DydxMarket, history: THistory): Promise<void> {
        for (const item of history) {
            const [base, quote] = pair.split('-');

            await this.fundingModel.updateOne(
                {
                    payDate: item.payDate,
                },
                {
                    $set: {
                        rate: item.rate,
                        payDate: item.payDate,
                        marketKey: EMarketKey.DXDY,
                        base,
                        quote,
                    },
                },
                {
                    upsert: true,
                },
            );
        }
    }

    private async getPairs(): Promise<Array<DydxMarket>> {
        const response = await this.client.public.getMarkets();

        return Object.keys(response.markets) as Array<DydxMarket>;
    }

    private async getFundingHistory(pair: DydxMarket, beforeDate: Date | null): Promise<THistory> {
        const options: Parameters<DydxClient['public']['getHistoricalFunding']>[0] = { market: pair };

        if (beforeDate) {
            options.effectiveBeforeOrAt = beforeDate.toISOString();
        }

        const result = await this.client.public.getHistoricalFunding(options);

        return result.historicalFunding.map((item) => ({
            rate: Number(item.rate),
            payDate: new Date(item.effectiveAt),
        }));
    }
}
