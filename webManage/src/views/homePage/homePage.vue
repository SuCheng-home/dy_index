<template>
  <div class="homePage">
    <div
      class="websetAdd homeWebAdd"
      v-if="Object.keys(SchoolServiceList).length==0"
    >
      <el-row>
        <el-col :span="24">
          <div class="nemu-tools">
            <el-button
              size="medium"
              v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1"
              class="filter-item"
              type="primary"
              @click="handleAddService()"
            >保存
            </el-button>
          </div>
        </el-col>
      </el-row>
      <div
        class="addService-wrap custom—scrollbar"
        id="addService-wrap"
        :style="`height:${addServiceHeight}px`"
      >
        <el-form
          :model="ruleForm"
          ref="addServiceForm"
          label-width="150px"
          class="service-ruleForm custom—scrollbar"
        >
          <el-form-item
            label="网站Logo"
            class="required"
          >
            <el-col :span="24">
              <uploader
                pathPrefix="homePage"
                multiple
                v-model="files"
                :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']"
                showMode="imageBtn"
                showResult="image"
                showModeText="点击上传logo"
                showModeNum="one"
              ></uploader>
              <!-- <img v-if="ruleForm.logoUrl" :src="ruleForm.logoUrl" class="logo">
              <img class="logo" v-else src="../../assets/index/tianjia.png">
              <el-upload
              class="logo-uploader"
              :action="UploadPath"
              :show-file-list="false"
              :before-upload="handleBeforeLogo"
              :on-success="handleLogo"
              accept=".image,.jpg,.jpeg,.image,.bmp,.image,.gif,.png">
                <el-button class="logo_update">点击上传logo</el-button>
              </el-upload> -->
            </el-col>
          </el-form-item>
          <el-form-item
            label="网站名称"
            class="required"
          >
            <el-input
              v-model.trim="ruleForm.webName"
              :maxlength="20"
              placeholder="网站名称（1-20个字符）"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="网站域名"
            class="required"
          >
            <el-input
              v-model.trim="ruleForm.domainName"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="备用域名">
            <el-input
              v-model.trim="ruleForm.domainNameTw"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="原网站">
            <el-input
              v-model.trim="ruleForm.oldDomainName"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="关键词">
            <el-input
              v-model.trim="ruleForm.keyWord"
              :maxlength="100"
              placeholder="网站关键词（1-100个字符）"
            ></el-input>
          </el-form-item>
          <el-form-item label="网站介绍">
            <el-input
              type="textarea"
              class="description"
              v-model.trim="ruleForm.description"
              :maxlength="500"
              placeholder="网站介绍（1-500个字符）"
            ></el-input>
          </el-form-item>
          <el-form-item label="版权信息">
            <el-input
              v-model.trim="ruleForm.copyRight"
              :maxlength="200"
            ></el-input>
          </el-form-item>
          <el-form-item label="备案信息">
            <el-input
              v-model.trim="ruleForm.recodation"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          <el-form-item label="公安备案号">
            <el-input
              v-model.trim="ruleForm.postRecodation"
              :maxlength="100"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="联系方式">
            <el-input
              v-model.trim="ruleForm.address"
              :maxlength="100"
            ></el-input>
          </el-form-item>

           <el-form-item label="事业单位标记" >
            <el-checkbox :true-label="2" :false-label="1" v-model="ruleForm.isInstitute">增加标记</el-checkbox>
          </el-form-item>
           <el-form-item
            label="事业单位链接"
            class="required"
            v-if="ruleForm.isInstitute==2"
          >
            <el-input
              v-model.trim="ruleForm.institution"
              :maxlength="1000"
              placeholder="事业单位链接"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div
      class="device-wrap"
      v-if="Object.keys(SchoolServiceList).length!==0"
      :style="`height:${contentMax}px`"
    >
      <div
        class="device-box"
        :SchoolServiceList="SchoolServiceList"
      >
        <div class="img-box">
          <div
            v-if="!SchoolServiceList.logoUrl"
            :style="`background-image: url(${imageUrl})`"
            class="avatar"
          ></div>
          <img
            v-if="SchoolServiceList.logoUrl"
            :src="SchoolServiceList.logoUrl"
            class="device-logo"
          >
        </div>
        <div class="device-info">
          <div class="top clearfix">
            <span>{{SchoolServiceList.webName}}</span>
            <img
              src="../../assets/index/small_icon1.png"
              alt=""
            >
          </div>
          <div class="middle">
            <span>{{SchoolServiceList.domainName}}</span>
            <span v-show="SchoolServiceList.domainNameTw">, {{SchoolServiceList.domainNameTw}}</span>
          </div>
          <div class="bottom">
            <el-button
              v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1"
              type="primary"
              size="small"
              @click="webSetBtn()"
            >网站设置</el-button>
          </div>
        </div>
        <div class="newControl">
          <el-button
            v-if="permission.indexOf('/schoolWebTwo/customer')!==-1"
            type="primary"
            size="small"
            @click="justTo('/main/webMoreAdd')"
          >新增网站</el-button>
          <i
            class="el-icon-sort switch-tag"
            v-if="permission.indexOf('/schoolWebTwo/customer')!==-1&&SchoolWebList&&SchoolWebList.length>1"
          ></i>
          <template v-if="SchoolWebList&&SchoolWebList.length>1">
            <el-button
              type="primary"
              size="small"
              @click="switchWeb()"
            >切换网站</el-button>
          </template>
        </div>
      </div>
      <div
        class="chartBox"
        v-if="SchoolServiceList"
      >
        <div class="title clearfix">
          <div class="timeBox">
            开始时间：
            <div class="time startTime">
              <el-date-picker
                v-model="startDate"
                type="date"
                placeholder="选择开始日期"
                @change="startFunc"
              >
              </el-date-picker>
            </div>
          </div>
          <div class="timeBox">
            结束时间：
            <div class="time startTime">
              <el-date-picker
                v-model="endDate"
                type="date"
                placeholder="选择结束日期"
                @change="endFunc"
              >
              </el-date-picker>
            </div>
          </div>
        </div>
        <div
          id="chartChange"
          class="chartChange"
        ></div>
      </div>
    </div>
    <el-dialog
      title="网站选择"
      :visible.sync="webSwicthVisible"
      width="60%"
      :show-close="false"
    >
      <div class="school-box clearfix">
        <div
          class="school-item"
          v-for="(webItem,webIndex) in SchoolWebList"
          :key="webIndex"
          :class="{'school-chosed':webSwitchIndex2==webIndex}"
          @click="choseWeb(webItem,webIndex)"
        >
          <div
            class="school-logo"
            :style="`backgroundImage:url(${webItem.logoUrl})`"
          ></div>
          <div class="school-name">{{webItem.webName}}</div>
        </div>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="cancelSwitch">取 消</el-button>
        <el-button
          type="primary"
          @click="sureSwicth"
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  getSchoolWebSettingById,
  getSchoolWebSettingBySchoolId,
  addSchoolWebSetting,
  getWebAccessNumberList,
} from "@/api/webService";
import mixins from "@/mixins/windowResize";
import Uploader from "@/components/Uploader/WebUploader";
import Cookies from "js-cookie";
var echarts = require("echarts/lib/echarts");
require("echarts/lib/chart/line");
// 引入提示框和标题组件
require("echarts/lib/component/tooltip");
require("echarts/lib/component/title");
require("echarts/lib/component/legend");

