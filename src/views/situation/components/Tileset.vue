<script setup lang="ts">
import {getBimModel} from '@/api'
import {inject, onMounted, onUnmounted} from 'vue'
import {useMars} from '@/composables/useMars'
import {nth} from 'lodash-es'
import * as mars3d from 'mars3d'
import {useUrlSearchParams} from '@vueuse/core'

// 获取路由参数
const params = useUrlSearchParams<{ orgId: string }>()

const mapKey = inject<symbol>('mapKey') as symbol
const {map} = useMars(mapKey)

onMounted(() => {
  fetchData()
})

let tilesetLayers: Array<mars3d.layer.TilesetLayer> = []

const fetchData = async () => {
  const {code, result} = await getBimModel(params.orgId || '')

  if (code === 200) {
    result.forEach(item => {
      const tiles3dLayer = new mars3d.layer.TilesetLayer({
        url: item.dataUrl,
        maximumScreenSpaceError: 2,
        position: {
          lng: item.lng,
          lat: item.lat,
          alt: item.alt
        }
      })

      tiles3dLayer.addTo(map)

      // 存储图层，方便后续删除
      tilesetLayers.push(tiles3dLayer)
    })

    nth(tilesetLayers, -1)?.flyTo()
  }
}

// 删除图层
onUnmounted(() => {
  tilesetLayers.forEach(item => {
    item.destroy()
  })

  tilesetLayers = []
})

</script>

<template>

</template>

<style scoped lang="scss">

</style>
