<template>
  <div>
    <el-row>
      <el-col :span="4" class="treebox">
        <div class="title">
          <div class="info">
            <el-icon>
              <Menu/>
            </el-icon>
            <span>模型分类</span>
          </div>
        </div>
        <div class="treeItem">
          <ul class="modelBox">
            <label>
              <el-icon color="#cfd3dc">
                <CaretRight/>
              </el-icon>
              通用模型</label>

            <li :class="[index===current?'active':'']" v-for="(item,index) in modelData" :key="item.value"
                @click="onSelect(index,item)">
              <el-icon color="#cfd3dc">
                <CaretRight/>
              </el-icon>
              {{ item.label }}
            </li>
          </ul>
          <el-tree-v2 ref="treeV2" :data="treeData" :props="props" @node-click="handleNode" :highlight-current="true"/>
        </div>
      </el-col>
      <el-col :span="19" :offset="1">
        <el-form :model="form" :inline="true">
          <el-form-item label="设备模型名称：">
            <el-input v-model="form.name" placeholder="请输入设备模型名称" clearable></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :icon="Search" @click="getModelData">查询</el-button>
          </el-form-item>
        </el-form>
        <div class="template-list">
          <div class="template-item" v-for="item in modelList">
            <div class="content">
              <div class="state">
                <label :style="{background:item.status===1?'#4FFF6C':'#FF3535'}"></label>
                <span>{{ item.status === 1 ? '启用' : '禁用' }}</span>
              </div>
              <img :src="item.image" style="width: 100%;height: 100%;object-fit: cover">
            </div>
            <div class="info">
              <span>{{ item.name }}</span>
              <span>
                <el-popconfirm
                    width="200"
                    confirm-button-text="确定"
                    cancel-button-text="取消"
                    title="确定删除吗？"
                    @confirm="confirmDelete(item.id)"
                >
                   <template #reference>
                        <el-icon v-auth="['modelmanage:delete']" size="16" style="margin-right: 5px;cursor: pointer"><Delete/></el-icon>
                   </template>>
                  </el-popconfirm>
                <el-icon size="16" style="margin-right: 5px;cursor: pointer" @click="onDetail(item,true)"><View/></el-icon>
                <el-icon v-auth="['modelmanage:edit']" size="16" style="margin-right: 5px;cursor: pointer" @click="onDetail(item,false)"><Edit/></el-icon>
              </span>
            </div>
          </div>
          <div class="template-item" v-auth="['modelmanage:add']" @click="onOpenDialog" v-if="ruleForm.category===1" >
            <div class="content addcont">
              <el-icon size="50">
                <Plus/>
              </el-icon>
            </div>
          </div>
          <div class="template-item" v-auth="['modelmanage:add']" v-else @click="onOpenTree">
            <div class="content addcont">
              <el-icon size="50">
                <Plus/>
              </el-icon>
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
      </el-col>
    </el-row>
    <DialogModal :title="dialogData.title" v-model:visible="dialogData.visible" :width="dialogData.width"
                 @success="submitForm(ruleFormRef)" @cancel="onCancel" :btnFlag="btnFlag">
      <el-form ref="ruleFormRef" :model="ruleForm" label-width="120px" :rules="rules">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入模型名称" :disabled="formDetail"/>
        </el-form-item>
        <el-form-item label="展示对象" prop="modelType">
          <el-select v-model="ruleForm.modelType" :disabled="formDetail" placeholder="请选择展示对象" style="width:100%">
            <el-option v-for="item in displayList" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="图片" required>
          <el-upload
              class="uploader"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :action="uploadUrl"
              :data="{biz: 'bim'}"
              :headers="{'X-Access-Token': token}"
              :on-success="onSuccess"
              :disabled="formDetail"
          >
            <img v-if="imageUrl||formDetail" :src="imageUrl" class="avatar"/>
            <el-icon v-else class="uploader-icon" size="40">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="模型文件" required>
          <el-upload
              ref="upload"
              class="upload-demo"
              :action="uploadUrl"
              :limit="1"
              :data="{biz: 'bim'}"
              :headers="{'X-Access-Token': token}"
              :on-success="onFile"
              :on-exceed="handleExceed"
              :disabled="formDetail"
              :file-list="fileList"
              :on-remove="handleRemove"
          >
            <template #trigger>
              <el-button type="primary">上传文件</el-button>
            </template>
          </el-upload>
        </el-form-item>

        <el-form-item label="缩放比例" prop="scale">
          <el-input-number @keydown="handleKeyDown" v-model="ruleForm.scale"/>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </DialogModal>
    <DialogModal :title="orgTreeModel.title" v-model:visible="orgTreeModel.visible" :width="orgTreeModel.width"
                 @success="submitForm(orgTreeForm)" @cancel="onCancel2" :btnFlag="btnFlag">
      <el-form ref="orgTreeForm" :model="ruleForm" label-width="120px" :rules="rules">
        <el-form-item label="模型名称" prop="name">
          <el-input v-model="ruleForm.name" :disabled="formDetail" placeholder="请输入模型名称"/>
        </el-form-item>
        <el-form-item label="图片" required>
          <el-upload
              class="uploader"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :action="uploadUrl"
              :data="{biz: 'bim'}"
              :headers="{'X-Access-Token': token}"
              :on-success="onSuccess"
          >
            <img v-if="imageUrl||formDetail" :src="imageUrl" class="avatar"/>
            <el-icon v-else class="uploader-icon" size="40">
              <Plus/>
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="数据地址" prop="dataUrl">
          <el-input v-model="ruleForm.dataUrl" :disabled="formDetail" placeholder="请输入数据地址"/>
        </el-form-item>
        <el-form-item label="经度" prop="lng">
          <el-input type="number" @keydown="handleKeyDown" v-model="ruleForm.lng" :disabled="formDetail" placeholder="请输入经度"/>
        </el-form-item>
        <el-form-item  label="纬度" prop="lat">
          <el-input type="number" @keydown="handleKeyDown" v-model="ruleForm.lat" :disabled="formDetail" placeholder="请输入纬度"/>
        </el-form-item>
        <el-form-item label="高度" prop="alt">
          <el-input type="number" @keydown="handleKeyDown" v-model="ruleForm.alt" :disabled="formDetail" placeholder="请输入高度"/>
        </el-form-item>
        <el-form-item label="转体角度" prop="direction">
          <el-input type="number" @keydown="handleKeyDown" v-model="ruleForm.direction" :disabled="formDetail" placeholder="请输入转体角度"/>
        </el-form-item>
        <el-form-item label="状态">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </DialogModal>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, onMounted, nextTick} from 'vue'
