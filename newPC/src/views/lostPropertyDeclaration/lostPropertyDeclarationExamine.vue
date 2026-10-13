<template>
  <div
    class="lostPropertyDeclarationExamine"
    style="width: 100%;"
  >
    <back-tool>

      <el-button
        type="primary"
        size="medium"
        v-if="auditStatus == 0"
        @click="submitForm(1)"
      >发布</el-button>
      <el-button
        type="primary"
        size="medium"
        v-if="auditStatus == 0"
        @click="dialogVisible = true"
      >不同意</el-button>

      
    </back-tool>
    <div
      class="mainRepairContent"
      :style="`height: ${nobottommaxH}px;`"
    >
      <div class="body">
        <div class="title">{{announcementType==1?"寻物启事详情":"招领启事详情"}}</div>
        <el-form
          ref="ruleForm"
          label-width="140px"
        >
          <el-form-item
            v-show="declareUserName!=''"
            label="失主姓名："
          >
            <div>{{declareUserName}}</div>
          </el-form-item>
          <el-form-item
            v-show="declareUserPhone!=''"
            label="失主手机："
          >
            <div>{{declareUserPhone}}</div>
          </el-form-item>
          <el-form-item
            v-show="announcementType==1"
            label="申报时间："
          >
            <div>{{createDate|formatTimeFilter}}</div>
          </el-form-item>
          <el-form-item
            v-show="announcementType==2"
            label="发布时间："
          >
            <div>{{createDate|formatTimeFilter}}</div>
          </el-form-item>
          <el-form-item
            v-show="inscribeDeptName!=''"
            label="落款部门："
          >
            <div>{{inscribeDeptName}}</div>
          </el-form-item>
          <el-form-item
            v-show="announcementType==1"
            label="失物描述："
          >
            <div>{{content}}</div>
          </el-form-item>
          <el-form-item
            v-show="announcementType==2"
            label="物品描述："
          >
            <div>{{content}}</div>
          </el-form-item>
          <el-form-item
            v-if="lostSearchPicList.length>0"
            v-show="announcementType==1"
            label="失物图片："
          >
            <div
              class="repairimgs imgfack"
              v-if="lostSearchPicList.length>0"
            >
              <image-previewer tag="richtext" v-show="photoUrlArr.length">
                    <span class="img" :key="index" v-for="(item, index) in photoUrlArr">
                        <img :src="item.src">
                    </span>
                </image-previewer>
            </div>
          </el-form-item>
          <el-form-item
            v-if="lostSearchPicList.length>0"
            v-show="announcementType==2"
            label="物品图片："
          >
            <div
              class="repairimgs imgfack"
              v-if="lostSearchPicList.length>0"
            >
               <image-previewer tag="richtext" v-show="photoUrlArr.length">
                    <span class="img" :key="index" v-for="(item, index) in photoUrlArr">
                        <img :src="item.src">
                    </span>
                </image-previewer>
            </div>
          </el-form-item>
          <el-form-item
            v-show="auditStatus == 2"
            label="驳回原因："
          >
            <div>{{auditContent}}</div>
          </el-form-item>

        </el-form>

      </div>
    </div>
    <el-dialog
      title="驳回"
      top="25vh"
      width="45%"
      style="min-height: 500px"
      :visible.sync="dialogVisible"
    >
      <el-form>
        <el-form-item>
          <el-input
            placeholder="请输入驳回原因"
            type="textarea"
            :rows="5"
            v-model="auditContent"
          ></el-input>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="submitForm(2)"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
//返回组件
import BackTool from "@/components/BackTool";
//获取详情的方法
import { searchFountDetails } from "@/api/lostPropertyDeclaration";
import mixin from "@/mixins/windowResize";
//图片预览
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import { auditSearchFoundAnnouncement } from "@/api/lostPropertyDeclaration";

export default {
  name: "lostPropertyDeclarationDetails",
  components: {
    ImagePreviewer,
    BackTool,
  },
  data() {
    return {
      listQuery: {
        searchFoundId: this.$route.query.id,
        submitRead: 0,
      },
      inscribeDeptName: "",
      content: "",
      createDate: "",
      lostSearchPicList: [],
      declareUserName: "",
      declareUserPhone: "",
      readCount: "",
      id: "",
      announcementType: "",
      photoUrlArr: [],

      auditContent: "",
      createId: "",
      departJson: [],
      publishType: "",
      dialogVisible: false,
    };
  },
  created() {
    let id = this.$route.query.id;
    searchFountDetails(this.listQuery).then((res) => {
      let data = res.data.data;
      this.inscribeDeptName = data.inscribeDeptName;
      this.content = data.content;
      this.createDate = data.createDate;
      this.lostSearchPicList = data.lostSearchPicList;
      this.declareUserName = data.declareUserName;
      this.declareUserPhone = data.declareUserPhone;
      this.readCount = data.readCount;
      this.id = data.id;
      this.announcementType = data.announcementType;
      this.photoUrlArr = data.lostSearchPicList.map((entry) => ({
        src: entry.picUrl,
      }));

      this.auditStatus = data.auditStatus;
      this.auditContent = data.auditContent || "";
      this.createId = data.createId;
      this.departJson = data.departJson;
      this.publishType = data.publishType;
    });
  },
  filters: {
    formatTimeFilter(date) {
      return date.split(".")[0];
    },
  },
  mixins: [mixin],
  methods: {
    auditSearchFoundAnnouncement(form) {
      auditSearchFoundAnnouncement(form)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          this.$message({
            message: "审核成功",
            type: "success",
          });
          this.$router.back();
        })
        .catch((msg) => {
          this.$message({
            message: msg,
            type: "error",
          });
        });
    },

    submitForm(state) {
      if (state == 2) {
        if (!this.auditContent) {
          this.$message({
            message: "请输入驳回原因",
            type: "error",
          });
          return;
        }
      }
      let form = {
        id: this.id,
        announcementType: this.announcementType,
        auditContent: this.auditContent,
        createId: this.createId,
        departJson: this.departJson,
        publishType: this.publishType,
        auditStatus: state,
      };
      this.auditSearchFoundAnnouncement(form);
    },
  },
};
</script>
<style scoped>
.lostPropertyDeclarationExamine .link-type {
  margin-left: 20px;
}

.mainRepairContent {
  padding-top: 20px;
  overflow: auto;
}
 .img img {
        width: 80px;
        height: 80px;
        margin: 10px;
    }
.dealcontent {
  border: 1px solid #9ea7b3;
  border-radius: 5px;
}
.body {
  width: 810px;
  margin: 0 auto;
}
.dealcontent > p {
  padding: 0 15px;
  margin: 0;
}

.repairimgs .images {
  width: 100px;
  height: 100px;
  margin: 5px;
  display: inline-block;
}

.imgfack.repairimgs {
  min-height: 110px;
}

.lostPropertyDeclarationExamine {
  padding:12px;
}
</style>
<style lang="scss" scoped>
.menu-tools {
  position: relative;
}
.lostPropertyDeclarationExamine .title {
  height: 20px;
    line-height: 20px;
    margin: 10px;
    padding-left: 8px;
    border-left: 4px solid #409EFF;
    color: #333;
}
</style>