import { defineStore } from "pinia";
import type{ RouteRecordRaw } from 'vue-router'
import {mapMenusToRoutes} from "@/router/permission";
import router from "@/router";

export const useMenuStore = defineStore('menuStore', {
    state: () => ({
        routes: [] as Array<RouteRecordRaw>
    }),
    actions: {
        addRoutes(data: Array<any>, router: any) {
            this.routes = mapMenusToRoutes(data)
            this.routes.forEach((m)=>{
                router.addRoute(m)
            })
        }
    }
})
