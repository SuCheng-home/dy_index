<template>
    <div class="Intelligencecourseindex">
        <div class="top">
            <el-button type="primary" @click="Intelligencecourseadd()" size="medium">排课计划</el-button>
            <el-button type="primary" @click="Intelligencecoursedownload()" size="medium">下载客户端</el-button>
        </div>
        <div class="subject" v-loading="loading">
            <el-table :data="dataList" border :height="nobottommaxH">
                <el-table-column label="排课计划名称" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.Name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="课程执行方式" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.RecycleMode}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button @click="syncSchedules(scope.row.TSJWID)" type="text" size="small">执行课表</el-button>
                        <el-button @click="deleteSchedules(scope.row.TSJWID)" type="text" size="small" class="buttontextred">删除课表</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    //窗口大小调整
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';
    import {systemScheduleList, syncSchedule, deleteSchedule} from "@/api/Intelligencecourse";

    export default {
        data() {
            return {
                dataList: [],
                loading: true
            };
        },
        mixins: [mixin],
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        mounted() {
            this.systemScheduleLists();
        },
        methods: {
            //新建
            Intelligencecourseadd() {
                this.$router.push({
                    path: "Intelligencecourseadd"
                });
            },
            //下载客户端
            Intelligencecoursedownload() {
                this.$router.push({
                    path: "Intelligencecoursedownload"
                });
            },
            //获取详情
            systemScheduleLists() {
                let $this = this;
                systemScheduleList(this.schoolInfo.id).then(res => {
                    this.dataList = res.data.data;
                    this.loading = false;
                })
                    .catch(err => {
                        $this.loading = false;
                    });
            },
            //执行课表
            syncSchedules(id) {
                let $this = this;
                this.$confirm("确定要执行课表吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    $this.loading = true;
                    syncSchedule(id)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: "success",
                                    message: "执行课表成功!"
                                });
                                this.systemScheduleLists();
                                $this.loading = false;
                            }
                        })
                        .catch(err => {
                            $this.loading = false;
                        });
                })
                    .catch(() => {
                    });
            },
            //删除
            deleteSchedules(id) {
                this.$confirm("确定要删除课表吗？", "提示", {
                    type: "warning"
                }).then(() => {
                    deleteSchedule(id)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: "success",
                                    message: "删除课表成功!"
                                });
                                this.systemScheduleLists()
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
<style scoped>
    .Intelligencecourseindex {
        padding:12px;
    }

    .Intelligencecourseindex .top {
        padding-bottom: 10px;
    }
</style>
