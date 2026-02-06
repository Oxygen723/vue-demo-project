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
      <EvaluationTable ref="EvaluationTableRef" v-model:isEdit="edit" :layout="tableLayout" :col-name="'姓名'"
        :data="table" :cell-edit-setting="cellEditSettingAction" :cell-class-name="cellClassName"
        :end-edit="endEditAction" :mergeAddition="mergeAdditionAction">
      </EvaluationTable>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeMount } from 'vue';
import EvaluationTable from '@/components/EvaluationTable/index.vue'
import { getTable, TableItem } from '@/services/api/process';
import { CURRENT_DATE } from '@/utils/common';
import dayjs from 'dayjs';
import Loading from '@/components/Loading/index.vue'
import { useFullscreenElement, fullScreenElement, exitFullScreen } from '@/utils/use/useFullscreenElement';

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

const fullAction = () => {
  if (EvaluationTableRef.value) {
    EvaluationTableRef.value.gridRef.zoom()
  }
}

// 单元格编辑配置
const cellEditSettingAction = ({ rowIndex }: any) => {
  if (rowIndex == 0) return false
  else return true
}

// 单元格样式配置
const cellClassName = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }: any) => {
  let className = ''
  if (rowIndex == 0) className = 'disabled-edit'
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
          col: 3,
          rowspan: 1,
          colspan: EvaluationTableRef.value.columnsFlat.length
        })
      } else {
        columnsLength.forEach((item: any) => {
          mergeAddition.push({
            row: _同分对比结果rowIdx,
            col: 3 + item[0],
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
    table.tableData = data.tableData;
    table.colHeads = data.tableRowHeads;
    table.rowHeads = data.tableColHeads;
  }
}

onBeforeMount(() => {
  const authorization = 'tG7Y8yyAJAQCcl8zpCXCrVveko5hbJP8SbT4UaVaAwQePoWBJft4fUjPgAwKHhQ3b2dnfj6tAj5gFD6OVLIy1IFIHpONeNKW5OptmxZ3vV469JTuvORz2U6mhC0iViGQ'
  sessionStorage.setItem('authorization', authorization)
})

onMounted(async () => {
  await getTableData();
})

</script>
<style scoped lang="scss"></style>