<script setup lang="ts">

import {useVModel} from '@vueuse/core'

const props = defineProps<{
  orgMode: boolean
}>()

const orgMode = useVModel(props, 'orgMode')
</script>

<template>
<div class="absolute bottom-8 left-1/4 flex gap-1 cursor-pointer z-400">
  <div @click="orgMode = true" :class="['flex bg-opacity-50 items-center p-1', orgMode ? 'bg-[#5A9FFA]' : 'bg-[#000000]']">
    <img class="w-4 h-4" src="@/assets/images/index/org-btn.png" alt="">
    <div :class="['font-bold text-sm ml-1', orgMode ? '' : 'text-gray-500']">组织模式</div>
  </div>
  <div @click="orgMode = false" :class="['flex bg-opacity-50 items-center p-1', !orgMode ? 'bg-[#5A9FFA]' : 'bg-[#000000]']">
    <img class="w-4 h-4" src="@/assets/images/index/project-btn.png" alt="">
    <div :class="['font-bold text-sm ml-1', !orgMode ? '' : 'text-gray-500']">项目模式</div>
  </div>
</div>
</template>

<style scoped lang="scss">

</style>
