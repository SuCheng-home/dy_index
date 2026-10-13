<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button class="filter-item"  size="medium" type="primary" @click="saveInfo">保存</el-button>
        </back-tool>
        <div style="padding-top:20px;overflow: auto;" :style="{height:`${nobottommaxH}px`}">
            <div class="body">
               <el-form :model="ruleForm" :rules="rules" ref="ruleForm" :label-position="labelPosition" label-width="160px"
                     style="width:100%">
                <el-form-item label="姓名：" prop="managerUserNames" style="width:80%;">
                    <address-book v-model="ruleForm.addressData" :config="ruleForm.configData"></address-book>
                </el-form-item>
                <el-form-item label="所教班级/所教课程：" prop="classAndCourse">
                    <el-button type="text" @click="getClassAndCourse();">添加</el-button>
                    <el-row  class="teachCourseDetail">
                        <el-col :key="index" v-for="(item,index) in ruleForm.allResult" :span="13">
                            <div class="grid-content bg-purple-dark">
                                <span>{{item.classItem}}</span>
                                <span class="course">{{item.courseItem}}</span>
                                <span class="delete"><el-button type="text"
                                                                @click="deleteResult(item.classItem,item.courseItem);"><i
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
    import {toAddPop, saveOrUpdate, isExist} from '@/api/teachingClass';
    import {querySchoolClass} from '@/api/system';
    import mixin from '@/mixins/windowResize';

    export default {
        components: {
            AddressBook,
            BackTool
        },
        data() {
            const examineValidator = (rule, value, callback) => {
                if (this.ruleForm.addressData.userJson.length < 1) {
                    callback(new Error('请选择老师'));
                } else {
                    callback();
                }
            };
            const classAndCourseValidator = (rule, value, callback) => {
                if (this.ruleForm.allResult.length < 1) {
                    callback(new Error('请选择班级和课程'));
                } else {
                    callback();
                }
            };
            const courseValidator = (rule, value, callback) => {
                if (this.ruleDialogForm.courseSelect.length < 1) {
                    callback(new Error('请选择课程'));
                } else {
                    callback();
                }
            };
            const classValidator = (rule, value, callback) => {
                if (this.ruleDialogForm.classSelect.length < 1) {
                    callback(new Error('请选择班级'));
                } else {
                    callback();
                }
            };

            return {
                dialogFormVisible: false,
                labelPosition: 'right',
                ruleForm: {
                    configData: {
                        title: '姓名',
                        depart: {target: 'user', departType: 't', userTypes: '1,6'},
                        SingleChose: true
                    },
                    addressData: {},
                    allResult: [],//课程和班级组合显示成最终结果,
                },
                rules: {
                    managerUserNames: [{
                        required: true,
                        validator: examineValidator
                    }],
                    classAndCourse: [{
                        required: true,
                        validator: classAndCourseValidator
                    }],

                },
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
                cutH: 300,

            }
        },
        mounted() {
            this.isexit();
        },
        mixins: [mixin],
        methods: {
            goback() {//返回
                this.$router.back();
            },
            saveInfo() {//保存
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
                _this.$watch("ruleForm.addressData", function (data) {
                    if (data.userJson.length > 0) {
                        let listQuery = {};
                        listQuery.userId = data.userJson[0].id;
                        isExist(listQuery).then(res => {
                            if (res.data.code === 200) {
                                _this.listData.id = data.userJson[0].id;
                                _this.ruleForm.managerUserNames = JSON.stringify(data.userJson);
                                _this.$refs.ruleForm.validateField('managerUserNames');
                            } else {
                                _this.$confirm('此用户已配置，如需修改请编辑', '提示', {
                                    confirmButtonText: '确定',
                                    showCancelButton: false,
                                    type: 'warning'
                                }).then(() => {
                                    _this.listData.id = 0;
                                    data.userJson = [];
                                    _this.ruleForm.managerUserNames = "";
                                    _this.ruleForm.addressData = {};
                                    _this.ruleForm.addressData.userJson = [];
                                    _this.$refs.ruleForm.validateField('managerUserNames');
                                })
                            }
                        })
                    } else {
                        _this.listData.id = 0;
                        _this.ruleForm.managerUserNames = "";
                        _this.$refs.ruleForm.validateField('managerUserNames');

                    }

                });//主动调用$watch方法来进行数据监测</span>	
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
                _this.ruleDialogForm.classSelect = [];//已选班级集合
                _this.ruleDialogForm.courseSelect = [];//已选课程集合
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
                            hash.label = item.nickName || item.name;
                            _this.courseList.push(hash);
                        })
                    }
                })

            },
            deleteResult(classItem, courseItem) {//删除课程和班级的组合
                this.ruleForm.allResult.forEach((item, index) => {
                    if (item.classItem == classItem && item.courseItem == courseItem) {
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
                        _this.ruleDialogForm.classSelect.forEach((item) => {//将获取班级的值封装成键值对的形式
                            _this.classList.forEach((classItem, index) => {
                                if (classItem.value == item) {
                                    let sel = {};
                                    sel.value = item;
                                    sel.label = classItem.label;
                                    _this.classSelectValue.push(sel);
                                }
                            })
                        });
                        _this.ruleDialogForm.courseSelect.forEach((item) => {//将获取课程的值封装成键值对的形式
                            _this.courseList.forEach((courseItem) => {
                                if (courseItem.value == item) {
                                    let selcourse = {};
                                    selcourse.value = item;
                                    selcourse.label = courseItem.label;
                                    _this.courseSelectValue.push(selcourse);
                                }
                            })
                        });

                        _this.classSelectValue.forEach((classItem) => {//将获取班级和课程的值组合封装成键值对的形式
                            _this.courseSelectValue.forEach((courseItem) => {
                                let joinArr = {};
                                joinArr.classId = classItem.value;
                                joinArr.classItem = classItem.label;
                                joinArr.courseId = courseItem.value;
                                joinArr.courseItem = courseItem.label;
                                _this.ruleForm.allResult.push(joinArr);
                            })
                        });
                        _this.ruleForm.allResult = _this.uniqeByKeys(_this.ruleForm.allResult, ['classId', 'courseId']);
                        _this.ruleForm.classAndCourse = JSON.stringify(_this.ruleForm.allResult);
                        _this.dialogFormVisible = false;
                    }
                })

            },
            //将对象元素转换成字符串以作比较
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
