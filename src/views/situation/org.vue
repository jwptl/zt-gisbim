<template>
  <div class="relative">
    <div id="mars3dContainer" class="w-full h-screen">
      <template v-if="visible.ready">
        <!--        组织分布-->
        <OrgMap @fetch-chart="fetchChartData" v-model:org-id="orgId" :org-mode="visible.orgMode"/>
        <Boundary />
      </template>
    </div>

    <img class="box w-full h-screen absolute left-0 top-0 z-400 pointer-events-none" src="@/assets/images/index/bg.png"
         alt=""/>

    <Transition leave-active-class="animate__animated animate__bounceOutLeft"
                enter-active-class="animate__animated animate__bounceInLeft">
      <Left v-model:lists="chartsLeft" v-if="visible.showChart"/>
    </Transition>

    <Transition leave-active-class="animate__animated animate__bounceOutRight"
                enter-active-class="animate__animated animate__bounceInRight">
      <Right v-model:lists="chartsRight" v-if="visible.showChart"/>
    </Transition>

    <Transition enter-active-class="animate__animated animate__jackInTheBox">
      <ModeButton v-if="visible.showChart" v-model:org-mode="visible.orgMode"/>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import * as mars3d from 'mars3d'
import {onMounted, onUnmounted, provide, reactive, ref} from 'vue'
import OrgMap from '@/views/situation/components/OrgMap.vue'
import Boundary from '@/views/situation/components/Boundary.vue'
import Left from '@/views/situation/components/Left.vue'
import Right from '@/views/situation/components/Right.vue'
import ModeButton from '@/views/situation/components/ModeButton.vue'
import {useMars} from '@/composables/useMars'
import {getOrgIndicatorList} from '@/api'
import type {ChartData} from '@/api/type'

const orgId = ref('')

const visible = reactive({
  ready: false,
  orgMode: true,
  showChart: false
})

const mapOptions = {
  basemaps: [
    // {name: '天地图', type: 'tdt', layer: 'img_d', show: true, crs: mars3d.CRS.EPSG4326},
    // {name: '天地图', type: 'tdt', layer: 'img_z', show: true, crs: mars3d.CRS.EPSG4326},
    {name: '谷歌影像(WGS84)', type: 'google', layer: 'img_d', show: true},
    // {name: '高清图', show: true, type: 'xyz', url: 'https://gfsjgx.ahbeidou.com:6443/geoscene/rest/services/anhui_quanyu/MapServer'},

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

onMounted(() => {
  map = initMap('mars3dContainer', mapOptions)
  visible.ready = true
  // 开场动画
  map.openFlyAnimation({
    center: {lng: 109.551636, lat: 33.529256, alt: 4300000}
  }).then(() => {
    visible.showChart = true
  })

  fetchChartData()
})

const chartsLeft = ref<ChartData[]>([])
const chartsRight = ref<ChartData[]>([])
const fetchChartData = async () => {
  visible.showChart = false
  const {code, result} = await getOrgIndicatorList(orgId.value)

  if (code === 200) {
    chartsLeft.value = result.list?.slice(0, 3) || []
    chartsRight.value = result.list?.slice(3) || []
    visible.showChart = true
  }
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
