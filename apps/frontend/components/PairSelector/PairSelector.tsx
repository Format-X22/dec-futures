import React, { useContext, useState } from 'react';
import cn from 'classnames';
import { Text } from '../Text/Text';

import styles from './PairSelector.module.scss';
import { AppContext } from '../AppContext/AppContext';

const PairSelector = () => {
    const { allFundings, trackingFunding, setTrackingFunding } = useContext(AppContext);
    const [openedSelector, setOpenedSelector] = useState(false);
    const [search, setSearch] = useState('');
    return (
        <div className={cn(styles['pair-selector'], openedSelector && styles['opened'])}>
            <button
                type='button'
                onClick={() => {
                    setOpenedSelector(!openedSelector);
                    if (openedSelector) {
                        setSearch('');
                    }
                }}
            >
                <Text tagStyle='h3'>
                    {trackingFunding.base}/{trackingFunding.quote}
                </Text>
                <img src='/futures/public/caret.svg' alt='caret' />
            </button>
            {openedSelector && (
                <div className={styles['selector']}>
                    <div className={styles['form-group']}>
                        <input
                            type='input'
                            placeholder='Choose Tracking Pair'
                            value={search}
                            onChange={(e) => setSearch(e.target.value.toLowerCase())}
                        />
                        <img src='/futures/public/search.svg' alt='search' />
                    </div>
                    <div className={styles['options']}>
                        {Object.keys(allFundings)
                            .filter((pair) => pair.toLowerCase().includes(search))
                            .map((pair) => (
                                <button
                                    className={styles['item']}
                                    onClick={() => {
                                        setTrackingFunding(allFundings[pair]);
                                        setOpenedSelector(false);
                                        setSearch('');
                                    }}
                                >
                                    {pair}
                                </button>
                            ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PairSelector;
