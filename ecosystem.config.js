module.exports = {
    apps: [
        {
            name: 'futures_api',
            script: 'npm',
            interpreter: 'none',
            args: 'run start:prod:api',
            max_memory_restart: '1024M',
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
            max_memory_restart: '1024M',
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
            args: 'run start:stage:api',
            max_memory_restart: '1024M',
            env: {
                NODE_ENV: 'test',
                APP_ENV: 'stage',
            },
            env_production: {
                NODE_ENV: 'test',
            },
        },
        {
            name: 'futures_agg_staging',
            script: 'npm',
            interpreter: 'none',
            args: 'run start:stage:agg',
            max_memory_restart: '1024M',
            env: {
                NODE_ENV: 'test',
            },
            env_production: {
                NODE_ENV: 'test',
            },
        },
    ],
};
