<template>
    <div style="padding:10px">
        <div class="top">
            <el-select class="filter-item" size="medium" v-model="ListQuery.schoolTimeId" placeholder="请选择学期"
                       @change="changeschoolTimeId()">
                <el-option v-for="item in SchoolTimeAllList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" size="medium" @click="planAdd()">新建计划</el-button>
        </div>
        <div class="subject">
            <el-table stripe :data="dataList" border :height="nobottommaxH">
                <el-table-column label="工作计划时间范围" min-width="200">
                    <template slot-scope="scope">
                        <span>{{scope.row.startDate}}至{{scope.row.endDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="上报时间" min-width="200">
                    <template slot-scope="scope">
                        <span
                            v-if="(scope.row.updateTime)&&(scope.row.state!=1)">{{scope.row.updateTime | formatDate}}</span>
                        <span
                            v-if="(!scope.row.updateTime)&&(scope.row.state!=1)">{{scope.row.createTime | formatDate}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createUserName" label="上报人"></el-table-column>
                <el-table-column prop="departName" label="部门"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.state==1" type="danger">草稿</el-tag>
                        <el-tag  size="mini" v-if="scope.row.state==2" type="primary">已上报</el-tag>
                        <el-tag  size="mini" v-if="scope.row.state==3" type="success">已发布</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="small" v-if="scope.row.state==2||scope.row.state==3" type="text"
                                   @click="plandetails(scope.row.batchId)">查看
                        </el-button>
                        <el-button size="small" v-if="scope.row.state==1" type="text"
                                   @click="planedit(scope.row.batchId)">编辑
                        </el-button>
                        <el-button size="small" v-if="scope.row.state==1" type="text"
                                   @click="deleteWorkPlans(scope.row.batchId)">删除
                        </el-button>
                    </template>
                </el-table-column>

            </el-table>
        </div>
    </div>
</template>
<script>
    //窗口大小调整
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from "vuex";
    import {
        getSchoolTimeAllList,
        findWorkPlanList,
        deleteWorkPlan
    } from "@/api/workPlan";

    export default {
        data() {
            return {
                ListQuery: {
                    schoolTimeId: '',
                    state: 0,
                },
                dataList: [],
                SchoolTimeAllList: [],
            };
        },
        filters: {
            formatDate: function (value) {
                let date = new Date(value);
                let y = date.getFullYear();
                let MM = date.getMonth() + 1;
                MM = MM < 10 ? ('0' + MM) : MM;
                let d = date.getDate();
                d = d < 10 ? ('0' + d) : d;
                let h = date.getHours();
                h = h < 10 ? ('0' + h) : h;
                let m = date.getMinutes();
                m = m < 10 ? ('0' + m) : m;
                let s = date.getSeconds();
                s = s < 10 ? ('0' + s) : s;
                return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s;
            }
        },
        mixins: [mixin],
        mounted() {
            getSchoolTimeAllList()
                .then(res => {
                    this.SchoolTimeAllList = res.data.data;
                    for (let item of this.SchoolTimeAllList) {
                        if (item.isCurrent == 1) {
                            this.ListQuery.schoolTimeId = item.id;
                            this.findWorkPlanLists();
                        }
                    }
                })
                .catch(err => {
                });
        },
        methods: {
            //切换学期
            changeschoolTimeId() {
                this.findWorkPlanLists();
            },
            //获取列表
            findWorkPlanLists() {
                findWorkPlanList(this.ListQuery)
                    .then(res => {
                        this.dataList = res.data.data.dataList;
                    })
                    .catch(err => {
                    });
            },
            //新建计划
            planAdd() {
                this.$router.push({
                    path: "planAdd",
                });
            },

            //编辑
            planedit(id) {
                this.$router.push({
                    path: "planedit",
                    query: {
                        id: id
                    }
                });
            },
            //详情
            plandetails(id) {
                this.$router.push({
                    path: "plandetails",
                    query: {id: id}
                });
            },
            //删除
            deleteWorkPlans(id) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    deleteWorkPlan(id)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.findWorkPlanLists()
                            }
                        })
                        .catch(err => {
                        });
                }).catch(() => {
                });
            },

        }
    };
</script>
<style scoped>

    .select {
        margin-top: 10px;
        padding-left: 100px;
    }

    .subject {
        overflow: auto;
        margin-top: 10px;
    }

    .top .botton {
        width: 80%;
        margin: 0 auto;
        overflow: hidden;
    }

    .botton span {
        width: 33%;
        line-height: 34px;
        float: left;
        text-align: center;
        background: #fff;
        border: 1px solid #bfcbd9;
        cursor: pointer;
    }

    .botton .tabcolor {
        color: #fff;
        background-color: #20a0ff;
        border-color: #20a0ff;
        -webkit-box-shadow: -1px 0 0 0 #20a0ff;
        box-shadow: -1px 0 0 0 #20a0ff;
    }

    .tab-right {
        border-radius: 0 4px 4px 0;
    }

    .tab-left {
        border-radius: 4px 0 0 4px;
    }
</style>
