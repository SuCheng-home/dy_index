<template>
  <div class="mental-education-consulting-detail-index">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
        <el-button
          type="primary"
          size="medium"
          v-if="isShowHandleBtn"
          @click="gotoReply"
          >回复</el-button
        >
        <address-book
          :isbutton="true"
          :config="configData"
          v-if="isShowTransferBtn"
          v-model="form.addressData"
          >转办</address-book
        >
      </el-col>
    </el-row>
    <div class="detail-wrapper" :style="{ height: nobottommaxH - 10 + 'px' }">
      <div class="detail-title">基本信息</div>
      <el-form label-width="140px">
        <el-form-item label="家长身份">{{ nick }}</el-form-item>
        <el-form-item label="年龄">{{ age }}</el-form-item>
        <el-form-item label="学历">{{ education }}</el-form-item>
        <el-form-item label="姓名" v-if="isShowName == 2">{{
          studentName
        }}</el-form-item>
        <el-form-item label="性别">{{ sex | filterGender }}</el-form-item>
        <el-form-item label="年级" v-if="isShowGrade == 2">{{
          gradeLevelName
        }}</el-form-item>
        <el-form-item label="独生子女">{{
          isOnly == 1 ? "是" : brotherSister
        }}</el-form-item>
        <el-form-item label="问题类别"
          >{{ groupName }}（{{ groupRemark }}）</el-form-item
        >
      </el-form>
      <div class="detail-title">咨询与回复</div>
      <div class="main-wrapper">
        <div class="no_list_msg" v-if="isEmpty">
          <img
            src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png"
            alt
          />
          <div>暂无数据</div>
        </div>
        <div v-else>
          <div
            class="consult-reply-item"
            :key="idx"
            v-for="(consultReply, idx) in consultReplyList"
          >
            <div class="consult" v-if="consultReply.consult">
              <div class="info-wrapper">
                <span v-show="isShowName == 2"
                  >{{ studentName }}{{ nick }}</span
                >
                {{ consultReply.consult.createTime | filterDate }}
              </div>
              <div class="content-wrapper">
                <div class="small-title">问题描述：</div>
                <div class="content">
                  <pre v-html="consultReply.consult.content"></pre>
                </div>
                <image-previewer
                  class="image-plate"
                  :images="getViewPic(consultReply.consult.photoJson)"
                  tag="img"
                ></image-previewer>
                <div class="small-title">其他相关信息：</div>
                <div class="content">
                  <pre v-html="consultReply.consult.eleContent"></pre>
                </div>
                <image-previewer
                  class="image-plate"
                  :images="getViewPic(consultReply.consult.elsePhotoJson)"
                  tag="img"
                ></image-previewer>
              </div>
            </div>
            <div class="reply" v-if="consultReply.reply">
              <div class="info-wrapper">
                <span v-if="isShowReplayName == 2"
                  >{{ consultReply.reply.createUserName }}老师</span
                >
                <span>{{ consultReply.reply.createTime | filterDate }}</span>
                <span
                  style="vertical-align: middle; font-size: 18px"
                  v-if="
                    idx == consultReplyList.length - 1 &&
                    batchUserIdList.includes(userInfo.id) &&
                    state != 4
                  "
                  @click="handleDelete(consultReply.reply)"
                >
                  <i class="el-icon-delete" style="color: #f56c6c"></i>
                </span>
              </div>
              <div class="content-wrapper">
                <div
                  class="content"
                  v-show="
                    consultReply.reply.content &&
                    consultReply.reply.content.length
                  "
                >
                  <pre v-html="consultReply.reply.content"></pre>
                </div>
                <image-previewer
                  class="image-plate"
                  tag="img"
                  v-if="getViewPic(consultReply.reply.photoJson).length"
                  :images="getViewPic(consultReply.reply.photoJson)"
                ></image-previewer>
                <audio-recorder
                  :audios="consultReply.reply.voiceJson"
                  :playOnly="true"
                  v-if="
                    consultReply.reply.voiceJson &&
                    consultReply.reply.voiceJson.length
                  "
                ></audio-recorder>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="detail-title" v-if="state == 4">评价信息</div>
      <div class="evaluate-wrapper" v-if="state == 4">
        <el-rate v-model="score" disabled text-color="#ff9900"></el-rate>
        <div class="compContent">
          <pre v-html="compContent"></pre>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";

/* components */
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import AddressBook from "@/components/AddressBook/indexExpand";
import AudioRecorder from "@/components/AudioRecorder";

