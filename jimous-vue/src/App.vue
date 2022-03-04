<!--
 * @Date: 2022-02-11 10:25:59
 * @LastEditors: jimouspeng
 * @Description: 描述文件内容
 * @LastEditTime: 2022-03-04 14:23:22
 * @FilePath: \vue\jimous-vue\src\App.vue
-->
<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" />
        <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
        <show-model />
        <model />
        <div id="toast"></div>
    </div>
</template>

<script>
// 直接引用完整版本的vue.js
// import Vue from 'vue/dist/vue.js'
import Vue from 'vue'
// 创建构造器
var Profile = Vue.extend({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
    data() {
        return {
            firstName: 'Walter',
            lastName: 'White',
            alias: 'Heisenberg',
        }
    },
})
// import HelloWorld from './components/HelloWorld.vue'
import Model from './components/model.vue'
export default {
    name: 'App',
    components: {
        Model,
        // HelloWorld
    },
    data() {
        return {
            name: 'jimous',
        }
    },
    mounted() {
        // console.log(this.name, this)
        // 创建 Profile 实例，并挂载到一个元素上。
        new Profile().$mount('#app')
    },
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
