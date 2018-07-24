import axios from 'axios'
import ImagesApi from './images' 
import AuthApi from './auth'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const BASE_URL = publicRuntimeConfig.APP_URL

console.log('BASE_URL', BASE_URL)

const httpClient = axios.create({
    baseURL: BASE_URL
})

export default {
    auth: new AuthApi(httpClient),
    images: new ImagesApi(httpClient)
}