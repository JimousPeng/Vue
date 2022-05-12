<script>
export default {
    props: {
        level: {
            require: true,
            type: Number,
        },
    },
    render(h) {
        return h('h' + this.level, this.$slots.default);
    },
};
</script>