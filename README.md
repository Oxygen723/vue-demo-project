# 前端 vue3 项目模板

## 一、介绍

本项目使用的技术包括但不限于：[vite](https://cn.vitejs.dev/) 、[vue3](https://cn.vuejs.org/) 、[TypeScript](https://www.tslang.cn/index.html) 、[Element Plus](https://element-plus.org/zh-CN/) 、[pinia](http://pinia.cc/)、[unocss](https://unocss.jiangruyi.com/guide/)

GitLab：http://szdjct.com:8000/Luo_JJ/vue-web-project-template

## 二、使用

```sh
// 安装库
$ pnpm install

// 开发运行
$ pnpm run dev

// 打包
$ pnpm run build:test  // 测试
$ pnpm run build:prod  // 生产
（更多打包指令请看package.json文件）
```

## 三、目录结构

```bash
├─assets // 静态资源文件
│  ├─font // 字体文件
│  ├─images // 图片文件
├─components // 公共组件
├─style // 样式文件
│  ├─common // 公共样式
│  ├─element // 组件库样式
│  ├─font-family // 字体
│  ├─theme // 项目主题样式
├─router // 路由
├─utils // 工具函数
├─pinia // pinia配置
├─services // 网络请求配置
├─layout // 布局组件
└─views // 视图
```

## Git 贡献提交规范

\- 参考 [vue](https://github.com/vuejs/vue/blob/dev/.github/COMMIT_CONVENTION.md) 规范 ([Angular](https://github.com/conventional-changelog/conventional-changelog/tree/master/packages/conventional-changelog-angular))

\- `feat` 增加新功能

\- `fix` 修复问题/BUG

\- `style` 代码风格相关无影响运行结果的

\- `perf` 优化/性能提升

\- `refactor` 重构

\- `revert` 撤销修改

\- `test` 测试相关

\- `docs` 文档/注释

\- `chore` 杂活/依赖更新/脚手架配置修改等

\- `workflow` 工作流改进

\- `ci` 持续集成

\- `types` 类型定义文件更改

\- `wip` 开发中

- 示例： git commit -m "feat: 'new feature'"
