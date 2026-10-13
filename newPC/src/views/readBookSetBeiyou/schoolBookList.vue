<template>
    <div class="stack-room-wrap">
        <div class="book-list-header">
            <div class="header">
                <el-row>
                    <el-col :span="19">
                        <el-button
                            class="header-buttom"
                            size="medium"
                            type="primary"
                            @click="jumpToPage('schoolBookAdd')"
                        >添加书籍
                        </el-button>&nbsp;
                        <el-select
                            v-model="bookType"
                            placeholder="请选择"
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
                    <el-col :span="5">
                        <el-input
                            placeholder="请输入书籍名称"
                            v-model.trim="searchName"
                            size="medium"
                        >
                            <el-button
                                slot="append"
                                icon="el-icon-search"
                            ></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="book-list-box" :style="`height: ${notbmaxH - 48}px;`">
            <div class="book-list clearfix">
                <div class="clearfix">
                    <div class="book-child-flex">
                        <div
                        @click="jumpToPage('schoolBookinfo',{id:el.id,num:0})"
                            class="book-item"
                            v-for="(el, index) in bookList" :key="index"
                            :style="`backgroundImage: url(${el.coverUrl})`"
                            v-if="(el.boolName.indexOf(searchName) !== -1)&&(bookType==el.typeId||bookType==0)"
                        >
                            <div class="book-name" :title="el.coverUrl">
                                <div class="book-name__child">{{ el.boolName }}</div>
                                <div class="book-name__child">类型：{{ el.typeName }}</div>
                            </div>
                            <i
                                class="el-icon-delete"
                                @click.stop="delBook(el.id)"
                            ></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getReadIndependBookSchList, delReadIndependBookSch} from '@/api/readBookBeiyou';
    import {
        findSchoolDicsByCode
    } from '@/api/common/common';
    import {isShowByPermission} from "@/utils";
    export default {
        name: 'readBookSchoolList',
        data() {
            return {
                searchName: '',
                bookList: [],
                bookTypeList: [],
                bookType: 0
            };
        },
        mixins: [mixins],
        created() {
            findSchoolDicsByCode({
                dicCode: 'readIndependBookType'
            })
                .then(res => res.data)
                .then(data => {
                    this.bookTypeList = data.data;
                });
            if (!isShowByPermission('/readIndepend/thMamger')) {
                this.$router.replace('/main/homeSchool/readBookSetBeiyou/readBookList');
            } else {
                this.getReadIndependBookSchListFunc()
            }
        },
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },

            // 获取学校下的书籍
            getReadIndependBookSchListFunc() {
                getReadIndependBookSchList({})
                    .then(res => res.data)
                    .then(data => {
                        this.bookList = data.data;
                    });
            },
            // 删除学校下的书库
            delBook(id) {
                this.$confirm('确认删除此书籍, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delReadIndependBookSch({
                        bookId: id
                    }).then(res => {
                        if (res.data.code === 200 && res.data.result) {
                            this.$message.success('删除成功');
                            this.getReadIndependBookSchListFunc()
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    })
                }).catch(() => {
                });
            },
            // 列表搜索
            clickSearch() {
                this.searchName = this.searchName.trim();
                this.getReadIndependBookSchListFunc();
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
    @import "../../styles/mixin";
    .header {
    border-bottom: 1px solid #e7eaec;
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

            .header-tab-line {
                .header-tab-item {
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

                .select-item {
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
                    @include cover-bg;

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

                .add_book {
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

        .book_dialog_box {
            .book_dialog_list {
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
                            box-shadow: 0 0 5px #bbb;
                            border-radius: 13px;
                            overflow: hidden;

                            .dialog_book-name {
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

    .no_stu_msg {
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
