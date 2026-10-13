<template>
  <div class="book_reaction_wrap">
    <!-- <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
      <el-tab-pane label="书籍介绍" name="intro"></el-tab-pane>
      <el-tab-pane label="读后感" name="reaction"> -->
        <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="addReaction('')" v-show="isBookManager">添加读后感</el-button>
    </div>
    <div class="book_reaction_box" v-if="bookReactionList.length">
      <div class="reaction_list" :style="`height: ${nobottommaxH - 70}px;`">
        <div class="reaction_item" :key="item.id" v-for="item in bookReactionList">
          <div class="reaction_title">
            <i class="el-icon-star-on"  v-if="item.isEssence==1" style="    font-size: 20px;  color: red;"></i>
            <span>{{item.className}}</span>
            <span>{{item.studentName}}</span>
            <span>{{item.createTime | filterTime}}</span>
            <span class="edit_text" @click="addReaction(item.id)" v-show="isBookManager">编辑</span>
            <span class="delete_text" @click="delCurrentInfo(item.id)" v-show="isBookManager">删除</span>
            <span class="edit_text" @click="updateLanguageBookReaction(item.id,2,item.studentId)"  v-if="item.isEssence==1" v-show="isBookManager">取消加精</span>
            <span class="edit_text" @click="updateLanguageBookReaction(item.id,1,item.studentId)" v-else v-show="isBookManager">加精</span>
            
          </div>
          <div class="reaction_remark">
            <div v-html="item.content"></div>
          </div>
          <div v-show="item.fileList && item.fileList.length">
            <file-list :fileList="item.fileList"></file-list>
          </div>
        </div>
      </div>
      <div class="pagination-container" style="margin-top: 15px;">
        <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                       :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                       :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="pagination.total">
        </el-pagination>
      </div>
    </div>
    <div class="no_stu_msg" v-else :style="`height: ${maxH - 45}px;`">
      <img src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png" alt="">
      <div>暂无读后感</div>
    </div>
      <!-- </el-tab-pane>
    </el-tabs> -->
    
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import FileList from '@/components/FileList/FileList.vue';
  import {possessRole, getLanguageBookReactionList, delLanguageBookReaction,updateLanguageBookReaction} from '@/api/stackRoom';

  export default {
    name: "stackRoomReactionList",
    components: {
      FileList
    },
    data() {
      return {
        isBookManager: false,
        bookId: this.$route.query.bookId,
        activeName: 'reaction',
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: null
        },
        bookReactionList: []
      }
    },
    mixins: [mixins],
    filters: {
      filterTime(date) {
        return date ? date.slice(0, 10) : ''
      }
    },
    created() {
      this.possessRole();
      this.getLanguageBookReactionList();
    },
    methods: {
        updateLanguageBookReaction(id,isEssence,studentId) {
                this.$confirm('是否'+(isEssence==1?'加精':'取消加精')+'当前读后感？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateLanguageBookReaction({
                    id: id,
                    isEssence:isEssence,
                    studentId:studentId
                    }).then(res => {
                        if (res.data.code === 200 && res.data.result) {
                            this.$message.success('操作成功');
                             this.getLanguageBookReactionList();
                        } else {
                            this.$message.warning(res.data.msg);
                        }
                    });
                }).catch(() => {
                });
            },
      handleClick(val) {
        if (val.name === 'intro') {
          this.$router.replace({path: 'stackRoomBookIntro', query: {bookId: this.bookId}})
        }
      },
      goBack() {
        this.$router.back()
      },
      possessRole() {
        possessRole().then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.isBookManager = data.result
          }
        });
      },
      addReaction(reactionId) {
        if (reactionId) {
          this.$router.push({path: 'stackRoomReactionAdd', query: {reactionId: reactionId, bookId: this.bookId}})
        } else {
          this.$router.push({path: 'stackRoomReactionAdd', query: {bookId: this.bookId}})
        }
      },
      getLanguageBookReactionList() {
        getLanguageBookReactionList({
          bookId: this.bookId,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize
        }).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.bookReactionList = data.dataList.map(item => {
              item.fileList = JSON.parse(item.fileJson);
              return item;
            });
            this.pagination.total = data.pagination.total;
          }
        });
      },
      delCurrentInfo(reactionId) {
        this.$confirm('是否删除当前读后感？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.delLanguageBookReaction(reactionId);
        }).catch(() => {
        });
      },
      delLanguageBookReaction(reactionId) {
        delLanguageBookReaction({reactionId: reactionId}).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('删除成功');
            this.getLanguageBookReactionList();
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      },
      sizeChangeHandler() {
        this.pagination.pageNo = 1;
        this.getLanguageBookReactionList();
      },
      currentChangeHandler() {
        this.getLanguageBookReactionList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .book_reaction_wrap {
    padding: 12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .book_reaction_box {
      .reaction_list {
        overflow-x: hidden;
        overflow-y: auto;
        width: 97%;
        margin: 10px auto 0;

        .reaction_item {
          padding: 10px 0;

          .reaction_title {
            height: 30px;
            line-height: 30px;
            margin-bottom: 10px;
            color: #333;

            span {
              margin-right: 8px;
            }

            .edit_text {
              color: #409eff;
              cursor: pointer;
            }

            .delete_text {
              color: #F56C6C;
              cursor: pointer;
            }
          }

          .reaction_remark {
            margin-bottom: 10px;
            color: #666;
          }

          & + .reaction_item {
            border-top: 1px solid #eee;
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
</style>
