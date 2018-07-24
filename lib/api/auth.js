const BASE_URL = 'http://localhost:3000/xhr'

const Api = function(client) {
    this.client = client
}

Api.prototype.login = function ({ email, password }) {
    let url = BASE_URL + '/login'
    return this.client.post(url, {
        email,
        password
    })
}

Api.prototype.register = function (payload) {
    let url = BASE_URL + '/register'
    return this.client.post(url, payload)
}

export default Api