<script setup lang="ts">
import zhCn from "element-plus/lib/locale/lang/zh-cn";
import {RouterView, useRoute} from 'vue-router'
import Header from '@/layout/Header.vue'
import SideNav from '@/layout/SideNav.vue'

const route = useRoute()
const locale = zhCn
</script>

<template>
  <el-config-provider :locale="locale">
    <el-container class="min-h-screen w-full">
      <el-header>
        <Header/>
      </el-header>
      <el-container class="min-h-full">
        <el-aside class="min-h-full">
          <SideNav/>
        </el-aside>
        <el-main :class="['min-h-full bg-[#283F5F] pt-0', route.meta.isFullscreen ? 'p-0 px-0' : 'px-8']">
          <RouterView/>
        </el-main>
      </el-container>
    </el-container>
  </el-config-provider>
</template>

<style scoped>
.el-header {
  --el-header-padding: 0;
  --el-header-height: auto;
}

.el-aside {
  width: auto;
}


</style>
