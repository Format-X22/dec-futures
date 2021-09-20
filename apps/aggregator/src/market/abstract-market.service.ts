import { Injectable } from '@nestjs/common';
import { EMarketKey } from '@app/shared/entity.enum';
import { InjectModel } from '@nestjs/mongoose';
import { Funding, FundingDocument } from '@app/shared/funding.schema';
import { Model } from 'mongoose';

@Injectable()
export abstract class AbstractMarketService {
    constructor(@InjectModel(Funding.name) protected fundingModel: Model<FundingDocument>) {}

    abstract iteration(): Promise<void>;
    name: EMarketKey;
}
