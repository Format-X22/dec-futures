module.exports = {
    apps: [
        {
            name: 'futures_api',
            script: 'npm',
            interpreter: 'none',
            args: 'run start:prod:api',
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'futures_agg',
            script: 'npm',
            interpreter: 'none',
            args: 'run start:prod:agg',
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'futures_api_staging',
            script: 'npm',
            interpreter: 'none',
            args: 'run start:prod:api',
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
        {
            name: 'futures_agg_staging',
            script: 'npm',
            interpreter: 'none',
            args: 'run start:prod:agg',
            max_memory_restart: '512M',
            env: {
                NODE_ENV: 'production',
            },
            env_production: {
                NODE_ENV: 'production',
            },
        },
    ],
};
