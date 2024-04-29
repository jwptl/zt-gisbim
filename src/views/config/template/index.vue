<template>
  <div>
    <el-row>
      <el-col :span="4" class="treebox">
        <div class="title">
          <div class="info">
            <el-icon>
              <Menu/>
            </el-icon>
            <span>模板分类</span>
          </div>
          <div class="addItem" v-auth="['template:add']" @click="dialogData.visible=true">
            <el-icon color="#329CFF">
              <Plus/>
            </el-icon>
            <span>添加模板</span></div>
        </div>
        <div class="templateList">
          <div :class="['listItem',index===current?'active':'']" @click="onClickItem(index,item)"
               v-for="(item,index) in templateList" :key="item.id">{{ item.name }}
          </div>
        </div>
      </el-col>
      <el-col :span="19" :offset="1">
        <div class="flex justify-between items-center tabsbox">
          <TabContent :tabs="tabList" v-model:tab-current="tabCurrent" @change="onChangeTab"/>
          <div class="flex items-center" style="font-size: 14px;cursor: pointer;" @click="onAddIndicator">
            <el-icon color="#329CFF">
              <Plus/>
            </el-icon>
            <span v-auth="['template:add']" style="color:#329CFF;margin-left: 5px">添加指标</span>
          </div>
        </div>
        <TableList :tableData="tableData" :columns="tableColumn" @sizeChange="handleSizeChange"
                   @currentChange="handleCurrentChange"
                   :total="tablePagination.total" :current="tablePagination.pageNo"
                   :pageSize="tablePagination.pageSize"
        >
          <template v-slot:state="{ row }">
            <span>{{ row.state }}</span>
          </template>
          <template v-slot:action="{ row }">
            <el-popconfirm
                width="200"
                confirm-button-text="确定"
                cancel-button-text="取消"
                title="确定删除吗？"
                @confirm="confirmDelete(row.id)"
            >
              <template #reference>
                <el-button v-auth="['template:delete']" :icon="Delete" text type="danger">
                  删除
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </TableList>
      </el-col>
    </el-row>
    <DialogModal :title="dialogData.title" v-model:visible="dialogData.visible" :width="dialogData.width"
                 @success="submitForm(ruleFormRef)" @cancel="onCancel">
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px" :rules="rules">
        <el-form-item label="模板名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入模板名称"/>
        </el-form-item>
      </el-form>
    </DialogModal>
    <DialogModal :title="metrics.title" v-model:visible="metrics.visible" :width="metrics.width"
                 @success="submitMetrics(metricsFormRef)" @cancel="onCancel2">
      <el-form ref="metricsFormRef" :model="metricsForm" label-width="120px" :rules="metricsRules">
        <el-form-item label="指标名称" prop="indicatorId">
          <el-select v-model="metricsForm.indicatorId" placeholder="请选择指标名称" style="width: 100%">
            <el-option v-for="item in indicatorOptions" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
        <el-form-item label="指标排序" prop="sort">
          <el-input type="number" @keydown="handleKeyDown" v-model="metricsForm.sort" placeholder="请输入指标排序"/>
        </el-form-item>
      </el-form>
    </DialogModal>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted} from 'vue'
import TableList from '@/components/tableList/index.vue'
import {Plus, Menu, Delete} from "@element-plus/icons-vue";
import DialogModal from '@/components/dialogModal/index.vue'
import TabContent from '@/components/tabContent/index.vue'
import type {FormInstance, FormRules} from 'element-plus'
import {
  getTemplateList,
  addTemplateItem,
  getNormList,
  getSceneList,
  getIndicatorList,
  addIndicatorItem, deleteIndicatorItem
} from "@/api/template";
import {ElMessage} from 'element-plus'
import type {AddIndicatorParams} from "@/api/modelType";

const templateList = ref()
const dialogData = ref({
  title: '添加模板',
  visible: false,
  width: 500
})

const current = ref(0)
const tableData = ref()
const tabCurrent = ref(0)
const tabList = ref()
const indicatorOptions = ref()
const tablePagination = reactive({
  total: 0,
  pageSize: 10,
  pageNo: 1,
});

interface Tree {
  id: string
  label: string
  children?: Tree[]
}

interface RuleForm {
  name: string
  indicatorTemplateId: string
  code: string
  scene?: number | string
}

const ruleForm = reactive<RuleForm>({
  name: '',
  indicatorTemplateId: '',
  code: '',
  scene: undefined
})

const metrics = ref({
  title: '添加指标',
  visible: false,
  width: 500
})


const metricsForm = reactive<AddIndicatorParams>({
  indicatorId: '',
  sort: '',
  indicatorTemplateId: '',
  scene: ''
})

const handleKeyDown = (event: any) => {
  const keyCode = event.keyCode || event.which;
  // 禁止输入 'e'
  if (keyCode === 69) {
    event.preventDefault();
  }
}

