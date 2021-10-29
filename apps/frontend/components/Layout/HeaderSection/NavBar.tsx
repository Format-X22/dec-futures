import React from 'react';
import Link from 'next/link';

import { Text } from '@/components/Text/Text';

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

const NavBar = () => {
    return (
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
    );
};

export default NavBar;
