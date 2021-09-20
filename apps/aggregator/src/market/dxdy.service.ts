import { Injectable } from '@nestjs/common';
import { AbstractMarket } from '../aggregator.service';
import { EMarketKey } from '@app/shared/entity.enum';

@Injectable()
export class DxDyService implements AbstractMarket {
    name = EMarketKey.DXDY;

    async iteration(): Promise<void> {
        // TODO -
    }
}
