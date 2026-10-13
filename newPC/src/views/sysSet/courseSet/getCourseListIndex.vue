<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button class="filter-item" type="primary" @click="isShowImport = true" size="medium">导入校本课程</el-button>
            <el-button class="filter-item" type="primary" @click="importCourse()" size="medium">导入系统课程</el-button>
            <el-button class="filter-item" type="primary" @click="jumpToPage('getCourseAddEdit')" size="medium">新增课程</el-button>
            <el-button class="filter-item" type="danger" @click="curriculumSettingDeleteSelected()" size="medium">删除课程</el-button>

            <el-input style="width:20%;float: right;" size="medium" v-model="listQuery.searchName"
                      placeholder="课程名称"
                      @change="handleInputChange">
                <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
            </el-input>
        </back-tool>
        <el-table stripe @select="selectionChangeHandler" @select-all="selectionChangeHandler" :key='tableKey'
                  :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"
                  :height="maxH">
            <el-table-column type="selection" align="center" width="65" :selectable="selectable">
            </el-table-column>

            <el-table-column align="center" label="课程编码" width="150">
                <template slot-scope="scope">
                    <span>{{scope.row.code}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="课程图标" width="100">
                <template slot-scope="scope">
                    <img class="imgsize" :src="scope.row.logoUrl || 'https://wxtestpb-10048617.image.myqcloud.com/70dde043-1baf-4c5e-9114-bfd1d41641ee?imageView2/q/100/w/800'" alt="">
                </template>
            </el-table-column>
            <el-table-column align="center" label="课程名称">
                <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="课程简称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.nickName}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="课程类型">
                <template slot-scope="scope">
                    <span v-show="scope.row.isMain==2">主学科</span>
                    <span v-show="scope.row.isMain==1">综合学科</span>
                    <span v-show="scope.row.isMain==3">校本学科</span>
                    <span v-show="scope.row.isMain==4">其他</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="课时系数" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.classHourFactor}}</span>
                </template>
            </el-table-column>
            <el-table-column
                label="所属年段" show-overflow-tooltip
                align="center"
            >
                <template slot-scope="scope">
                    {{scope.row.level == 0 ? '未知' : parseToConstants(scope.row.level, 'schoolTypeConstants')}}
                </template>
            </el-table-column>
            <el-table-column
                label="考试类型" show-overflow-tooltip
                align="center"
            >
                <template slot-scope="scope">
                    {{['未知', '考试', '考查'][scope.row.examType]}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="jumpToPage('getCourseAddEdit', {id: scope.row.id, isNS: scope.row.isNS == 1})">编辑</el-button>
                    <el-button size="small" type="text" :disabled="scope.row.isNS == 1" @click="deleteFunc(scope.row.id)" class="buttontextred">删除</el-button>
                </template>
            </el-table-column>

        </el-table>
        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>

        <el-dialog title="选择课程" :visible.sync="dialogVisible" width="500px">
            <div class="ebody">
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选
                </el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedCourse" @change="handleCheckedCourseChange">
                    <el-row>
                        <el-col :key="sc.id" :span="6" v-for="sc in course">
                            <el-checkbox :disabled="oldCheckedCourse.includes(sc.id)" :label="sc.id" :key="sc.id">
                                {{sc.otherName}}
                            </el-checkbox>
                        </el-col>
                    </el-row>

                </el-checkbox-group>
            </div>
            <span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="curriculumSettingImportSel">确 定</el-button>
			</span>
        </el-dialog>

        <el-dialog title="导入" :visible.sync="isShowImport" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' @open="synDailogOpen">
            <!-- <div class="info">
                <div class="title">说明：</div>

            </div> -->
            <div class="sns-btn-div">
                <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :show-file-list='false'
                           accept=".xls" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess"
                >
                    <el-button type="primary">导入</el-button>
                </el-upload>
                <a href="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/xls/courseImportTemplate.xls" target="_blank" download="老师导入模版下载">
                    <el-button type="text">模版下载</el-button>
                </a>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="default" @click="isShowImport = false">关 闭</el-button>
          </span>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {curriculumSettingList, listPlatformCurriclumList, curriculumSettingDelete, curriculumSettingImport} from '@/api/systemSet/courseSet';
    import {parseToConstants} from '@/utils/utils';
    import mixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import {mapGetters} from 'vuex';

    export default {
        data() {
            return {
                list: null,
                total: null,
                listLoading: false,
                listQuery: {
                    pageNo: 1,
                    pageSize: 20,
                    searchName: '',
                },
                tableKey: 10,
                selected: [],
                dialogVisible: false,
                selectAllCourse: [],//全部数据
                checkAll: false,//是否全选
                oldCheckedCourse: [],
                checkedCourse: [],//选中值
                isIndeterminate: true,//状态
                course: [],//重新封装课程

                uploadPath: '',
                isShowImport: false,
                uploadData: {},
            };
        },
        components: {
            BackTool
        },
        created() {
            this.uploadPath = global.BaseNewPath + "curriculumSetting/importSchoolCurr" + `?token=${this.$store.getters.token}`;
            this.getList();
        },
        mixins: [mixin],
        computed: {
            ...mapGetters(['schoolInfo'])
        },

        methods: {
            parseToConstants,
            beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix != "xls") {
                    this.$message.error("格式不正确!");
                    return false;
                }
                return true;
            },
            handleAvatarSuccess(res) {
                if(res.data) {
                    this.$message.error(res.data);
                } else {
                    this.$message.success('导入成功');
                    this.getList();
                }
            },
            selectable(row) {
                return row.isNS != 1
            },
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            //获取课程列表数据
            getList() {
                this.listLoading = true;
                this.listQuery.searchName = this.listQuery.searchName.trim();
                curriculumSettingList(this.listQuery).then(res => {
                    let data = res.data.data;
                    this.list = data.courseList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                })
            },
            //筛选
            handleInputChange: _.debounce(
                function() {
                    this.getList();
                },
                // 这是我们为用户停止输入等待的毫秒数
                1000
            ),
            //当前页显示条目
            handleSizeChange(val) {
                this.listQuery.pageSize = val;
                this.getList();
            },
            //当前页
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.getList();
            },
            jumpToPage(path, query) {
                if (query === null || query === undefined) {
                    query = {};
                }
                this.$router.push({
                    path,
                    query
                })
            },
            importCourse() {//获取导入课程的全部课程
                const checkedCourse = [];
                const oldCheckedCourse = [];
                this.course = [];
                listPlatformCurriclumList().then(res => {
                    let data = res.data;
                    if (data.code == 200) {
                        this.selectAllCourse = data.data;
                        this.selectAllCourse.forEach((item) => {
                            var hash = {};
                            hash.id = item.id;
                            hash.otherName = item.otherName;
                            if (item.isSelected == 1) {
                                checkedCourse.push(item.id);
                                oldCheckedCourse.push(item.id);
                            }
                            this.course.push(hash);
                        });
                        this.checkedCourse = checkedCourse;
                        this.oldCheckedCourse = oldCheckedCourse;
                        let checkedCount = this.checkedCourse.length;
                        this.checkAll = checkedCount === this.course.length;
                        this.isIndeterminate = checkedCount > 0 && checkedCount < this.course.length;
                    }
                });
                this.dialogVisible = true;
            },
            curriculumSettingImportSel() {//新增课程
                let selAllCourse = [];
                _.differenceBy(this.checkedCourse, this.oldCheckedCourse).forEach((id) => {
                    const obj = this.selectAllCourse.find(item => item.id == id);
                    if(obj) {
                        selAllCourse.push({
                            code: obj.code,
                            courseId: obj.id,
                            examType: obj.examType,
                            isMain: obj.isMain,
                            isNS: obj.isNS,
                            level: obj.level,
                            logoUrl: obj.logoUrl,
                            name: obj.name,
                            otherName: obj.otherName,
                            schoolId: this.schoolInfo.id
                        })
                    }
                });
                if (selAllCourse.length < 1) {
                    this.dialogVisible = false;
                } else {
                    curriculumSettingImport(selAllCourse).then(res => {
                        let data = res.data;
                        if (data.result) {
                            this.$message.success('导入成功');
                            this.getList();
                            this.dialogVisible = false;
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }

            },
            handleCheckAllChange() {//全选
                let courseListSel = [];
                this.course.forEach((item) => {
                    courseListSel.push(item.id);
                });
                if (this.checkAll) {
                    this.checkedCourse = courseListSel;
                } else {
                    this.checkedCourse = JSON.parse(JSON.stringify(this.oldCheckedCourse));
                }
                this.isIndeterminate = false;
            },
            handleCheckedCourseChange(value) {//选择

                let checkedCount = value.length;
                this.checkAll = checkedCount === this.course.length;
                this.isIndeterminate = checkedCount > 0 && checkedCount < this.course.length;
            },

            curriculumSettingDeleteSelected() {//多选删除课程
                const delArr = [];
                if (this.selected.length > 0) {
                    this.selected.forEach(item => {
                        delArr.push(item.id);
                    });
                    let courseIds = delArr.join(',');
                    this.deleteFunc(courseIds);
                } else {
                    this.$message.warning('请选择要删除的课程！');
                    this.listLoading = false;
                }
            },
            deleteFunc(ids) {
                this.$confirm('是否确认要删除该课程？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    curriculumSettingDelete({
                        idStr: ids
                    }).then(res => {
                        if (res.data.result) {
                            this.$message.success('删除成功');
                            this.getList();
                            this.selected = [];
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                });

            }
        }

    }
</script>

<style scoped="scoped">
    .el-loading-mask {
        display: none;
    }

    .searchButton {
        width: 200px;
        vertical-align: middle;
        margin-bottom: 10px;
        float: right;
    }

    .searchButton:after {
        content: "";
        display: block;
        clear: both;
    }

    .el-icon-circle-cross {
        color: #f08080;
    }

    .el-icon-circle-check {
        color: #90EE90
    }

    .imgsize {
        width: 25px;
        height: 25px;
    }

    .ebody {
        max-height: 600px;
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
