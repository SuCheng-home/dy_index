<!--用户已发送通知列表-->
<template>
    <div class="page calendar-list-container" id="evTeaAddEdit">
        <div class="menu-tools">
            <el-button type="primary" size="medium" @click="jumpToPage('evTeaTempAddEdit')">新建模板
            </el-button>
            <el-input class="search-input search-input--right" size="medium" placeholder="输入搜索模板" v-model="searchTitle">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div :class="['page-main']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div class="temp-list">
                <div class="temp-item-container" v-for="tempItem in showedTempList">
                    <div class="temp-item">
                        <i class="fa fa-trash" @click="delEvaluateTwTempFunc(tempItem.id)"></i>
                        <div class="temp-item__title">
                            <i :class="['icon', 'icon--normal'] "></i>
                            <span>{{tempItem.tempTitle}}</span>
                        </div>
                        <div class="temp-item__intro">{{tempItem.tempDesc}}</div>
                        <div class="temp-item__footer">
                            <el-tooltip class="item" effect="dark" content="查看" placement="top">
                                <i class="icon small-icon small-icon--view" @click="jumpToPage('evTeaTempDetail', {id: tempItem.id})"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                                <i class="icon small-icon small-icon--edit" @click="jumpToPage('evTeaTempAddEdit', {id: tempItem.id, isEdit: 1})"></i>
                            </el-tooltip>
                            <el-tooltip class="item" effect="dark" content="复制" placement="top">
                                <i class="icon small-icon small-icon--copy" @click="jumpToPage('evTeaTempAddEdit', {id: tempItem.id, isCopy: 1})"></i>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import {
        getEvaluateTwTempList,
        delEvaluateTwTemp
    } from '@/api/evTeaKinder';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';

    export default {
        data() {
            return {
                tempList: [],
                searchTitle: '',
            }
        },
        components: {Backtool},
        computed: {
            showedTempList() {
                return this.tempList.filter(item => item.tempTitle.includes(this.searchTitle));
            }
        },
        created() {
            this.getEvaluateTwTempListFunc();
        },
        mixins: [mixin, baseMixin],
        filters: {},
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
    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }
    .page {
        padding:12px;
    }
    .temp-list {
        margin-top: 10px;
    }

</style>
