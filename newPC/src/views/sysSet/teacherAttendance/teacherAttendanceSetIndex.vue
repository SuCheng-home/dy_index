<template>
    <div class="teacher_attendance_wrap">
        <back-tool :show-line="false">
            <el-button type="primary" size="medium" @click.native="addNewRule">新增</el-button>
            <el-button type="primary" size="medium" @click.native="addressMaintain">地点维护</el-button>
            <el-button type="primary" size="medium" @click.native="remindSet">推送设置</el-button>
        </back-tool>
        <div>
            <el-table ref="multipleTable" :data="attendanceRuleList" border stripe :height="nobottommaxH" style="width: 100%">
                <el-table-column label="规则名称" align="center" prop="ruleName" show-overflow-tooltip></el-table-column>
                <el-table-column label="考勤地点" align="center" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <template v-if="scope.row.addressList && scope.row.addressList.length">
                            <span :key="index" v-for="(item, index) in scope.row.addressList">
                                {{item.address}}
                            </span>
                        </template>
                        <template v-else>-</template>
                    </template>
                </el-table-column>
                <el-table-column label="签到时间" align="center" prop="signInDate" show-overflow-tooltip></el-table-column>
                <el-table-column label="签退时间" align="center" prop="signOutDate" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.signOutDate">{{scope.row.signOutDate}}</span>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="effectiveImmediately(scope.row.id)">立即生效</el-button>
                        <el-button  size="small" type="text" @click="deleteRule(scope.row.id)" class="buttontextred">删除</el-button>
                        <el-button  size="small" type="text" @click="editRule(scope.row.id)">编辑</el-button>
                        <el-button  size="small" type="text" @click="attendanceMember(scope.row.id)">考勤人员</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import mixins from '@/mixins/windowResize';
    import {queryAttendanceRuleBySchoolId, deleteAttendanceRule, rightEffectByRuleId} from '@/api/systemSet/teacherAttendanceSet';

    export default {
        name: "teacherAttendanceSetIndex",
        components: {
            BackTool
        },
        data() {
            return {
                attendanceRuleList: []
            }
        },
        created() {
            this.queryAttendanceRuleBySchoolId();
        },
        mixins:[mixins],
        methods: {
            queryAttendanceRuleBySchoolId() {
                queryAttendanceRuleBySchoolId().then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.attendanceRuleList = data.data;
                    }
                }).catch(() => {});
            },
            addNewRule() {
                this.$router.push({path: 'teacherAttendanceSetRuleAdd'});
            },
            addressMaintain() {
                this.$router.push({path: 'teacherAttendanceSetAddressList'});
            },
            remindSet() {
                this.$router.push({path: 'teacherAttendanceSetRemind'});
            },
            effectiveImmediately(ruleId) {
                rightEffectByRuleId(ruleId).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '操作成功'
                        });
                    }
                }).catch(() => {});
            },
            deleteRule(ruleId) {
                this.$confirm('是否删除该考勤规则？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteAttendanceRule(ruleId).then(res => {
                        const data = res.data;
                        if (data.code === 200) {
                            this.$message({
                                type: 'success',
                                message: '规则删除成功'
                            });
                            this.queryAttendanceRuleBySchoolId();
                        }
                    }).catch(() => {});
                }).catch(() => {
                });
            },
            editRule(ruleId) {
                this.$router.push({path: 'teacherAttendanceSetRuleAdd', query: {ruleId: ruleId}});
            },
            attendanceMember(ruleId) {
                this.$router.push({path: 'teacherAttendanceSetMemberList', query: {ruleId: ruleId}});
            }
        }
    }
</script>

<style lang="scss" scoped>
    .teacher_attendance_wrap{
        padding:12px;

    }
</style>
