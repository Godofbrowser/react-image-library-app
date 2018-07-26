const session = require('express-session')
const cookieSession = require('cookie-session')
const LokiStore = require('connect-loki')(session)
const PROD = process.env.NODE_ENV == "production"

module.exports =  (() => {
        if (PROD) {
            return cookieSession({
                secret: 'some-jehldkdkwewh33j-jargon',
                signed: true,
            })
        } else {
            return session({
                name: 'images-library-session',
                secret: 'some-jehldkdkwewh33j-jargon',
                resave: true,
                unset: 'destroy',
                saveUninitialized: false,
                cookie: {
                    secure: PROD,
                    expires: 36288000
                },
                store: new LokiStore({
                    path: './storage/sessions/session-store.db',
                    logErrors: !PROD
                })
            })
        }
    })()
 