<!--
 * @Author: jimouspeng
 * @Date: 2022-10-26 16:57:18
 * @Description: 卡片列表页面
 * @FilePath: \vue\jimous-vue\src\pages\card\components\card-list.vue
-->
<template>
    <div class="card-scroll-wrapper" :style="wrapperStyle">
        <div
            v-if="cardList.length"
            class="card-list"
            @touchstart="touchStart($event)"
            @touchmove="touchMove($event)"
            @touchend="touchEnd($event)"
        >
            <div
                v-for="(item, index) in cardList"
                :class="['card-item', { 'transition-item': !moveX }]"
                :style="[
                    {
                        'background-image': `url(${item})`,
                        transform: `translate(${handleTransX(index)}, -50%)`,
                    },
                    cardStyle,
                ]"
                :key="index"
            >
                <slot name="cardContent" />
            </div>
        </div>
    </div>
</template>
<script>
const rootFont = (function () {
    try {
        const sizeNum = getComputedStyle(document.documentElement)['font-size'];
        return parseInt(sizeNum);
    } catch (err) {
        console.log(err);
        return 50;
    }
})();
export default {
    name: 'cardList',
    props: {
        cardList: {
            type: Array,
            default: () => [],
        },
        /** 容器style */
        wrapperStyle: {
            type: Object,
            default: () => {},
        },
        /** 卡片style */
        cardStyle: {
            type: Object,
            default: () => {},
        },
        /** 初始化卡片位置 */
        initId: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            touchIdx: 0,
            moveX: 0, // 滑动距离
            positionX: 0, // 记录初始坐标
        };
    },
    watch: {
        initId(val) {
            this.touchIdx = val;
        },
    },
    created() {
        console.log(this.cardStyle, '---------', this.wrapperStyle);
    },
    methods: {
        handleTransX(idx) {
            return (6.22 + 0.32) * rootFont * (idx - this.touchIdx) + this.moveX + 'px';
        },
        touchStart($event) {
            this.positionX = parseInt($event.touches[0].clientX);
        },
        touchMove($event) {
            const curX = $event.touches[0].clientX;
            this.moveX = curX - this.positionX;
        },
        touchEnd() {
            if (Math.abs(this.moveX) > 40) {
                // 有效移动距离+边界判断
                if (this.moveX > 0 && this.touchIdx - 1 >= 0) {
                    this.touchIdx = this.touchIdx - 1;
                }
                if (this.moveX < 0 && this.touchIdx + 1 <= this.cardList.length - 1) {
                    this.touchIdx = this.touchIdx + 1;
                }
            }
            this.moveX = 0;
        },
    },
};
</script>
<style lang="scss" scoped>
.card-scroll-wrapper {
    height: 3.62rem;
    display: flex;
    flex-direction: column;
    padding-left: 0.6rem;
    overflow: hidden;
    background: gray;
    &::-webkit-scrollbar {
        display: none;
    }
    .card-list {
        flex: 1;
        box-sizing: border-box;
        display: flex;
        position: relative;
        .card-item {
            display: inline-block;
            flex-shrink: 0;
            width: 6.22rem;
            height: 2.82rem;
            border-radius: 0.24rem;
            margin-right: 0.32rem;
            background-size: cover;
            position: absolute;
            top: 50%;
            left: 0;
            transform: translateX(0);
            &.transition-item {
                transition: transform 0.15s ease-in 0s;
            }
            &:last-child {
                margin-right: 0;
            }
        }
    }
}
</style>
