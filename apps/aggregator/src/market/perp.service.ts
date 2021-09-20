import { Injectable } from '@nestjs/common';
import { AbstractMarket } from '../aggregator.service';
import { EMarketKey } from '@app/shared/entity.enum';

@Injectable()
export class PerpService implements AbstractMarket {
    name = EMarketKey.PERP;

    async iteration(): Promise<void> {
        // TODO -
    }
}