export default {
  components: {
    Uploader,
  },
  data() {
    return {
      imageUrl: require("../../assets/index/default_header.png"),

      firstShow: false,
      ruleForm: {
        logoUrl: "", //上传logo
        webName: "",
        domainName: "",
        oldDomainName: "",
        keyWord: "",
        description: "",
        copyRight: "",
        recodation: "",
        postRecodation: "",
        address: "",
        domainNameTw: "",
        isInstitute:1,
        institution:''
      },
      SchoolServiceList: {},
      startDate: "",
      endDate: "",
      chartChange: null,
      accessDates: [],
      dateNumbers: [],
      webId: null,
      SchoolWebList: [],
      webSwicthVisible: false,
      webSwitchIndex: 0,
      setWebItem: {},
      webSwitchIndex2: 0 /*这个用来取消的时候做判断*/,
      setWebItem2: "",
      webId2: "",
      files: [],
    };
  },
  created() {
    this.startDate = new Date() - 8.64e7 * 7;
    this.endDate = new Date();
    //判断是否网站个数
    if (this.firstWebService && this.firstWebService.length > 0) {
      if (Cookies.get("webId")) {
        this.webId = Cookies.get("webId");
        this.SchoolWebList = this.firstWebService;
        this.SchoolWebList.forEach((item, index) => {
          if (this.webId == item.id) {
            this.setWebItem = item;
            this.webSwitchIndex = index;
            this.webSwitchIndex2 = index;
          }
        });
      }
      this.getSchoolWebSettingByIdFunc();
    } else {
      this.SchoolWebList = [];
    }
    //  this.getSchoolWebSettingBySchoolIdFunc();
  },
  mounted() {},
  computed: {
    ...mapGetters(["permission", "firstWebService"]),
  },
  mixins: [mixins],
  methods: {
    cancelSwitch() {
      this.webSwicthVisible = false;
      setTimeout(() => {
        this.webSwitchIndex2 = this.webSwitchIndex;
        this.setWebItem2 = this.setWebItem;
        this.webId2 = this.webId;
      }, 300);
    },
    sureSwicth() {
      Cookies.set("webId", this.webId2);
      this.webId = Cookies.get("webId");
      this.$store.dispatch("getOneWebInfo", { webId: Cookies.get("webId") });
      this.getSchoolWebSettingByIdFunc();
      this.webSwicthVisible = false;
      //this.$store.dispatch('getWebBasic');
      //this.getSchoolWebSettingBySchoolIdFunc();
    },
    choseWeb(item, index) {
      this.webSwitchIndex2 = index;
      this.setWebItem2 = item;
      this.webId2 = item.id;
    },
    switchWeb() {
      //切换网站
      this.$store.dispatch("getWebBasic").then(() => {
        this.SchoolWebList = this.firstWebService;
        this.webSwicthVisible = true;
      });
    },
    startFunc(val) {
      this.startDate = val;
      this.getWebAccessNumberListFunc();
    },
    endFunc(val) {
      this.endDate = val;
      this.getWebAccessNumberListFunc();
    },
    chartChanges() {
      this.chartChange = echarts.init(document.getElementById("chartChange"));
      this.chartChange.setOption({
        title: {
          text: "网站访问量",
          x: "center",
        },
        tooltip: {
          trigger: "axis",
        },
        color: ["#409EFF"],
        legend: {
          x: "center",
          y: "bottom",
        },
        grid: {
          left: "4%",
          right: "7%",
          bottom: "7%",
          containLabel: true,
        },
        toolbox: {
          feature: {
            saveAsImage: {},
          },
        },
        xAxis: {
          type: "category",
          name: "访问日期",
          boundaryGap: false,
          data: this.accessDates,
        },
        yAxis: {
          scale: true,
          axisLabel: {
            formatter: "{value}",
          },
          name: "每日访问量",
        },
        series: [
          {
            name: "访问量",
            type: "line",
            stack: "总量",
            data: this.dateNumbers,
          },
        ],
      });
    },
    getWebAccessNumberListFunc() {
      if (
        this.$moment(this.endDate).format("YYYY-MM-DD") <
        this.$moment(this.startDate).format("YYYY-MM-DD")
      ) {
        this.$alert("开始时间不能大于结束时间!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      this.accessDates = [];
      this.dateNumbers = [];
      if (this.webId) {
        getWebAccessNumberList({
          webId: this.webId,
          startDate:
            this.startDate == ""
              ? ""
              : this.$moment(this.startDate).format("YYYY-MM-DD").toString(),
          endDate:
            this.endDate == ""
              ? ""
              : this.$moment(this.endDate).format("YYYY-MM-DD").toString(),
        })
          .then((res) => res.data)
          .then((data) => {
            if (data.code === 200) {
              let totalData = data.data;
              totalData.forEach((item, index) => {
                this.accessDates.push(item.accessDate);
                this.dateNumbers.push(item.dateNumber);
              });
              var This = this;
              setTimeout(function () {
                This.chartChanges();
              }, 300);
            }
          })
          .catch((res) => {});
      }
    },

    getSchoolWebSettingByIdFunc() {
      getSchoolWebSettingById({
        webId: this.webId,
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200) {
            if (data.data) {
              data.data.isInstitute = data.data.isInstitute? data.data.isInstitute:1;
              this.SchoolServiceList = data.data;
              //  this.getSchoolWebSettingBySchoolIdFunc();
              this.getWebAccessNumberListFunc();
            }
          }
        });
    },
    /*
    getSchoolWebSettingBySchoolIdFunc(){
      getSchoolWebSettingBySchoolId().then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          if(data.data){
            console.log("ss",data.data);
            this.SchoolWebList=data.data;
            
           
          }
        }
      })
    },*/
    handleAddService() {
      let flag = true;
      if (this.files && this.files.length == 0) {
        this.$alert("请选择Logo!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      if (this.ruleForm.webName === "") {
        this.$alert("请填写网站名称!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      if (this.ruleForm.domainName === "") {
        this.$alert("请填写域名!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      var domainreg = /[a-zA-Z0-9][-a-zA-Z0-9]{0,49}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,49})+\.?/;
      if (
        this.ruleForm.domainName !== "" &&
        this.ruleForm.domainName !== null &&
        !domainreg.test(this.ruleForm.domainName)
      ) {
        this.$alert("域名格式不正确", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      var urlreg = /^(http|https):\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\':+!]*([^<>\"\"])*$/;
      if (
        this.ruleForm.oldDomainName != null &&
        this.ruleForm.oldDomainName != "" &&
        !urlreg.test(this.ruleForm.oldDomainName)
      ) {
        this.$alert("原网站url格式不正确!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      if (this.ruleForm.domainName == this.ruleForm.domainNameTw) {
        this.$alert("网站域名和备用域名重复!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      if (!this.ruleForm.institution&&this.ruleForm.isInstitute==2) {
        this.$alert("请填写事业单位网址!", "提示", {
          type: "error",
          confirmButtonText: "确定",
        });
        return false;
      }
      if (flag) {
        //走接口
        this.ruleForm.logoUrl = this.files
          .map((item) => item.fileUrl)
          .toString();
        addSchoolWebSetting({
          logoUrl: this.ruleForm.logoUrl,
          webName: this.ruleForm.webName,
          domainName: this.ruleForm.domainName,
          oldDomainName: this.ruleForm.oldDomainName,
          keyWord: this.ruleForm.keyWord,
          description: this.ruleForm.description,
          copyRight: this.ruleForm.copyRight,
          recodation: this.ruleForm.recodation,
          postRecodation: this.ruleForm.postRecodation,
          address: this.ruleForm.address,
          domainNameTw: this.ruleForm.domainNameTw,
          institution: this.ruleForm.institution,
          isInstitute: this.ruleForm.isInstitute,
        })
          .then((res) => res.data)
          .then((data) => {
            if (data.code === 200) {
              let webServiceData = data.data;
              this.webId = webServiceData.id;
              Cookies.set("webId", this.webId);
              //localStorage.setItem("webId",this.webId);
              //Cookies.set('webId',this.webId);
              this.getSchoolWebSettingByIdFunc();
              this.$store.dispatch("getWebBasic");
              this.$store.dispatch("getOneWebInfo", {
                webId: Cookies.get("webId"),
              });
            } else {
              this.$message({
                type: "error",
                message: data.msg,
              });
            }
          })
          .catch(() => {
            this.$message.error("error");
          });
      }
      //保存
    },
    justTo(path, query = {}) {
      this.$router.push({
        path,
        query,
      });
    },
    webSetBtn() {
      this.$router.push({
        path: "/main/webSetDetail",
        query: {
          webId: this.webId,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.homePage {
  box-sizing: border-box;
  .websetAdd {
    padding: 20px;
    width: 1200px;
    box-sizing: border-box;
    border-radius: 3px;
    overflow-x: hidden;
    overflow-y: auto;
    margin: 0 auto;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08);
  }
  .addService-wrap {
    width: 100%;
    padding-top: 20px;
    padding-bottom: 20px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }
  .service-ruleForm {
    width: 82%;
    height: auto;
    padding: 0 15px 0 15px;
    box-sizing: border-box;
    .logo {
      float: left;
      display: block;
      height: 100px;
      max-width: 550px;
    }
    .logo-uploader {
      float: left;
    }
    .logo_update {
      display: inline-block;
      line-height: 1;
      white-space: nowrap;
      cursor: pointer;
      background: #fff;
      border: 1px solid #c4c4c4;
      color: #1f2d3d;
      margin: 0;
      padding: 10px 15px;
      border-radius: 4px;
      margin-left: 30px;
    }
  }
  .device-wrap {
    width: 1200px;
    margin: 0 auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
  .device-box {
    min-height: 160px;
    background: #fff;
    padding: 20px;
    border-radius: 3px;
    box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08);
    box-sizing: border-box;
    position: relative;
    .img-box {
      float: left;
      max-width: 500px;
      height: 100px;
      position: relative;
      margin-top: 10px;
      border-radius: 6px;
      overflow: hidden;
      border: 1px solid #eee;
      .avatar {
        display: block;
        width: 100px;
        height: 100px;
        overflow: hidden;
        background-size: 100% 100%;
      }
      .device-logo {
        display: block;
        max-width: 100%;
        height: 100px;
      }
    }
    .device-info {
      float: left;
      margin-left: 20px;
      padding-top: 10px;
      .top {
        height: 25px;
        line-height: 25px;
        font-size: 18px;
        color: #333;
        span {
          float: left;
          display: block;
        }
        img {
          float: left;
          display: block;
          width: 40px;
          height: 18px;
          padding-top: 3px;
          margin-left: 10px;
        }
      }
      .middle {
        line-height: 30px;
      }
      .bottom {
        margin-top: 8px;
      }
    }
    .newControl {
      position: absolute;
      top: 20px;
      right: 20px;
      .switch-tag {
        transform: rotate(90deg);
        margin: 0 6px;
        color: #68caff;
      }
    }
  }
}
.chartBox {
  padding: 20px;
  border-radius: 3px;
  box-shadow: 0 0 5px 1px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  background: #fff;
  margin-top: 12px;
  .title {
    width: 100%;
    .timeBox {
      float: left;
      margin-right: 20px;
    }
    .time {
      display: inline-block;
    }
  }
  .chartChange {
    width: 100%;
    height: 440px;
    margin-top: 30px;
  }
}
.school-box {
  max-height: 450px;
  .school-item {
    width: 200px;
    height: 120px;
    float: left;
    text-align: center;
    cursor: pointer;
    margin-left: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: 2px solid #fff;
    .school-logo {
      width: 200px;
      height: 80px;
      margin: 4px auto;
      background-position: 50%;
      background-size: 100% 80%;
      background-repeat: no-repeat;
    }
    .school-name {
      height: 30px;
      line-height: 30px;
    }
  }
  .school-chosed {
    border: 2px solid #20a0ff;
  }
}
</style>
<style>
.service-ruleForm .el-form-item__label {
  font-weight: bold;
  color: #666;
  line-height: 40px;
  font-size: 14px;
  position: relative;
  padding-right: 20px;
}
.service-ruleForm .required .el-form-item__label:before {
  content: "*";
  font-size: 17px;
  position: relative;
  top: 2px;
  display: inline-block;
  color: #f00;
  margin-right: 3px;
}
.description .el-textarea__inner {
  height: 100px;
}
.chartBox .el-input__suffix {
  opacity: 0;
  display: none;
}
</style>
<style lang="scss">
.homeWebAdd {
  .upload-file-item {
    height: 100px !important;
    width: auto !important;
    max-width: 550px !important;
    img {
      display: block;
      width: auto !important;
      max-width: 100% !important;
      height: 100px !important;
    }
  }
  .file-name {
    display: none;
  }
  .icon--block-del {
    display: none !important;
  }
}
</style>
