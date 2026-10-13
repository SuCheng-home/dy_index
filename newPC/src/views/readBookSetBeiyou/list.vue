<template>
    <div class="stack-room-wrap">
        <div class="book-list-header">
            <div class="header">
                <el-row>
                    <el-col :span="19">
                        <!-- <el-select v-model="pagination.classId" @change="getReadIndependBookListFunc()" size="medium"
                                   placeholder="请选择班级">
                            <el-option
                                v-for="item in classList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select> -->
                         <term-grade-class-selector :queryArgs="queryArgs"  :isShowDuration="false"  @input="getReadIndependBookListFunc()" ref="selector" v-model="obj" ></term-grade-class-selector>
                        <el-button
                            class="header-buttom"
                            size="medium"
                            type="primary"
                            @click="jumpToPage('readWay', {classId:pagination.classId})"
                        >阅读方式设置
                        </el-button>
                        <el-button
                            class="header-buttom"
                            size="medium"
                            type="primary"
                            @click="jumpToPage('cancelPassword', {classId:pagination.classId})"
                        >撤销密码设置
                        </el-button>
                        <el-button
                            class="header-buttom"
                            size="medium"
                            type="primary"
                            @click="isShowUrlLink = true"
                        >自主阅读链接
                        </el-button>
                        <!-- <el-button
                            class="header-buttom"
                            size="medium"
                            type="primary"
                            @click="resetProcess()"
                        >重置阅读进度
                        </el-button> -->
                        <el-button
                            class="header-buttom"
                            size="medium"
                            type="primary" @click="addShow()"
                        >新增批次
                        </el-button>
                    </el-col>
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入批次名称"
                            v-model.trim="pagination.title"
                            size="medium"
                            @change="getReadIndependBookListFunc()"
                        >
                            <el-button
                                slot="append"
                                icon="el-icon-search"
                                @click="getReadIndependBookListFunc()"
                            ></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
        </div>
              <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            			
                <el-table-column align="center" label="批次名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <i class="el-icon-s-flag" v-if="scope.row.status==2" style="color: red;"></i>
                        <span class="link-type"  @click="jumpToPage('listadd', {id:scope.row.id,classId:scope.row.classId})">{{scope.row.title}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="书籍数量" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.nowBookCount}}</span>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="历史书籍" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.hisBookCount}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="创建人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createUser}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" show-overflow-tooltip width="180px">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime?scope.row.createTime.slice(0,16):''}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="260px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-button type="text" size="small" v-if="scope.row.status==1" @click="delReadIndependBatch(scope.row.id)" class="buttontextred">删除</el-button>
                        <el-button type="text" size="small" @click="editShow(scope.row)" >编辑</el-button>
                        <el-button type="text" size="small" v-if="scope.row.status==1" @click="updateReadIndependBatchStatus(scope.row)">设置默认批次</el-button>
                        <el-button type="text" size="small"  @click="jumpToPage('listadd', {id:scope.row.id,classId:scope.row.classId})">书籍管理</el-button>
                    </template>
                </el-table-column> 
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getReadIndependBookListFunc" @current-change="getReadIndependBookListFunc"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
       
        <el-dialog
            title="自主阅读链接"
            :visible.sync="isShowUrlLink"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
            width="530px"
        >
            <el-input size="medium" :value="linkUrl" style="width: 400px" readonly/>
            <textarea id="copytext">{{linkUrl}}</textarea>
            <el-button size="medium" type="primary" @click="copyHandler()">复制</el-button>
            <br/>
        </el-dialog>
        <el-dialog :title="(type==1?'新增':'编辑')+'批次'" :visible.sync="dialogFormVisible" >
                            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="width:80%">
                                <el-form-item label="批次名称" prop="title">
                                    <el-input v-model.trim="ruleForm.title"  placeholder="请输入批次名称" :maxlength="30"></el-input>
                                </el-form-item>
                            </el-form>
                            <div slot="footer" class="dialog-footer">
                                <el-button @click="dialogFormVisible = false">取 消</el-button>
                                <el-button type="primary" @click="updateRepairAddress()">确 定</el-button>
                            </div>
                        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {queryClass} from '@/api/common/common';
    import {getReadIndependBookList,restReadIndependRecord,delReadIndependBatch,addReadIndependBatch,updateReadIndependBatch,updateReadIndependBatchStatus,getReadIndependBatchList} from '@/api/readBookBeiyou';
    import TermGradeClassSelector from "@/components/TermGradeClassSelector";
    export default {
        name: 'readBookSetList',
        data() {
            return {
                classList: [],                
                isShowUrlLink: false,
                bookList: [],
                allBookList: [],
                dialogFormVisible: false,
                addSelectType: 0,
                dialogSearchName: '',
                confirmedDialogSearchName: '',
                searchName: '',
                confirmedSearchName: '',
                selectBookIds: [],
                selectBookList: [],
                dataList: [],
                pagination: {
                    pageNo: 1,
                    pageSize: 20,
                    total: null,
                    title: "",
                    classId: '',
                },
                 ruleForm: {
                    title: '',
                    id:'',
                    className:"",
                    classId:""
                },
                rules: {
                    title: [
                        {required: true, message: '请输入批次名称', trigger: 'blur'},
                    ],
                },
            queryArgs: {
                all: false, //所有班级年级
                manager: true, //班主任
                notlimit: false, //所有班级年级
                submanager: true, //副班主任
                teacher: true //普通所交
            },  
            obj: {
                termId: "",
                duration: ["", ""],
                gradeId: "",
                classId: ""
            },

            };
        },
        components: { TermGradeClassSelector },
        mixins: [mixins],
        created() {
             this.getReadIndependBookListFunc();
            // queryClass()
            //     .then(res => res.data)
            //     .then(data => {
            //         const pageData = data.data;
            //         this.classList = pageData;
            //         if (pageData.length !== 0) {
            //             this.pagination.classId = pageData[0].id;
                       
            //         }
            //     });
        },
        computed: {
                
            linkUrl() {
                return global.command === 'production' ? `https://m.www.weixiaojia.cn/mobile/#/readBookBeiyou/studentList?classId=${this.pagination.classId}` : `http://www.weixiaojia.net/mobile/#/readBookBeiyou/studentList?classId=${this.pagination.classId}`  ;
            }
        },
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
              updateRepairAddress() {
                   this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                         if (this.type == 1) {//新增
                                this.addReadIndependBatch();
                            } else {
                                this.updateReadIndependBatch();
                            }
                    }
                })              
            },
            addReadIndependBatch(){
                addReadIndependBatch({
                        classId:this.ruleForm.classId,
                        className:this.ruleForm.className,
                        title:this.ruleForm.title,
                    }).then(res => {
                        if (res.data.result) {
                            this.$message.success('新增成功');
                            this.dialogFormVisible = false;
                            this.getReadIndependBookListFunc()
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
            },
             updateReadIndependBatch(){
                updateReadIndependBatch({
                        classId:this.ruleForm.classId,
                        className:this.ruleForm.className,
                        title:this.ruleForm.title,
                        id:this.ruleForm.id,
                    }).then(res => {
                        if (res.data.result) {
                            this.$message.success('编辑成功');
                            this.dialogFormVisible = false;
                            this.getReadIndependBookListFunc()
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
            },
            addShow() {//新增显示
                this.dialogFormVisible = true;
                this.type = 1;
                this.ruleForm.title = "";
                this.ruleForm.classId = this.pagination.classId;
                this.ruleForm.className=this.obj.className
            },
            editShow(obj) { 
                this.dialogFormVisible = true;
                this.type = 2;
                this.ruleForm.id = obj.id;
                this.ruleForm.title = obj.title;
                this.ruleForm.classId = obj.classId;
                this.ruleForm.className = obj.className;
            },
            getReadIndependBookListFunc() {
                this.pagination.classId=this.obj.classId
                if(this.obj.classId){
                     getReadIndependBatchList(this.pagination)
                        .then(res => res.data)
                        .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                        });
                }                
            },
            copyHandler() {
                const input = document.getElementById('copytext');
                input.select(); // 选中文本
                document.execCommand("copy"); // 执行浏览器复制命令
                this.$message.success("复制成功");
            },
            // 删除学校下的书库
            delReadIndependBatch(id) {
                this.$confirm('确认删除此批次, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delReadIndependBatch(id).then(res => {
                        if (res.data.result) {
                            this.$message.success('删除成功');
                            this.getReadIndependBookListFunc()
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }).catch(() => {
                });
            },
            updateReadIndependBatchStatus(obj) {
                this.$confirm('确认设置当前批次为默认批次, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateReadIndependBatchStatus({
                        classId:obj.classId,
                        id:obj.id
                    }).then(res => {
                        if (res.data.result) {
                            this.$message.success('设置成功');
                            this.getReadIndependBookListFunc()
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    })
                }).catch(() => {
                });
            },
            resetProcess() {
                this.$confirm('当前操作会将班级内所有孩子当前阅读进度重置，是否重置？', '进度重置', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    restReadIndependRecord({
                        classId: this.pagination.classId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('重置成功');
                            } else {
                                this.$message.error(data.msg);
                            }

                        })
                }).catch(() => {
                });
            }
        },
    };
