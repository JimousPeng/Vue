<!--
 * @Author: jimouspeng
 * @Date: 2022-10-26 16:54:29
 * @Description:  
 * @FilePath: \vue\jimous-vue\src\pages\card\index.vue
-->
<template>
    <div>
        <card-list :card-list="cardList" :wrapper-style="backStyle" :card-style="cardStyle">
            <template v-slot:cardContent>
                <!-- <div>haha</div> -->
            </template>
        </card-list>
    </div>
</template>
<script>
import CardList from './components/card-list.vue';
export default {
    name: 'CardShow',
    components: {
        CardList,
    },

    data() {
        return {
            cardList: [
                'https://img1.baidu.com/it/u=3603541410,307198424&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=313',
                'https://img0.baidu.com/it/u=3842506989,138195768&fm=253&fmt=auto&app=120&f=JPEG?w=1422&h=800',
                'https://img1.baidu.com/it/u=510391912,755414480&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=281',
            ],
        };
    },
    computed: {
        backStyle() {
            return {
                // width: '100%',
                // height: '3.02rem',
                background: 'gray',
            };
        },
        cardStyle() {
            return {
                // width: '5.22rem',
                // height: '2.62rem',
            };
        },
    },
};
</script>
<style lang="scss" scoped></style>
