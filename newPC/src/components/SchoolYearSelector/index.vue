<template>
    <span>
        <el-select class="header-buttom" :value="selectedSchoolYear" size="medium" placeholder="请选择学期"
                   @change="onSchoolYearChange">
            <el-option
                v-for="item in schoolYearList"
                :key="item.year"
                :label="item.year"
                :value="item.year"
            >
            </el-option>
        </el-select>
    </span>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';

    export default {
        name: "index",
        computed: {
            ...mapGetters(['schoolYearList', 'selectedSchoolYear'])
        },
        methods: {
            onSchoolYearChange(id) {
                this.SET_SELECTED_SCHOOLYEAR(id);
                this.$emit('change', id);
            },
            ...mapMutations(['SET_SELECTED_SCHOOLYEAR'])
        }
    }
</script>

<style scoped>

</style>
