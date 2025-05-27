<template>
  <div class="loading" ref="loadingDom">
    <div class="loader"></div>
    <div class="content" v-if="context">{{ context }}</div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';

const props = defineProps({
  context: {
    type: String,
    default: '加载中...'
  },
})

const loadingDom: any = ref();
let opacityTimer: any = null;

onMounted(() => {
  // 窗口可见时才显示Loading
  if (document.visibilityState === 'visible') {
    opacityTimer = setTimeout(()=>{
      loadingDom.value.parentElement['style']['position'] = 'relative'
      loadingDom.value['style']['opacity'] = 1;
    },0)
  }
})

onBeforeUnmount(() => {
})

</script>
<style scoped lang="scss">
.loading {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(4px);
  border-radius: 6px;
  z-index: 1000;
  opacity: 0;
  transition: opacity .3s linear;

  .content {
    margin-top: 20px;
    color: var(--theme-color);
    font-size: 14px;
    letter-spacing: 1px;
  }

  /* HTML: <div class="loader"></div> */
  .loader {
    width: 50px;
    aspect-ratio: 1;
    display: grid;
    border: 4px solid #0000;
    border-radius: 50%;
    border-right-color: var(--theme-color);
    animation: l15 1s infinite linear;
  }

  .loader::before,
  .loader::after {
    content: "";
    grid-area: 1/1;
    margin: 2px;
    border: inherit;
    border-radius: 50%;
    animation: l15 2s infinite;
  }

  .loader::after {
    margin: 8px;
    animation-duration: 3s;
  }

  @keyframes l15 {
    100% {
      transform: rotate(1turn)
    }
  }
}
</style>