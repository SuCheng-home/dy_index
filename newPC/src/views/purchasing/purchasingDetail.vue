<template>
    <div class="main-container">
        <div class="el-row menu-tools">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" @click="printHandler" size="medium">打印</el-button>
        </div>
        <div class="content-container" :style="{height: `${maxH + 60}px`}" >
            <div ref="print">
                <div class="left-panel">
                <div class="title">采购名称</div>
                <div class="detail-container">
                    {{purchasingDetail.source}}
                </div>
                <div class="title">申请人</div>
                <div class="detail-container">
                    {{purchasingDetail.createUserName}}
                </div>
                <div class="title">申请部门</div>
                <div class="detail-container">
                    {{purchasingDetail.departName}}
                </div>
                <template v-if="purchasingDetail.typeName">
                    <div class="title">采购类型</div>
                    <div class="detail-container">
                        {{purchasingDetail.typeName}}
                    </div>
                </template>
                <div class="title">申请时间</div>
                <div class="detail-container">
                    {{purchasingDetail.createTime | timeFilter}}
                </div>
                <div class="title">采购清单</div>
                <div>
                    <table class="list-table">
                        <colgroup>
                            <col style="width: 40%" />
                            <col style="width: 20%" />
                            <col style="width: 20%" />
                            <col style="width: 20%" />
                        </colgroup>
                        <thead>
                        <tr>
                            <th>品名</th>
                            <th>单价</th>
                            <th>数量</th>
                            <th>总价</th>
                        </tr>
                        </thead>
                        <tbody>
                        <template v-for="(item) in purchasingDetail.listJson">
                            <tr class="tr--base-info">
                                <td>{{item.listName}}</td>
                                <td>{{item.amount / 100}}</td>
                                <td>{{item.listNum}}</td>
                                <td>{{item.price / 100}}</td>
                            </tr>
                            <tr>
                                <td colspan="5">
                                    <div class="td__effect-container">用途：{{item.effect || '--'}}</div>
                                </td>
                            </tr>
                        </template>
                        </tbody>
                    </table>
                </div>
             <div class="title" v-if="purchasingDetail.fileJson.length">附件图片</div>
                  <div class="workflow-item__photo">
                                    <div class="weui_uploader_bd">
                                        <div class="weui_uploader_files">
                                            <image-previewer tag="richtext">
                                                <img v-for="(photoUrl,indexb) in purchasingDetail.fileJson" :key="indexb"
                                                     class="weui_uploader_file" :src="photoUrl"/>
                                            </image-previewer>
                                        </div>
                                    </div>
                                </div>
            </div>
            <div class="right-panel">
                <div :style="{height: `600px`}">
                    <el-steps direction="vertical"
                              :active="workFlowList.length + (purchasingDetail.state == 5 ? 1 : 0)">
                        <el-step v-for="(workFlowItem,indexa) in workFlowList" :key="indexa">
                            <div class="workflow-item" slot="title">
                                <div class="workflow-item__name">{{workFlowItem.stepStateName.slice(0, 2)}}</div>
                                <div class="workflow-item__content" v-if="workFlowItem.batchContent">
                                    {{workFlowItem.batchContent}}
                                </div>
                                <div class="workflow-item__photo">
                                    <div class="weui_uploader_bd">
                                        <div class="weui_uploader_files">
                                            <image-previewer tag="richtext">
                                                <img v-for="(photoUrl,indexb) in workFlowItem.photoList" :key="indexb"
                                                     class="weui_uploader_file" :src="photoUrl"/>
                                            </image-previewer>
                                        </div>
                                    </div>
                                </div>
                                <div class="workflow-item__time">{{workFlowItem.dealUserName}}&nbsp;&nbsp;{{workFlowItem.createTime
                                    | timeSuffixFilter}}
                                </div>
                                <div v-if="workFlowItem.stepType == 1"
                                     class="workflow-item__tag workflow-item__tag--submit"></div>
                                <div v-else-if="workFlowItem.stepType == 2"
                                     class="workflow-item__tag workflow-item__tag--back"></div>
                                <div class="workflow-item__tag-text">{{workFlowItem.stepStateName.slice(0, 2)}}</div>
                            </div>
                            <div v-if="workFlowItem.stepType == 1"
                                 class="workflow-item__icon workflow-item__icon--submit" slot="icon"></div>
                            <div v-else-if="workFlowItem.stepType == 2"
                                 class="workflow-item__icon workflow-item__icon--back" slot="icon"></div>
                        </el-step>
                        <el-step v-if="purchasingDetail.state == 5">
                            <div class="workflow-item__icon workflow-item__icon--end" slot="icon"></div>
                            <div class="workflow-item" slot="title">
                                <div class="workflow-item__name">结束</div>
                            </div>
                        </el-step>
                    </el-steps>
                </div>
            </div>

            </div>
            
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
    import {
        getProcureById
    } from '@/api/purchasing';
    import {
        getWorkFlowHisList
    } from '@/api/workflow';
    export default {
        name: "purchasingDetail",
        data() {
            return {
                id: this.$route.query.id,
                workFlowList: [],
                purchasingDetail: {}
            }
        },
        components: {ImagePreviewer},
        filters: {
            timeFilter(value) {
                return value ? value.slice(0, value.lastIndexOf('.')) : value;
            }
        },
        mixins: [mixins, BaseMixin],
        created() {
            getProcureById({
                procureId: this.id
            })
                .then(res => res.data)
                .then(data => {
                    data.data.fileJson = data.data.fileJson?JSON.parse(data.data.fileJson):[];
                    data.data.listJson = JSON.parse(data.data.listJson);
                    this.purchasingDetail = data.data;
                });
            getWorkFlowHisList({
                operatId: this.id,
                workFlowType: 'procure'
            })
                .then(res => res.data)
                .then(data => {
                    this.workFlowList = data.data;
                })

        },
        methods: {
            printHandler(){
                this.$print(this.$refs.print);
            },
        }
    }
