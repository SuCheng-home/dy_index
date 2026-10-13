<template>
    <div class="page">
        <back-tool>
            <el-button type="primary" @click="confirmHandler" :disabled="isButtonDisabled" :loading="isLoading">确定
            </el-button>
        </back-tool>
        <div class="form-container">
            <el-form
                    :model="formData"
                    label-width="150px"
                    :rules="rules"
                    ref="form"
            >
                <el-form-item label="年份" prop="schoolYearId">
                    <el-select v-model="formData.schoolYearId" placeholder="请选择年份">
                        <el-option
                                v-for="( yearEntry, index ) in schoolYears"
                                :key="index"
                                :label="yearEntry.year"
                                :value="yearEntry.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="第一学期" prop="firstDate">
                    <el-form-item class="form-item--inline" label="开学时间" prop="firstStartDateStr">
                        <el-date-picker
                                v-model="formData.firstStartDateStr"
                                type="date"
                                placeholder="请选择开学日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="form-item--inline" label="结束时间" prop="firstEndDateStr">
                        <el-date-picker
                                v-model="formData.firstEndDateStr"
                                type="date"
                                placeholder="请选择结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="第二学期" prop="secondDate">
                    <el-form-item class="form-item--inline" label="开学时间" prop="secondStartDateStr">
                        <el-date-picker
                                v-model="formData.secondStartDateStr"
                                type="date"
                                placeholder="请选择开学日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="form-item--inline" label="结束时间" prop="secondEndDateStr">
                        <el-date-picker
                                v-model="formData.secondEndDateStr"
                                type="date"
                                placeholder="请选择结束日期">
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {insertSchoolCalendar, getSchoolYear} from '@/api/schoolCalendar';

    export default {
        data: function () {
            const firstStartDateValidator = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    callback('开学时间不能为空')
                } else {
                    this.$refs.form.validateField('firstEndDateStr');
                }
                callback();
            };
            const firstEndDateValidator = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    callback('结束时间不能为空')
                }
                if (new Date(this.formData.firstStartDateStr).valueOf() >= new Date(this.formData.firstEndDateStr).valueOf()) {
                    callback(new Error('结束日期应大于开始日期'));
                } else {
                    this.$refs.form.validateField('secondStartDateStr');
                }
                callback();
            };
            const secondStartDateValidator = (rule, value, callback) => {
                if (this.formData.firstStartDateStr !== '' && this.formData.firstEndDateStr !== '') {
                    if (new Date(this.formData.firstEndDateStr).valueOf() >= new Date(this.formData.secondStartDateStr).valueOf()) {
                        callback(new Error('第二学期的开始日期应大于第一学期的结束日期'));
                    }
                }
                if (value === '' || value === undefined) {
                    callback('开学时间不能为空')
                } else {
                    this.$refs.form.validateField('secondEndDateStr');
                }
                callback();
            };
            const secondEndDateValidator = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    callback('结束时间不能为空')
                }
                if (new Date(this.formData.secondStartDateStr).valueOf() >= new Date(this.formData.secondEndDateStr).valueOf()) {
                    callback(new Error('结束日期应大于开始日期'));
                }
                callback();
            };
            return {
                formData: {
                    schoolYear: '',
                    schoolYearId: null,
                    firstStartDate: '',
                    firstEndDate: '',
                    secondStartDate: '',
                    secondEndDate: '',
                    firstStartDateStr: '',
                    firstEndDateStr: '',
                    secondStartDateStr: '',
                    secondEndDateStr: '',
                    firstDateArr: [],
                    secondDateArr: []
                },
                schoolYears: [],
                isLoading: false,
                isButtonDisabled: false,
                rules: {
                    schoolYearId: {
                        required: true
                    },
                    firstStartDateStr: {
                        required: true,
                        validator: firstStartDateValidator,
                        trigger: 'blur'
                    },
                    firstEndDateStr: {
                        required: true,
                        validator: firstEndDateValidator,
                        trigger: 'blur'
                    },
                    secondStartDateStr: {
                        required: true,
                        validator: secondStartDateValidator,
                        trigger: 'blur'
                    },
                    secondEndDateStr: {
                        required: true,
                        validator: secondEndDateValidator,
                        trigger: 'blur'
                    }
                }
            }
        },
        created() {
            getSchoolYear()
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        this.schoolYears = data.data;
                        if (this.schoolYears.length !== 0) {
                            this.formData.schoolYearId = this.schoolYears[0].id;
                        }
                    } else {
                        this.$message.error('error');
                    }
                })
                .catch(() => {
                    this.$message.error('error');
                });
        },
        methods: {
            confirmHandler() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                        this.isButtonDisabled = true;
                        const firstStartDate = new Date(this.formData.firstStartDateStr).toLocaleString().replace(/\//g, '-'),
                            firstEndDate = new Date(this.formData.firstEndDateStr).toLocaleString().replace(/\//g, '-'),
                            secondStartDate = new Date(this.formData.secondStartDateStr).toLocaleString().replace(/\//g, '-'),
                            secondEndDate = new Date(this.formData.secondEndDateStr).toLocaleString().replace(/\//g, '-');

                        [
                            this.formData.firstStartDate,
                            this.formData.firstEndDate,
                            this.formData.secondStartDate,
                            this.formData.secondEndDate
                        ] = [
                            firstStartDate.slice(0, firstStartDate.indexOf(' ')),
                            firstEndDate.slice(0, firstEndDate.indexOf(' ')),
                            secondStartDate.slice(0, secondStartDate.indexOf(' ')),
                            secondEndDate.slice(0, secondEndDate.indexOf(' '))
                        ];
                        this.formData.schoolYear = this.schoolYears.find(yearEntry => yearEntry.id === this.formData.schoolYearId).year;
                        insertSchoolCalendar(this.formData)
                            .then(res => res.data)
                            .then(data => {
                                if (data.data.resultCode === 200) {
                                    this.$message.success('添加学期成功');
                                    window.history.back();
                                } else {
                                    this.$message.error(data.data.resultMsg);
                                    this.isLoading = false;
                                    this.isButtonDisabled = false;
                                }
                            })
                            .catch(() => {
                                this.$message.error('error');
                                this.isLoading = false;
                                this.isButtonDisabled = false;
                            });
                    } else {
                        return false;
                    }
                });
            }
        },
        components: {
            BackTool
        }
    }
</script>

<style lang="scss">
    .page {
        padding:12px;
    }

    .form-container {
        width: 80%;
        padding-top: 20px;
    }

    .form-item--inline {
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;
        .el-form-item__label, .el-form-item__content {
            width: auto !important;
            display: inline-block;
            text-align: left;
        }
        .el-form-item__content {
            margin-left: 0 !important;
        }
    }

</style>