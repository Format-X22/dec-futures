import { FC, ReactNode, useMemo } from 'react';
import { gql, useQuery } from '@apollo/client';
import { AppContext } from './AppContext';
import { Funding } from 'dtos/Funding';

const GET_CURRENT_FUNDINGS = gql`
    {
        currentFundingForAll {
            marketKey
            payDate
            base
            quote
            rate
        }
    }
`;

interface IAppProviderProps {
    children: ReactNode;
}

export const AppProvider: FC<IAppProviderProps> = ({ children }) => {
    const { data: dataFundings } = useQuery(GET_CURRENT_FUNDINGS);

    const { map, lowestFundingRate, biggestFundingRate, selectedFunding } = useMemo(() => {
        const map: { [pair: string]: Funding } = {};
        let lowestFundingRate = {
            marketKey: '',
            rate: 0,
        };
        let biggestFundingRate = {
            marketKey: '',
            rate: 0,
        };
        let selectedFunding = {
            base: '',
            quote: '',
            diff: 0,
            rates: {},
        };
        if (dataFundings) {
            dataFundings.currentFundingForAll.map(({ base, quote, rate, marketKey }) => {
                const pair = `${base}/${quote}`;
                lowestFundingRate =
                    lowestFundingRate.rate > rate
                        ? {
                              marketKey,
                              rate,
                          }
                        : lowestFundingRate;
                biggestFundingRate =
                    biggestFundingRate.rate < rate
                        ? {
                              marketKey,
                              rate,
                          }
                        : biggestFundingRate;
                if (!map[pair]) {
                    map[pair] = {
                        base,
                        quote,
                        diff: 0,
                        rates: {
                            [marketKey]: rate,
                        },
                    };
                } else {
                    map[pair] = {
                        ...map[pair],
                        rates: {
                            ...map[pair].rates,
                            [marketKey]: rate,
                        },
                    };
                }
            });
            Object.keys(map).map((pair) => {
                const pairRates = Object.keys(map[pair].rates).map((mk) => map[pair].rates[mk]);
                const biggestPairRate = Math.max(...pairRates);
                const lowestPairRate = Math.min(...pairRates);
                map[pair].diff = biggestPairRate - lowestPairRate;

                selectedFunding = selectedFunding.diff < map[pair].diff ? map[pair] : selectedFunding;
            });
        }
        return { map, lowestFundingRate, biggestFundingRate, selectedFunding };
    }, [dataFundings]);
    return (
        <AppContext.Provider value={{ allFundings: map, lowestFundingRate, biggestFundingRate, selectedFunding }}>
            {children}
        </AppContext.Provider>
    );
};
