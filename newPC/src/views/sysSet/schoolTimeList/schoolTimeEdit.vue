<template>
    <div class="page schoolTimeEdit">
        <back-tool>
            <el-button type="primary" size="medium" @click="confirmHandler" :loading="isLoading">确定</el-button>
        </back-tool>
        <div class="form-container" :style="`height: ${nobottommaxH}px;`">
            <div class="body">
                <el-form :model="formData" label-width="140px" :rules="rules" ref="form">
            
                <el-form-item label="学年" prop="schoolYearId">
                    <el-select v-model="formData.schoolYearId" placeholder="请选择学年" disabled>
                        <el-option
                                v-for="( yearEntry, index ) in schoolYearDataList"
                                :key="index"
                                :label="yearEntry.year"
                                :value="yearEntry.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学期" prop="term">
                    <el-select v-model="formData.term" placeholder="请选择学期" disabled>
                        <el-option :value="1" :label="1">
                        </el-option>
                        <el-option :value="2" :label="2">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学前周开始时间">
                    <el-date-picker
                            v-model="formData.beforeStartDate" :editable="false" 
                            type="date"
                            placeholder="请选择学前周开始时间">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="开学时间" prop="startDateStr">
                    <el-date-picker
                            v-model="formData.startDateStr" :editable="false" :clearable='false'
                            type="date"
                            placeholder="请选择开学日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="结束时间" prop="endDateStr">
                    <el-date-picker
                            v-model="formData.endDateStr" :editable="false" :clearable='false'
                            type="date"
                            placeholder="请选择结束日期">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="假期周结束时间">
                    <el-date-picker
                            v-model="formData.afterEndDate" :editable="false" 
                            type="date"
                            placeholder="请选择假期周结束时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>
             <div class="red">备注：学前周和假期周仅作为学期时间之外有工作安排时才需要设置，没有则不需设置</div>
         </div>            
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {schoolTimeDetails, getSchoolYear, updateSchoolTime} from '@/api/schoolTimeList';
    import windowResizeMixin from '@/mixins/windowResize';

    export default {
        data: function () {
            const startDateValidator = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    callback(new Error('开学时间不能为空'));
                }                
                callback();
            };
            const endDateValidator = (rule, value, callback) => {
                if (value === '' || value === undefined) {
                    callback(new Error('结束时间不能为空'));
                } else if (new Date(this.formData.startDateStr).valueOf() >= new Date(this.formData.endDateStr).valueOf()) {
                    callback(new Error('结束时间应大于开学时间！'));
                }
                callback();
            };
            return {
                formData: {
                    startDateStr: '',
                    endDateStr: '',
                    beforeStartDate:'',
                    endDate: '',
                    startDate: '',
                    afterEndDate:'',
                    schoolId: null,
                    id: this.$route.query,
                    isCurrent: 0,
                    schoolTimeName: null,
                    schoolYear: null,
                    schoolYearId: null,
                    term: null
                },
                schoolYearDataList: [],
                isLoading: false,
                rules: {
                    schoolYearId: [{
                        required: true,
                        message: '年份不能为空'
                    }],
                    term: [{
                        required: true,
                        message: '学期不能为空'
                    }],
                    startDateStr: [{
                        required: true,
                        validator: startDateValidator,
                        trigger: 'blur'
                    }],
                    endDateStr: [{
                        required: true,
                        validator: endDateValidator,
                        trigger: 'blur'
                    }]
                }
            }
        },
        mixins: [windowResizeMixin],
        created() {
            getSchoolYear()
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        this.schoolYearDataList = data.data;
                        if (data.data.length !== 0) {
                            this.formData.schoolYearId = data.data[0].id;
                            schoolTimeDetails(this.$route.query)
                                .then(res => res.data)
                                .then(data => {
                                    this.formData = Object.assign({}, this.formData, data.data);
                                    this.formData.startDateStr = new Date(data.data.startDate).toISOString();
                                    this.formData.endDateStr = new Date(data.data.endDate).toISOString();
                                    if(data.data.beforeStartDate){
                                      this.formData.beforeStartDate = new Date(data.data.beforeStartDate).toISOString();
                                    }
                                    if(data.data.afterEndDate){
                                      this.formData.afterEndDate = new Date(data.data.afterEndDate).toISOString();
                                    }                                    
                                })
                                .catch(() => {
                                    this.$message.error('error');
                                });
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
                if(this.formData.beforeStartDate&&(new Date(this.formData.beforeStartDate).valueOf() >= new Date(this.formData.startDateStr).valueOf())){
                     this.$message({ message: '开学时间应大于学前周开始时间！',type: 'error'});
                     return false;
                }
                 if(this.formData.afterEndDate&&(new Date(this.formData.endDateStr).valueOf() >= new Date(this.formData.afterEndDate).valueOf())){
                     this.$message({ message: '假期周结束时间应大于结束时间！',type: 'error'});
                     return false;
                }
                this.formData.schoolYear = this.schoolYearDataList.find(entry => entry.id === this.formData.schoolYearId).year;
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        this.isLoading = true;
                         if(this.formData.afterEndDate){
                            this.formData.afterEndDate=this.$moment(this.formData.afterEndDate).format('YYYY-MM-DD');
                        }else{
                            this.formData.afterEndDate='';
                        }
                        if(this.formData.beforeStartDate){
                             this.formData.beforeStartDate=this.$moment(this.formData.beforeStartDate).format('YYYY-MM-DD');
                        }else{
                            this.formData.beforeStartDate='';
                        }
                        this.formData.startDate = this.$moment(this.formData.startDateStr).format('YYYY-MM-DD');                        
                        this.formData.endDate=this.$moment(this.formData.endDateStr).format('YYYY-MM-DD');
                        updateSchoolTime(this.formData)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('编辑成功');
                                    setTimeout(() => {
                                        window.history.back();
                                    }, 500)
                                } else {
                                    this.$message.error(data.msg);
                                    this.isLoading = false;
                                }
                            })
                            .catch(() => {
                                // this.$message({
                                //     message: 'error',
                                //     type: 'error'
                                // });
                                this.isLoading = false;
                            })
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
    .page.schoolTimeEdit {
        padding:12px;   
        .red{
            text-align: center;
            color: #F56C6C;
            line-height: 60px;
        }     
        .form-container {
           padding-top: 20px;
           overflow: auto;
            .body{
                width: 810px;
                margin: 0 auto;
               .el-date-editor.el-input,.el-select {
                    width: 100%;
                }
            }
        }
    }

</style>
