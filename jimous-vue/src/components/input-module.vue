<!--
 * @Author: jimouspeng
 * @Date: 2022-04-08 16:48:00
 * @Description: 上传模块 
 * @FilePath: \vue\jimous-vue\src\components\input-module.vue
-->

<template>
    <div>
        <form action="http://127.0.0.1:2760/upload_img" method="post" enctype="multipart/form-data">
            <input type="file" accept="image/*" />
            <button type="submit">上传</button>
        </form>
        <img v-show="imgUrl" class="img-pick" :src="imgUrl" alt="" />
    </div>
</template>
<script>
import { uploadImg } from '@/apis/index.js'
export default {
    data() {
        return {
            imgUrl: '',
        }
    },
    methods: {
        uploadImgSubmit(e) {
            console.log(e)
        },
        getFile(e) {
            const file = e.target.files[0]
            console.log(e.target.files, '打印看看file')
            this.imgUrl = URL.createObjectURL(file)
            const blobCtx = new Blob([file], { type: 'image/jpg' })
            uploadImg({
                file: file,
            }).then((res) => {
                console.log(res, '打印看看内容')
            })
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
