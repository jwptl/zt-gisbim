<script setup lang="ts">
// @ts-nocheck
import {ScrollBoard} from '@kjgl77/datav-vue3'
import StatisticArea from '@/views/situation/components/StatisticArea.vue'

interface List {
  projectOrgName: string
  onlinePercent: number
  onlineCount: number
}

interface Data {
  data?: Array<List>
}

const props = withDefaults(defineProps<Data>(), {
  data: () => ([
    {
      'projectOrgName': '项目部1',
      'onlinePercent': 50.00,
      'onlineCount': 1
    },
    {
      'projectOrgName': '项目部2',
      'onlinePercent': 50.00,
      'onlineCount': 2
    },
    {
      'projectOrgName': '项目部3',
      'onlinePercent': 0,
      'onlineCount': 0
    }, {
      'projectOrgName': '项目部4',
      'onlinePercent': 0,
      'onlineCount': 0
    },
    {
      'projectOrgName': '项目部5',
      'onlinePercent': 100.00,
      'onlineCount': 1
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
  header: ['机构名称', '上线量', '上线率'],
  data: props.data.map((item: List) => {
    return [`<span title="${item.deviceType}">${item.projectOrgName}</span>`, String(item.onlineCount) + '台', String(item.onlinePercent) + '%']
  }),
  columnWidth: [200, 80, 80],
  align: ['center', 'center', 'center'],
}


</script>

<template>
  <StatisticArea title="北斗设备上线情况">
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
