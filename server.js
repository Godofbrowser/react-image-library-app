// This file doesn't go through babel or webpack transformation.
// Make sure the syntax and sources this file requires are compatible with the current node version you are running
// See https://github.com/zeit/next.js/issues/1245 for discussions on Universal Webpack or universal Babel
require('dotenv').config()

const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const next = require('next')
const routes = require('./lib/routes')
const ROUTES = require('./server/constants/routes').ROUTES
const ensureHTTPSMiddleware = require('./server/middlewares/secure')
const enableSessionMiddleware = require('./server/middlewares/session')


const dev = process.env.NODE_ENV !== 'production'
const serverPort = process.env.PORT || 3000

const app = next({
    dev,
    quiet: !dev
})

const handle = routes.getRequestHandler(app) // app.getRequestHandler()

// Routes
const initializeXhrRoutes = require('./server/routes')

app.prepare().then(() => {
    const server = express()

    server.use(bodyParser.json())
    server.use(ensureHTTPSMiddleware)
    server.use(enableSessionMiddleware)

    initializeXhrRoutes(server)
    
    server.use(express.static(path.join(__dirname, 'static')));

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
        req.session.destroy ? req.session.destroy() : (req.session = null)
        return res.redirect(ROUTES.home)
    })

    server.get('*', (req, res) => {

        let wbPattern = /^(\/precache-manifest[^\/]+\.js|\/workbox-[^\/]+?\/{1}[^\/\n]+)$/

        if (['/sw.js', '/sw-config.js'].includes(req.url) || wbPattern.test(req.url)) {
            return app.serveStatic(req, res, path.join(__dirname, '.next', req.url))
        }

        return handle(req, res)
    })

    server.listen(serverPort, err => {
        if (err) throw err
        console.log('> Ready on http://localhost:' + serverPort)
    })
})