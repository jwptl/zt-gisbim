<!--table组件 tableData:接口请求列表数据 columns：表头定义数据-->
<template>
  <div>
    <el-table :data="tableData" stripe style="width: 100%" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" v-if="selection"/>
      <el-table-column type="index" width="80" label="序号" v-if="isNumber"/>
      <template v-for="(item, index) in columns">
        <el-table-column :row-key="index" v-if="!item.slot && !item.formatter" :prop="item.prop" :label="item.label"
                         :width="item.width || ''" :align="'center'" :show-overflow-tooltip="item.ellipsis || false">
          <template #default="scope">
            <span>{{ scope.row[item.prop] !== null && scope.row[item.prop] !== undefined ? scope.row[item.prop] : "-" }}</span>
          </template>
        </el-table-column>
        <el-table-column :formatter="item?.formatter" :row-key="index" v-if="!item.slot && item.formatter"
                         :prop="item.prop" :label="item.label"
                         :width="item.width || ''" :align="'center'" :show-overflow-tooltip="item.ellipsis || false">
        </el-table-column>
        <el-table-column v-if="item.slot" :row-key="index" :prop="item.prop" :label="item.label"
                         :width="item.width || ''"
                         :align="'center'" :show-overflow-tooltip="item.ellipsis || false">
          <template #default="scope">
            <slot :name="item.slot" :row="scope.row"></slot>
          </template>
        </el-table-column>
      </template>
      <slot></slot>
    </el-table>
    <el-pagination v-if="total" class="pagination" :current-page="current" :page-size="pageSize" :page-sizes="[10, 20, 50, 100]"
                   layout="->,total, sizes, prev, pager, next" :total="total" @size-change="handleSizeChange"
                   @current-change="handleCurrentChange"/>
  </div>
</template>

<script lang="ts" setup>

const emits = defineEmits(["sizeChange", "currentChange", 'selectionChange']);

interface Column {
  label?: string
  prop: string
  slot?: string
  width?: string
  ellipsis?: boolean
  formatter?: Function
}

interface TableProps {
  tableData: Array<object> // table的数据
  columns?: Column[]// 每列的配置项
  total?: number
  current?:number
  pageSize?: number
  selection?: boolean
  isNumber?: boolean
}

const props = withDefaults(defineProps<TableProps>(), {
  tableData:(() => []),
  columns: (() => []),
  total: 0,
  current: 0,
  pageSize: 0,
  selection: false,
  isNumber: true
})

// 页数改变的时候触发的事件
const handleSizeChange = (val: number) => {
  emits("sizeChange", val);
};
// 当前页改变的时候触发的事件
const handleCurrentChange = (val: number) => {
  emits("currentChange", val);
}

const handleSelectionChange = (selection: any) => {
  emits("selectionChange", selection);
}

</script>

<style scoped lang="scss">
:deep(.el-table th.el-table__cell) {
  background: transparent;
}

:deep(.el-table th.el-table__cell.is-leaf) {
  border-bottom: 1px solid rgba(173, 206, 231, .2);
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid rgba(173, 206, 231, .2);
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell) {
  background: rgba(34, 53, 80, 1)
}

:deep(.el-table__inner-wrapper::before) {
  background: rgba(173, 206, 231, .2)
}

:deep(.el-table__body tr:hover>td) {
  background-color: #223550 !important;
}

.pagination {
  margin-top: 50px;
}
</style>
