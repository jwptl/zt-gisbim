<template>
  <div :class="['bg-[#283F5F] text-white px-8 w-full', route.meta.isFullscreen ? 'absolute z-500 bg-opacity-0' : '']">
    <div class="flex relative nav items-center">
      <div class="header-title text-4xl tracking-widest font-ysbth">
        <RouterLink to="/">
          <div class="flex">
            <img class="w-12 h-10 mr-4" src="@/assets/images/index/logo.png" alt="">
            中铁北斗数字化施工平台
          </div>
        </RouterLink>
      </div>
      <ul class="flex ml-12 min-w-max flex-1 justify-center">
        <RouterLink :to="menu.path" v-for="menu in menus">
          <li :class="['text-xl', menu.meta.isActive ? 'active' : '']" style="margin-right: 50px">{{ menu.meta?.title }}</li>
        </RouterLink>
      </ul>
      <div class="flex w-80 justify-end items-center">
        <MiniWeather>
          <template #default="{weather, icon}">
            <div class="flex items-center">
              <div class="text-xl font-bold">{{ weather.temp }} ℃</div>
              <div class="text-center ml-4">
                <div class="font-bold text-sm">{{ weather.WD }}{{ weather.WS }}</div>
                <div class="text-sm">{{ weather.weather }}</div>
              </div>
              <MiniWeatherIcon class="h-10" :icon="icon"/>

            </div>
          </template>
        </MiniWeather>
        <el-divider class="mr-4 ml-2" direction="vertical" />
        <div class="text-center">
          <div class="font-bold text-xl">{{ datetime.substring(11, 16) }}</div>
          <div class="text-sm">{{ datetime.substring(0, 10) }}</div>
        </div>
      </div>
    </div>
    <div class="flex justify-between gap-6 pb-8">
      <div class="flex-1 border-t border-[#AFD5D7]"></div>
      <div class="-mt-2">
        <el-dropdown>
          <div class="el-dropdown-link">
            你好，{{ userInfo.simpleName }}
            <el-icon class="el-icon--right">
              <arrow-down/>
            </el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="onLogout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {ArrowDown} from "@element-plus/icons-vue";
import {useRoute, useRouter, RouterLink} from "vue-router";
import type {RouteMeta} from "vue-router";
import {computed} from "vue"
import {vMiniWeather as MiniWeather, vMiniWeatherIcon as MiniWeatherIcon} from 'vue3-mini-weather'
import {useDateFormat, useLocalStorage, useNow} from '@vueuse/core'
import {ElMessageBox} from 'element-plus'
import {casLogout} from '@/api/oauth'
import {useMenuStore} from "@/stores/menu";

const route = useRoute()
const router = useRouter()
const menuStore = useMenuStore()

const datetime = useDateFormat(useNow(), 'YYYY.MM.DD HH:mm')

const userInfo = useLocalStorage('userInfo', { simpleName: '' })

const menus = computed(() => {
  return menuStore.routes.filter((item:any) => item.meta?.isMenu).map(item => {
    return {
      ...item,
      meta: ({
        ...item.meta,
        isActive: route.matched?.[0]?.name === item.name
      }) as RouteMeta
    }
  })
})


const onLogout = () => {
  ElMessageBox.confirm(
      '确定退出登录吗?',
      '退出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
  )
      .then(async () => {
        const {code} = await casLogout()

        if (code === 200) {
          localStorage.removeItem('userInfo')
          localStorage.removeItem('oauthToken')
          localStorage.removeItem('ticket')

          let url = window.location.protocol + '//' + window.location.host
          url = encodeURI(`${import.meta.env.VITE_CAS_BASE_URL}/login?service=${url}`)
          window.location.href = `${import.meta.env.VITE_CAS_BASE_URL}/logout?service=${url}`
        }
      })
}

</script>

<style lang="scss" scoped>
.nav {
  .header-title {
    text-shadow: 1px 4px 12px rgba(33, 22, 19, 0.11);
    background: linear-gradient(0deg, #FFFFFF 0%, #B1C2C7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  ul {
    li {
      cursor: pointer;
      opacity: .4;
      padding: 1.75rem 1rem;
      margin-left: 2rem;
      font-family: YouSheBiaoTiHei;

      &:hover {
        color: #ffffff;
        background: rgb(0, 20, 35, .4);
        opacity: 1;
      }
    }

    .active {
      color: #ffffff;
      background: rgb(0, 20, 35, .4);
      opacity: 1;
    }
  }

  .header-title-en {
    text-shadow: 1px 4px 12px rgba(33, 22, 19, 0.11);
    background: linear-gradient(0deg, #BAC8CD 0%, #FFFFFF 57.763671875%, #B1C2C7 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}

.el-dropdown {
  --el-text-color-regular: #ffffff;

  .el-dropdown-link {
    &:focus-visible {
      outline: none;
    }
  }

}
</style>
