import { Test, TestingModule } from '@nestjs/testing';
import { FundingResolver } from './funding.resolver';

describe('FundingResolver', () => {
    let resolver: FundingResolver;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [FundingResolver],
        }).compile();

        resolver = module.get<FundingResolver>(FundingResolver);
    });

    it('should be defined', () => {
        expect(resolver).toBeDefined();
    });
});
