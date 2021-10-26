import React from 'react';
import { Text } from '@/components/Text/Text';
import PairsTableWrapper from '@/components/PairsTableWrapper/PairsTableWrapper';
import PairsTableHead from '@/components/PairsTableHead/PairsTableHead';
import PairsTableRow from '@/components/PairsTableRow/PairsTableRow';
import PairsTableInfoRows from '@/components/PairsTableInfoRows/PairsTableInfoRows';

import styles from './SelectedPair.module.scss';

const SelectedPair = () => {
    return (
        <section className={styles['selected-pair']}>
            <div className={styles['header']}>
                <Text tagStyle='h5' tag='p'>
                    Pair with the biggest funding rate difference <img src='/futures/public/info.svg' alt='info' />
                </Text>
                <Text tagStyle='h2'>
                    <img src='/futures/public/coin/btc.png' />
                    <span>BTC</span>
                    <span>/USDT</span>
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
                        <td className={styles['left-border']}>
                            <Text tagStyle='p' color='grey'>
                                0.0532%
                            </Text>
                        </td>
                        <td>
                            <Text tagStyle='p' color='grey'>
                                0.0532%
                            </Text>
                        </td>
                        <td>
                            <Text tagStyle='p' color='grey'>
                                0.0532%
                            </Text>
                        </td>
                        <td className={styles['left-border']}>
                            <Text tagStyle='p' color='grey'>
                                0.0532%
                            </Text>
                        </td>
                        <td>
                            <Text tagStyle='p' color='grey'>
                                0.0532%
                            </Text>
                        </td>
                        <td>
                            <Text tagStyle='p' color='grey'>
                                0.0532%
                            </Text>
                        </td>
                    </PairsTableRow>
                    <PairsTableInfoRows />
                </tbody>
            </PairsTableWrapper>
        </section>
    );
};

export default SelectedPair;
