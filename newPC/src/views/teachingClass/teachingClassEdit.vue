<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button class="filter-item"  size="medium" type="primary" @click="saveInfo">保存</el-button>
        </back-tool>
        <div style="padding-top:20px;overflow: auto;" :style="{height:`${nobottommaxH}px`}">
            <div class="body">
              <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="labelPosition" label-width="160px"
                     style="width:100%">
                <el-form-item label="姓名：" style="width:80%">
                    {{userName}}
                </el-form-item>
                <el-form-item label="所教班级/所教课程：" prop="classAndCourse">
                    <el-button type="text" @click="getClassAndCourse();">添加</el-button>
                    <el-row  class="teachCourseDetail">
                        <el-col :key="index" v-for="(item,index) in ruleForm.allResult" :span="13">
                            <div class="grid-content bg-purple-dark">
                                <span>{{item.className}}</span>
                                <span class="course">{{item.courseName}}</span>
                                <span class="delete"><el-button type="text"
                                                                @click="deleteResult(item.classId,item.courseId);"><i
                                        class="el-icon-delete"></i></el-button></span>
                            </div>
                        </el-col>
                    </el-row>

                </el-form-item>
            </el-form>
            </div>
            <el-dialog title="请选择班级和课程" :visible.sync="dialogFormVisible">
                <el-form :model="ruleDialogForm" :rules="rulesDialog" ref="ruleDialogForm">
                    <el-form-item label="请选择班级：" :label-width="formLabelWidth" prop="classSelectJSON">
                        <el-select v-model="ruleDialogForm.classSelect" filterable multiple placeholder="请选择班级"
                                   size="large" style="width:70%">
                            <el-option
                                    v-for="item in classList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="请选择课程：" :label-width="formLabelWidth" prop="courseSelectJSON">
                        <el-select v-model="ruleDialogForm.courseSelect" filterable multiple placeholder="请选择课程"
                                   size="large" style="width:70%">
                            <el-option
                                    v-for="item in courseList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="dialogFormVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addClassAndCourse()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import {toAddPop, saveOrUpdate, isExist, TeachingEdit} from '@/api/teachingClass';
    import {querySchoolClass} from '@/api/system';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            AddressBook,
            BackTool
        },
        data() {
            const classAndCourseValidator = (rule, value, callback) => {
                if (value == undefined || this.ruleForm.allResult.length < 1) {
                    callback(new Error('请选择班级和课程'));
                } else {
                    callback();
                }
            };
            const courseValidator = (rule, value, callback) => {

                if (value == "" || value === undefined || this.ruleDialogForm.courseSelect.length < 1) {
                    callback(new Error('请选择课程'));
                } else {
                    callback();
                }
            };
            const classValidator = (rule, value, callback) => {

                if (value == "" || value == undefined || this.ruleDialogForm.classSelect.length < 1) {
                    callback(new Error('请选择班级'));
                } else {
                    callback();
                }
            };
            return {
                ruleForm: {
                    allResult: [],//课程和班级组合显示成最终结果,
                    classAndCourse: ''
                },
                rules: {
                    classAndCourse: [{
                        required: true,
                        validator: classAndCourseValidator
                    }],

                },
                dialogFormVisible: false,
                labelPosition: 'right',
                userName: '',
                formLabelWidth: '120px',
                classList: [],//所有班级集合
                courseList: [],//所有课程集合
                classSelectValue: [],//选中班级组合成键值对的形式
                courseSelectValue: [],//选中课程组合成键值对的形式
                listData: {
                    clsCourse: [],
                    id: 0
                },
                ruleDialogForm: {
                    classSelect: [],//已选班级集合
                    courseSelect: [],//已选课程集合
                    classSelectJSON: '',
                    courseSelectJSON: '',

                },
                rulesDialog: {
                    classSelectJSON: [{
                        required: true,
                        trigger: 'blur',
                        validator: classValidator
                    }],
                    courseSelectJSON: [{
                        required: true,
                        trigger: 'blur',
                        validator: courseValidator
                    }],

                },
                cutH: 315,
            }
        },
        watch: {
            ruleForm: {
                allResult: function (val) {

                },
            },
            ruleDialogForm: {
                classSelect: function (val) {

                },
                courseSelect: function (val) {

                },
            },

        },
        mixins: [mixin],
        mounted() {
            this.isexit();
        },
        created() {
            let _this = this;
            let userId = _this.$route.query.userId;
            _this.listData.id = userId;
            let queryInfo = {userId: ''};
            queryInfo.userId = userId;
            TeachingEdit(queryInfo).then(res => {
                let data = res.data;
                if (data.code === 200) {
                    _this.userName = data.data.name;
                    data.data.clsCourse.forEach((item, index) => {
                        let joinArr = {};
                        joinArr.classId = item.classId;
                        joinArr.className = item.className;
                        joinArr.courseId = item.courseId;
                        joinArr.courseName = item.courseName;
                        _this.ruleForm.allResult.push(joinArr);
                    })
                }
            });
            _this.ruleForm.classAndCourse = JSON.stringify(_this.ruleForm.allResult);
        },

        methods: {
            goback() {//返回
                this.$router.back();
            },
            saveInfo() {//保存
                this.ruleForm.classAndCourse = JSON.stringify(this.ruleForm.allResult);
                let clsCourse = [];
                this.ruleForm.allResult.forEach((item, index) => {
                    let hash = {};
                    hash.classId = item.classId;
                    hash.courseId = item.courseId;
                    clsCourse.push(hash);
                });
                this.listData.clsCourse = clsCourse;
                if (this.ruleForm.allResult.length < 1) {
                    this.ruleForm.classAndCourse = '';
                }
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                        saveOrUpdate(this.listData).then(res => {
                            if (res.data.code === 200) {
                                this.$message.success("保存成功");
                                this.listLoading = false;
                                this.goback();
                            } else {
                                this.$message.warning(res.data.msg);
                                this.listLoading = false;
                            }
                        })
                    }
                })
            },
            isexit() {//验证是否存在
                let _this = this;
                _this.$watch("ruleForm.allResult", function (data) {

                    if (data.length < 1) {
                        _this.ruleForm.classAndCourse = "";
                        _this.$refs.ruleForm.validateField('classAndCourse');
                    } else {
                        _this.ruleForm.classAndCourse = JSON.stringify(data);
                        _this.$refs.ruleForm.validateField('classAndCourse');
                    }

                });//主动调用$watch方法来进行数据监测</span>
            },
            validataClassAndCourse() {//验证课程和班级
                let _this = this;
                _this.$watch("ruleDialogForm.classSelect", function (data) {

                    if (data.length < 1) {
                        _this.ruleDialogForm.classSelectJSON = '';
                        _this.$refs.ruleDialogForm.validateField('classSelectJSON');
                    } else {
                        _this.ruleDialogForm.classSelectJSON = JSON.stringify(_this.ruleDialogForm.classSelect);
                        _this.$refs.ruleDialogForm.validateField('classSelectJSON');
                    }

                });
                _this.$watch("ruleDialogForm.courseSelect", function (data) {

                    if (data.length < 1) {
                        _this.ruleDialogForm.courseSelectJSON = '';
                        _this.$refs.ruleDialogForm.validateField('courseSelectJSON');
                    } else {
                        _this.ruleDialogForm.courseSelectJSON = JSON.stringify(_this.ruleDialogForm.courseSelect);
                        _this.$refs.ruleDialogForm.validateField('courseSelectJSON');
                    }
                });
            },
            getClassAndCourse() {//初始化班级和课程
                let _this = this;
                _this.classSelect = [];//已选班级集合
                _this.courseSelect = [];//已选课程集合
                _this.dialogFormVisible = true;
                _this.classList = [];
                querySchoolClass({
                    isExcludNewClass: true
                }).then(res => {//获取班级
                    let data = res.data;
                    if (data.code === 200) {
                        data.data.forEach((item, index) => {
                            let classHash = {};
                            classHash.value = item.id;
                            classHash.label = item.name;
                            _this.classList.push(classHash);
                        })
                    }
                });

                toAddPop().then(res => {//获取课程
                    let data = res.data;
                    _this.courseList = [];
                    if (data.code === 200) {
                        data.data.forEach((item, index) => {
                            let hash = {};
                            hash.value = item.courseId;
                            hash.label = item.nickName;
                            _this.courseList.push(hash);
                        })
                    }
                })

            },
            deleteResult(classItem, courseItem) {//删除课程和班级的组合
                this.ruleForm.allResult.forEach((item, index) => {
                    if (item.classId == classItem && item.courseId == courseItem) {
                        this.ruleForm.allResult.splice(index, 1);
                    }
                })
            },
            addClassAndCourse() {//所选班级和课程的组合
                let _this = this;

                _this.classSelectValue = [];
                _this.courseSelectValue = [];

                if (_this.ruleDialogForm.classSelect.length < 1) {
                    _this.ruleDialogForm.classSelectJSON = '';
                } else {
                    _this.ruleDialogForm.classSelectJSON = JSON.stringify(_this.ruleDialogForm.classSelect);
                }
                if (_this.ruleDialogForm.courseSelect.length < 1) {
                    _this.ruleDialogForm.courseSelectJSON = '';
                } else {
                    _this.ruleDialogForm.courseSelectJSON = JSON.stringify(_this.ruleDialogForm.courseSelect);
                }

                this.$refs.ruleDialogForm.validate((valid) => {
                    if (valid) {
                        _this.ruleDialogForm.classSelect.forEach((item, index) => {//将获取班级的值封装成键值对的形式
                            _this.classList.forEach((classItem, index) => {
                                if (classItem.value == item) {
                                    let sel = {};
                                    sel.value = item;
                                    sel.label = classItem.label;
                                    _this.classSelectValue.push(sel);
                                }
                            })
                        });

                        _this.ruleDialogForm.courseSelect.forEach((item, index) => {//将获取课程的值封装成键值对的形式
                            _this.courseList.forEach((courseItem, index) => {
                                if (courseItem.value == item) {
                                    let selcourse = {};
                                    selcourse.value = item;
                                    selcourse.label = courseItem.label;
                                    _this.courseSelectValue.push(selcourse);
                                }
                            })
                        });

                        _this.classSelectValue.forEach((classItem, index) => {//将获取班级和课程的值组合封装成键值对的形式
                            _this.courseSelectValue.forEach((courseItem, index) => {
                                let joinArr = {};
                                joinArr.classId = classItem.value;
                                joinArr.className = classItem.label;
                                joinArr.courseId = courseItem.value;
                                joinArr.courseName = courseItem.label;
                                _this.ruleForm.allResult.push(joinArr);
                            })
                        });
                        _this.ruleForm.allResult = _this.uniqeByKeys(_this.ruleForm.allResult, ['classId', 'courseId']);
                        _this.ruleForm.classAndCourse = JSON.stringify(_this.ruleForm.allResult);
                        _this.dialogFormVisible = false;
                    }
                })


            },

            objkey(obj, keys) {
                var n = keys.length,
                    key = [];
                while (n--) {
                    key.push(obj[keys[n]]);
                }
                return key.join('|');
            },
            //去重操作
            uniqeByKeys(array, keys) {
                var arr = [];
                var hash = {};
                for (var i = 0, j = array.length; i < j; i++) {
                    var k = this.objkey(array[i], keys);
                    if (!(k in hash)) {
                        hash[k] = true;
                        arr.push(array[i]);
                    }
                }
                return arr;
            }
        }
    }

</script>
<style scoped="scoped">
.body{
    width: 810px;
    margin: 0 auto;
}
    .course, .delete {
        margin-left: 15px;
    }

    .teachCourseDetail {
        overflow: auto;
    }

    ::-webkit-scrollbar {
        width: 6px;
        background-color: #F5F5F5;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #999;
    }

    ::-webkit-scrollbar-track {
        background-color: #F5F5F5;
    }
</style>
