import { gql } from '@apollo/client';
import { client } from './client';

export const queryFundingForAll = () => {
    return client.query({
        query: gql`
            query getFundingForAll {
                currentFundingForAll {
                    marketKey
                    payDate
                    base
                    quote
                    rate
                }
            }
        `,
        fetchPolicy: 'no-cache',
    });
};
