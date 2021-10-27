import React from 'react';
import Link from 'next/link';

import { Text } from '@/components/Text/Text';
import { footerLinks } from '../Layout';
import CustomLink from '../../CustomLink/CustomLink';

import styles from './FooterSection.module.scss';

const FooterSection = () => {
    return (
        <footer className={styles['footer-section']}>
            <div className={styles['logo']}>
                <Text tagStyle='h1'>Futures</Text>
                <img src='/futures/public/futures.svg' alt='DeCommas Futures' />
            </div>
            <div className={styles['row']}>
                <div className={styles['links']}>
                    <Link href='/contact-us'>
                        <a>
                            <Text tagStyle='h5' tag='p' fontWeight={600}>
                                Contact Us
                            </Text>
                        </a>
                    </Link>
                    <Link href='/request-feature'>
                        <a>
                            <Text tagStyle='h5' tag='p'>
                                Request feature
                            </Text>
                            <img src='/futures/public/caret.svg' />
                        </a>
                    </Link>
                    <Link href='/blog'>
                        <a>
                            <Text tagStyle='h5' tag='p'>
                                Blog
                            </Text>
                            <img src='/futures/public/caret.svg' />
                        </a>
                    </Link>
                    <div>
                        {footerLinks.map(({ title, icon, link }, index) => (
                            <Link href={link} key={`header-links-${index}`}>
                                <a>
                                    <img src={icon} alt={title} />
                                </a>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className={styles['form']}>
                    <Text tagStyle='h5' fontWeight={600}>
                        Sign up for our newsletter
                    </Text>
                    <Text tagStyle='h5' tag='p'>
                        Enter your email and stay up to date with the latest updates, news, guides and more.
                    </Text>
                    <div>
                        <input type='text' placeholder='Your email...' />
                        <button type='button'>Sign up</button>
                    </div>
                </div>
            </div>
            <div className={styles['row']}>
                <Link href='/legal-info'>
                    <a>
                        <Text tagStyle='p2'>Legal info</Text>
                    </a>
                </Link>
                <Link href='/privacy-policy'>
                    <a>
                        <Text tagStyle='p2'>Privacy Policy</Text>
                    </a>
                </Link>
                <Text tagStyle='p2'>
                    Powered by <CustomLink href='https://decommas.io'>DeCommas</CustomLink>
                </Text>
            </div>
        </footer>
    );
};

export default FooterSection;
