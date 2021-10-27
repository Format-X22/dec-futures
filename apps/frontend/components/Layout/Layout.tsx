import React, { FC, ReactNode } from 'react';
import FooterSection from './FooterSection/FooterSection';
import HeaderSection from './HeaderSection/HeaderSection';

import styles from './Layout.module.scss';

interface IProps {
    children: ReactNode;
}

export const footerLinks = [
    {
        title: 'discord',
        icon: '/futures/public/discord.svg',
        link: '',
    },
    {
        title: 'telegram',
        icon: '/futures/public/telegram.svg',
        link: '',
    },
    {
        title: 'twitter',
        icon: '/futures/public/twitter.svg',
        link: '',
    },
    {
        title: 'medium',
        icon: '/futures/public/medium.svg',
        link: '',
    },
];

export const headerLinks = [
    {
        title: 'decommas',
        icon: '/futures/public/decommas.svg',
        link: 'https://decommas.io',
    },
    ...footerLinks,
];

export const Layout: FC<IProps> = ({ children }) => {
    return (
        <div className={styles['layout']}>
            <HeaderSection />
            {children}
            <FooterSection />
        </div>
    );
};
