<!--
 * @Author: jimouspeng
 * @LastEditTime: 2022-04-15 10:53:27
 * @Description: model组件的子组件
 * @FilePath: \vue\jimous-vue\src\components\model-item.vue
 * 可以输入预定的版权声明、个性签名、空行等
-->
<template>
    <div>
        <div>学校： {{ schoolInfo.name }}</div>
        <div>学年： {{ schoolInfo.year }}</div>
        <div>{{ userInfo }}</div>
        <div>{{ otherInfo }}</div>
    </div>
</template>
<script>
export default {
    inject: {
        schoolInfo: {
            from: 'schoolInfo',
        },
        userInfo: {
            from: 'userInfo',
        },
        otherInfo: {
            default: () => {
                return 'otherInfo'
            }
        }
    },
    created() {
        console.log(this.schoolInfo, '看看', this.$options.inject);
    },
};
</script>
<style lang="scss" scoped></style>
