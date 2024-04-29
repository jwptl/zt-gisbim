<!--封装弹窗组件-->
<template>
  <div>
    <el-dialog v-model="useVisible" :title="title" :width=width :before-close="handleClose">
      <slot></slot>
      <template #footer v-if="btnFlag">
                <span class="dialog-footer">
                    <el-button @click="onCancel">取消</el-button>
                    <el-button type="primary" @click="onSuccess">
                        确定
                    </el-button>
                </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import {useVModel} from "@vueuse/core";

interface DialogProps {
  visible: boolean
  title: string
  width: number | string
  btnFlag?: boolean
}

const props = withDefaults(defineProps<DialogProps>(), {
  btnFlag: true,
  visible: false
})

const emits = defineEmits(['update:visible', 'success', 'cancel'])

const useVisible = useVModel(props, 'visible')

//右上角关闭按钮回调
const handleClose = () => {
  emits('cancel')
}

//取消按钮回调
const onCancel = () => {
  // emits('update:dialogVisible', false)
  emits('cancel')
}

//确定按钮回调
const onSuccess = () => {
  emits('success')
}
</script>


<style scoped lang="scss">
:deep(.el-dialog) {
  background: #283F5F
}
</style>
