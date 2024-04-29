<template>
  <el-drawer
      v-model="useVisible"
      title="详情"
      direction="rtl"
      size="50%"
  >
    <el-descriptions :column="2">
      <el-descriptions-item label="所属项目:">{{ useRecord.projectName }}</el-descriptions-item>
      <el-descriptions-item label="人员设备ID:">{{ useRecord.memberDeviceId }}</el-descriptions-item>
      <el-descriptions-item label="机械设备ID:">{{ useRecord.machineId }}</el-descriptions-item>
      <el-descriptions-item label="预警描述:">{{ useRecord.alarmDesc }}</el-descriptions-item>
      <el-descriptions-item label="处理状态:">{{ useRecord.status ? '已处理' : '未处理' }}</el-descriptions-item>
    </el-descriptions>
  </el-drawer>
</template>

<script setup lang="ts">
import {useVModel} from "@vueuse/core";

interface Record {
  alarmDesc: string
  createTime: string
  machineId: string
  memberDeviceId: string
  projectName: string
  status: number
}


const props = withDefaults(defineProps<{ visible: boolean, record: Record }>(), {
  visible: false,
  record: (() => {
    return {} as Record
  })
})


const useVisible = useVModel(props, 'visible')
const useRecord = useVModel(props, 'record')
</script>

<style scoped>

</style>
