<template>
    <div class="stack_room_wrap">
        <div class="book_list_header">
            <div class="header">
                <el-row>
                    <el-col :span="19">
                        <el-button size="medium" type="primary" @click="addBook" v-show="isBookManager">添加书籍
                        </el-button>
                        <div>&nbsp;</div>
                    </el-col>
                    <el-col :span="5">
                        <el-input placeholder="请输入书籍名称" v-model.trim="searchName" size="medium"
                                  @keyup.enter.native="searchNameHandler">
                            <el-button slot="append" icon="el-icon-search" @click="searchNameHandler"
                                       :loading="searchLoading"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <div class="header_tab_line clearfix">
                <div class="header_tab_item" :class="{'select_item': selectBookType === ''}"
                     @click="changeBookType('')">全部
                </div>
                <div class="header_tab_item" :class="{'select_item': selectBookType === item.code}"
                     @click="changeBookType(item.code)" :key="index" v-for="(item, index) in bookTypeList">
                    {{item.value}}
                </div>
            </div>
        </div>
        <div class="book_list_box" :style="`height: ${maxH-50}px;`">
            <div class="book_list clearfix" v-if="bookList && bookList.length">
                <div class="book_item" :key="index" v-for="(item, index) in bookList"
                     :style="`background: url(${item.coverUrl}) center center / cover no-repeat;`"
                     @click="toBookInfo(item.bookId)">
                      <img class="bidu" v-if="item.isNeedRead==1" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/bidu.png" alt="" srcset="">
                    <div class="book_name" :title="item.bookName">{{item.bookName}}</div>
                    <i class="el-icon-delete" @click.stop="delCurrentBook(item.bookId)"
                       v-show="isBookManager"></i>
                </div>
            </div>
            <div class="no_stu_msg" v-else>
                <img
                    src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
                    alt="">
                <div>暂无书籍</div>
            </div>
        </div>

        <el-dialog title="新增书籍" class="book_dialog_box" :visible.sync="dialogFormVisible" width="960px"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <div class="book_dialog_header">
                <div class="header" style="padding-bottom: 10px;">
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
                             @click="checkBook(item.id)">
                            <div class="dialog_book_name">
                                <div>{{item.boolName}}</div>
                                <div>类型：{{item.typeName}}</div>
                                <div>字数：{{item.wordCount}}</div>
                            </div>
                            <!--选中状态，参考争章发放选择-->
                            <i class="el-icon-circle-check" v-show="isShowBookIcon(item.id)"></i>
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
                <el-button size="medium" type="primary" @click="confirmBookBox" :loading="!canAddBook">确 定
                </el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {findDicsByCode} from '@/api/common/common';
    import {possessRole, getSchoolBookList, getLanguageBookList, addLanguageBookList, delBook} from '@/api/stackRoom';

    export default {
        name: "stackRoomIndex",
        data() {
            return {
                isBookManager: false,
                searchName: '',
                searchSchoolName: '',
                searchLoading: false,
                canAddBook: true,
                selectBookType: '',
                bookTypeList: [],
                bookList: [],
                allBookList: [],
                dialogFormVisible: false,
                allTypeBookList: [],
                addSelectType: 0,
                selectBookIds: []
            }
        },
        mixins: [mixins],
        created() {
            this.possessRole();
            this.findDicsByCode();
            this.getLanguageBookList();
        },
        methods: {
            toBookInfo(bookId) {
                this.$router.push({path: 'stackRoomBookIntro', query: {bookId: bookId}})
            },
            possessRole() {
                possessRole().then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.isBookManager = data.result
                    }
                });
            },
            findDicsByCode() {
                findDicsByCode({dicCode: 'booktype'}).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.bookTypeList = data;
                    }
                });
            },
            getLanguageBookList() {
                getLanguageBookList().then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && res.data.result) {
                        this.allBookList = data;
                        this.bookList = data;
                        this.bookList = this.getTypeBookList();
                    }
                });
            },
            // 处理书籍展示数据
            changeBookType(val) {
                this.selectBookType = val;
                this.searchName = '';
                this.bookList = this.getTypeBookList();
            },
            searchNameHandler() {
                this.bookList = this.getTypeBookList();
            },
            getTypeBookList() {
                if (this.selectBookType || this.searchName) {
                    let newListArray = [];
                    if (this.selectBookType) {
                        this.allBookList.forEach((item) => {
                            if (item.typeId === Number(this.selectBookType) && (!this.searchName || item.bookName.indexOf(this.searchName) > -1)) {
                                newListArray.push(item)
                            }
                        });
                    } else {
                        this.allBookList.forEach((item) => {
                            if (item.bookName.indexOf(this.searchName) > -1) {
                                newListArray.push(item)
                            }
                        });
                    }
                    return newListArray;
                }
                return this.allBookList;
            },
            // 书籍删除
            delCurrentBook(bookId) {
                this.$confirm('是否删除当前书籍？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.delBook(bookId);
                }).catch(() => {
                });
            },
            delBook(bookId) {
                delBook({bookId: bookId}).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('删除成功');
                        this.getLanguageBookList();
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                });
            },
            // 学校书籍操作
            addBook() {
                this.addSelectType = this.selectBookType || 0;
                this.searchSchoolName = '';
                this.selectBookIds = [];
                this.getSchoolBookList();
                this.dialogFormVisible = true;
            },
            schoolBookChange() {
                this.searchSchoolName = '';
                this.getSchoolBookList();
            },
            searchSchoolNameHandler() {
                this.getSchoolBookList();
            },
            getSchoolBookList() {
                getSchoolBookList({
                    addbookType: 1,
                    boolName: this.searchSchoolName,
                    typeId: this.addSelectType
                }).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200) {
                        this.allTypeBookList = data;
                    }
                });
            },
            // 新增书籍操作
            isShowBookIcon(bookId) {
                return !!(this.selectBookIds.indexOf(bookId) > -1);
            },
            checkBook(bookId) {
                if (this.selectBookIds.indexOf(bookId) < 0) {
                    this.selectBookIds.push(bookId);
                } else {
                    this.selectBookIds.splice(this.selectBookIds.indexOf(bookId), 1);
                }
            },
            hideBookBox() {
                this.selectBookIds = [];
                this.dialogFormVisible = false;
            },
            confirmBookBox() {
                this.canAddBook = false;
                addLanguageBookList(this.selectBookIds.map(item => {
                    return {bookId: item}
                })).then(res => {
                    if (res.data.code === 200 && res.data.result) {
                        this.$message.success('保存成功');
                        this.getLanguageBookList();
                        this.dialogFormVisible = false;
                    } else {
                        this.$message.warning(res.data.msg);
                    }
                    this.canAddBook = true;
                });
            }
        }
    }
