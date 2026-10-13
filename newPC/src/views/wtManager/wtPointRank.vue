<template>
    <div class="wtPointRank">
        <div class="header-wrap">
            <div class="header">
                <template v-if="wtManagerRole">
                    <el-select v-model="schoolTimeCode" size="medium" placeholder="请选择学年" @change="changeSchool"
                               style="width:180px">
                        <el-option v-for="item in schoolYearList" :key="item.id" :label="`${item.year}学年`"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-if="!wtManagerRole&&wtHeadMasterRole">
                    <el-select v-model="schoolTimeCode" size="medium" placeholder="请选择学年"
                               @change="changeSchool2">
                        <el-option v-for="item in schoolYearList" :key="item.id" :label="`${item.year}学年`"
                                   :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-if="wtManagerRole">
                    <el-select v-model="gradeCode" size="medium" placeholder="请选择年级" @change="changeGrade">
                        <el-option label="全部年级" :value="0"></el-option>
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-if="!wtManagerRole&&wtHeadMasterRole">
                    <el-select v-model="gradeCode" size="medium" placeholder="请选择年级" @change="changeGrade2">
                        <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-if="wtManagerRole">
                    <el-select v-model="classCode" size="medium" placeholder="请选择班级" @change="changeClass">
                        <el-option label="全部班级" :value="0"></el-option>
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template v-if="!wtManagerRole&&wtHeadMasterRole">
                    <el-select v-model="classCode" size="medium" placeholder="请选择班级" @change="changeClass2">
                        <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
                        </el-option>
                    </el-select>
                </template>
                <template>
                    <el-input v-model.trim="searchName"
                              placeholder="请输入学生姓名" size="medium"
                              @keyup.enter.native="handleInputChange"></el-input>
                </template>
                <el-button type="primary"   size="medium" @click="examHandler">检索</el-button>
                <a :href="exportURL" download="导出结果" target="_blank" v-if="pointList&&pointList.length!==0">
                    <el-button class="filter-item" type="primary" size="medium">导出</el-button>
                </a>
                <el-button type="primary"   size="medium" @click="clearNotice">发送清空通知
                </el-button>
                <el-upload class="upload-import" :action="uploadFilePath" :data="uploadData"
                           :show-file-list='false'
                           accept=".xls,.xlsx" :before-upload="beforeFileUpload"
                           :on-success="handleFileSuccess">
                    <el-button type="primary" size="medium">导入</el-button>
                </el-upload>
                <a :href="moduleDown" download="模板下载" target="_blank">
                    <el-button class="filter-item" type="primary" size="medium">模板下载</el-button>
                </a>
            </div>
        </div>
        <el-table stripe :data="pointList" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <el-table-column align="center" label="姓名" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.stuName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="班级" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.className}}</span>
                </template>
            </el-table-column>
            <el-table-column :key="index" v-for="(item,index) in typeList" align="left" :label="item.typeName"
                             sortable show-overflow-tooltip :prop="`typePointList${index}`">
            </el-table-column>
            <el-table-column align="center" label="总积分" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.totalPoint}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="已使用" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.exchangePoint}}</span>
                </template>
            </el-table-column>
        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
        <el-dialog
            title="导入提示"
            :visible.sync="dialogVisible"
            size="tiny"
        >
            <span v-html="dataname"></span>
            <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
                    </span>
        </el-dialog>
    </div>
