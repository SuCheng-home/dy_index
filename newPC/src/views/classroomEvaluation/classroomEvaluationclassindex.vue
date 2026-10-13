<template>
    <div class="classroomEvaluationclassindex">
        <div class="header">
            <el-date-picker size="medium" :clearable="false" :editable="false" v-model.trim="checkDateStr" type="date"
                            @change="listByCheckDateStrs()" class="btnLeftLine" placeholder="请选择结束日期"></el-date-picker>
            <el-button type="primary" size="medium"   @click="oneKeyFullScores()">一键满分</el-button>
        </div>
        <div class="schoolWrap scrollStyle">
            <el-table :data="datalist" border stripe :height="nobottommaxH">

                <el-table-column align="center" label="班级">
                    <template slot-scope="scope">
                        {{scope.row.className}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="早自习" v-if="list.section1ModelList.length!=0">
                    <el-table-column :key="index" v-for="(item,index) in list.section1ModelList" align="center"
                                     :label="item.sectionNo+''">
                        <template slot-scope="scope">
                            <el-button
                                v-if="(scope.row.section1ModelList[index].scoreStr!='--')&&scope.row.section2ModelList[index].scoreStr"
                                @click.native.prevent="getScoreDetailByIds(scope.row.section1ModelList[index].id)"
                                type="text" size="small">{{scope.row.section1ModelList[index].scoreStr}}
                            </el-button>
                            <span v-else>{{scope.row.section1ModelList[index].scoreStr}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="上午" v-if="list.section2ModelList.length!=0">
                    <el-table-column :key="index" v-for="(item,index) in list.section2ModelList" align="center"
                                     :label="item.sectionNo+''">
                        <template slot-scope="scope">
                            <el-button
                                v-if="(scope.row.section2ModelList[index].scoreStr!='--')&&scope.row.section2ModelList[index].scoreStr"
                                @click.native.prevent="getScoreDetailByIds(scope.row.section2ModelList[index].id)"
                                type="text" size="small">{{scope.row.section2ModelList[index].scoreStr}}
                            </el-button>
                            <span v-else>{{scope.row.section2ModelList[index].scoreStr}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column align="center" label="下午" v-if="list.section4ModelList.length!=0">
                    <el-table-column :key="index" v-for="(item,index) in list.section4ModelList" align="center"
                                     :label="item.sectionNo+''">
                        <template slot-scope="scope">
                            <el-button
                                v-if="(scope.row.section4ModelList[index].scoreStr!='--')&&scope.row.section4ModelList[index].scoreStr"
                                @click.native.prevent="getScoreDetailByIds(scope.row.section4ModelList[index].id)"
                                type="text" size="small">{{scope.row.section4ModelList[index].scoreStr}}
                            </el-button>
                            <span v-else>{{scope.row.section4ModelList[index].scoreStr}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            </el-table>
            <el-dialog title="评分详情" :visible.sync="mydialogVisibles">
                <div class="content-box">
                    <div class="li"><span class="name">得分</span><span>{{dataobj.ratingTotalScore}}</span></div>
                    <div class="li"><span class="name">备注</span><span
                        v-if="dataobj.remark">{{dataobj.remark}}</span><span v-else>暂无</span></div>
                    <div class="li"><span class="name">学生</span><span
                        v-if="dataobj.stuNames">{{dataobj.stuNames}}</span><span v-else>暂无</span></div>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="mydialogVisibles = false">确 定</el-button>
            </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import moment from "moment";
    import {listByCheckDateStr, oneKeyFullScore, getScoreDetailById} from '@/api/classroomEvaluation';

    export default {
        data() {
            return {
                checkDateStr: '',
                datalist: [],
                list: {
                    section1ModelList: [],
                    section2ModelList: [],
                    section4ModelList: []
                },
                dataobj: {
                    ratingTotalScore: '',
                    remark: '',
                    stuNames: ''
                },
                mydialogVisibles: false
            }
        },
        created() {
            //学期列表
            this.checkDateStr = this.$moment().format('YYYY-MM-DD');
            this.listByCheckDateStrs()
        },
        mixins: [mixins, baseMixin],
        methods: {
            //弹框
            getScoreDetailByIds(id) {
                getScoreDetailById(id).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.dataobj = data.data
                        this.mydialogVisibles = true;
                    }
                })
            },
            //一键满分
            oneKeyFullScores() {
                let checkDateStr = this.$moment(this.checkDateStr).format("YYYY-MM-DD");
                this.$confirm('一键满分, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    oneKeyFullScore(checkDateStr).then(res => res.data).then(data => {
                        if (data.code === 200) {
                            this.$message({
                                message: "操作成功！",
                                type: "success"
                            });
                            this.listByCheckDateStrs()
                        }
                    })

                }).catch(() => {
                });
            },
            //获取列表
            listByCheckDateStrs() {
                this.datalist = [];
                let checkDateStr = this.$moment(this.checkDateStr).format("YYYY-MM-DD");
                listByCheckDateStr(checkDateStr).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.datalist = data.data.classSectionScoreList;
                        if (data.data.classSectionScoreList.length > 0) {
                            this.list = data.data.classSectionScoreList[0];
                        }
                    }
                })
            },

        }
    }
</script>
<style lang="scss" scoped>
    .classroomEvaluationclassindex {
        padding: 12px;
        box-sizing: border-box;
        font-size: 14px;

        * {
            box-sizing: border-box;
        }

        .li {
            padding: 10px 0;
            font-size: 14px;
            color: #888;
            position: relative;
            padding-left: 80px;

            .name {
                display: inline-block;
                width: 80px;
                line-height: 15px;
                text-align: right;
                padding-right: 10px;
                color: #666;
                font-weight: 600;
                position: absolute;
                left: 0;
                top: 11px;
            }
        }

        .el-date-editor.el-input, .el-date-editor.el-input__inner {
            width: 200px;
        }

        .el-select {
            width: 175px;
        }

        .red {
            color: #f56c6c;
        }

        .green {
            color: #67c23a;
        }

        .filter-item {
            width: 100px;
        }

        .header {
            padding-bottom: 10px;

        }

        .schoolWrap {
            overflow-x: hidden;
            overflow-y: auto;
            box-sizing: border-box;

            .title {
                line-height: 34px;
                height: 34px;

                .square {
                    display: inline-block;
                    width: 10px;
                    height: 10px;
                    background: #ACD6FF;
                    margin: 15px 8px 0 0;
                }
            }

            .text {
                padding-left: 18px;
                box-sizing: border-box;

                h3 {
                    font-size: 16px;
                }

            }
        }
    }
</style>

