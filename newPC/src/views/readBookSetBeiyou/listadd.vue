<template>
    <div class="stack-room-wrap">
        <div class="book-dialog-header">
            <div class="header">
               <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
            </div>
         </div>
        <div class="book-list-box" :style="`height: ${notbmaxH - 48}px;`">
            <div class="book-list clearfix">
                <div class="title">本期书籍</div>
                <div class="clearfix">
                    <div class="book-child-flex">
                        <div
                            class="book-item" :key="index" v-for="(item, index) in bookList" @click="jumpToPage('schoolBookinfo',{id:item.bookId,num:1})"
                            :style="`background: url(${item.logoUrl}) center center / cover no-repeat;`"
                        >
                            <div class="book-name" :title="item.bookName">
                                <div class="book-name__child">{{ item.bookName }}</div>
                                <div class="book-name__child">类型：{{ item.bookTypeName }}</div>
                            </div>
                            <i
                                class="el-icon-delete"
                                @click.stop="delBook(item.id)"
                            ></i>
                        </div>
                        <!-- 当前学期当前月才能有添加 -->
                        <div
                            class="book-item add-book"
                            @click="addBook(1)"
                        >
                            <i class="el-icon-plus"></i>
                        </div>
                    </div>
                    </div>
                    <div class="title">往期在读书籍</div>
                     <div class="clearfix">
                     <div class="book-child-flex">
                        <div
                            class="book-item" :key="index" v-for="(item, index) in twobookList" @click="jumpToPage('schoolBookinfo',{id:item.bookId,num:1})"
                            :style="`background: url(${item.logoUrl}) center center / cover no-repeat;`"
                        >
                            <div class="book-name" :title="item.bookName">
                                <div class="book-name__child">{{ item.bookName }}</div>
                                <div class="book-name__child">类型：{{ item.bookTypeName }}</div>
                            </div>
                            <i
                                class="el-icon-delete"
                                @click.stop="delBook(item.id)"
                            ></i>
                        </div>
                        <!-- 当前学期当前月才能有添加 -->
                        <div
                            class="book-item add-book"
                            @click="addBook(2)"
                        >
                            <i class="el-icon-plus"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog
            title="新增书籍"
            class="book-dialog-box"
            :visible.sync="dialogFormVisible"
            width="960px"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
        >
            <div class="book-dialog-header">
                   <el-radio-group v-model="radio" @change="getReadIndependBookSchListFunc" v-if="batchlist.length">
                    <el-radio-button :label="1">从书库选择</el-radio-button>
                    <el-radio-button :label="2">从往期选择</el-radio-button>
                    </el-radio-group>
                <div class="header">
                  
                    <el-row>
                        <el-col :span="18" >
                             <el-select v-if="radio==2"
                                v-model="batchId"
                                placeholder="请选择"
                                @change="getReadIndependBookSchListFunc"
                                size="medium"
                            >
                                <el-option
                                    v-for="item in batchlist"
                                    :key="item.id"
                                    :label="item.title"
                                    :value="item.id"
                                ></el-option>
                            </el-select>
                            <el-select
                                v-model="addSelectType" v-if="radio==1"
                                placeholder="请选择"
                                @change="schoolBookChange"
                                size="medium"
                            >
                                <el-option label="全部书籍类型" :value="0"></el-option>
                                <el-option
                                    v-for="item in bookTypeList"
                                    :key="item.code"
                                    :label="item.value"
                                    :value="item.code"
                                ></el-option>
                            </el-select>
                        </el-col>
                        <el-col :span="6">
                            <el-input
                                placeholder="请输入书籍名称"
                                v-model.trim="dialogSearchName"
                                size="medium"
                                @keyup.enter.native="dialogSearchNameHandler"
                            >
                                <el-button
                                    slot="append"
                                    icon="el-icon-search"
                                    @click="dialogSearchNameHandler"
                                    size="medium"
                                ></el-button>
                            </el-input>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <div class="book-dialog-list">
                <div class="book-list-box" style="height: 400px">
                    <div
                        class="book-list clearfix"
                        v-if="showedBookList.length"
                    >
                        <div
                            class="book-item"
                            :key="index"
                            v-for="(item, index) in showedBookList"
                            :style="`background: url(${item.coverUrl}) center center / cover no-repeat;`"
                            @click="checkBook(item.id, item)"
                        >
                            <div class="dialog-book-name">
                                <div>{{ item.boolName }}</div>
                                <div>类型：{{ item.typeName }}</div>
                            </div>
                            <i
                                class="el-icon-circle-check"
                                v-show="isShowBookIcon(item.id)"
                            ></i>
                        </div>
                    </div>
                    <div class="no-stu-msg" v-else>
                        <img
                            src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
                            alt=""
                        />
                        <div>暂无书籍</div>
                    </div>
                </div>
            </div>
            <div slot="footer">
                <el-button size="medium" @click="hideBookBox">取 消</el-button>
                <el-button
                    size="medium"
                    type="primary"
                    @click="confirmBookBox"
                >确 定
                </el-button>
            </div>
        </el-dialog>
      
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {findSchoolDicsByCode} from '@/api/common/common';
    import {
        getReadIndependBookList,
        getReadIndependBookSchList,
        addReadIndependBookList,
        delReadIndependBook,
        restReadIndependRecord,getReadIndependBatchListAll
    } from '@/api/readBookBeiyou';

    export default {
        name: 'readBookSetList',
        data() {
            return {
                id: this.$route.query.id,
                classId: this.$route.query.classId,
                bookList: [],
                twobookList: [],
                allBookList: [],
                dialogFormVisible: false,
                addSelectType: 0,
                bookTypeList: [],
                dialogSearchName: '',
                confirmedDialogSearchName: '',
                searchName: '',
                confirmedSearchName: '',
                selectBookIds: [],
                selectBookList: [],
                type:1,
                radio:1,
                batchlist:[],
                batchId:''
            };
        },
        mixins: [mixins],
        created() {
           this.getReadIndependBookListFunc();
            findSchoolDicsByCode({
                dicCode: 'readIndependBookType'
            })
                .then(res => res.data)
                .then(data => {
                    this.bookTypeList=data.data;
                  
                });
        getReadIndependBatchListAll(this.$route.query.classId)
                .then(res => res.data)
                .then(data => {
                      for(let i=0;i<data.data.length;i++){
                        if(data.data[i].id!=this.id){
                            this.batchlist.push(data.data[i])
                        }
                    }
                    this.batchId=this.batchlist[0].id;
                });
        },
        computed: {
            showedBookList() {
                let mylist=this.bookList.concat(this.twobookList)
                return this.allBookList.filter(item => {
                    return item.boolName.includes(this.confirmedDialogSearchName) &&
                        (this.addSelectType == 0 || item.typeId == this.addSelectType) &&( mylist.findIndex(bookItem => bookItem.bookId == item.id) === -1)
                       
                })
            },
        },
        methods: {
               jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            getReadIndependBookListFunc() {
                getReadIndependBookList({
                    classId: this.classId,
                    batchId:this.id,
                    type:1
                })
                    .then(res => res.data)
                    .then(data => {
                        this.bookList = data.data;
                    })
            getReadIndependBookList({
                    classId: this.classId,
                    batchId:this.id,
                    type:2
                })
                    .then(res => res.data)
                    .then(data => {
                        this.twobookList = data.data;
                    })
            },
            // 删除学校下的书库
            delBook(id) {
                this.$confirm('确认删除此书籍, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delReadIndependBook({classBookId: id}).then(res => {
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
            // 书籍类型改变
            schoolBookChange() {
                this.dialogSearchName = '';
            },
            // 获取学校下的书籍
            getReadIndependBookSchListFunc() {
                this.addSelectType=0;
                if(this.radio==1){
                  getReadIndependBookSchList()
                    .then(res => res.data)
                    .then(data => {
                        this.allBookList = data.data;
                    });
                }else{
                    getReadIndependBookList({
                    classId: this.classId,
                    batchId:this.batchId,
                    type:0
                })
                    .then(res => res.data)
                    .then(data => {
                        for(let i=0;i<data.data.length;i++){
                            data.data[i].boolName= data.data[i].bookName
                            data.data[i].typeId= data.data[i].bookTypeId
                            data.data[i].id= data.data[i].bookId
                            data.data[i].coverUrl= data.data[i].logoUrl
                            data.data[i].typeName= data.data[i].bookTypeName

                        }
                        this.allBookList = data.data;
                         return item.boolName.includes(this.confirmedDialogSearchName) &&
                        (this.addSelectType == 0 || item.typeId == this.addSelectType) &&( mylist.findIndex(bookItem => bookItem.bookId == item.id) === -1)
                    })
                }
            
            },
            // 点击添加书籍
            addBook(type) {
                this.type=type;
                this.radio=1;
                this.dialogSearchName = '';
                this.confirmedDialogSearchName = '';
                this.selectBookIds = [];
                this.selectBookList = [];
                this.getReadIndependBookSchListFunc();
                this.dialogFormVisible = true;
            },
            // 弹窗的搜索
            dialogSearchNameHandler() {
                this.confirmedDialogSearchName = this.dialogSearchName;
            },
            // 点击确认
            confirmBookBox() {
                if (this.selectBookIds.length === 0) {
                    this.$message.error('请选择书籍');
                    return undefined;
                }
                const list = [];
                this.selectBookList.forEach(item => {
                    list.push({
                        bookId: item.id,
                        bookName: item.boolName,
                        bookTypeId: item.typeId,
                        bookTypeName: item.typeName,
                        logoUrl: item.coverUrl,
                        classId: this.classId,
                        type:this.type,
                        batchId:this.id
                    })
                });
                addReadIndependBookList(list)
                    .then(res => {
                        if (res.data.result) {
                            this.$message.success('添加成功');
                            this.getReadIndependBookListFunc();
                            this.dialogFormVisible = false;
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
            },
            // 点击取消
            hideBookBox() {
                this.selectBookIds = [];
                this.dialogFormVisible = false;
            },
            // 选中书籍
            checkBook(bookId, item) {
                if (this.selectBookIds.indexOf(bookId) < 0) {
                    this.selectBookIds.push(bookId);
                    this.selectBookList.push(item)
                } else {
                    this.selectBookIds.splice(this.selectBookIds.indexOf(bookId), 1);
                    this.selectBookList.splice(this.selectBookIds.indexOf(bookId), 1)
                }
            },
            // 新增书籍操作
            isShowBookIcon(bookId) {
                return this.selectBookIds.indexOf(bookId) > -1;
            },
        },
    };
</script>

<style scoped>
    .stack-room-wrap .el-dialog__body {
        padding: 10px 20px;
    }
</style>
<style lang="scss" scoped>
.title{
          line-height: 20px;
    font-size: 16px;
    border-left: 3px solid #409eff;
    padding-left: 10px;
    margin: 15px 0;
    color:#606266;
  }
    #copytext {
        position: absolute;
        left: -3000px;
    }
    .header {
    border-bottom: 1px solid #e7eaec;
    padding-top: 10px;
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
