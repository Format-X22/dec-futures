import AllPairsSection from './AllPairsSection/AllPairsSection';
import HeaderSection from './HeaderSection/HeaderSection';
import SelectedPair from './SelectedPair/SelectedPair';

import styles from './HomePage.module.scss';

const HomePage = () => {
    return (
        <main className={styles['home-page']}>
            <HeaderSection />
            <SelectedPair />
            <AllPairsSection />
        </main>
    );
};

export default HomePage;
