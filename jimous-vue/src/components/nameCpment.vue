<template>
    <div>
        <span>{{ userName }}</span>
    </div>
</template>
<script>
export default {
    name: 'nameCpment',
    props: {
        userName: {
            type: String,
            default: 'name----',
        },
    },
}
</script>
<style lang="scss" scoped></style>
