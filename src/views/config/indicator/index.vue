<template>
    <el-row class="flex items-center searchBox" style="margin-bottom: 20px">
      <el-col :span="18">
        <el-form :model="form" :inline="true">
          <el-form-item label="指标名称：">
            <el-input v-model="form.name" placeholder="请输入指标名称"></el-input>
          </el-form-item>
          <el-form-item label="应用场景" prop="scene">
            <el-select placeholder="请选择应用场景" v-model="form.scene">
              <el-option label="请选择应用场景" value=""/>
              <el-option v-for="item in sceneOptions" :label="item.label" :value="item.value" :key="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="getListData">查询</el-button>
            <el-button type="primary" @click="onReset">重置</el-button>
            <el-button v-auth="['indicator:add']" type="primary" :color="'#48C684'" style="color: #FFFFFF" @click="openModal">
              <el-icon>
                <Plus/>
              </el-icon>
              新增指标
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <div class="echarts-list">
      <div class="echarts-item" v-for="(item) in componentList">
        <div class="content">
          <div class="editbtn" v-auth="['indicator:edit']" @click="onEdit(item)">
            <el-icon color="#409eff">
              <Edit/>
            </el-icon>
            <span>编辑</span>
          </div>
          <el-popconfirm
              width="200"
              confirm-button-text="确定"
              cancel-button-text="取消"
              title="确定删除吗？"
              @confirm="confirmDelete(item.id)"
          >
            <template #reference>
              <div class="delebtn" v-auth="['indicator:delete']">
                <el-icon color="#FA5454">
                  <Remove/>
                </el-icon>
                <span>删除</span></div>
            </template>
            >
          </el-popconfirm>
          <!--          <div class="switchbtn">-->
          <!--            <el-switch style="&#45;&#45;el-switch-on-color: #13ce66; &#45;&#45;el-switch-off-color: #ff4949"/>-->
          <!--          </div>-->
          <div class="noDev" v-if="item.status===1">
            开发中
          </div>
          <div v-else>
            <component :key="item.name" :is="item.component"/>
          </div>
        </div>
        <div class="info">
          <span>应用：{{ item.name }}</span>
          <span>指标编码：{{ item.code }}</span>
        </div>
      </div>
    </div>
      <el-pagination
          :page-sizes="[10, 20, 50, 100]"
          layout="->,total, sizes, prev, pager, next"
          :total="tablePagination.total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="tablePagination.pageNo"
          :page-size="tablePagination.pageSize"
      />
    <DialogModal :title="dialogData.title" v-model:visible="dialogData.visible" :width="dialogData.width"
                 @success="submitForm(ruleFormRef)" @cancel="onCancel">
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px" :rules="rules">
        <el-form-item label="指标名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入指标名称"/>
        </el-form-item>
        <el-form-item label="指标类型" prop="type">

          <el-input v-model="ruleForm.type" placeholder="请输入指标类型"/>
        </el-form-item>
        <el-form-item label="应用场景" prop="scene">
          <el-select placeholder="请选择应用场景" v-model="ruleForm.scene" style="width: 100%">
            <el-option v-for="item in sceneOptions" :label="item.label" :value="item.value" :key="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="指标编码" prop="code">
          <el-input placeholder="请输入指标编码" v-model="ruleForm.code"/>
        </el-form-item>
        <el-form-item label="指标url" prop="url">
          <el-input v-model="ruleForm.url" placeholder="请输入指标url"></el-input>
        </el-form-item>
        <el-form-item label="开发状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">未开发</el-radio>
            <el-radio :label="2">已开发</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </DialogModal>
</template>
<script setup lang="ts">
import {ref, reactive, onMounted, computed, markRaw,nextTick} from 'vue'
import {Plus, Search, Remove, Edit} from '@element-plus/icons-vue'
import {ElConfigProvider, ElMessage} from 'element-plus'
import DialogModal from '@/components/dialogModal/index.vue'
import type {FormInstance, FormRules} from 'element-plus'
import {
  addIndicatorParams,
  editIndicatorParams,
  getIndicatorData,
  getIndicatorType,
  deleteIndicatorParams
} from "@/api/indicator";
import {getSceneInfoList} from "@/api/template";
import type {AddIndicatorItemParams,} from "@/api/modelType"
import type {Component} from 'vue'

const modules: Record<string, any> = import.meta.glob('/src/components/charts/*.vue', {eager: true})
const components: Array<{ name: string, component: Component }> = []

const form = reactive({
  name: '',
  scene: ''
})
const dialogData = ref({
  title: '新增指标',
  visible: false,
  width: 700
})


const ruleForm = reactive<AddIndicatorItemParams>({
  name: '',
  scene: '',
  code: '',
  type: '',
  status: 1,
  url: '',
  id: ''
})


