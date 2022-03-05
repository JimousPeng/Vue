<!--
 * @Author: jimouspeng
 * @LastEditTime: 2022-03-05 17:31:13
 * @Description: 
 * @FilePath: \vue\jimous-vue\src\components\model-age.vue
 * 可以输入预定的版权声明、个性签名、空行等
-->
<template>
    <div>
        <span>动态组件model-age： {{ age }}</span>
    </div>
</template>
<script>
export default {
    props: {
        age: {
            type: [String, Number],
            default: '20',
        },
    },
    // 在实例初始化之后,进行数据侦听和事件/侦听器的配置之前同步调用
    beforeCreate() {
        console.log('beforeCreate--------------model-age');
    },
    // 在实例创建完成后被立即同步调用。在这一步中，实例已完成对选项的处理，意味着以下内容已被配置完毕：数据侦听、计算属性、方法、事件/侦听器的回调函数。
    // 然而，挂载阶段还没开始，且 $el property 目前尚不可用
    created() {
        console.log('created----------model-age');
    },
    // 在挂载开始之前被调用：相关的 render 函数首次被调用
    // 该钩子开始以及后续钩子函数在服务器端渲染期间不被调用
    beforeMount() {
        console.log('beforeMount---------------model-age');
    },
    // 实例被挂载后调用，这时 el 被新创建的 vm.$el 替换了。
    // 如果根实例挂载到了一个文档内的元素上，当 mounted 被调用时 vm.$el 也在文档内。
    // 注意 mounted 不会保证所有的子组件也都被挂载完成。如果你希望等到整个视图都渲染完毕再执行某些操作，可以在 mounted 内部使用 vm.$nextTick
    mounted() {
        console.log('mounted----------model-age');
    },
    // 在数据发生改变后，DOM 被更新之前被调用。这里适合在现有 DOM 将要被更新之前访问它，比如移除手动添加的事件监听器
    beforeUpdate() {
        console.log('beforeupdate--------model-age');
    },
    // 在数据更改导致的虚拟 DOM 重新渲染和更新完毕之后被调用。
    // 当这个钩子被调用时，组件 DOM 已经更新，所以你现在可以执行依赖于 DOM 的操作。
    // 然而在大多数情况下，你应该避免在此期间更改状态。如果要相应状态改变，通常最好使用计算属性或 watcher 取而代之。
    // 注意，updated 不会保证所有的子组件也都被重新渲染完毕。如果你希望等到整个视图都渲染完毕，可以在 updated 里使用 vm.$nextTick
    updated() {
        console.log('updated---------model-age');
    },
};
</script>
<style lang="scss" scoped></style>
