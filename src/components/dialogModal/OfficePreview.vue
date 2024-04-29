<template>
  <DialogModal :btn-flag="false" @cancel="useVisible = false" title="预览" v-model:visible="useVisible" width="500px">
    <vue-office-docx
        v-if="props.path.endsWith('.docx')"
        :src="props.path"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
    />

    <vue-office-excel
        v-if="props.path.endsWith('.xls') || props.path.endsWith('.xlsx')"
        :src="props.path"
        style="height: 100vh;"
        @rendered="renderedHandler"
        @error="errorHandler"
    />

    <vue-office-pdf
        v-if="props.path.endsWith('.pdf')"
        :src="props.path"
        @rendered="renderedHandler"
        @error="errorHandler"
    />

    <div v-if="props.path.endsWith('.doc')">暂不支持.doc旧格式word预览</div>

  </DialogModal>
</template>

<script setup lang="ts">
import DialogModal from '@/components/dialogModal/index.vue'
import {useVModel} from '@vueuse/core'
//引入VueOfficeDocx组件
import VueOfficeDocx from '@vue-office/docx'
//引入相关样式
import '@vue-office/docx/lib/index.css'
//引入VueOfficeExcel组件
import VueOfficeExcel from '@vue-office/excel'
//引入相关样式
import '@vue-office/excel/lib/index.css'
import VueOfficePdf from '@vue-office/pdf'

const props = withDefaults(defineProps<{
  visible: boolean
  path: string
}>(), {
  visible: false,
  path: '',
})

const useVisible = useVModel(props, 'visible')

const renderedHandler = () => {
  console.log("渲染完成")
}
const errorHandler = () => {
  console.log("渲染失败")
}
</script>

<style scoped lang="scss">

</style>