const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {required: true, message: '请输入指标名称', trigger: 'blur'},
    {max: 18, message: '字符不超过18个', trigger: 'blur'},
  ],
  type:[
    {required: true, message: '请输入指标类型', trigger: 'blur'},
    {max: 50, message: '字符不超过50个', trigger: 'blur'},
  ],
  scene: [
    {required: true, message: '请选择应用场景', trigger: 'change'}
  ],
  code:[
    {required: true, message: '请输入指标编码', trigger: 'blur'},
    {max: 18, message: '字符不超过18个', trigger: 'blur'},
  ],
  url:[
    {required: true, message: '请输入指标url', trigger: 'blur'},
    {max: 200, message: '字符不超过200个', trigger: 'blur'},
  ],
  status:[{required: true, message: '请选择指标状态', trigger: 'change'},]
})


const sceneOptions = ref()
const getSceneData = async () => {
  const res = await getSceneInfoList()
  sceneOptions.value = res
}
const indicatorOptions = ref()
const getIndicatorTypeData = async () => {
  const res = await getIndicatorType()
  indicatorOptions.value = res
}

onMounted(() => {
  getSceneData()
  getIndicatorTypeData()
  getListData()
})

const indicatorData = ref()
const tablePagination = reactive({
  total: 0,
  pageSize: 10,
  pageNo: 1,
});

const getListData = async () => {
  const params = {
    name: form.name,
    scene: form.scene,
    pageNo: tablePagination.pageNo,
    pageSize: tablePagination.pageSize
  }
  const res = await getIndicatorData(params)
  if (res && res.code === 200) {
    indicatorData.value = res.result.records
    for (const modulesKey in modules) {
      const name = modulesKey.split('/')[4].split('.')[0]
      if (indicatorData.value.find((item: any) => item.type === name)) {
        components.push({
          name,
          component: modules[modulesKey].default || modules[modulesKey]
        })
      }
    }
    tablePagination.total = res.result.total
  }
}

const componentList = computed(() => {
  return indicatorData.value?.map((item: any) => {
    const foundComponent = components.find(component => component.name === item.type);
    const component = foundComponent ? markRaw(foundComponent.component) : null;
    return {
      ...item,
      component: component
    }
  })
})


//打开弹窗
const openModal = () => {
  dialogData.value.visible = true
}

const ruleFormRef = ref<FormInstance>()
const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate((valid) => {
    if (valid) {
      if (ruleForm.id === '') {
        addIndicatorParams(ruleForm).then(res => {
          if (res && res.code === 200) {
            ElMessage.success(res.message)
            onCancel()
            getListData()
          } else {
            ElMessage.error(res.message)
          }
        })
      } else {
        editIndicatorParams(ruleForm).then(res => {
          if (res && res.code === 200) {
            ElMessage.success(res.message)
            onCancel()
            getListData()
          } else {
            ElMessage.error(res.message)
          }
        })

      }

    } else {
      console.log('error submit!')
      return false
    }
  })
}
const onCancel = () => {
  ruleForm.id = ''
  ruleFormRef.value?.resetFields()
  dialogData.value.visible = false
}

//分页切换
const handleCurrentChange = (val: number) => {
  tablePagination.pageNo = val;
  getListData();
};
//数字切换
const handleSizeChange = (val: number) => {
  tablePagination.pageSize = val;
  getListData();
};

const onEdit = (item: any) => {
  dialogData.value.visible = true
  nextTick(()=>{
    Object.assign(ruleForm, item)
  })
}

const onReset = () => {
  form.name = ''
  form.scene = ''
  getListData()
}


const confirmDelete = (id: string) => {
  deleteIndicatorParams({id}).then(res => {
    if (res && res.code === 200) {
      ElMessage.success('删除成功！')
      getListData()

    } else {
      ElMessage.error(res.message)
    }
  })
}

</script>
<style scoped lang="scss">
.searchBox {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }
}

.echarts-list {
  display: flex;
  flex-wrap: wrap;

  .echarts-item {
    padding: 10px;
    width: 25%;
    box-sizing: border-box;

    .content {
      width: 100%;
      border: 1px solid #8EA6CD;
      border-radius: 8px;
      height: 310px;
      overflow: hidden;
      position: relative;

      .editbtn {
        cursor: pointer;
        position: absolute;
        right: 70px;
        top: 10px;
        display: flex;
        align-items: center;
        z-index: 999;

        span {
          margin-left: 5px;
          color: #409eff;
          font-size: 14px;
        }
      }

      .delebtn {
        cursor: pointer;
        position: absolute;
        right: 10px;
        top: 10px;
        display: flex;
        align-items: center;
        z-index: 999;

        span {
          margin-left: 5px;
          color: #FA5454;
          font-size: 14px;
        }
      }

      .switchbtn {
        position: absolute;
        top: 5px;
        left: 10px;
      }

      .noDev {
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ccc;
        height: 100%;
      }
    }

    .info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      padding: 10px 0;
    }
  }
}
</style>
