<!--
 * @Date: 2022-02-11 10:25:59
 * @LastEditors: Please set LastEditors
 * @Description: 描述文件内容
 * @LastEditTime: 2022-05-11 17:17:15
 * @FilePath: \vue\jimous-vue\src\App.vue
-->
<template>
    <div id="app">
        <router-view />
    </div>
</template>
<script>
export default {
    name: 'app',
    beforeCreate() {
        console.log('beforeCreated------------');
    },
    mounted() {
        console.log('jimous is cool--------------')
    }
};
</script>
<style lang="scss" scoped></style>
