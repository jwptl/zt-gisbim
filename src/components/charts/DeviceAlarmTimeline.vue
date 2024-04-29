<script setup lang="ts">
// @ts-nocheck
import { ScrollBoard } from '@kjgl77/datav-vue3'
import StatisticArea from '@/views/situation/components/StatisticArea.vue'

const props = withDefaults(defineProps<{
  data?: Array<{
    alarmType: string
    eventDate: string
  }>
}>(), {
  data: () => ([
    {
      alarmType: 'xxxxxx报警',
      eventDate: '01-12 12:20:30',
    },
    {
      alarmType: 'xxxxxx报警',
      eventDate: '01-12 12:20:30',
    },
    {
      alarmType: 'xxxxxx报警',
      eventDate: '01-12 12:20:30',
    },
    {
      alarmType: 'xxxxxx报警',
      eventDate: '01-12 12:20:30',
    },
    {
      alarmType: 'xxxxxx报警',
      eventDate: '01-12 12:20:30',
    },
    {
      alarmType: 'xxxxxx报警',
      eventDate: '01-12 12:20:30',
    }
  ])
})

const config = {
  default: '暂无数据',
  type: 'scrollBoard',
  style: {
    height: '230px',
  },
  headerBGC: 'rgba(11, 26, 52, .7)',
  oddRowBGC: 'rgba(9, 24, 45, .3)',
  evenRowBGC: 'rgba(9, 24, 45, .5)',
  header: ['序号', '报警内容', '报警时间'],
  data: props.data.map((item, index) => [index + 1, item.alarmType, item.eventDate]),
  columnWidth: [50, 200, 100],
  align: ['center', 'center', 'center'],
}
</script>

<template>
  <StatisticArea title="北斗设备报警时间轴">
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
