import { Injectable } from '@nestjs/common';
import { Funding, FundingDocument } from '@app/shared/funding.schema';
import { EMarketKey } from '@app/shared/entity.enum';
import { HistoryArgs, MarketFilterArgs } from './funding.resolver';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Paginated } from '@app/shared/list.dto';

@Injectable()
export class FundingService {
    constructor(@InjectModel(Funding.name) private fundingModel: Model<FundingDocument>) {}

    async getCurrentFundingForMarket({ marketKey }: MarketFilterArgs): Promise<Funding | null> {
        return this.fundingModel.findOne({ marketKey }, null, { sort: { payDate: -1 } });
    }

    async getCurrentFundingForAllMarkets(): Promise<Array<Funding>> {
        const result: Array<Funding> = [];

        for (const marketKey of Object.values(EMarketKey)) {
            const data: Funding | null = await this.getCurrentFundingForMarket({ marketKey });

            if (data) {
                result.push(data);
            }
        }

        return result;
    }

    async getFundingHistoryForMarket({ marketKey, offset, limit }: HistoryArgs): Promise<Paginated<Funding>> {
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
}
