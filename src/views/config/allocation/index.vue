<template>
  <div>
    <el-row>
      <el-col :span="4" class="treebox">
        <div class="title">
          <div class="info">
            <el-icon>
              <Menu/>
            </el-icon>
            <span>组织机构</span>
          </div>
        </div>
        <div class="treeItem">
          <el-tree-v2 ref="treeV2" :height='450' :item-size="30" :data="treeData" :props="props" @node-click="handleNode" :highlight-current="true"/>
        </div>
      </el-col>
      <el-col :span="19" :offset="1">
        <el-form :model="form" :inline="true">
          <el-form-item label="用户姓名：">
            <el-input v-model="form.fullname" placeholder="请输入用户姓名" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="getUserData">查询</el-button>
            <el-button type="primary" :icon="Refresh" @click="onReset">重置</el-button>
            <el-button v-auth="['allocation:add']" type="success" :icon="Plus" @click="onAllAdd">批量添加</el-button>
          </el-form-item>
        </el-form>
        <TableList selection :tableData="tableData" :columns="tableColumn" @sizeChange="handleSizeChange"
                   @currentChange="handleCurrentChange"
                   :total="tablePagination.total" :current="tablePagination.pageNo"
                   :pageSize="tablePagination.pageSize" @selectionChange="onSelection"
        >
          <template v-slot:state="{ row }">
            <span>{{ row.state }}</span>
          </template>
          <template v-slot:action="{ row }">
            <el-button v-auth="['allocation:edit']" v-if="row.indicatorTemplateId" :icon="Refresh" text type="danger" @click="onAddItem(row.id)">
              更换模板
            </el-button>
            <el-button v-auth="['allocation:add']" v-else :icon="Plus" text type="primary" @click="onAddItem(row.id)">
              添加
            </el-button>
          </template>
        </TableList>
      </el-col>
    </el-row>
    <DialogModal :title="dialogData.title" v-model:visible="dialogData.visible" :width="dialogData.width"
                 @success="submitForm(ruleFormRef)" @cancel="onCancel">
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px" :rules="rules">
        <el-form-item label="模板名称" prop="indicatorTemplateId">
          <el-select v-model="ruleForm.indicatorTemplateId" placeholder="请选择指标名称" style="width: 100%">
            <el-option v-for="item in templateList" :label="item.name" :value="item.id"/>
          </el-select>
        </el-form-item>
      </el-form>
    </DialogModal>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted} from 'vue'
import TableList from '@/components/tableList/index.vue'
import {Plus, Menu, Delete, Search, Refresh} from "@element-plus/icons-vue";
import DialogModal from '@/components/dialogModal/index.vue'
import type {FormInstance, FormRules} from 'element-plus'
import {ElMessage} from 'element-plus'
import {getOrgListTree} from "@/api";
import {addTemplateIds, getTemplateList, userInfoList} from "@/api/template";

const form = reactive({
  fullname: '',
  organizationId: ''
})

const loading = ref(false)

const tableData = ref([])
const tablePagination = reactive({
  total: 0,
  pageSize: 10,
  pageNo: 1,
});
const dialogData = ref({
  title: '添加模板',
  visible: false,
  width: 500
})

const treeData = ref()

const props = {
  value: 'id',
  label: 'name',
  children: 'child',
}

interface RuleForm {
  ids: string
  indicatorTemplateId: string
}

const ruleForm = reactive<RuleForm>({
  ids: '',
  indicatorTemplateId: ''
})

interface MetricsRuleForm {
  name: string
  sort: string
}

const rules = reactive<FormRules<typeof ruleForm>>({
  indicatorTemplateId: [
    {required: true, message: '请选择模板名称', trigger: 'change'},
  ],
})


interface Column {
  label?: string
  prop: string
  slot?: string
  width?: string
  ellipsis?: boolean
}


const getUserData = async () => {
  const params = {
    pageNo: tablePagination.pageNo,
    pageSize: tablePagination.pageSize,
    fullname: form.fullname,
    organizationId: form.organizationId
  }
  const res = await userInfoList(params)
  if (res && res.code === 200) {
    tableData.value = res.result.records
    tablePagination.total = res.result.total
  }
}

const tableColumn = <Array<Column>>[
  {
    label: "用户姓名",
    prop: "fullname",
    width: 180
  },
  {
    label: "模板名称",
    prop: "indicatorTemplateName",
  },
  {
    label: "操作",
    prop: "action",
    slot: "action"
  }
]

const templateList = ref()

const getTempalteData = async () => {
  const res = await getTemplateList({
    pageNo:1,
    pageSize:10000
  })
  if (res && res.code === 200) {
    templateList.value = res.result.records
  }
}
const treeV2 = ref()

onMounted(() => {
  getOrgListTree().then(res => {
    if (res && res.code === 200) {
      let treeList = [res.result]
      treeData.value = treeList
      form.organizationId = res.result.id
      treeV2.value.setCurrentKey(res.result.id)
      getUserData()
    }
  })
  getTempalteData()
})


const handleNode = (val:any) => {
  form.organizationId = val.id
  getUserData()
}

const ruleFormRef = ref<FormInstance>()

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
    formEl.validate((valid:any) => {
      if (valid) {
        addTemplateIds(ruleForm).then(res => {
          if (res && res.code === 200) {
            ElMessage.success(res.message)
            onCancel()
            getUserData()
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
  ruleForm.ids = ''
  ruleFormRef.value?.resetFields()
  dialogData.value.visible = false
}
const selectId = ref('')
const onSelection = (val:any) => {
  let list = <any>[]
  if (val.length > 0) {
    val.forEach((item:any) => {
      list.push(item.id)
    })
    selectId.value = list.join(",")
  } else {
    selectId.value = ''
  }
}
//添加修改
const onAddItem = (id: string) => {
  ruleForm.ids = id
  dialogData.value.visible = true
}

//批量添加
const onAllAdd = () => {
  console.log(selectId.value)
  if (selectId.value === '') {
    ElMessage.error('请选择用户！')
    return false
  }
  ruleForm.ids = selectId.value
  dialogData.value.visible = true
}

const onReset = () => {
  form.fullname = ''
  getUserData()
}

//分页切换
const handleCurrentChange = (val: number) => {
  tablePagination.pageNo = val;
  getUserData()
};
//数字切换
const handleSizeChange = (val: number) => {
  tablePagination.pageSize = val;
  getUserData()
};
</script>

<style lang="scss" scoped>
.tabsbox {
  padding: 0 40px;
  border: 1px solid #ADCEE7;
}

.treebox {
  border: 1px solid #ADCEE7;

  .treeItem {
    padding: 20px 10px;
    max-height: 500px;
    overflow: hidden;
    box-sizing: border-box;
  }

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

    .listItem {
      color: #ADCEE7;
      margin-bottom: 20px;
      font-size: 14px;
      cursor: pointer;
    }
  }

}


</style>