const expectsJson = require('../util/expects-json')
const REDIRECT_TO = '/dashboard'

module.exports = function(req, res, next) {
    if (req.session.user && req.session.user.autheticated) {
        if (expectsJson(req)) {
            return res.status(400).json({ error: 'Guest restricted!' })
        }
        return res.redirect(REDIRECT_TO)
    }
    next()
}