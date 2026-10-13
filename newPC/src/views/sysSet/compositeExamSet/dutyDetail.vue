<template>
    <div class="dutyDetail">
        <div class="el-row menu-tools">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button size="medium" type="primary" @click="editBtn()">编辑</el-button>
            <el-button size="medium" type="primary" @click="checkDutyList()">设置检查项</el-button>
        </div>
        <div class="main-wrap scrollBar" :totalArray="totalArray" :style="{'height':nobottommaxH+'px'}">
            <div class="body">
                <el-row>
                <el-col :span="24">
                    <h3 class="head-title">{{totalArray.dutyName}}</h3>
                </el-col>
            </el-row>
            <table class="table table-hover table-bordered">
                <thead>
                <tr>
                    <th style="width: 16.6%;font-weight: bold">组名</th>
                    <th style="width: 16.6%">周一</th>
                    <th style="width: 16.6%">周二</th>
                    <th style="width: 16.6%">周三</th>
                    <th style="width: 16.6%">周四</th>
                    <th style="width: 16.6%">周五</th>
                </tr>
                </thead>
                <tbody>
                <template v-for="(tableItem,tableIndex) in totalArray.tableList">
                    <tr :key="tableIndex">
                        <td style="font-weight: bold;line-height:24px;">{{tableItem.groupName}}</td>
                        <td>
                            <div class="chose-teacher">
                                <template v-for="(sub,index) in tableItem.monCheckUserList">
                        <span class="address-source-item" :key="index">
                            <img :src="sub.avatar">
                            <span class="address-source-item-des">{{sub.name}}</span>
                        </span>
                                </template>
                            </div>
                        </td>
                        <td>
                            <div class="chose-teacher">
                                <template v-for="(sub,index) in tableItem.tueCheckUserList">
                        <span class="address-source-item" :key="index">
                            <img :src="sub.avatar">
                            <span class="address-source-item-des">{{sub.name}}</span>
                        </span>
                                </template>
                            </div>
                        </td>
                        <td>
                            <div class="chose-teacher">
                                <template v-for="(sub,index) in tableItem.wedCheckUserList">
                        <span class="address-source-item" :key="index">
                            <img :src="sub.avatar">
                            <span class="address-source-item-des">{{sub.name}}</span>
                        </span>
                                </template>
                            </div>
                        </td>
                        <td>
                            <div class="chose-teacher">
                                <template v-for="(sub,index) in tableItem.thuCheckUserList">
                        <span class="address-source-item" :key="index">
                            <img :src="sub.avatar">
                            <span class="address-source-item-des">{{sub.name}}</span>
                        </span>
                                </template>
                            </div>
                        </td>
                        <td>
                            <div class="chose-teacher">
                                <template v-for="(sub,index) in tableItem.friCheckUserList">
                        <span class="address-source-item" :key="index">
                            <img :src="sub.avatar">
                            <span class="address-source-item-des">{{sub.name}}</span>
                        </span>
                                </template>
                            </div>
                        </td>
                    </tr>
                </template>
                </tbody>
            </table>
            <el-row :gutter="24" v-if="totalArray.isDefaultScore==1||totalArray.isPraiseScore==1||totalArray.isCriticismScore==1">
                <el-col :span="8" v-if="totalArray.isDefaultScore==1">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">默认分数:</span><span> {{totalArray.defaultScore}}分</span>
                        </label>
                    </div>
                </el-col>
                <el-col :span="8"  v-if="totalArray.isPraiseScore==1">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">表扬分数:</span><span> >= {{totalArray.praiseScore}}分</span>
                        </label>
                    </div>
                </el-col>
                <el-col :span="8"  v-if="totalArray.isCriticismScore==1">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">批评分数:</span><span> <= {{totalArray.criticismScore}}分</span>
                        </label>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="18">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">校区包含年级:</span><span> {{totalArray.classStr}}</span>
                        </label>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24" v-if="totalArray.events==1">
                <el-col :span="18">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">是否记录大事记:</span><span>{{totalArray.events==1?'是':'否'}}</span>
                        </label>
                    </div>
                </el-col>
            </el-row>
            <!--新增-->
            <el-row :gutter="24">
                <el-col :span="18">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">提醒检查员:</span><span> {{totalArray.isRemind!==0?'否':'是'}}</span>
                        </label>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="18">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">是否记录反馈:</span><span> {{totalArray.isFeedback?'是':'否'}}</span>
                        </label>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24" v-show="totalArray.feedbackUserStr">
                <el-col :span="18">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">反馈推送人:</span><span> {{totalArray.feedbackUserStr}}</span>
                        </label>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="18">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">是否推送问题反馈:</span><span> {{totalArray.isPush?'是':'否'}}</span>
                        </label>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24" v-show="totalArray.pushUserStr">
                <el-col :span="18">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">推送人:</span><span> {{totalArray.pushUserStr}}</span>
                        </label>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24">
                <el-col :span="18">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">推送检查结果:</span><span> {{totalArray.isPushResult?'是':'否'}}</span>
                        </label>
                    </div>
                </el-col>
            </el-row>
            <el-row :gutter="24" v-show="totalArray.pushResultUserStr">
                <el-col :span="18">
                    <div class="form-group">
                        <label class="control-label">
                            <span class="content_span">检查结果推送人:</span><span> {{totalArray.pushResultUserStr}}</span>
                        </label>
                    </div>
                </el-col>
            </el-row>

            </div>
            
        </div>
    </div>
