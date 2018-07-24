const Api = function(client) {
    this.client = client
}

Api.prototype.login = function ({ email, password }) {
    let url = 'xhr/login'
    return this.client.post(url, {
        email,
        password
    })
}

Api.prototype.register = function (payload) {
    let url = BASE_URL + 'xhr/register'
    return this.client.post(url, payload)
}

export default Api