/* api */
import {
  getHeartEduInit,
  getHeartEduConsultById,
  getHeartEduConsultReplyListAll,
  delHeartEduConsultReply,
  complaintHeartEduConsult,
} from "@/api/homeSchool/mentalEducation/consulting/detail/index";

export default {
  name: "mentalEducationConsultingDetailIndex",
  mixins: [mixin],
  components: { ImagePreviewer, AddressBook, AudioRecorder },
  filters: {
    filterGender(gender) {
      return gender == 2 ? "女" : "男";
    },
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
  },
  watch: {
    "form.addressData"(addressData) {
      if (addressData.userJson && addressData.userJson.length) {
        let user = addressData.userJson[0];
        let form = {
          complaintUserId: user.id,
          complaintUserName: user.name,
          id: this.consultId,
          groupName: this.groupName,
        };
        if (
          Array.isArray(this.consultReplyList) &&
          this.consultReplyList.length
        ) {
          let lastConsultReply = this.consultReplyList[
            this.consultReplyList.length - 1
          ];
          if (lastConsultReply.reply) {
            form.lastReplyId = lastConsultReply.reply.id;
            form.lastType = lastConsultReply.reply.type;
          } else {
            form.lastReplyId = lastConsultReply.consult.id;
            form.lastType = lastConsultReply.consult.type;
          }
        } else {
          form.lastReplyId = 0;
          form.lastType = 0;
        }
        this.complaintHeartEduConsult(form);
      } else {
        this.$message({
          message: "请选择转办人",
          type: "error",
        });
      }
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
    isShowHandleBtn() {
      if (this.isComplaint == 1) {
        return true;
      } else {
        if (
          this.state == 1 &&
          this.batchUserIdList.includes(this.userInfo.id)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
    isShowTransferBtn() {
      if (this.isComplaint == 1) {
        return true;
      } else {
        if (
          this.state != 4 &&
          this.batchUserIdList.includes(this.userInfo.id)
        ) {
          return true;
        } else {
          return false;
        }
      }
    },
  },
  data() {
    return {
      isEmpty: false,
      // 地址簿参数
      configData: {
        title: "选择转办人",
        depart: { target: "user", departType: "t", userTypes: "1" },
        SingleChose: true,
        notCheckSchool: true,
      },
      // 咨询id
      consultId: this.$route.query.consultId,
      // 昵称
      nick: "",
      // 年龄
      age: "",
      // 学历
      education: "",
      // 学生姓名
      studentName: "",
      // 性别
      sex: "",
      // 年级
      gradeLevelName: "",
      // 是否独生子女
      isOnly: "",
      // 是否有兄弟姐妹
      brotherSister: "",
      // 分组名称
      groupName: "",
      // 分组描述
      groupRemark: "",
      // 是否转办1未回复过，2已复过，3已转办
      isComplaint: 1,
      // 处理人列表
      batchUserIdList: [],
      consultReplyList: [],
      // 请求表单
      form: {
        addressData: [],
        // 转办人
        userJson: {},
      },
    };
  },
  created() {
    this.getHeartEduInit();
  },
  methods: {
    // 根据学校id查询初始化设置
    getHeartEduInit() {
      getHeartEduInit()
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.isShowGrade = data.isShowGrade;
            this.isShowName = data.isShowName;
            this.isShowReplayName = data.isShowReplayName;

            this.getHeartEduConsultById();
            this.getHeartEduConsultReplyListAll();
          }
        });
    },

    // 根据学生id查询咨询列表
    getHeartEduConsultById() {
      getHeartEduConsultById({
        consultId: this.consultId,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.nick = data.nick;
            this.age = data.age;
            this.education = data.education;
            this.studentName = data.studentName;
            this.sex = data.sex;
            this.gradeLevelName = data.gradeLevelName;
            this.isOnly = data.isOnly;
            this.brotherSister = JSON.parse(
              data.brotherSister || "[]"
            ).toString();
            this.groupName = data.groupName;
            this.groupRemark = data.groupRemark;
            this.state = data.state;
            this.score = data.score;
            this.compContent = data.compContent;
            this.isComplaint = data.isComplaint;
            this.batchUserIdList = data.batchUserIdList;
          }
        });
    },
    // 根据咨询id查询回复列表
    getHeartEduConsultReplyListAll() {
      getHeartEduConsultReplyListAll({
        consultId: this.consultId,
        userType: 2,
      })
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            let consultReplyList = [];
            data.forEach((item, idx) => {
              item.photoJson = this.formatImgJson(item.photoJson);
              item.elsePhotoJson = this.formatImgJson(item.elsePhotoJson);
              item.voiceJson = JSON.parse(item.voiceJson || "[]").map(
                (audioItem) => audioItem.voiceUrl
              );
              if (idx % 2 == 0) {
                consultReplyList.push({
                  consult: item,
                });
              } else {
                consultReplyList[consultReplyList.length - 1]["reply"] = item;
              }
            });
            this.consultReplyList = consultReplyList;
            if (this.consultReplyList.length) {
              this.isEmpty = false;
            } else {
              this.isEmpty = true;
            }
          }
        });
    },

    // 转办咨询
    complaintHeartEduConsult(form) {
      complaintHeartEduConsult(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "转办成功",
            type: "success",
          });
          this.$router.back();
        });
    },

    // 删除咨询回复
    delHeartEduConsultReply(form) {
      delHeartEduConsultReply(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "删除成功",
            type: "success",
          });
          this.$router.back();
        });
    },

    // 删除
    handleDelete(item) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error",
        lockScroll: false,
      })
        .then(() => {
          let form = {
            consultId: this.consultId,
            replyId: item.id,
            type: 2,
          };
          this.delHeartEduConsultReply(form);
        })
        .catch(() => {});
    },

    // 格式化图片 json
    formatImgJson(imgJson) {
      return JSON.parse(imgJson || "[]").map((item) => ({
        fileUrl: item.photoUrl,
      }));
    },

    getViewPic(photoList) {
      if (photoList) {
        return photoList.map((item) => ({ src: item.fileUrl }));
      }
      return [];
    },

    // 回复
    gotoReply() {
      this.$router.push({
        path: "reply",
        query: {
          consultId: this.consultId,
        },
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.mental-education-consulting-detail-index {
  padding:12px;

  .el-col {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
    margin-bottom: 10px;
  }

  .el-form {
    width: 810px;
    margin: 0 auto;
    overflow: auto;
    .el-form-item {
      margin-bottom: 0;
    }
    /deep/ .el-form-item__label {
      color: #909399;
    }
    /deep/ .el-form-item__content {
      padding-left: 18px;
    }
  }

  pre {
    margin: 0;
    font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB,
      Microsoft YaHei, Arial, sans-serif;
    white-space: pre-wrap; /* css-3 */
    white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
    white-space: -pre-wrap; /* Opera 4-6 */
    white-space: -o-pre-wrap; /* Opera 7 */
    word-wrap: break-word; /* Internet Explorer 5.5+ */
  }

  .detail-wrapper {
    overflow: auto;
    padding-bottom: 50px;
  }

  .detail-title {
    width: 810px;
    margin: 22px auto 14px;
    border-left: 4px solid #409eff;
    padding-left: 12px;
    height: 16px;
    line-height: 16px;
    font-size: 15px;
    color: #676a6c;
    font-weight: bold;
    .danger {
      color: #f56c6c;
    }
  }

  .main-wrapper {
    width: 810px;
    margin: 0 auto;
    background: #fff;
    padding: 7px 15px;
    color: #303133;
    .info-wrapper {
      margin-bottom: 5px;
      color: #909399;
      font-size: 12px;
    }
    .content-wrapper {
      padding: 15px 30px;
      border-radius: 5px;
      margin-bottom: 10px;
      overflow: hidden;
      :last-child {
        margin: 0 !important;
      }
      .small-title {
        margin: 10px 0;
      }
      .content {
        font-size: 14px;
        margin-bottom: 10px;
      }
      /deep/ .images {
        width: 80px;
        height: 80px;
        margin: 20px 20px 20px 0;
      }
    }
    .consult {
      margin-bottom: 30px;
      .info-wrapper {
        text-align: left;
      }
      .content-wrapper {
        margin-right: 100px;
        background: rgb(251, 249, 254);
      }
    }
    .reply {
      margin-bottom: 30px;
      .info-wrapper {
        text-align: right;
      }
      .content-wrapper {
        margin-left: 100px;
        // background: rgb(151, 236, 107);
        background: rgb(225, 243, 216);
      }
    }
    /deep/ #voice-play {
      width: 30px;
      height: 30px;
      margin: 0;
    }
  }
  .evaluate-wrapper {
    width: 810px;
    margin: 0 auto;
    padding: 7px 15px;
    .compContent {
      font-size: 14px;
      margin-top: 10px;
    }
  }

  .no_list_msg {
    font-size: 14px;
    text-align: center;
    color: #999;
    overflow: hidden;
    img {
      margin-top: 50px;
    }
    div {
      margin-top: -50px;
    }
  }
}
</style>