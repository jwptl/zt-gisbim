<template>
  <el-form :model="form" :inline="true">
    <el-form-item label="项目名称：">
      <el-select v-model="form.projectName" clearable placeholder="请选择项目名称">
        <el-option v-for="(item, index) in projectList" :key="index" :label="item" :value="item"></el-option>
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
      <el-button @click="onView(row)" :icon="Refresh" text type="primary">
        查看报告
      </el-button>
    </template>
  </TableList>
</template>

<script setup lang="ts">

import {Refresh, Search} from '@element-plus/icons-vue'
import TableList from '@/components/tableList/index.vue'
import {onMounted, reactive, ref} from 'vue'
import {getProjectList, getReportList} from '@/api/report'
import type {getReportListResponse} from '@/api/type'
import {useRouter} from 'vue-router'

const form = reactive({
  projectId: '',
  projectName: '',
})

const tableData = ref<getReportListResponse[]>([])
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
    label: '项目名称',
    prop: 'projectName',
  },
  {
    label: '所属项目部',
    prop: 'projectDepartmentName',
  },
  {
    label: '项目创建时间',
    prop: 'indicatorTemplateName',
  },
  {
    label: '所属片区',
    prop: 'belongingToArea',
  },
  {
    label: '详细地址',
    prop: 'detailedAddress',
  },
  {
    label: '已生成报告总数',
    prop: 'reportTotal',
  },
  {
    label: '操作',
    prop: 'action',
    slot: 'action'
  }
]

const projectList = ref<string[]>([])
onMounted(() => {
  fetchData()

  getProjectList().then(res => {
    projectList.value = res.result
  })
})

const fetchData = () => {
  getReportList({...form, ...tablePagination}).then(res => {
    tableData.value = res.result.records
    tablePagination.total = res.result.total
  })
}

const router = useRouter()
const onView = (row: getReportListResponse) => {
  router.push({name: 'report-list', query: {projectId: row.id, projectName: row.projectName}})
}

const onReset = () => {
  form.projectId = ''
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
