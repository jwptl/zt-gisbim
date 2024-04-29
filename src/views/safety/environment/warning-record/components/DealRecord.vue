<template>
  <el-dialog v-model="useVisible" title="处理记录" width="500">
    <el-descriptions :column="1" title="">
      <el-descriptions-item label="实地核查结果">{{ props.detail.dealResultName }}</el-descriptions-item>
      <el-descriptions-item label="处理意见">{{ props.detail.dealSuggestion }}</el-descriptions-item>
      <el-descriptions-item label="处理人">{{ props.detail.dealUser }}</el-descriptions-item>
      <el-descriptions-item label="处理时间">{{ props.detail.dealTime }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import {useVModel} from '@vueuse/core'
import type {getAlarmDetailListResponse,} from '@/api/type'

const props = withDefaults(defineProps<{
  visible: boolean
  detail: getAlarmDetailListResponse
}>(), {
  visible: false,
  detail: (() => {
    return {} as getAlarmDetailListResponse
  })
})
const useVisible = useVModel(props, 'visible')


</script>

<style lang="scss">

</style>
