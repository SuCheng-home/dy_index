<!--通知的详情-->
<template>
    <div v-if="homework.isDelete === 1" class="app-container calendar-list-container homeworkDetail">
        <backtool>
            <router-link :to="{ path: 'addOrEditHomework',query:{id:homework.id,isCopy:false}}">
                <el-button size="medium" v-if="homework.homeworkState ===1" class="filter-item" type="primary">编辑
                </el-button>
            </router-link>
            <el-button size="medium" v-if="homework.homeworkState ===1" class="filter-item" type="primary"
                       :loading="isShowBtnLoading" @click="updateAndPubHomeworkHandler">发布
            </el-button>
            <a :href="exportURL" download="" target="_blank" v-if="homework.homeworkState ===2&& homework.isTurn === 1">
                <el-button size="medium" class="filter-item" type="primary" icon="upload">作业完成情况下载</el-button>
            </a>
        </backtool>
        <div :style="'height:'+maxH+'px;overflow: auto;'">
            <div class="ibox article" style="width:810px;margin:0 auto;'">
                <div class="ibox-content" style="border-top-width: 0;">
                    <div class="text-center article-title">
                        <h1>{{homework.title}}作业 </h1>
                        <div class="sub-title">
                            <span
                                v-if="homework.releaseDateTime!=null">发布时间:{{homework.releaseDateTime | formatTime}}</span>
                            <span v-if="homework.releaseDateTime==null">创建时间:{{homework.createTime | formatTime}}</span>
                            {{homework.createUser}}
                            &nbsp;<span>作业完成预计时间：{{homework.preFinishDur}}分钟</span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div>
                        <image-previewer tag="richtext" v-if="homework.homeworkType === 0">
                            <div class="content-container" v-html="homework.content"></div>
                        </image-previewer>
                        <div v-if="homework.homeworkType === 1">
                            <image-previewer tag="richtext">
                                <div class="content-container" v-html="homework.content"></div>
                            </image-previewer>
                        </div>
                        <hr>
                        <div class="row" v-if="!!homework.files && homework.files.length !== 0">
                            <div class="col-lg-12">
                                <div class="detail__title">
                                    附件
                                </div>
                                <div class="social-feed-box">
                                    <file-list :fileList="homework.files"></file-list>
                                </div>
                            </div>
                        </div>
                        <div class="row" v-if="!!videoList && videoList.length">
                            <div class="col-lg-12">
                                <div class="detail__title">
                                    视频
                                </div>
                                <div class="social-feed-box">
                                    <file-list :isShowTitle="false" :fileList="videoList"></file-list>
                                </div>
                            </div>
                        </div>
                        <div class="row" v-if="!!homework.pics && homework.pics.length !== 0">
                            <div class="col-lg-12">
                                <div class="detail__title">
                                    图片
                                </div>
                                <div class="social-feed-box">
                                    <image-previewer tag="richtext">
                                        <div style="margin-top:20px">
                                            <img style="width: 100px!important;height: 100px;margin-right: 10px;"
                                                 v-for="picItem in homework.pics" :src="picItem.maxPic"
                                                 :key="picItem.id">
                                        </div>
                                    </image-previewer>
                                </div>
                            </div>
                        </div>
                         <div class="row" v-if="audiosList && audiosList.length !== 0">
                            <div class="col-lg-12">
                                <div class="detail__title">
                                    语音
                                </div>
                                <div class="social-feed-box">
                                    <audio :src="item" v-for="(item, index) in audiosList" controls></audio>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="info-container">
                        <div class="col-lg-12" v-if="homework.homeworkState != 1">
                            <div>
                         <span class="list-link--finish">
                                <router-link
                                    v-if="Number.parseInt(homework.readCount) !== 0"
                                    :to="{path: 'homeworkManageReplyList', query: {type:0, homeworkId: this.$route.query.id}}">
                                    已读人数：{{ homework.readCount }}
                                </router-link>
                                <span v-else>已读人数：{{ homework.readCount }}</span>
                            </span>
                                <span class="list-link--unfinish">
                                <router-link
                                    v-if="Number.parseInt(homework.unReadCount) !== 0"
                                    :to="{path: 'homeworkManageReplyList', query: {type:2, homeworkId: this.$route.query.id}}">
                                    未读人数：{{ homework.unReadCount }}
                                </router-link>
                                <span v-else>未读人数：{{ homework.unReadCount }}</span>
                            </span>
                                <span class="list-link--finish">
                                <router-link
                                    :to="{path: 'homeworkManageReplyList', query: {type:1, homeworkId: this.$route.query.id}}">
                                    回复：{{ homework.replyCount }}
                                </router-link>
                            </span>
                                <span class="list-link--finish"
                                      v-if="homework.homeworkState===2 && homework.isTurn === 1">
                                <a
                                  v-if="Number.parseInt(homework.finishCount) !== 0"
                                  href="javascript:" @click="homeworkFinishHandle(homework,1)"
                                >
                                    已完成人数：{{ homework.finishCount }}
                                </a>
                                <span v-else>已完成人数：{{ homework.finishCount }}</span>
                            </span>
                                <span class="list-link--unfinish"
                                      v-if="homework.homeworkState===2 && homework.isTurn === 1">
                                <a
                                  v-if="Number.parseInt(homework.unfinishCount) !== 0"
                                  href="javascript:" @click="homeworkFinishHandle(homework,0)"
                                >
                                    未完成人数：{{ homework.unfinishCount }}
                                </a>
                                <span v-else>未完成人数：{{ homework.unfinishCount }}</span>
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

      <el-dialog title=" " :visible.sync="isShowDialog" width="30%" >
        <el-form ref="form" label-width="130px">
          <el-form-item label="课后服务人数" prop="name">
            <el-input-number v-model="joinCount" :step="1" :min="0" :max="9999" step-strictly></el-input-number>
          </el-form-item>
          <el-form-item label="完成作业人数" prop="name">
            <el-input-number v-model="finishCount" :step="1" :min="0" :max="9999" step-strictly></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="editStuNum">确 定</el-button>
              </span>
      </el-dialog>
    </div>
    <div v-else class="app-container calendar-list-container homeworkDetail">
        <backtool>
        </backtool>
        <default-page Mes="作业已被删除！"></default-page>
    </div>
