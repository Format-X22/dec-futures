import { EMarketKey } from '@app/shared/entity.enum';

export enum ESide {
    LONG = 'LONG',
    SHORT = 'SHORT',
}

export type TPairData = {
    base: string;
    quote: string;
};

export type TPaginationArgs = {
    skip: number;
    limit: number;
};

export type TPairAndPaginationArgs = TPairData & TPaginationArgs;

export type TTradeBasicInfo = TPairData & {
    market: EMarketKey;
    side: ESide;
};

export type TPosition = TTradeBasicInfo & {
    size: number;
    enter: number;
    liquidation: number;
    realizedPnl: number;
    unrealizedPnl: number;
    isActive: boolean;
    isLiquidated: boolean;
    openDate: Date;
    closeDate?: Date;
};

export enum EOrderType {
    LIMIT = 'LIMIT',
    MARKET = 'MARKET',
}

export enum EOrderStatus {
    FILLED = 'FILLED',
    PARTIAL_FILLED = 'PARTIAL_FILLED',
    CANCELED = 'CANCELED',
    EXPIRED = 'EXPIRED',
}

export type TOrder = TTradeBasicInfo & {
    type: EOrderType;
    price?: number;
    averagePrice?: number;
    size: number;
    openDate: Date;
    closeDate?: Date;
    status: EOrderStatus;
};

export type TTrade = TTradeBasicInfo & {
    price: number;
    amount: number;
    date: Date;
};

export abstract class Abstract {
    public abstract getCurrentPosition({ base, quote }: TPairData): Promise<TPosition | null>;
    public abstract getMarkPrice({ base, quote }: TPairData): Promise<number>;
    public abstract getIndexPrice({ base, quote }: TPairData): Promise<number>;
    public abstract getOrderHistory({ base, quote, skip, limit }: TPairAndPaginationArgs): Promise<Array<TOrder>>;
    public abstract getTradeHistory({ base, quote, skip, limit }: TPairAndPaginationArgs): Promise<Array<TTrade>>;
    public abstract getPositionHistory({ base, quote, skip, limit }: TPairAndPaginationArgs): Promise<Array<TPosition>>;
}
