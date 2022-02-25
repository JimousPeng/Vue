<!--
 * @Date: 2022-02-11 10:25:59
 * @LastEditors: jimouspeng
 * @Description: 描述文件内容
 * @LastEditTime: 2022-02-25 10:16:10
 * @FilePath: \vue\jimous-vue\src\App.vue
-->
<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" />
        <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
        <show-model />
        <model />
    </div>
</template>

<script>
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
    created() {
        // console.log(this.name, this)
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
