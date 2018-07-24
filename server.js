// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session')
const next = require('next')
const ROUTES = require('./server/constants/routes').ROUTES

const dev = process.env.NODE_ENV !== 'production'
const serverPort = process.env.PORT || 3000

const app = next({
    dev,
    quiet: !dev
})

const handle = app.getRequestHandler()

// Routes
const initializeXhrRoutes = require('./server/routes')

app.prepare().then(() => {
    const server = express()

    server.use(bodyParser.json())
    server.use(session({
        name: 'images-library-session',
        secret: 'session-secret-key',
        resave: true,
        saveUninitialized: false,
        cookie: {
            secure: !dev,
            expires: new Date(253402300799999)
        }
    }));

    initializeXhrRoutes(server)

    server.use((req, res, next) => {
        let guestPaths = [
            ROUTES.auth.login,
            ROUTES.auth.register,
        ]
        let authPaths = [
            ROUTES.app.dashboard,
            ROUTES.app.upload,
            ROUTES.app.logout
        ]
        
        if (guestPaths.includes(req.path)) {
            if (req.session.user) {
                return res.redirect(ROUTES.app.dashboard)
            }
        }

        if (authPaths.includes(req.path)) {
            if (!req.session.user) {
                return res.redirect(ROUTES.auth.login)
            }
        }
        
        next()
    })

    server.get('/auth/logout', (req, res) => {
        req.session.user = null
        return res.redirect(ROUTES.home)
    })

    server.get('*', (req, res) => {
        return handle(req, res)
    })

    server.listen(serverPort, err => {
        if (err) throw err
        console.log('> Ready on http://localhost:' + serverPort)
    })
})