<template>
  <el-dialog v-model="useVisible" title="恢复施工" width="500" class="flex">
    <el-timeline v-if="records.length">
      <el-timeline-item
          v-for="record in records"
          :key="record.id"
          :timestamp="record.createTime"
          type="primary"
      >
        <div>{{ record.typeName }}</div>
        <div v-if="record.users">通知人员{{ record.users }}</div>

      </el-timeline-item>
    </el-timeline>

    <div v-else>暂无记录</div>
  </el-dialog>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {useVModel} from '@vueuse/core'
import type {actionLogsResponse} from '@/api/type'
import {actionLogs} from '@/api/safety'

const props = withDefaults(defineProps<{
  visible: boolean
  id: number
}>(), {
  visible: false,
  id: 0
})
const useVisible = useVModel(props, 'visible')

const records = ref<actionLogsResponse[]>([])
onMounted(() => {
  actionLogs(props.id).then(res => {
    if (res.code === 200) {
      records.value = res.result
    }
  })
})


</script>

<style lang="scss">

</style>
