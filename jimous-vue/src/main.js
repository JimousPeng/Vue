/*
 * @Date: 2022-02-11 10:25:59
 * @LastEditors: Please set LastEditors
 * @Description: 描述文件内容
 * @LastEditTime: 2022-05-30 11:47:31
 * @FilePath: \vue\jimous-vue\src\main.js
 */
import Vue from 'vue';
/** 将vue-router文件放到本地方便调试 */
// import VueRouter from '@/utils/vue-router.common.js';
import VueRouter from 'vue-router';
import App from './App.vue';
import { toast } from './components/toast.js';
import NameCpment from './components/nameCpment.vue';
import { JimousPlugin } from './plugin.js';

/** 配置路由 */
import { routes } from './route/index.js';

Vue.use(VueRouter);

const router = new VueRouter({
    routes,
    // scrollBehavior() {
    //     // return 期望滚动到哪个的位置
    //     return { x: 0, y: 0 };
    // },
});

console.log('开始应用');

router.beforeEach((to, from, next) => {
    console.log(to, from, '112');
    if (to.meta.requireAuth) {
        router.push({ name: 'error' });
    } else {
        next();
    }
});

// import mixins from './mixins.js'
// Vue.component('nameCpment', Vue.extend(NameCpment))
/** 注册组件，传入一个选项对象 (自动调用 Vue.extend) */
// console.log(NameCpment)
Vue.component('nameCpment', NameCpment);

// console.log(toast)

import ShowModel from 'jimous-vue-components/lib/show-model/index';

Vue.use(ShowModel);

Vue.use(JimousPlugin, { name: 'jimous9090' });

/** 全局注册一个混入，影响注册之后所有创建的每个 Vue 实例。插件作者可以使用混入，向组件注入自定义的行为。不推荐在应用代码中使用 */
// Vue.mixin(mixins)

Vue.config.productionTip = false;

Vue.prototype.$toast = toast;

/** 注册或获取全局指令 */
Vue.directive('focus', {
    // 只调用一次，指令第一次绑定到元素时调用
    bind(el) {
        console.log(el, 'bind指令触发');
    },
    // 被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
    inserted(el) {
        el.focus();
        console.log(el, 'inserted指令触发');
    },
    // 所在组件的 VNode 更新时调用，但是可能发生在其子 VNode 更新之前（指令的值通过比较更新前后的值来忽略不必要的模板更新）
    update(el) {
        console.log(el, 'update');
    },
    // 指令所在组件的 VNode 及其子 VNode 全部更新后调用
    componentUpdated(el) {
        console.log(el, 'componentUpdated');
    },
    // 只调用一次，指令与元素解绑时调用
    unbind() {},
});

/** 注册或获取全局过滤器。 */
Vue.filter('useBig', (val) => {
    return val * 10;
});

new Vue({
    render: (h) => h(App),
    router,
}).$mount('#app');
