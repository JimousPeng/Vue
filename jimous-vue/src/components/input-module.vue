<!--
 * @Author: jimouspeng
 * @Date: 2022-04-08 16:48:00
 * @Description: 上传模块 
 * @FilePath: \vue\jimous-vue\src\components\input-module.vue
-->

<template>
    <div class="form-module">
        <!-- form表单提交--target指向iframe的name -->
        <!-- <form
            action="http://127.0.0.1:2760/form_post12"
            method="post"
            enctype="multipart/form-data"
            target="iframe-upload"
        >
            <input ref="inputFile" type="file" @change="changeFile" name="file" />
            <button type="submit">上传</button>
        </form> -->
        <!-- <iframe class="iframe-module" id="iframe-upload" name="iframe-upload">
            <div>哈哈哈测试游戏性</div>
            <head> </head>
        </iframe> -->

        <!-- FormData对象上传 -->
        <input ref="inputFile" type="file" @change="changeFile" name="file" />
        <button type="submit" @click.stop="uploadFile">上传</button>
        <img v-show="imgUrl" class="img-pick" :src="imgUrl" alt="" />
        <div @click.stop="login">点击登录</div>
        <div>拖拽上传:</div>
        <div class="drag-module" @dragover="fileDragover" @drop="fileDrop"></div>
    </div>
</template>
<script>
import { uploadImg, getUserInfo } from '@/apis/index.js';
export default {
    data() {
        return {
            imgUrl: '',
            filePkg: null,
        };
    },
    mounted() {
        console.log(this.$refs.inputFile.value, '看看input的值');
    },
    methods: {
        changeFile(e) {
            this.filePkg = e.target.files[0];
            this.imgUrl = URL.createObjectURL(this.filePkg);
        },
        uploadFile() {
            const formData = new FormData();
            if (this.filePkg) {
                console.log(this.filePkg);
                formData.append('file', this.filePkg);
            }
            uploadImg(formData).then((res) => {
                console.log(res, '打印看看内容');
            });
        },
        login() {
            const params = {
                userId: '2760',
                name: '天道惑颜',
            };
            getUserInfo(params).then((res) => {
                console.log(res, 'login');
            });
        },
        // 拖拽上传, chrome下必须阻止dragenter和dragover的默认行为，才能触发drop事件
        fileDragover(e) {
            e.preventDefault();
        },
        fileDrop(e) {
            e.preventDefault();
            this.filePkg = e.dataTransfer.files[0];
            this.imgUrl = URL.createObjectURL(this.filePkg);
        },
    },
};
</script>
<style lang="scss" scoped>
.form-module {
    display: flex;
    flex-direction: column;
    align-items: center;
    .img-pick {
        width: 300px;
        height: 300px;
    }
    .iframe-module {
        // display: none;
    }
    .drag-module {
        width: 300px;
        height: 300px;
        background-color: yellowgreen;
    }
}
</style>
