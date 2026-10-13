<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button class="filter-item" type="primary" @click="onsubmit()" size="medium">保存</el-button>
        </back-tool>
        <div class="main-container">
            <div class="big-title"><span class="mudule-info"><span class="color-block"></span>初始化设置 </span></div>
            <div>
                <el-checkbox  v-model="filePrint" :disabled="true">文件影印</el-checkbox>
            </div>
            <br />
            <div>
                <el-checkbox v-model="consumableApply">耗材申请</el-checkbox>
            </div>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {
        addOrUpdateInit,
        getBySchoolIdInit
    } from '@/api/printApplication';

    export default {
        name: "printInitSetting",
        components: {BackTool},
        data() {
            return {
                filePrint: true,
                consumableApply: false
            }
        },
        created() {
            getBySchoolIdInit()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.consumableApply = pageData.consumableApply == 1;
                });
        },
        methods: {
            onsubmit() {
                addOrUpdateInit({
                    consumableApply: this.consumableApply ? 1 : 2,
                    filePrint: this.filePrint ? 1 : 2
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success('保存成功');
                            this.$router.back();
                        } else {
                            this.$message.error(data.msg);
                        }
                    });
            }
        }
    }
</script>

<style scoped>
    .main-container {
        width: 810px;
        margin: 10px auto;
    }
    .big-title {
        margin-bottom: 6px;
    }
    .big-title .mudule-info {
        height: 40px;
        font-size: 15px;
        font-weight: 700;
        line-height: 40px;
        color: #676a6c;
    }
    .big-title .mudule-info .color-block {
        width: 4px;
        display: inline-block;
        margin-right: 12px;
        vertical-align: middle;
        margin-top: 12px;
        height: 16px;
        background: #409EFF;
        float: left;
    }
</style>
