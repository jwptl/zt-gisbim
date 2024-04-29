<template>
  <el-form :model="form" :inline="true">
    <el-form-item label="预警等级：">
      <el-select v-model="form.alarmLevel" placeholder="请选择预警等级">
        <el-option label="红色" value="red"></el-option>
        <el-option label="橙色" value="orange"></el-option>
        <el-option label="黄色" value="yellow"></el-option>
        <el-option label="蓝色" value="blue"></el-option>
      </el-select>
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
    <el-form-item label="预警状态：">
      <el-select v-model="form.alarmStatus" placeholder="请选择区域状态">
        <el-option label="未处理" :value="1"></el-option>
        <el-option label="已处理" :value="2"></el-option>
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
    <el-table-column align="center" prop="deviceName" label="设备名称"/>
    <el-table-column align="center" prop="alarmTime" label="警情时间"/>
    <el-table-column align="center" prop="alarmLevelName" label="预警等级">
      <template #default="scope">
        <el-tag size="large" style="color: #fff;" :color="scope.row.alarmLevel">{{ scope.row.alarmLevelName }}</el-tag>
      </template>
    </el-table-column>
    <el-table-column align="center" prop="alarmMsg" label="预警描述"/>
    <el-table-column align="center" prop="alarmStatusName" label="预警状态"/>
    <el-table-column align="center" prop="areaStatus" label="预警状态">
      <template #default="scope">
        <span v-if="scope.row.areaStatus === 1">安全区域</span>
        <span v-else>预警区域</span>
      </template>
    </el-table-column>
    <el-table-column align="center" label="操作" width="160">
      <template #default="scope">
        <el-space>
          <el-button v-if="scope.row.alarmStatus === 1" size="small" @click="onDeal(scope.row)" text type="primary">
            处理
          </el-button>
          <el-button v-else size="small" @click="onRecord(scope.row)" text type="primary">
            处理记录
          </el-button>
        </el-space>
      </template>
    </el-table-column>
  </TableList>
  <Deal :id="detail.id" v-if="visible.deal" v-model:visible="visible.deal" @success="fetchData"/>
  <DealRecord :detail="detail" v-if="visible.record" v-model:visible="visible.record"/>
</template>

<script setup lang="ts">
import Deal from '@/views/safety/environment/warning-record/components/Deal.vue'
import DealRecord from '@/views/safety/environment/warning-record/components/DealRecord.vue'
import {Refresh, Search} from '@element-plus/icons-vue'
import TableList from '@/components/tableList/index.vue'
import {onMounted, reactive, ref} from 'vue'
import {getAlarmDetailList,} from '@/api/safety'
import type {getAlarmDetailListParams, getAlarmDetailListResponse} from '@/api/type'
import {useRoute} from 'vue-router'

const visible = reactive({
  deal: false,
  record: false,
})
const timeRange = ref<string[]>([])
const form = reactive<getAlarmDetailListParams>({
  workAreaId: 0,
  alarmLevel: '',
  alarmStatus: '',
  alarmTimeStart: '',
  alarmTimeEnd: '',
})

const route = useRoute()

const loading = ref(false)
const tableData = ref<getAlarmDetailListResponse[]>([])
const tablePagination = reactive({
  total: 0,
  pageSize: 10,
  pageNo: 1,
});

onMounted(() => {
  form.workAreaId = Number(route.query.workAreaId)
  fetchData()
})

const fetchData = async () => {
  loading.value = true
  form.alarmTimeStart = timeRange.value?.[0] || ''
  form.alarmTimeEnd = timeRange.value?.[1] || ''
  const {result} = await getAlarmDetailList({...form, ...tablePagination})
  loading.value = false
  tableData.value = result.records
  tablePagination.total = result.total
}

const detail = ref<getAlarmDetailListResponse>({} as getAlarmDetailListResponse)
const onDeal = (row: getAlarmDetailListResponse) => {
  detail.value = row
  visible.deal = true
}

const onRecord = (row: getAlarmDetailListResponse) => {
  detail.value = row
  visible.record = true
}

const onReset = () => {
  form.alarmLevel = ''
  form.alarmStatus = ''
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
