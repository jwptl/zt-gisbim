<script setup lang="ts">
// @ts-nocheck
import {ScrollBoard} from '@kjgl77/datav-vue3'
import StatisticArea from '@/views/situation/components/StatisticArea.vue'

const props = withDefaults(defineProps<{
  data?: Array<{
    projectOrgName: string
    alartmCount: number
  }>
}>(), {
  data: () => ([
    {projectOrgName: '中铁一局', alartmCount: 636464},
    {projectOrgName: '中铁二局', alartmCount: 636464},
    {projectOrgName: '中铁三局', alartmCount: 636464},
    {projectOrgName: '中铁四局', alartmCount: 636464},
    {projectOrgName: '中铁五局', alartmCount: 636464},
  ])
})

const config = {
  default: '暂无数据',
  type: 'scrollBoard',
  headerBGC: 'rgba(11, 26, 52, .7)',
  oddRowBGC: 'rgba(9, 24, 45, .3)',
  evenRowBGC: 'rgba(9, 24, 45, .5)',
  header: ['排名', '机构名称', '年报警次数'],
  data: props.data.map((item, index) => [index + 1, `<span title="${item.deviceType}">${item.projectOrgName}</span>`, item.alartmCount]),
  columnWidth: [60, 200, 100],
  align: ['center', 'center', 'center'],
}
</script>

<template>
  <StatisticArea title="数字化施工安全情况">
    <div class="h-[230px] -mt-2">
      <ScrollBoard :config="config"/>
    </div>
  </StatisticArea>
</template>

<style scoped lang="scss">
.dv-scroll-board {
  :deep(.row-item) {
    margin: 0.1rem 0;

    .ceil:first-child {
      font-style: italic;
    }

    .ceil:last-child {
      color: #02FFFF;
    }
  }
}
</style>
