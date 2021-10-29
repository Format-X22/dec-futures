import React, { FC, useState } from 'react';

import { Text } from '@/components/Text/Text';
import PairsTableRow from '@/components/PairsTableRow/PairsTableRow';
import PairsTableInfoRows from '@/components/PairsTableInfoRows/PairsTableInfoRows';
import { Funding } from 'dtos/Funding';
import { MARKETS } from 'dtos/Markets';

import styles from './AllPairsSection.module.scss';

interface IProps {
    pair: string;
    index: number;
    funding: Funding;
}

const Row: FC<IProps> = ({ pair, index, funding }) => {
    const [openInfo, setOpenInfo] = useState(false);
    const columns = [
        funding.rates[MARKETS.DYDX],
        funding.rates[MARKETS.DYDX] * 8,
        funding.rates[MARKETS.DYDX] * 24 * 365,
        funding.rates[MARKETS.PERP],
        funding.rates[MARKETS.PERP] * 8,
        funding.rates[MARKETS.PERP] * 24 * 365,
    ];
    return (
        <>
            <PairsTableRow
                variant='all-pairs'
                className={openInfo ? styles['opened'] : ''}
                onClick={() => setOpenInfo(!openInfo)}
            >
                <td>
                    <button type='button'>
                        <img src='/futures/public/caret.svg' alt='caret' />
                        <Text tagStyle='p' color='grey'>
                            {pair}
                        </Text>
                    </button>
                </td>
                {columns.map((value, j) => (
                    <td
                        key={`all-pairs-${pair}-${index}-${j}`}
                        className={j % 3 === 0 ? styles[`left-${j < 3 ? 'blue' : 'green'}-border`] : ''}
                    >
                        <Text tagStyle='p' color='grey'>
                            {value ? `${value.toFixed(4)}%` : '-'}
                        </Text>
                    </td>
                ))}
            </PairsTableRow>
            {openInfo && <PairsTableInfoRows pair={pair} />}
        </>
    );
};

export default Row;
