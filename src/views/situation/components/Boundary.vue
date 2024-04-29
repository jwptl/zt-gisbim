<script setup lang="ts">
import {useMars} from '@/composables/useMars'
import {inject} from 'vue'
import * as mars3d from 'mars3d'
import fenceLine from '@/assets/images/index/fence-line.png'
import {simplify} from '@turf/turf'
import type {AllGeoJSON} from '@turf/turf'

const mapKey = inject<symbol>('mapKey') as symbol
const {map} = useMars(mapKey)

const graphicLayer = new mars3d.layer.GeoJsonLayer({
  name: '全国省界',
  url: '/100000_full.json',
  format: (geojson: AllGeoJSON) => {
    try {
      return simplify(geojson, {tolerance: 0.0001, highQuality: true, mutate: true})
    } catch (e) {
      //
    }
  }, // 用于自定义处理geojson
  symbol: {
    type: 'polylineP',
    styleOptions: {
      width: 1,
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        color: '#00ffff',
        image: fenceLine,
        speed: 10,
        repeat_x: 10
      },
      distanceDisplayCondition: true,
      distanceDisplayCondition_far: 12000000,
      distanceDisplayCondition_near: 100000,
    }
  },
  flyTo: true
})
map.addLayer(graphicLayer)
</script>

<template>

</template>

<style scoped lang="scss">

</style>
