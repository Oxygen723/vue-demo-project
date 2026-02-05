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
| layout              | string       | 'vertical'                                    | 横/竖模式                                                                                                                                  |
| data                | object       | { tableData: [], colHeads: [], rowHeads: [] } | 表格数据                                                                                                                                   |
| colName             | array/string | []                                            | 固定列标题                                                                                                                                 |
| colWidth            | array        | [100, 100]                                    | 固定列宽度                                                                                                                                 |
| endEdit             | function     | () => Promise.resolve()                       | 结束单元格编辑的回调，参数：{ row: any, rowIndex: number, column: ColumnInfo, columnIndex: number, resCellData: resTableDataItem \| null } |
| cellEditSetting     | function     | () => true                                    | 单元格是否能触发编辑，参数：{ row: any, rowIndex: number, column: ColumnInfo, columnIndex: number }                                        |
| cellClassName       | function     | () => ''                                      | 自定义单元格类，参数：{ row: any, rowIndex: number, $rowIndex: number, column: ColumnInfo, columnIndex: number, $columnIndex: number }     |
| headerCellClassName | function     | () => ''                                      | 自定义表头类，参数：{ column: ColumnInfo, columnIndex: number }                                                                            |
| mergeAddition       | function     | () => []                                      | 表格行列合并补充配置，参数：{ rowData: any[], columns: ColumnInfo[] }                                                                      |

### 组件方法

| 方法名      | 参数             | 返回值        | 说明                    |
| ----------- | ---------------- | ------------- | ----------------------- |
| exportExcel | filename: string | Promise<void> | 导出表格数据到Excel文件 |

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
```
