const expectsJson = require('../util/expects-json')
const REDIRECT_TO = '/auth/login'

module.exports = function(req, res, next) {
    if (!req.session.user) {
        if (expectsJson(req)) {
            return res.status(401).json({ error: 'Not Authenticated!' })
        }
        return res.redirect(REDIRECT_TO)
    }
    next()
}