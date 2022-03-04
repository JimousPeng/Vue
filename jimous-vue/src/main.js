/*
 * @Date: 2022-02-11 10:25:59
 * @LastEditors: jimouspeng
 * @Description: 描述文件内容
 * @LastEditTime: 2022-03-04 17:44:09
 * @FilePath: \vue\jimous-vue\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'
import { toast } from './components/toast.js'

console.log(toast)

import ShowModel from 'jimous-vue-components/lib/show-model/index'

Vue.use(ShowModel)

Vue.config.productionTip = false

Vue.prototype.$toast = toast

Vue.directive('focus', {
    // 只调用一次，指令第一次绑定到元素时调用
    bind(el) {
        console.log(el, 'bind指令触发')
    },
    // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
    inserted(el) {
        el.focus()
        console.log(el, 'inserted指令触发')
    },
    // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前（指令的值通过比较更新前后的值来忽略不必要的模板更新）
    update(el) {
        console.log(el, 'update')
    },
    // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
    componentUpdated(el) {
        console.log(el, 'componentUpdated')
    },
    // 只调用一次，指令与元素解绑时调用
    unbind() {},
})

new Vue({
    render: (h) => h(App),
}).$mount('#app')
