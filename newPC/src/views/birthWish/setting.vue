<template>
    <div class="app-container calendar-list-container" id="printApplyDetail">
        <back-tool>
            <el-button class="filter-item" type="primary" size="medium" @click="saveHandler()">保存</el-button>
        </back-tool>
        <div class="content-container">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="formData" :rules="rules" ref="ruleForm" label-width="140px" class="ruleForm">
                    <el-form-item>
                        <el-checkbox v-model="formData.remindTeacher" :true-label="1" :false-label="2">教师生日祝福</el-checkbox>
                    </el-form-item>
                    <template v-if="formData.remindTeacher === 1">
                        <el-form-item label="祝福语（男）" prop="maleTeacherGreetings">
                            <el-input type="textarea" :rows="4" :maxlength="100" v-model="formData.maleTeacherGreetings" @blur="formData.maleTeacherGreetings = formData.maleTeacherGreetings.trim()"></el-input>
                        </el-form-item>
                        <el-form-item label="祝福语（女）" prop="femaleTeacherGreetings">
                            <el-input type="textarea" :rows="4" :maxlength="100" v-model="formData.femaleTeacherGreetings" @blur="formData.femaleTeacherGreetings = formData.femaleTeacherGreetings.trim()"></el-input>
                        </el-form-item>
                    </template>
                    <el-form-item>
                        <el-checkbox v-model="formData.remindParent" :true-label="1" :false-label="2">学生生日祝福</el-checkbox>
                    </el-form-item>
                    <template v-if="formData.remindParent === 1">
                        <el-form-item label="祝福语（男）" prop="maleStuGreetings">
                            <el-input type="textarea" :rows="4" :maxlength="100" v-model="formData.maleStuGreetings" @blur="formData.maleStuGreetings = formData.maleStuGreetings.trim()"></el-input>
                        </el-form-item>
                        <el-form-item label="祝福语（女）" prop="femaleStuGreetings">
                            <el-input type="textarea" :rows="4" :maxlength="100" v-model="formData.femaleStuGreetings" @blur="formData.femaleStuGreetings = formData.femaleStuGreetings.trim()"></el-input>
                        </el-form-item>
                    </template>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import {getBySchoolId, insertOrUpdate} from '@/api/birthWish';
    import BackTool from "@/components/BackTool";

    export default {
        name: "setting",
        components: {BackTool},
        data() {
            return {
                formData: {
                    femaleStuGreetings: '',
                    maleStuGreetings: '',

                    femaleTeacherGreetings: '',
                    maleTeacherGreetings: '',
                    remindParent: 2,
                    remindTeacher: 2
                },
                rules: {
                    maleTeacherGreetings: [{
                        required: true, message: '请填写祝福语', trigger: 'blur'
                    }],
                    femaleTeacherGreetings: [{
                        required: true, message: '请填写祝福语', trigger: 'blur'
                    }],
                    maleStuGreetings: [{
                        required: true, message: '请填写祝福语', trigger: 'blur'
                    }],
                    femaleStuGreetings: [{
                        required: true, message: '请填写祝福语', trigger: 'blur'
                    }],
                }
            }
        },
        created() {
            getBySchoolId()
                .then(res => res.data)
                .then(data => {
                    if(data && data.data) {
                        this.formData = data.data;
                    }
                });
        },
        methods: {
            saveHandler() {
                this.$refs.ruleForm.validate(isValid => {
                    if(isValid) {
                        insertOrUpdate({
                            remindParent: this.formData.remindParent,
                            remindTeacher: this.formData.remindTeacher,
                            femaleStuGreetings: this.formData.remindParent === 1 ? this.formData.femaleStuGreetings : '',
                            maleStuGreetings: this.formData.remindParent === 1 ? this.formData.maleStuGreetings : '',
                            femaleTeacherGreetings: this.formData.remindTeacher === 1 ? this.formData.femaleTeacherGreetings : '',
                            maleTeacherGreetings: this.formData.remindTeacher === 1 ? this.formData.maleTeacherGreetings : '',
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('设置成功');
                                }
                            })
                    }
                })
            }
        }
    }
</script>

<style scoped>

</style>
