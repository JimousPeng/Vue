/*
 * @Date: 2022-03-04 10:50:23
 * @LastEditors: jimouspeng
 * @Description: Vue.extend(options)
 * @LastEditTime: 2022-03-04 11:12:05
 * @FilePath: \vue\jimous-vue\src\components\toast.js
 */

// 文件头部注释快捷键  ctrl+win+i
// 函数注释注释快捷键  ctrl+win+t

import Vue from 'vue'

// 创建构造器
const ToastComponent = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
    props: {
        msg: {
            type: String,
            default: 'toast···',
        },
    },
    data: function () {
        return {
            firstName: 'Walter',
            lastName: 'White',
            alias: 'Heisenberg',
        }
    },
})

function toast(msg) {
    let div = document.createElement('div')
    div.setAttribute('id', 'toast')
    document.body.appendChild(div)
    new ToastComponent({
        props: {
            msg: {
                type: String,
                default: msg,
            },
        },
    }).$mount('#toast')
}
