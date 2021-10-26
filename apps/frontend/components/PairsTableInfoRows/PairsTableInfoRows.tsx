import React from 'react';
import cn from 'classnames';
import { Text } from '@/components/Text/Text';
import PairsTableRow from '@/components/PairsTableRow/PairsTableRow';

import styles from './PairsTableInfoRows.module.scss';

const PairsTableInfoRows = () => {
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
            <PairsTableRow className={styles['pairs-table-info-rows']}>
                <td>
                    <Text tagStyle='p' color='grey'>
                        Last 24 h
                    </Text>
                </td>
                <td className={styles['left-blue-border']}>
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
                <td className={styles['left-green-border']}>
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
            <PairsTableRow className={styles['pairs-table-info-rows']}>
                <td>
                    <Text tagStyle='p' color='grey'>
                        Last 7 days
                    </Text>
                </td>
                <td className={styles['left-blue-border']}>
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
                <td className={styles['left-green-border']}>
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
            <PairsTableRow className={styles['pairs-table-info-rows']}>
                <td>
                    <Text tagStyle='p' color='grey'>
                        Last month
                    </Text>
                </td>
                <td className={styles['left-blue-border']}>
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
                <td className={styles['left-green-border']}>
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
            <PairsTableRow className={styles['pairs-table-info-rows']}>
                <td>
                    <Text tagStyle='p' color='grey'>
                        Last month
                    </Text>
                </td>
                <td className={styles['left-blue-border']}>
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
                <td className={styles['left-green-border']}>
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
            <PairsTableRow className={cn(styles['pairs-table-info-rows'], styles['border-bottom'])}>
                <td>
                    <Text tagStyle='p' color='grey'>
                        Last 3 months
                    </Text>
                </td>
                <td className={styles['left-blue-border']}>
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
                <td className={styles['left-green-border']}>
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
        </>
    );
};

export default PairsTableInfoRows;
