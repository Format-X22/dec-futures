import React from 'react';
import Link from 'next/link';

import PairSelector from '@/components/PairSelector/PairSelector';
import { Text } from '@/components/Text/Text';
import CustomLink from '@/components/CustomLink/CustomLink';
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
                            <img src='/futures/public/perpetual.png' alt='perpetual' />
                            <Text tagStyle='h2'>0.041%</Text>
                        </div>
                        <Text tagStyle='p'>Lowest funding rate</Text>
                    </div>
                    <div className={styles['info-item']}>
                        <div>
                            <img src='/futures/public/dydx.png' alt='dydx' />
                            <Text tagStyle='h2'>0.072%</Text>
                        </div>
                        <Text tagStyle='p'>Highest funding rate</Text>
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
