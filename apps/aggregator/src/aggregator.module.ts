import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { DxDyService } from './market/dxdy.service';
import { PerpService } from './market/perp.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): MongooseModuleOptions => ({
                uri: configService.get<string>('F_MONGO_CONNECT'),
            }),
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [AggregatorService, DxDyService, PerpService],
})
export class AggregatorModule {}
