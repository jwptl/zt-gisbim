<script setup lang="ts">
import mqtt from 'mqtt/dist/mqtt'
import {getDeviceList, getSceneList} from '@/api'
import {inject, onMounted, onUnmounted, ref, watch} from 'vue'
import {useMars} from '@/composables/useMars'
import * as mars3d from 'mars3d'
import {useUrlSearchParams} from '@vueuse/core'
import {CaretRight} from '@element-plus/icons-vue'

const infoBoxRef = ref<HTMLDivElement>()

// 获取路由参数
const params = useUrlSearchParams<{ orgId: string }>()

const mapKey = inject<symbol>('mapKey') as symbol
const {map, initGraphicLayer} = useMars(mapKey)
const graphicLayer = initGraphicLayer()

type Device = {
  bindObjectId: string
  bindObjectName: string
  deviceId: string
  deviceName: string
  deviceType: string
  id: string
  lat: number
  lng: number
  onlineStatus: number
  scale: number
  orgId: string
  orgName: string
  sid: string
  tenantId: string
  modelUrl: string
  objectId: string
}

// 绑定悬浮框
const selectModel = ref<Device>({} as Device)
graphicLayer.bindPopup((event) => {
  selectModel.value = event.graphic.attr
  return infoBoxRef.value
})

let deviceList: Device[] = []
const fetchData = async () => {
  const {code, result} = await getDeviceList(params.orgId || '')

  if (code === 200) {
    deviceList = Object.values(result).flat().map(item => {
      return item.devices.map(device => {
        return {
          ...device,
          sid: item.sid,
          scale: item.scale,
          objectId: item.objectId,
          modelUrl: item.modelUrl
        }
      })
    }).flat()
  }
}

fetchData()

const timer = window.setInterval(() => {
  fetchData()
}, 60000)

const client: mqtt.MqttClient = mqtt.connect(import.meta.env.VITE_WEBSOCKET_URL, {
  connectTimeout: 10000,  // 超时时间
  clientId: 'BEIDOU_OPERATION_RECVER_' + Math.random(),
  keepalive: 60,  // 心跳时间
  clean: true,
  username: 'bflk',
  password: 'Bflk123*'
})

client.on('connect', () => {
  console.log('mqtt连接成功')
})

client.subscribe('device-location', () => {
  console.log('订阅成功')
})

type Message = {
  lng: number
  lat: number
  deviceId: string
}
client.on('message', (topic: string, message) => {
  const data: Message = JSON.parse(message.toString())
  setModel(data)
})


const setModel = (data: Message) => {

  // 获取设备信息
  const model = deviceList.find(item => item.deviceId === data.deviceId)

  // 获取已经渲染的设备
  const dynamicModel = graphicLayer.getGraphicById(data.deviceId)

  const position = mars3d.Cesium.Cartesian3.fromDegrees(data.lng, data.lat, 210)

  // 设备已经渲染
  if (dynamicModel) {
    if (!model?.onlineStatus) {
      graphicLayer.removeGraphic(dynamicModel)
    }

    if (model?.onlineStatus && (dynamicModel.attr.lng !== data.lng || dynamicModel.attr.lat !== data.lat)) {
      dynamicModel.attr.lng = data.lng
      dynamicModel.attr.lat = data.lat
      dynamicModel.addDynamicPosition(position, 5)
    }

    return
  }

  // 设备未渲染
  if (model && model.onlineStatus) {
    const graphic = new mars3d.graphic.ModelPrimitive({
      id: data.deviceId,
      position: position,
      maxCacheCount: 5,
      forwardExtrapolationType: mars3d.Cesium.ExtrapolationType.HOLD,
      style: {
        clampToTileset: true,
        frameRateHeight: 1,
        label: {
          // 不需要文字时，去掉label配置即可
          text: model.deviceName,
          font: '16px sans-serif',
          fillColor: '#41ff00',
          pixelOffset: [0, -20],
          addHeight: 20,
        },
        url: model.modelUrl,
        scale: model.scale || 1,
      },
      attr: {
        ...model,
        ...data
      }
    })

    graphicLayer.addGraphic(graphic)
  }
}

onUnmounted(() => {
  graphicLayer.destroy()
  client.end()
  clearInterval(timer)
})

const layerSelectList = ref<Array<{name: string, sId: string}>>([])
const layerList = ref<string[]>([])

onMounted(() => {
  getSceneList(params.orgId || '').then(res => {
    if (res.code === 200) {
      layerSelectList.value = res.result
      layerList.value = res.result.map(item => item.sId)
    }
  })
})


const layerSelect = ref(true)
const checkAll = ref(true)

const handleCheckAllChange = (val: boolean) => {
  layerList.value = val ? layerSelectList.value.map(item => item.sId) : []
}

const onChange = () => {
    checkAll.value = layerList.value.length === layerSelectList.value.length
}

watch(layerList, (val) => {
  graphicLayer.getGraphics().forEach(item => {
    item.show = val.includes(item.attr.sid)
  })
})
</script>

<template>

  <div ref="infoBoxRef" class="info-box hidden py-8 px-10 min-w-[20rem] text-sm">
    <div class="flex justify-between">
      <div>设备类型：</div>
      <div class="text-right">{{ selectModel.deviceType }}</div>
    </div>
    <div class="flex justify-between">
      <div>设备编号：</div>
      <div class="text-right">{{ selectModel.deviceId }}</div>
    </div>
    <div class="flex justify-between">
      <div>所属部门：</div>
      <div class="text-right">{{ selectModel.orgName }}</div>
    </div>
    <div class="flex justify-between">
      <div>状态：</div>
      <div class="text-right">{{ selectModel.onlineStatus ? '在线' : '离线' }}</div>
    </div>
    <div class="flex justify-between">
      <div>绑定对象：</div>
      <div class="text-right">{{ selectModel.bindObjectName }}</div>
    </div>
    <div class="flex justify-between">
      <div>经纬度：</div>
      <div class="text-right">{{ `${selectModel.lng},${selectModel.lat}` }}</div>
    </div>
  </div>

  <div class="model-select absolute bottom-20 left-1/4 z-[500] cursor-pointer w-[100px]">
    <el-checkbox @change="handleCheckAllChange" v-model="checkAll" class="bg-black bg-opacity-50 px-2 mb-2 rounded-sm">全部</el-checkbox>

    <el-checkbox-group @change="onChange" v-if="layerSelect" class="flex flex-wrap" v-model="layerList">
      <el-checkbox v-for="item in layerSelectList" :key="item.sId" class="bg-black bg-opacity-50 px-2 mb-2 rounded-sm" :label="item.sId">{{ item.name }}</el-checkbox>
    </el-checkbox-group>

    <div @click="layerSelect = !layerSelect" class="flex bg-[#5A9FFA] bg-opacity-50 pl-3 pr-1 py-1 rounded-sm items-center">
      <div class="text-sm mr-1">图层显示</div>
      <el-icon>
        <CaretRight/>
      </el-icon>
    </div>
  </div>

</template>

<style lang="scss" scoped>
.info-box {
  background: url("@/assets/images/index/box-bg.png") no-repeat;
  background-size: 100% 100%;
}

.model-select {
  :deep(.el-checkbox__label) {
    font-size: 14px;
    color: #fff;
    width: 70px;
    text-align: center;
  }

  :deep(.el-checkbox__input.is-checked .el-checkbox__inner) {
    background-color: transparent;
    border-color: #fff;
  }
}
</style>
