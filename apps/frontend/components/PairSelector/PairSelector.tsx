import React, { useState } from 'react';
import cn from 'classnames';
import { Text } from '../Text/Text';

import styles from './PairSelector.module.scss';

const availablePairs = ['BTC/USDT', 'AAVE/COMP', 'ETH/USDT'];

const PairSelector = () => {
    const [selectedPair, setSelectedPair] = useState(availablePairs[0]);
    const [openedSelector, setOpenedSelector] = useState(false);
    return (
        <div className={cn(styles['pair-selector'], openedSelector && styles['opened'])}>
            <button type='button' onClick={() => setOpenedSelector(!openedSelector)}>
                <Text tagStyle='h3'>{selectedPair}</Text>
                <img src='/futures/public/caret.svg' alt='caret' />
            </button>
            {openedSelector && (
                <div className={styles['selector']}>
                    <div className={styles['form-group']}>
                        <input type='input' placeholder='Choose Tracking Pair' />
                        <img src='/futures/public/search.svg' alt='search' />
                    </div>
                    <div className={styles['options']}>
                        {availablePairs.map((pair) => (
                            <button
                                className={styles['item']}
                                onClick={() => {
                                    setSelectedPair(pair);
                                    setOpenedSelector(false);
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
