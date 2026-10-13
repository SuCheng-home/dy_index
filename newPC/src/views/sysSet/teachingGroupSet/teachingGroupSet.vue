<template>
    <div class="app-container calendar-list-container" :style="{ height: (maxH+115) + 'px' }">
        <div class="org-tree el-table__body-wrapper" :style="{  height: (maxH+105) + 'px' }">
            <div class="tree-btn-container">
                <el-button type="default" @click="$router.back()" size="mini">返回</el-button>
                <el-button type="primary" @click="jumpToPage('teachingGroupAddEdit', {pid: 0})" size="mini">添加教研组
                </el-button>
            </div>
            <div class="tree-container">
                <el-tree class="filter-tree"
                         :data="treeData"
                         :props="{
                            children: 'children',
                            label: 'tmgName'
                        }"
                         :filter-node-method="filterNode"
                         ref="tree"
                         node-key="id"
                         @node-click="onNodeClick"
                         :expand-on-click-node='false'
                >
                <div class="custom-tree-node" slot-scope="{ node, data }">
                    <span class="tree__tmg-name" :title="data.tmgName">{{data.tmgName}}</span>
                </div>
                </el-tree>
            </div>

        </div>
        <div class="org-panel" :style="{  width: maxW + 40 + 'px',height: (maxH+105) + 'px' }">
            <div class="panel-box">
                <template v-if="groupDetail">
                    <div class="panel-box-header">
                        <div class="header-line1">
                            <span class="panel-box-header__tmg-name">{{groupDetail.tmgName}}</span>
                            <span class="panel-box-header__subject-name">{{groupDetail.subjectName}}</span>
                            <span class="panel-box-header__grade-name">{{groupDetail.gradeNames}}</span>
                            <span class="panel-box-header__btns">
                                <i class="fa fa-edit"
                                   @click="jumpToPage('teachingGroupAddEdit', {id: groupDetail.id})"></i>
                                <i class="fa fa-trash" @click="deleteGroup"></i>
                            </span>
                        </div>
                        <div>
                            <el-button v-show="groupDetail.pid == 0" style="margin-top: 10px;" type="primary" size="mini"
                                       @click="jumpToPage('teachingGroupAddEdit', {pid: currentNode.id})">添加备课组
                            </el-button>
                        </div>
                    </div>
                    <hr class="class-hr">
                    <div class="penel-box-content">
                        <div class="content__section">
                            <el-row>
                                <el-col span="6">
                                    <div class="outer-title">
                                        <div class="title">组长</div>
                                    </div>
                                    <div class="content">
                                        <el-tag style="margin-right: 10px;margin-bottom: 10px;"
                                                v-for="(leaderName,indexa) in groupDetail.leaderList" :key="indexa">{{leaderName}}
                                        </el-tag>
                                    </div>
                                </el-col>
                                <el-col span="6">
                                    <div class="outer-title">
                                        <div class="title">
                                            副组长
                                        </div>
                                    </div>
                                    <div class="content">
                                        <el-tag style="margin-right: 10px;margin-bottom: 10px;"
                                                v-for="(dLeaderName,indexb) in groupDetail.deputyLeaderList" :key="indexb">{{dLeaderName}}
                                        </el-tag>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>

                        <div class="content__section">
                            <el-row>
                                <el-col span="16">
                                    <div class="outer-title">
                                        <div class="title">
                                            组员
                                        </div>
                                    </div>
                                    <div class="content">
                                        <el-tag style="margin-right: 10px;margin-bottom: 10px;" v-for="(member,indexc) in groupDetail.members" :key="indexc">
                                            {{member.name}}
                                        </el-tag>
                                    </div>
                                </el-col>
                            </el-row>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>
