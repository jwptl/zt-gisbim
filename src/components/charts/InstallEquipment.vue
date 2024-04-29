<script setup lang="ts">
import StatisticArea from '@/views/situation/components/StatisticArea.vue'
import {useEcharts} from '@/composables/useEcharts'
import {computed, ref} from 'vue'

interface List {
  projectOrgName: string
  deviceCount: number
}

interface Data {
  data?: Array<List>
}

const props = withDefaults(defineProps<Data>(), {
  data: () => ([
    {
      projectOrgName: '中铁信科',
      deviceCount: 71.43,
    },
    {
      projectOrgName: '中铁分局',
      deviceCount:90,
    },
  ])
})


const mineArea = computed(() => {
  return props.data.map((item: List) => {
    return {
      areaName: item.projectOrgName,
      count: item.deviceCount
    }
  })
})

const options = {
  animation: true,
  grid: {
    top: '5%',
    bottom: '15%',
    right: '5%'
  },
  tooltip: {
    trigger: 'item',
  },
  xAxis: {
    data: mineArea.value.map(item => item.areaName),
    axisLine: {
      show: false //隐藏X轴轴线
    },
    axisTick: {
      show: false //隐藏X轴轴线
    },
    splitLine: {
      show: false
    },
    axisLabel: {
      interval: 0,
      show: true,
      margin: 14,
      fontSize: 12,
      textStyle: {
        color: '#00D3FF' //X轴文字颜色
      },
      overflow: 'truncate',
      width: 60,
      hideOverlap: false,
    }
  },
  yAxis: [{
    type: 'value',
    gridIndex: 0,
    min: 0,
    splitNumber: 4,
    splitLine: {
      show: true,
      lineStyle: {
        type: 'dashed',
        color: 'rgb(90, 169, 230, .2)',
        width: 2
      },
    },
    axisTick: {
      show: false
    },
    axisLine: {
      show: false
    },
    axisLabel: {
      show: true,
      margin: 14,
      fontSize: 12,
      textStyle: {
        color: '#ffffff'
      }
    }
  }],
  series: [{
    name: '',
    type: 'bar',
    barWidth: 10,
    itemStyle: {
      normal: {
        color: '#6FFFFF'
      }
    },
    data: mineArea.value.map(item => item.count),
    z: 10,
    zlevel: 0,
  },
    {
      // 分隔
      type: 'pictorialBar',
      itemStyle: {
        normal: {
          color: '#071E23'
        }
      },

      symbolMargin: 0,
      symbol: 'rect',
      symbolClip: true,
      symbolSize: [12, 5],
      symbolPosition: 'end',
      symbolOffset: [-2, '150%'],
      data: mineArea.value.map(item => item.count),
      width: 0,
      z: 0,
      zlevel: 1
    },
    {
      name: '',
      type: 'bar',
      barGap: '-110%', // 设置外框粗细
      data: mineArea.value.map(item => item.count),
      barWidth: 16,
      itemStyle: {
        normal: {
          color: 'transparent', // 填充色
          // barBorderRadius: 0, //圆角半径
          label: {
            // 标签显示位置
            show: false,
            position: 'top' // insideTop 或者横向的 insideLeft
          }
        }
      },
      z: 0
    },
    {
      name: '背影',
      type: 'line',
      smooth: false, //平滑曲线显示
      showAllSymbol: false, //显示所有图形。
      symbolSize: 0,
      lineStyle: {
        width: 0
      },
      data: [21, 43, 56, 32, 64],
      z: 5
    }
  ],
  dataZoom: [{
    type: 'slider',
    show: false,
    xAxisIndex: [0],
    endValue: 4,
    startValue: 0
  }]
}

const {appRef} = useEcharts(options)

</script>

<template>
  <StatisticArea title="数字化施工设备安装情况">
    <div ref="appRef" class="h-[225px]"></div>
  </StatisticArea>
</template>

<style scoped lang="scss">

</style>
