import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { EMarketKey } from '@app/shared/entity.enum';
import { Field, ObjectType } from '@nestjs/graphql';
import { makePaginated } from '@app/shared/list.dto';

@ObjectType()
@Schema({ versionKey: false })
export class Funding {
    _id?: mongoose.Schema.Types.ObjectId | string;

    @Field((): typeof EMarketKey => EMarketKey)
    @Prop({ enum: EMarketKey, type: String })
    marketKey: EMarketKey;

    @Field()
    @Prop()
    payDate: Date;

    @Field()
    @Prop()
    base: string;

    @Field()
    @Prop()
    quote: string;

    @Field()
    @Prop()
    rate: number;
}

export type FundingDocument = Funding & mongoose.Document;
export const FundingSchema: mongoose.Schema<FundingDocument> = SchemaFactory.createForClass<Funding, FundingDocument>(
    Funding,
);

FundingSchema.index({ payDate: -1 });
FundingSchema.index({ base: 1, quote: 1 });

@ObjectType()
export class FundingList extends makePaginated<Funding>(Funding) {}

@ObjectType()
export class FundingAverage {
    @Field((): typeof EMarketKey => EMarketKey)
    marketKey: EMarketKey;

    @Field()
    base: string;

    @Field()
    quote: string;

    @Field()
    D1: number;

    @Field()
    D7: number;

    @Field()
    M1: number;

    @Field()
    M3: number;
}
