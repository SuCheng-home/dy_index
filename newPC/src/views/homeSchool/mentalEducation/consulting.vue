<template>
    <div class="mental-education-index">
        <Consulting/>
    </div>
</template>

<script>
    /* utils */

    /* components */
    import Consulting from "./consulting/index";

    /* api */

    export default {
        mixins: [],
        components: { Consulting},
        computed: {
        },
        data() {
            return {
            };
        },
        created() {
        },
        methods: {
        },
    };
</script>
<style lang="scss" scoped>
    .mental-education-index {
        padding: 12px;
    }
</style>
