<template>
    <div class="dutyListIndex">
        <div class="el-row menu-tools">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
             <router-link   :to="{path:'campusPatrolSetupTermIndex'}">
                <el-button size="medium" type="primary">巡查项设置</el-button>
            </router-link>           
            <router-link   :to="{path:'compositeExamSetTwosetup'}">
                <el-button size="medium" type="primary">推送设置</el-button>
            </router-link>
             <router-link   :to="{path:'campusPatrolSetupAdd'}">
                <el-button size="medium" type="primary">新建巡查组</el-button>
            </router-link>
            
        </div>
        <div class="main-wrap scrollBar" v-if="checkList&&checkList.length !== 0" :style="{'height':nobottommaxH+'px'}">
            <ul class="card_ul clearfix">
                <li v-for="(item,index) in checkList" :key="index" @mouseover="showDel(item)" @mouseout="hideDel(item)"
                    :class="{active:index==isActive}" @click="campusPatrolSetupInfo(item.key)">
                    <a href="javascript:">
                        <i v-show="item.delBtn" class="el-icon-close glyphicon-remove" title="删除"
                           @click.stop="delComplexCheckBase(item.key)"></i>
                        <div class="dutyName">{{item.value}}</div>
                    </a>
                </li>
            </ul>
        </div>
    </div>
</template>
<script>
    import {getComplexCheckBaseList,delComplexCheckBase} from '@/api/compositeExamSetTwo';
    import mixin from '@/mixins/windowResize';
    import Cookies from "js-cookie";
    export default {
        data() {
            return {
                checkList: [],
                isActive: false
            }
        },
        mixins: [mixin],
        created() {
            /*获取值班表*/
            this.getComplexCheckBaseList();
        },
        methods: {
            campusPatrolSetupInfo(id) {
                this.$router.push({
                    path: 'campusPatrolSetupInfo',
                    query: {
                        id: id
                    }
                })
            },
            delComplexCheckBase(id) {
                let _this = this;
                this.$confirm('确认删除巡查组？', '提示', {
                    type: 'error'
                }).then(() => {
                    delComplexCheckBase(id).then(res => {
                        let data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getComplexCheckBaseList();
                        }
                    })
                })
                    .catch(() => {
                    });
            },
            showDel(item) {
                item.delBtn = true;
            },
            hideDel(item) {
                item.delBtn = false;
            },
            getComplexCheckBaseList() {
                getComplexCheckBaseList()
                    .then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.checkList = data.data.map(item => ({
                                key: item.id,
                                value: item.dutyName,
                                delBtn: false
                            }))
                        }
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

    .dutyListIndex {
        padding:12px;
    }

    .main-wrap {
        width: 100%;
    }

    .card_ul {
        width: 100%;
        padding: 0;
        margin:0;
        li {
            float: left;
            width: 280px;
            height: 170px;
            margin: 10px 8px;
            overflow: hidden;
            box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
            a {
                display: block;
                position: relative;
                width: 280px;
                height: 170px;
                font-size: 17px;

                background: #fff url(https://cdnfile-10043692.file.myqcloud.com/admin/images/composite.jpg) no-repeat;
                border-radius: 4px;
                text-align: center;
                background-size: 100% 100%;
                overflow: hidden;
                box-sizing: border-box;
                .dutyName {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    height: 40px;
                    line-height: 40px;
                    color: #fff;
                    background: rgba(0, 0, 0, 0.5);
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .glyphicon-remove {
                    position: absolute;
                    color: #E64340;
                    right: 10px;
                    top: 10px;
                    display: inline-block;
                    transition: .3s ease-in;
                }
            }
        }
        li:hover {
            box-shadow: 1px 4px 10px 2px #CCC;
            -moz-box-shadow: 1px 4px 10px 2px #CCC;
            -webkit-box-shadow: 1px 4px 10px 2px #CCC;
            transform: translateY(-1%);
            -webkit-transition: all .4s;
            transition: all .4s;
            -moz-transition: all .4s;
            cursor: pointer;
        }
    }

    .menu-tools {
        border-bottom: 1px solid #e7eaec;
        padding-bottom: 10px;
    }
</style>
