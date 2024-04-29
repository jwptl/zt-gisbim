import {createRouter, createWebHistory} from 'vue-router'
import {useLocalStorage} from '@vueuse/core'
import {getPermissionList} from "@/api";
import {useMenuStore} from "@/stores/menu";
import {usePermissionStore} from '@/stores/permission'


declare module 'vue-router' {
    interface RouteMeta {
        // 是否为菜单
        isMenu?: boolean
        // 标题
        title?: string

        isActive?: boolean

        // 是否为侧边栏
        isSide?: boolean

        // 是否全屏
        isFullscreen?: boolean
    }
}


export const constRoutes = [
    {
        path: '/',
        name: 'home',
        redirect: '/situation',
        meta: {
            isMenu: false,
        }
    },
    {
        path: '/:pathMatch(.*)*',
        hide: true,
        component: () => import('@/views/404.vue'),
        meta: {
            isFullscreen: true,
        }
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: constRoutes
})


const userInfo = useLocalStorage('userInfo', {simpleName: '', orgForm: 0})


router.beforeEach(async (to, from, next) => {
    const token = localStorage.getItem('oauthToken')
    if(token){
        const menuStore = useMenuStore()
        const useStore = usePermissionStore()
        if (menuStore && menuStore.routes.length == 0) {
            const res = await getPermissionList()
            menuStore.addRoutes(res.result.menu, router)
            useStore.permissions = res.result.auth.map((item: any)=>item.action)
            next({ ...to, replace: true })
        }
        // 60的时候为项目账号
        else if (userInfo.value.orgForm == 60 && to.path == '/situation/org') {
            next('/situation/project')
        } else {
            next()
        }
    }
})

export default router
