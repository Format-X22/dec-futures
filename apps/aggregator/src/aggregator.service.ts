import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import * as sleep from 'sleep-promise';
import { DydxService } from './market/dydx.service';
import { PerpService } from './market/perp.service';
import { AbstractMarketService } from './market/abstract-market.service';

const DEFAULT_INTERVAL_DELAY = 1000;

@Injectable()
export class AggregatorService implements OnModuleInit, OnModuleDestroy {
    private readonly logger: Logger = new Logger(AggregatorService.name);
    private isDestroyed = false;

    constructor(private dxDyService: DydxService, private perpService: PerpService) {}

    async onModuleInit(): Promise<void> {
        [this.dxDyService, this.perpService].forEach((service: AbstractMarketService) => this.startSyncLoop(service));
        this.logger.log('Funding sync started');
    }

    onModuleDestroy(): void {
        this.isDestroyed = true;
    }

    private startSyncLoop(service: AbstractMarketService, intervalDelay: number = DEFAULT_INTERVAL_DELAY): void {
        (async () => {
            while (!this.isDestroyed) {
                try {
                    await service.iteration();
                    await sleep(intervalDelay);
                } catch (error) {
                    this.logger.error(`Sync error - ${service.name} - ${error}`, error?.stack);
                    await sleep(intervalDelay);
                }
            }
        })().catch(/* do noting */);
    }
}
