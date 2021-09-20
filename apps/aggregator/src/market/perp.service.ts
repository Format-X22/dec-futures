import { Injectable } from '@nestjs/common';
import { EMarketKey } from '@app/shared/entity.enum';
import { AbstractMarketService } from './abstract-market.service';

@Injectable()
export class PerpService extends AbstractMarketService {
    public name = EMarketKey.PERP;

    constructor(...args: ConstructorParameters<typeof AbstractMarketService>) {
        super(...args);

        // TODO -
    }

    async iteration(): Promise<void> {
        // TODO -
    }
}
