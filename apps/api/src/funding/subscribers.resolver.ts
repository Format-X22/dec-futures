import { Args, Query, Resolver } from '@nestjs/graphql';
import { SubscribeResult } from '@app/shared/subscribers.schema';
import { FundingService } from './funding.service';
import { SubscribeGroupArgs } from './subscribers.args';

@Resolver((): typeof SubscribeResult => SubscribeResult)
export class SubscribersResolver {
    constructor(private readonly fundingService: FundingService) {}

    @Query((): typeof SubscribeResult => SubscribeResult)
    async subscribe(@Args() args: SubscribeGroupArgs): Promise<SubscribeResult> {
        return this.fundingService.subscribe(args);
    }
}
