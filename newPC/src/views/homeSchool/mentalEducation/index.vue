<template>
    <div class="mental-education-index">
        <Popularization v-if="tab == 1"/>
        <Consulting  v-if="tab == 2"/>
    </div>
</template>

<script>
    /* utils */

    /* components */
    import Popularization from "./popularization";
    import Consulting from "./consulting";

    /* api */

    export default {
        name: "mentalEducationIndex",
        mixins: [],
        components: {Popularization, Consulting},
        computed: {

        },
        data() {
            return {
                tab: this.$route.params.tab,
            };
        },
        watch: {
            $route(to) {
                this.tab = to.params.tab;
            }
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
