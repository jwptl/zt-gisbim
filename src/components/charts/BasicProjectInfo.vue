<template>
  <StatisticArea title="项目基本信息">
    <div class="basicInfo">
      <el-tooltip
          effect="dark"
          :content="data?.projectName"
          placement="top-start"
      >
      <div class="title truncate cursor-pointer">{{ data.projectName }}</div>
      </el-tooltip>
      <ul class="infoList">
        <li>
          <img src='@/assets/images/index/manger.png'>
          <span class="middle">项目经理</span>
          <span>{{ data.projectManager }}</span>
        </li>
        <li>
          <img src='@/assets/images/index/state.png'>
          <span class="middle">项目状态</span>
          <span>{{ data.projectStateName }}</span>
        </li>
        <li>
          <img src='@/assets/images/index/org.png'>
          <span class="middle">项目所属部</span>
          <span>{{ data.projectDepartmentName }}</span>
        </li>
        <li>
          <img src='@/assets/images/index/department.png'>
          <span class="middle">所属局/区及单位</span>
          <span>{{ data.bureauOrgName }}</span>
        </li>
        <li>
          <img src='@/assets/images/index/address.png'>
          <span class="middle">片区及地址</span>
          <span>{{ data.belongingToArea }}{{ data.detailedAddress }}</span>
        </li>
      </ul>
    </div>
  </StatisticArea>
</template>

<script setup lang="ts">
import StatisticArea from '@/views/situation/components/StatisticArea.vue'

interface DataInfo {
  data?: {
    projectName: string
    projectManager: string
    projectStateName: string
    projectDepartmentName: string
    bureauOrgName: string
    departmentOrgName: string
    belongingToArea: string
    detailedAddress: string
  }
}

const props = withDefaults(defineProps<DataInfo>(), {
  data: () => ({
    projectName: '国道109新线高速公路工程',
    projectManager: '黄玉站',
    projectStateName: '在建',
    projectDepartmentName: '电务公司',
    bureauOrgName: '中铁六局',
    departmentOrgName: '中铁六局',
    belongingToArea: '京津冀片区',
    detailedAddress: '北京市,市辖区,门头沟区'
  })
})

</script>

<style scoped lang="scss">
.basicInfo {
  .title {
    font-size: 16px;
    color: #FFFFFF;
    text-align: center;
    margin-bottom: 10px;
  }

  .infoList {
    li {
      display: flex;
      align-items: center;
      justify-content: space-between;
      background: rgb(41, 63, 95, .3);
      border-right: 5px;
      padding: 5px 10px;
      margin-bottom: 7px;
      box-sizing: border-box;
      box-shadow: 1px 1px 3px #000;
      font-size: 14px;

      .middle {
        flex: 1;
        margin-left: 15px;
      }
    }
  }
}

</style>
