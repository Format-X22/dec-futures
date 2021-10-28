module.exports = {
    basePath: process.env.NODE_ENV === 'development' ? '' : '/futures',
    env: {
        appEnv: process.env.APP_ENV,
    },
    webpack5: true,
};
