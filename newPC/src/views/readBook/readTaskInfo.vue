<template>
  <div class="read_task_info_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="sendTask" v-if="taskStatus === 1">发布</el-button>
      <el-button size="medium" type="primary" @click="taskCardRecord"
                 v-else-if="taskStatus === 2 && todayDate >= taskInfo.startDate">打卡记录
      </el-button>
    </div>
    <div class="read_task_info_box" :style="`height:${nobottommaxH}px`">
      <div class="read_task_info_list">
        <div class="book_title_box">
          <div class="book_img">
            <img :src="bookInfo.coverUrl" alt="">
          </div>
          <div class="book_title">
            <div class="title">{{bookInfo.boolName}}</div>
            <div>书籍类别：{{bookInfo.typeName}}</div>
          </div>
        </div>
        <el-form ref="ruleForm" label-width="80px" class="demo-ruleForm">
          <el-form-item label="主题">{{taskInfo.title}}</el-form-item>
          <el-form-item label="阅读周期">{{taskInfo.startDate}}~{{taskInfo.endDate}}</el-form-item>
          <el-form-item label="发布范围">{{taskInfo.classNames}}</el-form-item>
          <el-form-item label="阅读心得">{{taskInfo.isPublicRead === 1 ? '公开' : '未公开'}}</el-form-item>
          <el-form-item label="任务描述">
            <image-previewer tag="richtext">
              <div class="content-container">
                <div class="content" v-html="taskInfo.content">
                </div>
              </div>
            </image-previewer>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
  import {getPlayWordBookById} from "@/api/library";
  import {getLanguageBookTask, sendLanguageBookTask} from '@/api/stackRoom';

  export default {
    name: 'readTaskInfo',
    components: {
      ImagePreviewer
    },
    data() {
      return {
        todayDate: this.$moment(new Date()).format('YYYY-MM-DD'),
        taskId: this.$route.query.taskId,
        recordState: this.$route.query.recordState,
        taskStatus: 0,
        taskInfo: {},
        bookInfo: {}
      }
    },
    mixins: [mixins],
    created() {
      this.getLanguageBookTask();
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getLanguageBookTask() {
        getLanguageBookTask({taskId: this.taskId}).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.taskInfo = data;
            this.taskInfo.classNames = JSON.parse(data.classJson).map(item => item.name).toString();
            this.taskStatus = data.state;
            this.getPlayWordBookById();
          }
        });
      },
      getPlayWordBookById() {
        getPlayWordBookById(this.taskInfo.bookId).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.bookInfo = data;
          }
        });
      },
      // 发布任务
      sendTask() {
        this.$confirm('是否发布当前任务？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.sendLanguageBookTask();
        }).catch(() => {
        });
      },
      sendLanguageBookTask() {
        sendLanguageBookTask({
          id: this.taskId,
          state: 2
        }).then(res => {
          if (res.data.code === 200 && res.data.result) {
            this.$message.success('发布成功');
            this.getLanguageBookTask();
          } else {
            this.$message.warning(res.data.msg);
          }
        });
      },
      taskCardRecord() {
        this.$router.push({path: 'readTaskRecords', query: {taskId: this.taskId, startDate: this.taskInfo.startDate, endDate: this.taskInfo.endDate}})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .read_task_info_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      border-bottom: 1px solid #eee;
    }

    .read_task_info_box {
      overflow-x: hidden;
      overflow-y: auto;

      .read_task_info_list {
        width: 810px;
        margin: 0 auto;

        .book_title_box {
          display: flex;
          padding: 20px 0;

          .book_img {
            width: 140px;
            height: 200px;
            margin-right: 20px;

            img {
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
      }
    }
  }
</style>

<style scoped>
  .read_task_info_wrap .el-form-item__label {
    font-weight: 700;
    color: #333;
  }
</style>
