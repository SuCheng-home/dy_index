<template>
    <div class="generalCheckNLists">
        <div class="el-row menu-tools">
            <el-button size="medium" @click="goBack()">返回</el-button>
        </div>
        <div class="generalCheckNList scrollBar" :style="`height:${nobottommaxH-10}px`">
            <div class="block-wrap" v-for="(dutyItem,dutyIndex) in dutyList" :key="dutyIndex"
                 v-if="dutyList&&dutyList.length!==0">
                <div class="g-title">
                    <span class="color-block"></span>
                    <span>{{dutyItem.dutyName}}</span>
                </div>
                <div class="content-wrap">
                    <div class="item" v-for="item in dutyItem.compositeCheckItemList" :key="item.id"
                         @click="jumpTo(dutyItem.id,item)">
                        <img class="checkImg" v-if="item.logo" :src="item.logo" alt="">
                        <img class="checkImg"
                             src="https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/check.png" alt=""
                             v-else>
                        <el-tooltip effect="dark" :content="item.itemName" placement="top">
                            <div class="checkName">
                                {{item.itemName}}
                            </div>
                        </el-tooltip>
                    </div>
                </div>
            </div>
            <default-page style="margin-bottom:20px;" Mes="请先设置值班表信息！"
                          v-if="!dutyList||Object.keys(dutyList).length==0"></default-page>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import Cookies from 'js-cookie';
    import DefaultPage from '@/components/DefaultPage';
    import {getCheckCheckItemList} from '@/api/generalCheckN';

    export default {
        components: {
            DefaultPage
        },
        data() {
            return {
                dutyList: [],
                examToken: ''
            }
        },
        created() {
            var That = this;
            this.examToken = Cookies.get('exampad-Token');
            window.sessionStorage.removeItem("generalCheckTitle");
            window.sessionStorage.removeItem("isQuickEvaluation");
            window.sessionStorage.removeItem("quickEvaluationDCode");
            window.sessionStorage.removeItem("classItem");
            That.getCheckCheckItemListFunc();
        },
        mounted() {

        },
        mixins: [mixin],
        methods: {
            goBack() {
                this.$router.push({
                    path: 'dateAccountIndex'
                })
            },
            jumpTo(dutyId, item) {
                window.sessionStorage.setItem("generalCheckTitle", item.itemName);
                window.sessionStorage.setItem("isQuickEvaluation", item.isQuickEvaluation);
                window.sessionStorage.setItem("quickEvaluationDCode", item.quickEvaluationDCode);
                this.$router.push({
                    path: 'generalCheckN',
                    query: {
                        dutyId: dutyId,
                        itemId: item.id
                    }
                })
            },
            getCheckCheckItemListFunc() {
                getCheckCheckItemList().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.dutyList = data.data;
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

    .generalCheckNLists {
        background-color: #fff;
        position: relative;
        padding: 12px;
        box-sizing: border-box;
        overflow-x: hidden;
        overflow-y: auto;

        .generalCheckNList {
            padding-top: 20px;
            box-sizing: border-box;
        }

        .g-title {
            font-size: 16px;
            padding: 10px 0;
            color: #000;

            .color-block {
                width: 4px;
                height: 16px;
                display: inline-block;
                vertical-align: middle;
                background-color: #409efe;
                margin: 0 4px 0 15px;
            }
        }

        .content-wrap {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            background: #fff;
            padding: 20px 0 10px;

            .item {
                width: 150px;
                display: flex;
                justify-content: center;
                flex-direction: column;
                align-items: center;
                font-size: 14px;
                color: #000;
                overflow: hidden;
                cursor: pointer;

                .checkImg {
                    width: 50px;
                    height: 50px;
                    border-radius: 6px;
                    overflow: hidden;
                }

                .checkName {
                    width: 100%;
                    overflow: hidden;
                    padding: 10px 20px;
                    height: 44px;
                    box-sizing: border-box;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    text-align: center;
                }
            }
        }
    }

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }
</style>

