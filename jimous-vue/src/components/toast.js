/*
 * @Date: 2022-03-04 10:50:23
 * @LastEditors: jimouspeng
 * @Description: Vue.extend(options)
 * @LastEditTime: 2022-03-04 16:21:38
 * @FilePath: \vue\jimous-vue\src\components\toast.js
 */

// 文件头部注释快捷键  ctrl+win+i
// 函数注释注释快捷键  ctrl+win+t

import Vue from 'vue'
import ToastVue from './toast.vue'

const ToastExecute = Vue.extend(ToastVue)

export const toast = (options) => {
    new ToastExecute({
        propsData: {
            desc: options.msg,
        },
    }).$mount(options.id ? `#${options.id}` : '#app')
}
