<!--
 * @Author: jimouspeng
 * @Date: 2022-04-26 10:34:13
 * @Description: 
 * @FilePath: \vue\jimous-vue\src\pages\poster\index.vue
-->

<template>
    <div>
        <show-poster :level="1">这里是h5</show-poster>
        <slot />
        jimous：{{ id }}<br />
        <img v-if="imgUrl" class="poster-img" :src="imgUrl" @error="imgLoadError" alt="" />
    </div>
</template>
<script>
import { loaderPoster } from '@/apis/index.js';
import ShowPoster from './components/show-poster/index.vue';
export default {
    components: {
        ShowPoster,
    },
    props: {
        id: {
            type: [String, Number],
            default: '',
        },
    },
    data() {
        return {
            imgUrl: '',
        };
    },
    watch: {
        '$route.params.id': {
            handler(val) {
                console.log(val, '监听￥router');
            },
            immediate: true,
        },
    },
    async created() {
        console.log('poster-id', this.id, this.$route);
        const imgData = await loaderPoster().catch((err) => {
            console.log(err);
        });
        if (!imgData) {
            return;
        }
        console.log('初始化', imgData);
        /**
         * 这里比较有意思，webpack底层对buffer.from的调用进行了 new Uint8Array的默认创建
         * 所以下面的代码 Buffer.from 等同于执行 new Uint8Array
         */
        const bufData = Buffer.from(imgData.buf);
        // const bufData = new Uint8Array(imgData.buf.data);
        // console.log(Buffer.alloc(0), ArrayBuffer.isView(bufData)); // true
        this.imgUrl = URL.createObjectURL(new Blob([bufData]));
        console.log(this.imgUrl);
    },
    methods: {
        imgLoadError(e) {
            console.log(e);
        },
    },
};
</script>
<style lang="scss" scoped>
.poster-img {
    width: 300px;
    height: 300px;
}
</style>
