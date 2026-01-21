import { onBeforeUnmount, onMounted, ref } from "vue";

/**
 * ## 退出全屏模式
 */
export const exitFullScreen = () => {
  const _document = document as any;
  if (_document.exitFullscreen) {
    _document.exitFullscreen();
  } else if (_document.mozCancelFullScreen) {
    /* Firefox */
    _document.mozCancelFullScreen();
  } else if (_document.webkitExitFullscreen) {
    /* Chrome, Safari & Opera */
    _document.webkitExitFullscreen();
  } else if (_document.msExitFullscreen) {
    /* IE/Edge */
    _document.msExitFullscreen();
  }
};

/**
 * ## 判断当前是否处于全屏状态
 * @returns boolean - true表示处于全屏状态，false表示不是全屏状态
 */
export const isFullScreen = (): boolean => {
  const _document = document as any;
  return !!(
    _document.fullscreenElement ||
    _document.mozFullScreenElement ||
    _document.webkitFullscreenElement ||
    _document.msFullscreenElement
  );
};

export const useFullscreenElement = () => {
  const isFullView = ref(false);

  function handleFullscreenChange() {
    if (isFullScreen()) {
      console.log("已进入全屏模式");
      isFullView.value = true;
    } else {
      console.log("已退出全屏模式");
      isFullView.value = false;
    }
  }
  onMounted(() => {
    // 添加事件监听器，注意处理不同浏览器的事件名前缀
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange); // Chrome, Safari, Opera
    document.addEventListener("mozfullscreenchange", handleFullscreenChange); // Firefox
    document.addEventListener("MSFullscreenChange", handleFullscreenChange); // IE/Edge
  });

  onBeforeUnmount(() => {
    // 移除事件监听器
    document.removeEventListener("fullscreenchange", handleFullscreenChange);
    document.removeEventListener(
      "webkitfullscreenchange",
      handleFullscreenChange
    ); // Chrome, Safari, Opera
    document.removeEventListener("mozfullscreenchange", handleFullscreenChange); // Firefox
    document.removeEventListener("MSFullscreenChange", handleFullscreenChange); // IE/Edge
  });

  return { isFullView };
};
