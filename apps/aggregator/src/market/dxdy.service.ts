import { Injectable } from '@nestjs/common';
import { EMarketKey } from '@app/shared/entity.enum';
import * as sleep from 'sleep-promise';
import { DydxClient } from '@dydxprotocol/v3-client';
import * as moment from 'moment';
import { AbstractMarketService } from './abstract-market.service';

// Fix Web3 types definition error in commonjs mode
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

type TRawHistoryResponse = Array<{
    rate: string;
    effectiveAt: string;
}>;

type THistory = Array<{
    rate: number;
    payDate: Date;
}>;

const API = 'https://api.dydx.exchange';

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

        await this.syncToLastKnownDate(lastDate);
    }

    private async getLastFundingDate(): Promise<Date | null> {
        // TODO -
        return;
    }

    private makeEmptyHistoryDeepDate(): Date {
        return moment().subtract(1, 'month').toDate();
    }

    private async syncToLastKnownDate(date: Date): Promise<void> {
        for (const pair of await this.getPairs()) {
            // TODO Loop with sleep
            // TODO Save
        }
    }

    private async getPairs(): Promise<Array<string>> {
        // TODO -
        return [];
    }

    private async getFundingHistory(pair: string, beforeDate: Date | null): Promise<THistory> {
        // TODO -
        return;
    }
}
