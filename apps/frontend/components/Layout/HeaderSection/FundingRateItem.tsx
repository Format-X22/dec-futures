import React, { FC } from 'react';
import cn from 'classnames';

import { Text } from '@/components/Text/Text';
import CustomLink from '@/components/CustomLink/CustomLink';
import { IconArrowUpRight } from '@/components/IconArrowUpRight/IconArrowUpRight';
import { MARKETS } from 'dtos/Markets';
import { getMarketName } from 'utils/getMarketName';
import { getMarketLink } from 'utils/getMarketLink';

import styles from './HeaderSection.module.scss';

interface IProps {
    title: string;
    fundingRate: {
        marketKey: string;
        rate: number;
    };
}

const FundingRateItem: FC<IProps> = ({ title, fundingRate }) => {
    const hasFundingRate = fundingRate.rate !== 0;
    const href = hasFundingRate ? getMarketLink(fundingRate.marketKey as MARKETS) : undefined;
    return (
        <CustomLink
            href={href}
            className={cn(styles['info-item-wrapper'], hasFundingRate && styles['has-funding-rate'])}
        >
            <div className={styles['info-item']}>
                <div>
                    {hasFundingRate && (
                        <img
                            src={`/futures/public/${fundingRate.marketKey.toLowerCase()}.png`}
                            alt={fundingRate.marketKey.toLowerCase()}
                        />
                    )}
                    <Text tagStyle='h2'>{hasFundingRate ? `${fundingRate.rate.toFixed(4)}%` : '-'}</Text>
                </div>
                <Text tagStyle='p' color='grey'>
                    {title}
                </Text>
                <div className={styles['market-link']}>
                    <Text tagStyle='p' color='green'>
                        {getMarketName(fundingRate.marketKey as MARKETS)}
                    </Text>
                    <IconArrowUpRight />
                </div>
            </div>
        </CustomLink>
    );
};

export default FundingRateItem;
