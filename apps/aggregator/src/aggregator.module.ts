import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { DydxService } from './market/dydx.service';
import { PerpService } from './market/perp.service';
import { Funding, FundingSchema } from '@app/shared/funding.schema';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [
        HttpModule,
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
        MongooseModule.forFeature([{ name: Funding.name, schema: FundingSchema }]),
    ],
    controllers: [],
    providers: [AggregatorService, DydxService, PerpService],
})
export class AggregatorModule {}
