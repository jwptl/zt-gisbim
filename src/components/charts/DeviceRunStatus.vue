<script setup lang="ts">
// @ts-nocheck
import {ScrollBoard} from '@kjgl77/datav-vue3'
import StatisticArea from '@/views/situation/components/StatisticArea.vue'
import {computed} from "vue";

interface List {
  deviceType: string
  totalCount: number
  onlinePercent: number,
  onlineCount: number
}

interface Data {
  data?: Array<List>
}

const props = withDefaults(defineProps<Data>(), {
  data: () => ([
    {
      "deviceType": "北斗智能安全帽BDA20B",
      "totalCount": 2,
      "onlinePercent": 50.00,
      "onlineCount": 1
    },
    {
      "deviceType": "北斗智能安全帽BDA20A",
      "totalCount": 4,
      "onlinePercent": 50.00,
      "onlineCount": 2
    },
    {
      "deviceType": "北斗高精度安全帽BDA20G",
      "totalCount": 2,
      "onlinePercent": 0,
      "onlineCount": 0
    }, {
      "deviceType": "川藏_健康模块安全帽BDA20J",
      "totalCount": 1,
      "onlinePercent": 0,
      "onlineCount": 0
    },
    {
      "deviceType": "北斗安全帽基础定位版BDA20",
      "totalCount": 1,
      "onlinePercent": 100.00,
      "onlineCount": 1
    },
    {
      "deviceType": "AR眼镜B-15",
      "totalCount": 1,
      "onlinePercent": 0,
      "onlineCount": 0
    },
    {
      "deviceType": "北斗高精度穿戴式终端QboxS10",
      "totalCount": 3,
      "onlinePercent": 0,
      "onlineCount": 0
    },
    {
      "deviceType": "北斗高精度车载终端分米级BDC01DM",
      "totalCount": 1,
      "onlinePercent": 100.00,
      "onlineCount": 1
    },
  ])
})

const deviceList = computed(() => {
  const list = []
  props.data.forEach((item: List) => {
    const dataItem = [`<span title="${item.deviceType}">${item.deviceType}</span>`, String(item.totalCount), String(item.onlineCount), String(item.onlinePercent) + '%']
    list.push(dataItem)
  })
  return list
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
  header: ['设备类型', '总数', '上线量', '上线率'],
  data: deviceList.value,
  columnWidth: [130, 80, 80, 80],
  align: ['center', 'center', 'center', 'center'],
}

</script>

<template>
  <StatisticArea title="当前北斗设备运行情况">
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