<script>
    import {isShowByPermission} from '@/utils';

    import {
        teachingResearchList,
        teachingResearchDetail,
        teachingResearchDelete
    } from '@/api/systemSet/teachingGroupSet';
    import mixin from '@/mixins/windowResize';

    export default {
        mixins: [mixin],
        data() {
            return {
                treeData: [],
                groupDetail: null,
                currentNode: null
            };
        },
        created() {
            this.teachingResearchListFunc()
                .then(() => {
                    setTimeout(() => {
                        this.$refs.tree.setCurrentKey(this.treeData[0].id);
                        this.currentNode = this.treeData[0];
                        this.teachingResearchDetailFunc();

                    }, 300);
                })

        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            },
        },
        methods: {
            isShowByPermission,
            jumpToPage(path, query) {
                if (query === null || query === undefined) {
                    query = {};
                }
                this.$router.push({
                    path,
                    query
                })
            },
            teachingResearchListFunc() {
                return teachingResearchList()
                    .then(res => res.data)
                    .then(data => {
                        this.treeData = data.data;
                    });
            },
            handleSelectionChange(val) {//多选操作
                this.multipleSelection = val;
            },
            deleteGroup() {//删除部门
                this.$confirm('确认要删除么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    teachingResearchDelete({
                        id: this.currentNode.id
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.currentNode = null;
                                this.groupDetail = null;
                                this.teachingResearchListFunc()
                                    .then(() => {
                                        setTimeout(() => {
                                            this.$refs.tree.setCurrentKey(this.treeData[0].id);
                                            this.currentNode = this.treeData[0];
                                            this.teachingResearchDetailFunc();
                                        }, 300);
                                    });
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                }).catch();
            },
            onNodeClick(node) {
                this.currentNode = node;
                this.teachingResearchDetailFunc();
            },
            teachingResearchDetailFunc() {
                teachingResearchDetail({
                    id: this.currentNode.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        data.data.leaderList = pageData.leaderNames !== '' && pageData.leaderNames ? pageData.leaderNames.split(',') : [];
                        data.data.deputyLeaderList = pageData.deputyleaderNames !== '' && pageData.deputyleaderNames ? pageData.deputyleaderNames.split(',') : [];
                        data.data.memberNames = pageData.memberNames ? pageData.memberNames : [];
                        this.groupDetail = data.data;
                    })
            }

        }
    };
</script>

<style lang="scss" scoped>
    @import "../../../styles/mixin.scss";

    .app-container {
        position: relative;
        box-sizing: border-box;
    }

    .org-tree {
        width: 204px;
        /* float:left; */
        overflow-y: auto;
        position: absolute;
    }

    .org-panel {
        /* float:left; */
        position: absolute;
        left: 220px;
    }

    .panel-box {
        border: 1px solid #d1dbe5;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
        padding: 0 20px;
    }

    .tools-btn {
        height: 40px;
        line-height: 40px;
    }

    .first-row .el-button:not(.el-input-group__append .el-button) {
        position: relative;
        /*top: 20px;*/
    }

    .tools-btn .el-button:not(.el-input-group__append .el-button) {
        margin-left: 0 !important;
    }

    .tree-btn-container {
        text-align: center;
        /*border-bottom: 1px solid #d1dbe5;*/
        padding: 10px;
    }

    .panel-box-header {
        span {
            margin-right: 10px;
        }

        .fa {
            margin-right: 5px;
            color: #409EFF;
            cursor: pointer;
        }
    }

    .header-line1 {
        margin: 9px 0;
        font-size: 24px;
        line-height: 50px;
        height: 30px;
    }

    .panel-box-header__tmg-name {
        color: #9D9D9D;
    }

    .panel-box-header__subject-name, .panel-box-header__grade-name {
        color: #aaa;
        font-size: 18px;
    }

    .fa {
        font-size: 18px;
    }

    .penel-box-content {
        margin-top: 20px;

        .title {
            font-size: 18px;
            border-left: 5px solid #409EFF;
            padding-left: 10px;
        }

        .outer-title {
            padding-bottom: 10px;
            /*border-bottom: 1px solid #d1dbe5;*/
            width: 200px;
        }

        .content {
            margin: 10px 0 0 0;
        }
    }

    .tree-container {
        padding: 5px 10px
    }

    .class-hr {
        border: 0;
        border-top: 1px solid #eee;
    }

    .content__section {
        margin: 20px 0;
    }
    .custom-tree-node {
        width: 100%;
    }
    .tree__tmg-name {
        display: inline-block;
        width: 87%;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
<style scoped>
    .is-current > .el-tree-node__content:nth-child(1) {
        background-color: #EEF1F6;
    }

    .org-tree input {
        border: 0px solid #fff;
        border-bottom: 1px solid #d1dbe5;
        border-radius: 4px 0px 0px 0px;
    }

    .org-tree .el-tree {
        border: 0px solid #fff;
    }

    .org-tree {
        border: 1px solid #d1dbe5;
        border-right: 0px solid #fff;
    }

    .org-panel .el-table__body-wrapper {
        overflow-x: auto !important; /*会将横行滚动条去掉，但如果有固定列的需求，请在代码里放开*/
    }

    .org-panel .address-list-bars {
        position: relative;
        top: 10px;
    }

</style>

