import React, { FC, ReactNode } from 'react';

import styles from './PairsTableWrapper.module.scss';

interface IProps {
    children: ReactNode;
}
const PairsTableWrapper: FC<IProps> = ({ children }) => {
    return (
        <div className={styles['pairs-table-wrapper']}>
            <table>{children}</table>
        </div>
    );
};

export default PairsTableWrapper;
