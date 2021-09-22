import { Args, ArgsType, Field, Query, Resolver } from '@nestjs/graphql';
import { Funding, FundingList } from '@app/shared/funding.schema';
import { EMarketKey } from '@app/shared/entity.enum';
import { FundingService } from './funding.service';
import { IsEnum } from 'class-validator';
import { Paginated, PaginationArgs } from '@app/shared/list.dto';

@ArgsType()
export class MarketFilterArgs {
    @Field((): typeof EMarketKey => EMarketKey, { nullable: true })
    @IsEnum(EMarketKey)
    marketKey: EMarketKey;
}

@ArgsType()
export class HistoryArgs extends PaginationArgs {
    @Field((): typeof EMarketKey => EMarketKey, { nullable: true })
    @IsEnum(EMarketKey)
    marketKey: EMarketKey;
}

@Resolver()
export class FundingResolver {
    constructor(private fundingService: FundingService) {}

    @Query((): typeof Funding => Funding, { nullable: true })
    async currentFundingFor(@Args() args: MarketFilterArgs): Promise<Funding | null> {
        return this.fundingService.getCurrentFundingForMarket(args);
    }

    @Query((): Array<typeof Funding> => [Funding])
    async currentFundingForAll(): Promise<Array<Funding>> {
        return this.fundingService.getCurrentFundingForAllMarkets();
    }

    @Query((): typeof FundingList => FundingList)
    async fundingHistory(@Args() args: HistoryArgs): Promise<Paginated<Funding>> {
        return this.fundingService.getFundingHistoryForMarket(args);
    }
}
