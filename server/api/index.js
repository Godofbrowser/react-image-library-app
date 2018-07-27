const axios = require('axios')
const ImagesApi = require('./images')
const AuthApi = require('./auth')

const BASE_URL = process.env.API_BASE_URL

const httpClient = axios.create({
    baseURL: BASE_URL
})

// httpClient.defaults.timeout = 60 * 1000
httpClient.interceptors.request.use(function (config) {
    return config
})

httpClient.interceptors.response.use(undefined, function (error) {
    if (error.response.status === 401) {
        // refresh token: https://gist.github.com/Godofbrowser/bf118322301af3fc334437c683887c5f
    }
    return Promise.reject(error);
})

module.exports = (token = null) => {
    if (token) {
        httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    return {
        auth: new AuthApi(httpClient),
        images: new ImagesApi(httpClient)
    }
}