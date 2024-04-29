<script setup lang="ts">
import {computed} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute()

const sideNavs = computed(() => {
  return route.matched?.[0] ? route.matched?.[0].children?.filter(item => item.meta?.isSide) : []
})

</script>

<template>
  <el-menu
      v-if="sideNavs.length"
      :default-active="route.path"
      router
      class="h-full px-8 font-ysbth text-2xl"
      background-color="#283F5F"
  >
    <template :key="sideNav.name" v-for="sideNav in sideNavs">
      <el-sub-menu v-if="sideNav.children?.length" :index="sideNav.path">
        <template #title>
          <span class="text-xl">{{ sideNav?.meta?.title }}</span>
        </template>
        <el-menu-item class="text-lg" :key="child.name" v-for="child in sideNav.children.filter(item => item.meta?.isSide !== false)" :index="child.path">{{ child?.meta?.title }}</el-menu-item>
      </el-sub-menu>
      <el-menu-item v-else :index="sideNav.path">
        <span class="text-xl">{{ sideNav?.meta?.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>

<style lang="scss" scoped>

</style>
