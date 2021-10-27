import React, { useContext, useRef, useState } from 'react';

import { useOnClickOutside } from 'hooks/useClickOutside';
import { Text } from '@/components/Text/Text';
import PairsTableWrapper from '@/components/PairsTableWrapper/PairsTableWrapper';
import PairsTableHead from '@/components/PairsTableHead/PairsTableHead';
import PairsTableRow from '@/components/PairsTableRow/PairsTableRow';
import PairsTableInfoRows from '@/components/PairsTableInfoRows/PairsTableInfoRows';
import { AppContext } from '@/components/AppContext/AppContext';
import { MARKETS } from 'dtos/Markets';

import styles from './SelectedPair.module.scss';
import CustomLink from '@/components/CustomLink/CustomLink';

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

    const [showTooltip, setShowTooltip] = useState(false);
    const ref = useRef<HTMLButtonElement>(null);
    useOnClickOutside(ref, () => setShowTooltip(false));
    return (
        <section className={styles['selected-pair']}>
            <div className={styles['header']}>
                <Text tagStyle='h5' tag='p'>
                    Pair with the biggest funding rate difference{' '}
                    <button type='button' onClick={() => setShowTooltip(!showTooltip)} ref={ref}>
                        <img src='/futures/public/info.svg' alt='info' />
                        {showTooltip && (
                            <div className={styles['tooltip']}>
                                <div className={styles['arrow']} />
                                <Text tagStyle='p'>
                                    If the funding rate difference is big enough, it would be considered an arbitrage
                                    opportunity between two DEXs
                                </Text>
                                <CustomLink href=''>Learn more about funding rates</CustomLink>
                            </div>
                        )}
                    </button>
                </Text>
                <Text tagStyle='h2'>
                    <img src={`/futures/public/coin/${base.toLowerCase()}.svg`} />
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
