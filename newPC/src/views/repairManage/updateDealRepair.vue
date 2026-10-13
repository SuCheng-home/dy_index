<template>
  <div
    class="app-container calendar-list-container uploadDealRepair"
    style="width: 100%"
  >
    <back-tool>
      <el-button
        class="filter-item"
        size="medium"
        type="primary"
        @click="dialogFormVisible = true"
        v-if="status == 0"
        >处理
      </el-button>
    </back-tool>
    <div
      class="mainRepairContents"
      :style="{ height: `${nobottommaxH - 100}px` }"
    >
      <div class="body">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          :label-position="labelPosition"
          label-width="140px"
          class="formContent"
        >
          <el-form-item label="内容：">
            <div>{{ repairContent }}</div>
            <div class="repairimgs" v-if="photoList.length > 0">
              <image-previewer
                class="image-plate"
                :images="photoUrlArr"
                tag="span"
              >
              </image-previewer>
            </div>
          </el-form-item>
          <el-form-item label="报修状态：">
            <div>
              <el-tag  size="mini" type="danger" v-show="status == 0">待处理</el-tag>
              <el-tag  size="mini" type="warning" v-show="status == 1">已处理</el-tag>
              <el-tag  size="mini" type="success" v-show="status == 2">已完成</el-tag>
            </div>
          </el-form-item>
          <el-form-item label="报修人：">
            <div>
              {{ createUserName }}
              <span
                v-show="isShowMobile == 1"
                style="color: #909399; font-size: 12px; margin-left: 5px"
                >{{ mobile }}</span
              >
            </div>
          </el-form-item>
          <el-form-item label="损坏人姓名：" v-show="isConsider == 2">
            <div>
              {{ considerUserName }}
            </div>
          </el-form-item>

          <el-form-item label="类型：">
            <div>{{ repairTypeName }}</div>
          </el-form-item>
          <el-form-item label="地点：">
            <div>{{ repairPlace }}</div>
          </el-form-item>

          <el-form-item label="时间：">
            <div>{{ createTime | formatTimeFilter }}</div>
          </el-form-item>
        </el-form>

        <form class="formContent formStyle" v-if="groupRepair.length > 0">
          <fieldset class="groupBorder">
            <legend style="margin-left: 15px; color: #48576a; font-size: 14px">
              处理与反馈
            </legend>
            <div
              v-for="(item, index) in groupRepair"
              slot="content"
              class="card-padding"
              :key="index"
            >
              <div>
                <div class="leftdotted">
                  <span class="dealstate" v-if="item.userType == 1"></span>
                  <span class="fabackstate" v-else></span>
                </div>
                <div class="rightCotainer">
                  <div>{{ item.dealDicName }}</div>
                  <span>{{ item.dealContent }}</span>
                  <!--yjxstart-->
                  <div
                    class="repairimgs imgfack"
                    v-if="item.dealPicUrls && item.dealPicUrls.length !== 0"
                  >
                    <image-previewer
                      class="image-plate"
                      :images="item.showDealPicUrls"
                      tag="span"
                    >
                    </image-previewer>
                  </div>
                  <!--yjxend-->
                  <div
                    class="repairimgs imgfack"
                    v-if="
                      item.dealPics == null ? false : item.dealPics.length > 0
                    "
                  >
                    <image-previewer
                      class="image-plate"
                      :images="item.dealPics"
                      tag="span"
                    >
                    </image-previewer>
                  </div>
                </div>
              </div>
              <div style="clear: both; height: 40px">
                <div class="rightCotainer">
                  <p class="remark" v-if="item.status == 1">
                    <span>{{ item.createUserName }}</span
                    >于<span>{{ item.createTime | formatTimeFilter }}</span
                    >进行处理
                  </p>
                  <p class="remark" v-else>
                    <span>{{ item.createUserName }}</span
                    >于<span>{{ item.createTime | formatTimeFilter }}</span
                    >进行反馈
                  </p>
                </div>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </div>

    <el-dialog title="报修处理" :visible.sync="dialogFormVisible">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        :label-position="labelPosition"
        label-width="120px"
        class="formContent"
      >
        <el-form-item label="处理情况" prop="dealDicCode" v-if="status == 0 && dealDicList.length">
          <el-select v-model="ruleForm.dealDicCode" @change="dealDicChange" placeholder="请选择">
            <el-option
              v-for="item in dealDicList"
              :key="item.code"
              :label="item.value"
              :value="item.code">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理结果" v-if="status == 0" :prop="dealDicList.length ? '':'dealContent'">
          <el-input
            class="dealresult"
            type="textarea"
            resize="none"
            placeholder="处理结果"
            :rows="4"
            :maxlength="100"
            v-model="ruleForm.dealContent"
            @blur="inputBlurHandler"
          ></el-input>
        </el-form-item>
        <!--yjxstart-->
        <el-form-item label="图片">
          <uploader
            showMode="image"
            pathPrefix="baoxiu"
            module="baoxiu"
            moduleCode="1208"
            :extList="['png', 'jpg', 'jpeg', 'bmp', 'gif']"
            v-model="dealResultPicUrls"
            multiple
            showResult="image"
          ></uploader>
          <el-dialog v-model="dialogVisible" size="tiny">
            <img width="100%" :src="dialogImageUrl" alt />
          </el-dialog>
        </el-form-item>
        <!--yjxend-->
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dealled()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getSchoolDicByCode } from '@/utils/utils';
import BackTool from "@/components/BackTool";
import { getRepairInfo, updateDealRepair } from "@/api/repairManage";
import Uploader from "@/components/Uploader/WebUploader";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
import mixin from "@/mixins/windowResize";

