import React, { FormEvent, useState } from 'react';
import validator from 'validator';

import { gql } from '@apollo/client';
import { client } from 'utils/client';
import { Text } from '@/components/Text/Text';

import styles from './SubscribeForm.module.scss';

const SUBSCRIBE = gql`
    query subscribe($email: String!) {
        subscribe(email: $email) {
            success
        }
    }
`;

const SubscribeForm = () => {
    const [email, setEmail] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [success, setSuccess] = useState<boolean>(false);

    const onFormSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!validator.isEmail(email)) {
            setError('Please, enter valid email');
            return;
        }
        try {
            // SEND REQUEST
            await client.query({
                query: SUBSCRIBE,
                variables: {
                    email,
                },
            });
            setSuccess(true);
            setError('');
        } catch (e) {
            setError('Error');
        }
    };
    return (
        <div className={styles['subscribe-form']}>
            <Text tagStyle='h5' fontWeight={600}>
                Sign up for our newsletter
            </Text>
            <Text tagStyle='h5' tag='p'>
                Enter your email and stay up to date with the latest updates, news, guides and more.
            </Text>
            <div className={success ? styles['success'] : ''}>
                <form onSubmit={onFormSubmit}>
                    <input
                        type='text'
                        placeholder='Your email...'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <button type='button' onClick={onFormSubmit}>
                        Sign up
                    </button>
                </form>
                <div>
                    <Text tagStyle='p' color='green' fontWeight={600}>
                        Thank you for signing up!
                    </Text>
                </div>
            </div>
            {error && <p className={styles['error']}>{error}</p>}
        </div>
    );
};

export default SubscribeForm;
