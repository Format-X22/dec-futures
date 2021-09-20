import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EMarketKey } from '@app/shared/entity.enum';

@Schema({ versionKey: false })
export class Funding {
    @Prop({ enum: EMarketKey, type: String })
    marketKey: EMarketKey;

    @Prop()
    payDate: Date;

    @Prop()
    base: string;

    @Prop()
    quote: string;

    @Prop()
    rate: number;
}

export type FundingDocument = Funding & mongoose.Document;
export const FundingSchema: mongoose.Schema<FundingDocument> = SchemaFactory.createForClass<Funding, FundingDocument>(
    Funding,
);
