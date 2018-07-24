const xhrRoutes = require('./xhr-routes')

module.exports = server => {
    server.use('/xhr', xhrRoutes)
}