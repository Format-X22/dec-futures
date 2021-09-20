import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { EMarketKey } from '@app/shared/entity.enum';
import * as sleep from 'sleep-promise';
import { DxDyService } from './market/dxdy.service';
import { PerpService } from './market/perp.service';

export interface AbstractMarket {
    iteration(): Promise<void>;
    name: EMarketKey;
}

const DEFAULT_INTERVAL_DELAY = 1000;

@Injectable()
export class AggregatorService implements OnModuleInit, OnModuleDestroy {
    private readonly logger: Logger = new Logger(AggregatorService.name);
    private isDestroyed = false;

    constructor(private dxDyService: DxDyService, private perpService: PerpService) {}

    async onModuleInit(): Promise<void> {
        [this.dxDyService, this.perpService].forEach((service: AbstractMarket) => this.startSyncLoop(service));
        this.logger.log('Funding sync started');
    }

    onModuleDestroy(): void {
        this.isDestroyed = true;
    }

    startSyncLoop(service: AbstractMarket, intervalDelay: number = DEFAULT_INTERVAL_DELAY): void {
        (async () => {
            while (!this.isDestroyed) {
                try {
                    await service.iteration();
                    await sleep(intervalDelay);
                } catch (error) {
                    this.logger.error(`Sync error - ${service.name} - ${error}`);
                }
            }
        })().catch(/* do noting */);
    }
}
