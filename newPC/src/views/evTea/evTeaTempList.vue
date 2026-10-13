<!--用户已发送通知列表-->
<template>
    <div class="app-container calendar-list-container" id="evTeaAddEdit">
        <div class="top">
            <el-button type="primary" size="medium" @click="isShowAddDialog = true">新建模板
            </el-button>
            <el-input class="search-input search-input--right" size="medium" placeholder="输入搜索模板" v-model="searchTitle">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div :class="['page-main']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <el-tabs v-model="activeName">
                <el-tab-pane label="全部模板类型" name="0">
                </el-tab-pane>
                <el-tab-pane label="常规" name="1"></el-tab-pane>
                <el-tab-pane label="学科-题目" name="2"></el-tab-pane>
                <el-tab-pane label="学科-选项" name="3"></el-tab-pane>
            </el-tabs>
            <div class="temp-list">
                <div class="temp-item-container" v-for="tempItem in showedTempList">
                    <div class="temp-item">
                        <i class="fa fa-trash" @click="delEvaluateTwTempFunc(tempItem.id)"></i>
                        <div class="temp-item__title">
                            <i :class="['icon', ['',  'icon--normal',  'icon--ques',  'icon--opt'][tempItem.tempType]] "></i>
                            <span>{{tempItem.tempTitle}}</span>
                        </div>
                        <div class="temp-item__intro">{{tempItem.tempDesc}}</div>
                        <div class="temp-item__footer">
                            <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                <i class="icon small-icon small-icon--view" @click="toDetailPage(tempItem.tempType, {id: tempItem.id})"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="icon small-icon small-icon--edit" @click="toAddEditPage(tempItem.tempType, {id: tempItem.id, isEdit: 1})"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="复制" placement="top">
                                <i class="icon small-icon small-icon--copy" @click="toAddEditPage(tempItem.tempType, {id: tempItem.id, isCopy: 1})"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="请选择新建位置" :visible.sync="isShowAddDialog" width="600px">
            <div class="dialog-radio-container">
                <el-radio-group v-model="addType">
                    <el-radio :label="1">常规</el-radio>
                    <el-radio :label="2">学科-题目</el-radio>
                    <el-radio :label="3">学科-选项</el-radio>
                </el-radio-group>
            </div>
            <div class="dialog-button-container">
                <el-button type="primary" size="medium" @click="toAddEditPage(addType)">确定</el-button>
                <el-button type="default" size="medium" @click="isShowAddDialog = false">取消</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import DefaultPage from '@/components/DefaultPage';
    import Backtool from '@/components/BackTool';
    import {
        getEvaluateTwTempList,
        delEvaluateTwTemp
    } from '@/api/evTea';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        data() {
            return {
                activeName: '0',
                tempList: [],
                isShowAddDialog: false,
                addType: 1,
                searchTitle: '',
                currentTemp: {}
            }
        },
        components: {Backtool},
        computed: {
            showedTempList() {
                return this.tempList.filter(item => item.tempTitle.includes(this.searchTitle) && (this.activeName == 0 || this.activeName == item.tempType) );
            }
        },
        created() {
            this.getEvaluateTwTempListFunc();
        },
        mixins: [mixin, baseMixin],
        filters: {

        },
        methods: {
            delEvaluateTwTempFunc(tempId) {
                this.$confirm('是否确定删除该模板!', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delEvaluateTwTemp({tempId})
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                this.getEvaluateTwTempListFunc();
                            }
                        });
                })
                    .catch(() => {
                    });

            },
            getEvaluateTwTempListFunc() {
                getEvaluateTwTempList()
                    .then(res => res.data)
                    .then(data => {
                        this.tempList = data.data;
                    })
            },
            toDetailPage(type, args = {}) {
                let url = '';
                 args.num = 1;
                switch(type) {
                    case 1:
                        args.isNormal = 1;
                        url = 'evTeaTempDetail';
                        break;
                    case 2:
                        args.isByQues = 1;
                        url = 'evTeaTempDetail';
                        break;
                    case 3:
                        args.isByOpt = 1;
                        url = 'evTeaTempDetail';
                        break;
                }
                this.jumpToPage(url, args);
            },
            toAddEditPage(type, args = {}) {
                let url = '';
                switch(type) {
                    case 1:
                        args.isNormal = 1;
                        url = 'evTeaTempAddEdit';
                        break;
                    case 2:
                        args.isByQues = 1;
                        url = 'evTeaTempAddEdit';
                        break;
                    case 3:
                        args.isByOpt = 1;
                        url = 'evTeaTempAddEdit';
                        break;
                }
                this.jumpToPage(url, args);
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "../../styles/mixin";

    @media screen and (max-width: 1400px) {
        .temp-item-container {
            width: 33% !important;
        }
        .temp-item-container .temp-item__title span {
            width: 80% !important;
        }
    }

    .pagination-container {
        margin-top: 10px;
    }
    .top{
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    .el-icon-paperclip {
        margin-right: 3px;
    }
    .temp-item-container {
        width: 25%;
        float: left;
        min-width: 200px;
        box-sizing: border-box;
        .temp-item {
            width: 90%;
            height: 250px;
            margin: 0 auto 10px auto;
            padding: 20px;
            background-color: #ECF5FF;
            position: relative;
            border-radius: 5px;
        }
        .icon {
            width: 32px;
            height: 32px;
            background: no-repeat center center / contain;
            margin-right: 10px;
        }
        .temp-item__title {
            & > * {
                display: inline-block;
                vertical-align: top;
            }
            span {
                width: 85%;
                font-size: 18px;
                font-weight: bold;
                position: relative;
                top: 6px;
            }
        }
        .temp-item__intro {
            margin-top: 30px;
            padding-left: 32px;
            color: #5F5F5F;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            float: left;
            margin-right: 20px;
            max-height: 70px;
        }
        .temp-item__footer {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 20px;
        }
        .icon--normal {
            background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/evTea/normal-type-icon.png);
        }
        .icon--ques {
            background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/evTea/ques-type-icon.png);
        }
        .icon--opt {
            background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/evTea/opts-type-icon.png);
        }
        .small-icon {
            float: right;
            width: 24px;
            height: 24px;
            background: no-repeat center center / contain;
            cursor: pointer;
            margin-left: 4px;
        }
        .small-icon--copy {
            background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/evTea/copy-icon.png);

        }
        .small-icon--view {
            background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/evTea/view-icon.png);

        }
        .small-icon--edit {
            background-image: url(https://cdnfile-10043692.file.myqcloud.com/admin/images/evTea/edit-icon.png);

        }
        .fa-trash {
            position: absolute;
            right: 10px;
            top: 10px;
            color: #F08080;
            display: none;
            cursor: pointer;
        }
        .temp-item:hover .fa-trash {
            display: block;
        }

    }
    .dialog-button-container {
        margin-top: 10px;
        text-align: right;
    }
    .dialog-radio-container {
        text-align: center;
    }
</style>
