<template>
  <div :id="projectName" class="w-100% h-100%">
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import autofit from 'autofit.js';
import timer from "@/utils/PollingMachine";
import { ElMessage } from "element-plus";
import { getQueryString } from './utils/common';
import { useUserStore } from "./pinia/modules/user";
import { setAuthState, getToken } from '@djct/aio-sdk'
import router from './router';

// 项目名称
const projectName = import.meta.env.VITE_SYS_NAME

// 屏幕自适应
const screenFunction = (dh: number = 932) => {
  const html: HTMLElement = document.querySelector('html') as HTMLElement;
  nextTick(() => {
    // 监听浏览器窗口尺寸变化
    autofit.init({
      dh: html.clientHeight,
      dw: html.clientWidth,
      el: "html",
      resize: true
    })
  })
}

const { loginCheck, clearState } = useUserStore();

onMounted(async () => {
  screenFunction()
  timer.setTimer();
  // 兼容集成系统免登录
  const paramsObj = getQueryString(["userId", "authorization", "to"]);
  const { userId = "", authorization = "", to = "" }: any = paramsObj;
  try {
    const token = await getToken()
    await loginCheck({ authorization: token, userId: '' });
    setAuthState(true)
    const path = "/" + to.replace(/ /g, "/");
    await router.push(to ? path : "/nav");
    return
  } catch (error) {
    console.log(error);
  }

  if (userId && authorization) {
    try {
      await loginCheck({ authorization, userId });
      setAuthState(true)
      const path = "/" + to.replace(/ /g, "/");
      await router.push(to ? path : "/nav");
    } catch (error: any) {
      setAuthState(false)
      ElMessage.warning({
        message: error,
        showClose: true,
      });
      clearState();
      router.push("/login");
      return;
    }
  } else {
    // 如果没上面的俩参数 就判断本地是否有userId和token 只要一个没有就跳转登录 , 否则跳转走路由重定向首页
    const storedAuthorization = localStorage.getItem("token");
    const storedUserId = localStorage.getItem("userId");

    // 如果没有本地的userId和token 就跳转登录
    if (!(storedAuthorization && storedUserId)) {
      router.push("/login");
      // 如果这两个都有就调用check token 函数判断是否token是否过期
    } else {
      try {
        await loginCheck({
          authorization: storedAuthorization,
          userId: storedUserId,
        });
        setAuthState(true)
      } catch (error: any) {
        setAuthState(false)
        ElMessage.warning({
          message: error,
          showClose: true,
        });
        clearState();
        router.push("/login");
      }
    }
  }
})

</script>


<style scoped type="scss"></style>
