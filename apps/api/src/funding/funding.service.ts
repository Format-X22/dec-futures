import { Injectable } from '@nestjs/common';
import { Funding, FundingAverage, FundingDocument } from '@app/shared/funding.schema';
import { EMarketKey } from '@app/shared/entity.enum';
import { HistoryArgs, MarketFilterArgs, PairFilterArgs } from './funding.resolver';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Paginated } from '@app/shared/list.dto';
import * as moment from 'moment';

@Injectable()
export class FundingService {
    constructor(@InjectModel(Funding.name) private fundingModel: Model<FundingDocument>) {}

    async getCurrentForMarket({ marketKey }: MarketFilterArgs): Promise<Array<Funding | null>> {
        const latestFunding = await this.fundingModel.findOne({ marketKey }, null, { sort: { payDate: -1 } });
        return this.fundingModel.find({ marketKey, payDate: latestFunding.payDate }, null);
    }

    async getCurrentForAllMarkets(): Promise<Array<Funding>> {
        let result: Array<Funding> = [];

        for (const marketKey of Object.values(EMarketKey)) {
            const data: Array<Funding | null> = await this.getCurrentForMarket({ marketKey });

            if (data) {
                result = [...result, ...data];
            }
        }

        return result;
    }

    async getHistoryForMarket({ marketKey, offset, limit }: HistoryArgs): Promise<Paginated<Funding>> {
        const dbQuery = { marketKey };
        const dbSort = { payDate: -1 };
        const data: Array<Funding> = await this.fundingModel.find(dbQuery, null, {
            sort: dbSort,
            skip: offset,
            limit: limit,
        });
        const total: number = await this.fundingModel.countDocuments(dbQuery);
        const pagination: Paginated<Funding>['pagination'] = {
            offset,
            limit,
            total,
        };

        return { data, pagination };
    }

    async getAverage({ base, quote }: PairFilterArgs): Promise<Array<FundingAverage>> {
        return [
            await this.getAverageFor({ base, quote, marketKey: EMarketKey.DYDX }),
            await this.getAverageFor({ base, quote, marketKey: EMarketKey.PERP }),
        ];
    }

    private async getAverageFor({
        base,
        quote,
        marketKey,
    }: PairFilterArgs & { marketKey: EMarketKey }): Promise<FundingAverage> {
        const calc = this.makeAverageCalculator(base, quote, marketKey);

        const D1 = await calc(1);
        let D7 = await calc(7);
        let M1 = 0;
        let M3 = 0;

        // Data in db may be incomplete, re-calc is the right way
        if (D1 === D7) {
            D7 = 0;
        } else {
            M1 = await calc(30);

            if (D7 === M1) {
                M1 = 0;
            } else {
                M3 = await calc(90);

                if (M1 === M3) {
                    M3 = 0;
                }
            }
        }

        return { marketKey, base, quote, D1, D7, M1, M3 };
    }

    private makeAverageCalculator(base: string, quote: string, marketKey: EMarketKey) {
        return async (daysAgo: number): Promise<number> => {
            const payDate = { $gt: moment().subtract(daysAgo, 'day').toDate() };
            const filter: FilterQuery<FundingDocument> = { base, quote, marketKey, payDate };
            const data = await this.fundingModel.find(filter, { rate: true });
            const sum = data.reduce((sum, { rate }) => sum + rate, 0) / data.length;

            return sum || 0;
        };
    }
}