</template>
<script>
    import {getHomeworkById, updateAndPubHomework, saveHomeworkAfterClassInfo} from '@/api/homework';
    import Backtool from '@/components/BackTool';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import FileList from '@/components/FileList/FileList.vue';

    import mixin from '@/mixins/windowResize';
    import DefaultPage from '@/components/DefaultPage';

    const recipeTypeMap = {
        1: "公共",
        2: "教师",
        3: "学生"
    };
    export default {
        data() {
            return {
              finishCount: 0,
              joinCount: 0,
              afterClassInfo: {
                finishCount: 0,
                joinCount: 0,
                workId: this.$route.query.id
              },
              homework: {
                  isDelete: 1,
                  files: []
              },
              isShowBtnLoading: false,
              isShowDialog: false,
              sendClass: [],
              videoList: [],
              audiosList: [],
              exportURL: ''
            }
        },
        filters: {
            statusFilter(type) {
                return recipeTypeMap[type]
            },
            formatTime(type) {
                return !!type ? type.substring(0, 10) : "暂未发布";
            }
        },
        components: {
            ImagePreviewer,
            Backtool,
            DefaultPage,
            FileList
        },
        mixins: [mixin],
        created() {
            getHomeworkById({
                homeworkId: this.$route.query.id
            },sessionStorage.getItem("homeworkschoolTimeId"))
                .then(res => res.data)
                .then(data => {
                    data.data.content = data.data.content.replace(/url\(['"](.*?)['"]\)/g, 'url(&quot;$1&quot;)');
                    this.homework = data.data;
                    this.afterClassInfo = data.data.afterClassInfo;
                    this.finishCount = this.afterClassInfo ? this.afterClassInfo.finishCount : 0;
                    this.joinCount = this.afterClassInfo ? this.afterClassInfo.joinCount : 0
                    /*导出*/
                    this.exportURL =
                        `${global.homeworkfetch}structure/homeWork/exportHomeworkStuList?homeworkId=${this.$route.query.id}&token=${this.$store.getters.token}&schoolTimeId=${sessionStorage.getItem("homeworkschoolTimeId")}`;
                    this.homework.files.forEach(fileItem => {
                        fileItem.fileName = fileItem.fileName ? fileItem.fileName : fileItem.originalFileName;
                    });
                    if (this.homework.videoJson) {
                        this.videoList = JSON.parse(this.homework.videoJson);
                        this.videoList.forEach(v => {
                            if (v.videoUrl) {
                                v = Object.assign({},v,{fileUrl:v.videoUrl})
                            }
                        })
                        console.log(this.videoList,'11')
                    }
                    if (this.homework.audiosJson) {
                        this.audiosList = JSON.parse(this.homework.audiosJson);
                    }
                    this.sendClass = data.data.departs.map(departItem => {
                        return departItem.name
                    })
                })
        },
        methods: {
          editStuNum() {
            saveHomeworkAfterClassInfo({
              finishCount: this.finishCount || 0,
              joinCount: this.joinCount || 0,
              workId: this.$route.query.id,
              schoolTimeId: this.homework.schoolTimeId
            }).then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: 'success',
                  message: '提交成功!'
                });
                this.afterClassInfo.finishCount = this.finishCount;
                this.afterClassInfo.joinCount = this.joinCount;
                this.isShowDialog = false;
              } else {
                this.$message.error(res.data.msg);
              }
            })
          },
          homeworkFinishHandle(homework, type) {
              if (homework.publishType === 0 && homework.walkClassIds.length == 0 && homework.departs && homework.departs.length !== 1) {
                  this.$router.push({
                      path: 'homeworkClassList',
                      query: {
                          type: type,
                          homeworkId: this.$route.query.id
                      }
                  })
              } else {
                  this.$router.push({
                      path: 'homeworkManageFinishList',
                      query: {
                          type: type,
                          homeworkId: this.$route.query.id
                      }
                  })
              }
          },
          updateAndPubHomeworkHandler() {
              this.isShowBtnLoading = true;
              updateAndPubHomework(this.$route.query.id,sessionStorage.getItem("homeworkschoolTimeId"))
                  .then(res => {
                      this.isShowBtnLoading = false;
                      if (res.data.code === 200) {
                          this.$message({
                              type: 'success',
                              message: '发布成功!'
                          });
                          this.$router.back();
                      }
                  })

          },
        }
    }
