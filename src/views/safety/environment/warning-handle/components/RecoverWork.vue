<template>
  <el-dialog v-model="useVisible" title="恢复施工" width="500">
    <el-form :rules="rules" ref="formRef" :model="form">
      <el-form-item prop="noticeUserIdList" label="通知对象" label-width="120px">
        <el-select multiple v-model="form.noticeUserIdList" placeholder="请选择">
          <el-option v-for="item in approveUsers" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知内容" prop="content" label-width="120px">
        <el-input :rows="4" type="textarea" v-model="form.content" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="通知次数" prop="noticeNum" label-width="120px">
        <el-input-number @keydown="channelInputLimit" :min="0" v-model.number="form.noticeNum" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="通知频率" prop="noticeFrequency" label-width="120px">
        <el-input-number @keydown="channelInputLimit" :min="0" class="mr-2" v-model.number="form.noticeFrequency" autocomplete="off"/> min/次
      </el-form-item>
      <el-form-item label="通知方式" prop="noticeType" label-width="120px">
        <el-checkbox-group v-model="form.noticeType">
          <el-checkbox label="短信" :value="1" />
          <el-checkbox label="安全帽" :value="2" />
        </el-checkbox-group>
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
import {getApproveUserList, recoverWork, workAreaList} from '@/api/safety'
import type {
  getApproveUserListResponse,
  publishInstructionParams,
  workAreaListResponse
} from '@/api/type'

const formRef = ref<FormInstance>()

const props = withDefaults(defineProps<{
  visible: boolean
  workAreaId: number
}>(), {
  visible: false,
  workAreaId: 0
})
const useVisible = useVModel(props, 'visible')

const form = reactive<Exclude<publishInstructionParams, 'isEvacuate'>>({
  content: '',
  noticeFrequency: 0,
  noticeNum: 0,
  noticeType: [],
  noticeUserIdList: [],
})

const rules: FormRules = {
  noticeUserIdList: [
    {required: true, message: '通知对象不能为空', trigger: 'change'},
  ],
  content: [
    {required: true, message: '通知内容不能为空', trigger: 'blur'},
  ],
  noticeNum: [
    {required: true, message: '通知次数不能为空', trigger: 'blur'},
  ],
  noticeFrequency: [
    {required: true, message: '通知频率不能为空', trigger: 'blur'},
  ],
  noticeType: [
    {required: true, message: '通知方式不能为空', trigger: 'change'},
  ],
}

const workAreas = ref<workAreaListResponse[]>([])
const approveUsers = ref<getApproveUserListResponse[]>([])
onMounted(() => {
  workAreaList({pageNo: 1, pageSize: 1000}).then(res => {
    workAreas.value = res.result.records
  })

  getApproveUserList(props.workAreaId).then(res => {
    approveUsers.value = res.result
  })
})

const emits = defineEmits(['success'])
const onsubmit = async () => {
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      const {code, message} = await recoverWork({...form, workAreaId: props.workAreaId})
      if (code === 200) {
        ElMessage.success('发布成功')
        emits('success')
        useVisible.value = false
      } else {
        ElMessage.error(message)
      }
    }
  })
}

const channelInputLimit = (e: any) => {
  const key = e.key;
  const notAllowList = ['e','+','-', '.'];
  if (notAllowList.includes(key)) {
    e.returnValue = false
    return false
  }
  return true
}
</script>

<style lang="scss">

</style>
