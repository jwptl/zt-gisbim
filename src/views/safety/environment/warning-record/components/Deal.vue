<template>
  <el-dialog v-model="useVisible" title="处理" width="500">
    <el-form :rules="rules" ref="formRef" :model="form">
      <el-form-item prop="dealResult" label="实地核查结果" label-width="120px" required>
        <el-radio-group v-model="form.dealResult">
          <el-radio :label="1">存在危险</el-radio>
          <el-radio :label="2">不存在危险</el-radio>
          <el-radio :label="3">暂不处理</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="处理意见" prop="dealSuggestion" label-width="120px">
        <el-input :rows="4" type="textarea" v-model="form.dealSuggestion" autocomplete="off"/>
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
import {onMounted, reactive, ref} from 'vue'
import {useVModel} from '@vueuse/core'
import {ElMessage, type FormInstance, type FormRules} from 'element-plus'
import {alarmDeal} from '@/api/safety'
import type {getAlarmDealParams,} from '@/api/type'

const formRef = ref<FormInstance>()

const props = withDefaults(defineProps<{
  visible: boolean
  id: string
}>(), {
  visible: false,
  id: ''
})
const useVisible = useVModel(props, 'visible')

const form = reactive<getAlarmDealParams>({
  dealSuggestion: '',
  id: '',
  dealResult: 1,
})

const rules: FormRules = {
  dealSuggestion: [
    {required: true, message: '处理内容不能为空', trigger: 'blur'},
  ]
}

onMounted(() => {
  form.id = props.id
})

const emits = defineEmits(['success'])
const onsubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      const {code, message} = await alarmDeal(form)
      if (code === 200) {
        ElMessage.success('处理成功')
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

</style>
