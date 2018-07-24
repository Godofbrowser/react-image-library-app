module.exports = req => (req.xhr || req.headers.accept.indexOf('json') > -1)
