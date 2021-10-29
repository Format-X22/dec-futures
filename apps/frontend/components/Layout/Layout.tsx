import React, { FC, ReactNode } from 'react';
import FooterSection from './FooterSection/FooterSection';
import HeaderSection from './HeaderSection/HeaderSection';

interface IProps {
    children: ReactNode;
}

export const footerLinks = [
    {
        title: 'discord',
        icon: '/futures/public/discord.svg',
        link: 'https://discord.gg/c5Wmmyyj2w',
    },
    {
        title: 'telegram',
        icon: '/futures/public/telegram.svg',
        link: 'https://t.me/decommas',
    },
    {
        title: 'twitter',
        icon: '/futures/public/twitter.svg',
        link: 'https://twitter.com/decommas',
    },
    {
        title: 'medium',
        icon: '/futures/public/medium.svg',
        link: 'https://medium.com/@DeCommas',
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
        <>
            <HeaderSection />
            {children}
            <FooterSection />
        </>
    );
};
