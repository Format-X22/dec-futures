import { NestFactory } from '@nestjs/core';
import { AggregatorModule } from './aggregator.module';

async function bootstrap() {
    await NestFactory.createApplicationContext(AggregatorModule);
}
bootstrap().catch((error) => console.error(error));
