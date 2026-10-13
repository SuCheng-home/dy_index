<template>
    <div class="attendance_remind_wrap">
        <back-tool>
            <el-button type="primary" size="medium" @click.native="saveNewRemind">保存</el-button>
        </back-tool>
        <div class="remind_box">
            <el-form label-width="140px">
                <el-form-item label="签到成功提醒自己" :required="true">
                    <el-switch v-model="isSendSet"></el-switch>
                </el-form-item>
                <el-form-item label="当日考勤统计推送" :required="true">
                    <el-switch v-model="pushAnalysisMsg"></el-switch>
                </el-form-item>
                <el-form-item label="仅考勤机签到" :required="true">
                    <el-switch v-model="attendanceMachine"></el-switch>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {getAttendanceSet, saveAttendanceSet} from '@/api/systemSet/teacherAttendanceSet';

    export default {
        name: "teacherAttendanceSetRemind",
        components: {
            BackTool
        },
        data() {
            return {
                isSendSet: false,
                pushAnalysisMsg: false,
                attendanceMachine: false
            }
        },
        created() {
            this.getAttendanceSet();
        },
        methods: {
            getAttendanceSet() {
                getAttendanceSet().then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.isSendSet = !!data.data.pushMsg;
                        this.pushAnalysisMsg = !!data.data.pushAnalysisMsg;
                        this.attendanceMachine = !!data.data.attendanceMachine;
                    }
                }).catch(() => {});
            },
            saveNewRemind() {
                saveAttendanceSet({
                    pushMsg: this.isSendSet ? 1 : 0,
                    pushAnalysisMsg: this.pushAnalysisMsg ? 1 : 0,
                    attendanceMachine: this.attendanceMachine ? 1 : 0,
                }).then(res => {
                    const data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                    }
                }).catch(() => {});
            }
        }
    }
</script>

<style lang="scss">
    .remind_box .el-form-item__label {
        font-weight: bold;
    }
</style>
<style lang="scss" scoped>
    .attendance_remind_wrap{
        padding:12px;
        .remind_box{
            width: 810px;
            margin: 30px auto;
        }
    }
</style>
