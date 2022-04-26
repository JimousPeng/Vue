/*
 * @Date: 2022-03-04 11:29:17
 * @LastEditors: Please set LastEditors
 * @Description: vue配置文件
 * @LastEditTime: 2022-04-26 10:47:29
 * @FilePath: \vue\jimous-vue\vue.config.js
 */

/**
 * @description:
 * @param {runtimeCompiler}
 * 是否使用包含运行时编译器的 Vue 构建版本。
 * 设置为 true 后你就可以在 Vue 组件中使用 template 选项了，但是这会让你的应用额外增加 10kb 左右
 * 如果不配置，在单文件内使用import Vue from 'vue', 会报错：
 * You are using the runtime-only build of Vue where the template compiler is not available.
 * Either pre-compile the templates into render functions, or use the compiler-included build.
 * (因为vue的package.json的main默认指向的是只运行时的版本--dist/vue.runtime.common.js")
 * 解决办法：
 * 1. 配置runtimeCompiler为true
 * 2. 引用改为vue/dist/vue.esm.js,可配置alias
 * @return {*}
 */

const path = require('path');

module.exports = {
    // runtimeCompiler: true,
    configureWebpack: {
        resolve: {
            alias: {
                // vue$, 正则，内部为正则表达式  vue结尾的
                vue$: 'vue/dist/vue.js',
                '@': path.resolve('./src'),
            },
        },
    },
};
