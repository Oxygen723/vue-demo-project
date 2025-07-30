<template>
  <div class="update-version">
    <span>版本号：{{ version }}</span>
    <img :src="icon1" alt="" style="width: 20px;height: 20px;margin-left: 10px;cursor: pointer;" @click="updateFn">
  </div>

  <div class="update-view" v-show="showUpdateView">
    <div class="updateTitle">
      <img :src="icon2" alt="">
      <span style="margin-left: 8px;">系统更新</span>
    </div>
    <div class="updateContent" style="margin: 5px 0px;flex:1">{{ updateContext }}</div>
    <div class="updateBtn" v-show="updateContext == '系统更新啦! 请刷新页面!'" style="text-align: right;font-size: 12px;">
      <div style="font-size: 13.997px;"><span style="color: #C8C8C8;padding: 0 4.992px;cursor: pointer;"
          @click="showUpdateView = false">忽略</span><span
          style="color:rgba(var(--theme-color),1);padding: 0 4.992px;cursor: pointer;" @click="reloadWeb">刷新</span>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { version } from '../../../package.json'
import axios from 'axios';
import { ElMessage } from 'element-plus'
import VersionIcon from './images/version-icon.svg'
import MessageIcon from './images/update-message-icon.svg'

interface Prop {
  projectName: string // 项目部署的baseURL
  themeColor?: string // 主题色
  icon1?: string // 更新图标
  icon2?: string // tip图标
}
const props = withDefaults(defineProps<Prop>(), {
  projectName: '',
  themeColor: '64, 158, 255',
  icon1: VersionIcon,
  icon2: MessageIcon
})

// 项目名称
const projectName = props.projectName

const showUpdateView: any = ref(false);
const updateContext: any = ref('系统更新啦! 请刷新页面!');

const reloadWeb = () => {
  window.location.reload()
}

// 自动监听系统更新插件事件函数
const listenUpdate = (e: any) => {
  const { version: newVersion, options } = e.detail
  // write some code, show your custom notification and etc.
  // console.log('new version', newVersion);
  updateContext.value = '系统更新啦! 请刷新页面!'
  showUpdateView.value = true
}

// 手动查询是否有新版本
const updateFn = async () => {
  if (!import.meta.env.DEV) {
    const updateViewDom: any = document.querySelector('.update-view')
    if (!updateViewDom) {
      reloadWeb()
    } else {
      let res: any
      try {
        res = await axios({
          method: 'GET', url: `/${projectName}/version.json?t=${new Date().getTime()}`
        })
        const newVersion = res.data.version
        if (newVersion != version) {
          showUpdateView.value = true
          updateContext.value = '系统更新啦! 请刷新页面!'
        } else {
          ElMessage.success('当前为最新版本')
          updateContext.value = '当前为最新版本'
        }
      } catch (err) {
        showUpdateView.value = true
        updateContext.value = '系统更新啦! 请刷新页面!'
      }
    }
  }
}

onMounted(() => {
  document.body.addEventListener('plugin_web_update_notice', listenUpdate)
})

onBeforeUnmount(() => {
  document.body.removeEventListener('plugin_web_update_notice', listenUpdate)
})

</script>
<style scoped lang="scss">
.update-version {
  --theme-color: 0, 0, 0;
  font-family: 'Open Sans-Regular';
  position: fixed;
  min-width: 100px;
  height: 20px;
  left: 20px;
  bottom: 20px;
  color: rgba(var(--theme-color), 1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  z-index: 1000;
  font-size: 14px;
}

.update-view {
  --theme-color: v-bind(themeColor);
  display: flex;
  flex-direction: column;
  position: fixed;
  right: 15px;
  bottom: 5px;
  color: rgba(var(--theme-color), 1);
  padding: 15px;
  width: 279.994px;
  height: 100px;
  font-family: 'Open Sans-Regular';
  background-size: cover;
  font-size: 13.997px;
  background: #FFF;
  border-radius: 10px;
  border: 1px solid rgba(var(--theme-color), 1);
  backdrop-filter: blur(30px);
  box-shadow: 0px 0px 5px 0px rgba(var(--theme-color, .6));
  z-index: 200000;

  .updateTitle {
    font-size: 14px;
    color: #C8C8C8;
    display: flex;
    align-items: center;
  }
}
</style>