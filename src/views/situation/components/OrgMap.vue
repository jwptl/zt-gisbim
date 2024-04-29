<script setup lang="ts">
import 'mars3d-echarts'
import {getOrgInfo, queryOrgMapList} from '@/api'
import {useMars} from '@/composables/useMars'
import {inject, watch, ref, onUnmounted} from 'vue'
import * as mars3d from 'mars3d'
import ORGICON from '@/assets/images/index/org-icon.png'
import HEADQUARTERSICON from '@/assets/images/index/headquarters-icon.png'
import LINEGradual from '@/assets/images/index/line-gradual.png'
import type {OrgInfo, OrgMap} from '@/api/type'
import {useRouter} from 'vue-router'
import {ElMessage} from 'element-plus'
import {useUrlSearchParams, useVModel} from '@vueuse/core'

const props = defineProps<{
  orgMode: boolean
  orgId: string
}>()

// 路由参数
const params = useUrlSearchParams<{ orgId: string }>()

// 到当前层级使用到的所有orgId
const orgIdList = ref<string[]>([])

const mapKey = inject<symbol>('mapKey') as symbol
const {initGraphicLayer, map} = useMars(mapKey)
const graphicLayer = initGraphicLayer()

const infoBoxRef = ref<HTMLDivElement>()

const orgInfo = ref<OrgInfo>({} as OrgInfo)
const orgId = useVModel(props, 'orgId')

const router = useRouter()

const mouseOverId = ref('')
// 添加图标点
const addIcon = (data: OrgMap) => {
  const graphic = new mars3d.graphic.BillboardEntity({
    id: data.orgId,
    position: new mars3d.LngLatPoint(data.longitude, data.latitude, 0),
    style: {
      image: data.isCenter ? HEADQUARTERSICON : ORGICON,
      scale: 1.0,
      horizontalOrigin: mars3d.Cesium.HorizontalOrigin.CENTER,
      verticalOrigin: mars3d.Cesium.VerticalOrigin.BOTTOM,
      clampToGround: true,

      label: {
        text: data.name,
        pixelOffsetY: -50,
        font_size: 36,
        scale: 0.5,
      },
      // 高亮时的样式（默认为鼠标移入，也可以指定type:'click'单击高亮），构造后也可以openHighlight、closeHighlight方法来手动调用
      highlight: {
        scale: 1.5
      }
    },
    attr: data
  })
      .bindTooltip(async (event) => {
        const {code, result} = await getOrgInfo(event.id)

        // 防止鼠标移出后还显示弹窗
        if (code === 200 && mouseOverId.value === event.id) {
          orgInfo.value = result
        }
        return infoBoxRef.value
      }, {offsetY: -50})
      .on(mars3d.EventType.click, (event: any) => {

        // 点击机构进入下一层级
        if (event.graphic.options.attr.type === 'org' && !event.graphic.options.attr.isCenter) {
          orgId.value = event.graphic.options.attr.orgId
          setTimeout(() => {
            fetchData()
          })
        }

        // 点击项目进入项目大屏
        if (event.graphic.options.attr.type === 'project') {
          router.push({
            name: 'situation-project',
            query: {
              orgId: event.graphic.options.attr.orgId,
            }
          })
        }

      })
      .on(mars3d.EventType.mouseOver, (event: any) => {
        mouseOverId.value = event.graphic.id
      })
      .on(mars3d.EventType.mouseOut, (event: any) => {
        mouseOverId.value = ''
      })

  graphicLayer.addGraphic(graphic)
}

// 添加飞线
const addFlyLine = (center: OrgMap, data: OrgMap) => {
  const startPoint = mars3d.Cesium.Cartesian3.fromDegrees(center.longitude, center.latitude, 0)
  const endPoint = mars3d.Cesium.Cartesian3.fromDegrees(data.longitude, data.latitude, 0)
  const positions = mars3d.PolyUtil.getLinkedPointList(startPoint, endPoint, 20000, 50) // 计算曲线点

  const graphic = new mars3d.graphic.PolylineEntity({
    positions: positions,
    style: {
      width: 4,
      // 动画线材质
      materialType: mars3d.MaterialType.LineFlow,
      materialOptions: {
        image: LINEGradual,
        color: '#66bd63',
        repeat: new mars3d.Cesium.Cartesian2(1, 1),
        speed: 15
      }
    },
    attr: data
  })
  graphicLayer.addGraphic(graphic)
}

const emits = defineEmits<{
  (e: 'fetchChart'): void
}>()

const fetchData = async () => {
  const {code, result} = await queryOrgMapList({type: props.orgMode ? 'org' : 'project', orgId: orgId.value})
  if (code === 200) {

    if (result.orgMapList.length === 0) {
      ElMessage.info('暂无下级数据')
      return
    }

    emits('fetchChart')
    if (!orgIdList.value.includes(orgId.value)) {
      if (orgId.value) {
        orgIdList.value.push(orgId.value)
      } else {
        orgIdList.value.push('')
      }
    }

    graphicLayer.clear()

    const center = result.orgMapList.find(data => data.isCenter) || {} as OrgMap
    result.orgMapList.forEach(item => {
      // 添加图标点
      addIcon(item)

      // 添加飞线
      if (result.orgMapList.length > 1 && !item.isCenter) {
        addFlyLine(center || {} as OrgMap, item)
      }
    })
  }
}

watch(() => props.orgMode, () => {
  graphicLayer.clear()
  // 请求数据
  fetchData()
}, {immediate: true})

// 返回上一层级
const onBack = () => {
  orgIdList.value.pop()
  orgId.value = orgIdList.value[orgIdList.value.length - 1]
  graphicLayer.clear()

  // 重新加载数据
  setTimeout(() => {
    fetchData()
  })
}

onUnmounted(() => {
  graphicLayer.destroy()
})

</script>

<template>

  <img @click="onBack" v-if="orgIdList.length > 1" class="absolute left-1/4 top-28 z-500 cursor-pointer"
       src="@/assets/images/index/back.png" alt="">

  <div ref="infoBoxRef" class="info-box hidden py-8 px-10 min-w-[20rem]">
    <div class="flex justify-between">
      <div>机构名称：</div>
      <div class="text-right font-ysbth text-xl">{{ orgInfo.orgName }}</div>
    </div>

    <template v-if="orgInfo.projectProperty || orgInfo.projectStateName">
      <div class="flex justify-between">
        <div>项目性质：</div>
        <div class="text-right font-ysbth text-xl">{{ orgInfo.projectProperty }}</div>
      </div>
      <div class="flex justify-between">
        <div>项目状态：</div>
        <div class="text-right font-ysbth text-xl">{{ orgInfo.projectStateName }}</div>
      </div>
    </template>

    <template v-else>
      <div class="flex justify-between">
        <div>项目总量：</div>
        <div class="text-right font-ysbth text-xl">{{ orgInfo.projectNum }}</div>
      </div>
    </template>

    <div class="flex justify-between">
      <div>设备总量：</div>
      <div class="text-right font-ysbth text-xl">{{ orgInfo.deviceNum }}</div>
    </div>
    <div class="flex justify-between">
      <div>设备在线率：</div>
      <div class="text-right font-ysbth text-xl">
        {{ orgInfo.deviceNum ? (orgInfo.deviceOnlineNum / orgInfo.deviceNum * 100).toFixed(2) : 0 }}%
      </div>
    </div>
  </div>

</template>

<style scoped>
.info-box {
  background: url("@/assets/images/index/box-bg.png") no-repeat;
  background-size: 100% 100%;
}
</style>
