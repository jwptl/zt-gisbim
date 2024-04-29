import request from '@/utils/request'
import type { Response } from '@/api/type'

// cas-ticket登录
export const casLogin = (ticket: string, service: string) => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-business/sys/cas/client/validateLogin',
        params: { ticket, service }
    })
}

// cas-token退出
export const casLogout = () => {
    return request<Response>({
        method: 'GET',
        url: '/gisbim-system/sys/logout'
    })
}

// cas-ticket退出
export const casTicketLogout = () => {
    return request({
        method: 'GET',
        url: '/cas/logout'
    })
}