const metricsRules = reactive<FormRules<typeof metricsForm>>({
  indicatorId: [
    {required: true, message: '请选择指标名称', trigger: 'change'},
  ],
  sort: [
    {required: true, message: '请输入指标排序', trigger: 'blur'},
    {max: 9, message: '请输入0-999999999的整数', trigger: 'blur'},
    {pattern: /^[0-9]\d*$/, message: '数值只能为正整数', trigger: 'blur'}
  ]
})

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {required: true, message: '请输入模版名称', trigger: 'blur'},
  ]
})

interface Column {
  label?: string
  prop: string
  slot?: string
  width?: string
  ellipsis?: boolean
}

const getTreeDataList = async () => {
  const res = await getTemplateList({
    pageNo: 1,
    pageSize: 10000
  })
  if (res && res.code === 200) {
    templateList.value = res.result.records
    ruleForm.indicatorTemplateId = res.result.records[0].id
    getSceneData()
  }
}

const getSceneData = async () => {
  const res = await getSceneList()
  if (res && res.length > 0) {
    tabList.value = res
    ruleForm.scene = res[0].value
    getNormData()
  }
}

onMounted(() => {
  getTreeDataList()
})

const getNormData = async () => {
  const params = {
    pageNo: tablePagination.pageNo,
    pageSize: tablePagination.pageSize,
    indicatorTemplateId: ruleForm.indicatorTemplateId,
    scene: ruleForm.scene
  }
  const res = await getNormList(params)
  if (res && res.code === 200) {

      tableData.value = res.result.records
      tablePagination.total = res.result.total
  }
}

const tableColumn = <Array<Column>>[
  {
    label: "指标名称",
    prop: "indicatorName"
  },
  {
    label: "排序",
    prop: "sort",
  },
  {
    label: "操作",
    prop: "action",
    slot: "action"
  }
]

//切换左侧模板
const onClickItem = (i: number, item: any) => {
  current.value = i
  ruleForm.indicatorTemplateId = item.id
  getNormData()
}

//切换场景tab
const onChangeTab = (val: string) => {
  ruleForm.scene = val
  getNormData()
}

const onAddIndicator = () => {
  getIndicatorList({
    pageSize: 10000,
    pageNo: 1,
    scene: ruleForm.scene == 1 ? 1 : undefined,
    status: 2
  }).then(res => {
    indicatorOptions.value = res.result.records
  })
  metrics.value.visible = true
}

const ruleFormRef = ref<FormInstance>()
const metricsFormRef = ref<FormInstance>()

const submitMetrics = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      const params = {
        indicatorId: metricsForm.indicatorId,
        sort: metricsForm.sort,
        indicatorTemplateId: ruleForm.indicatorTemplateId,
        scene: ruleForm.scene
      }
      addIndicatorItem(params).then(res => {
        if (res && res.code === 200) {
          ElMessage.success('新增成功！')
          onCancel2()
          getNormData()
        } else {
          ElMessage.error(res.message)
        }
      })
    } else {

      return false
    }
  })
}

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      addTemplateItem(ruleForm).then(res => {
        if (res && res.code === 200) {
          ElMessage.success('新增成功！')
          onCancel()
          getTreeDataList()
        } else {
          ElMessage.error(res.message)
        }
      })
    } else {
      return false
    }
  })
}

const onCancel = () => {
  ruleForm.name = ''
  ruleFormRef.value?.resetFields()
  dialogData.value.visible = false
}

const onCancel2 = () => {
  metricsFormRef.value?.resetFields()
  metrics.value.visible = false
}

//分页切换
const handleCurrentChange = (val: number) => {
  tablePagination.pageNo = val;
  getNormData()
};
//数字切换
const handleSizeChange = (val: number) => {
  tablePagination.pageSize = val;
  if(tableData.value.length===0&&tablePagination.total>0&&tablePagination.pageNo!==1){
    tablePagination.pageNo--
    console.log('页码主动减少'+tablePagination.pageNo--)
  }
  getNormData()
};

const confirmDelete = (id: string) => {
  deleteIndicatorItem({id}).then(res => {
    if (res && res.code === 200) {
      ElMessage.success('删除成功！')
      getNormData()
    } else {
      ElMessage.error(res.message)
    }
  })
}
</script>

<style lang="scss" scoped>
.tabsbox {
  padding: 0 40px;
  border: 1px solid #ADCEE7;
}

.treebox {
  border: 1px solid #ADCEE7;

  .title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    box-sizing: border-box;
    border-bottom: 1px solid #ADCEE7;

    .info {
      color: #ADCEE7;
      display: flex;
      align-items: center;
      font-size: 14px;

      span {
        margin-left: 5px
      }
    }

    .addItem {
      display: flex;
      align-items: center;
      color: #329CFF;
      font-size: 14px;
      cursor: pointer;

      span {
        margin-left: 5px
      }
    }
  }

  .templateList {
    padding: 30px 50px;
    box-sizing: border-box;
    max-height: 550px;
    overflow: auto;

    .listItem {
      color: #ADCEE7;
      margin-bottom: 20px;
      font-size: 14px;
      cursor: pointer;
    }

    .active {
      color: #FFFFFF;
    }
  }

}


</style>
