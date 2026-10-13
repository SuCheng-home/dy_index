<template>
    <div class="shortmessageCorporateremittance">
        <div class="top">
            <el-button
                @click="$router.back()"
                type="default"
                size="medium"
            >返回</el-button>
                <el-button
                    type="primary"
                    size="medium"
                    @click="inserts()"
                >确定</el-button>
        </div>
        <div
            class="body"
            :style="`height: ${maxH+50}px;`"
        >
            <div class="box">
                <div class="title">第一步：获取汇款账户</div>
                <div class="txt">
                    <p>户名: 南京微研网络科技有限公司</p>
                    <p>开户银行：中国农业银行股份有限公司南京白下路支行</p>
                    <p>账号: 1010 7201 0400 1895 0</p>
                </div>
                <div class="title">第二步：通知财务人员完成汇款</div>
                <div class="title">第三步：上传汇款单</div>
                <div class="txt">
                    <div class="image-upload-container">
                        <div class="image-upload-container__inner">
                            <uploader
                                ref="coverUploader"
                                pathPrefix="questionnaire"
                                :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']"
                                showResult="image"
                                showMode="button"
                                v-model="images"
                                :multiple="false"
                            ></uploader>
                                <div
                                    v-show="images.length !== 0"
                                    class="image-upload__delete"
                                    @click="deleteCover"
                                >删除图片</div>
                    </div>
                    <div class="cover-hint">
                        <i class="el-icon-info"></i>请上传清晰汇款单图片</div>
                </div>
            </div>
            <div class="title">第四步：如需发票请与专属客户经理联系</div>
            <div class="txt">
                专属客户经理：{{name}}
                <span class="color">{{mobile}}</span>
            </div>
    </div>
    </div>

    </div>
</template>
<script>
import moment from "moment";
import { insert,queryLiableList} from "@/api/shortmessage";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
import Uploader from "@/components/Uploader/WebUploader";
import {mapGetters} from "vuex";
export default {
  name: "shortmessageCorporateremittance",
  components: {
    Uploader
  },
  data() {
    return {
      images: [],
      name:"",
      mobile:""
    };
  },
  mixins: [baseMixin, mixin],
  computed: {
     ...mapGetters(['schoolInfo'])
  },
  created() {
     queryLiableList(this.schoolInfo.id)
            .then(res => res.data)
            .then(data => {
              if (data.code == 200) {
                this.mobile=data.data[0].mobile;
                this.name=data.data[0].name;
              }
            });
  },
  methods: {
    deleteCover() {
      this.$refs.coverUploader.deleteItem(0);
    },
    inserts() {
      if (!this.images.length) {
        this.$message({ type: "warning", message: "请上传汇款单!" });
        return;
      }
      this.$confirm("您将进行对公汇款", "对公汇款", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        insert({
          picJson: this.images[0].fileUrl,
          type: 3,
          state: 5
        })
          .then(res => res.data)
          .then(data => {
            if (data.code === 200) {
              this.$message({ type: "success", message: "对公汇款成功!" });
              this.$router.back();
            }
          });
      });
    }
  }
};
</script>
<style>
.shortmessageCorporateremittance .upload-block-container,
.shortmessageCorporateremittance .upload-file-item {
  height: 137px !important;
  width: 137px !important;
}
.shortmessageCorporateremittance .icon--block-del {
  display: none !important;
}
.shortmessageCorporateremittance .image-upload__delete {
  height: 40px;
  line-height: 40px;
  background-color: #409efe;
  color: #fff;
  text-align: center;
  position: absolute;
  bottom: 0;
  width: 100%;
}
.shortmessageCorporateremittance .upload-file-item img {
  width: 100% !important;
  height: 100% !important;
  border: 1px dashed #409eff;
  margin: 0 !important;
}
</style>
<style lang="scss" scoped>
.shortmessageCorporateremittance {
  padding:12px;
  .top {
    padding-bottom: 10px;
    border-bottom: 1px solid #e7eaec;
  }
  .body {
    overflow: auto;
    .box {
      width: 810px;
      margin: 0 auto;
      .title {
        font-size: 18px;
        padding: 10px;
        line-height: 32px;
        color: #606266;
      }
      .txt {
        background: #fff;
        padding: 10px;
        font-size: 14px;
        line-height: 30px;
        color: #909399;
        .color {
          color: #409eff;
        }
        .image-upload-container {
          display: inline-block;
          vertical-align: top;
          .image-upload-container__inner {
            position: relative;
          }
          .cover-hint {
            position: relative;
            margin-top: 5px;
            font-size: 12px;
            i {
              margin-right: 5px;
            }
          }
        }
      }
    }
  }
}
</style>
