import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(ApiModule);
    const configService: ConfigService = app.get(ConfigService);
    const port = Number(configService.get<string>('F_API_PORT'));

    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
        }),
    );

    await app.listen(port);
}
bootstrap().catch((error) => console.error(error));