export default {
  data() {
    return {
      labelPosition: "right",
      ruleForm: {
        dealDicName: "",
        dealDicCode: "",
        dealContent: "问题已解决，感谢您的反馈！",
      },
      rules: {
        dealDicCode: [
          { required: true, message: "请选择处理情况", trigger: ['blur', 'change'] },
        ],
        dealContent: [
          { required: true, message: "请输入处理结果", trigger: ['blur', 'change'] },
        ],
      },
      cutH: 180,
      repairPlace: "",
      repairTypeName: "",
      repairContent: "",
      createTime: "",
      createUserName: "",
      photoList: [],
      dealContentList: [],
      isFback: 0,
      fbackContentList: [],
      status: 0,
      photoUrlArr: [],
      isShowMobile: 0,
      mobile: "",
      groupRepair: [],
      dialogFormVisible: false,
      /*yjx*/
      dialogVisible: false, //是否展示图片
      dialogImageUrl: "", //图片预览路径
      dealResultPicUrls: [], //上传图片数组
      dealDicList:[],
      isConsider:1,
      considerUserName:""
    };
  },
  created() {
    let id = this.$route.query.id;
    this.initDic()
    this.getList(id);
  },
  mixins: [mixin],
  filters: {
    formatTimeFilter(date) {
      return date.split(".")[0];
    },
  },
  methods: {
    initDic(){
      getSchoolDicByCode('repairDeal').then(res=>{
          this.dealDicList = res
      })
    },
    /*上传图片*/
    inputBlurHandler() {
      this.ruleForm.dealContent = this.ruleForm.dealContent.trim();
    },
    getList(id) {
      getRepairInfo(id, 1).then((res) => {
        let data = res.data.data;
        this.repairPlace = data.repairPlace;
        this.repairTypeName = data.repairTypeName;
        this.repairContent = data.repairContent;
        this.createTime = data.createTime;
        this.createUserName = data.createUserName;
        this.photoList = data.photoList;
        this.dealContentList = data.dealContentList;
        this.status = data.status;
        this.fbackContentList = data.fbackContentList;
        this.isFback = data.isFback;
        this.photoUrlArr = data.photoList.map((entry) => ({
          src: entry.fileUrl || entry.photoUrl,
        }));
        this.isShowMobile = data.isShowMobile;
        this.isConsider = data.isConsider||1;
        this.considerUserName = data.considerUserName;
        this.mobile = data.mobile;
        this.fbackContentList.forEach((item) => {
          item.dealPics.forEach((pic) => {
            pic.src = pic.fileUrl || pic.photoUrl;
          });
        });

        if (this.dealContentList !== null && this.dealContentList.length > 0) {
          for (let i = 0; i < this.dealContentList.length; i++) {
            this.groupRepair.push(this.dealContentList[i]);
            this.groupRepair.forEach((item) => {
              item.showDealPicUrls = [];
              if (item.dealPicUrls && item.dealPicUrls.length !== 0) {
                try {
                  JSON.parse(item.dealPicUrls).forEach((subItem) => {
                    let showDealPicUrls = {
                      src: subItem,
                    };
                    item.showDealPicUrls.push(showDealPicUrls);
                  });
                } catch (error) {}
              }
            });
            if (
              this.fbackContentList !== null &&
              this.fbackContentList.length > i
            ) {
              this.groupRepair.push(this.fbackContentList[i]);
            }
          }
        }
      });
    },
    dealDicChange(val){
      this.ruleForm.dealDicName = this.dealDicList.find(e=>e.code == val).value
    },
    dealled() {
      this.$refs["ruleForm"].validate((valid) => {
        if (valid) {
          let id = this.$route.query.id;
          const pics = this.dealResultPicUrls.map(({ fileUrl }) => fileUrl);
          updateDealRepair({ ...this.ruleForm, userType: 1, repairId: id, status: 1, dealResultPicUrls: pics }).then((res) => {
            if (res.data.code === 200) {
              this.$message.success(res.data.msg);
              this.dialogFormVisible = false;
              this.$router.back();
            } else {
              this.$message.warning(res.data.msg);
            }
          });
        }
      });
    },
    goback() {
      this.$router.back();
    },
  },
  components: {
    ImagePreviewer,
    BackTool,
    Uploader,
  },
};
</script>

