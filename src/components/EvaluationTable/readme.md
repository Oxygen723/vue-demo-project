# 评优表格组件

适用于在线编辑的评优类表格。

## 一、使用

### 安装库

```shell
pnpm add vxe-pc-ui@4.12.31 vxe-table@4.17.48 @vxe-ui/plugin-export-xlsx@4.5.1 exceljs@4.4.0
```

```javascript
// main.js
// ...
import VxeUIAll, { VxeUI } from "vxe-pc-ui";
import "vxe-pc-ui/lib/style.css";
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";
import VxeUIPluginExportXLSX from "@vxe-ui/plugin-export-xlsx";
import ExcelJS from "exceljs";
// ...
const app = createApp(App);
VxeUI.use(VxeUIPluginExportXLSX, {
  ExcelJS,
});
app.use(VxeUITable);
app.use(VxeUIAll);
app.mount("#app");
// ...
```

### 组件属性

| 属性名              | 类型         | 默认值                                        | 说明                                                                                                                                       |
| ------------------- | ------------ | --------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| layout              | string       | 'vertical'                                    | 横/竖模式，可选值：'vertical'、'horizontal'                                                                                                |
| data                | object       | { tableData: [], colHeads: [], rowHeads: [] } | 表格数据                                                                                                                                   |
| colName             | array/string | []                                            | 固定列标题                                                                                                                                 |
| colWidth            | array        | [120, 120, 340]                               | 固定列宽度                                                                                                                                 |
| size                | string       | 'medium'                                      | 表格尺寸，可选值：'mini'、'small'、'medium'、'large'                                                                                       |
| maxMergeLevel       | number       | -                                             | 行最大合并层级                                                                                                                             |
| nodeIdLevel         | number       | -                                             | 行节点ID使用的层级                                                                                                                         |
| endEdit             | function     | () => Promise.resolve()                       | 结束单元格编辑的回调，参数：{ row: any, rowIndex: number, column: ColumnInfo, columnIndex: number, resCellData: resTableDataItem \| null } |
| cellEditSetting     | function     | () => true                                    | 单元格是否能触发编辑，参数：{ row: any, rowIndex: number, column: ColumnInfo, columnIndex: number }                                        |
| cellClassName       | function     | () => ''                                      | 自定义单元格类名，参数：{ row: any, rowIndex: number, $rowIndex: number, column: ColumnInfo, columnIndex: number, $columnIndex: number }   |
| headerCellClassName | function     | () => ''                                      | 自定义表头类名，参数：{ $rowIndex: number, column: ColumnInfo, columnIndex: number, $columnIndex: number }                                 |
| mergeAddition       | function     | () => []                                      | 表格行列合并补充配置，参数：{ rowData: any[], column: ColumnInfo[], columnsLength: number[][] }                                            |

### 组件方法

| 方法名      | 参数             | 返回值        | 说明                    |
| ----------- | ---------------- | ------------- | ----------------------- |
| exportExcel | filename: string | Promise<void> | 导出表格数据到Excel文件 |

### 组件暴露的属性

| 属性名      | 类型            | 说明               |
| ----------- | --------------- | ------------------ |
| gridRef     | VxeGridInstance | VxeGrid实例        |
| columnsFlat | TargetItem[]    | 扁平化的列配置数组 |
| exportExcel | function        | 导出Excel的方法    |

### 组件双向绑定

| 属性名 | 类型    | 默认值 | 说明         |
| ------ | ------- | ------ | ------------ |
| isEdit | boolean | false  | 编辑模式开关 |

### 自定义样式

```scss
--vxe-ui-table-header-background-color // 表头背景色
--vxe-ui-table-header-font-color // 表头字体色
--vxe-ui-table-border-color // 表格边框色
--vxe-ui-layout-background-color // 布局背景色
--vxe-ui-table-row-striped-background-color // 斑马纹背景色
--vxe-ui-table-row-hover-background-color // 鼠标悬停背景色
--vxe-ui-font-color // 表格body字体色
--cell-disabled-edit-bgColor // 禁用编辑单元格背景色
--cell-disabled-edit-borderColor // 禁用编辑单元格边框色
--hover-border-color // 鼠标悬停时的边框色
```

## 二、使用示例

### 基本用法

```vue
<template>
  <EvaluationTable
    v-model:isEdit="edit"
    :layout="tableLayout"
    :col-name="'姓名'"
    :data="table"
    :cell-edit-setting="cellEditSettingAction"
    :cell-class-name="cellClassName"
    :end-edit="endEditAction"
    :merge-addition="mergeAdditionAction" />
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import EvaluationTable from "@/components/EvaluationTable/index.vue";
import { TableItem } from "@/services/api/process";

const edit = ref(false);
const tableLayout = ref<"vertical" | "horizontal">("vertical");

const table = reactive({
  tableData: [] as any[],
  colHeads: [] as TableItem[],
  rowHeads: [] as TableItem[],
});

// 单元格编辑配置
const cellEditSettingAction = ({ rowIndex }: any) => {
  if (rowIndex == 0) return false;
  else return true;
};

// 单元格样式配置
const cellClassName = ({
  row,
  rowIndex,
  $rowIndex,
  column,
  columnIndex,
  $columnIndex,
}: any) => {
  let className = "";
  if (rowIndex == 0) className = "disabled-edit";
  return className;
};

// 单元格结束编辑事件
const endEditAction = async ({
  row,
  rowIndex,
  column,
  columnIndex,
  resCellData,
}: any) => {
  console.log(resCellData, row);
  // 这里可以处理编辑后的逻辑，比如保存数据
};

// 合并配置补充
const mergeAdditionAction = ({ column, rowData, columnsLength }: any) => {
  let mergeAddition: any[] = [];
  // 这里可以添加自定义的合并单元格配置
  return mergeAddition;
};
</script>
```

### 导出Excel

```vue
<template>
  <div>
    <button @click="exportExcel">导出Excel</button>
    <EvaluationTable ref="EvaluationTableRef" :data="table" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import EvaluationTable from "@/components/EvaluationTable/index.vue";

const EvaluationTableRef = ref();
const table = {
  tableData: [],
  colHeads: [],
  rowHeads: [],
};

const exportExcel = async () => {
  if (EvaluationTableRef.value) {
    await EvaluationTableRef.value.exportExcel("评优表格");
  }
};
</script>
```

## 三、注意事项

1. **数据结构要求**：
   - `data.tableData`：表格单元格数据，格式为 `[{ data: string, horizontalIds: string, id: number, sideIds: string, tableInfoId: number }]`
   - `data.colHeads`：竖表头数据，树形结构，格式为 `[{ id: number, level: number, name: string, parentId: number | null, children: [] }]`
   - `data.rowHeads`：横表头数据，树形结构，格式同上
2. **编辑模式**：
   - 使用 `v-model:isEdit` 控制编辑模式的开启和关闭
   - 编辑模式下，双击单元格可进行编辑
3. **单元格合并**：
   - 组件会自动处理行树形结构的单元格合并
   - 可通过 `mergeAddition` 属性添加自定义的行合并配置
