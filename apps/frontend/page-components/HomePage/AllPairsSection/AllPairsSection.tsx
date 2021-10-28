import React, { useContext, useState } from 'react';

import PairsTableWrapper from '@/components/PairsTableWrapper/PairsTableWrapper';
import PairsTableHead from '@/components/PairsTableHead/PairsTableHead';
import Row from './Row';

import styles from './AllPairsSection.module.scss';
import { AppContext } from '@/components/AppContext/AppContext';

const AllPairsSection = () => {
    const { allFundings } = useContext(AppContext);
    const [search, setSearch] = useState('');
    return (
        <section className={styles['all-pairs-section']}>
            <div className={styles['controls']}>
                <div className={styles['search']}>
                    <input
                        type='text'
                        placeholder='All Pairs'
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    {search.length > 0 ? (
                        <button type='button' onClick={() => setSearch('')}>
                            <img src='/futures/public/close.svg' alt='close' />
                        </button>
                    ) : (
                        <img src='/futures/public/search.svg' alt='search' />
                    )}
                </div>
                <button type='button'>
                    <img src='/futures/public/download.svg' alt='download' />
                </button>
            </div>
            <PairsTableWrapper>
                <PairsTableHead variant='all-pairs' />
                <tbody>
                    {Object.keys(allFundings)
                        .filter((pair) => pair.toLowerCase().includes(search.toLowerCase()))
                        .map((pair, index) => (
                            <Row
                                key={`all-pairs-${pair}-${index}`}
                                pair={pair}
                                index={index}
                                funding={allFundings[pair]}
                            />
                        ))}
                </tbody>
            </PairsTableWrapper>
        </section>
    );
};

export default AllPairsSection;
