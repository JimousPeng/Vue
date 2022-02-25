<!--
 * @Date: 2022-02-25 10:15:15
 * @LastEditors: jimouspeng
 * @Description: 描述文件内容
 * @LastEditTime: 2022-02-25 10:18:46
 * @FilePath: \vue\jimous-vue\src\components\model.vue
-->
<template>
    <div>{{ name }}</div>
</template>
<script>
export default {
    props: {
        name: {
            type: String,
            default: 'jimous',
        },
    },
    data() {
        return {
            hh: 1212,
        }
    },
    created() {
        console.log(this)
    },
}
</script>
<style lang="scss" scoped></style>