</script>
<style lang="scss">
    @import "../../styles/mixin";

    .homeworkDetail {
        font-size: 15px;
        line-height: 26px;
        color: #676A6C;
        word-wrap: break-word;
        word-break: break-all;
        .article {
            color: #2f4050;
            line-height: 1.1em;
        }
        .content-container {
            min-height: 250px;
        }
        .article h1 {
            font-size: 38px;
            color: #2f4050;
            line-height: 1.1em;
            text-align: center;
            margin-bottom: 10px;
        }

        .article .detail__title {
            margin: 22px 0 14px 0;
            border-left: 4px solid #409EFF;
            padding-left: 12px;
            height: 16px;
            line-height: 16px;
        }

        .article hr {
            height: 1px;
            border: 0;
            border-top: 1px solid #d0d0d0;
        }

        .article p {
            font-size: 15px;
            line-height: 26px;
            color: #676A6C;
            word-wrap: break-word;
            word-break: break-all;
        }

        .article img {
            width: 100%;
        }

        .article table {
            width: 100%;
        }

        .article table td {
            border: 1px solid black;
        }

        .sub-title {
            text-align: center;
            color: #606266;
            margin-bottom: 10px;
            font-size: 15px;
            line-height: 26px;
            word-break: break-all;
        }

        .hasread-small {
            padding: 2px;
            border-radius: 2px;
            display: inline-block;
            padding-right: 4px;
        }

        .notice-content {
            min-height: 250px;
        }

        .clear {
            clear: both;
        }

        .range-list {
            margin: 10px;
        }

        .article .social-feed-box:last-child {
            margin-bottom: 0;
        }

        .range-item {
            height: 30px;
            display: block;
            float: left;
            margin-left: 4px;
            margin-top: 4px;
        }

        .range-item-img {
            height: 28px;
            width: 28px;
            display: block;
            float: left;
            background-position: center center;
            background-size: cover;
        }

        .range-item-des {
            padding-left: 4px;
            line-height: 30px;
            padding-right: 4px;
            color: #676A6C;
            font-size: 13px;
        }

        .social-feed-box {
            background: #fff;
            margin-bottom: 15px;
        }


        .image {
            max-width: 50% !important;
        }

        .video {
            max-width: 50% !important;
        }

        .el-form-item__content {
            line-height: inherit !important;
        }


        .list-link--finish a, .list-link--finish span {
            color: #337AB7 !important;
            margin-right: 70px;
        }

        .list-link--unfinish a, .list-link--unfinish span {
            color: #EF4F4F !important;
            margin-right: 70px;
        }
        .info-container {
            padding-top: 20px;
        }
    }

</style>

