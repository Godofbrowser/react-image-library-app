import axios from 'axios'
import { toast } from "react-toastify";
import ImagesApi from './images' 
import AuthApi from './auth'
import getConfig from 'next/config'

const { publicRuntimeConfig } = getConfig()

const BASE_URL = publicRuntimeConfig.APP_URL

const httpClient = axios.create({
    baseURL: BASE_URL
})

httpClient.interceptors.response.use(undefined, function (error) {
    console.log('Intercepted error: ', error)
    if (error.response && error.response.status === 422) {
        let msg = error.response.data.error || error.toString()
        toast.error(
        msg
      )
    }
    return Promise.reject(error);
})

export default {
    auth: new AuthApi(httpClient),
    images: new ImagesApi(httpClient)
}