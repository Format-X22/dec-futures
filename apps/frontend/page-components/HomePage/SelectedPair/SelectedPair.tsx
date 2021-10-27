import React, { useContext } from 'react';
import { Text } from '@/components/Text/Text';
import PairsTableWrapper from '@/components/PairsTableWrapper/PairsTableWrapper';
import PairsTableHead from '@/components/PairsTableHead/PairsTableHead';
import PairsTableRow from '@/components/PairsTableRow/PairsTableRow';
import PairsTableInfoRows from '@/components/PairsTableInfoRows/PairsTableInfoRows';
import { AppContext } from '@/components/AppContext/AppContext';
import { MARKETS } from 'dtos/Markets';

import styles from './SelectedPair.module.scss';

const SelectedPair = () => {
    const { selectedFunding } = useContext(AppContext);
    const { base, quote, rates } = selectedFunding;
    const columns = [
        rates[MARKETS.DYDX],
        rates[MARKETS.DYDX] * 8,
        rates[MARKETS.DYDX] * 365,
        rates[MARKETS.PERP],
        rates[MARKETS.PERP] * 8,
        rates[MARKETS.PERP] * 365,
    ];
    return (
        <section className={styles['selected-pair']}>
            <div className={styles['header']}>
                <Text tagStyle='h5' tag='p'>
                    Pair with the biggest funding rate difference <img src='/futures/public/info.svg' alt='info' />
                </Text>
                <Text tagStyle='h2'>
                    <img src={`/futures/public/coin/${base}.svg`} />
                    <span>{base}</span>
                    <span>/{quote}</span>
                </Text>
            </div>
            <PairsTableWrapper>
                <PairsTableHead />
                <tbody>
                    <PairsTableRow>
                        <td>
                            <Text tagStyle='p' color='grey'>
                                Momentary
                            </Text>
                        </td>
                        {columns.map((value, j) => (
                            <td
                                key={`selected-funding-${base}/${quote}-${j}`}
                                className={j % 3 === 0 ? styles[`left-${j < 3 ? 'blue' : 'green'}-border`] : ''}
                            >
                                <Text tagStyle='p' color='grey'>
                                    {value ? `${value.toFixed(4)}%` : '-'}
                                </Text>
                            </td>
                        ))}
                    </PairsTableRow>
                    <PairsTableInfoRows pair='BTC/USDC' />
                </tbody>
            </PairsTableWrapper>
        </section>
    );
};

export default SelectedPair;
