import React, { useContext } from 'react';
import Link from 'next/link';

import PairSelector from '@/components/PairSelector/PairSelector';
import { Text } from '@/components/Text/Text';
import { AppContext, defaultFundingRate } from '@/components/AppContext/AppContext';
import FundingRateItem from './FundingRateItem';
import NavBar from './NavBar';
import { headerLinks } from '../Layout';

import styles from './HeaderSection.module.scss';

const HeaderSection = () => {
    const { trackingFunding } = useContext(AppContext);
    const lowestFundingRate = Object.keys(trackingFunding.rates).reduce((acc, marketKey) => {
        return acc.rate < trackingFunding.rates[marketKey]
            ? acc
            : {
                  marketKey,
                  rate: trackingFunding.rates[marketKey],
              };
    }, defaultFundingRate);
    const biggestFundingRate = Object.keys(trackingFunding.rates).reduce((acc, marketKey) => {
        return acc.rate > trackingFunding.rates[marketKey]
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
                    <NavBar />
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
                    <FundingRateItem title='Lowest funding rate' fundingRate={lowestFundingRate} />
                    <FundingRateItem title='Highest funding rate' fundingRate={biggestFundingRate} />
                </div>
                <NavBar />
            </div>
        </header>
    );
};

export default HeaderSection;
