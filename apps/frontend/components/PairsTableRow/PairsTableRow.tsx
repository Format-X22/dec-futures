import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './PairsTableRow.module.scss';

interface IProps {
    children: ReactNode;
    variant?: 'selected-pair' | 'all-pairs';
    className?: string;
    onClick?: () => void;
}

const PairsTableRow: FC<IProps> = ({ variant = 'selected-pair', children, className, onClick }) => {
    return (
        <tr className={cn(styles['pairs-table-row'], styles[variant], className)} onClick={onClick}>
            {children}
        </tr>
    );
};

export default PairsTableRow;
