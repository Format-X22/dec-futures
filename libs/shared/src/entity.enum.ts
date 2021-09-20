import { registerEnumType } from '@nestjs/graphql';

export enum EMarketKey {
    DXDY = 'DXDY',
    PERP = 'PERP',
}
registerEnumType(EMarketKey, { name: 'MarketKey' });
