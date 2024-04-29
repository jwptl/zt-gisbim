<template>
  <el-dialog v-model="useVisible" title="详情" width="500">
    <el-descriptions :column="1" title="申请信息">
      <el-descriptions-item label="撤销预警区域：">{{ detail?.workAreaName }}</el-descriptions-item>
      <el-descriptions-item label="处置描述：">{{ detail?.disposeDesc }}</el-descriptions-item>
      <el-descriptions-item label="处置照片：">
        <el-image v-for="item in detail?.images" :src="item" :key="item" :preview-src-list="[item]" />
      </el-descriptions-item>
    </el-descriptions>
    <el-divider/>
    <el-descriptions :column="1" title="审核信息">
      <el-descriptions-item label="审核结果：">{{ approveStatus[detail?.approveStatus] }}</el-descriptions-item>
      <el-descriptions-item label="审核原因：">{{ detail?.approveReason }}</el-descriptions-item>
    </el-descriptions>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useVModel} from '@vueuse/core'
import {getAlarmApproveDetail} from '@/api/safety'
import type {AlarmApproveListResponse} from '@/api/type'

const props = withDefaults(defineProps<{
  visible: boolean
  id: number
}>(), {
  visible: false,
  id: 0
})

const approveStatus  = {
  0: '待审批',
  1: '已通过',
  2: '未通过',
  3: '撤销',
}

const useVisible = useVModel(props, 'visible')

const detail = ref<AlarmApproveListResponse>({} as AlarmApproveListResponse)
onMounted(async () => {
  const {result, code} = await getAlarmApproveDetail(props.id)
  if (code === 200) {
    detail.value = result
  }
})

</script>

<style lang="scss">
.el-dialog, .el-message-box {
  background: #283F5F
}
</style>
