<template>
    <div class="peanutth">
        <div class="header">
            <el-row>
                <el-col :span="24" class="header-content">
                    <div class="header-left">
                        <el-select v-model="schoolName" placeholder="请选择学期" size="medium" @change="changeSchool">
                            <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                                :value="item.schoolTimeName">
                            </el-option>
                        </el-select>
                        <el-button type="primary" size="medium" @click="handleAdd()" :loading="loading">新增学生</el-button>
                    </div>
                    <div class="header-right">
                        <span class="total-count">共 {{ studentList.length }} 名学生</span>
                    </div>
                </el-col>
            </el-row>
        </div>
        <div class="doc_flow_table_box">
            <div v-if="loading" class="loading-container">
                <i class="el-icon-loading loading-icon"></i>
                <p>加载中...</p>
            </div>
            <default-page Mes="暂无学生数据" v-if="studentList.length === 0"></default-page>

            <div v-else class="student-list">
                <div class="student-card" v-for="(student, index) in studentList" :key="student.studentId || index"
                    @click="handleDetails(student)">
                    <div class="student-avatar">
                        <img v-if="student.studentLogo" :src="student.studentLogo" alt="学生头像">
                        <div v-else class="avatar-placeholder">
                            <i class="el-icon-user"></i>
                        </div>
                    </div>
                    <div class="student-name">{{ student.studentName }}</div>
                    <div class="student-star">
                        <i class="el-icon-star-on"></i>
                        <span>{{ student.conductCount }}</span>
                    </div>
                    <div class="student-actions">
                        <i class="el-icon-edit" @click.stop="handleEdit(student)"></i>
                        <i class="el-icon-delete" @click.stop="handleDelete(student)"></i>
                    </div>
                </div>
            </div>
        </div>

        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="550px" @close="handleDialogClose">
            <el-form ref="form" :model="form" :rules="rules" label-width="120px">
                <el-form-item label="学生姓名" prop="studentName">
                    <div v-if="isEditMode" class="student-info-display">
                        <img v-if="form.studentLogo" :src="form.studentLogo" alt="学生头像" class="student-avatar-small">
                        <div v-else class="avatar-placeholder-small">
                            <i class="el-icon-user"></i>
                        </div>
                        <span class="student-name-display">{{ form.studentName }}</span>
                    </div>
                    <address-book v-else v-model="stuAddressData" :config="stuConfigData" @input="confirmSelect"
                        :isSchoolManager="true"></address-book>
                </el-form-item>

                <el-form-item label="娃娃成长档案" prop="sbanTypeTitle">
                    <el-input type="textarea" v-model="form.sbanTypeTitle" placeholder="请输入娃娃成长档案" maxlength="50"
                        :rows="3"></el-input>
                </el-form-item>

                <el-form-item label="目标值" prop="goalNum">
                    <el-input-number v-model="form.goalNum" :min="0" :max="150" placeholder="请输入目标值"
                        :step="1"></el-input-number>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitForm" :loading="submitLoading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getSchoolTimeList } from '@/api/record';
