<template>
  <div class="box absolute left-8 top-28 z-500 w-1/5 flex flex-col gap-5">
    <component :data="component.data.record || component.data" :key="component.name" v-for="component in componentList"
               :is="component.component"/>
  </div>
</template>

<script setup lang="ts">
import {computed, markRaw} from 'vue'
import type {Component} from 'vue'
import {useVModel} from '@vueuse/core'
import type {ChartData} from '@/api/type'

const props = defineProps<{
  lists: ChartData[]
}>()

const lists = useVModel(props, 'lists')

const modules: Record<string, any> = import.meta.glob('/src/components/charts/*.vue', {eager: true})
const components: Array<{ name: string, component: Component }> = []

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
  return lists.value.map((item: ChartData) => {
    const foundComponent = components.find(component => component.name === item.type)
    const component = foundComponent ? markRaw(foundComponent.component) : null
    return {
      ...item,
      component: component
    }
  })
})

</script>

<style scoped>
.box {
  height: calc(100% - 10rem);
}
</style>
