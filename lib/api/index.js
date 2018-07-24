import axios from 'axios'
import ImagesApi from './images' 
import AuthApi from './auth'

const BASE_URL = process.env.APP_URL

const httpClient = axios.create({
    baseURL: BASE_URL
})

export default {
    auth: new AuthApi(httpClient),
    images: new ImagesApi(httpClient)
}