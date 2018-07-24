const withSass = require('@zeit/next-sass')

const {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_SERVER
} = require('next/constants')

const webpackModifier = function(config, options) {
    // Should we need a loader for these file types
    // config.module.rules.push({
    //     test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
    //     use: {
    //         loader: 'url-loader',
    //         options: {
    //             limit: 100000
    //         }
    //     }
    // })

    config.externals = config.externals || {}
    config.externals['ladda'] = "Ladda"

    return config
}

const serverRuntimeConfig = { // Will only be available on the server side
    //
}

const publicRuntimeConfig = { // Will be available on both server and client
    APP_URL: process.env.APP_URL
}

module.exports = (phase, {
    defaultConfig
}) => {
    if (phase === PHASE_DEVELOPMENT_SERVER) {
        return withSass({
            /* development only config options here */
            // distDir: 'build',
            webpack: webpackModifier,
            serverRuntimeConfig,
            publicRuntimeConfig
        })
    }

    return withSass({
        /* config options for all phases except development here */
        // distDir: 'build',
        webpack: webpackModifier,
        serverRuntimeConfig,
        publicRuntimeConfig
    })
}