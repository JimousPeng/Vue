<!--
 * @Author: jimouspeng
 * @Date: 2023-03-15 19:29:52
 * @Description: 
 * @FilePath: \vue\vue-three\src\views\AboutView.vue
-->
<!--
 * @Author: jimouspeng
 * @Date: 2023-03-15 19:29:52
 * @Description: 
 * @FilePath: \vue\vue-three\src\views\AboutView.vue
-->
<template>
    <div class="about">
        <CustomHeader />
        <h1>This is an about page</h1>
        <school-info :school-name="'ncu'" />
    </div>
</template>

<script lang="tsx">
import {defineComponent} from 'vue'
const CustomHeader = defineComponent({
    template: '<p>{{firstName}} {{lastName}} aka {{alias}}</p>',
    setup() {
        console.info(111111)
        return {
            name: 'jmous'
        }
    },
    render() {
        return <div>你好{this.name}12</div>
    }
})
import SchoolInfo from '../components/school-info/index.vue';

export default {
    components: {
        SchoolInfo,
        CustomHeader
    },
    data() {
        return {
            name: 'jimous'
        }
    },
    onMounted() {
        console.log('计数器的初始值：', this.name)
    },
    methods: {
    },
}
</script>

<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