import {Plus, Menu, Search, Delete, Edit, View, CaretRight} from "@element-plus/icons-vue";
import DialogModal from '@/components/dialogModal/index.vue'
import {ElMessage, genFileId} from 'element-plus'
import type {FormInstance, FormRules, UploadProps, UploadRawFile, UploadInstance, UploadUserFile} from 'element-plus'
import {getOrgListTree} from "@/api";
import {
  addModelItem,
  editModelItem,
  deleteModelItem,
  getCurrentModelList,
  getDisplayList,
  getModelList
} from "@/api/model";
import type {AddModalParams} from "@/api/modelType";


const uploadUrl = '/gisbim-api/sys/upload/uploadMinio'
const token = localStorage.getItem('oauthToken')

const current = ref(0)
const treeV2 = ref()
const form = reactive({
  name: ''
})
const modelList = ref()
const displayList = ref()
const tablePagination = reactive({
  total: 0,
  pageSize: 10,
  pageNo: 1,
});

const imageUrl = ref('')
const treeData = ref()
const modelData = ref()
const formDetail = ref(false)
const fileList = ref<UploadUserFile[]>([])

const dialogData = ref({
  title: '添加模型',
  visible: false,
  width: 1000
})

const orgTreeModel = ref({
  title: '添加模型',
  visible: false,
  width: 600
})

onMounted(() => {
  getOrgListTree().then(res => {
    if (res && res.code === 200) {
      let treeList = [res.result]
      treeData.value = treeList
    }
  })

  getDisplayList().then(res => {
    displayList.value = res
  })
  getCurrentModelList().then(res => {
    modelData.value = res
    if (modelData.value.length > 0) {
      current.value = 0
      ruleForm.category = 1
      ruleForm.sId = modelData.value[0].value
    }
    getModelData()
  })


})

