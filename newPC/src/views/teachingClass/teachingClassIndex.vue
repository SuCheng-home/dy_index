<template>
    <div class="app-container calendar-list-container">
        <div class="teacherClassContent">
            <div>
                <el-row style="padding-bottom:10px">
                    <el-col :span="19">
                        <el-button class="filter-item" size="medium" type="primary" @click="loadteachingClassAdd()">新建
                        </el-button>
                        <el-button class="filter-item" size="medium" type="primary" @click="delRecordSelected()">删除
                        </el-button>
                        <el-button class="filter-item" size="medium" type="primary" @click="loadteachingClassInport()">
                            导入所教课程
                        </el-button>
                        <a :href="exportURL" download="导出所教课程" target="_blank" v-if="list.length">
                            <el-button class="filter-item" type="primary" size="medium" icon="upload">导出所教课程</el-button>
                        </a>
                        <el-button class="filter-item" size="medium" type="primary" @click="syncWxFunc()">同步到企业微信</el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-input v-model="listQuery.userName" size="medium" placeholder="用户姓名"
                                  @change="handleInputChange">
                            <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>

            <el-table stripe @select="selectionChangeHandler" @select-all="selectionChangeHandler" :key='tableKey'
                      :data="list" v-loading.body="listLoading" border fit highlight-current-row style="width: 100%"
                      :height="maxH">
                <el-table-column type="selection" align="center" width="65">
                </el-table-column>
                <el-table-column align="left" label="名称" width="150">
                    <template slot-scope="scope">
                        <a class="TeachingDetail" @click="loadteachingClassDetails(scope.row.id)">{{scope.row.name}}</a>
                    </template>
                </el-table-column>
                <el-table-column align="left" label="所教班级/所教课程" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.classAndCourseGathered}}</span>
                    </template>
                </el-table-column>

                <el-table-column align="center" label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="loadteachingClassEdit(scope.row.id)">编辑</el-button>
                        <el-button size="small" type="text" @click="delRecord(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-dialog title="Excel导入数据" :visible.sync="ExcelDialogVisible" :close-on-press-escape="false"
                       :close-on-click-modal="false" size="large">
                <el-card class="box-card">
                    <div slot="header" class="clearfix">
                        <span style="">说明:</span>
                    </div>
                    <div>
                        <span class="bold">1.请先下载模板，严格根据模板的格式来录入数据；</span>
                    </div>
                    <div>
                        <span class="bold">2.在执行批量导入操作后，会跳转到结果页面。如有失败数据，可下载之后修改再次导入。</span>
                    </div>
                </el-card>
                <a :href="uploadURL" download="下载模板">
                    <el-button class="downLoadTemplate" type="primary">下载模板</el-button>
                </a>
                <transition name="fade">
                    <el-upload ref="upload" v-show="uploadShow" class="upload-demo teacher_upload_box" multiple
                               :action="path" accept=".csv" :on-success="handleUploadSuccess"
                               :on-progress="handleUploadProgress" :on-preview="handleUploadPreview"
                               :on-remove="handleUploadRemove" :before-upload="handleBeforeUpload"
                               :data="{'token':token}">
                        <el-button type="primary" size="medium">点击上传</el-button>
                    </el-upload>
                </transition>
                <div v-if="downloadMessage">{{downloadMessage}}
                    <a v-if="isShowDownloadFailBtn" target="_blank" :href="downloadErrorUrl" download="下载失败名单">
                        <el-button type="text">下载失败名单</el-button>
                    </a>
                    <el-button v-if="isShowDownloadFailBtn" type="primary" @click="loadteachingClassInport">重新上传
                    </el-button>
                </div>
            </el-dialog>

            <div v-show="!listLoading" class="pagination-container">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                               :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                               :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {getTeachingClassList, deletes, updateSyncWxDepartAdmins} from '@/api/teachingClass';
    import mixin from '@/mixins/windowResize';

    export default {
        data() {
            return {
                list: null,
                total: null,
                listLoading: false,
                datetime: '',
                listQuery: {
                    userName: '',
                    pageNo: 1,
                    pageSize: 20,
                },
                tableKey: 10,
                exportURL: '',
                selected: [],
                uploadShow: true,
                ExcelDialogVisible: false,
                downloadMessage: '',
                isShowDownloadFailBtn: false,
                uploadURL: '',
                path: global.BaseNewPath + 'sys/teacherClass/upload',
                token: this.$store.getters.token,
                downloadErrorUrl: '',
            };
        },
        created() {
            this.getList();
            this.downLoadTemplate();
        },
        mixins: [mixin],
        methods: {
            selectionChangeHandler(selection) {
                this.selected = selection;
            },
            //获取列表内容
            getList() {
                this.listLoading = true;
                this.listQuery.userName = this.listQuery.userName.trim();
                getTeachingClassList(this.listQuery).then(res => {
                    let data = res.data.data;
                    this.list = data.dataList;
                    this.total = data.pagination.total;
                    this.listLoading = false;
                    this.list.forEach((lists) => {
                        let classAndCourseGathered = '';
                        lists.clsCourse.forEach((item) => {
                            classAndCourseGathered += item.className + '/' + item.courseName + ';'
                        });
                        lists.classAndCourseGathered = classAndCourseGathered;
                    })

                });
                this.exportURL = global.BaseNewPath + 'sys/teacherClass/exportTeacherClass' + '?token=' + this.$store.getters.token;
            },

            //筛选
            handleInputChange: _.debounce(
                function () {
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
            loadteachingClassEdit(userId) { //加载编辑页面
                this.$router.push({
                    path: 'teachingClassEdit',
                    query: {userId: userId}
                });
            },
            loadteachingClassDetails(userId) { //加载详情页面
                this.$router.push({
                    path: 'teachingClassDetails',
                    query: {userId: userId}
                });
            },
            loadteachingClassAdd() { //加载新增页面
                this.$router.push({
                    path: 'teachingClassAdd',
                    query: {}
                });
            },
            loadteachingClassInport() { //加载下载模板页面
                this.ExcelDialogVisible = true;
                this.downloadMessage = "";
                this.isShowDownloadFailBtn = false;
                this.uploadShow = true;
            },
            syncWxFunc() {
                updateSyncWxDepartAdmins()
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message.success("同步成功");
                        } else {
                            this.$message.error(data.msg);
                        }
                    })
            },
            //行内删除
            delRecord(id) {
                this.$confirm('确认要删除吗？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let delQuery = {userIds: ''};
                    delQuery.userIds = id;
                    deletes(delQuery).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success("删除成功");
                            this.getList();
                        } else {
                            this.$message.error(res.data.msg);
                        }

                    })
                }).catch(() => {
                });
            },
            //多选删除
            delRecordSelected() {
                let delArr = [];
                if (this.selected.length > 0) {
                    this.$confirm('确认要删除吗？', '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.selected.forEach(item => {
                            delArr.push(item.id);
                        });
                        let delQuery = {userIds: ''};
                        delQuery.userIds = delArr.join(",");
                        deletes(delQuery).then(res => {
                            if (res.data.code === 200) {
                                this.$message.success("删除成功");
                                this.getList();
                                this.selected = [];
                            } else {
                                this.$message.error(res.data.msg);
                            }

                        })
                    }).catch(() => {
                    });

                } else {
                    this.$message.warning("请选择要删除的数据！");
                    this.listLoading = false;
                }
            },
            downLoadTemplate() {//下载模板
                this.uploadURL = global.BaseNewPath + 'sys/user/import/common/downLoadTemplate?departType=11&token=' + this.$store.getters.token;
            },
            handleUploadSuccess(response, file, fileList) {
                // 上传失败
                if (response.code !== 200) {
                    this.$message({
                        type: 'warning',
                        message: response.msg
                    });
                    this.$refs.upload.clearFiles();
                } else {
                    this.uploadShow = false;
                    this.downloadMessage = "上传成功" + (response.data.total - response.data.fail) + "条数据，上传失败" + response.data.fail + "条数据";
                    if (response.data.fail > 0) {
                        this.downloadErrorUrl = global.BaseNewPath + 'sys/user/import/common/downloadResultXls?importMarkId=' + response.data.importMarkId + '&token=' + this.$store.getters.token;
                        this.isShowDownloadFailBtn = true;
                    }
                }
                this.getList();
            },
            handleBeforeUpload(file) {
                const FileExt = file.name.replace(/.+\./, "");
                if (FileExt !== "csv") {
                    this.$message({
                        type: 'warning',
                        message: '请上传csv后缀的Excel文件!'
                    });
                    return false;
                }
            },
            handleUploadProgress(event, file, fileList) {
            },
            handleUploadPreview(file) {

            },
            handleUploadRemove(file, fileList) {

            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>

<style scoped>
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

    .TeachingDetail {
        color: #0066CC;
    }

    .TeachingDetail:hover {
        color: #000000;
    }

    .fade-enter-active,
    .fade-leave-active {
        transition: opacity .3s;
    }

    .fade-enter,
    .fade-leave-active {
        opacity: 0;
    }

    .downLoadTemplate {
        margin: 5px 0 5px 0;
    }

</style>

<style scoped>
    .teacher_upload_box .el-upload-list {
        display: none;
    }
</style>
