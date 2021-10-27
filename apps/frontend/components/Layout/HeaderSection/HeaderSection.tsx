import React, { useContext } from 'react';
import Link from 'next/link';

import PairSelector from '@/components/PairSelector/PairSelector';
import { Text } from '@/components/Text/Text';
import CustomLink from '@/components/CustomLink/CustomLink';
import { AppContext } from '@/components/AppContext/AppContext';
import { headerLinks } from '../Layout';

import styles from './HeaderSection.module.scss';
import { MARKETS } from 'dtos/Markets';
import { IconArrowUpRight } from '@/components/IconArrowUpRight/IconArrowUpRight';

const navBarLinks = [
    {
        text: 'Overview',
        link: '/',
    },
    {
        text: 'Trade history',
        soon: true,
    },
];

const marketLinks = {
    [MARKETS.DYDX]: 'https://dydx.exchange',
    [MARKETS.PERP]: 'https://www.perp.fi',
};

const HeaderSection = () => {
    const { lowestFundingRate, biggestFundingRate } = useContext(AppContext);
    return (
        <header className={styles['header-section']}>
            <div className={styles['company']}>
                <Link href='/'>
                    <a className={styles['logo']}>
                        <img src='/futures/public/futures.svg' alt='Futures' />
                        <Text tagStyle='h5'>Futures</Text>
                    </a>
                </Link>
                <div className={styles['links']}>
                    {headerLinks.map(({ title, icon, link }, index) => (
                        <Link href={link} key={`header-links-${index}`}>
                            <a>
                                <img src={icon} alt={title} />
                            </a>
                        </Link>
                    ))}
                </div>
            </div>
            <div className={styles['menu']}>
                <div className={styles['controls']}>
                    <PairSelector />
                </div>
                <div className={styles['info']}>
                    <div className={styles['info-item']}>
                        <Text tagStyle='h6' fontWeight={600}>
                            Best funding rates
                        </Text>
                        <CustomLink href='funding-rates'>Learn more</CustomLink>
                    </div>
                    <div className={styles['info-item']}>
                        <div>
                            <img
                                src={`/futures/public/${lowestFundingRate.marketKey.toLowerCase()}.png`}
                                alt={lowestFundingRate.marketKey.toLowerCase()}
                            />
                            <Text tagStyle='h2'>{lowestFundingRate.rate.toFixed(4)}%</Text>
                        </div>
                        <Text tagStyle='p' color='grey'>
                            Lowest funding rate
                        </Text>
                        <CustomLink
                            href={marketLinks[lowestFundingRate.marketKey] || ''}
                            className={styles['market-link']}
                        >
                            <Text tagStyle='p' color='green'>
                                {lowestFundingRate.marketKey}
                            </Text>
                            <IconArrowUpRight />
                        </CustomLink>
                    </div>
                    <div className={styles['info-item']}>
                        <div>
                            <img
                                src={`/futures/public/${biggestFundingRate.marketKey.toLowerCase()}.png`}
                                alt={biggestFundingRate.marketKey.toLowerCase()}
                            />
                            <Text tagStyle='h2'>{biggestFundingRate.rate.toFixed(4)}%</Text>
                        </div>
                        <Text tagStyle='p' color='grey'>
                            Highest funding rate
                        </Text>
                        <CustomLink
                            href={marketLinks[biggestFundingRate.marketKey] || ''}
                            className={styles['market-link']}
                        >
                            <Text tagStyle='p' color='green'>
                                {biggestFundingRate.marketKey}
                            </Text>
                            <IconArrowUpRight />
                        </CustomLink>
                    </div>
                </div>
            </div>
            <div className={styles['nav-bar']}>
                {navBarLinks.map(({ text, link, soon }, index) =>
                    link ? (
                        <Link key={`nav-bar-link-${index}`} href={link}>
                            {text}
                        </Link>
                    ) : (
                        <Text tagStyle='p' fontWeight={600} key={`nav-bar-link-${index}`}>
                            {text} {soon && <span>Soon</span>}
                        </Text>
                    ),
                )}
            </div>
        </header>
    );
};

export default HeaderSection;
