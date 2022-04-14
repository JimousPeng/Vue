<!--
 * @Author: jimouspeng
 * @Date: 2022-04-08 16:48:00
 * @Description: 上传模块 
 * @FilePath: \vue\jimous-vue\src\components\input-module.vue
-->

<template>
    <div>
        <!-- target指向iframe的name -->
        <form
            action="http://127.0.0.1:2760"
            method="post"
            enctype="multipart/form-data"
            target="iframe-upload"
        >
            <input ref="inputFile" type="file" accept="image/*" @change="changeFile" name="file" />
            <button type="submit">上传</button>
        </form>
        <img v-show="imgUrl" class="img-pick" :src="imgUrl" alt="" />
        <iframe class="iframe-module" id="iframe-upload" name="iframe-upload"></iframe>
    </div>
</template>
<script>
import { uploadImg } from '@/apis/index.js';
export default {
    data() {
        return {
            imgUrl: '',
        };
    },
    mounted() {
        console.log(this.$refs.inputFile.value, '看看input的值');
    },
    methods: {
        changeFile() {
            console.log(this.$refs.inputFile.value, '看看input的值');
            // this.$refs.referenceUpload.value = null
        },
        uploadImgSubmit(e) {
            console.log(e);
        },
        getFile(e) {
            const file = e.target.files[0];
            console.log(e.target.files, '打印看看file');
            this.imgUrl = URL.createObjectURL(file);
            const blobCtx = new Blob([file], { type: 'image/jpg' });
            uploadImg({
                file: file,
            }).then((res) => {
                console.log(res, '打印看看内容');
            });
            console.log([blobCtx]);
        },
    },
};
</script>
<style lang="scss" scoped>
.img-pick {
    width: 300px;
    height: 300px;
}
.iframe-module {
    // display: none;
}
</style>
