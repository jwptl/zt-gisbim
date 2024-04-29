<template>
  <el-form :model="form" :inline="true">
    <el-form-item label="围栏名称：">
      <el-select v-model="form.workAreaId" placeholder="请选择围栏名称">
        <el-option v-for="item in workAreas" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="撤销时间：">
      <el-date-picker
          v-model="timeRange"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          format="YYYY-MM-DD HH:mm:ss"
          value-format="YYYY-MM-DD HH:mm:ss"
          date-format="YYYY-MM-DD ddd"
          time-format="A hh:mm:ss"
      />
    </el-form-item>
    <el-form-item label="请选择审批状态：">
      <el-select v-model="form.approveStatus" placeholder="请选择审批状态">
        <el-option v-for="(item, index) in approveStatus" :key="index" :label="item" :value="index"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="fetchData">查询</el-button>
      <el-button type="primary" :icon="Refresh" @click="onReset">重置</el-button>
      <el-button type="primary" :icon="Plus" @click="visible.create = true">新增</el-button>
    </el-form-item>
  </el-form>
  <TableList v-loading="loading" :tableData="tableData" :columns="tableColumn" @sizeChange="handleSizeChange"
             @currentChange="handleCurrentChange"
             :total="tablePagination.total" :current="tablePagination.pageNo"
             :pageSize="tablePagination.pageSize"
  >
    <template v-slot:action="{ row }">
      <el-space wrap>
        <el-button v-if="row.approveStatus === 0 && userInfo.id === row.applicant" size="small" @click="onCancel(row)" text type="warning">
          撤销
        </el-button>
        <el-button v-if="row.approveStatus === 0 && userInfo.id !== row.applicant" size="small" @click="onApprove(row)" text type="success">
          审核
        </el-button>
        <el-button size="small" @click="onDetail(row)" text type="primary">
          查看
        </el-button>
        <el-button v-if="userInfo.id === row.applicant" size="small" @click="onDelete(row)" text type="danger">
          删除
        </el-button>
      </el-space>

    </template>
  </TableList>
  <Approve :id="detail.id" v-if="visible.approve" v-model:visible="visible.approve" @success="fetchData" />
  <Detail :id="detail.id" v-if="visible.detail" v-model:visible="visible.detail" />
  <Create v-if="visible.create" v-model:visible="visible.create" @success="fetchData" />
</template>

<script setup lang="ts">
import Approve from '@/views/safety/environment/warning-approve/components/Approve.vue'
import Detail from '@/views/safety/environment/warning-approve/components/Detail.vue'
import Create from '@/views/safety/environment/warning-approve/components/Create.vue'
import {Refresh, Search, Plus} from '@element-plus/icons-vue'
import TableList from '@/components/tableList/index.vue'
import {onMounted, reactive, ref} from 'vue'
import {alarmApproveCancel, getAlarmApproveList, alarmApproveDelete, workAreaList} from '@/api/safety'
import type {AlarmApproveListParams, AlarmApproveListResponse, workAreaListResponse} from '@/api/type'
import {ElMessage, ElMessageBox} from 'element-plus'
import {useLocalStorage} from '@vueuse/core'

const userInfo = useLocalStorage('userInfo', {id: ''})

const visible = reactive({
  create: false,
  approve: false,
  detail: false,
})
const timeRange = ref<string[]>([])
const form = reactive<AlarmApproveListParams>({
  workAreaId: '',
  approveStatus: '',
  cancelTimeStart: '',
  cancelTimeEnd: '',
})

const approveStatus  = {
  0: '待审批',
  1: '已通过',
  2: '未通过',
  3: '撤销',
}

const loading = ref(false)
const tableData = ref<AlarmApproveListResponse[]>([])
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
    label: '所属机构',
    prop: 'orgName',
  },
  {
    label: '所属项目部',
    prop: 'projectName',
  },
  {
    label: '区域名称',
    prop: 'workAreaName',
  },
  {
    label: '申请人',
    prop: 'applicantName',
  },
  {
    label: '申请时间',
    prop: 'applyTime',
  },
  {
    label: '审批人',
    prop: 'approverUserName',
  },
  {
    label: '审批时间',
    prop: 'approveTime',
  },
  {
    label: '审批状态',
    prop: 'approveStatus',
    formatter: (row: AlarmApproveListResponse) => {
      return approveStatus[row.approveStatus]
    },
  },
  {
    label: '审批原因',
    prop: 'approveReason',
  },
  {
    label: '操作',
    prop: 'action',
    slot: 'action',
  }
]

const workAreas = ref<workAreaListResponse[]>([])
onMounted(() => {
  fetchData()

  workAreaList({pageNo: 1, pageSize: 1000}).then(res => {
    workAreas.value = res.result.records
  })
})

const fetchData = async () => {
  loading.value = true
  form.cancelTimeStart = timeRange.value?.[0] || ''
  form.cancelTimeEnd = timeRange.value?.[1] || ''
  const {result} = await getAlarmApproveList({...form, ...tablePagination})
  loading.value = false
  tableData.value = result.records
  tablePagination.total = result.total
}

const onCancel = (row: AlarmApproveListResponse) => {
  ElMessageBox.confirm(
      '确定要撤销该申请吗？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(async () => {
    const {code, message} = await alarmApproveCancel(row.id)
    if (code === 200) {
      ElMessage.success('撤销成功')
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  })
}

const onApprove = (row: AlarmApproveListResponse) => {
  detail.value = row
  visible.approve = true
}

const detail = ref<AlarmApproveListResponse>({} as AlarmApproveListResponse)
const onDetail = (row: AlarmApproveListResponse) => {
  detail.value = row
  visible.detail = true
}

const onDelete = (row: AlarmApproveListResponse) => {
  ElMessageBox.confirm(
      '确定要删除该申请吗？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error',
      }
  ).then(async () => {
    const {code, message} = await alarmApproveDelete(row.id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  })
}

const onReset = () => {
  form.workAreaId = ''
  form.approveStatus = ''
  timeRange.value = []
  fetchData()
}

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
