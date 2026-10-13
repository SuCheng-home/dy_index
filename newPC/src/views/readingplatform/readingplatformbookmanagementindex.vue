<template>
  <div class="readingplatformbookmanagementindex stack-room-wrap">
    <div class="book-list-header">
      <div class="header">
        <el-row>
          <el-col :span="19">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-select
              v-model="topSelectType"
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
            <el-button type="primary" size="medium" @click="jumpToPage('readingplatformbookmanagementerimg')">二维码下载
            </el-button>
            <el-button type="primary" size="medium" @click="initReadBook" :disabled="!isCanInit" :loading="isLoading">
              初始化
            </el-button>
          </el-col>
          <el-col :span="5">
            <el-input
              placeholder="请输入书籍名称"
              v-model.trim="searchName"
              size="medium"
              @change="clickSearch"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="clickSearch"
              ></el-button>
            </el-input>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="book-list-box" :style="`height: ${notbmaxH - 48}px;`">
      <div class="book-list clearfix">
        <div class="clearfix" v-for="(val,key,index) in dataobj" :key="index">
          <div class="clearfixtop">{{key.split(',')[1]}}</div>
          <div class="book-child-flex">
            <div @click="jumpToPage('readingplatformbookmanagementdetails',{id:item.id})"
                 class="book-item" :key="index" v-for="(item, index) in showedClassBookList(val)"
                 :style="`background: url(${item.coverUrl}) center center / cover no-repeat;`"
            >
              <div class="book-name" :title="item.boolName">
                <div class="book-name__child">{{ item.boolName }}</div>
                <div class="book-name__child">类型：{{ item.typeName }}</div>
              </div>
              <i
                class="el-icon-delete"
                @click.stop="delBook(item.id)"
              ></i>
            </div>
            <!-- 当前学期当前月才能有添加 -->
            <div
              class="book-item add-book"
              @click="addBook(key.split(',')[0],key.split(',')[1])"
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
        <div class="header">
          <el-row>
            <el-col :span="18">
              <el-select
                v-model="addSelectType"
                placeholder="请选择"
                @change="getSchoolBookLists()"
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
                @change="getSchoolBookLists()"
              >
                <el-button
                  slot="append"
                  icon="el-icon-search"
                  @click="getSchoolBookLists()"
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
  import {
    getPlayWordBookList,
    getReadPlatBookMap,
    delReadPlatBookById,
    getReadPlatBookList,
    initReadPlat,
    addReadPlatBook,
    listValue
  } from "@/api/readingplatform";

  export default {
    name: 'readBookSetList',
    data() {
      return {
        isLoading: false,
        isCanInit: true,
        classList: [],
        classId: '',
        isShowUrlLink: false,
        bookList: [],
        allBookList: [],
        dialogFormVisible: false,
        addSelectType: 0,
        bookTypeList: [],
        dialogSearchName: '',
        searchName: '',
        confirmedSearchName: '',
        selectBookIds: [],
        selectBookList: [],
        topSelectType: 0,
        dataobj: {},
        level: "",
        levelName: "",
      };
    },
    mixins: [mixins],
    created() {
      this.initList();
    },
    computed: {
      showedBookList() {
        return this.allBookList.filter(item => {
          return this.bookList.findIndex(bookItem => bookItem.bookId == item.id) === -1;
        })
      },

    },
    methods: {
      initList() {
        this.getReadPlatBookMaps();
        this.getSchoolBookLists();
        this.getReadPlatBookLists();
        listValue()
          .then(res => res.data)
          .then(data => {
            this.bookTypeList = data.data.dataList;
          });
      },
      initReadBook() {
        this.$confirm('确认初始化阅读平台书籍吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.isLoading = true;
          initReadPlat().then(res => {
            if (res.data.result) {
              this.$message.success('操作成功');
              this.initList();
            } else {
              this.$message.error(res.data.msg);
            }
            this.isLoading = false;
          })
        }).catch(() => {
          this.isLoading = false;
        });
      },
      getSchoolBookLists() {
        getPlayWordBookList({
          addbookType: 2,
          boolName: this.dialogSearchName,
          typeId: this.addSelectType
        }).then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            this.allBookList = data;
          }
        });
      },
      showedClassBookList(list) {
        return list.filter(item => {
          return item.boolName.includes(this.confirmedSearchName) && (this.topSelectType == 0 || item.typeId == this.topSelectType);
        })
      },
      jumpToPage(path, query = {}) {
        this.$router.push({
          path,
          query
        })
      },
      //获取书籍
      getReadPlatBookMaps() {
        getReadPlatBookMap()
          .then(res => res.data)
          .then(data => {
            this.dataobj = data.data;
          })
      },
      // 删除学校下的书库
      delBook(id) {
        this.$confirm('确认删除此书籍, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delReadPlatBookById(id).then(res => {
            if (res.data.result) {
              this.$message.success('删除成功');
              this.getReadPlatBookMaps();
              this.getReadPlatBookLists();
            } else {
              this.$message.error(res.data.msg);
            }
          })
        }).catch(() => {
        });
      },
      // 获取学校下的书籍
      getReadPlatBookLists() {
        getReadPlatBookList().then(res => res.data).then(data => {
          if (data.data.length) {
            this.isCanInit = false;
            this.bookList = data.data;
          } else {
            this.isCanInit = true;
          }
        });
      },
      // 列表搜索
      clickSearch() {
        this.confirmedSearchName = this.searchName;
      },
      // 点击添加书籍
      addBook(level, levelName) {
        this.level = level;
        this.levelName = levelName;
        this.dialogSearchName = '';
        this.selectBookIds = [];
        this.selectBookList = [];
        this.dialogFormVisible = true;
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
            inventory: item.inventory,
            level: this.level,
            levelName: this.levelName,
            taskRemark: item.taskRemark,
          })
        });
        addReadPlatBook(list)
          .then(res => {
            if (res.data.result) {
              this.$message.success('添加成功');
              this.getReadPlatBookMaps();
              this.getReadPlatBookLists();
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
  .clearfixtop {
    line-height: 20px;
    font-size: 16px;
    border-left: 4px solid #409eff;
    padding-left: 10px;
    margin-bottom: 10px;
  }

  .header {
    overflow: hidden;
    padding-bottom: 10px;
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
      padding-bottom: 10px;

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
          border: 1px #e7eaec solid;
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
              box-shadow: 0 0 5px #bbb;
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
