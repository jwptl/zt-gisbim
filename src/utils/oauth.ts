import { casLogin } from '@/api/oauth'
import { useLocalStorage, useUrlSearchParams } from '@vueuse/core'

// 校验cas-ticket
export const validateTicket = (callback: Function) => {
    const params = useUrlSearchParams()
    if (params.ticket) {
        localStorage.setItem('ticket', (params.ticket as string))
    }

    const userInfo = useLocalStorage('userInfo', { simpleName: '' })

    // token已存在验证token是否有效
    if (localStorage.getItem('oauthToken')) {
        callback()
    } else {
        const ticket = localStorage.getItem('ticket')

        // token不存在进行登录
        const url = window.location.origin

        // 如果url里携带了oauthToken
        if (params.oauthToken) {
            // console.log(`${import.meta.env.VITE_CAS_BASE_URL}?service=${encodeURIComponent(url)}&oauthToken=${params.oauthToken}`)
            window.location.href = `${import.meta.env.VITE_CAS_BASE_URL}?service=${encodeURIComponent(url)}&oauthToken=${params.oauthToken}`
            return
        }

        if (ticket) {
            casLogin(ticket, url).then(res => {
                if (res.code === 200) {
                    localStorage.setItem('oauthToken', res.result.token)

                    userInfo.value = res.result.userInfo
                    window.location.href = url
                } else {
                    localStorage.removeItem('userInfo')
                    localStorage.removeItem('ticket')
                    localStorage.removeItem('oauthToken')
                    window.location.href = `${import.meta.env.VITE_CAS_BASE_URL}?service=${encodeURIComponent(url)}`
                }
            })
        } else {
            window.location.href = `${import.meta.env.VITE_CAS_BASE_URL}?service=${encodeURIComponent(url)}`
        }
    }

}
