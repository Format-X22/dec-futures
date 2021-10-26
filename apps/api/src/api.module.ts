import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { FundingResolver } from './funding/funding.resolver';
import { FundingService } from './funding/funding.service';
import { Funding, FundingSchema } from '@app/shared/funding.schema';
import { FundingController } from './funding/funding.controller';
import { ViewModule } from '../../api/src/view/view.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            cache: true,
        }),
        ServeStaticModule.forRoot({
            rootPath: join(process.cwd(), './apps/frontend/public'),
            serveRoot: '/futures/public',
        }),
        MongooseModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService): MongooseModuleOptions => ({
                uri: configService.get<string>('F_MONGO_CONNECT'),
            }),
            inject: [ConfigService],
        }),
        ViewModule,
        MongooseModule.forFeature([{ name: Funding.name, schema: FundingSchema }]),
        GraphQLModule.forRoot({
            installSubscriptionHandlers: true,
            autoSchemaFile: true,
            playground: true,
            introspection: true,
            path: '/futures/api',
        }),
    ],
    controllers: [FundingController],
    providers: [FundingService, FundingResolver],
})
export class ApiModule {}