<style>
.mainRepairContents .el-form-item {
  margin-bottom: 5px;
}

.mainRepairContents label {
  font-weight: bolder;
}

.mainRepairContents .repairimgs .images {
  width: 100px;
  height: 100px;
  margin: 5px;
  display: inline-block;
}
</style>

<style scoped>
.body {
  width: 810px;
  margin: 0 auto;
}
.formStyle {
  margin: 0 0 15px 0;
  box-sizing: border-box;
  padding-left: 35px;
}

.groupBorder {
  border: 1px solid #e5e5e5;
}

.leftdotted {
  display: block;
  float: left;
  width: 15px;
}

.rightCotainer {
  display: block;
  float: right;
  width: 97%;
}

.rightCotainer > span {
  display: inline-block;
  width: 100%;
  font-weight: bolder;
  word-wrap: break-word;
  word-break: break-all;
  color: #48576a;
  font-size: 14px;
}

.remark {
  color: #999;
  font-size: 12px;
  padding-top: 0;
}

.fabackstate {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #ffbd4c;
  margin: 6px 10px 0 7px;
}

.dealstate {
  display: block;
  width: 10px;
  height: 10px;
  border-radius: 5px;
  background-color: #35b0fe;
  margin: 6px 10px 0 7px;
}

.card-padding {
  position: relative;
  margin: 15px 5px;
}

.card-padding:after {
  content: " ";
  position: absolute;
  left: 0;
  bottom: 0;
  right: 0;
  height: 1px;
  border-bottom: 1px solid #e5e5e5;
  color: #e5e5e5;
  -webkit-transform-origin: 0 100%;
  transform-origin: 0 100%;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
}

.card-padding:last-child:after {
  height: 0 !important;
  border-bottom: none !important;
}

.mainRepairContents {
  padding-top: 20px;
  min-width: 100px;
  width: 100%;
  overflow: auto;
}

::-webkit-scrollbar {
  width: 6px;
  background-color: #f5f5f5;
}

::-webkit-scrollbar-thumb {
  background-color: #999;
}

::-webkit-scrollbar-track {
  background-color: #f5f5f5;
}

.dealcontent {
  border: 1px solid #9ea7b3;
  border-radius: 5px;
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

.repairimgs span {
  display: inline-block;
  width: 100px;
  height: 100px;
  background: no-repeat center center / cover;
}

/*.dealresult {
        width: 80%;
    }*/
.dealresult.nodeal {
  /*未解决样式*/
  color: #ff9999;
  font-weight: bolder;
}

.dealresult.yesdeal {
  /*已完成样式*/
  color: #04be02;
  font-weight: bolder;
}

.imgfack.repairimgs {
  /*yjx min-height: 110px; */
}
</style>
<style scoped>
.uploadDealRepair .el-icon-view {
  display: none;
}
.uploadDealRepair .el-upload-list--picture-card .el-upload-list__item {
  width: 100px;
  height: 100px;
}
.uploadDealRepair .el-upload--picture-card {
  width: 100px;
  height: 100px;
  line-height: 100px;
}
.uploadDealRepair .el-progress-circle {
  width: 80px !important;
  height: 80px !important;
}
.uploadDealRepair .el-upload-list--picture-card .el-progress {
  width: 80px !important;
}
</style>
