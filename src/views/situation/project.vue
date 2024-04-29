<template>
  <div class="relative">
    <div id="mars3dContainer" class="h-screen">
      <template v-if="visible.ready">
        <DynamicModel/>
        <Tileset/>
      </template>
    </div>
    <img class="box w-full h-screen absolute left-0 top-0 z-400 pointer-events-none" src="@/assets/images/index/bg.png"
         alt=""/>

    <img @click="onBack" v-if="params.orgId" class="absolute left-1/4 top-28 z-400 cursor-pointer"
         src="@/assets/images/index/back.png" alt="">

    <Transition leave-active-class="animate__animated animate__bounceOutLeft"
                enter-active-class="animate__animated animate__bounceInLeft">
      <Left v-model:lists="chartsLeft" v-if="visible.showChart && chartsLeft.length"/>
    </Transition>

    <Transition leave-active-class="animate__animated animate__bounceOutRight"
                enter-active-class="animate__animated animate__bounceInRight">
      <Right v-model:lists="chartsRight" v-if="visible.showChart && chartsRight.length"/>
    </Transition>

    <Transition enter-active-class="animate__animated animate__fadeIn">
      <ul v-if="visible.showChart"
          class="absolute left-1/2 -translate-x-1/2 bottom-16 z-400 bg-[rgba(0,20,35,0.4)] px-10 py-2 rounded flex gap-10">
        <li @click="dataType = menu.type" v-for="menu in dataMenus" :key="menu.type"
            :class="['text-sm text-center cursor-pointer', menu.type === dataType ? '' : 'opacity-50']">
          <img class="mx-auto h-5 w-5 mb-0.5" :src="menu.image" alt="">
          <div>{{ menu.name }}</div>
        </li>
      </ul>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import * as mars3d from 'mars3d'
import {onMounted, onUnmounted, provide, reactive, ref, watch} from 'vue'
import Left from '@/views/situation/components/Left.vue'
import Right from '@/views/situation/components/Right.vue'
import Tileset from '@/views/situation/components/Tileset.vue'
import DynamicModel from '@/views/situation/components/DynamicModel.vue'
import {useMars} from '@/composables/useMars'
import overviewBtn from '@/assets/images/index/overview-btn.png'
import userBtn from '@/assets/images/index/user-btn.png'
import machineryBtn from '@/assets/images/index/machinery-btn.png'
import materialBtn from '@/assets/images/index/material-btn.png'
import fangBtn from '@/assets/images/index/fang-btn.png'
import foundationBtn from '@/assets/images/index/foundation-btn.png'
import bridgeBtn from '@/assets/images/index/bridge-btn.png'
import subgradeBtn from '@/assets/images/index/subgrade-btn.png'
import environmentBtn from '@/assets/images/index/environment-btn.png'
import {useUrlSearchParams} from '@vueuse/core'
import {useRouter} from 'vue-router'
import type {ChartData} from '@/api/type'
import {getIndicatorList} from '@/api'

const dataType = ref('2')
const dataMenus = [
  {name: '总览', type: '2', image: overviewBtn},
  {name: '人员', type: '3', image: userBtn},
  {name: '机械', type: '4', image: machineryBtn},
  {name: '物资', type: '5', image: materialBtn},
  {name: '放样', type: '6', image: fangBtn},
  {name: '地基', type: '7', image: foundationBtn},
  {name: '桥梁', type: '8', image: bridgeBtn},
  {name: '路基', type: '9', image: subgradeBtn},
  {name: '环境', type: '10', image: environmentBtn},
]

// 获取路由参数
const params = useUrlSearchParams<{ orgId: string }>()

const visible = reactive({
  ready: false,
  orgMode: true,
  showChart: false
})

const mapOptions = {
  basemaps: [
    {name: '天地图', type: 'tdt', layer: 'img_d', show: true, crs: mars3d.CRS.EPSG4326},
    // {name: '天地图', type: 'tdt', layer: 'img_z', show: true, crs: mars3d.CRS.EPSG4326},
    // {name: '谷歌影像(WGS84)', type: 'google', layer: 'img_d', show: true}
  ],
  terrain: {
    url: 'http://data.mars3d.cn/terrain',
    show: true
  },
  control: {
    locationBar: {
      fps: true
    }
  }
}

// 生成当前地图的唯一标识
const mapKey = Symbol('mapKey')
// 传递给子组件
provide('mapKey', mapKey)

const {initMap, destroy} = useMars(mapKey)

// 地图实例
let map: mars3d.Map

const chartsLeft = ref<ChartData[]>([])
const chartsRight = ref<ChartData[]>([])
onMounted(() => {
  map = initMap('mars3dContainer', mapOptions)

  visible.ready = true

  // 开场动画
  map.openFlyAnimation({
    center: {lng: 109.551636, lat: 33.529256, alt: 4300000}
  }).then(() => {
    fetchChartData()
  })

})

const fetchChartData = async () => {
  visible.showChart = false
  const {code, result} = await getIndicatorList({orgId: params.orgId || '', sId: dataType.value})

  if (code === 200) {
    chartsLeft.value = result?.slice(0, 3) || []
    chartsRight.value = result?.slice(3) || []
    visible.showChart = true

    const basicProjectInfo = result.find(item => item.type === 'BasicProjectInfo')

    if (basicProjectInfo && basicProjectInfo.data?.record?.longitude && basicProjectInfo.data?.record?.latitude) {
      await map.flyToPoint(new mars3d.LngLatPoint(basicProjectInfo.data.record.longitude, basicProjectInfo.data.record.latitude), {radius: 5000})
    }
  }
}

// 重新获取指标数据
watch(dataType, fetchChartData)

const router = useRouter()
const onBack = () => {
  router.push({
    name: 'situation-org',
    query: {
      // orgId: params.orgId
    }
  })
}

onUnmounted(() => {
  destroy()
})
</script>

<style lang="scss" scoped>

.divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, #8EA6CD, #3D4E6A);
  opacity: 0.3;
}
</style>