import {
    getSchoolConductStarBabyList,
    addSchoolConductStarBaby,
    updateSchoolConductStarBaby,
    delSchoolConductStarBaby
} from '@/api/fiveStarKid';
import AddressBook from '@/components/AddressBook/indexExpand';
import DefaultPage from "@/components/DefaultPage";
export default {
    components: {
        AddressBook,
        DefaultPage
    },
    data() {
        var validateStudent = (rule, value, callback) => {
            if (this.isEditMode) {
                // 编辑模式下跳过验证，因为学生姓名是直接显示的
                callback();
            } else if (!this.stuAddressData.userJson.length) {
                callback(new Error('请选择学生！'));
            } else {
                callback();
            }
        };
        return {
            schoolYear: '',
            schoolName: '',
            schoolTimeCode: '',
            schoolYearList: [],
            studentList: [],
            dialogVisible: false,
            dialogTitle: '新增学生',
            isEditMode: false,
            submitLoading: false,
            defaultAvatar: '',
            loading: false,
            form: {
                goalNum: 0,
                studentId: null,
                sbanTypeTitle: ''
            },
            rules: {
                studentName: [
                    { required: true, validator: validateStudent, trigger: 'blur' }
                ],
                sbanTypeTitle: [
                    { required: true, message: '请输入娃娃成长档案', trigger: 'blur' }
                ],
                goalNum: [
                    { required: true, message: '请输入目标值', trigger: 'change' }
                ]
            },
            stuAddressData: {
                userJson: []
            },
            stuConfigData: {
                title: '请选择学生',
                SingleChose: true,
                depart: { target: 'user', departType: 's', userTypes: '2', notCheckSchool: true },
                group: false
            }
        }
    },
    created() {
        this.getSchoolTimeList();
    },
    methods: {
        handleDetails(student) {
            this.$router.push({
                path: 'fiveStarKidDetails',
                query: {
                    studentId: student.studentId,
                    schoolTimeId: this.schoolTimeCode,
                    goalNum: student.goalNum,
                    schoolYear: this.schoolYear
                }
            })
        },
        getStatistics() {
            this.loading = true;
            getSchoolConductStarBabyList({
                schoolTimeId: this.schoolTimeCode
            }).then(res => {
                const data = res.data;
                console.log(data, 'da');
                if (data.code === 200) {
                    this.studentList = data.data || [];
                }
            }).finally(() => {
                this.loading = false;
            })
        },
        getSchoolTimeList() {
            getSchoolTimeList().then(res => {
                const data = res.data.data;
                if (res.data.code === 200) {
                    this.schoolYearList = data;
                    data.forEach((item) => {
                        if (item.isCurrent === 1) {
                            this.schoolName = item.schoolTimeName;
                            this.schoolTimeCode = item.id;
                            this.schoolYear = item.schoolYear;
                        }
                    });
                    if (!this.schoolTimeCode) {
                        this.schoolTimeCode = this.schoolYearList[0].id
                    }
                    this.getStatistics()
                }
            }).catch();
        },
        changeSchool(val) {
            console.log(123, val);

            const self = this;
            this.schoolName = val;

            this.schoolYearList.forEach((item) => {
                if (item.schoolTimeName === val) {
                    self.schoolTimeCode = item.id;
                    self.schoolYear = item.schoolYear;
                }
            });
           
            
            this.getStatistics()
        },
        handleAdd() {
            this.isEditMode = false;
            this.dialogTitle = '新增学生';
            this.resetForm();
            this.dialogVisible = true;
        },
        handleEdit(student) {
            this.isEditMode = true;
            this.dialogTitle = '修改学生';

            this.form = {
                studentName: student.studentName,
                goalNum: student.goalNum,
                studentId: student.studentId,
                studentLogo: student.studentLogo,
                sbanTypeTitle: student.sbanTypeTitle || ''
            };
            this.dialogVisible = true;
        },
        handleDelete(student) {
            this.$confirm('确定要删除该学生吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                delSchoolConductStarBaby({
                    schoolTimeId: this.schoolTimeCode,
                    studentId: student.studentId
                }).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success('删除成功');
                        this.getStatistics();
                    }
                })
            }).catch(() => { });
        },
        submitForm() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.submitLoading = true;
                    const params = {
                        goalNum: this.form.goalNum,
                        studentId: this.isEditMode ? this.form.studentId : this.stuAddressData.userJson[0].id,
                        sbanTypeTitle: this.form.sbanTypeTitle
                    };

                    if (this.isEditMode) {
                        params.schoolTimeId = this.schoolTimeCode;
                        this.submitUpdate(params);
                    } else {
                        params.studentLogo = this.stuAddressData.userJson[0].logo || '';
                        params.studentName = this.stuAddressData.userJson[0].name;
                        params.studentNo = this.stuAddressData.userJson[0].userNo || '';
                        this.submitAdd(params);
                    }
                } else {
                    return false;
                }
            });
        },
        submitAdd(params) {
            addSchoolConductStarBaby(params).then(res => {
                this.submitLoading = false;
                if (res.data.code === 200) {
                    this.$message.success('新增成功');
                    this.dialogVisible = false;
                    this.stuAddressData.userJson = [];
                    this.getStatistics();
                }
                else {
                    this.$message.error(res.data.msg || '新增失败');
                }
            })
        },
        submitUpdate(params) {
            updateSchoolConductStarBaby(params).then(res => {
                this.submitLoading = false;
                if (res.data.code === 200) {
                    this.$message.success('修改成功');
                    this.dialogVisible = false;
                    this.stuAddressData.userJson = [];
                    this.getStatistics();
                } else {
                    this.$message.error(res.data.msg || '修改失败');
                }
            }).catch(() => {
                this.submitLoading = false;
                this.$message.error('修改失败');
            });
        },
        resetForm() {
            this.form = {
                studentName: '',
                goalNum: 0,
                studentId: null,
                studentLogo: '',
                sbanTypeTitle: ''
            };
            this.stuAddressData = {
                userJson: []
            };
            if (this.$refs.form) {
                this.$refs.form.clearValidate();
            }
        },
        handleDialogClose() {
            this.resetForm();
        }
    }
}
</script>

