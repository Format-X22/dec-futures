import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import './index.scss';

function MyApp({ Component, pageProps }: AppProps) {
    return <Component {...pageProps} />;
}

export default dynamic(() => Promise.resolve(MyApp), {
    ssr: true,
});
