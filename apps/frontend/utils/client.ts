import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const urlList = {
    // TODO fix prod url
    production: 'https://stage.decommas.io/futures/api/graphql',
    test: 'https://stage.decommas.io/futures/api/graphql',
    development: 'http://localhost:3100/futures/api/graphql',
};

const httpLink = createHttpLink({
    uri: urlList[process.env.APP_ENV || process.env.NODE_ENV],
});

const authLink = setContext((_, { headers }) => {
    return {
        headers: {
            ...headers,
            authorization: 'Basic dGVzdDpCeXlWV0ReXlZAZA==',
        },
    };
});
export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});
