<template>
    <div>
        <div class="header_btn_box">
            <el-button type="primary" size="medium" @click.native="toDicAdd">保存</el-button>
        </div>
        类型新增
    </div>
</template>

<script>
    export default {
        name: "schoolDictionaryTypeAdd",
        data() {
            return {
                dicList: []
            }
        },
        created() {

        },
        methods: {
            toDicAdd() {

            }
        }
    }
</script>

<style scoped>

</style>
