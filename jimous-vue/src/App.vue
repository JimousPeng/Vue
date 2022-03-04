<!--
 * @Date: 2022-02-11 10:25:59
 * @LastEditors: jimouspeng
 * @Description: 描述文件内容
 * @LastEditTime: 2022-03-04 16:20:54
 * @FilePath: \vue\jimous-vue\src\App.vue
-->
<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png" />
        <!-- <HelloWorld msg="Welcome to Your Vue.js App"/> -->
        <show-model />
        <model />
        <div id="toast" @click="eventClick">点我啊</div>
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
    mounted() {
        console.log(this.name, this)
    },
    methods: {
        eventClick() {
            this.$toast({
                msg: '哈哈哈哈',
                id: 'toast',
            })
        },
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
