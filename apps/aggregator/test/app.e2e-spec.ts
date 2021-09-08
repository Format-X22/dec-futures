import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AggregatorModule } from '../src/Aggregator.module';

describe('AggregatorController (e2e)', () => {
    let app: INestApplication;

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AggregatorModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    it('Init is ok', () => {
        return;
    });
});
