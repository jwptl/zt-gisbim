<template>
  <StatisticArea title="桥梁完成率" style="position: relative">
    <div ref="appRef" class="h-[200px]"></div>
    <div class="perLine">
      <span>桥梁完成率：<a class="font-ysbth">{{20}}%</a> </span>
    </div>
  </StatisticArea>
</template>

<script setup lang="ts">
import StatisticArea from '@/views/situation/components/StatisticArea.vue'
import {useEcharts} from '@/composables/useEcharts'

const options = {
  backgroundColor: '',
  series: [
    {
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      progress: {
        show: true,
        width: 10,
        itemStyle: {
          // 进度条的颜色
          color: '#3ED3DC',
          borderColor: '#3ED3DC'
        }
      },
      axisLine: {
        lineStyle: {
          width: 10,
          color: [[1, '#16405A']]
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        length: 15,
        lineStyle: {
          width: 2,
          color: '#ADCEE7'
        }
      },
      axisLabel: {
        distance: -50,
        color: '#ADCEE7',
        fontSize: 12
      },
      anchor: {
        show: true,
        showAbove: true,
        size: 10,
        itemStyle: {
          borderWidth: 10
        }
      },
      title: {
        show: false
      },
      detail: {
        show: false,
      },
      pointer: {
        width: 10,
        itemStyle: {
          color: '#7CBEBE'
        }
      },
      data: [
        {
          value:'20%'
        }
      ]
    }
  ]
}

const {appRef} = useEcharts(options)
//计算百分比
const fixedPercent = (allCount: number, count: number) => {
  if (allCount === 0) {
    return 0;
  }
  const percent = count / allCount * 100;
  if (percent < 1) {
    return percent.toFixed(1);
  }
  return percent.toFixed(0);
}

</script>

<style scoped lang="scss">
.perLine {
  position: absolute;
  bottom:40px;
  left: 50%;
  transform: translate(-50%);
  span {
    color: #CED4E8;
    font-size: 14px;
    a {
      color: #FFBB55;
      font-size: 22px;
      margin-left: 40px;
    }
  }
}

</style>