</script>

<style scoped>
    .stack_room_wrap .el-dialog__body {
        padding: 10px 20px;
    }
</style>
<style lang="scss" scoped>
    .stack_room_wrap {
        padding: 12px;
    }

    .clearfix:after {
        content: "";
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden
    }

    .clearfix {
        zoom: 1;
    }

    .stack_room_wrap {
        .book_list_header {

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

        .book_list_box {
            overflow-x: hidden;
            overflow-y: auto;

            .book_list {
                padding: 20px 0 0 20px;

                .book_item {
                    position: relative;
                    float: left;
                    width: 140px;
                    height: 200px;
                    text-align: center;
                    margin-right: 40px;
                    margin-bottom: 30px;
                    border: 1px solid #f8f8f8;
                    cursor: pointer;
                    .bidu{
            position: absolute;
            right: 0;
            top:0;
            height: 50px;
          }
                    .book_name {
                        width: 100%;
                        height: 30px;
                        line-height: 30px;
                        position: absolute;
                        bottom: 0;
                        left: 0;
                        color: #fff;
                        background: #bebebe;
                        background: rgba(0, 0, 0, .3);
                        overflow: hidden;
                        text-overflow: ellipsis;
                        white-space: nowrap;
                    }

                    .el-icon-delete {
                        position: absolute;
                        top: 6px;
                        left: 6px;
                        color: #F56C6C;
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
                            border: 1px solid #f8f8f8;
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
                }
            }
        }
    }
</style>
