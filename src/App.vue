<template>
  <div id="xxx-project-name" class="w-100% h-100%">
    <RouterView></RouterView>
  </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import autofit from 'autofit.js';


const screenFunction = (dh: number = 932) => {
  nextTick(() => {
    // 监听浏览器窗口尺寸变化
    autofit.init({
      dh: dh,
      dw: 1920,
      el: "html",
      resize: true
    })
  })
}

onMounted(() => {
  screenFunction()
})

</script>


<style scoped type="scss"></style>