<style scoped lang="scss">
.peanutth {
    .header {
        padding: 20px 24px;
        background: #f8f9fa;
        border-bottom: 1px solid #e9ecef;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

        .header-content {
            display: flex;
            justify-content: space-between;
            align-items: center;

            .header-left {
                display: flex;
                gap: 12px;
                align-items: center;
            }

            .header-right {
                .total-count {
                    font-size: 14px;
                    color: #606266;
                    font-weight: 500;
                }
            }
        }
    }

    .student-info-display {
        width: 100%;
        height: 36px;
        line-height: 36px;
        padding: 0 12px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        background-color: #f5f7fa;
        color: #606266;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    .student-avatar-small {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        object-fit: cover;
    }

    .avatar-placeholder-small {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: #e4e7ed;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
            font-size: 12px;
            color: #909399;
        }
    }

    .student-name-display {
        flex: 1;
    }

    .doc_flow_table_box {
        padding: 40px 70px;
        min-height: 600px;

        .name_title {
            color: #409eff;
            cursor: pointer;
        }

        .loading-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 400px;
            gap: 16px;

            .loading-icon {
                font-size: 40px;
                color: #409eff;
                animation: rotate 1s linear infinite;
            }

            @keyframes rotate {
                from {
                    transform: rotate(0deg);
                }

                to {
                    transform: rotate(360deg);
                }
            }

            p {
                color: #606266;
                font-size: 14px;
            }
        }

        .empty-container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 400px;
            gap: 24px;
        }

        .student-list {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;

            .student-card {
                width: 180px;
                border: 1px solid #e4e7ed;
                border-radius: 8px;
                padding: 24px;
                text-align: center;
                transition: all 0.3s ease;
                position: relative;
                background: #fff;

                &:hover {
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                    border-color: #409eff;
                    transform: translateY(-2px);
                }

                .student-avatar {
                    width: 80px;
                    height: 80px;
                    margin: 0 auto 10px;

                    img {
                        width: 100%;
                        height: 100%;
                        object-fit: cover;
                        border-radius: 50%;
                    }

                    .avatar-placeholder {
                        width: 100%;
                        height: 100%;
                        border-radius: 50%;
                        background: #f5f7fa;
                        display: flex;
                        align-items: center;
                        justify-content: center;

                        i {
                            font-size: 40px;
                            color: #c0c4cc;
                        }
                    }
                }

                .student-name {
                    font-size: 14px;
                    color: #333;
                    margin-bottom: 10px;
                    height: 20px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .student-star {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin-bottom: 10px;

                    i {
                        color: #f7ba2a;
                        font-size: 30px;
                        margin-right: 5px;
                    }

                    span {
                        font-size: 18px;
                        color: #333;
                        font-weight: bold;
                    }
                }

                .student-actions {
                    position: absolute;
                    top: 5px;
                    right: 5px;
                    display: flex;
                    gap: 3px;
                    opacity: 0;
                    transition: opacity 0.3s;

                    i {
                        width: 24px;
                        height: 24px;
                        line-height: 24px;
                        text-align: center;
                        border-radius: 4px;
                        cursor: pointer;
                        transition: all 0.3s;

                        &.el-icon-edit {
                            // background: #409eff;
                            color: #409eff;
                        }

                        &.el-icon-delete {
                            // background: #f56c6c;
                            color: #f56c6c;
                        }

                        &:hover {
                            opacity: 0.8;
                        }
                    }
                }

                &:hover .student-actions {
                    opacity: 1;
                }
            }
        }
    }
}

/deep/ .el-dialog__body {
    padding-right: 70px;
}

/deep/ .el-input-number {
    width: 100%;
}
</style>
