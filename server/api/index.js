const axios = require('axios')
const ImagesApi = require('./images')
const AuthApi = require('./auth')

const BASE_URL = process.env.API_BASE_URL

const httpClient = axios.create({
    baseURL: BASE_URL
})

httpClient.defaults.timeout = 30000

module.exports = (token = null) => {
    if (token) {
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    return {
        auth: new AuthApi(httpClient, token),
        images: new ImagesApi(httpClient, token)
    }
}