import { createContext } from 'react';
import { Funding } from 'dtos/Funding';

interface IAppContextProps {
    allFundings: { [pair: string]: Funding };
    selectedFunding: Funding;
    lowestFundingRate: {
        marketKey: string;
        rate: number;
    };
    biggestFundingRate: {
        marketKey: string;
        rate: number;
    };
}

export const AppContext = createContext<IAppContextProps>({
    allFundings: {},
    selectedFunding: {
        base: '',
        quote: '',
        diff: 0,
        rates: {},
    },
    lowestFundingRate: {
        marketKey: 'dydx',
        rate: 0,
    },
    biggestFundingRate: {
        marketKey: 'dydx',
        rate: 0,
    },
});
