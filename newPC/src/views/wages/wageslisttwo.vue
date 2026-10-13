<template>
    <div class="wageslisttwo">
        <div class="wageslisttwo-top">
            <el-col :span="19">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-button type="primary" size="medium" @click="sendBatchPayrolls()">发布</el-button>
                <el-button type="primary" size="medium" @click="wageslisttwoadd()">补录</el-button>
                <el-select v-model="num" size="medium" @change="handleInputChange()">
                    <el-option label="全部阅读状态" value="2"></el-option>
                    <el-option label="未读" value="0"></el-option>
                    <el-option label="已读" value="1"></el-option>
                </el-select>
            </el-col>
            <el-col :span="5">
                <el-input size="medium" placeholder="输入姓名搜索" v-model.trim="name"
                          @keyup.enter.native="handleInputChange()">
                    <el-button slot="append" icon="el-icon-search" @click="handleInputChange()"></el-button>
                </el-input>
            </el-col>
        </div>
        <div class="subject">
            <el-table :data="dataList" border :height="nobottommaxH">
                <el-table-column label="头像" align="center" width="100">
                    <template slot-scope="scope"><img :src="scope.row.userVatar" class="img" alt=""></template>
                </el-table-column>
                <el-table-column label="姓名" align="center">
                    <template slot-scope="scope">
                        <span class="link-type" @click="wageslisttwodetails(scope.row.id)">{{scope.row.userName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="身份证" show-overflow-tooltip>
                    <template slot-scope="scope">{{scope.row.userIdNumber|hideInfo}}</template>
                </el-table-column>
                <el-table-column label="状态" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.readStatus==1"  type="gray">已读</el-tag>
                        <el-tag  size="mini" v-if="scope.row.readStatus==0"  type="danger">未读</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="回执" align="center" width="100">
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.confirmStatus==1"  type="gray">已确认</el-tag>
                        <el-tag  size="mini" v-if="scope.row.confirmStatus==0"  type="danger">未确认</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="sendUserPayrolls(scope.row.id)">发布</el-button>
                        <el-button type="text" size="small" @click="wageslisttwoeidt(scope.row.id)">编辑</el-button>
                        <el-button @click="deletePayrolls(scope.row.id)" type="text" size="small" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    import mixin from '@/mixins/windowResize';
    import {payrollBatchDetails, deletePayroll, sendBatchPayroll, sendUserPayroll} from "@/api/wages";

    export default {
        name: 'wagesindex',
        data() {
            return {
                mylist: [],
                dataList: [],
                tablist: [],
                batchId: this.$route.query.batchId,
                name: '',
                num: '2',
            }
        },
        mixins: [mixin],
        //过滤器
        filters: {
            hideInfo(val) {
                let str = [null, undefined, ""];
                if (!str.includes(val) && val.length > 9) {
                    let valLen = val.length;
                    const numt = 1;
                    const num = 2;
                    let numf = 2;
                    if (valLen > 26) {
                        numf = numf * 2;
                    }
                    if (valLen % 2 == 0) {
                        return val.substring(0, valLen / num - numf) + "******" + val.substring((valLen / num) + numf);
                    } else {
                        valLen += numt;
                        return val.substring(0, (valLen / num) - numf - numt) + "******" + val.substring((valLen / num) + numf - numt);
                    }
                } else {
                    return val;
                }
            },
        },
        created() {
            this.payrollBatchDetailss();
        },
        methods: {
            //搜索
            handleInputChange() {
                this.dataList = [];
                if (this.num == 2) {
                    for (let i = 0; i < this.mylist.length; i++) {
                        if (this.mylist[i].userName.indexOf(this.name) != -1) {
                            this.dataList.push(this.mylist[i])
                        }
                    }
                } else {
                    for (let i = 0; i < this.mylist.length; i++) {
                        if ((this.mylist[i].userName.indexOf(this.name) != -1) && (this.mylist[i].readStatus == this.num)) {
                            this.dataList.push(this.mylist[i])
                        }
                    }
                }

            },
            //获取列表
            payrollBatchDetailss() {
                payrollBatchDetails(this.batchId)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.payrollList;
                        this.mylist = data.data.payrollList
                    })
            },
            //删除
            deletePayrolls(id) {
                this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deletePayroll(id).then(res => res.data).then(data => {
                        if (data.result) {
                            this.$message({type: 'success', message: '删除成功!'});
                            this.payrollBatchDetailss();
                        }
                    })
                });
            },
            //发布
            sendBatchPayrolls() {
                this.$confirm('是否发布全部', '发布', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sendBatchPayroll(this.batchId).then(res => res.data).then(data => {
                        if (data.result) {
                            this.$message({type: 'success', message: '发布成功!'});
                        }
                    })
                });
            },
            //个人发布
            sendUserPayrolls(id) {
                this.$confirm('是否发布', '发布', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    sendUserPayroll(id).then(res => res.data).then(data => {
                        if (data.result) {
                            this.$message({type: 'success', message: '发布成功!'});
                            this.payrollBatchDetailss();
                        }
                    })
                });
            },

            //补录
            wageslisttwoadd() {
                this.$router.push({
                    path: "wageslisttwoadd",
                    query: {batchId: this.batchId}
                });
            },
            //编辑
            wageslisttwoeidt(payrollId) {
                this.$router.push({
                    path: "wageslisttwoeidt",
                    query: {payrollId: payrollId}
                });
            },
            //详情
            wageslisttwodetails(payrollId) {
                this.$router.push({
                    path: "wageslisttwodetails",
                    query: {payrollId: payrollId}
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .wageslisttwo {
        padding:12px;

        .wageslisttwo-top {
            padding-bottom: 10px;
            overflow: hidden;
        }

        .img {
            width: 30px;
            height: 30px;
        }
    }
</style>
