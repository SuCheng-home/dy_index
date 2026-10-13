<template>
    <div class="reaction_add_wrap">
        <div class="header">
            <el-button size="medium" @click.native="goBack">返回</el-button>
            <el-button size="medium" type="primary" @click="saveReaction(1)" :loading="!canSaveTask">保存草稿</el-button>
            <el-button size="medium" type="primary" @click="saveReaction(2)" :loading="!canSaveTask">保存并发布</el-button>
        </div>
        <div class="reaction_add_box" :style="`height: ${maxH+50}px;`">
            <div class="reaction_box">
                <el-form :model="ruleForm" ref="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="主题" prop="theme">
                        <el-input :rows="5" v-model.trim="ruleForm.theme" :maxlength="20"
                                  placeholder="请输入主题"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <div slot="label"><span style="color: #f00;">*</span>阅读书籍</div>
                        <div class="reaction_add_book_box">
                            <div class="add_plus_box" @click="showSchoolBooks(1)" v-if="currentBookId">
                                <img :src="currentBookPic" alt="">
                            </div>
                            <div class="add_plus_box" @click="showSchoolBooks(0)" v-else><i class="el-icon-plus"></i>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="阅读周期" prop="readDate">
                        <el-date-picker size="medium" v-model="ruleForm.readDate" type="daterange" class="mywidthdaterange" :clearable="false"
                                        :picker-options="dormDateOptions" range-separator="-" start-placeholder="开始日期"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="发布范围" prop="sendRange">
                        <el-select v-model="ruleForm.sendRange" multiple placeholder="请选择" style="width: 350px;">
                            <el-option v-for="item in sendList" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="公开阅读心得">
                        <el-switch v-model="isShowReadRemind"></el-switch>
                    </el-form-item>
                    <el-form-item>
                        <div slot="label"><span style="color: #f00;">*</span>任务描述</div>
                        <br />
                        <ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor new-editor" ref="ueditor" :defaultMes="content"
                                 @editModel="richTextEditHandler"></ueditor>
                    </el-form-item>
                </el-form>
            </div>
        </div>

        <el-dialog title="选择书籍" class="book_dialog_box" :visible.sync="dialogFormVisible" width="960px"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="book_dialog_header">
                <div class="header">
                    <el-row>
                        <el-col :span="18">
                            <el-select v-model="addSelectType" placeholder="请选择" @change="schoolBookChange">
                                <el-option label="全部书籍类型" :value="0"></el-option>
                                <el-option v-for="item in bookTypeList" :key="item.code" :label="item.value"
                                           :value="item.code"></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-input placeholder="请输入书籍名称" v-model.trim="searchSchoolName" size="medium"
                                      @keyup.enter.native="searchSchoolNameHandler">
                                <el-button slot="append" icon="el-icon-search" @click="searchSchoolNameHandler"
                                           :loading="searchLoading"></el-button>
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="book_dialog_list">
                <div class="book_list_box" style="height: 400px;">
                    <div class="book_list clearfix" v-if="allTypeBookList && allTypeBookList.length">
                        <div class="book_item" :key="index" v-for="(item, index) in allTypeBookList"
                             :style="`background: url(${item.coverUrl}) center center / cover no-repeat;`"
                             @click="checkBook(item.bookId)">
                            <div class="dialog_book_name">
                                <div>{{item.bookName}}</div>
                                <div>类型：{{item.typeName}}</div>
                                <!--                <div>字数：{{item.wordCount}}</div>-->
                            </div>
                            <!--选中状态，参考争章发放选择-->
                            <i class="el-icon-circle-check" v-show="selectBookId === item.bookId"></i>
                        </div>
                    </div>
                    <div class="no_stu_msg" v-else>
                        <img
                            src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
                            alt="">
                        <div>暂无书籍</div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button size="medium" @click="hideBookBox">取 消</el-button>
                <el-button size="medium" type="primary" @click="confirmBookBox">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import Ueditor from "@/components/Ueditor";
    import {findDicsByCode, queryClass, querySchoolClass, possessRole} from '@/api/common/common';
    import {
        addLanguageBookTask,
        updateLanguageBookTask,
        getLanguageBookTask,
        getLanguageBookList
    } from '@/api/stackRoom';

    export default {
        name: "readTaskAdd",
        components: {
            Ueditor
        },
        data() {
            return {
                taskId: this.$route.query.taskId,
                ruleForm: {
                    theme: '',
                    readDate: [],
                    sendRange: []
                },
                sendList: [],
                isShowReadRemind: false,
                content: '',
                rules: {
                    theme: [
                        {required: true, message: '请输入主题！', trigger: 'blur'},
                        {min: 1, max: 20, message: '长度在 1 到 20 个字符！', trigger: 'blur'}
                    ],
                    readDate: [
                        {required: true, message: '请选择阅读周期！', trigger: 'blur'}
                    ],
                    sendRange: [
                        {required: true, message: '请选择发布范围！', trigger: 'change'}
                    ]
                },
                currentBookId: 0, // 当前选中项
                currentBookPic: '',

                canSaveTask: true,
                dialogFormVisible: false,
                searchLoading: false,
                selectBookId: 0, // 选择的项
                addSelectType: 0,
                bookTypeList: [],
                searchSchoolName: '',
                allTypeBookList: [],
                allBookList: []
            }
        },
        mixins: [mixins],
        created() {
            this.getLanguageBookList();
            this.findDicsByCode();
            this.possessRole();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            // 权限
            possessRole() {
                possessRole('10044').then(res => {
                    let data = res.data.data;
                    if (data && data.result) {
                        this.querySchoolClass();
                    } else {
                        this.queryClass();
                    }
                });
            },
            getLanguageBookTask() {
                getLanguageBookTask({taskId: this.taskId}).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.$refs.ueditor.setContent(data.content);

                        this.ruleForm.theme = data.title;
                        this.currentBookId = data.bookId;
                        this.ruleForm.readDate = [data.startDate, data.endDate];
                        this.ruleForm.sendRange = JSON.parse(data.classJson).map(item => item.id);
                        this.isShowReadRemind = data.isPublicRead === 1;

                        let self = this;
                        setTimeout(() => {
                            self.$refs.ueditor.setContent(data.content);
                            this.currentBookPic = this.allBookList[this.allBookList.map(item => item.bookId).indexOf(data.bookId)].coverUrl;
                        }, 300)
                    }
                });
            },
            // 书籍获取
            findDicsByCode() {
                findDicsByCode({dicCode: 'booktype'}).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.bookTypeList = data;
                    }
                    if (this.taskId) {
                        this.getLanguageBookTask();
                    }
                });
            },
            schoolBookChange() {
                this.searchSchoolName = '';
                this.allTypeBookList = this.getTypeBookList();
            },
            searchSchoolNameHandler() {
                this.allTypeBookList = this.getTypeBookList();
            },
            getLanguageBookList() {
                getLanguageBookList().then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.allBookList = data;
                        this.allTypeBookList = data;
                        this.allTypeBookList = this.getTypeBookList();
                    }
                });
            },
            getTypeBookList() {
                if (this.addSelectType || this.searchSchoolName) {
                    let newListArray = [];
                    if (this.addSelectType) {
                        this.allBookList.forEach((item) => {
                            if (item.typeId === Number(this.addSelectType) && (!this.searchSchoolName || item.bookName.indexOf(this.searchSchoolName) > -1)) {
                                newListArray.push(item)
                            }
                        });
                    } else {
                        this.allBookList.forEach((item) => {
                            if (item.bookName.indexOf(this.searchSchoolName) > -1) {
                                newListArray.push(item)
                            }
                        });
                    }
                    return newListArray;
                }
                return this.allBookList;
            },
            // 书籍选择操作、数据处理
            showSchoolBooks(num) {
                if (num) {
                    this.selectBookId = this.currentBookId;
                }
                this.dialogFormVisible = true;
            },
            checkBook(bookId) {
                this.selectBookId = bookId
            },
            hideBookBox() {
                this.dialogFormVisible = false;
            },
            confirmBookBox() {
                if (!this.selectBookId) {
                    this.$message.error('请选择书籍');
                    return;
                }
                this.currentBookId = this.selectBookId;
                this.currentBookPic = this.allBookList[this.allBookList.map(item => item.bookId).indexOf(this.selectBookId)].coverUrl;
                this.dialogFormVisible = false;
            },
            queryClass() {
                queryClass().then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.sendList = data;
                    }
                });
            },
            querySchoolClass() {
                querySchoolClass().then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.sendList = data;
                    }
                });
            },
            saveReaction(state) {
                this.$refs.ruleForm.validate((isValid) => {
                    if (isValid) {
                        if (!this.currentBookId) {
                            this.$message.error('请选择书籍');
                            return;
                        }
                        if (!this.content) {
                            this.$message.error('请添加任务描述');
                            return;
                        }
                        let query = {
                            bookId: this.currentBookId,
                            classJson: this.getSelectClassList(),
                            content: this.$refs.ueditor.getContent(),
                            endDate: this.$moment(this.ruleForm.readDate[1]).format('YYYY-MM-DD'),
                            isPublicRead: this.isShowReadRemind ? 1 : 2,
                            startDate: this.$moment(this.ruleForm.readDate[0]).format('YYYY-MM-DD'),
                            state: state,
                            title: this.ruleForm.theme
                        };
                        if (this.taskId) {
                            query.id = this.taskId;
                            this.updateLanguageBookTask(query);
                        } else {
                            this.addLanguageBookTask(query);
                        }
                    }
                })
            },
            addLanguageBookTask(query) {
                this.canSaveTask = false;
                addLanguageBookTask(query).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('保存成功');
                        this.$router.back();
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                    this.canSaveTask = true;
                });
            },
            updateLanguageBookTask(query) {
                this.canSaveTask = false;
                updateLanguageBookTask(query).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('保存成功');
                        this.$router.back();
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                    this.canSaveTask = true;
                });
            },
            getSelectClassList() {
                let newList = [];
                this.sendList.forEach((item) => {
                    if (this.ruleForm.sendRange.indexOf(item.id) > -1) {
                        newList.push({
                            id: item.id,
                            name: item.name
                        })
                    }
                });
                return newList;
            },
            richTextEditHandler(content) {
                this.content = content;
            }
        }
    }
