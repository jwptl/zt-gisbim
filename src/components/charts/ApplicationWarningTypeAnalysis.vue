<template>
  <StatisticArea title="应用报警类型分析">
    <div ref="appRef" class="h-[225px]"></div>
  </StatisticArea>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import StatisticArea from '@/views/situation/components/StatisticArea.vue'
import {useEcharts} from '@/composables/useEcharts'
import * as echarts from 'echarts'
import {useIntervalFn} from '@vueuse/core'

const props = withDefaults(defineProps<{
  data?: Array<{
    name: string
    count: number
  }>
}>(), {
  data: () => ([
    {name: '人员', count: 3},
    {name: '机械', count: 5},
    {name: '物资', count: 0},
    {name: '放样', count: 4},
    {name: '地基', count: 1},
    {name: '桥梁', count: 7},
    {name: '路基', count: 2},
    {name: '环境', count: 3},
  ])
})

const warnTypeData = ref(props.data.map(item => ({
  name: item.name,
  value: item.count
})))


const options = {
  animation: true,
  series: [{
    type: 'pie',
    center: ['50%', '50%'],
    radius: ['60%', '80%'],
    color: ['#FEE449', '#00FFFF', '#00FFA8', '#9F17FF', '#FFE400', '#F76F01', '#01A4F7', '#FE2C8A'],
    startAngle: 90,
    labelLine: {
      normal: {
        length: 10
      }
    },
    label: {
      normal: {
        formatter: '{b|{b}} \n {c|{c}}',
        backgroundColor: 'rgba(255, 147, 38, 0)',
        borderColor: 'transparent',
        borderRadius: 4,
        rich: {
          b: {
            color: '#ffffff',
            fontSize: 12,
          },
          c: {
            fontSize: 12,
            color: '#ffffff',
            fontFamily: 'YouSheBiaoTiHei'
          },
        },
        textStyle: {
          color: '#fff',
          fontSize: 12
        }
      }
    },
    data: warnTypeData.value
  }, {
    type: 'pie',
    center: ['50%', '50%'],
    radius: ['53%', '55%'],
    label: {
      show: false
    },
    data: [{
      value: 78,
      name: '实例1',
      itemStyle: {
        normal: {
          color: {
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            type: 'linear',
            global: false,
            colorStops: [{
              offset: 0,
              color: '#9F17FF'
            }, {
              offset: 0.2,
              color: '#01A4F7'
            }, {
              offset: 0.5,
              color: '#FE2C8A'
            }, {
              offset: 0.8,
              color: '#FEE449'
            }, {
              offset: 1,
              color: '#00FFA8'
            }]
          }
        }
      }
    }]
  }]
}

const {appRef, getInstance} = useEcharts(options)

let pieChart: echarts.ECharts
let dataIndex = 0
onMounted(() => {
  pieChart = getInstance()

  const {resume, pause} = useIntervalFn(() => {
    downPlay()
    highlight(dataIndex)

    dataIndex = dataIndex > warnTypeData.value.length * 2 ? 0 : dataIndex + 1
  }, 2000)
  resume()

  pieChart.on('mouseover', (e) => {
    if (e.componentType === 'series') {
      // 停止轮播
      pause()
      downPlay()
      highlight(e.dataIndex)
    }
  })

  pieChart.on('mouseout', (e) => {
    // 重启轮播
    resume()
  })

})

const downPlay = () => {
  for (let i = 0; i < warnTypeData.value.length * 2; i++) {
    pieChart.dispatchAction({
      type: 'downplay',
      seriesIndex: 0,
      dataIndex: i,
    })
  }
}

const highlight = (dataIndex: number) => {
  pieChart.dispatchAction({
    type: 'highlight',
    seriesIndex: 0,
    dataIndex: dataIndex,
  })
}

</script>

<style scoped lang="scss">

</style>
