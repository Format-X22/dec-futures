import { Module } from '@nestjs/common';
import { AggregatorService } from './aggregator.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';

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
    providers: [AggregatorService],
})
export class AggregatorModule {}
