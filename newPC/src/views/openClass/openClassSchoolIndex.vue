<template>
    <div style="padding:12px" v-loading.body="listLoading">
        <div class="open_class_school_wrap">
            <div class="search_line_wrap">
                <el-button type="primary" size="medium" @click="toOpenClassAdd"
                           v-if="isShowByPermission('/pc/listenClassRegister/toRegisterExaminePage')">新建公开课
                </el-button>
                 <a :href="exportURL" target="_blank" download="examName">
                <el-button type="primary" size="medium">下载模版</el-button>
            </a>
            <el-upload class="upload-import" style="display: inline-block;" :action="uploadPath" :data="uploadData" :show-file-list='false'
                       accept=".xls,.xlsx" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                <el-button type="primary" size="medium">模版导入</el-button>
            </el-upload>
                <el-select v-model="openClassTypeId" size="medium" placeholder="请选择类型" @change="sizeChangeHandler()">
                    <el-option v-for="item in classTypeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
                
                <el-input @keyup.enter.native="sizeChangeHandler" size="medium" class="filter-item"
                          placeholder="主讲人"
                          style='float: right; width: 20%;' v-model="searchName" maxlength="20">
                    <el-button slot="append" icon="el-icon-search" @click="sizeChangeHandler"></el-button>
                </el-input>
            </div>
            <div class="open_class_school_list">
                <el-table stripe :data="schoolClassList" border style="width: 100%;" :height="notbmaxH - 75">
                    <el-table-column label="时间" show-overflow-tooltip width="240">
                        <template slot-scope="scope">
                            <span style="color: #409eff;cursor:pointer;" @click="toOpenClassInfo(scope.row.id)">{{scope.row.listenDate}}&nbsp;{{scope.row.listenWeek}}&nbsp;{{scope.row.classNoName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="主讲人">
                        <template slot-scope="scope">
                            <span>{{scope.row.teacherName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="课题" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if="scope.row.subjectTheme">《{{scope.row.subjectTheme}}》</span>
                            <span v-else>--</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="公开课级别">
                        <template slot-scope="scope">
                            <span>{{scope.row.levelName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="公开课类型" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.openClassType || '--'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="上课班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                    <el-table-column label="上课地点" show-overflow-tooltip>
                        <template slot-scope="scope">
                             <span>{{scope.row.place}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="学科">
                        <template slot-scope="scope">
                            <span>{{scope.row.subjectName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="toOpenClassEdit(scope.row.id)" v-if="scope.row.listenDate > curDateStr">编辑</el-button>
                            <el-button size="small" type="text"
                                        v-if="timefun(scope.row.listenDate)&&(scope.row.subjectTheme)&&isShowByPermission('/pc/listenClassRegister/toRegisterExaminePage')"
                                      @click="certificateView(scope.row.id)">查看证书
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                                   :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                                   :page-size.sync="pagination.pageSize"
                                   layout="total, sizes, prev, pager, next, jumper"
                                   :total="pagination.total">
                    </el-pagination>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {isShowByPermission} from '@/utils';
    import mixins from '@/mixins/windowResize';
    import BaseMixin from '@/mixins/baseMixin';
    import {schoolClassRegisterList, findDicsByCode} from "@/api/teachingStudy/openClass";

    export default {
        name: 'openClassSchoolIndex',
        data() {
            return {
                schoolClassList: [],
                searchName: '',
                classTypeList: [],
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: ''
                },
                openClassTypeId: '0',
                curDateStr: this.$moment().format('YYYY-MM-DD'),
                exportURL: "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/newOpenCourseTemplate.xls",
                uploadPath: global.BasePath + "structure/listenClassRegister/uploadRegisterExcel",
                uploadData: {
                    token: this.$store.getters.token
                },
                listLoading: false,
            }
        },
        mixins: [mixins, BaseMixin],
        created() {
            this.schoolClassRegisterList();
            this.findDicsByCode()
        },
        methods: {
             handleAvatarSuccess(res) {
                if (!res.data) {
                    this.$message({
                        message: '模版导入成功！',
                        type: 'success'
                    });
                } else {
                    this.$message.error(res.data);
                }
                this.schoolClassRegisterList();
                this.listLoading = false;
            },
            beforeAvatarUpload(file) {
                let suffix = file.name.split('.')[file.name.split('.').length - 1];
                if (suffix !== 'xls') {
                    this.$message.error('请上传模版文件!');
                } else {
                    this.listLoading = true;
                }
            },
             timefun(time){
                    let currentTime = new Date(); // 获取当前时间
                    let inputTime = new Date(time+' 23:59:59'); // 将传入的时间转换为Date对象                
                    if (currentTime > inputTime) {
                      return true;
                    } else if (currentTime < inputTime) {
                       return false;
                    } else {
                       return false;
                    }
            },
            certificateView(id) {
                this.$router.push({path: 'certificateView', query: {id: id}})
            },
            // 类型列表
            findDicsByCode() {
                findDicsByCode('openClassType').then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.classTypeList = data.map((item) => {
                            return {
                                id: item.id,
                                name: item.value
                            }
                        });
                        this.classTypeList.unshift({id: '0', name: '全部类型'})
                    }
                }).catch();
            },
            isShowByPermission,
            toOpenClassAdd() {
                this.$router.push({path: 'add'});
            },
            toOpenClassEdit(id) {
                this.$router.push({path: 'add', query: {registerId: id}});
            },
            toOpenClassInfo(id) {
                this.$router.push({path: 'info', query: {id: id, num: 0, isSchoolOpenClass: 1}});
            },
            schoolClassRegisterList() {
                let query = {
                    pageNo: this.pagination.pageNo,
                    pageSize: this.pagination.pageSize,
                    teacherName: this.searchName,
                    openClassTypeId: this.openClassTypeId
                };
                schoolClassRegisterList(query).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.schoolClassList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch(() => {
                });
            },
            sizeChangeHandler() {
                this.pagination.pageNo = 1;
                this.schoolClassRegisterList();
            },
            currentChangeHandler() {
                this.schoolClassRegisterList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        margin-bottom: 0;

        .statistics_title {
            display: flex;
            margin: 10px 0;

            .btn_group {
                flex: 1;
                text-align: center;

                .btn {
                    height: 40px;
                    line-height: 40px;
                    border: 1px solid #ccc;
                    border-left-width: 0;
                    color: #333;
                    cursor: pointer;
                }

                .btn_selected {
                    color: #fff;
                    background: #409EFF;
                    border: 1px solid #409EFF;
                }
            }

            .btn_group:first-child {
                .btn {
                    border-radius: 4px 0 0 4px;
                    border-left-width: 1px;
                }
            }

            .btn_group:last-child {
                .btn {
                    border-radius: 0 4px 4px 0;
                }
            }
        }
    }

    .open_class_school_wrap {
        .search_line_wrap {
            margin-bottom: 10px;
        }
    }
</style>