</script>

<style scoped>
    .stack-room-wrap .el-dialog__body {
        padding: 10px 20px;
    }
</style>
<style lang="scss" scoped>
    #copytext {
        position: absolute;
        left: -3000px;
    }
    .book-dialog-header .header {
        padding-bottom: 10px;
  }

    .stack-room-wrap {
        padding:12px;
    }

    .clearfix:after {
        content: '';
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }

    .stack-room-wrap {
        .book-list-header {
            .header-buttom {
                margin-bottom: 10px;
            }

            .header_tab_line {
                .header_tab_item {
                    float: left;
                    height: 24px;
                    line-height: 24px;
                    padding: 0 10px;
                    margin: 5px 6px;
                    color: #666;
                    border-radius: 3px;
                    font-size: 14px;
                    cursor: pointer;
                }

                .select_item {
                    color: #fff;
                    background: #d8d8d8;
                }
            }
        }

        .book-list-box {
            overflow-x: hidden;
            overflow-y: auto;
            padding-left: 2px;

            .book-list {
                .book-item {
                    position: relative;
                    float: left;
                    width: 140px;
                    height: 200px;
                    line-height: 20px;
                    text-align: center;
                    margin-right: 40px;
                    margin-bottom: 30px;
                    font-size: 14px;
                    border: 1px solid #f8f8f8;
                    cursor: pointer;

                    .book-name {
                        width: 100%;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        color: #fff;
                        background: #bebebe;
                        background: rgba(0, 0, 0, 0.3);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .el-icon-delete {
                        position: absolute;
                        top: 6px;
                        right: 6px;
                        color: #f56c6c;
                        font-weight: bold;
                        cursor: pointer;
                        display: none;
                    }

                    &:hover {
                        .el-icon-delete {
                            display: inline-block;
                        }
                    }
                }

                .add-book {
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    i {
                        font-size: 30px;
                        color: #909399;
                    }
                }
            }
        }

        .book-dialog-box {
            .book-dialog-list {
                .book-list-box {
                    overflow-x: hidden;
                    overflow-y: auto;

                    .book-list {
                        padding: 20px 5px;

                        .book-item {
                            position: relative;
                            float: left;
                            width: 140px;
                            height: 200px;
                            text-align: center;
                            margin-right: 40px;
                            margin-bottom: 30px;
                            border: 1px solid #f8f8f8;
                            border-radius: 13px;
                            overflow: hidden;

                            .dialog-book-name {
                                width: 100%;
                                line-height: 20px;
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                color: #fff;
                                background: #bebebe;
                                background: rgba(0, 0, 0, 0.3);
                            }

                            i {
                                position: absolute;
                                top: 0;
                                right: 0;
                                font-size: 26px;
                                color: #409eff;
                                background: #fff;
                                border-radius: 50%;
                            }
                        }
                    }
                }
            }
        }
    }

    .no-stu-msg {
        font-size: 15px;
        text-align: center;
        color: #999;

        img {
            display: block;
            margin: 30px auto 0;
        }

        div {
            height: 20px;
            line-height: 20px;
            margin-top: -40px;
        }
    }

    .book-child-flex {
        margin-bottom: 10px;
    }

    .book_title {
        line-height: 20px;
        font-size: 16px;
        border-left: 4px solid #409eff;
        padding-left: 10px;
        margin-bottom: 10px;
    }

    .book-name__child {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
