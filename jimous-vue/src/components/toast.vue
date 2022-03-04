<template>
    <div class="toast-module">
        <p class="toast-text">{{ desc }}</p>
    </div>
</template>
<script>
export default {
    name: 'toast',
    props: {
        desc: {
            type: String,
            default: '这是一个toast',
        },
    },
}
</script>
<style lang="scss" scoped>
.toast-text {
    color: red;
}
</style>
