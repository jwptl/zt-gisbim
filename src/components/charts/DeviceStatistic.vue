<script setup lang="ts">

import StatisticArea from '@/views/situation/components/StatisticArea.vue'
import {ref} from 'vue'
import * as echarts from 'echarts'
import {useEcharts} from '@/composables/useEcharts'


const props = withDefaults(defineProps<{
  data?: {
    deviceCount: number
    deviceTypeCount: number
    deviceQuarterInfoList: Array<{
      quarter: string
      count: number
    }>
  }
}>(), {
  data: () => ({
    deviceCount: 4311,
    deviceTypeCount: 46,
    deviceQuarterInfoList: [
      {quarter: '1', count: 10},
      {quarter: '2', count: 30},
      {quarter: '3', count: 20},
      {quarter: '4', count: 250},
    ]
  })
})

let xLabel = ['一季度', '二季度', '三季度', '四季度',]
let goToSchool = [
  props.data.deviceQuarterInfoList[0]?.count || 0,
  props.data.deviceQuarterInfoList[1]?.count || 0,
  props.data.deviceQuarterInfoList[2]?.count || 0,
  props.data.deviceQuarterInfoList[3]?.count || 0
]

const options = ref({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'transparent',
    axisPointer: {
      lineStyle: {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(126,199,255,0)' // 0% 处的颜色
          }, {
            offset: 0.5,
            color: 'rgba(126,199,255,1)' // 100% 处的颜色
          }, {
            offset: 1,
            color: 'rgba(126,199,255,0)' // 100% 处的颜色
          }],
          global: false // 缺省为 false
        }
      },
    },
    formatter: (p: any) => {
      return `
                <div class="bg-black bg-opacity-50 border-0 text-white px-2 py-1 rounded">${p[0].name}：${p[0].value}</div>
            `
    }
  },
  grid: {
    top: '20%',
    left: '15%',
    right: '10%',
    bottom: '15%',
  },
  xAxis: [{
    type: 'category',
    boundaryGap: false,
    axisLine: { //坐标轴轴线相关设置。数学上的x轴
      show: true,
      lineStyle: {
        color: '#233653'
      },
    },
    axisLabel: { //坐标轴刻度标签的相关设置
      textStyle: {
        color: '#7ec7ff',
        padding: 0,
        fontSize: 12
      },
      formatter: function (data: any) {
        return data
      }
    },
    splitLine: {
      show: true,
      lineStyle: {
        color: '#192a44'
      },
    },
    axisTick: {
      show: false,
    },
    data: xLabel
  }],
  yAxis: [{
    name: '单位/个',
    nameTextStyle: {
      color: '#7ec7ff',
      fontSize: 12,
      padding: 0
    },
    min: 0,
    splitLine: {
      show: true,
      lineStyle: {
        color: '#192a44'
      },
    },
    axisLine: {
      show: true,
      lineStyle: {
        color: '#233653'
      }

    },
    axisLabel: {
      show: true,
      textStyle: {
        color: '#7ec7ff',
        padding: 0
      },
      formatter: function (value: any) {
        return value
      }
    },
    axisTick: {
      show: false,
    },
  }],
  series: [{
    name: '2022年',
    type: 'line',
    symbol: 'circle', // 默认是空心圆（中间是白色的），改成实心圆
    showAllSymbol: true,
    symbolSize: 0,
    smooth: true,
    lineStyle: {
      normal: {
        width: 2,
        color: '#FFC279', // 线条颜色
      }
    },
    itemStyle: {
      color: '#FFC279'
    },
    tooltip: {
      show: true
    },
    areaStyle: { //区域填充样式
      normal: {
        //线性渐变，前4个参数分别是x0,y0,x2,y2(范围0~1);相当于图形包围盒中的百分比。如果最后一个参数是‘true’，则该四个值是绝对像素位置。
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
          offset: 0,
          color: 'rgba(25,163,223,.3)'
        },
          {
            offset: 1,
            color: 'rgba(25,163,223, 0)'
          }
        ], false),
        shadowColor: 'rgba(25,163,223, 0.5)', //阴影颜色
        shadowBlur: 20 //shadowBlur设图形阴影的模糊大小。配合shadowColor,shadowOffsetX/Y, 设置图形的阴影效果。
      }
    },
    data: goToSchool
  }]
})

const {appRef} = useEcharts(options)
</script>

<template>
  <StatisticArea title="北斗设备统计" class="pr-0">
    <div class="flex h-[200px]">
      <div class="flex flex-col justify-between">
        <div class="device w-28 h-24 flex flex-col justify-center items-center">
          <div class="text-2xl mt-4 font-bold">{{ props.data.deviceCount }}</div>
          <div class="flex items-center -mt-2">
            <img src="@/assets/images/index/device-i.png" alt="">
            <div class="text-sm -ml-2">北斗设备</div>
          </div>
        </div>
        <div class="type w-28 h-24 flex flex-col justify-center items-center">
          <div class="text-2xl mt-4 font-bold">{{ props.data.deviceTypeCount }}</div>
          <div class="flex items-center -mt-1">
            <img src="@/assets/images/index/type-i.png" alt="">
            <div class="text-sm -ml-2 w-16 text-center">设备场景类型</div>
          </div>
        </div>
      </div>

      <div ref="appRef" class="ml-4 w-full"></div>
    </div>
  </StatisticArea>
</template>

<style scoped lang="scss">
.device {
  background: url("@/assets/images/index/device-bg.png") no-repeat;
  background-size: 100% 100%;
}

.type {
  background: url("@/assets/images/index/type-bg.png") no-repeat;
  background-size: 100% 100%;
}
</style>
