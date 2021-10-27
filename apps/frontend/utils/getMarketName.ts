import { MARKETS } from 'dtos/Markets';

const marketNames = {
    [MARKETS.DYDX]: 'dYdX',
    [MARKETS.PERP]: 'Perpetual Protocol',
};

export const getMarketName = (marketKey: MARKETS) => {
    return marketNames[marketKey];
};