//点击通用模型
const onSelect = (i: number, item: any) => {
  current.value = i
  ruleForm.category = 1
  ruleForm.sId = item.value
  ruleForm.orgId = ''
  treeV2.value.setCurrentKey(null)
  getModelData()
}


const getModelData = async () => {
  const params = {
    pageSize: tablePagination.pageSize,
    pageNo: tablePagination.pageNo,
    sId: ruleForm.sId,
    name: form.name,
    orgId: ruleForm.orgId
  }
  const result = await getModelList(params)
  if (result && result.code === 200) {
    modelList.value = result.result.records
    tablePagination.total = result.result.total
  }
}

//分页切换
const handleCurrentChange = (val: number) => {
  tablePagination.pageNo = val;
  getModelData();
};
//数字切换
const handleSizeChange = (val: number) => {
  tablePagination.pageSize = val;
  getModelData();
};


const props = {
  value: 'id',
  label: 'name',
  children: 'child',
}


const ruleForm = reactive<AddModalParams>({
  id: '',
  name: '',
  category: 1,
  sId: '',
  modelUrl: '',
  image: '',
  modelType: '',
  orgId: '',
  dataUrl: '',
  lng:undefined,
  lat: undefined,
  alt: undefined,
  direction: undefined,
  scale: 1,
  status: 0
})


const handleKeyDown = (event: any) => {
  const keyCode = event.keyCode || event.which;
  // 禁止输入 'e'
  if (keyCode === 69) {
    event.preventDefault();
  }
}

const rules = reactive<FormRules<typeof ruleForm>>({
  name: [
    {required: true, message: '请输入模型名称', trigger: 'blur'},
  ],
  modelType: [
    {required: true, message: '请选择展示对象', trigger: 'change'},
  ],
  dataUrl: [
    {required: true, message: '请输入数据地址', trigger: 'blur'},
  ]
})


//上传图片验证
const beforeUpload: UploadProps['beforeUpload'] = (rawFile: any) => {
  const imgType = ['image/jpeg', 'image/png'];
  if (!imgType.includes(rawFile.type)) {
    ElMessage.error('请上传图片！');
    return false;
  }
  return true
}

//上传图片成功
const onSuccess: UploadProps['onSuccess'] = (
    response,
    uploadFile
) => {
  if(response.code!==0){
    ElMessage.error('上传出错，请重新上传！');
    return false
  }
  imageUrl.value = URL.createObjectURL(uploadFile.raw!)
  ruleForm.image = response.message
}

const upload = ref<UploadInstance>()
//上传文件
const onFile: UploadProps['onSuccess'] = (
    response
) => {
  if(response.code!==0){
    ElMessage.error('上传出错，请重新上传！');
    upload.value!.clearFiles()
    return false
  }
  ruleForm.modelUrl = response.message
}
const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
  upload.value!.submit()
}

const btnFlag = ref(true)
const ruleFormRef = ref<FormInstance>()
const orgTreeForm = ref<FormInstance>()

const submitForm = (formEl: FormInstance | undefined) => {
  if (ruleForm.image === '') {
    ElMessage.error('请上传图片')
    return false
  }
  if (ruleForm.category === 1 && ruleForm.modelUrl === '') {
    ElMessage.error('请上传模型文件')
    return false
  }
  if (!formEl) return
  formEl.validate((valid: any) => {
    if (valid) {
      if (ruleForm.id === '') {
        addModelItem(ruleForm).then(res => {
          if (res && res.code === 200) {
            if (ruleForm.category === 1) {
              onCancel()
            } else {
              onCancel2()
            }
            ElMessage.success('添加成功！');
            getModelData()
          }
          else {
            ElMessage.error(res.message)
          }
        })
      } else {
        editModelItem(ruleForm).then(res => {
          if (res && res.code === 200) {
            if (ruleForm.category === 1) {
              onCancel()
            } else {
              onCancel2()
            }
            ElMessage.success('修改成功！');
            getModelData()
          }
          else {
            ElMessage.error(res.message)
          }
        })
      }

    } else {
      return false
    }
  })
}


