<template>
  <el-dialog v-model="useVisible" title="添加" width="1200">
    <el-row>
      <el-col :span="14">
        <div v-if="useVisible" id="mars3dContainer" class="w-full h-[600px]" style="position: relative">
          <div style="position: absolute;top: 10px;right: 10px;z-index:99999">
            <el-button v-show="!useDisable" :disabled="buttonFlag" type="primary" @click="startDraw">绘制</el-button>
            <el-button v-show="!useDisable" @click="resetDraw">重置</el-button>
          </div>
        </div>
      </el-col>
      <el-col :span="10">
        <el-form :rules="rules" ref="formRef" :model="form">
          <el-form-item label="作业区域名称" prop="areaName" label-width="120px">
            <el-input :disabled="useDisable" v-model="form.areaName" placeholder="请输入作业区域名称" clearable></el-input>
          </el-form-item>
          <el-form-item label="关联设备" prop="bindDevices" label-width="120px">
            <el-select
                v-model="form.bindDevices"
                multiple
                filterable
                allow-create
                default-first-option
                :reserve-keyword="false"
                placeholder="选择设备"
                style="width: 100%"
                @change="onChange"
                :disabled="useDisable"
            >
              <el-option
                  v-for="item in options"
                  :key="item.deviceCode"
                  :label="item.deviceName"
                  :value="item.deviceCode"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div style="padding: 20px">
          <TableList :tableData="tableData" :columns="tableColumn" :isNumber="false">
            <template v-slot:action="{ row }">
              <el-space wrap>
                <el-button v-show="!useDisable" size="small" @click="onDelete(row)" text type="danger">
                  删除
                </el-button>
              </el-space>
            </template>
          </TableList>
        </div>
      </el-col>
    </el-row>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="useVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script setup lang="ts">
import * as mars3d from 'mars3d'
import {nextTick, onMounted, onUnmounted, provide, reactive, ref} from "vue";
import {useMars} from '@/composables/useMars'
import {useVModel} from "@vueuse/core";
import {ElMessage} from "element-plus";
import {addWorkArea, editWorkArea, getWorkAreaDetail, workAreaDeviceList} from "@/api/safety";
import TableList from '@/components/tableList/index.vue'
import {EventType} from "mars3d";

const form = reactive({
  areaName: '',
  bindDevices: [] as string[],
  area: [],
  id: undefined
})

const tableData = ref()
const formRef = ref()
const graphicData = ref()
const buttonFlag = ref(false)

const props = withDefaults(defineProps<{
  visible: boolean
  id?: number
  disable: boolean
}>(), {
  id: undefined,
  visible: false,
  disable: false
})
const useVisible = useVModel(props, 'visible')
const useDisable = useVModel(props, 'disable')
const useID = useVModel(props, 'id')
const options = ref()

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
      fps: false
    }
  }
}

// 生成当前地图的唯一标识
const mapKey = Symbol('mapKey')
// 传递给子组件
provide('mapKey', mapKey)

const {initMap, destroy, initGraphicLayer} = useMars(mapKey)
let graphicLayer:any
// 地图实例
let map: mars3d.Map
onMounted(() => {
  workAreaDeviceList().then((res) => {
    options.value = res.result
    if (useID.value) {
      const id = useID.value
      getWorkAreaDetail(id).then((res) => {
        if (res.code === 200) {
          form.bindDevices = res.result.deviceList
          form.area = res.result.area
          form.areaName = res.result.areaName
          form.id = res.result.id
          const data = options.value.filter((item: { deviceCode: string }) => form.bindDevices.includes(item.deviceCode))
          tableData.value = data
          const graphic = new mars3d.graphic.PolygonEntity({
            positions: form.area,
            style: {
              color: '#20a0ff',
              opacity: 0.6,
              outline: true,
              outlineWidth: 2,
              outlineColor: "#ffffff",
              clampToGround: true
            }
          });
          graphicLayer.addGraphic(graphic)
          graphicData.value = graphic
        }
      })
    }
  })
  nextTick(() => {
    map = initMap('mars3dContainer', mapOptions)
    // 开场动画
    map.openFlyAnimation({
      center: {lng: 109.551636, lat: 33.529256, alt: 430000}
    })
    graphicLayer = initGraphicLayer()
    graphicLayer.on(mars3d.EventType.drawCreated, (e:any) => {
      graphicData.value = e.graphic
      form.area = e.layer.points.map((item: mars3d.LngLatPoint) => {
        return [
          item.lng,
          item.lat
        ]
      })
    })
  })
})

const rules = {
  areaName: [
    {required: true, message: '作业区域名称不能为空', trigger: 'blur'},
  ],
  bindDevices: [
    {required: true, message: '设备不能为空', trigger: 'change'},
  ],
}

//绘制面
const startDraw = () => {
  if (useID.value) {
    form.area = []
    graphicLayer.removeGraphic(graphicData.value)
  }
  buttonFlag.value = true
  graphicLayer.startDraw({
    type: 'polygon',
    style: {
      color: '#20a0ff',
      opacity: 0.6,
      outline: true,
      outlineWidth: 2,
      outlineColor: "#ffffff",
      clampToGround: true
    }
  })
}

//重置
const resetDraw = () => {
  buttonFlag.value = false
  form.area = []
  graphicLayer.removeGraphic(graphicData.value)
}


interface Column {
  label?: string
  prop: string
  slot?: string
  width?: string
  ellipsis?: boolean
}

const tableColumn = <Array<Column>>[
  {
    label: '设备名称',
    prop: 'deviceName',
    ellipsis: true
  },
  {
    label: '设备厂商',
    prop: 'manufacturer',
    ellipsis: true
  },
  {
    label: '监测类型',
    prop: 'monitorType',
    ellipsis: true
  },
  {
    label: '操作',
    prop: 'action',
    slot: 'action',
  }
]

//下拉值切换
const onChange = (value:string[]) => {
  const data = options.value.filter((item: { deviceCode: string }) => value.includes(item.deviceCode))
  tableData.value = data
}

const onDelete = (row: {
  deviceCode: number
}) => {
  form.bindDevices.splice(row.deviceCode, 1)
  tableData.value.splice(row.deviceCode, 1)
}

const emits = defineEmits(['success'])
const onsubmit = async () => {
  if (!(form.area.length > 0)) {
    ElMessage.error('请绘制安全作业区域')
    return
  }
  await formRef.value?.validate(async (valid:any) => {
    if (valid) {
      interface Params{
        area:string
        areaName:string
        bindDevices:string[]
        id?:number
      }
      const params:Params = {
        area: JSON.stringify(form.area),
        areaName: form.areaName,
        bindDevices: form.bindDevices,
        id: undefined
      }
      let request
      if (useID.value) {
        params.id = useID.value
        request = editWorkArea
      } else {
        request = addWorkArea
      }
      const res = await request(params)
      if (res.code === 200) {
        useID.value ? ElMessage.success('编辑成功') : ElMessage.success('添加成功')
        emits('success')
        useVisible.value = false
        useDisable.value = false
      } else {
        ElMessage.error(res.message)
      }
    }
  })
}


onUnmounted(() => {
  destroy()
})
</script>