</template>
<script>
    import {getDutyById} from '@/api/compositeExamSet';
    import mixin from '@/mixins/windowResize';
    export default {

        data() {
            return {
                dutyId: this.$route.query.dutyId,
                totalArray: ''
            }
        },
        created() {
            this.getDutyByIdFunc();
        },
        mixins: [mixin],
        methods: {
            goback() {
                this.$router.push({
                    path: 'dutyListIndex',
                    query: {
                        dutyId: this.dutyId
                    }
                })
            },
            checkDutyList() {
                this.$router.push({
                    path: 'checkDutyList',
                    query: {
                        dutyId: this.dutyId
                    }
                })
            },
            editBtn() {
                this.$router.push({
                    path: 'editDuty',
                    query: {
                        dutyId: this.dutyId
                    }
                })
            },
            getDutyByIdFunc() {
                getDutyById({
                    dutyId: this.dutyId
                }).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.totalArray = data.data;
                    }
                }).catch(() => {
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
.scrollBar {
        overflow-x: hidden;
        overflow-y: auto;
        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }
        &::-webkit-scrollbar {
            width: 6px;
        }
        &::-webkit-scrollbar-thumb {
            background: #99a9bf;
            border-radius: 20px;
        }
    }
    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }

    ul, li {
        list-style: none;
    }

    .dutyDetail {
        padding:12px;
    }

    .main-wrap {
        padding-top: 20px;
    }
    .body{
        width: 810px;
        margin: 0 auto;
    }
    .head-title {
        text-align: center;
        font-size: 24px;
    }

    table {
        width: 100%;
        max-width: 100%;
        margin-bottom: 30px;
        white-space: normal;
        line-height: normal;
        font-weight: normal;
        font-size: 14px;
        font-variant: normal;
        font-style: normal;
        color: -webkit-text;
        text-align: start;
        border-spacing: 0;
        border-collapse: collapse;
    }

    .table-bordered {
        border: 1px solid #ddd;
    }

    .table > tbody > tr > td, .table > tbody > tr > th, .table > tfoot > tr > td, .table > tfoot > tr > th, .table > thead > tr > td, .table > thead > tr > th {
        padding: 8px;
        line-height: 1.42857143;
        vertical-align: top;
        border-top: 1px solid #ddd;
    }

    table td, table th {
        text-align: center;
    }

    .table-bordered > tbody > tr > td, .table-bordered > tbody > tr > th, .table-bordered > tfoot > tr > td, .table-bordered > tfoot > tr > th, .table-bordered > thead > tr > td, .table-bordered > thead > tr > th {
        border: 1px solid #ddd;
    }

    .table > caption + thead > tr:first-child > td, .table > caption + thead > tr:first-child > th, .table > colgroup + thead > tr:first-child > td, .table > colgroup + thead > tr:first-child > th, .table > thead:first-child > tr:first-child > td, .table > thead:first-child > tr:first-child > th {
        border-top: 0;
    }

    .table-hover > tbody > tr:hover {
        background-color: #f5f5f5;
    }

    .address-source-item {
        height: 25px;
        margin-top: 5px;
        margin-bottom: 5px;
        margin-left: 5px;
        line-height: 25px;
        display: inline-block;
        background-color:  #e7eaec;
        border-radius: 3px;
        padding-right: 8px;
    }

    .address-source-item > img {
        float: left;
        width: 25px;
        height: 25px;
        margin-right: 3px;
    }

    .form-group {
        font-size: 14px;
    }

    .content_span {
        margin-left: 20px;
        font-weight: bold;
    }

    .form-group {
        margin-bottom: 15px;
    }

    .el-row {
       // margin-bottom: 20px;
    }

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }
</style>

