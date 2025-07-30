### 一、下载包

```shell
pnpm i @plugin-web-update-notification/vite -D
```

### 二、新建 build.js

#### 1.在 `src` 下新建 `build` 文件夹

#### 2.`build` 下新建 `build.js`

#### 3.`build.js` 代码如下

```javascript
// src/build/build.js

import version from "../../package.json" assert { type: "json" };
console.log("build > 文件开始执行！");

// 运行buld 打包指令后自动生成版本文件夹
import * as fs from "fs";
import path from "path";

function getRootPath(...dir) {
  return path.resolve(process.cwd(), ...dir);
}

const runBuild = async () => {
  try {
    const OUTPUT_DIR = "dist";
    const VERSION = "version.json";
    const versionJson = {
      version: `${version.version}`,
    };
    fs.writeFileSync(
      getRootPath(`${OUTPUT_DIR}/${VERSION}`),
      JSON.stringify(versionJson)
    );
    console.log(`version file is build successfully!`);
  } catch (error) {
    console.error("version build error:\n" + error);
    process.exit(1);
  }
};

runBuild();
console.log("build > 文件执行结束！");
```

### 三、配置项

完成以下配置

#### 1.package.json

```json
// 在各自的打包指令后添加 node ./src/build/build.js
"build": "vue-tsc -b && vite build && node ./src/build/build.js",
"build:not-ts": "vite build && node ./src/build/build.js",
```

#### 2.vite.config.ts

```typescript
import { webUpdateNotice } from "@plugin-web-update-notification/vite";

export default defineConfig({
  ...
  plugins:[
    ...,
    webUpdateNotice({
      versionType: "pkg_version",
      hiddenDefaultNotification: true,
    }),
  ]
})
```

### 四、使用

#### 1.在项目中导入 `<UpdateVersion>` 组件(根据项目需求自行决定放置的位置,一般放置在 App.vue 中)

#### 2.props 参数

```javascript
interface Prop {
  projectName: string // 项目部署的baseURL(如:djct-technical-process-web)
  themeColor?: string // 主题色(rgb值字符串)
}
const props = withDefaults(defineProps<Prop>(), {
  projectName: '',
  themeColor:'64, 158, 255'
})
```

#### 组件的样式,文字等可根据项目需求自行修改
