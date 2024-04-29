<template>
  <div class="content">
    <div class="title">
      <span></span>
      <h2>阈值设置</h2>
    </div>
    <el-form ref="formRef" :rules="rules" :model="form" style="max-width: 600px">
      <el-form-item prop="effectiveObject" label="生效对象：" label-width="150px">
        <el-select v-model="form.effectiveObject" placeholder="请选择生效对象" multiple style="width: 100%">
          <el-option :key="item.deviceId" :label="item.name" v-for="item in effectiveObject"
                     :value="item.deviceId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="机械报警半径：" prop="radius" label-width="150px">
        <el-input v-model="form.radius" style="width: 100%" placeholder="请输入机械报警半径">
          <template #append>米</template>
        </el-input>
      </el-form-item>
      <div class="title">
        <span></span>
        <h2>风险处置</h2>
      </div>
      <el-form-item label="通知对象：" prop="notifyObject" label-width="150px">
        <el-select v-model="form.notifyObject" placeholder="请选择通知对象" style="width: 100%">
          <el-option label="人员报警" :value="1"></el-option>
          <el-option label="机械报警" :value="2"></el-option>
          <el-option label="人员与机械报警" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知方式：" prop="notifyType" label-width="150px">
        <el-select v-model="form.notifyType" placeholder="请选择通知方式" style="width: 100%">
          <el-option label="安全帽" :value="1"></el-option>
          <el-option label="短信" :value="2"></el-option>
          <el-option label="短信与安全帽" :value="3"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="通知次数：" prop="notifyTimes" label-width="150px">
        <el-input v-model="form.notifyTimes" placeholder="请输入通知次数" style="width: 100%" clearable>
          <template #append>min/次</template>
        </el-input>

      </el-form-item>
    </el-form>
    <p class="remakes"><em class="fontStyle">*备注说明：</em>针对大型机械，设置报警半径后，当施工人员靠近安全半径时，安全帽会进行语音报警播报</p>
    <div class="btnStyle">
      <el-button type="primary" @click="onSubmit">确定</el-button>
      <el-button @click="onCancel">取消</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from "vue";
import {addRiskConfig, publishInstruction, queryMachineInfo, queryRiskConfig} from "@/api/safety";
import {ElMessage, type FormInstance, type FormRules} from "element-plus";

const form = reactive({
  effectiveObject: [],
  radius: undefined,
  notifyObject: undefined,
  notifyType: undefined,
  notifyTimes: undefined
})

const rules: FormRules = {
  effectiveObject: [
    {required: true, message: '请选择生效对象', trigger: 'change'},
  ],
  radius: [
    {required: true, message: '请输入报警半径', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        if (isNaN(value) || value <= 0) {
          callback(new Error('报警半径必须是大于零的数字'));
        } else {
          callback();
        }
      }, trigger: 'blur'
    },
  ],
  notifyObject: [
    {required: true, message: '请选择通知对象', trigger: 'change'}
  ],
  notifyType: [
    {required: true, message: '请选择通知方式', trigger: 'change'}
  ],
  notifyTimes: [
    {required: true, message: '请输入通知次数', trigger: 'blur'},
    {
      validator: (rule, value, callback) => {
        const reg = /^[1-9]\d*$/;  // 正整数的正则表达式
        if (!reg.test(value)) {
          callback(new Error('只能输入大于零的正整数'));
        } else {
          callback();
        }
      }, trigger: 'blur'
    },
  ],
}

const effectiveObject = ref()
onMounted(() => {
  queryMachineInfo().then((res) => {
    effectiveObject.value = res.result
  })
})


const formRef = ref<FormInstance>()

const onSubmit = async () => {
  await formRef.value?.validate(async (valid) => {
        if (valid) {
          const params = {
            effectiveObject: form.effectiveObject.join(","),
            radius: form.radius,
            notifyObject: form.notifyObject,
            notifyType: form.notifyType,
            notifyTimes: form.notifyTimes
          }
          const res = await addRiskConfig(params)
          if (res && res.code === 200) {
            ElMessage.success('设置成功')
          } else {
            ElMessage.error(res.message)
          }
        }
      }
  )
}

const onCancel = () => {
  const params = {
    effectiveObject: [],
    radius: undefined,
    notifyObject: undefined,
    notifyType: undefined,
    notifyTimes: undefined
  }
  Object.assign(form, params)
}

</script>

<style lang="scss" scoped>
.content {
  padding: 20px 50px;

  .remakes {
    padding: 20px 0;

    .fontStyle {
      color: #ff0000;
    }
  }

  .btnStyle {
    display: flex;
    align-items: center;
    padding: 20px 0px;
    margin: 0 50px;
  }

  .title {
    display: flex;
    align-items: center;
    padding: 20px 0;

    span {
      display: block;
      width: 5px;
      height: 20px;
      background-color: #fff;
      margin-right: 10px;
    }

    h2 {
      font-size: 18px;
      font-weight: bold;
    }
  }
}
</style>
