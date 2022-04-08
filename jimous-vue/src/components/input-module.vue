<!--
 * @Author: jimouspeng
 * @Date: 2022-04-08 16:48:00
 * @Description: 上传模块 
 * @FilePath: \vue\jimous-vue\src\components\input-module.vue
-->

<template>
    <div>
        <input type="file" @change="getFile" />
    </div>
</template>
<script>
export default {
    methods: {
        getFile(e) {
            console.log(e.target.files, '打印看看file')
        },
    },
};
</script>
<style lang="scss" scoped></style>
