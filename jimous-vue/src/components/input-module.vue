<!--
 * @Author: jimouspeng
 * @Date: 2022-04-08 16:48:00
 * @Description: 上传模块 
 * @FilePath: \vue\jimous-vue\src\components\input-module.vue
-->

<template>
    <div>
        <input type="file" @change="getFile" accept="image/*" />
        <img v-show="imgUrl" class="img-pick" :src="imgUrl" alt="" />
    </div>
</template>
<script>
export default {
    data() {
        return {
            imgUrl: '',
        }
    },
    methods: {
        getFile(e) {
            const file = e.target.files[0]
            console.log(e.target.files, '打印看看file')
            this.imgUrl = URL.createObjectURL(file)
            const blobCtx = new Blob([file], { type: 'image/jpg' })
            console.log([blobCtx])
        },
    },
}
</script>
<style lang="scss" scoped>
.img-pick {
    width: 300px;
    height: 300px;
}
</style>
