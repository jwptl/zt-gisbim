import {createApp} from 'vue'
import {createPinia} from 'pinia'
import {validateTicket} from '@/utils/oauth'
import vAuth from '@/directives/auth'

import App from './App.vue'
import router from './router'

import 'element-plus/dist/index.css'

import '@/style/tailwind.css'
import 'animate.css'
import 'mars3d-cesium/Build/Cesium/Widgets/widgets.css'
import 'mars3d/dist/mars3d.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/style/index.css'

const app = createApp(App)
// app.use(ElementPlus, {locale});//需要改变的地方，加入locale
app.use(createPinia())

// cas登录
app.use(router)
validateTicket(() => {
    app.directive('auth', vAuth)
    app.mount('#app')
})

