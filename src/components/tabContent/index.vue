<!--tabs切换组件-->
<template>
  <div class="tabs">
    <span v-for="(item,index) in tabs" :class="useCurrent === index ? 'active' : ''"
          @click="onChangeTab(index,item)">{{ item.label }}</span>
  </div>
</template>

<script lang="ts" setup>
import {useVModel} from "@vueuse/core";

interface TabItem {
  value: string
  label: string
}

interface TabsProps {
  tabs: Array<TabItem>
  tabCurrent: number
}

const emits = defineEmits(['update:tabCurrent', 'change'])

const props = withDefaults(defineProps<TabsProps>(), {
  tabs: (() => []),
  tabCurrent: 0,
});
const useCurrent = useVModel(props, 'tabCurrent')
const onChangeTab = (i: number, item: TabItem) => {
  useCurrent.value = i
  emits('change', item.value)
}

</script>

<style scoped lang="scss">
.tabs {
  display: flex;
  border-radius: 4px;

  span {
    display: block;
    height: 60px;
    box-sizing: border-box;
    line-height: 60px;
    color: #ADCEE7;
    font-size: 14px;
    cursor: pointer;
    box-sizing: border-box;
    margin-right: 50px;
  }

  .active {
    color: #FFFFFF;
    border-bottom: 3px solid #329CFF;
    box-sizing: border-box;
  }
}
</style>
