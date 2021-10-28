import React, { useContext } from 'react';
import Link from 'next/link';

import PairSelector from '@/components/PairSelector/PairSelector';
import { Text } from '@/components/Text/Text';
import CustomLink from '@/components/CustomLink/CustomLink';
import { AppContext, defaultFundingRate } from '@/components/AppContext/AppContext';
import { IconArrowUpRight } from '@/components/IconArrowUpRight/IconArrowUpRight';
import { MARKETS } from 'dtos/Markets';
import { getMarketName } from 'utils/getMarketName';
import { getMarketLink } from 'utils/getMarketLink';
import { headerLinks } from '../Layout';

import styles from './HeaderSection.module.scss';

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

const HeaderSection = () => {
    const { trackingFunding } = useContext(AppContext);
    const lowestFundingRate = Object.keys(trackingFunding.rates).reduce((acc, marketKey) => {
        return acc.rate < trackingFunding.rates[marketKey] && acc.rate !== 0
            ? acc
            : {
                  marketKey,
                  rate: trackingFunding.rates[marketKey],
              };
    }, defaultFundingRate);
    const biggestFundingRate = Object.keys(trackingFunding.rates).reduce((acc, marketKey) => {
        return acc.rate > trackingFunding.rates[marketKey] && acc.rate !== 0
            ? acc
            : {
                  marketKey,
                  rate: trackingFunding.rates[marketKey],
              };
    }, defaultFundingRate);
    return (
        <header className={styles['header-section']}>
            <div className={styles['company']}>
                <Link href='/'>
                    <a className={styles['logo']}>
                        <img src='/futures/public/futures-colored.svg' alt='Futures' />
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
                </div>
                <div className={styles['info']}>
                    <div className={styles['info-item-wrapper']}>
                        <div className={styles['info-item']}>
                            <Text tagStyle='h6' fontWeight={600}>
                                Funding rate limits
                            </Text>
                            {/* <CustomLink href='funding-rates'>Learn more</CustomLink> */}
                        </div>
                    </div>
                    <CustomLink
                        href={getMarketLink(lowestFundingRate.marketKey as MARKETS)}
                        className={styles['info-item-wrapper']}
                    >
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
                            <div className={styles['market-link']}>
                                <Text tagStyle='p' color='green'>
                                    {getMarketName(lowestFundingRate.marketKey as MARKETS)}
                                </Text>
                                <IconArrowUpRight />
                            </div>
                        </div>
                    </CustomLink>
                    <CustomLink
                        href={getMarketLink(biggestFundingRate.marketKey as MARKETS)}
                        className={styles['info-item-wrapper']}
                    >
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
                            <div className={styles['market-link']}>
                                <Text tagStyle='p' color='green'>
                                    {getMarketName(biggestFundingRate.marketKey as MARKETS)}
                                </Text>
                                <IconArrowUpRight />
                            </div>
                        </div>
                    </CustomLink>
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
            </div>
        </header>
    );
};

export default HeaderSection;
