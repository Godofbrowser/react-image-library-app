const BASE_URL = 'http://okada-images-api.devv/api'

const CLIENT_ID = '3'
const CLIENT_SECRET = 'kBgCySW4IoYlyk5YeapGWabeSWfwEEQ2i0I65Pyx'

const Api = function(client) {
    this.client = client
}

Api.prototype.login = function ({ email, password }) {
    let url = BASE_URL + '/oauth/login'
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
    let url = BASE_URL + '/oauth/register'
    return this.client.post(url, {
        ...payload,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    })
}

module.exports = Api
