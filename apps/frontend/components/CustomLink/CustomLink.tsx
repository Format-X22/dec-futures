import Link from 'next/link';
import cn from 'classnames';
import { FC, ReactNode } from 'react';

import styles from './CustomLink.module.scss';

interface IProps {
    children: ReactNode;
    href?: string;
    className?: string;
}

const CustomLink: FC<IProps> = ({ href, children, className }) => {
    if (!href) {
        return <div className={className}>{children}</div>;
    } else {
        return (
            <Link href={href}>
                <a className={cn(styles['custom-link'], className)}>{children}</a>
            </Link>
        );
    }
};

export default CustomLink;
