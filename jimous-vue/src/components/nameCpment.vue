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
            validator: (val) => {
                console.log(val, '看看0-0-');
                return val;
            },
        },
    },
    watch: {
        userName(val) {
            console.log(val, '触发了');
        },
    },
};
</script>
<style lang="scss" scoped></style>
