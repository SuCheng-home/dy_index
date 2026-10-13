<template>
    <div class="stack-room-wrap">
        <div class="header">
            <el-row>
                <el-col :span="19">
                    <el-button
                        class="header-buttom"
                        size="medium"
                        type="default"
                        @click="$router.back()"
                    >返回
                    </el-button>
                    <el-button
                        class="header-buttom"
                        size="medium"
                        type="primary"
                        @click="jumpToPage('ruleadd')"
                    >添加
                    </el-button>
                </el-col>
            </el-row>
        </div>
        <el-table border stripe :data="dataList" borderNo :height="notbmaxH - 124" style="width: 100%" id="outTable">
            <el-table-column align="center" prop="typeName" label="限制方式" show-overflow-tooltip>
                 <template slot-scope="scope">
                   <span v-if="scope.row.limitType==1">时间方式</span>
                   <span v-if="scope.row.limitType==2">频率方式</span>
                   <span v-if="scope.row.limitType==3">调课方式</span>
                   <span v-if="scope.row.limitType==4">性别方式</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="限制内容" show-overflow-tooltip>
                <template slot-scope="scope">
                   <span v-if="scope.row.limitType==1">>={{scope.row.dayCount}}小时</span>
                   <span v-if="scope.row.limitType==2"> <={{scope.row.askCount}}次/月</span>
                   <span v-if="scope.row.limitType==3">限制调课</span>
                   <span v-if="scope.row.limitType==4">{{scope.row.sex==1?'男':'女'}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="leaveTypeNames" label="适用类型" show-overflow-tooltip>
            </el-table-column>
            <el-table-column align="center" label="操作" show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="jumpToPage('ruleadd', {id: scope.row.id})">编辑
                    </el-button>
                    <el-button size="small" type="text danger" @click="delThAskleaveFourRule(scope.row.id)"  class="buttontextred">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import moment from 'moment';
    import mixins from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
     import {getThAskleaveFourRuleList,delThAskleaveFourRule} from '@/api/systemSet/teacherLeave4Setting';
    export default {
        name: "bookReceiveList",
        mixins: [mixins, baseMixin],
        data() {
            return {
                dataList: []
            }
        },
        created() {
            this.getThAskleaveFourRuleList();
        },
        methods: {
            getThAskleaveFourRuleList() {
                getThAskleaveFourRuleList()
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    })
            },
            delThAskleaveFourRule(id) {
                this.$confirm('是否确定要删除该类型', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        delThAskleaveFourRule(id)
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('删除成功');
                                    this.getThAskleaveFourRuleList();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    });
            }
        }
    }
</script>

<style scoped>
    .stack-room-wrap {
        padding:12px;
    }

    .header {
        padding-bottom: 10px;
    }
</style>
