import React, { FC, useState } from 'react';
import { Text } from '@/components/Text/Text';
import PairsTableRow from '@/components/PairsTableRow/PairsTableRow';
import PairsTableInfoRows from '@/components/PairsTableInfoRows/PairsTableInfoRows';

import styles from './AllPairsSection.module.scss';

interface IProps {
    pair: string;
    index: number;
    columns: string[];
}

const Row: FC<IProps> = ({ pair, index, columns }) => {
    const [openInfo, setOpenInfo] = useState(false);
    return (
        <>
            <PairsTableRow
                variant='all-pairs'
                className={openInfo && styles['opened']}
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
                            {value}
                        </Text>
                    </td>
                ))}
            </PairsTableRow>
            {openInfo && <PairsTableInfoRows />}
        </>
    );
};

export default Row;