</template>
<script>
    import {
        possessRole,
        getSchoolYear,
        getCurrentSchoolTimeBySchoolId,
        querySchoolGrade,
        queryClassByGradeId,
        stuPointAnalysis,
        sendMsgToParent,
        getClassAndGradeByManagerId,
        getDepartListByUserId
    } from '@/api/wtManager';
    import debounce from 'lodash/debounce';
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                schoolTimeCode: '',
                schoolYearList: [],
                gradeList: [],
                gradeName: '',
                gradeCode: 0,
                classList: [],
                className: '',
                classCode: 0,
                pageNo: 1,
                pageSize: 20,
                searchName: '',
                pointList: [],
                typeList: [],
                total: null,
                listLoading: false,
                exportURL: '',
                wtManagerRole: false,
                wtHeadMasterRole: false,
                firstIn: true,
                moduleDown: '',
                uploadFilePath: "",
                dialogVisible: false,
                dataname: '',
                uploadData: {
                    token: this.$store.getters.token
                }
            }
        },
        created() {
            this.firstIn = true;
            //获取学期列表
            this.possessRoleFunc1();
            this.moduleDown = global.BasePath + 'structure/creditPoint/downGreditTypeTemplate?token=' + this.$store.getters.token;
            this.uploadFilePath = global.BasePath + "structure/creditPoint/uploadGreditTypeTemplate";
        },
        mounted() {

        },
        computed: {
            ...mapGetters([
                'userInfo'
            ])
        },
        mixins: [mixin],
        methods: {
            handleFileSuccess(res) {
                if (!res.data.length || res.data.length == 0) {
                    this.$message({
                        message: "模版导入成功！",
                        type: "success"
                    });
                    this.listLoading = false;
                    this.stuPointAnalysisFunc();
                } else {
                    this.dialogVisible = true;
                    this.dataname = res.data;
                    this.listLoading = false;
                    this.stuPointAnalysisFunc();
                }
            },
            beforeFileUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix !== "xls" && suffix !== "xlsx") {
                    this.$message.error("请上传后缀为.xls,.xlsx的模版文件!");
                    return false;
                } else {
                    this.listLoading = true;
                }
            },

            possessRoleFunc1() {
                var managerRoleId = 273;
                possessRole(managerRoleId).then(res => {
                    if (res.data.code === 200) {
                        this.wtManagerRole = res.data.data.result;
                        this.getSchoolTimeAllListFunc();
                        this.possessRoleFunc2();
                        /*梧桐信用管理员*/
                        if (this.wtManagerRole) {
                            this.querySchoolGradeFunc();
                        }
                    }
                }).catch(err => {
                });
            },
            possessRoleFunc2() {
                var headMasterRoleId = 11;
                possessRole(headMasterRoleId).then(res => {
                    if (res.data.code === 200) {
                        var That = this;
                        this.wtHeadMasterRole = res.data.data.result;
                        //获取年级列表
                        if (!this.wtManagerRole && this.wtHeadMasterRole) {
                            this.getClassAndGradeByManagerIdFunc();
                        }
                    }
                }).catch(err => {
                });
            },
            getClassAndGradeByManagerIdFunc() {
                var That = this;
                this.gradeList = [];
                getClassAndGradeByManagerId({
                    managerId: this.userInfo.id
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200 && data.data) {
                            let gradeBox = [];
                            data.data.forEach(item => {
                                gradeBox.push({
                                    id: item.gradeId,
                                    name: item.gradeName
                                });
                            })
                            gradeBox.forEach((item, index) => {
                                var flag = true;
                                this.gradeList.forEach((subItem, subIndex) => {
                                    if (item.id == subItem.id) {
                                        flag = false;
                                    }
                                })
                                if (flag) {
                                    this.gradeList.push({
                                        id: item.id,
                                        name: item.name
                                    })
                                }
                            })
                            this.gradeName = this.gradeList[0].name;
                            this.gradeCode = this.gradeList[0].id;
                            this.queryClassByGradeIdFunc2();
                        }
                    })
            },
            clearNotice() {
                this.$confirm('确定要发送学年末积分清空消息给家长吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    sendMsgToParent().then(res => res.data)
                        .then(data => {
                            if (data.code === 200) {
                                this.$message({
                                    type: 'success',
                                    message: '发送成功!'
                                });
                            }
                        })
                }).catch(function (error) {
                });

            },
            handleSizeChange(val) {
                this.pageSize = val;
                this.stuPointAnalysisFunc();
            },
            handleCurrentChange(val) {
                this.pageNo = val;
                this.stuPointAnalysisFunc();
            },
            examHandler() {
                this.pageNo = 1;
                this.stuPointAnalysisFunc();
            },
            pointSwitch() {
                this.$router.push({
                    path: 'wtPointRank'
                })
            },
            stuPointAnalysisFunc() {
                this.listLoading = true;
                stuPointAnalysis({
                    pageNo: this.pageNo,
                    pageSize: this.pageSize,
                    schoolYearId: this.schoolTimeCode,
                    gradeId: this.gradeCode,
                    classId: this.classCode,
                    searchName: this.searchName
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            if (data.data) {
                                let pointData = data.data;
                                this.pointList = pointData.commonPagination.dataList;
                                this.pointList.forEach((item, index) => {
                                    item.typePointList.forEach((subItem, subIndex) => {
                                        item['typePointList' + subIndex] = subItem
                                        //   this.$set("item","tPoint[subIndex]",subItem);
                                    })
                                })
                                this.typeList = pointData.typeList;
                                this.total = pointData.commonPagination.pagination.total;
                                this.listLoading = false;
                                /*导出*/
                                this.exportURL = global.BasePath + 'structure/creditPoint/downStuPointAnalysis?classId=' + this.classCode + '&gradeId=' + this.gradeCode + '&schoolYearId=' + this.schoolTimeCode + '&searchName=' + this.searchName + '&token=' + this.$store.getters.token;
                            }
                        }
                    }).catch(() => {
                    this.listLoading = false;
                });
            },
            querySchoolGradeFunc() {
                //年级
                querySchoolGrade({
                    isFilterNewGrade: true
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.gradeList = data.data;
                        }
                    })
            },
            queryClassByGradeIdFunc() {
                //班级
                queryClassByGradeId({
                    gradeId: this.gradeCode
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.classList = data.data;
                            //this.classCode=this.classList[0].id;
                        }
                    })
            },
            queryClassByGradeIdFunc2() {
                //班主任获取班级
                getDepartListByUserId({
                    pid: this.gradeCode,
                    type: 4
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.classList = data.data;
                            this.classCode = this.classList[0].id;
                            this.className = this.classList[0].name;
                            if (this.firstIn && !this.wtManagerRole && this.wtHeadMasterRole) {
                                this.stuPointAnalysisFunc();
                            }
                            //this.classCode=this.classList[0].id;
                        }
                    })
            },
            getSchoolTimeAllListFunc() {
                getSchoolYear().then(res => res.data).then(data => {
                    if (data.data) {
                        this.schoolYearList = data.data;
                        this.getCurrentSchoolTimeBySchoolId();
                    }
                })
            },
            getCurrentSchoolTimeBySchoolId() {
                getCurrentSchoolTimeBySchoolId().then(res => res.data).then(data => {
                    if (data.data) {
                        this.schoolTimeCode = data.data.schoolYearId;
                        if (this.firstIn && this.wtManagerRole) {
                            this.stuPointAnalysisFunc();
                        }
                    }
                })
            },
            changeSchool(val) {
                this.schoolTimeCode = val;
                if (this.wtManagerRole) {
                    this.gradeCode = 0;
                    this.classCode = 0;
                    this.searchName = '';
                    this.stuPointAnalysisFunc();
                }
            },
            changeSchool2(val) {
                this.schoolTimeCode = val;
                this.getClassAndGradeByManagerIdFunc();
            },
            changeGrade(val) {
                this.searchName = '';
                if (val == 0) {
                    this.gradeCode = 0;
                    this.classCode = 0;
                    this.classList = [];
                    this.stuPointAnalysisFunc();
                } else {
                    this.gradeCode = val;
                    this.classCode = 0;
                    this.queryClassByGradeIdFunc();
                    this.stuPointAnalysisFunc();
                }
            },
            changeGrade2(val) {
                this.searchName = '';
                this.gradeCode = val;
                this.queryClassByGradeIdFunc2();
            },
            changeClass(val) {
                this.searchName = '';
                if (val == 0) {
                    this.classCode = 0;
                    this.stuPointAnalysisFunc();
                } else {
                    this.classCode = val;
                    this.stuPointAnalysisFunc();
                }
            },
            changeClass2(val) {
                this.searchName = '';
                this.classCode = val;
                this.stuPointAnalysisFunc();
            },
            handleInputChange: debounce(function (val) {
                this.pageNo = 1;
                this.stuPointAnalysisFunc();
            })
        }
    }
