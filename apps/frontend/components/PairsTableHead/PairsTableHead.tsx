import React, { FC } from 'react';
import cn from 'classnames';

import { Text } from '@/components/Text/Text';
import CustomLink from '../CustomLink/CustomLink';
import { IconArrowUpRight } from '../IconArrowUpRight/IconArrowUpRight';
import { getMarketLink } from 'utils/getMarketLink';
import { MARKETS } from 'dtos/Markets';
import { getMarketName } from 'utils/getMarketName';

import styles from './PairsTableHead.module.scss';

interface IProps {
    variant?: 'selected-pair' | 'all-pairs';
}

const PairsTableHead: FC<IProps> = ({ variant = 'selected-pair' }) => {
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
                    <CustomLink href={getMarketLink(MARKETS.DYDX)}>
                        <img src='/futures/public/dydx.png' alt='dydx' />
                        <Text tagStyle='p'>{getMarketName(MARKETS.DYDX)}</Text> <IconArrowUpRight />
                    </CustomLink>
                </td>
                <td colSpan={3} className={styles['perp-td']}>
                    <CustomLink href={getMarketLink(MARKETS.PERP)}>
                        <img src='/futures/public/perp.png' alt='perpetual' />
                        <Text tagStyle='p'>{getMarketName(MARKETS.PERP)}</Text> <IconArrowUpRight />
                    </CustomLink>
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
