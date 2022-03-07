<!--
 * @Date: 2022-02-25 10:15:15
 * @LastEditors: jimouspeng
 * @Description: 描述文件内容
 * @LastEditTime: 2022-03-07 15:48:01
 * @FilePath: \vue\jimous-vue\src\components\model.vue
-->
<template>
    <div>
        <div @click="clickName">可点击aname: {{ name }}</div>
        <div>age: {{ age }}</div>
        <!-- v-pre 跳过这个元素和它的子元素的编译过程。可以用来显示原始 Mustache 标签。跳过大量没有指令的节点会加快编译 -->
        <span v-pre>这里不编译{{ age }}</span>
        <span>{{ hh | useBig }}</span>
        <p>{{ userInfo[0].name || 'coco' }}</p>
        <p v-focus>{{ userInfo[0].country }}</p>
        <input type="text" v-focus />
        <!-- <p>{{ userInfo.country || 'china' }}</p> -->
        <!-- <p>{{ country }}</p> -->
        <button @click="eventClick">点击</button>
        <model-item />
        <!-- <keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们 -->
        <!-- 当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行 -->
        <!-- 在 2.2.0 及其更高版本中，activated 和 deactivated 将会在 <keep-alive> 树内的所有嵌套组件中触发 -->
        <!-- 主要用于保留组件状态或避免重新渲染 -->
        <keep-alive>
            <!-- 动态组件 -->
            <component :is="showCurrentView.view" v-bind="showCurrentView.props">这是div</component>
        </keep-alive>
    </div>
</template>
<script>
import Vue from 'vue'
import ModelItem from './model-item.vue'
import ModelName from './model-name.vue'
import ModelAge from './model-age.vue'
export default {
    components: {
        ModelItem,
    },
    computed: {
        showCurrentView() {
            return this.viewList[this.idx]
        },
    },
    // props 可以是数组或对象，用于接收来自父组件的数据。
    // props 可以是简单的数组，或者使用对象作为替代，
    // 对象允许配置高级选项，如类型检测、自定义验证和设置默认值
    // props: ['name'],
    props: {
        // type: 可以是下列原生构造函数中的一种：String、Number、Boolean、Array、Object、Date、Function、Symbol、任何自定义构造函数、
        // 或上述内容组成的数组。会检查一个 prop 是否是给定的类型，否则抛出警告
        name: {
            type: String,
            default: 'jimous',
        },
        age: {
            type: [Number, String],
            required: true,
            validator: (val) => {
                console.log(val, '看看')
                return val > 25
            },
        },
    },
    /** 注册组件内局部指令 */
    directives: {
        focus: {
            inserted(el) {
                el.focus()
                // console.log('触发')
            },
        },
    },
    /** 注册组件内局部过滤器 */
    filters: {
        useBig(val) {
            return val * 1000
        },
    },
    watch: {
        // 注意，不应该使用箭头函数来定义 watcher 函数 (例如 searchQuery: newValue => this.updateAutocomplete(newValue))。
        // 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.updateAutocomplete 将是 undefined
        hh: function (val) {
            console.log(val, 'hh更改', this.userInfo)
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
            idx: 0,
            viewList: [
                {
                    name: '名称',
                    view: ModelName,
                    props: {
                        userName: 'jimous9999',
                    },
                },
                {
                    name: '年份',
                    view: ModelAge,
                    props: {
                        age: 9999,
                    },
                },
            ],
        }
    },
    beforeCreate() {
        console.log('beforeCreate--------------model')
    },
    created() {
        // console.log(this)
        // console.log(Vue.version);
        console.log('created----------model')
        this.$watch('hh', (val, oldval) => {
            console.log(val, oldval, '监听hh的变化')
        })
        this.$watch('userInfo', (val) => {
            console.log(val, '监听userInfo的变化')
        })
    },
    beforeMount() {
        console.log('beforeMount---------------model')
    },
    mounted() {
        console.log('mounted----------model')
        // console.log(this.name, this)
        // this.userInfo.country = '中国'
        // this.country = '中国'
        this.userInfo[0] = { name: 'jimous01', country: '中国' } // 数据更新，视图不更新
        setTimeout(() => {
            this.hh = 666
            this.$nextTick(() => {
                // console.log('DOM更新', this.userInfo)
            })
            this.$on('jimous-events', 9999)
            console.log(this._events)
            setTimeout(() => {
                console.log('开始销毁', this._events)
                /** $destroy: 完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器, 包括Watcher对象从其所在Dep中释放
                 * 在大多数场景中你不应该调用这个方法。最好使用 v-if 和 v-for 指令以数据驱动的方式控制子组件的生命周期
                 * 它并不是用来清除已有页面上的DOM的
                 */
                this.$destroy()
                console.log('销毁后', this)
            }, 4000)
        }, 1500)
        // console.log(this.$parent, '打印父组件')
        console.log(this.$options.inject, 'mode-----options') // undefined , 因为这个组件没有配置inject
    },
    beforeUpdate() {
        console.log('beforeupdate--------model')
    },
    updated() {
        console.log('updated---------model')
    },
    methods: {
        // 注意，不应该使用箭头函数来定义 method 函数 (例如 plus: () => this.a++)。
        // 理由是箭头函数绑定了父级作用域的上下文，所以 this 将不会按照期望指向 Vue 实例，this.a 将是 undefine
        // clickName: () => {
        //     console.log('点击name', this); // this undefined
        // },
        /** 点击name区域 */
        clickName() {
            this.idx = 0
            this.viewList[0].props.userName = 'jimous#1'
            /** $options: vue原型上的方法，包括parent、propsData,_propKeys之类的 */
            // console.log(this.$options, '$options console------------')
            /** _renderProxy： 对this数据的代理 */
            // console.log(this._renderProxy, '_renderProxy console------------')
            // console.log(this._self === this, '_self console------------') // true
            /** $data:  */
            // console.log(this, this.$data, this.$props, this._props, '$data $props console-----------')
            // console.log(this._uid, 'uid-----')
            console.log(this.$props === this._props) // true
        },
        /** 点击点击按钮 */
        eventClick() {
            this.idx = 1
            this.viewList[1].props.age = '88888888'
            this.country = '中国'
            this.userInfo[0] = { name: 'jimous02', country: '中国No1' } // 数据更新，视图不更新
            Vue.set(this.userInfo, 0, { name: 'jimous02', country: '中国' }) // 数据更新，视图更新
            this.$set(this.userInfo, 0, { name: 'jimous03', country: '中国' }) // 数据更新，视图更新
            console.log(this.country, this)
            this.writeDom()
            console.log(this.$el, '打印看看$el', this)
            this.$on('jimous-emit', () => {
                console.log('hhhhh')
            })
            this.$on(['jimous-emit'], 666)
            console.log(this._events, '_events-------')
        },
    },
}
</script>
<style lang="scss" scoped></style>
