<template>
    <div class="newWorkPlanschool">
        <div class="top">
            <el-select class="filter-item" size="medium" v-model="query.schoolTimeId" placeholder="请选择学期"
                       @change="changeschoolTimeId()">
                <el-option v-for="item in SchoolTimeAllList" :key="item.id" :label="item.schoolTimeName"
                           :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" size="medium" v-if="myschoolTimeId==query.schoolTimeId"  
                       @click="newWorkPlanschooladd()">新增学校计划
            </el-button>
        </div>
        <div class="subject">
            <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%"
                      :height="`${nobottommaxH}px`">
                <el-table-column label="周次" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button size="medium" type="text" @click="newWorkPlanschooladd(scope.row.weekNo,scope.row.schoolTimeName)">
                            第{{scope.row.weekNo}}周
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.createTime">{{scope.row.createTime.slice(0,19)}}</span>
                        <span v-else>----</span>
                    </template>
                </el-table-column>
                <el-table-column label="发布时间" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.state==2">{{scope.row.releaseTime.slice(0,19)}}</span>
                        <span v-else>----</span>
                    </template>
                </el-table-column>
                <el-table-column label="状态" align="center">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="success" v-if="scope.row.state==2">已发布</el-tag>
                        <el-tag  size="mini" type="info" v-else>草稿</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center" width="120">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="newWorkPlanschooladd(scope.row.weekNo,scope.row.schoolTimeName)">编辑
                        </el-button>
                        <el-button size="small" type="text" :disabled="scope.row.state==2"
                                   @click="delWorkPlans(scope.row.id)" class="buttontextred">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

        </div>

    </div>
</template>
<script>
    import mixin from "@/mixins/windowResize";
    import {mapGetters} from 'vuex';
    import {getSchoolTimeAllList, getSchoolWorkPlanList, delWorkPlan} from "@/api/newWorkPlan";

    export default {
        data() {
            return {
                query: {
                    schoolTimeId: "",
                },
                myschoolTimeId: '',
                dataList: [],
                SchoolTimeAllList: []
            };
        },
        mixins: [mixin],
        computed: {
            ...mapGetters(['userInfo'])
        },
        mounted() {
            getSchoolTimeAllList()
                .then(res => {
                    this.SchoolTimeAllList = res.data.data;
                    for (let item of this.SchoolTimeAllList) {
                        if (item.isCurrent == 1) {
                            this.query.schoolTimeId = item.id;
                            this.myschoolTimeId = item.id;
                            this.getSchoolWorkPlanLists();
                        }
                    }
                })
                .catch(err => {
                });
        },
        methods: {
            changeschoolTimeId() {
                this.getSchoolWorkPlanLists();
            },
            getSchoolWorkPlanLists() {
                if (!this.query.schoolTimeId) {
                    return;
                }
                getSchoolWorkPlanList(this.query.schoolTimeId)
                    .then(res => {
                        let data = res.data.data;
                        this.dataList = data;
                    })
                    .catch(err => {
                    });
            },
            newWorkPlanschooladd(week,schoolTimeName) {
                if (week || week === 0) {
                    this.$router.push({
                        path: "newWorkPlanschooladd",
                        query: {
                            schoolTimeId: this.query.schoolTimeId,
                            week: week,
                            isfabu: this.query.schoolTimeId == this.myschoolTimeId,
                            schoolTimeName:schoolTimeName
                        }
                    });

                } else {
                    this.$router.push({
                        path: "newWorkPlanschooladd",
                        query: {schoolTimeId: this.query.schoolTimeId, isfabu: true}
                    });
                }
            },
            //删除
            delWorkPlans(id) {
                this.$confirm("确定要删除吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    delWorkPlan(id)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除成功!"
                                });
                                this.getSchoolWorkPlanLists();
                            }
                        })
                        .catch(err => {
                        });
                })
                    .catch(() => {
                    });
            }
        }
    };
</script>
<style lang="scss" scoped>
    .newWorkPlanschool {
        padding: 12px;

        .top {
            padding-bottom: 10px;
        }
    }
</style>
