import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { AppContext, defaultFunding } from './AppContext';
import { Funding } from 'dtos/Funding';
import { gql, useQuery } from '@apollo/client';

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
    initialDataFundings: any;
    children: ReactNode;
}

export const AppProvider: FC<IAppProviderProps> = ({ initialDataFundings, children }) => {
    const [trackingFunding, setTrackingFunding] = useState(defaultFunding);

    const { data: dataFundingsRefetched } = useQuery(GET_CURRENT_FUNDINGS, {
        pollInterval: 5000,
    });
    const dataFundings = dataFundingsRefetched || initialDataFundings;

    const { map, selectedFunding } = useMemo(() => {
        const map: { [pair: string]: Funding } = {};
        let selectedFunding = defaultFunding;
        if (dataFundings) {
            dataFundings.currentFundingForAll.map(({ base, quote, rate, marketKey }) => {
                const pair = `${base}/${quote}`;
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
                    map[pair].rates[marketKey] = rate;
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
        return { map, selectedFunding };
    }, [dataFundings]);

    useEffect(() => {
        const firstFunding = map[Object.keys(map)[0]];
        if (!trackingFunding.base && firstFunding) {
            setTrackingFunding(firstFunding);
        }
    }, [map]);

    return (
        <AppContext.Provider
            value={{
                allFundings: map,
                selectedFunding,
                trackingFunding,
                setTrackingFunding,
            }}
        >
            {children}
        </AppContext.Provider>
    );
};
