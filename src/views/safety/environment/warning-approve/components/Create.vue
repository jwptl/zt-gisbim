<template>
  <el-dialog v-model="useVisible" title="添加" width="500">
    <el-form :rules="rules" ref="formRef" :model="form">
      <el-form-item prop="workAreaId" label="撤销预警区域" label-width="120px">
       <el-select @change="onWorkAreaChange" v-model="form.workAreaId" placeholder="请选择">
          <el-option v-for="item in workAreas" :key="item.id" :label="item.areaName" :value="item.id"></el-option>
       </el-select>
      </el-form-item>
      <el-form-item prop="isDispose" label="是否处置" label-width="120px">
        <el-radio-group v-model="form.isDispose">
          <el-radio :label="1">是</el-radio>
          <el-radio :label="0">否</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="approverUserId" label="审批人员" label-width="120px">
        <el-select v-model="form.approverUserId" placeholder="请选择">
          <el-option v-for="item in approveUsers" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="处置描述" prop="disposeDesc" label-width="120px">
        <el-input :rows="4" type="textarea" v-model="form.disposeDesc" autocomplete="off"/>
      </el-form-item>
      <el-form-item label="处置照片" required label-width="120px">
        <el-upload
            v-model:file-list="fileList"
            action="/gisbim-api/sys/upload/uploadMinio"
            :data="{biz: 'bim'}"
            :headers="{'X-Access-Token': token}"
            list-type="picture-card"
            accept=".jpg,.jpeg,.png"
        >
          <el-icon><Plus /></el-icon>
        </el-upload>
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
import {ElMessage, type FormInstance, type FormRules, type UploadUserFile, type UploadProps} from 'element-plus'
import {addAlarmApprove, getApproveUserList, workAreaList} from '@/api/safety'
import type {AddAlarmApproveParams, getApproveUserListResponse, workAreaListResponse} from '@/api/type'
import {Plus} from '@element-plus/icons-vue'

const formRef = ref<FormInstance>()

const props = withDefaults(defineProps<{
  visible: boolean
}>(), {
  visible: false
})
const token = localStorage.getItem('oauthToken')
const useVisible = useVModel(props, 'visible')

const form = reactive<AddAlarmApproveParams>({
  approverUserId: '',
  disposeDesc: '',
  images: [],
  isDispose: 0,
  workAreaId: ''
})

const rules: FormRules = {
  approverUserId: [
    {required: true, message: '审批人不能为空', trigger: 'change'},
  ],
  workAreaId: [
    {required: true, message: '撤销预警区域不能为空', trigger: 'change'},
  ],
  disposeDesc: [
    {required: true, message: '处置描述不能为空', trigger: 'blur'},
  ],
  images: [
    {required: true, message: '处置图片不能为空', trigger: 'change'},
  ],
  isDispose: [
    {required: true, message: '是否处置不能为空', trigger: 'change'},
  ],
}

const workAreas = ref<workAreaListResponse[]>([])
const approveUsers = ref<getApproveUserListResponse[]>([])
onMounted(() => {
  workAreaList({pageNo: 1, pageSize: 1000}).then(res => {
    workAreas.value = res.result.records
  })

})
const fileList = ref<any[]>([])

const onWorkAreaChange = (val: number) => {
  form.approverUserId = ''

  getApproveUserList(val).then(res => {
    approveUsers.value = res.result
  })
}

const emits = defineEmits(['success'])
const onsubmit = async () => {
  if (fileList.value.length === 0) {
    ElMessage.error('请上传处置图片')
    return
  }
  await formRef.value?.validate(async (valid) => {
    if (valid) {
      form.images = fileList.value.map(item => item.response.message) as string[]
      const {code, message} = await addAlarmApprove(form)
      if (code === 200) {
        ElMessage.success('添加成功')
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
