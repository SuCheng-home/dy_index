<template>
    <div class="page">
        <el-tabs type="border-card" v-model="activeName" @tab-click="tabsfun()">
            <el-tab-pane label="批次" name="batchDetail">

            </el-tab-pane>
            <el-tab-pane label="计划统计" name="planAccounting">
                <div class="activityDetail">
                    <div class="el-row menu-tools">
                        <el-button type="default" size="medium" @click="$router.back()">返回</el-button>


                    </div>
                    <div class="main-wrap scrollBar" :style="{'height':nobottommaxH - 30+'px'}">
                        <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
                            <div class="big-title">
                                <div class="mudule-info">
                                    <span class="color-block"></span>计划通知
                                </div>
                            </div>
                            <el-form-item label="批次名称">
                                <span>批次名称</span>
                            </el-form-item>

                            <el-form-item label="学期">
                                <span>2021-2022学年第二学期</span>
                            </el-form-item>
                            <el-form-item label="上传截止时间">
                                <span>2021-04-10</span>
                            </el-form-item>
                            <el-form-item label="备注">
                                备注
                            </el-form-item>

                            <div class="big-title">
                                <div class="mudule-info">
                                    <span class="color-block"></span>总结通知
                                </div>
                            </div>

                            <el-form-item label="批次名称">
                                <span>批次名称</span>
                            </el-form-item>

                            <el-form-item label="学期">
                                <span>2021-2022学年第二学期</span>
                            </el-form-item>
                            <el-form-item label="上传截止时间">
                                <span>2021-04-10</span>
                            </el-form-item>
                            <el-form-item label="备注">
                                备注
                            </el-form-item>
                            <el-form-item label="模板">
                                <file-list style="width: 400px;" :isShowTitle="false" :fileList="files"></file-list>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-tab-pane>
            <el-tab-pane label="总结统计" name="summaryAccounting"></el-tab-pane>
            <el-tab-pane label="备课组活动统计" name="courseGroupAccounting"></el-tab-pane>
            <el-tab-pane label="卷量统计" name="juanliangAccounting"></el-tab-pane>

        </el-tabs>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import FileList from '@/components/FileList/FileList.vue';

    export default {
        components: {
            FileList
        },
        data() {
            return {
                activeName: 'planAccounting',
                activityId: this.$route.query.id,
                files: [{
                    fileName: '1.pdf',
                    fileUrl: 'abc'
                }, {
                    fileName: '2.pdf',
                    fileUrl: 'abc'
                }],

            }
        },
        created() {
        },
        mounted() {
            this.getActivityInfoFunc();
        },
        mixins: [mixin],
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        filters: {

        },
        methods: {
            tabsfun() {
                if (this.activeName != 'planAccounting') {
                    this.$router.push({
                        path: this.activeName,
                        query: {
                            id: this.id
                        }
                    });
                }
            },
        }
    }
</script>
<style lang="scss" scoped>

    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }
    .activityDetail {
        color: #333;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
            position: relative;
        }

        .main-wrap {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 10px;
            box-sizing: border-box;

            .title {
                line-height: 1.2em;
                font-size: 26px;
                text-align: center;
                color: rgb(47, 64, 80);
                margin: 20px 0;
            }
        }
    }

    .big-title {
        margin-bottom: 6px;

        .mudule-info {
            height: 40px;
            font-size: 15px;
            font-weight: 700;
            line-height: 40px;
            color: #676a6c;
            margin-left: 50px;

            .color-block {
                width: 4px;
                display: inline-block;
                margin-right: 12px;
                vertical-align: middle;
                margin-top: -3px;
                height: 16px;
                background: #409EFF;
            }
        }
    }


</style>
<style lang="scss">
    .activityDetail .el-form-item__content {
        padding-left: 10px;
    }

    .activityDetail .el-form-item__label {
        font-weight: 700;
        color: #666;
        padding-right: 20px;
    }
    .activityScopesBox .el-button {
        padding: 10px 20px !important;
    }

    .activityDetail .el-form-item {
        margin-bottom: 10px;
    }
</style>
