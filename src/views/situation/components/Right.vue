<script setup lang="ts">
import {computed, markRaw, ref} from 'vue'
import type {Component} from 'vue'
import {useVModel} from '@vueuse/core'
import type {ChartData} from '@/api/type'

const props = defineProps<{
  lists: ChartData[]
}>()

const index = ref(0)
// 导入所有指标库
const lists = useVModel(props, 'lists')

const modules: Record<string, any> = import.meta.glob('/src/components/charts/*.vue', {eager: true})
const components: Array<{name: string, component: Component}> = []

for (const modulesKey in modules) {
  const name = modulesKey.split('/')[4].split('.')[0]

  if (props.lists.find(item => item.type === name)) {
    components.push({
      name,
      component: modules[modulesKey].default || modules[modulesKey]
    })
  }
}

const componentList = computed(() => {
  return lists.value.slice(index.value, index.value + 3).map((item:any) => {
    const foundComponent = components.find(component => component.name === item.type)
    const component = foundComponent ? markRaw(foundComponent.component) : null
    return {
      ...item,
      component: component
    }
  })
})

const prev = () => {
  if (index.value > 0) {
    index.value--
  }
}

const next = () => {
  if (index.value < lists.value.length - 3) {
    index.value++
  }
}
</script>

<template>

  <div class="box absolute right-8 top-28 z-500 w-1/5 flex flex-col gap-5">
    <img v-if="index" @click="prev" class="absolute -left-12 cursor-pointer" src="@/assets/images/index/arrow-top.png"
         alt="">
    <img v-if="index < lists.length - 3" @click="next" class="absolute bottom-0 -left-12 cursor-pointer"
         src="@/assets/images/index/arrow-bottom.png"
         alt="">
    <component :data="component.data.record || component.data" :key="component.name" v-for="component in componentList" :is="component.component"/>
  </div>

</template>

<style scoped>
.box {
  height: calc(100% - 10rem);
}
</style>