</script>

<style scoped>
    .reaction_add_wrap .el-dialog__body {
        padding: 10px 20px;
    }
</style>
<style lang="scss" scoped>
    .reaction_add_wrap {
        padding:12px;

        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .reaction_add_box {
            padding-top: 20px;
            overflow-x: hidden;
            overflow-y: auto;

            .reaction_box {
                width: 820px;
                margin: 0 auto;

                .reaction_add_book_box {
                    .add_plus_box {
                        width: 105px;
                        height: 150px;
                        line-height: 150px;
                        text-align: center;
                        border: 1px solid #eee;
                        font-size: 24px;
                        color: #999;
                        cursor: pointer;

                        img {
                            display: block;
                            width: 100%;
                            height: 100%;
                        }
                    }
                }
            }
        }

        .book_dialog_box {
            .book_dialog_list {
                .book_list_box {
                    overflow-x: hidden;
                    overflow-y: auto;

                    .book_list {
                        padding: 20px 5px;

                        .book_item {
                            position: relative;
                            float: left;
                            width: 140px;
                            height: 200px;
                            text-align: center;
                            margin-right: 40px;
                            margin-bottom: 30px;
                            box-shadow: 0 0 5px #bbb;
                            border-radius: 13px;
                            overflow: hidden;

                            .dialog_book_name {
                                width: 100%;
                                line-height: 20px;
                                position: absolute;
                                bottom: 0;
                                left: 0;
                                color: #fff;
                                background: #bebebe;
                                background: rgba(0, 0, 0, .3);
                            }

                            i {
                                position: absolute;
                                top: 0;
                                right: 0;
                                font-size: 26px;
                                color: #409EFF;
                                background: #fff;
                                border-radius: 50%;
                            }
                        }
                    }

                    .no_stu_msg {
                        text-align: center;
                        font-size: 15px;
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
                }
            }
        }
    }
</style>
