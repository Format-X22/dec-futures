import { MARKETS } from 'dtos/Markets';

const marketLinks = {
    [MARKETS.DYDX]: 'https://dydx.exchange',
    [MARKETS.PERP]: 'https://referral.perp.exchange/?code=DeCommas',
};

export const getMarketLink = (marketKey: MARKETS) => {
    return marketLinks[marketKey] || '';
};
