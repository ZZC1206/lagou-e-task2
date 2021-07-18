# 一、简答题

#### 1、Webpack 的构建流程主要有哪些环节？如果可以请尽可能详尽的描述 Webpack 打包的整个过程。

1. 创建 complier 实例，用于控制构建流程，complier 实例包含了 webpack 基本环境信息
2. 根据配置项转换成对应的内部插件，并初始化 options 配置项
3. 执行 compiler.run
4. 创建 complitation 实例，每次构建都会创建一个 compilation 实例，包含了这次构建的基本信息；
5. 从 entery 开始递归分析依赖，对每个模块进行 buildmodule，通过 loader 将不同的类型的模块转化成 webpack 模块
6. 调用 parser.parse 将上面的结构转化成 AST 树，
7. 遍历整个 AST 树，搜集依赖 dependency，并保存在 compilation 的实例中
8. 生成 chunks,不同的 entry,生成不同的 chunks，动态导入也会生成自己的 chunks,待到生成 chunks 后再继续优化
9. 使用 template 基于 compilation 的数据生成结果代码

#### 2、Loader 和 Plugin 有哪些不同？请描述一下开发 Loader 和 Plugin 的思路。

**Loader(加载器)**，主要是用来解析和检测对应资源，负责源文件从输入到输出的转换，它专注于实现资源模块加载

**开发思路**

1. 通过 module.exports 导出一个函数

2. 该函数默认参数一个参数 source(即要处理的资源文件)

3. 在函数体中处理资源(loader 里配置响应的 loader 后)

4. 通过 return 返回最终打包后的结果(这里返回的结果需为字符串形式)



**Plugin(插件)**，主要是通过 webpack 内部的钩子机制，在 webpack 构建的不同阶段执行一些额外的工作，它的插件是一个函数或者是一个包含 apply 方法的对象，接受一个 compile 对象，通过 webpack 的钩子来处理资源

**开发思路**

1. 通过钩子机制实现

2. 插件必须是一个函数或包含 apply 方法的对象

3. 在方法体内通过 webpack 提供的 API 获取资源做响应处理

4. 将处理完的资源通过 webpack 提供的方法返回该资源

   

# 二、编程题

#### 1、使用 Webpack 实现 Vue 项目打包任务

具体任务及说明：

1. 在 code/vue-app-base 中安装、创建、编辑相关文件，进而完成作业。
2. 这是一个使用 Vue CLI 创建出来的 Vue 项目基础结构
3. 有所不同的是这里我移除掉了 vue-cli-service（包含 webpack 等工具的黑盒工具）
4. 这里的要求就是直接使用 webpack 以及你所了解的周边工具、Loader、Plugin 还原这个项目的打包任务
5. 尽可能的使用上所有你了解到的功能和特性

**提示：(开始前必看)**

在视频录制后，webpack 版本以迅雷不及掩耳的速度升级到 5，相应 webpack-cli、webpack-dev-server 都有改变。

项目中使用服务器的配置应该是改为下面这样：

```json
// package.json 中部分代码
"scripts": {
	"serve": "webpack serve --config webpack.config.js"
}
```

vue 文件中 使用 style-loader 即可

**其它问题, 可先到 https://www.npmjs.com/ 上搜索查看相应包的最新版本的配置示例, 可以解决大部分问题.**

#### 作业要求

本次作业中的编程题要求大家完成相应代码后

-   提交一个项目说明文档，要求思路流程清晰。
-   或者简单录制一个小视频介绍一下实现思路，并演示一下相关功能。
-   最终将录制的视频或说明文档和代码统一提交至作业仓库。

