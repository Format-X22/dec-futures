import React, { FC } from 'react';
import cn from 'classnames';

import { Text } from '@/components/Text/Text';

import styles from './PairsTableHead.module.scss';

const IconArrowUpRight = () => {
    return (
        <svg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'>
            <path d='M5 3V4H11.295L3 12.295L3.705 13L12 4.705V11H13V3H5Z' fill='white' fill-opacity='0.4' />
        </svg>
    );
};

interface IProps {
    variant: 'selected-pair' | 'all-pairs';
}

const PairsTableHead: FC<IProps> = ({ variant }) => {
    const isAllPairsVariant = variant === 'all-pairs';
    return (
        <thead className={cn(styles['pairs-table-head'], styles[variant])}>
            <tr>
                <td>
                    <Text tagStyle='p' color='grey' fontWeight={600}>
                        {isAllPairsVariant ? '2 sources:' : 'Funding stats'}
                    </Text>
                </td>
                <td colSpan={3} className={styles['dydx-td']}>
                    <div>
                        <img src='/futures/public/dydx.png' alt='dydx' />
                        <Text tagStyle='p'>dydx</Text> <IconArrowUpRight />
                    </div>
                </td>
                <td colSpan={3} className={styles['perp-td']}>
                    <div>
                        <img src='/futures/public/perpetual.png' alt='perpetual' />
                        <Text tagStyle='p'>Perpetual Protocol</Text> <IconArrowUpRight />
                    </div>
                </td>
            </tr>
            <tr>
                <td>
                    {isAllPairsVariant && (
                        <Text tagStyle='p' fontWeight={600}>
                            Pairs
                        </Text>
                    )}
                </td>
                <td className={styles['left-blue-border']}>
                    <Text tagStyle='p' fontWeight={600}>
                        1 hour
                    </Text>
                </td>
                <td>
                    <Text tagStyle='p' fontWeight={600}>
                        8 hours
                    </Text>
                </td>
                <td>
                    <Text tagStyle='p' fontWeight={600}>
                        Annuallized
                    </Text>
                </td>
                <td className={styles['left-green-border']}>
                    <Text tagStyle='p' fontWeight={600}>
                        1 hour
                    </Text>
                </td>
                <td>
                    <Text tagStyle='p' fontWeight={600}>
                        8 hours
                    </Text>
                </td>
                <td>
                    <Text tagStyle='p' fontWeight={600}>
                        Annuallized
                    </Text>
                </td>
            </tr>
        </thead>
    );
};

export default PairsTableHead;