</script>
<style lang="scss" scoped>
    .wtPointRank {
        padding: 10px;
        box-sizing: border-box;
    }

    .header {
        font-size: 14px;
        margin-bottom: 10px;

        .el-select {
            width: 100px;
        }

        .el-input {
            width: 130px !important;
        }
    }

    .upload-import {
        display: inline-block;
    }

    .module-title {
        display: table;
        width: 100%;
        table-layout: fixed;
        border-collapse: separate;
        vertical-align: middle;

        .btn-group {
            display: table-cell;
            float: none;
            width: 1%;

            .btn {
                width: 100%;
                display: inline-block;
                padding: 6px 12px;
                margin-bottom: 0;
                font-size: 14px;
                font-weight: 400;
                line-height: 1.42857143;
                text-align: center;
                white-space: nowrap;
                vertical-align: middle;
                -ms-touch-action: manipulation;
                touch-action: manipulation;
                cursor: pointer;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
                background-image: none;
                border: 1px solid transparent;
                border-radius: 4px;
                color: #333;
                background-color: #fff;
                border-color: #606266;
            }

            .btn-selected {
                color: #fff;
                background-color: #409EFF;
                border-color: #409EFF;
            }
        }

        .btn-group:first-child .btn {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
        }

        .btn-group:last-child .btn {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }
</style>
