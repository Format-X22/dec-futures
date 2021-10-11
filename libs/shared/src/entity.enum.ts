import { registerEnumType } from '@nestjs/graphql';

export enum EMarketKey {
    DYDX = 'DYDX',
    PERP = 'PERP',
}
registerEnumType(EMarketKey, { name: 'MarketKey' });
