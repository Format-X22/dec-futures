import React, { FC, useMemo } from 'react';
import cn from 'classnames';
import { gql, useQuery } from '@apollo/client';

import { Text } from '@/components/Text/Text';
import PairsTableRow from '@/components/PairsTableRow/PairsTableRow';

import styles from './PairsTableInfoRows.module.scss';

interface IProps {
    pair: string;
}

const GET_AVERAGE = gql`
    query getAverage($base: String!, $quote: String!) {
        fundingAverage(base: $base, quote: $quote) {
            marketKey
            D1
            D7
            M1
            M3
        }
    }
`;

const titles = { D1: 'Last 24 h', D7: 'Last 7 days', M1: 'Last month', M3: 'Last 3 months' };

const PairsTableInfoRows: FC<IProps> = ({ pair }) => {
    const [base, quote] = pair.split('/');
    const { data: dataAverage } = useQuery(GET_AVERAGE, {
        variables: { base, quote },
    });

    const rows = useMemo(() => {
        if (!dataAverage) {
            return [];
        }
        const averageByMarket = {
            dydx: dataAverage.fundingAverage.find(({ marketKey }) => marketKey === 'DYDX'),
            perp: dataAverage.fundingAverage.find(({ marketKey }) => marketKey === 'PERP'),
        };
        return Object.keys(titles).map((prop) => {
            const dydxValue = averageByMarket.dydx[prop];
            const perpValue = averageByMarket.perp[prop];
            return {
                title: titles[prop],
                columns: [dydxValue, dydxValue * 8, dydxValue * 365, perpValue, perpValue * 8, perpValue * 365],
            };
        });
    }, [dataAverage]);
    return (
        <>
            <PairsTableRow className={styles['pairs-table-info-rows']}>
                <td>
                    <Text tagStyle='p' color='grey' fontWeight={600}>
                        Average
                    </Text>
                </td>
                <td className={styles['left-blue-border']}></td>
                <td></td>
                <td></td>
                <td className={styles['left-green-border']}></td>
                <td></td>
                <td></td>
            </PairsTableRow>
            {rows.map(({ title, columns }, index) => (
                <PairsTableRow
                    key={`average-${pair}-${index}`}
                    className={cn(
                        styles['pairs-table-info-rows'],
                        rows.length === index + 1 ? styles['border-bottom'] : '',
                    )}
                >
                    <td>
                        <Text tagStyle='p' color='grey'>
                            {title}
                        </Text>
                    </td>
                    {columns.map((value, j) => (
                        <td
                            key={`average-${pair}-${index}-${j}`}
                            className={
                                j === 0 ? styles['left-blue-border'] : j === 3 ? styles['left-green-border'] : ''
                            }
                        >
                            <Text tagStyle='p' color='grey'>
                                {value ? `${value.toFixed(4)}%` : '-'}
                            </Text>
                        </td>
                    ))}
                </PairsTableRow>
            ))}
        </>
    );
};

export default PairsTableInfoRows;
