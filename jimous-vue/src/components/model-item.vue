<!--
 * @Author: jimouspeng
 * @LastEditTime: 2022-03-07 15:33:39
 * @Description: model组件的子组件
 * @FilePath: \vue\jimous-vue\src\components\model-item.vue
 * 可以输入预定的版权声明、个性签名、空行等
-->
<template>
    <div>
        <div>学校： {{ schoolInfo.name }}</div>
        <div>学年： {{ schoolInfo.year }}</div>
    </div>
</template>
<script>
export default {
    inject: ['schoolInfo'],
    created() {
        console.log(this.schoolInfo, '看看', this.$options.inject)
    },
}
</script>
<style lang="scss" scoped></style>
