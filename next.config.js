require('dotenv').config()

const webpack = require('webpack')
const path = require('path')
const withSass = require('@zeit/next-sass')
const {
    InjectManifest
} = require('workbox-webpack-plugin')

const {
    PHASE_DEVELOPMENT_SERVER,
    PHASE_PRODUCTION_SERVER,
    CLIENT_STATIC_FILES_RUNTIME_MAIN
} = require('next/constants')

const serverRuntimeConfig = { // Will only be available on the server side
    API_CLIENT_ID: process.env.API_CLIENT_ID,
    API_CLIENT_SECRET: process.env.API_CLIENT_SECRET
}

const publicRuntimeConfig = { // Will be available on both server and client
    APP_URL: process.env.APP_URL,
    APP_ENV: process.env.APP_ENV,
    API_BASE_URL: process.env.API_BASE_URL
}

const webpackModifier = function (config, options) {
    config.output.libraryTarget = 'umd'

    const cachedEntry = config.entry;
    config.entry = () => cachedEntry().then(entry => {
        if (!options.dev && entry[CLIENT_STATIC_FILES_RUNTIME_MAIN]) {
            entry[CLIENT_STATIC_FILES_RUNTIME_MAIN].push('./lib/sw-registration.js')
        }

        if (!options.isServer) {
            entry['sw-config.js'] = ['./lib/sw-config.js']
        }

        return entry
    })

    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env.API_BASE_URL': JSON.stringify(process.env.API_BASE_URL)
        })
    )

    if (!options.isServer) {
        config.plugins.push(
            new InjectManifest({
                swSrc: path.join(__dirname, 'lib', 'sw.js'),
                swDest: path.join(__dirname, '.next', 'sw.js'),
                importWorkboxFrom: 'local',
            })
        )
    }

    return config
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
        publicRuntimeConfig,
        postcssLoaderOptions: {
            parser: true,
            autoprefixer: true
        }
    })
}