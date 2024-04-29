<script setup lang="ts">
import StatisticArea from '@/views/situation/components/StatisticArea.vue'
import {useEcharts} from '@/composables/useEcharts'
import * as echarts from 'echarts'
import {ref} from 'vue'

const data = [
  {
    name: '人员设备',
    value: 10,
    sum: 10
  },
  {
    name: '机械设备',
    value: 20,
    sum: 10
  },
  {
    name: '物资设备',
    value: 23,
    sum: 50
  }
]

const options = ref({
  grid: {
    top: 24,
    bottom: -30,
    right: -60,
    left: 0,
    containLabel: true
  },
  xAxis: {
    show: false
  },
  yAxis: [{
    triggerEvent: true,
    show: true,
    inverse: true,
    data: data.map(item => item.name),
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      show: false,
    },
  }, {
    triggerEvent: true,
    show: true,
    inverse: true,
    data: data.map(item => item.name),
    axisLine: {
      show: false
    },
    splitLine: {
      show: false
    },
    axisTick: {
      show: false
    },
    axisLabel: {
      interval: 0,
      color: '#CED4E8',
      align: 'right',
      verticalAlign: 'bottom',
      lineHeight: 30,
      fontSize: 14,
      formatter: function (value:any, index:number) {
        return '上线率 ' + data[index].sum
      },
    }
  }],
  series: [{
    name: 'XXX',
    type: 'pictorialBar',
    symbol: 'image://data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADoAAAA6CAMAAADWZboaAAAAZlBMVEUAAABe3uVe3+Vf3uVf3+Zf3uVg3+Zg3+Zf3+Vi4OZh4OZg3+Z86/Bh3+Zi4Odj4Odi4OZ86/B76/B86/Bj4ed56+9x5+xn4umB7/N87PB36e+A7/N+7fF/7vJ/7vJ+7fGA7/OB7/PReX+lAAAAIXRSTlMABQkVDREmIhk3MR10LEFFPHh7cUprXE35h2XnqMLAp+mHAG9cAAAB5ElEQVRIx83WjU7CMBQFYIoiKMqU/XUboHv/l/Tce7t2XamDNSacETEmX86tlK2rx4py150o+MstMBLwWRfHKo6JCVxLnvmFGBjFQ58oF1//sUZhGy/ClSTWObgnL4O+bkeN4nY2okfNMbkRt9/vtxz8InoTsWplJSCzFxPmO8+GpSIByX3YQAuGDWtRKhKjCnxDXhF6Z4yxnZ20Wgko7BMRDmxtSGVaI4kdTIgb+zTYoJQlIMlDlmUFgrcDWWC201qSayqlTkiCddWWeV62VU0YlnpRi9VOKaSUsiyq/N0krwq2Ugt7lVpZl5BfHNiytjagMi+XYp0kCR45hMlivVQrE/uU5pXSrCB5bM6d1t2lOZItMqmliT3q5uVxqxzyW/ccfYLNKx7ZTeykMvNyac2yt2Fbc61MHLSC0rwoxbiNdlQ3GBm1NLHQsHUrtEXppR/ljNpW6DbSCoqlFiVoN6YdaFlgsSFVPs1BdT8OaB5QyQzVcaqWDows/zepxR8ObLglTrdtCRVuRNj4Rrxh+//0ke2f8KVL+Kon3GCSbmsJN9OUW3j6g0Ns+LgCij2u0h+Sghc8mlMPBMgdx5DFh59VmOVHrvmDnoNxCz3J7MFWsMuaLyR089xz/xhlfijvwutR8gv3zk6BLUUeCgAAAABJRU5ErkJggg==',
    symbolSize: [50, 50],
    symbolOffset: [20, 0],
    z: 12,
    itemStyle: {
      normal: {
        color: '#14b1eb'
      }
    },
    data: data.map(item => {
      return {
        value: item.value,
        symbolPosition: 'end'
      }
    })
  }, {
    name: '条',
    type: 'bar',
    showBackground: true,
    barBorderRadius: 30,
    yAxisIndex: 0,
    data: data,
    barWidth: 4,
    // align: left,
    itemStyle: {
      normal: {
        color: new echarts.graphic.LinearGradient(
            0,
            0,
            1,
            0,
            [{
              offset: 0,
              color: '#896334'
            },
              {
                offset: 0.5,
                color: '#D8A96F'
              },
              {
                offset: 1,
                color: '#F2E8D9'
              }
            ],
            false
        ),
        barBorderRadius: 10
      },
      // color: '#A71A2B',
      barBorderRadius: 4,
    },
    label: {
      normal: {
        color: '#CED4E8',
        show: true,
        position: [0, '-20px'],
        textStyle: {
          fontSize: 14
        },
        formatter: function (a:any, b:any) {
          return a.name + ' ' + a.value
        }
      }
    }
  }]
})

const {appRef} = useEcharts(options)

</script>

<template>
  <StatisticArea title="北斗设备概况">
    <div>
      <div class="flex justify-between items-center">
        <div>北斗设备总数：</div>
        <div class="flex items-center gap-2">
          <div class="font-ysbth text-2xl">42344</div>
          <div class="w-8">台套</div>
        </div>
      </div>

      <div class="flex justify-between items-center">
        <div>设备应用场景：</div>
        <div class="flex items-center gap-2">
          <div class="font-ysbth text-2xl">2344</div>
          <div class="w-8">处</div>
        </div>
      </div>

      <div ref="appRef" class="h-32 w-full"></div>
    </div>
  </StatisticArea>
</template>

<style scoped>

</style>
