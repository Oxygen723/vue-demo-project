import { createApp } from 'vue'
import 'virtual:uno.css'
import 'normalize.css'
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'element-plus/dist/index.css';

import './style/index.scss'
import App from './App.vue'

import router from './router';
import pinia from './pinia';

const app = createApp(App);
app.use(ElementPlus, {
  locale: zhCn,
})
app.use(pinia);
app.use(router);

app.mount('#app')
