import { createApp } from "vue";
import "virtual:uno.css";
import "normalize.css";
import ElementPlus from "element-plus";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
import "element-plus/dist/index.css";
import "virtual:svg-icons-register";

import "./style/index.scss";
import App from "./App.vue";

import router from "./router";
import pinia from "./pinia";
import VxeUIAll, { VxeUI } from "vxe-pc-ui";
import "vxe-pc-ui/lib/style.css";
import VxeUITable from "vxe-table";
import "vxe-table/lib/style.css";
import VxeUIPluginExportXLSX from "@vxe-ui/plugin-export-xlsx";
import ExcelJS from "exceljs";

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
});
VxeUI.use(VxeUIPluginExportXLSX, {
  ExcelJS,
});
app.use(VxeUITable);
app.use(VxeUIAll);
app.use(pinia);
app.use(router);

app.mount("#app");
