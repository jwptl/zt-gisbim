<template>
  <el-form :model="form" :inline="true">
    <el-form-item label="所属机构：">
      <el-tree-select
          :props="props"
          v-model="form.orgId"
          :data="selectList"
          placeholder="请选择所属机构"
      />
    </el-form-item>
    <el-form-item label="作业区域名称：">
      <el-input v-model="form.areaName" placeholder="请输入作业区域名称" clearable></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="fetchData">查询</el-button>
      <el-button type="primary" :icon="Refresh" @click="onReset">重置</el-button>
      <el-button type="primary" :icon="Plus" @click="onAdd">新增</el-button>
    </el-form-item>
  </el-form>
  <TableList :tableData="tableData" :columns="tableColumn" @sizeChange="handleSizeChange"
             @currentChange="handleCurrentChange"
             :total="tablePagination.total" :current="tablePagination.pageNo"
             :pageSize="tablePagination.pageSize"
  >
    <template v-slot:action="{ row }">
      <el-space wrap>
        <el-button size="small" @click="onDetail(row.id)" text type="primary">
          查看
        </el-button>
        <el-button size="small" @click="onEdit(row.id)" text type="primary">
          编辑
        </el-button>
        <el-button size="small" @click="onDelete(row.id)" text type="danger">
          删除
        </el-button>
      </el-space>

    </template>
  </TableList>
  <AreaModal v-if="visible.create" v-model:visible="visible.create"  :id="visible.id"  :disable="visible.disable"  @success="fetchData"/>
</template>

<script setup lang="ts">
import {Refresh, Search, Plus} from '@element-plus/icons-vue'
import TableList from '@/components/tableList/index.vue'
import {onMounted, reactive, ref} from 'vue'
import {workAreaList, deleteWorkArea} from '@/api/safety'
import type {workAreaListResponse, WorkAreaParams} from '@/api/type'
import {ElMessage, ElMessageBox} from 'element-plus'
import {getOrgListTree} from "@/api";
import AreaModal from './areaModal.vue'

interface VisibleInterface {
  create: boolean;
  id: number | undefined;
  disable: boolean;
}

const visible = reactive<VisibleInterface>({
  create: false,
  id:undefined,
  disable:false,
})

const form = reactive<WorkAreaParams>({
  orgId: undefined,
  areaName: undefined
})


const props = {
  value: 'id',
  label: 'name',
  children: 'child',
}

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
    label: '所属机构',
    prop: 'orgName',
  },
  {
    label: '作业区域名称',
    prop: 'areaName',
  },
  {
    label: '所属项目部',
    prop: 'projectName',
  },
  {
    label: '关联设备编号',
    prop: 'deviceList',
    formatter: (row:{
      deviceList:string[]
    }) => {
      return row.deviceList?row.deviceList.join(","):'-'
    },
    ellipsis:true
  },
  {
    label: '创建时间',
    prop: 'createTime',
  },
  {
    label: '操作',
    prop: 'action',
    slot: 'action',
  }
]

onMounted(() => {
  fetchData()
})

const fetchData = async () => {
  const {result} = await workAreaList({...form, ...tablePagination})
  tableData.value = result.records
  tablePagination.total = result.total
}


const onDelete = (id:number) => {
  ElMessageBox.confirm(
      '确定要删除吗？',
      '提示',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'error',
      }
  ).then(async () => {
    const {code, message} = await deleteWorkArea(id)
    if (code === 200) {
      ElMessage.success('删除成功')
      await fetchData()
    } else {
      ElMessage.error(message)
    }
  })
}

const onReset = () => {
  form.orgId = undefined
  form.areaName = undefined
  fetchData()
}


const onAdd=()=>{
  visible.create = true
  visible.id = undefined
  visible.disable = false
}

const onDetail=(id:number)=>{
  visible.create = true
  visible.id = id
  visible.disable = true
}

const onEdit=(id:number)=>{
  visible.disable = false
  visible.create = true
  visible.id = id
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
