<!--
 * @Author: jimouspeng
 * @Date: 2023-03-21 11:56:41
 * @Description: 
 * @FilePath: \vue\vue-three\src\components\school-info\index.vue
-->
<template>
    <div @click.stop="addCount">jimous12</div>
    <div>{{ count }}, {{ newCount }}</div>
    <div>userinfo: {{ userInfo }}</div>
</template>
<script>
import { ref, h, computed, watch, reactive, watchEffect } from 'vue'
export default {
    props: {
        schoolName: String
    },
    setup(props) {
        const count = ref(new Map());
        const userInfo = reactive('12')
        console.log(userInfo, 'hahah')
        const newCount = computed(() => count.value + 1)

        // 创建可写的计算属性：
        const countPlus = computed({
            get: () => count.value + 1,
            set: (val) => {
                count.value = val - 1
            }
        })
        watch(count, (newVal, oldVal) => {
            console.log(newVal, oldVal, '看看');
            userInfo = 3;
            if(newVal > 3) {
                watchFn()
            }
        })
        const watchFn = watchEffect(() => {
            console.log(count.value, '看看count回调')
        })
        console.log(typeof watchFn, 'watchFn') // function watchFn
        countPlus.value = 0;        
        return {
            count,
            newCount,
            countPlus,
            userInfo
        }
    },
    methods: {
        addCount() {
            this.count++
        }
    }
}
</script>
<style lang='scss' scoped>
</style>