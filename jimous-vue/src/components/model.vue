<!--
 * @Date: 2022-02-25 10:15:15
 * @LastEditors: jimouspeng
 * @Description: 描述文件内容
 * @LastEditTime: 2022-03-04 17:41:59
 * @FilePath: \vue\jimous-vue\src\components\model.vue
-->
<template>
    <div>
        <!-- {{ name }} -->
        <!-- <span>{{ hh }}</span> -->
        <p>{{ userInfo[0].name || 'coco' }}</p>
        <p v-focus>{{ userInfo[0].country }}</p>
        <input type="text" v-focus />
        <!-- <p>{{ userInfo.country || 'china' }}</p> -->
        <!-- <p>{{ country }}</p> -->
        <button @click="eventClick">点击</button>
    </div>
</template>
<script>
import Vue from 'vue'
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
            userInfo: [
                {
                    name: 'jimous',
                    country: 'china',
                },
            ],
        }
    },
    created() {
        console.log(this)
    },
    mounted() {
        // this.userInfo.country = '中国'
        // this.country = '中国'
        this.userInfo[0] = { name: 'jimous01', country: '中国' } // 数据更新，视图不更新
        setTimeout(() => {
            this.hh = 'jimous cool'
            this.$nextTick(() => {
                console.log('DOM更新', this.userInfo)
            })
        }, 1000)
    },
    methods: {
        eventClick() {
            this.country = '中国'
            this.userInfo[0] = { name: 'jimous02', country: '中国' } // 数据更新，视图不更新
            Vue.set(this.userInfo, 0, { name: 'jimous02', country: '中国' }) // 数据更新，视图更新
            this.$set(this.userInfo, 0, { name: 'jimous03', country: '中国' }) // 数据更新，视图更新
            console.log(this.country, this)
        },
    },
}
</script>
<style lang="scss" scoped></style>
