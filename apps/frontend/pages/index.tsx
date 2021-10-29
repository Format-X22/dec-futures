import { Layout } from '@/components/Layout/Layout';
import HomePage from '@/page-components/HomePage/HomePage';
import { queryFundingForAll } from 'utils/queryFundingForAll';

const Index = () => {
    return (
        <Layout>
            <HomePage />
        </Layout>
    );
};

export default Index;

export async function getServerSideProps() {
    const metaTags = {
        'og:title': `DeCommas Futures`,
        'og:description': '',
        'og:image': 'https://decommas.io/futures/public/futures-colored.svg',
        'og:url': `https://decommas.io/futures`,
    };
    const { data: dataFundings } = await queryFundingForAll();

    return {
        props: {
            metaTags,
            dataFundings,
        },
    };
}
