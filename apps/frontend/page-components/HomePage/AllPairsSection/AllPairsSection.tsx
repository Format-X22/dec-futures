import React from 'react';
import PairsTableWrapper from '@/components/PairsTableWrapper/PairsTableWrapper';
import PairsTableHead from '@/components/PairsTableHead/PairsTableHead';
import Row from './Row';

import styles from './AllPairsSection.module.scss';

const pairsInfo = [
    {
        pair: 'BTC/USDT',
        columns: ['0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%'],
    },
    {
        pair: 'BTC/USDT',
        columns: ['0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%'],
    },
    {
        pair: 'BTC/USDT',
        columns: ['0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%'],
    },
    {
        pair: 'BTC/USDT',
        columns: ['0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%'],
    },
    {
        pair: 'BTC/USDT',
        columns: ['0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%', '0.0532%'],
    },
];
const AllPairsSection = () => {
    return (
        <section className={styles['all-pairs-section']}>
            <div className={styles['controls']}>
                <div className={styles['search']}>
                    <input type='text' placeholder='All Pairs' />
                    <img src='/futures/public/search.svg' alt='search' />
                </div>
                <button type='button'>
                    <img src='/futures/public/download.svg' alt='download' />
                </button>
            </div>
            <PairsTableWrapper>
                <PairsTableHead variant='all-pairs' />
                <tbody>
                    {pairsInfo.map(({ pair, columns }, index) => (
                        <Row key={`all-pairs-${pair}-${index}`} pair={pair} index={index} columns={columns} />
                    ))}
                </tbody>
            </PairsTableWrapper>
        </section>
    );
};

export default AllPairsSection;
