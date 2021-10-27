import { createContext } from 'react';
import { Funding } from 'dtos/Funding';
import { MARKETS } from 'dtos/Markets';

interface IAppContextProps {
    allFundings: { [pair: string]: Funding };
    trackingFunding: Funding;
    setTrackingFunding: (v: Funding) => void;
    selectedFunding: Funding;
}

export const defaultFunding = {
    base: '',
    quote: '',
    diff: 0,
    rates: {},
};

export const defaultFundingRate = {
    marketKey: MARKETS.DYDX,
    rate: 0,
};

export const AppContext = createContext<IAppContextProps>({
    allFundings: {},
    trackingFunding: defaultFunding,
    setTrackingFunding: () => undefined,
    selectedFunding: defaultFunding,
});
