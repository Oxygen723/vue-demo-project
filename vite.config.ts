import { defineConfig, loadEnv } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "node:url";
import path, { resolve } from "path";
import UnoCSS from "unocss/vite";
import AutoImport from "unplugin-auto-import/vite";
import { createSvgIconsPlugin } from "vite-plugin-svg-icons";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import vueDevTools from "vite-plugin-vue-devtools";
import { webUpdateNotice } from "@plugin-web-update-notification/vite";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 加载环境变量（包含 .env.[mode] 文件）
  const env = loadEnv(mode, process.cwd(), "");
  return {
    base: `/${env.VITE_SYS_NAME}/`,
    plugins: [
      vue(),
      vueDevTools(),
      UnoCSS(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [path.resolve(process.cwd(), "src/assets/images/icon")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]",
      }),
      webUpdateNotice({
        versionType: "pkg_version",
        hiddenDefaultNotification: true,
      }),
    ],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: "0.0.0.0",
    },
  };
});
