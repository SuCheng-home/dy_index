<template>
    <div class="page">
        <back-tool>
            <el-button  size="medium" type="primary" @click="saveClickHandler" :loading="isLoading">保存</el-button>
        </back-tool>
        <div class="form-container">
            <el-form
                    :model="formData"
                    label-width="140px"
                    :rules="rules"
                    ref="form"
            >
                <el-form-item label="类型名称" prop="name">
                    <el-input v-model.trim="formData.name" placeholder="类型名称(1-20个字符)"></el-input>
                </el-form-item>
                <el-form-item label="审批" prop="examine">
                    <span>
                        <el-tooltip :content="formData.isExamine === 1 ? '需要' : '不需要'" placement="top">
                            <el-switch @change="examineSwitchChangeHandler" v-model="formData.isExamine" :active-value="1"
                                       :inactive-value="0" on-text="是" off-text="否"></el-switch>
                        </el-tooltip>
                    </span>
                    <address-book
                            class="address-book"
                            v-show="formData.isExamine === 1"
                            v-model="formData.examineJson"
                            :config="addressBookConfig"
                    ></address-book>
                </el-form-item>
                <el-form-item v-show="formData.isExamine === 1" label="支持人" prop="appoint">
                    <span>
                        <el-tooltip :content="formData.isAppoint === 1 ? '需要' : '不需要'" placement="top">
                            <el-switch v-model="formData.isAppoint" :active-value="1" :inactive-value="0" on-text="是"
                                       off-text="否"></el-switch>
                        </el-tooltip>
                    </span>
                    <address-book
                            class="address-book"
                            v-show="formData.isAppoint === 1"
                            v-model="formData.appointerJson"
                            :config="addressBookConfig"
                    ></address-book>
                </el-form-item>
                <el-form-item v-show="formData.isExamine === 1 && formData.isAppoint === 1" label="">
                    <span>
                        <el-checkbox v-model="formData.isApplyAppoint" :true-label="1" :false-label="0">申请时选择支持人</el-checkbox>
                    </span>
                </el-form-item>
                <el-form-item label="开始提醒">
                    <el-select v-model="formData.remindTime" placeholder="" @change="remindTimeChangeHandler">
                        <el-option label="不提醒" value="-1"></el-option>
                        <el-option label="提前半小时" value="0"></el-option>
                        <el-option label="提前1小时" value="1"></el-option>
                        <el-option label="提前2小时" value="2"></el-option>
                        <el-option label="提前3小时" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="结束提醒">
                    <el-select v-model="formData.endRemindTime" placeholder="" @change="endRemindTimeChangeHandler">
                        <el-option label="不提醒" value="-1"></el-option>
                        <el-option label="提前5分钟" value="0"></el-option>
                        <el-option label="提前10分钟" value="1"></el-option>
                        <el-option label="提前15分钟" value="2"></el-option>
                        <el-option label="提前30分钟" value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="资源预约提前量">
                    <el-select class="ealytime-select" v-model="formData.earlyTime" placeholder="">
                        <el-option label="开始前" :value="0"></el-option>
                        <el-option label="10分钟" :value="1"></el-option>
                        <el-option label="15分钟" :value="2"></el-option>
                        <el-option label="30分钟" :value="3"></el-option>
                        <el-option label="1小时" :value="4"></el-option>
                        <el-option label="2小时" :value="5"></el-option>
                        <el-option label="3小时" :value="6"></el-option>
                        <el-option label="4小时" :value="7"></el-option>
                        <el-option label="8小时" :value="8"></el-option>
                        <el-option label="12小时" :value="9"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="序号">
                    <el-input-number v-model="formData.typeNo" :min="1" :max="100000"></el-input-number>
                </el-form-item>
                <el-form-item label="需要反馈">
                    <el-tooltip :content="formData.isFeedback === 1 ? '需要' : '不需要'" placement="top">
                        <el-switch v-model="formData.isFeedback" :active-value="1" :inactive-value="0" on-text="是"
                                   off-text="否"></el-switch>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {updateResourceType, getResourceTypeInfo} from '@/api/resourceOrder';

    export default {
        data: function () {
            const examineValidator = (rule, value, callback) => {
                if (this.formData.isExamine === 1 && this.formData.examineJson.userJson.length === 0) {
                    callback(new Error('请选择审批人'));
                } else {
                    callback();
                }
            };
            const appointValidator = (rule, value, callback) => {
                if (this.formData.isAppoint === 1 && this.formData.appointerJson.userJson.length === 0) {
                    callback(new Error('请选择支持人'));
                } else {
                    callback();
                }
            };
            return {
                isLoading: false,
                formData: {
                    examineJson: {},
                    appointerJson: {},
                    endRemindTime: '-1',
                    id: null,
                    isAppoint: 0,
                    isEndRemind: 0,
                    isExamine: 0,
                    isRemind: 0,
                    name: '',
                    remark: '',
                    remindTime: '-1',
                    typeNo: null,
                    resourceUserIds: '',
                    schoolId: 0,
                    earlyTime: 0,
                    isApplyAppoint: 0,
                    isFeedback: 0
                },
                addressBookConfig: {
                    title: '选择人员',
                    depart: {target: 'user', departType: 't', userTypes: '1'}
                },
                rules: {
                    name: [
                        {required: true, message: '请输入类型名称', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur'}
                    ],
                    examine: [{
                        validator: examineValidator
                    }],
                    appoint: [{
                        validator: appointValidator
                    }]
                },
            }
        },
        created() {
            this.formData.id = this.$route.query.typeId;
            const vm = this;
            getResourceTypeInfo({
                typeId: this.formData.id
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    this.formData = Object.assign({}, this.formData, pageData);
                    if (pageData.appointerJson !== '' && pageData.appointerJson !== null) {
                        this.formData.appointerJson = {
                            departJson: [],
                            userJson: JSON.parse(pageData.appointerJson),
                            groupJson: []
                        }
                    } else {
                        this.formData.appointerJson = {
                            departJson: [],
                            userJson: [],
                            groupJson: []
                        }
                    }
                    if (pageData.users !== null && pageData.users.length !== 0) {
                        this.formData.examineJson = {
                            departJson: [],
                            userJson: pageData.users,
                            groupJson: []
                        }
                    } else {
                        this.formData.examineJson = {
                            departJson: [],
                            userJson: [],
                            groupJson: []
                        }
                    }
                    this.formData.endRemindTime = pageData.endRemindTime === null || pageData.endRemindTime === '' ? '-1' : pageData.endRemindTime;
                    this.formData.remindTime = pageData.remindTime === null || pageData.remindTime === '' ? '-1' : pageData.remindTime;
                })
        },
        methods: {
            saveClickHandler() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        const vm = this;
                        const deriveObject = {};
                        if (this.formData.isExamine === 0) {
                            deriveObject.resourceUserIds = '';
                        } else {
                            deriveObject.resourceUserIds = this.formData.examineJson.userJson.map(item => item.id).join(',');
                        }
                        if (this.formData.isAppoint === 0) {
                            deriveObject.appointerJson = '';
                        } else {
                            deriveObject.appointerJson = JSON.stringify(this.formData.appointerJson.userJson);
                        }
                        if(this.formData.isAppoint === 0 || this.formData.isExamine === 0) {
                            deriveObject.isApplyAppoint = 0;
                        } else {
                            deriveObject.isApplyAppoint = this.formData.isApplyAppoint;
                        }
                        this.isLoading = true;
                        updateResourceType(Object.assign({}, this.formData, deriveObject))
                            .then(res => res.data)
                            .then(data => {
                                this.isLoading = false;
                                if (data.result) {
                                    this.$message({
                                        message: '资源类型修改成功',
                                        type: 'success'
                                    });
                                    setTimeout(() => {
                                        window.history.back();
                                    }, 500)
                                }
                            })
                            .catch(() => {
                                this.isLoading = false;
                                vm.$message.error('error');
                            })
                    }
                });
            },
            saveUserIds(value) {
                const regexp = /"id":(\d+),/g,
                    resultArr = [];
                let matchedArr = regexp.exec(value.userJson);
                while (matchedArr !== null) {
                    resultArr.push(matchedArr[1]);
                    matchedArr = regexp.exec(value.userJson);
                }
                this.formData.resourceUserIds = resultArr.join(',');
            },
            saveAppointerJson(value) {
                this.formData.appointerJson = value.userJson;
            },
            examineSwitchChangeHandler(value) {
                if (value === 0) {
                    this.formData.isAppoint = 0;
                }
            },
            remindTimeChangeHandler(value) {
                if (value === '') {
                    this.formData.isRemind = 0;
                } else {
                    this.formData.isRemind = 1;
                }
            },
            endRemindTimeChangeHandler(value) {
                if (value === '') {
                    this.formData.isEndRemind = 0;
                } else {
                    this.formData.isEndRemind = 1;
                }
            },
        },
        components: {
            BackTool,
            AddressBook
        }
    }
</script>

<style scoped>
   .page {
        padding:12px;
    }

    .form-container {
        width: 810px;
        margin: 10px auto;
    }

    .address-book {
        display: inline-block;
        width: 298px;
        box-sizing: border-box;
        vertical-align: top;
        margin-left: 10px;
    }

    .address-book {
        width: 615px;
    }
    .el-select{
        width: 100%;
    }
</style>
