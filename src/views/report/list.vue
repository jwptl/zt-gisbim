<template>
  <el-form :model="form" :inline="true">
    <el-form-item label="时间：">
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
    <el-form-item>
      <el-button type="primary" :icon="Search" @click="fetchData">查询</el-button>
      <el-button type="primary" :icon="Refresh" @click="onReset">重置</el-button>
      <el-button v-if="form.type === 4" @click="visible.upload = true" type="primary" :icon="Plus">添加报告</el-button>
    </el-form-item>
  </el-form>
  <el-radio-group @change="onTypeChange" v-model="form.type">
    <el-radio-button :label="1">周报</el-radio-button>
    <el-radio-button :label="2">月报</el-radio-button>
    <el-radio-button :label="3">年报</el-radio-button>
    <el-radio-button :label="4">人工上报</el-radio-button>
  </el-radio-group>

  <el-divider/>

  <TableList :tableData="tableData" :columns="tableColumn" @sizeChange="handleSizeChange"
             @currentChange="handleCurrentChange"
             :total="tablePagination.total" :current="tablePagination.pageNo"
             :pageSize="tablePagination.pageSize"
  >
    <template v-slot:action="{ row }">
      <el-space>
        <el-button :icon="View" @click="onPreview(row)" text type="primary">
          预览
        </el-button>
        <el-button :icon="Download" @click="onDownload(row)" text type="primary">
          下载
        </el-button>
      </el-space>
    </template>
  </TableList>

  <DialogModal v-if="visible.upload" title="上传报告" v-model:visible="visible.upload" width="500px"
               @success="onUpload" @cancel="onCancel">
    <div class="mx-auto w-[300px]">
      <el-input v-model="uploadForm.reportName" style="width: 200px" placeholder="输入报告名称" required/>
      <el-upload
          class="mt-5"
          ref="upload"
          action="/gisbim-api/sys/upload/uploadMinio"
          :limit="1"
          :data="{biz: 'bim'}"
          :headers="{'X-Access-Token': token}"
          @success="onUploadSuccess"
          accept=".pdf,.docx,.doc,.xls,.xlsx"
      >
        <template #trigger>
          <el-button type="primary">上传文件</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            支持上传word,excel,pdf格式文件。
          </div>
        </template>
      </el-upload>
    </div>
  </DialogModal>

  <OfficePreview v-if="visible.preview" v-model:visible="visible.preview" :path="path" />
</template>

<script setup lang="ts">
import {Refresh, Search, Plus, Download, View} from '@element-plus/icons-vue'
import {onMounted, reactive, ref} from 'vue'
import TableList from '@/components/tableList/index.vue'
import DialogModal from '@/components/dialogModal/index.vue'
import {ElMessage} from 'element-plus'
import {addReport, getReportList} from '@/api/report'
import type {getReportListParams, getReportListResponse} from '@/api/type'
import {useRoute} from 'vue-router'
import OfficePreview from '@/components/dialogModal/OfficePreview.vue'

const token = localStorage.getItem('oauthToken')

const timeRange = ref<string[]>([])

const route = useRoute()

const form = reactive<getReportListParams>({
  type: 1,
  projectId: (route.query.projectId || '') as string,
  projectName: (route.query.projectName || '') as string,
  createTimeStart: '',
  createTimeEnd: '',
})

const visible = reactive({
  upload: false,
  preview: false,
})

onMounted(() => {
  fetchData()
})

const tableData = ref<getReportListResponse[]>([])
const tablePagination = reactive({
  total: 0,
  pageSize: 10,
  pageNo: 1,
});
const fetchData = () => {

  if (timeRange.value.length === 2) {
    form.createTimeStart = timeRange.value[0]
    form.createTimeEnd = timeRange.value[1]
  } else {
    form.createTimeStart = ''
    form.createTimeEnd = ''
  }

  getReportList({...form, ...tablePagination}).then(res => {
    tableData.value = res.result.records
    tablePagination.total = res.result.total
  })
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
    label: '报告名称',
    prop: 'reportName',
  },
  {
    label: '生成时间',
    prop: 'reportDate',
  },
  {
    label: '操作',
    prop: 'action',
    slot: 'action'
  }
]

const onReset = () => {
  fetchData()
}

const onTypeChange = () => {
  tablePagination.pageNo = 1
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

const uploadForm = reactive({
  path: '',
  reportName: '',
  id: (Number(route.query.projectId) || 0) as number,
  projectId: (Number(route.query.projectId) || 0) as number,
  projectName: (route.query.projectName || '') as string
})

const onUpload = async () => {
  const {code, message} = await addReport(uploadForm)
  if (code === 200) {
    ElMessage.success('上传成功！')
    visible.upload = false
    fetchData()
    uploadForm.path = ''
    uploadForm.reportName = ''
  } else {
    ElMessage.error(message)
  }
}

const path = ref('')
const onPreview = (row: getReportListResponse) => {
  if (!row.path) {
    ElMessage.error('暂无报告！')
    return
  }
  path.value = row.path
  visible.preview = true
  console.log(row)
}

const onDownload = (row: getReportListResponse) => {
  if (!row.path) {
    ElMessage.error('暂无报告！')
    return
  }

  if (row.path.endsWith('.pdf')) {
    window.open(row.path)
  } else {
    window.location.href = row.path
  }
}

const onUploadSuccess = (response: any) => {
  if (response.code !== 0) {
    ElMessage.error('上传出错，请重新上传！');
    return false
  } else {
    uploadForm.path = response.message
  }
}

const onCancel = () => {
  uploadForm.path = ''
  uploadForm.reportName = ''
  visible.upload = false
}
</script>

<style scoped lang="scss">

</style>
