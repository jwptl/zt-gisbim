<template>
  <el-form :model="form" :inline="true">
    <el-form-item label="所属项目：">
      <el-select filterable fit-input-width v-model="form.projectId" placeholder="请选择所属项目">
        <el-option :key="item.projectId" :label="item.projectName" :value="item.projectId"
                   v-for="item in projectList"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="人员设备ID：">
      <el-input v-model="form.memberDeviceId" placeholder="请输入人员设备ID" clearable></el-input>
    </el-form-item>
    <el-form-item label="机械设备ID：">
      <el-input v-model="form.machineId" placeholder="请输入机械设备ID" clearable></el-input>
    </el-form-item>
    <el-form-item label="处理状态：">
      <el-select v-model="form.status" placeholder="请选择处理状态">
        <el-option label="已处理" :value="1"></el-option>
        <el-option label="未处理" :value="0"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="fetchData">查询</el-button>
      <el-button type="primary" :icon="Refresh" @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
  <TableList :tableData="tableData" :columns="tableColumn" @sizeChange="handleSizeChange"
             @currentChange="handleCurrentChange"
             :total="tablePagination.total" :current="tablePagination.pageNo"
             :pageSize="tablePagination.pageSize"
  >
    <template v-slot:action="{ row }">
      <el-space wrap>
        <el-button size="small" @click="onDetail(row)" text type="primary">
          查看
        </el-button>
        <el-button v-if="!row.status" size="small" @click="onUpdate(row.id)" text type="primary">
          处理
        </el-button>
      </el-space>

    </template>
  </TableList>
  <RiskModal v-if="visible.detail" v-model:visible="visible.detail" v-model:record="visible.record"/>
</template>

<script setup lang="ts">
import {Refresh, Search} from '@element-plus/icons-vue'
import TableList from '@/components/tableList/index.vue'
import {onMounted, reactive, ref} from 'vue'
import {getProjectList, riskAlarmList, riskUpdateStatus} from '@/api/safety'
import type {workAreaListResponse, riskAlarmListParams} from '@/api/type'
import {ElMessage, ElMessageBox} from 'element-plus'
import {getOrgListTree} from "@/api";
import RiskModal from './riskModal.vue'

interface Record{
  alarmDesc:string
  createTime:string
  machineId: string
  memberDeviceId: string
  projectName:string
  status: number
}
interface VisibleInterface {
  detail: boolean;
  record:Record
}

const visible = reactive<VisibleInterface>({
  detail: false,
  record: {} as Record
})

const form = reactive<riskAlarmListParams>({
  projectId: undefined,
  memberDeviceId: undefined,
  machineId: undefined,
  status: undefined
})

const projectList = ref()

const tableData = ref<workAreaListResponse[]>([])
const tablePagination = reactive({
  total: 0,
  pageSize: 10,
  pageNo: 1,
});

interface Column {
  label?: string
  prop: string
  slot?: string
  width?: string
  ellipsis?: boolean
}

const tableColumn = <Array<Column>>[
  {
    label: '所属项目',
    prop: 'projectName',
    ellipsis: true
  },
  {
    label: '人员设备ID',
    prop: 'memberDeviceId',
  },
  {
    label: '机械设备ID',
    prop: 'machineId',
  },
  {
    label: '预警描述',
    prop: 'alarmDesc',
    ellipsis: true
  },
  {
    label: '处理状态',
    prop: 'status',
    formatter: (row:{status:boolean}) => {
      return row.status ? '已处理' : '未处理'
    }
  },
  {
    label: '操作',
    prop: 'action',
    slot: 'action',
  }
]

onMounted(() => {
  getProjectList({
    pageSize: 10000,
    pageNo: 1
  }).then((res) => {
    projectList.value = res.result
  })
  fetchData()
})

const fetchData = async () => {
  const {result} = await riskAlarmList({...form, ...tablePagination})
  tableData.value = result.records
  tablePagination.total = result.total
}


const onUpdate = (id: string) => {
  ElMessageBox.confirm(
      '是否标记为处理状态？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error',
      }
  ).then(async () => {
    const {code, message} = await riskUpdateStatus(id)
    if (code === 200) {
      ElMessage.success('处理成功')
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  })
}

const onReset = () => {
  form.projectId = undefined
  form.memberDeviceId = undefined
  form.machineId = undefined
  form.status = undefined
  fetchData()
}


const onDetail = (row:Record) => {
  visible.detail = true
  visible.record = row
}


const selectList = ref()

onMounted(() => {
  getOrgListTree().then(res => {
    if (res && res.code === 200) {
      let treeList = [res.result]
      selectList.value = treeList
    }
  })
})


//分页切换
const handleCurrentChange = (val: number) => {
  tablePagination.pageNo = val;
  fetchData()
};
//数字切换
const handleSizeChange = (val: number) => {
  tablePagination.pageSize = val;
  fetchData()
};
</script>

<style scoped lang="scss">

</style>
