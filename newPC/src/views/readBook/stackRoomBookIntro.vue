<template>
  <div class="book_intro_wrap">
    <!-- <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="书籍介绍" name="intro"> -->
        <div class="header">
      <el-button  size="medium" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary"  v-if="isNeedRead==1" @click="updateLanguageBook(2)">取消必读</el-button>
      <el-button size="medium" type="primary" v-else @click="updateLanguageBook(1)" >设为必读</el-button>
      
      <el-button size="medium" type="primary" @click="stackRoomReactionList()">读后感</el-button>
      <el-button size="medium" type="primary" @click="homeworkdesign()">作业设计</el-button>
    </div>
    <div class="book_intro_box" :style="`height: ${nobottommaxH - 10}px;`">
      <div class="book_title_box">
        <div class="book_img">
          <img class="bidu" v-if="isNeedRead==1" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/bidu.png" alt="" srcset="">
          <img class="img" :src="bookInfo.coverUrl" alt="">
        </div>
        <div class="book_title">
          <div class="title">{{bookInfo.boolName}}</div>
          <div>书籍类别：{{bookInfo.typeName}}</div>
        </div>
      </div>
      <div class="book_remark_box">
        <div v-html="bookInfo.introduce"></div>
      </div>
    </div>
      <!-- </el-tab-pane>
      <el-tab-pane label="读后感" name="reaction"></el-tab-pane>
    </el-tabs>     -->
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getBookInfo,updateLanguageBook,getLanguageBook} from '@/api/stackRoom';

  export default {
    name: "stackRoomBookIntro",
    data() {
      return {
        bookId: this.$route.query.bookId,
        activeName: 'intro',
        bookInfo: {},
        isNeedRead:2
      }
    },
    mixins: [mixins],
    created() {
      this.getBookInfo();
    },
    methods: {
            updateLanguageBook(isNeedRead) {
                this.$confirm('是否设置'+(isNeedRead==1?'必读':'非必读')+'当前书籍？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateLanguageBook({
                    bookId: this.bookId,
                    isNeedRead:isNeedRead
                    }).then(res => {
                        if (res.data.code === 200 && res.data.result) {
                            this.$message.success('设置成功');
                            this.getBookInfo();
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    });
                }).catch(() => {
                });
            },
      stackRoomReactionList() {
          this.$router.push({path: 'stackRoomReactionList', query: {bookId: this.bookId}})
      },
      homeworkdesign() {
          this.$router.push({path: 'homeworkdesign', query: {bookId: this.bookId,name:this.bookInfo.boolName}})
      },
      goBack() {
        this.$router.back()
      },
      getBookInfo() {
        getBookInfo({bookId: this.bookId}).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.bookInfo = data;
          }
        });
        getLanguageBook(this.bookId).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.isNeedRead = data.isNeedRead;
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .book_intro_wrap {
    padding: 12px;
    .header {
      padding-bottom:10px;
      border-bottom: 1px solid #eee;
    }

    .book_intro_box {
      overflow-x: hidden;
      overflow-y: auto;

      .book_title_box {
        display: flex;
        padding: 20px 30px;

        .book_img {
          width: 140px;
          height: 200px;
          margin-right: 20px;
          position: relative;
          .bidu{
            position: absolute;
            right: 0;
            top:0;
            height: 50px;
          }
          .img {
            display: block;
            width: 100%;
            height: 100%;
          }
        }

        .book_title {
          flex: 1;
          line-height: 40px;
          color: #666;

          .title {
            font-size: 20px;
            font-weight: bold;
            color: #333;
          }
        }
      }

      .book_remark_box {
        padding: 20px 30px;
        overflow: hidden;
      }
    }
  }
</style>
