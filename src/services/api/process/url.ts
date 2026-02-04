/**
 * @description: 评优看板模块接口地址
 */
const apiUrl = {
  getTechnicalDeptParTree: "/process/dept/getTechnicalDeptParTree", // 获取部门分区树
  getTable: "/process/tableInfo/getTable", // 获取表格数据
  addRowHead: "/process/tableInfo/addRowHead", // 新增横表头
  getTableHead: "/process/tableInfo/getTableHead", // 获取表头
  addColHead: "/process/tableInfo/addColHead", // 竖表头的增删改
  importExcel: "/process/tableInfo/importExcel", // 导入excel
  addExcelHead: "/process/tableInfo/addExcelHead", // 新增excel表头--导入excel需用
  copyColHead: "/process/tableInfo/copyColHead", // 复制表头
  addTableData: "/process/tableInfo/addTableData", // 新增修改表格单元格数据
};

export default apiUrl;
