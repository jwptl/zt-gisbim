import axios from 'axios'
import type { AxiosRequestConfig } from 'axios'

const request = axios.create({
    baseURL: '/gisbim-api'
})

// 添加请求拦截器
request.interceptors.request.use(config => {
    const token = localStorage.getItem('oauthToken')
    if (token) {
        config.headers.set('X-Access-Token', token)
    }
    return config
}, error => Promise.reject(error))

// 添加响应拦截器
request.interceptors.response.use(response => response, error => {
    // token失效
    if (error.response?.status === 401) {
        localStorage.removeItem('userInfo')
        localStorage.removeItem('oauthToken')
        localStorage.removeItem('ticket')

        window.location.href = window.location.protocol + '//' + window.location.host
    }
    return Promise.reject(error)
})

export default <T = any>(config: AxiosRequestConfig): Promise<T> => request(config).then(res => res.data)
