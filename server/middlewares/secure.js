const expectsJson = require('../util/expects-json')
const PROD = process.env.NODE_ENV === "production" && process.env.APP_ENV !== 'local'

module.exports = function (req, res, next) {
    if (PROD && !req.secure && req.get('x-forwarded-proto') !== 'https') {
        if (expectsJson(req)) {
            return res.status(426).json({ error: 'Upgrade Required' })
        }
        
        return res.redirect('https://' + req.get('host') + req.url);
    }
    next();
}