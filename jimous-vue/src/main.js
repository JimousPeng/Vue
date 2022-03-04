/*
 * @Date: 2022-02-11 10:25:59
 * @LastEditors: jimouspeng
 * @Description: 描述文件内容
 * @LastEditTime: 2022-03-04 14:43:30
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

new Vue({
    render: (h) => h(App),
}).$mount('#app')
