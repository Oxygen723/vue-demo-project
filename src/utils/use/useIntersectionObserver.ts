import { ref, onMounted, onUnmounted, Ref } from "vue";

/**
 * 监听元素是否出现在视口中
 * @param target - 要监听的 DOM 元素（可以是 Ref<HTMLElement | null> 或直接传入 HTMLElement）
 * @param options - IntersectionObserver 配置项（可选）
 * @returns isIntersecting - 是否出现在视口中（响应式 Ref<boolean>）
 */
export function useIntersectionObserver(
  target: Ref<HTMLElement | null> | HTMLElement,
  options: IntersectionObserverInit = {},
) {
  const isIntersecting = ref(false);
  let observer: IntersectionObserver | null = null;

  const observe = () => {
    // 获取实际的 DOM 元素
    const el = "value" in target ? target.value : target;
    if (!el) return;

    // 默认配置：只要部分进入视口就算
    const defaultOptions: IntersectionObserverInit = {
      threshold: 0,
      ...options,
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        isIntersecting.value = entry.isIntersecting;
      });
    }, defaultOptions);

    observer.observe(el);
  };

  const stop = () => {
    if (observer) {
      observer.disconnect();
      observer = null;
    }
  };

  onMounted(() => {
    observe();
  });

  onUnmounted(() => {
    stop();
  });

  return {
    isIntersecting,
    stop, // 可手动停止监听
  };
}
