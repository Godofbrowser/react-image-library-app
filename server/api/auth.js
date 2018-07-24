const CLIENT_ID = process.env.CLIENT_ID
const CLIENT_SECRET = process.env.CLIENT_SECRET

const Api = function(client) {
    this.client = client
}

Api.prototype.login = function ({ email, password }) {
    let url = 'oauth/login'
    return this.client.post(url, {
        username: email,
        password: password,
        grant_type: 'password',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        scope: '*',
    })
}

Api.prototype.register = function (payload) {
    let url = 'oauth/register'
    return this.client.post(url, {
        ...payload,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    })
}

module.exports = Api