//赋值方法
const assignProperties = (target: any, source: any) => {
  for (const key in target) {
    if (key in source) {
      target[key] = source[key];
    }
  }
};

const onOpenDialog = () => {
  dialogData.value.title = '添加模型'
  btnFlag.value = true
  dialogData.value.visible = true
}

const onOpenTree = () => {
  orgTreeModel.value.title = '添加模型'
  btnFlag.value = true
  orgTreeModel.value.visible = true
}

const onCancel = () => {
  ruleForm.modelUrl = ''
  ruleForm.image = ''
  ruleForm.id = ''
  imageUrl.value = ''
  upload.value!.clearFiles()
  ruleFormRef.value?.resetFields()
  dialogData.value.visible = false
  formDetail.value = false
}
const onCancel2 = () => {
  ruleForm.image = ''
  ruleForm.id = ''
  imageUrl.value = ''
  orgTreeForm.value?.resetFields()
  orgTreeModel.value.visible = false
  formDetail.value = false
}

//删除
const confirmDelete = async (id: string) => {
  const result = await deleteModelItem({id})
  if (result && result.code === 200) {
    ElMessage.success('删除成功！');
    getModelData()
  }
}

const handleRemove: UploadProps['onRemove'] = (file, uploadFiles) => {
  ruleForm.modelUrl = ''
}

const handleNode = (val: any) => {
  ruleForm.category = 2
  current.value = -1
  ruleForm.orgId = val.orgId
  ruleForm.sId = ''
  getModelData()
}

const onDetail = (item: any, flag: boolean) => {
  if (flag) {
    dialogData.value.title = '查看模型'
    orgTreeModel.value.title = '查看模型'
    btnFlag.value = false
  } else {
    dialogData.value.title = '编辑模型'
    orgTreeModel.value.title = '编辑模型'
    btnFlag.value = true
  }
  formDetail.value = flag
  ruleForm.id = item.id
  if (ruleForm.category === 1) {
    dialogData.value.visible = true
    nextTick(()=>{
      assignProperties(ruleForm, item)
      ruleForm.orgId=''
      imageUrl.value = item.image
      fileList.value = [
        {name: ruleForm.modelUrl || ''}
      ];
    })
  } else {
    orgTreeModel.value.visible = true
    nextTick(()=>{
      assignProperties(ruleForm, item)
      console.log(ruleForm)
      imageUrl.value = item.image
    })

  }
}

</script>

<style lang="scss" scoped>
.treebox {
  border: 1px solid #ADCEE7;

  .treeItem {
    padding: 20px 10px;
    box-sizing: border-box;

    .modelBox {
      margin-bottom: 20px;

      label {
        font-size: 14px;
        color: #cfd3dc;
        cursor: pointer;
      }

      li {
        font-size: 14px;
        color: #cfd3dc;
        cursor: pointer;
        padding: 5px 0;
        padding-left: 20px;
      }

      .active {
        background: #18222c;
      }
    }
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
}

.template-list {
  display: flex;
  flex-wrap: wrap;

  .template-item {
    padding: 10px;
    width: 25%;
    box-sizing: border-box;

    .content {
      width: 100%;
      border: 1px solid #8EA6CD;
      border-radius: 8px;
      aspect-ratio: 16 / 9;
      overflow: hidden;
      position: relative;

      .state {
        position: absolute;
        top: 5px;
        right: 5px;
        font-size: 12px;
        display: flex;
        align-items: center;

        label {
          width: 10px;
          height: 10px;
          display: block;
          align-items: center;
          border-radius: 50%;
        }

        span {
          margin-left: 5px;
        }
      }
    }

    .addcont {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .info {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      padding: 10px 0;
    }
  }
}

.uploader {
  .avatar {
    width: 120px;
    height: 120px;
    display: block;
    object-fit: cover
  }

  .uploader-icon {
    width: 120px;
    height: 120px;
    display: flex;
    border: 1px dashed #FFFFFF;
    border-radius: 2px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    align-items: center;
    justify-content: center;
  }
}


</style>
