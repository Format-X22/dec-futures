import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { ApolloProvider } from '@apollo/client/react';
import { client } from 'utils/client';
import { AppProvider } from '@/components/AppContext/AppProvider';

import './index.scss';

function MyApp({ Component, pageProps }: AppProps) {
    const { metaTags, dataFundings } = pageProps;
    return (
        <>
            <Head>
                <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width' />
                <title>DeCommas Futures</title>
                {metaTags &&
                    Object.keys(metaTags).map((tagName) => (
                        <meta key={`meta-tag-${tagName}`} property={tagName} content={metaTags[tagName]} />
                    ))}
                <link rel='icon' href='/futures/public/futures-colored.svg' />
                <link
                    href='https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap'
                    rel='stylesheet'
                />
                {/* <script async src='https://www.googletagmanager.com/gtag/js?id=G-0PTR8ERRMJ' />
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-0PTR8ERRMJ', { page_path: window.location.pathname });
                      `,
                    }}
                /> */}
            </Head>
            <ApolloProvider client={client}>
                <AppProvider initialDataFundings={dataFundings}>
                    <Component {...pageProps} />
                </AppProvider>
            </ApolloProvider>
        </>
    );
}

export default dynamic(() => Promise.resolve(MyApp), {
    ssr: true,
});
