<template>
  <div class="demo-nav-main w-100% h-100% bg-black">
    <div class="header w-100% h-32px flex items-center">
      <el-button v-if="!edit" type="primary" size="small" @click="edit = true">点击编辑</el-button>
      <el-button v-else size="small" @click="edit = false">退出编辑</el-button>
      <el-button type="warning" size="small" @click="tableLayout = tableLayout == 'horizontal' ? 'vertical' : 'horizontal'">{{
        tableLayout
        }}</el-button>
    </div>
    <div class="table-main w-100% h-[calc(100%-32px)]">
      <Loading v-if="loading"></Loading>
      <EvaluationTable :layout="tableLayout" :col-name="'姓名'" :is-edit="edit" :data="table"
        :cell-edit-setting="cellEditSettingAction" :cell-class-name="cellClassName" :end-edit="endEditAction">
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

const edit = ref(false);

const loading = ref(false);

const table = reactive({
  tableData: [] as any[],
  colHeads: [] as TableItem[],
  rowHeads: [] as TableItem[],
})

const tableLayout = ref<'vertical' | 'horizontal'>('horizontal')

const cellEditSettingAction = ({ rowIndex }: any) => {
  if (rowIndex == 0) return false
  else return true
}

const cellClassName = ({ row, rowIndex, $rowIndex, column, columnIndex, $columnIndex }: any) => {
  let className = ''
  if (rowIndex == 0) className = 'disabled-edit'
  return className
}

const endEditAction = async ({ row, rowIndex, column, columnIndex, resCellData }: any) => {
  console.log(resCellData);

}

// 获取数据(技术流程)
const getTableData = async () => {
  loading.value = true;
  const res = await getTable({ type: 'monthAwardTable', dealDate: '2025-11-01' });
  loading.value = false;
  if (res.code === 200) {
    const data = res.data;
    table.tableData = data.tableData;
    table.colHeads = data.tableRowHeads;
    table.rowHeads = data.tableColHeads;
  }
}

onBeforeMount(() => {
  const authorization = 'NWaWyyZGrcr69asiOG6Zf9YgqJnonlHgWu6rm4lkpRmPdAkgmWFRlvymDYumloK5gGqCUtSHjcjiGcwz97347DsR07Cf91vOKtKOCnwqZrBiPukon48r2Elqgrba9GFM'
  sessionStorage.setItem('authorization', authorization)
})

onMounted(async () => {
  await getTableData();
})

</script>
<style scoped lang="scss"></style>