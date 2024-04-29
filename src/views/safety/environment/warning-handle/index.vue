<template>
  <el-form :model="form" :inline="true">
    <el-form-item label="所属项目：">
      <el-tree-select
          :props="{
  value: 'id',
  label: 'name',
  children: 'child',
}"
          v-model="form.orgId"
          :data="orgTree"
          placeholder="请选择所属项目"
      />
    </el-form-item>
    <el-form-item label="预警时间：">
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
    <el-form-item label="区域状态：">
      <el-select v-model="form.areaStatus" placeholder="请选择区域状态">
        <el-option label="安全区域" :value="1"></el-option>
        <el-option label="预警区域" :value="2"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="fetchData">查询</el-button>
      <el-button type="primary" :icon="Refresh" @click="onReset">重置</el-button>
    </el-form-item>
  </el-form>
  <TableList v-loading="loading" :tableData="tableData" @sizeChange="handleSizeChange"
             @currentChange="handleCurrentChange"
             :total="tablePagination.total" :current="tablePagination.pageNo"
             :pageSize="tablePagination.pageSize"
  >
    <el-table-column align="center" prop="orgName" label="所属项目"/>
    <el-table-column align="center" prop="workAreaName" label="作业区域"/>
    <el-table-column align="center" prop="orgName" label="未处理预警">
      <template #default="scope">
        <el-space>
          <el-tag size="large" style="color: #fff;" color="red">{{ scope.row.alarmCountRed }}</el-tag>
          <el-tag size="large" style="color: #fff;" color="orange">{{ scope.row.alarmCountOrange }}</el-tag>
          <el-tag size="large" color="yellow">{{ scope.row.alarmCountYellow }}</el-tag>
          <el-tag size="large" style="color: #fff;" color="blue">{{ scope.row.alarmCountBlue }}</el-tag>
        </el-space>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="alarmCountTotal" label="预警总量"/>
    <el-table-column align="center" prop="areaPeopleCountTotal" label="当前区域内人数"/>
    <el-table-column align="center" prop="areaStatus" label="区域安全状态">
      <template #default="scope">
        <span v-if="scope.row.areaStatus === 1">安全区域</span>
        <span v-else>预警区域</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="120">
      <template #default="scope">
        <el-space wrap>
          <el-button size="small" @click="onDetail(scope.row)" text type="primary">
            查看警情
          </el-button>
          <el-button size="small" @click="onPublishInstruction(scope.row)" text type="primary">
            发布指令
          </el-button>
          <el-button size="small" @click="onRecoverWork(scope.row)" text type="primary">
            恢复施工
          </el-button>
          <el-button size="small" @click="onRecord(scope.row)" text type="primary">
            操作记录
          </el-button>
        </el-space>
      </template>
    </el-table-column>
  </TableList>
  <PublishInstruction :work-area-id="detail.id" v-if="visible.publish" v-model:visible="visible.publish" @success="fetchData" />
  <RecoverWork :work-area-id="detail.id" v-if="visible.recover" v-model:visible="visible.recover" @success="fetchData" />
  <ActionRecord :id="detail.id" v-if="visible.record" v-model:visible="visible.record" />
</template>

<script setup lang="ts">
import PublishInstruction from '@/views/safety/environment/warning-handle/components/PublishInstruction.vue'
import RecoverWork from '@/views/safety/environment/warning-handle/components/RecoverWork.vue'
import ActionRecord from '@/views/safety/environment/warning-handle/components/ActionRecord.vue'
import {Refresh, Search} from '@element-plus/icons-vue'
import TableList from '@/components/tableList/index.vue'
import {onMounted, reactive, ref} from 'vue'
import {
  getAlarmManageList
} from '@/api/safety'
import type {
  getAlarmManageListParams,
  getAlarmManageListResponse,
} from '@/api/type'
import {getOrgListTree} from '@/api'
import {useRouter} from 'vue-router'

const visible = reactive({
  approve: false,
  publish: false,
  recover: false,
  record: false,
})
const timeRange = ref<string[]>([])
const form = reactive<getAlarmManageListParams>({
  areaStatus: '',
  orgId: '',
  alarmTimeStart: '',
  alarmTimeEnd: '',
})


const loading = ref(false)
const tableData = ref<getAlarmManageListResponse[]>([])
const tablePagination = reactive({
  total: 0,
  pageSize: 10,
  pageNo: 1,
});

const orgTree = ref<any[]>([])
onMounted(() => {
  fetchData()

  getOrgListTree().then(res => {
    if (res.code === 200 && res.result.id) {
      orgTree.value = [res.result]
    }
  })
})

const fetchData = async () => {
  loading.value = true
  form.alarmTimeStart = timeRange.value?.[0] || ''
  form.alarmTimeEnd = timeRange.value?.[1] || ''
  const {result} = await getAlarmManageList({...form, ...tablePagination})
  loading.value = false
  tableData.value = result.records
  tablePagination.total = result.total
}

const detail = ref<getAlarmManageListResponse>({} as getAlarmManageListResponse)

const router = useRouter()
const onDetail = (row: getAlarmManageListResponse) => {
  router.push({name: 'safety-environment-warning-record', query: {workAreaId: row.id}})
}

const onPublishInstruction = (row: getAlarmManageListResponse) => {
  detail.value = row
  visible.publish = true
}

const onRecoverWork = (row: getAlarmManageListResponse) => {
  detail.value = row
  visible.recover = true
}

const onRecord = (row: getAlarmManageListResponse) => {
  detail.value = row
  visible.record = true
}

const onReset = () => {
  form.areaStatus = ''
  form.orgId = ''
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