</script>
<style lang="scss" scoped>
    @import "../../styles/mixin";
    @media print {
        .left-panel {
            margin-left: 5%!important;
            width: 60% !important;
        }
    }
     .weui_uploader_files {
        margin: 0;
    }

    .weui_uploader_file {
        float: left;
        margin-right: 9px;
        margin-bottom: 9px;
        width: 79px;
        height: 79px;
        background: no-repeat center center;
        background-size: cover;
        border-radius: 10px;
    }

    .main-container {
        padding:12px;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
    }

    .title {
        height: 20px;
        line-height: 20px;
        margin: 15px 0;
        padding-left: 8px;
        border-left: 4px solid #409eff;
        color: #333;
        clear: both;
    }

    .left-panel {
        float: left;
        width: 50%;
        margin-left: 15%;
    }

    .right-panel {
        float: right;
        width: 33%;

    }

    .content-container {
        @include clearfix;
        padding-top: 10px;
    }

    .row {
        margin: 20px 0;
    }

    .label {
        width: 10em;
        text-align: right;
        display: inline-block;
        vertical-align: top;
    }

    .workflow-item {
        border: 1px solid #ccc;
        padding: 5px 10px;
        color: #000;
        position: relative;
        overflow: hidden;
        max-width: 320px;

    }

    .workflow-item__content {
        color: #666;
        font-size: 14px;
    }

    .workflow-item__time {
        text-align: right;
        color: #666;
        font-size: 14px;
        clear: both;
    }

    .workflow-item__tag {
        transform: rotate(-45deg);
        width: 60px;
        height: 60px;
        position: absolute;
        top: -30px;
        right: -30px;
    }

    .workflow-item__tag-text {
        position: absolute;
        right: 1px;
        color: #fff;
        transform: rotate(45deg);
        top: 5px;
        font-size: 12px;
    }

    .workflow-item__tag--submit {
        background-color: #04BE02;
    }

    .workflow-item__tag--back {
        background-color: #FFBF4B;
    }

    .workflow-item__icon {
        width: 24px;
        height: 24px;
        background: no-repeat center center / cover;
    }

    .workflow-item__icon--end {
        background-image: url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/leave/submit-icon.png);
    }

    .workflow-item__icon--back {
        background-image: url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/leave/back-icon.png);
    }

    .workflow-item__icon--submit {
        background-image: url(https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/leave/end-icon.png);
    }

    .user-item {
        width: 80px;

        .user-item__avatar {
            width: 60px;
            height: 60px;
            @include cover-bg;
            border-radius: 50%;
            margin: 0 auto 10px auto;
        }

        text-align: center;
        float: left;
    }

    ul {
        list-style-type: none;
        padding: 0;
    }

   
    .value {
        width: 40%;
        word-break: break-all;
        display: inline-block;
    }

    .leave-photo {
        width: 80%;
        display: inline-block;
    }


    .right-box{
        border: 1px #e7eaec solid;
        float: right;
        width: 280px;
        margin: 0 10px;
        .el-tag{
            cursor:pointer;
        }
        .right-box-top{
            font-size: 16px;
            text-align: center;
            border-bottom: 1px solid #e7eaec;
            padding: 6px;
            line-height: 28px;
            color:#606266;
        }
        .ul{
            padding:10px;
            color:#606266;
            overflow: auto;
            .bumen-name{
                font-size: 16px;
                line-height: 20px;
                height: 20px;
                margin: 5px 0 15px 0;
                padding-left: 10px;
                border-left: 3px solid #1fc7cb;
                .el-button{
                    margin-left: 10px;
                }
            }
            .li{
                border:1px #e7eaec solid;
                border-radius: 3px;
                padding: 5px;
                font-size: 12px;
                margin: 10px 0;
                div{
                    margin: 10px 0;
                    span{
                        float: right;
                    }
                }
                .tag-box{
                    overflow: hidden;
                    span{
                        float: none;
                    }
                }
                .li-name{
                    color: #909399;
                    margin: 15px 0;
                }
            }
        }
    }
    .detail-container {
        background-color: #F7FBFD;
        line-height: 30px;
        height: 30px;
        padding-left: 12px;
        box-sizing: border-box;

    }
    .list-table {
        width: 100%;
        table-layout: fixed;
        border-collapse: collapse;
    }
    th {
        color: #646566;
        font-weight: normal;
    }
    thead th {
        border-bottom: 1px solid #ebedf0;
    }
    .tr--base-info td {
        text-align: center;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 8px 10px 0 10px;
    }
    .td__effect-container {
        padding: 0 10px 10px 10px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        position: relative;
    }
    .td__effect-container:after {
        position: absolute;
        box-sizing: border-box;
        content: ' ';
        pointer-events: none;
        bottom: 0;
        left: 0;
        right: 0;
        border-bottom: 1px solid #ebedf0;
    }
    tr:last-of-type .td__effect-container:after {
        border: 0;
    }
</style>

