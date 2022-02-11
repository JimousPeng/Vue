/*
 * @Date: 2022-02-11 10:25:59
 * @LastEditors: jimouspeng
 * @Description: 描述文件内容
 * @LastEditTime: 2022-02-11 10:37:52
 * @FilePath: \vue\jimous-vue\src\main.js
 */
import Vue from 'vue'
import App from './App.vue'

import ShowModel from 'jimous-vue-components/lib/show-model/index';

Vue.use(ShowModel)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
