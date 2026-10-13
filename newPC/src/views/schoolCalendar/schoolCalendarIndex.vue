<template>
    <div class="page">
        <div class="header">
            <el-button type="primary" @click="jumpToPage('schoolCalendarAdd')">新增</el-button>
        </div>
        <div>
            <el-table
                    :data="dataList"
                    border
                    style="width: 100%"
                    :height="maxH"
            >
                <el-table-column
                        label="学年"
                        show-overflow-tooltip
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <router-link class="link-type" :to="{ path: 'schoolCalendarSet', query: { id: scope.row.id } }">
                            {{ scope.row.schoolYear }}学年
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column
                        label="第一学期"
                        align="center"
                        width="300px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.firstStartDate }}到{{ scope.row.firstEndDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="createUser"
                        label="第二学期"
                        align="center"
                        width="300px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <span>{{ scope.row.secondStartDate }}到{{ scope.row.secondEndDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="创建人"
                    align="center"
                    width="300px"
                    :resizable="false"
                    prop="createUser"
                >
                </el-table-column>
                <el-table-column
                        label="操作"
                        align="center"
                        width="300px"
                        :resizable="false"
                >
                    <template slot-scope="scope">
                        <el-button
                                size="small"
                                type="text"
                                @click="jumpToPage('schoolCalendarEdit', { id: scope.row.id })"
                        >编辑
                        </el-button>
                        <el-button
                                size="small"
                                type="text"
                                @click="deleteHandler(scope.row.id)"
                        >删除
                        </el-button>
                        <el-button
                                size="small"
                                type="text"
                                @click="jumpToPage('schoolCalendarSet', { id: scope.row.id })"
                        >设置
                        </el-button>
                        <el-button
                                size="small"
                                type="text"
                                @click="copyHandler(scope.row.id)"
                        >一键设置
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import windowResizeMixin from '@/mixins/windowResize';
    import { schoolCalendarList, resetSchoolDate, deleteSchoolCalendar } from '@/api/schoolCalendar';

    export default {
        data: function() {
            return {
                dataList: [],
                searchLoading: false,
            }
        },
        mixins: [windowResizeMixin],
        methods: {
            jumpToPage(path, query) {
                if (query === undefined || query === null) {
                    query = {}
                }
                this.$router.push({
                    path,
                    query
                })
            },
            deleteHandler(id) {
                this.$confirm('确定要删除选中的校历吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteSchoolCalendar({ id })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('删除成功');
                                schoolCalendarList()
                                    .then(res => res.data)
                                    .then(data => {
                                        if(data.result) {
                                            this.dataList = data.data;
                                        }
                                        else {
                                            this.$message.error('error');
                                        }
                                    })
                            } else {
                                this.$message.error('error');
                            }
                        })
                        .catch(() => {
                            this.$message.error('error');
                        });
                });
            },
            copyHandler(id) {
                this.$confirm('确定要一键设置选中的校历吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    resetSchoolDate({ id })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('设置成功')
                            } else {
                                this.$message.error('error');
                            }
                        })
                        .catch(() => {
                            this.$message.error('error');
                        });
                });

            }
        },
        created() {
            schoolCalendarList()
                .then(res => res.data)
                .then(data => {
                    if(data.result) {
                        this.dataList = data.data;
                    }
                    else {
                        this.$message.error('error');
                    }
                })
                .catch(() => {
                    this.$message.error('error');
                })
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }

    .header {
        margin-bottom: 10px;
    }
</style>
