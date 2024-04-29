<template>
  <el-dialog v-model="useVisible" title="审核" width="500">
    <el-form :rules="rules" ref="formRef" :model="form">
      <el-form-item prop="approveStatus" label="是否通过" label-width="120px">
        <el-radio-group v-model="form.approveStatus">
          <el-radio :label="1">通过</el-radio>
          <el-radio :label="2">不通过</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审批原因" prop="approveReason" label-width="120px">
        <el-input :rows="4" type="textarea" v-model="form.approveReason" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="useVisible = false">取消</el-button>
        <el-button type="primary" @click="onsubmit">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import {reactive, ref} from 'vue'
import {useVModel} from '@vueuse/core'
import {ElMessage, type FormInstance, type FormRules} from 'element-plus'
import {alarmApprove} from '@/api/safety'

const formRef = ref<FormInstance>()

const props = withDefaults(defineProps<{
  visible: boolean
  id: number
}>(), {
  visible: false,
  id: 0
})

const useVisible = useVModel(props, 'visible')

const form = reactive<{
  approveReason: string
  approveStatus: 0 | 1 | 2 | 3 | ''
}>({
  approveReason: '',
  approveStatus: 1,
})

const rules: FormRules = {
  approveReason: [
    { required: true, message: '审批原因不能为空', trigger: 'blur' },
  ],
  approveStatus: [
    { required: true, message: '请选择是否通过', trigger: 'change' },
  ],
}

const emits = defineEmits(['success'])
const onsubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      const {code, message} = await alarmApprove({...form, id: props.id})
      if (code === 200) {
        ElMessage.success('审核成功')
        emits('success')
        useVisible.value = false
      } else {
        ElMessage.error(message)
      }
    }
  })
}

</script>

<style lang="scss">
.el-dialog, .el-message-box {
  background: #283F5F
}
</style>
