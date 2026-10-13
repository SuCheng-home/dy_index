<template>
  <div class="repair-detail">
    <el-row>
      <el-col :span="24">
        <el-button @click="$router.back()" size="medium">返回</el-button>
      </el-col>
    </el-row>
    <div class="detail-wrapper" :style="{ height: nobottommaxH - 10 + 'px' }">
      <el-form label-width="140px">
        <el-form-item label="地点">{{ data.repairPlace || "--" }}</el-form-item>
        <el-form-item label="类型">{{
          data.repairTypeName || "--"
        }}</el-form-item>
        <el-form-item label="内容">
          <pre v-html="data.repairContent || '--'"></pre>
        </el-form-item>
        <el-form-item label="时间">{{
          data.createTime | filterDate
        }}</el-form-item>
        <el-form-item label="报修人">{{
          data.createUserName || "--"
        }}</el-form-item>
        <el-form-item label="报修人手机号" v-if="data.isShowMobile == 1">{{
          data.mobile || "--"
        }}</el-form-item>
        <el-form-item
          label="附件"
          v-if="data.photoList && data.photoList.length"
        >
          <image-previewer
            class="image-plate"
            :images="getViewPic(data.photoList)"
            tag="img"
          ></image-previewer>
        </el-form-item>
        <el-form-item
          label="处理结果"
          v-if="data.dealContent && data.dealContent.length"
        >
          <div
            class="deal-item"
            :key="idx"
            v-for="(dealContent, idx) in data.dealContentList"
          >
            <div class="deal-content">
              {{ dealContent.dealDicName }}
            </div>
            <div class="deal-content">
              {{ dealContent.dealContent }}
            </div>
            <image-previewer
              class="image-plate"
              :images="getViewDealPic(dealContent.dealPicUrls)"
              tag="img"
            ></image-previewer>
            <div class="deal-info">
              {{ dealContent.createUserName }} &nbsp;
              {{ dealContent.createTime | filterDate }}
            </div>
          </div>
        </el-form-item>
        <el-form-item
          label="结果反馈"
          v-if="
            data.isFback == 1 &&
            data.fbackContentList &&
            data.fbackContentList.length
          "
        >
          <div
            class="deal-item"
            :key="idx"
            v-for="(fbackContent, idx) in data.fbackContentList"
          >
            <div class="deal-status">
              <span class="unsolved" v-if="fbackContent.status == 0"
                >未解决</span
              >
              <span class="solved" v-if="fbackContent.status == 2">已解决</span>
            </div>
            <div class="deal-content">
              {{ fbackContent.dealContent }}
            </div>
            <image-previewer
              class="image-plate"
              :images="getViewFbackPic(fbackContent.dealPics)"
              tag="img"
            ></image-previewer>
            <div class="deal-info">
              {{ fbackContent.createTime | filterDate }}
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
/* utils */
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import moment from "moment";

/* components */
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

/* api */
import { getRepairInfo } from "@/api/repairManage";

export default {
  name: "mentalEducationConsultingDetailIndex",
  mixins: [mixin],
  components: { ImagePreviewer },
  filters: {
    filterDate(val) {
      return val ? moment(val).format("YYYY-MM-DD HH:mm:ss") : "--";
    },
  },
  watch: {},
  computed: {
    ...mapGetters(["userInfo"]),
  },
  data() {
    return {
      repairId: this.$route.query.repairId,
      data: {},
    };
  },
  created() {
    this.getRepairInfo();
  },
  methods: {
    // 根据报修Id查询所有报修信息
    getRepairInfo() {
      getRepairInfo(this.repairId, 2)
        .then((res) => {
          let _res = res.data;
          if (_res.code != 200) return Promise.reject(_res.msg);
          else return _res.data;
        })
        .then((data) => {
          if (data) {
            this.data = { ...data };
          }
        });
    },

    // 格式化图片 json
    formatImgJson(imgJson) {
      return JSON.parse(imgJson || "[]").map((item) => ({
        fileUrl: item.photoUrl,
      }));
    },

    getViewPic(photoList) {
      if (photoList) {
        return photoList.map((item) => ({ src: item.photoUrl }));
      }
      return [];
    },
    getViewDealPic(photoList) {
      if (photoList) {
        return JSON.parse(photoList).map((item) => ({ src: item }));
      }
      return [];
    },
    getViewFbackPic(photoList) {
      if (photoList) {
        return photoList.map((item) => ({ src: item.photoUrl }));
      }
      return [];
    },
  },
};
</script>
<style lang="scss" scoped>
.repair-detail {
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

  /deep/ .images {
    width: 80px;
    height: 80px;
    margin: 0 20px 20px 0;
  }

  .deal-item {
    border-radius: 3px;
    border: 1px solid #e7eaec;
    background: #fff;
    margin-bottom: 15px;
    padding: 4px 10px;
    line-height: 20px;

    .deal-status {
      margin-bottom: 10px;
      font-weight: 700;
      .unsolved {
        color: #f56c6c;
      }
      .solved {
        color: #67c23a;
      }
    }

    .previewer {
      padding: 0 15px;
      /deep/ .images {
        margin: 10px 10px 0 10px;
      }
    }

    .deal-info {
      text-align: right;
      font-size: 12px;
    }
  }
}
</style>
