<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="evTeaAddEdit">
        <backtool>
            <template v-if="state == 2">
                <el-button type="primary" size="medium" @click="submitHandler(2)">保存
                </el-button>
            </template>
            <template v-else>
                <el-button type="primary" size="medium" @click="submitHandler(1)">保存
                </el-button>
                <el-button type="primary" size="medium" @click="submitHandler(2)">发布
                </el-button>
            </template>
        </backtool>
        <div :class="['page-main']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="160px" class="demo-ruleForm">
                    <el-form-item label="主题" prop="batchTitle">
                        <el-input v-model="ruleForm.batchTitle" placeholder="请输入主题" :maxlength="40"></el-input>
                    </el-form-item>
                    <el-form-item label="发布范围" prop="stuScope">
                        <div v-if="state != 2">
                            <div style="margin-bottom: 10px;">
                                <el-select v-model="ruleForm.stuScope" multiple style="width: 500px;">
                                    <el-option v-for="classItem in classList" :value="classItem.id"
                                               :label="classItem.name"></el-option>
                                </el-select>
                            </div>
                            <el-button type="primary" size="medium" @click="checkAll">全选
                            </el-button>
                        </div>
                        <div v-else>
                            <span v-for="scopeItem in stuScopeText">{{scopeItem }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        </div>
                    </el-form-item>
                    <el-form-item label="评教类型" prop="voteClassHeader">
                        <el-checkbox-group :disabled="isEdit" v-model="ruleForm.evaType" :min="1">
                            <el-checkbox :label="1">
                                主班
                            </el-checkbox>
                            <el-checkbox :label="2">
                                副班
                            </el-checkbox>
                            <el-checkbox :label="3">
                                班级
                            </el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item label="请选择主班/副班模板" prop="moban" v-if="ruleForm.evaType.includes(1) || ruleForm.evaType.includes(2)">
                        <div class="add-btn-container" @click="showTemplate()" v-if="state != 2">
                            <i class="el-icon-circle-plus-outline add-btn" title="添加"></i><span
                            style="margin-left: 8px;">添加</span>
                        </div>
                        <div class="template-list">
                            <div class="template-item" v-for="(templateItem, index) in ruleForm.tempJson">
                                <el-tooltip class="item" effect="dark" :content="templateItem.tempTitle"
                                            placement="top">
                                    <span>{{templateItem.tempTitle}}</span>
                                </el-tooltip>
                                <i class="fa fa-trash" @click="deleteTemplate(index)" v-if="state != 2"></i>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="请选择班级模板" prop="banjimoban" v-if="ruleForm.evaType.includes(3)">
                        <div class="add-btn-container" @click="showTemplate(true)" v-if="state != 2">
                            <i class="el-icon-circle-plus-outline add-btn" title="添加"></i><span
                            style="margin-left: 8px;">添加</span>
                        </div>
                        <div class="template-list">
                            <div class="template-item" v-for="(templateItem, index) in ruleForm.tempClassJson">
                                <el-tooltip class="item" effect="dark" :content="templateItem.tempTitle"
                                            placement="top">
                                    <span>{{templateItem.tempTitle}}</span>
                                </el-tooltip>
                                <i class="fa fa-trash" @click="deleteTemplate(index, true)" v-if="state != 2"></i>
                            </div>
                        </div>
                    </el-form-item>

                    <el-form-item label="截止日期" prop="deadline">
                        <el-date-picker
                            v-model="ruleForm.deadline"
                            type="datetime"
                            format="yyyy-MM-dd HH:mm"
                            value-format="yyyy-MM-dd HH:mm">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="new-editor" label="描述" prop="batchDesc">
                        <br/>
                        <ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor new-editor"
                                 ref="ueditor" :defaultMes="ruleForm.batchDesc"
                                 @editModel="richTextEditHandler">
                        </ueditor>
                    </el-form-item>
                    <el-form-item label="附件">
                        <uploader pathPrefix="pingjiaopingxueyoueryuan" module="pingjiaopingxueyoueryuan"
                                  moduleCode="2022112101" :multiple="true"
                                  :extList="['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'jpg', 'jpeg', 'bmp', 'png', 'gif']"
                                  v-model="files"></uploader>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <el-dialog title="选择模板" :visible.sync="isDialogShow" width="1200px">
            <div>
                <div class="temp-list">
                    <div class="temp-item-container" v-for="tempItem in templateList">
                        <div class="temp-item" @click="addTemplate(tempItem)">
                            <div class="temp-item__title">
                                <i :class="['icon', ['',  'icon--normal',  'icon--ques',  'icon--opt'][tempItem.tempType]] "></i>
                                <span>{{tempItem.tempTitle}}</span>
                            </div>
                            <div class="temp-item__intro">{{tempItem.tempDesc}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import Uploader from '@/components/Uploader/WebUploader';
    import mixin from '@/mixins/windowResize';
    import moment from 'moment';
    import {
        queryDepartListTerm,
    } from '@/api/common/common';
    import {
        getEvaluateTwTempList,
        getEvaluateTwBatch,
        addEvaluateTwBatch,
        updateEvaluateTwBatch
    } from '@/api/evTeaKinder';
    import Ueditor from '@/components/Ueditor';

    import {mapGetters} from 'vuex';

    export default {
        components: {
            Backtool,
            Uploader,
            Ueditor
        },
        computed: {
            ...mapGetters(['userInfo']),
            templateList() {
                return this.tempList.filter(item => {
                    return this.ruleForm.tempClassJson.findIndex(subItem => subItem.id == item.id) == -1 &&
                        this.ruleForm.tempJson.findIndex(subItem => subItem.id == item.id) == -1
                })
            }
        },
        data() {
            const timingValidator = (rule, value, callback) => {
                if (this.ruleForm.timing && !this.ruleForm.timingTime) {
                    return callback(new Error('请输入定时发送日期！'));
                } else {
                    callback();
                }
            };
            const stuScopeValidator = (rule, value, callback) => {
                if (this.ruleForm.stuScope.length === 0) {
                    return callback(new Error('请选择发布范围！'));
                } else {
                    callback();
                }
            };
            const mobanValidator = (rule, value, callback) => {
                if (this.ruleForm.evaType.includes(1) || this.ruleForm.evaType.includes(2)) {
                    if (this.ruleForm.tempJson.length === 0) {
                        return callback(new Error('请选择模板！'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }

            };
            const banjimobanValidator = (rule, value, callback) => {
                if (this.ruleForm.evaType.includes(3)) {
                    if (this.ruleForm.tempClassJson.length === 0) {
                        return callback(new Error('请选择模板！'));
                    } else {
                        callback();
                    }
                }

            };
            return {
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,
                classList: [],
                files: [],
                searchTitle: '',
                pickerOptions: {
                    disabledDate(date) {
                        const diffRes = moment(date).diff(moment(), 'days');
                        return diffRes > 6 || diffRes < 0;
                    }
                },
                ruleForm: {
                    evaType: [1],
                    batchTitle: '',
                    deadline: '',
                    timingTime: '',
                    timing: 1,
                    stuScope: [],
                    honorTypeList: [],
                    batchDesc: '',
                    tempJson: [],
                    tempClassJson: []
                },
                rules: {
                    batchTitle: [
                        {required: true, message: "请输入评教评学主题！", trigger: "blur"},
                    ],
                    deadline: [{
                        required: true, message: "请输入截止日期！"
                    }],
                    reportDuration: [{
                        required: true
                    }],
                    stuScope: [{
                        required: true, validator: stuScopeValidator, trigger: 'blur'
                    }],
                    moban: [{
                        required: true, validator: mobanValidator, trigger: 'blur'
                    }],
                    banjimoban: [{
                        required: true, validator: banjimobanValidator, trigger: 'blur'
                    }],
                    timing: [
                        {required: true, validator: timingValidator, trigger: 'blur'},
                    ],
                    batchDesc: [{
                        required: true, message: "请输入介绍！", trigger: 'blur'
                    }]
                },
                isDialogShow: false,
                tempList: [],
                isAddEditClassTemp: false,
                state: 0
            };
        },
        mixins: [mixin],
        mounted() {
            this.getEvaluateTwTempListFunc();
            queryDepartListTerm({
                all: true,
                currentTerm: true,
                notlimit: true
            })
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;
                    let classList = [];
                    pageData.forEach(item => {
                        classList = [...classList, ...item.childList];
                    });
                    this.classList = classList;
                });
            if (this.isEdit) {
                getEvaluateTwBatch({
                    batchId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.files = JSON.parse(pageData.fileListJson);
                        pageData.tempJson = JSON.parse(pageData.tempJson);
                        pageData.tempClassJson = JSON.parse(pageData.tempClassJson);
                        this.stuScopeText = JSON.parse(pageData.stuScope).map(item => item.className);
                        pageData.stuScope = JSON.parse(pageData.stuScope).map(item => item.classId);
                        const evaType = [];
                        if(pageData.voteClassHeader == 3) {
                            evaType.push(1, 2)
                        } else if(pageData.voteClassHeader != -1) {
                            evaType.push(pageData.voteClassHeader)
                        }
                        if(pageData.voteClass == 2) {
                            evaType.push(3);
                        }
                        pageData.evaType = evaType;
                        this.state = pageData.state;
                        this.ruleForm = pageData;
                    })
            }

        },
        methods: {
            onevaTypeChange() {
                if (!this.ruleForm.evaType.includes(1) && !this.ruleForm.evaType.includes(2)) {
                    this.ruleForm.tempJson = [];
                }
                if (!this.ruleForm.evaType.includes(3)) {
                    this.ruleForm.tempClassJson = [];
                }
            },
            checkAll() {
                const stuScope = [];
                this.classList.forEach(item => {
                    stuScope.push(item.id);
                });
                this.ruleForm.stuScope = stuScope;
            },
            getEvaluateTwTempListFunc() {
                getEvaluateTwTempList()
                    .then(res => res.data)
                    .then(data => {
                        this.tempList = data.data;
                    })
            },
            addTemplate(templateItem) {
                const args = {
                    id: templateItem.id,
                    tempDesc: templateItem.tempDesc,
                    tempTitle: templateItem.tempTitle,
                    tempType: templateItem.tempType
                }
                if (this.isAddEditClassTemp) {
                    this.ruleForm.tempClassJson.push(args);
                } else {
                    this.ruleForm.tempJson.push(args);
                }
                this.isDialogShow = false;
            },
            deleteTemplate(index, isClass = false) {
                if (isClass) {
                    this.ruleForm.tempClassJson.splice(index, 1);
                } else {
                    this.ruleForm.tempJson.splice(index, 1);
                }
            },
            richTextEditHandler(batchDesc) {
                this.ruleForm.batchDesc = batchDesc;
            },
            submitHandler(state) {
                this.$refs.ruleForm.validate(isValid => {
                    if (isValid) {
                        const args = {
                            batchDesc: this.ruleForm.batchDesc,
                            batchTitle: this.ruleForm.batchTitle,
                            deadline: `${moment(this.ruleForm.deadline).format('YYYY-MM-DD HH:mm')}:00`,
                            fileListJson: this.files,
                            state,
                            tempJson: this.ruleForm.tempJson,
                            tempClassJson: this.ruleForm.tempClassJson,
                            timing: this.ruleForm.timing,
                            timingTime: this.ruleForm.timingTime,
                            anonymous: 1,
                        };
                        if(this.ruleForm.evaType.includes(3)) {
                            args.voteClass = 2
                        } else {
                            args.voteClass = 1
                        }
                        if(this.ruleForm.evaType.includes(1) && this.ruleForm.evaType.includes(2)) {
                            args.voteClassHeader = 3
                        } else if (!this.ruleForm.evaType.includes(1) && !this.ruleForm.evaType.includes(2)) {
                            args.voteClassHeader = -1
                        } else {
                            args.voteClassHeader = this.ruleForm.evaType[0]
                        }
                        const stuScope = [];
                        this.ruleForm.stuScope.forEach(id => {
                            const classObj = this.classList.find(item => item.id == id);
                            if (classObj) {
                                stuScope.push({
                                    classId: id,
                                    className: classObj.name,
                                    classOrder: classObj.order
                                })
                            }
                        });
                        args.stuScope = stuScope;
                        new Promise(resolve => {
                            if (this.isEdit) {
                                args.id = this.id;
                                args.updateType = this.state == 2 ? 2 : 1;
                                updateEvaluateTwBatch(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                addEvaluateTwBatch(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }
                        })
                            .then(data => {
                                if (data.result) {
                                    this.$message.success(`${this.isEdit || state == 1 ? '保存' : '发布'}成功`);
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 1000);
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            },
            showTemplate(isClass = false) {
                this.isAddEditClassTemp = isClass;
                this.isDialogShow = true;
            }
        }
    }
</script>
<style scoped lang="scss">
    @import "../../styles/mixin";

    .temp-list {
        height: 400px;
        overflow-y: auto;
    }

    .section-batchTitle {
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
    }


    .award-item {
        margin-bottom: 10px;
    }

    .fa-trash {
        color: #F08080;
        cursor: pointer;
    }

    .condition-item {
        box-sizing: border-box;
        padding: 10px;
        width: 50%;
        display: inline-block;
        vertical-align: top;
    }

    .condition-item__name {
        width: 6em;
        text-align: right;
    }

    .condition-item > * {
        display: inline-block;
        vertical-align: top;
    }

    .section {
        padding: 10px;
        margin-bottom: 22px;
        background-color: #F8FBFF;
        width: 900px;
    }

    .section-batchTitle__sub {
        font-weight: bold;
    }

    .section-label {
        display: inline-block;
        width: 8em;
        margin-right: 5px;
        text-align: right;
    }

    .course-list {
        display: inline-block;
        vertical-align: top;
    }

    .course-list .course-item > * {
        display: inline-block;
    }

    .course-item__curr-name {
        width: 9em;
        margin-right: 10px;
    }

    .condition-list-container {
        clear: both;
    }

    .condition-list-container .condition-item {
    }

    .add-btn {
        font-size: 20px;
        position: relative;
        top: 3px;
    }

    .add-btn-container {
        color: #409EFF;
        cursor: pointer;
    }

    .template-item {
        & > * {
            @include middleIB;
        }

        span {
            width: 200px;
            @include trimText;
        }
    }

    .temp-item-container {
        width: 33%;
        float: left;
        min-width: 200px;
        box-sizing: border-box;

        .temp-item {
            cursor: pointer;
            width: 90%;
            height: 170px;
            margin: 0 auto 10px auto;
            padding: 20px;
            background-color: #ECF5FF;
            position: relative;
            border-radius: 5px;
        }

        .icon {
            width: 32px;
            height: 32px;
            background: no-repeat center center / contain;
            margin-right: 10px;
        }

        .temp-item__title {
            & > * {
                display: inline-block;
                vertical-align: top;
            }

            span {
                width: 83%;
                font-size: 18px;
                font-weight: bold;
                position: relative;
                top: 6px;
            }
        }

        .temp-item__intro {
            margin-top: 20px;
            padding-left: 32px;
            color: #5F5F5F;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            float: left;
            margin-right: 20px;
            max-height: 70px;
        }

        .temp-item__footer {
            position: absolute;
            bottom: 20px;
            left: 0;
            right: 20px;
        }

        .icon--normal {
            background-image: url(https://cdnfile30043692.file.myqcloud.com/admin/images/evTea/normal-type-icon.png);
        }

        .icon--ques {
            background-image: url(https://cdnfile30043692.file.myqcloud.com/admin/images/evTea/ques-type-icon.png);
        }

        .icon--opt {
            background-image: url(https://cdnfile30043692.file.myqcloud.com/admin/images/evTea/opts-type-icon.png);
        }

        .fa-trash {
            position: absolute;
            right: 10px;
            top: 10px;
            color: #F08080;
            display: none;
            cursor: pointer;
        }

        .temp-item:hover .fa-trash {
            display: block;
        }

    }
</style>
