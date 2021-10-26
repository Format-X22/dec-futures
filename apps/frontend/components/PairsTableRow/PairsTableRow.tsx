import React, { FC, ReactNode } from 'react';
import cn from 'classnames';

import styles from './PairsTableRow.module.scss';

interface IProps {
    variant: 'selected-pair' | 'all-pairs';
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

const PairsTableRow: FC<IProps> = ({ variant, children, className, onClick }) => {
    return (
        <tr className={cn(styles['pairs-table-row'], styles[variant], className)} onClick={onClick}>
            {children}
        </tr>
    );
};

export default PairsTableRow;
