const Index = () => {
    return <div>Index Page</div>;
};

export default Index;

export async function getServerSideProps() {
    const metaTags = {
        'og:title': `DeCommas Opex`,
        'og:description': 'The best options aggregator by DeCommas',
        'og:image': 'https://decommas.io/opex/public/opex.svg',
        'og:url': `https://decommas.io/opex`,
    };
    return {
        props: {
            metaTags,
        },
    };
}
