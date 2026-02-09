<template>
  <div class="demo-nav-main w-100% h-100% bg-black">
    <div class="header w-100% h-32px flex items-center">
      <el-button v-if="!edit" type="primary" size="small" @click="edit = true">点击编辑</el-button>
      <el-button v-else size="small" @click="edit = false">退出编辑</el-button>
      <el-button type="warning" size="small"
        @click="tableLayout = tableLayout == 'horizontal' ? 'vertical' : 'horizontal'">{{
          tableLayout
        }}</el-button>
      <el-button type="info" size="small"
        @click="isFullView ? exitFullScreen() : fullScreenElement('.demo-nav-main')">{{ isFullView ? '退出全屏' : '全屏'
        }}</el-button>
    </div>
    <div class="table-main w-100% h-[calc(100%-32px)]">
      <Loading v-if="loading"></Loading>
      <EvaluationTable ref="EvaluationTableRef" v-model:isEdit="edit" :layout="tableLayout" :col-name="colTitle"
        :data="table" :cell-edit-setting="cellEditSettingAction" :cell-class-name="cellClassName"
        :end-edit="endEditAction" :mergeAddition="mergeAdditionAction">
      </EvaluationTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount, computed } from 'vue';
import EvaluationTable from '@/components/EvaluationTable/index.vue'
import { getTable, TableItem } from '@/services/api/process';
import { CURRENT_DATE, deepCopy } from '@/utils/common';
import dayjs from 'dayjs';
import Loading from '@/components/Loading/index.vue'
import { useFullscreenElement, fullScreenElement, exitFullScreen } from '@/utils/use/useFullscreenElement';
import { getLeafNodes } from '@/components/EvaluationTable/tools';

const { isFullView } = useFullscreenElement()

const edit = ref(false);

const loading = ref(false);

const EvaluationTableRef = ref()

const table = reactive({
  tableData: [] as any[],
  colHeads: [] as TableItem[],
  rowHeads: [] as TableItem[],
})

const tableLayout = ref<'vertical' | 'horizontal'>('vertical')

// 表格动态列配置
const colTitle = computed(() => {
  return tableLayout.value == 'vertical' ? '评判标准' : ['分区', '部门', '姓名']
})

// 单元格编辑配置
const cellEditSettingAction = ({ rowIndex, columnIndex }: any) => {
  if (tableLayout.value == 'horizontal') {
    if (rowIndex <= 1) return false
    else return true
  } else {
    if (columnIndex == 3 || columnIndex == 4) return false
    else return true
  }
}

// 单元格样式配置
const cellClassName = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }: any) => {
  let className = ''
  if (tableLayout.value == 'horizontal') {
    if (rowIndex <= 1) className = 'disabled-edit text-#FF0000'
  } else {
    if ($columnIndex == 3 || $columnIndex == 4) className = 'disabled-edit text-#FF0000'
  }
  return className
}

// 单元格结束编辑事件
const endEditAction = async ({ row, rowIndex, column, columnIndex, resCellData }: any) => {
  console.log(resCellData, row);

}

const dealDate = ref('2025-11-01')

// 合并配置补充
const mergeAdditionAction = ({ column, rowData, columnsLength }: any) => {
  let mergeAddition: any[] = []
  if (tableLayout.value == 'vertical') {
    const _同分对比结果rowIdx = rowData.findIndex((item: any) => item.customField_1 == '同分对比结果' || item.customField_2 == '同分对比结果' || item.customField_3 == '同分对比结果')
    if (_同分对比结果rowIdx != -1) {
      if (dayjs(dealDate.value).format('YYYY-MM') < '2025-11') {
        mergeAddition.push({
          row: _同分对比结果rowIdx,
          col: 5,
          rowspan: 1,
          colspan: EvaluationTableRef.value.columnsFlat.length
        })
      } else {
        columnsLength.forEach((item: any) => {
          mergeAddition.push({
            row: _同分对比结果rowIdx,
            col: 5 + item[0],
            rowspan: 1,
            colspan: item[1]
          })
        })
      }
    }
  }
  return mergeAddition
}

// 获取数据(技术流程)
const getTableData = async () => {
  loading.value = true;
  const res = await getTable({ type: 'monthAwardTable', dealDate: dealDate.value });
  loading.value = false;
  if (res.code === 200) {
    const data = res.data;
    let tableData = deepCopy(data.tableData);
    let colHeads = deepCopy(data.tableColHeads);
    let rowHeads = deepCopy(data.tableRowHeads);

    let flattenCol = getLeafNodes(colHeads)
    let flattenRow = getLeafNodes(rowHeads)

    const _备注ID = Number((Math.random() * 100000).toFixed(0))
    const _满分值 = Number((Math.random() * 100000).toFixed(0))
    if (tableLayout.value == 'vertical') {
      rowHeads.unshift({ id: _备注ID, level: 1, name: '备注', parentId: null })
      rowHeads.unshift({ id: _满分值, level: 1, name: '满分值', parentId: null })
      flattenCol.forEach(i => {
        tableData.push({
          data: i.id,
          horizontalIds: _备注ID,
          sideIds: i.id
        })
        tableData.push({
          data: i.id,
          horizontalIds: _满分值,
          sideIds: i.id
        })
      })
    } else {
      colHeads.unshift({ id: _备注ID, level: 1, name: '备注', parentId: null })
      colHeads.unshift({ id: _满分值, level: 1, name: '满分值', parentId: null })
      flattenRow.forEach(i => {
        tableData.push({
          data: i.id,
          horizontalIds: i.id,
          sideIds: _备注ID
        })
        tableData.push({
          data: i.id,
          horizontalIds: i.id,
          sideIds: _满分值
        })
      })
    }
    table.colHeads = colHeads;
    table.rowHeads = rowHeads;
    table.tableData = tableData;
  }
}

onBeforeMount(() => {
  const authorization = 'Jnj9LjgwhApEGwcmqp3q3UxUsQYGwK64IO8u42LQoUkbz0xeQNiGbwWhxuVJEE0aubWjiw2uisJnOXsoFISzN1QRWZIrZCTN2aR8VfIpvAbAk3lQAeiD6s0azPts4USP'
  sessionStorage.setItem('authorization', authorization)
})

onMounted(async () => {
  await getTableData();
})

</script>
<style scoped lang="scss"></style>