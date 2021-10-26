import { Text } from '@/components/Text/Text';
import CustomLink from '@/components/CustomLink/CustomLink';

import styles from './HeaderSection.module.scss';

const HeaderSection = () => {
    return (
        <section className={styles['header-section']}>
            <div className={styles['container']}>
                <div>
                    <Text tagStyle='h5' fontWeight={600}>
                        Next funding
                    </Text>
                    <Text tagStyle='p' color='grey'>
                        If positive, longs pay shorts; if negative, shorts pay longs.{' '}
                        <CustomLink href='/learn-more'>Learn more</CustomLink>
                    </Text>
                </div>
                {/* <button type='button'>
                    <Text tagStyle='p' color='grey'>
                        Updated 1 min ago
                    </Text>
                    <img src='/futures/public/reload.svg' alt='reload' />
                </button> */}
            </div>
        </section>
    );
};

export default HeaderSection;
