import { EMarketKey } from '@app/shared/entity.enum';

export enum ESide {
    LONG = 'LONG',
    SHORT = 'SHORT',
}

export type TTradeBasicInfo = {
    market: EMarketKey;
    base: string;
    quote: string;
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

const DEFAULT_SKIP = 0;
const DEFAULT_LIMIT = 20;

export class Stock {
    constructor(market: EMarketKey, apiKey?: string) {
        // TODO -
    }

    async getPosition(): Promise<TPosition> {
        // TODO -
        return;
    }

    async getPositionHistory(skip = DEFAULT_SKIP, limit = DEFAULT_LIMIT): Promise<Array<TPosition>> {
        // TODO -
        return;
    }

    async getMarkPrice(): Promise<number> {
        // TODO -
        return;
    }

    async getIndexPrice(): Promise<number> {
        // TODO -
        return;
    }

    async getOrderHistory(skip = DEFAULT_SKIP, limit = DEFAULT_LIMIT): Promise<Array<TOrder>> {
        // TODO -
        return;
    }

    async getTradeHistory(skip = DEFAULT_SKIP, limit = DEFAULT_LIMIT): Promise<Array<TTrade>> {
        // TODO -
        return;
    }
}
