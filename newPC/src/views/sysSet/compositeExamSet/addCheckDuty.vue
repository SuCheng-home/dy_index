<template>
    <div class="addCheckDuty">
        <div class="el-row">
            <div class="top">
                <el-button
                    @click="$router.back()"
                    type="default"
                    size="medium"
                >返回</el-button>
                    <el-button
                        size="medium"
                        type="primary"
                        @click.native="addCheckSave()"
                    >保存</el-button>
            </div>
        </div>
        <div
            class="main-wrap scrollBar"
            :style="{'height':boxH-110+'px'}"
        >
            <el-form
                :model="ruleForm"
                ref="ruleForm"
                label-width="160px"
                class="demo-ruleForm"
            > 
            <el-row>
                    <el-col :span="5">
                        <el-form-item
                            label="检查项名称"
                            class="is-required"
                        ></el-form-item>
                    </el-col>
                    <el-col :span="19">
                        <el-input
                            v-model.trim="ruleForm.itemName"
                            :maxlength="20"
                            placeholder="请输入检查项名称（1-20个字符）"
                        ></el-input>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item
                            label="排序"
                            class="is-required"
                        ></el-form-item>
                    </el-col>
                    <el-col :span="19">
                       <el-input-number v-model.trim="ruleForm.orderNum" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
                        
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item
                            label="评价方式"
                            class="is-required"
                        ></el-form-item>
                    </el-col>
                    <el-col :span="19">
                        <el-radio-group v-model="ruleForm.isStar">
                            <el-radio :label="1">打星</el-radio>
                            <el-radio :label="2">打分</el-radio>
                        </el-radio-group>
                    </el-col>

                </el-row>
                <el-row  v-if="ruleForm.isStar==2">
                         <el-col :span="5">
                        <el-form-item label="加减分步长" class="is-required"></el-form-item>
                    </el-col>
                    <el-col :span="13">
                       <el-radio-group v-model="ruleForm.scoreStep">
                                <el-radio :label="0.1">0.1</el-radio>
                                <el-radio :label="0.2">0.2</el-radio>
                                <el-radio :label="0.5">0.5</el-radio>
                                <el-radio :label="1">1</el-radio>
                            </el-radio-group>
                    </el-col>
                </el-row>
                <el-row style="margin-bottom:20px">
                    <el-col :span="5">
                        <el-form-item
                            label="logo"
                            class="is-required"
                        ></el-form-item>
                    </el-col>
                    <el-col :span="19">
                        <div
                            class="login-box"
                            v-if="ruleForm.logo"
                        >
                            <img
                                :src="ruleForm.logo"
                                alt=""
                            >
    </div>
    <div
        class="logoAdd"
        @click="showDialogLogo"
    >
        <i class="el-icon-plus avatar-uploader-icon navAddIcon"></i>
        <span class="navAddTitle">添加logo</span>
        </div>
        </el-col>
        </el-row>
        <el-row style="margin-bottom:20px">
            <el-col :span="5">
                <el-form-item
                    label="描述"
                    class="is-required"
                ></el-form-item>
            </el-col>
            <el-col :span="19">
                <el-input
                    type="textarea"
                    v-model="ruleForm.itemDesc"
                    placeholder="请输入描述（1-200个字符）"
                    :maxlength="200"
                ></el-input>
            </el-col>
        </el-row>
        <el-row style="margin-bottom:20px;">
            <el-col :span="5">
                <el-checkbox v-model="ruleForm.sectionTab">关联课程表</el-checkbox>
            </el-col>
            <el-col
                :span="19"
                v-show="ruleForm.sectionTab"
            >
                <el-select
                    v-model="ruleForm.selectSection"
                    @change="selectSectionFun"
                    placeholder=""
                >
                    <el-option
                        v-for="item in sectionList"
                        :key="item.id"
                        :label="item.sectionName"
                        :value="item.id"
                    >
                        </el-option>
                        </el-select>
                        </el-col>
        </el-row>
        <el-row style="margin-bottom:20px;">
            <el-col :span="5">
                <el-checkbox v-model="ruleForm.isQuickEvaluation">快捷评价</el-checkbox>
            </el-col>
            <el-col
                :span="19"
                v-show="ruleForm.isQuickEvaluation"
            >
                <el-select
                    v-model="ruleForm.quickEvaluationDCode"
                    placeholder=""
                >
                    <el-option
                        v-for="item in quickEvaluationDList"
                        :key="item.code"
                        :label="item.name"
                        :value="item.code"
                    >
                        </el-option>
                        </el-select>
                        </el-col>
        </el-row>
        <el-row v-if="ruleForm.isStar==2">
            <el-col :span="5">
                <el-form-item label="请设置考核项和分数"></el-form-item>
            </el-col>
            <el-col :span="19">
                <el-button
                    type="text"
                    class="jia_btn"
                    @click="addCheckScore()"
                    title="添加"
                >+</el-button>
                    <span class="totalScore">{{total}}</span>
            </el-col>
        </el-row>
        <el-row v-if="ruleForm.isStar==2">
            <el-col :span="13">
                <el-form-item label=" "></el-form-item>
            </el-col>
            <el-col :span="11">
                <el-row>
                    <el-col
                        v-for="(item,index) in checkItemStr"
                        :key="index"
                    >
                        <div class="grid-content bg-purple-dark">
                            <span>{{item.checkName}}</span>
                            <span class="scoreShow">{{item.checkScore}}</span>
                            <span class="delete">
                                <el-button
                                    type="text"
                                    @click="deleteResult(item,index)"
                                >
                                    <i class="el-icon-delete"></i>
                                    </el-button>
                            </span>
                        </div>
            </el-col>
            </el-row>
            </el-col>
        </el-row>

        </el-form>
        <el-dialog
            title="考核项设置"
            :visible.sync="dialogFormVisible"
        >
            <el-form
                :model="ruleDialogForm"
                :rules="rulesDialog"
                ref="ruleDialogForm"
                label-width="100px"
            >
                <el-form-item
                    label="考核项"
                    prop="checkName"
                >
                    <el-input v-model.trim="ruleDialogForm.checkName" :maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item
                        label="分数"
                        prop="checkScore"
                    >
                        <el-input-number
                            v-model.trim="ruleDialogForm.checkScore"
                            size="medium"
                            :precision="1"
                            placeholder='请输入分数'
                            :step="0.1"
                            :max="100"
                        ></el-input-number>
                            <!-- <el-input v-model.trim="ruleDialogForm.checkScore"></el-input> -->
                            </el-form-item>
                            </el-form>
                            <div
                                slot="footer"
                                class="dialog-footer"
                            >
                                <el-button @click="hideVisible()">取 消</el-button>
                                <el-button
                                    type="primary"
                                    @click="addCheckAndScore()"
                                >确 定</el-button>
                                    </div>
                                    </el-dialog>
                                    <el-dialog
                                        title="logo添加或更换"
                                        :visible.sync="diaLogoVisible"
                                        class="dialoglinkWrap"
                                        width="590px"
                                    >
                                        <div class="dialoglinkBox clearfix">
                                            <div
                                                class="checkitem"
                                                v-for="(logoItem,index) in logoList"
                                                :key="index"
                                            >
                                                <input
                                                    class="check-select"
                                                    type="checkbox"
                                                    v-model="logoItem.isShow"
                                                    name="imgText"
                                                    v-on:click="Checklogo(logoItem)"
                                                >
                                                    <div class="checkitem-box">
                                                        <img
                                                            class="check-img"
                                                            v-if="logoItem.url"
                                                            :src="logoItem.url"
                                                        >
                                                            <img
                                                                class="check-img"
                                                                v-else
                                                                src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png"
                                                            >
                                                                <p class="check-title">{{logoItem.name}}</p>
                                                    </div>
                                        </div>
                                        </div>
                                        <div
                                            slot="footer"
                                            class="dialog-footer"
                                        >
                                            <el-button @click="diaLogoVisible=false">取 消</el-button>
                                            <el-button
                                                type="primary"
                                                @click="addLogoHandler()"
                                            >保 存</el-button>
                                                </div>
                                                </el-dialog>
                                                </div>
                                                </div>
</template>
<script>
import { getClassNoList, addItem } from "@/api/compositeExamSet";
import { getSchoolDicDetailsByTypeCode } from "@/api/common/common";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    const checkScoreRu = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入分数"));
      } else if (!/-?\d+$/.test(value)) {
        callback(new Error("请填写数字"));
      } else if (value > 100) {
        callback(new Error("考核分数超过限制！"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        itemName: "",
        itemDesc: "",
        sectionTab: false,
        selectSection: "",
        isStar: 1,
        sectionName: "",
        sectionNo: "",
        isMorning: "",
        isQuickEvaluation: false, //0:是 1:不是
        quickEvaluationDCode: "",
        logo: "",
        orderNum:1,
        scoreStep:0.1
      },
      ruleDialogForm: {
        checkName: "",
        checkScore: "",
      },
      rulesDialog: {
        checkName: [
          { required: true, message: "请输入考核项", trigger: "blur" },
        ],
        checkScore: [
          {
            required: true,
            trigger: "blur",
            validator: checkScoreRu,
          },
        ],
      },
      checkList: [],
      sectionList: [],
      dialogFormVisible: false,
      checkItemStr: [],
      total: "",
      quickEvaluationDList: [],
      diaLogoVisible: false,
      logoItem: {},
      logoList: [
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/morningRead.png",
          isShow: false,
          name: "晨读",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/noonCheck.png",
          isShow: false,
          name: "午间",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/party.png",
          isShow: false,
          name: "集会",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/clearCheck.png",
          isShow: false,
          name: "清校",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/after_shcool.png",
          isShow: false,
          name: "放学",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/teaching.png",
          isShow: false,
          name: "教学",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/Ceremony.png",
          isShow: false,
          name: "礼仪",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/eyeExerciseCheck.png",
          isShow: false,
          name: "眼操",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/recess.png",
          isShow: false,
          name: "大课间",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/hygienicCheck.png",
          isShow: false,
          name: "卫生",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/zaodu.png",
          isShow: false,
          name: "早读",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/chenbao.png",
          isShow: false,
          name: "晨报",
        },
        {
          url:
            "https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/duanlian.png",
          isShow: false,
          name: "锻炼",
        },
      ],
    };
  },
  created() {
    //获取检查组列表
    if (this.total == "") {
      this.total = 0;
    }
    this.checkItemStr = [];
    getSchoolDicDetailsByTypeCode({
      typeCode: "check",
    })
      .then(res => res.data)
      .then(data => {
        if (data.code === 200) {
          this.quickEvaluationDList = data.data;
          if (this.quickEvaluationDList.length !== 0) {
            this.ruleForm.quickEvaluationDCode = this.quickEvaluationDList[0].code;
          }
        }
      })
      .catch(() => {});

    /**/
    this.getClassNoListFunc();
  },
  mixins: [mixin],
  methods: {
    addLogoHandler() {
      if (
        Object.keys(this.logoItem).length == 0 ||
        (this.logoItem && this.logoItem.isShow == false)
      ) {
        this.$message({
          type: "error",
          message: "请选择logo",
        });
      } else {
        this.ruleForm.logo = this.logoItem.url;
        this.diaLogoVisible = false;
      }
    },
    Checklogo(item) {
      this.logoList.forEach(item => {
        item.isShow = false;
      });
      this.logoItem = item;
    },
    showDialogLogo() {
      this.diaLogoVisible = true;
    },
    deleteResult(item, index) {
      this.checkItemStr.splice(index, 1);
      this.total = this.checkItemStr.reduce(
        (total, scoreItem) => total + Number(scoreItem.checkScore),
        0
      );
    },
    selectSectionFun(value) {
      let obj = {};
      this.sectionList.forEach(item => {
        if (item.id == value) {
          obj = item;
        }
      });
      this.ruleForm.sectionName = obj.sectionName;
      this.ruleForm.sectionNo = obj.sectionNo;
      this.ruleForm.isMorning = obj.isMorning;
    },

    addCheckSave() {
      //保存
      if (this.ruleForm.itemName === "") {
        this.$alert(
          "请填写检查项名称！",
          "提示",
          {
            type: "error",
          },
          {
            confirmButtonText: "确定",
          }
        );
        return false;
      }
      if (this.ruleForm.logo === "") {
        this.$alert(
          "请添加logo!",
          "提示",
          {
            type: "error",
          },
          {
            confirmButtonText: "确定",
          }
        );
        return false;
      }
      if (this.ruleForm.itemDesc === "") {
        this.$alert(
          "请填写检查项描述！",
          "提示",
          {
            type: "error",
          },
          {
            confirmButtonText: "确定",
          }
        );
        return false;
      }
      if (this.ruleForm.isStar == 2 && this.checkItemStr.length == 0) {
        this.$alert(
          "请设置考核项和分数！",
          "提示",
          {
            type: "error",
          },
          {
            confirmButtonText: "确定",
          }
        );
        return false;
      }
      if (!this.ruleForm.sectionTab) {
        this.ruleForm.sectionNo = "";
        this.ruleForm.sectionName = "";
        this.ruleForm.isMorning = "";
      }
      if (!this.ruleForm.isQuickEvaluation) {
        this.ruleForm.quickEvaluationDCode = "";
      }
      let params = new URLSearchParams();
      params.append("id", 0);
      params.append("itemName", this.ruleForm.itemName);
      params.append("logo", this.ruleForm.logo);
      params.append("itemDesc", this.ruleForm.itemDesc);
      params.append("sectionName", this.ruleForm.sectionName);
      params.append("sectionNo", this.ruleForm.sectionNo);
      params.append("isMorning", this.ruleForm.isMorning);
      params.append("isStar", this.ruleForm.isStar);
      params.append("orderNum", this.ruleForm.orderNum);
      params.append(
        "isQuickEvaluation",
        this.ruleForm.isQuickEvaluation ? 0 : 1
      );
      params.append('scoreStep', this.ruleForm.scoreStep);
      params.append("quickEvaluationDCode", this.ruleForm.quickEvaluationDCode);
      params.append("totalScore", this.total);
      params.append("checkItemStr", JSON.stringify(this.checkItemStr));
      addItem(params).then(res => {
        let data = res.data;
        if (data.code === 200) {
          this.$message({
            type: "success",
            message: "检查项添加成功！",
          });
          this.$router.back();
        }
      });
    },
    hideVisible() {
      this.dialogFormVisible = false;
      this.ruleDialogForm.checkName = "";
      this.ruleDialogForm.checkScore = "";
    },
    addCheckScore() {
      this.dialogFormVisible = true;
    },
    addCheckAndScore() {
      const _this = this;
      this.$refs.ruleDialogForm.validate(valid => {
        if (valid) {
          this.checkItemStr.push({
            checkName: _this.ruleDialogForm.checkName,
            checkScore: _this.ruleDialogForm.checkScore,
          });
          _this.ruleDialogForm.checkName = "";
          _this.ruleDialogForm.checkScore = "";
          if (this.checkItemStr) {
            this.total = this.checkItemStr.reduce(
              (total, scoreItem) => total + Number(scoreItem.checkScore),
              0
            );
          }
          _this.dialogFormVisible = false;
        } else {
          return false;
        }
      });
    },
    getClassNoListFunc() {
      getClassNoList().then(res => {
        let data = res.data;
        if (data.code === 200) {
          this.sectionList = data.data;
          this.sectionList.forEach(function(item) {
            item.id = Number(
              item.isMorning.toString() + item.sectionNo.toString()
            );
          });
          if (this.sectionList.length !== 0) {
            this.ruleForm.selectSection = this.sectionList[0].id;
          }
          this.ruleForm.sectionName = this.sectionList[0].sectionName;
          this.ruleForm.sectionNo = this.sectionList[0].sectionNo;
          this.ruleForm.isMorning = this.sectionList[0].isMorning;
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.top {
  padding-bottom: 10px;
  border-bottom: 1px solid #e7eaec;
}
.scrollBar {
  overflow-x: hidden;
  overflow-y: auto;
  &::-webkit-scrollbar-track-piece {
    background: #d3dce6;
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #99a9bf;
    border-radius: 20px;
  }
}
.clearfix:after {
  content: "";
  height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}
.demo-ruleForm {
  width: 810px;
  margin: 0 auto;
}

ul,
li {
  list-style: none;
}

.addCheckDuty {
  padding: 12px;
}

.main-wrap {
  width: 100%;
  padding-top: 20px;
}

.el-form-item.is-required .el-form-item__label:before {
  content: "*";
  color: #ff4949;
  margin-right: 4px;
}

.jia_btn {
  font-size: 32px;
  line-height: 1;
  padding: 0;
  display: inline-block;
}

.scoreShow {
  padding: 0 20px;
}

.totalScore {
  line-height: 36px;
  padding: 0 20px;
}
.login-box {
  float: left;
  width: 100px;
  height: 100px;
  border-radius: 6px;
  overflow: hidden;
  margin-right: 20px;
  img {
    display: block;
    width: 100px;
    height: 100px;
  }
}
.logoAdd {
  float: left;
  width: 100px;
  height: 100px;
  padding-top: 17px;
  line-height: 1;
  border: 1px solid #d0d0d0;
  background-color: #fbfdff;
  border-radius: 6px;
  box-sizing: border-box;
  cursor: pointer;
  text-align: center;
  .navAddIcon {
    font-size: 40px;
    color: #8c939d;
    width: auto;
    height: auto;
  }
  .navAddTitle {
    font-size: 14px;
    color: #8c939d;
    display: block;
    margin-top: 10px;
  }
}
.logoAdd:hover {
  border: 1px solid #409eff;
}
.logoAdd:hover .navAddIcon {
  color: #409eff;
}
.logoAdd:hover .navAddTitle {
  color: #409eff;
}
.dialoglinkBox {
  .check-select {
    position: absolute;
    top: 0;
    right: 9px;
    width: 16px;
    height: 16px;
    cursor: pointer;
    z-index: 10;
  }
  .checkitem {
    width: 100px;
    float: left;
    position: relative;
    margin-right: 10px;
    .checkitem-box {
      width: 100px;
      padding: 10px 0;
      float: left;
      text-align: center;
      position: relative;
      .check-img {
        width: 66px;
        height: 66px;
        display: block;
        border-radius: 6px;
        margin: 0 auto;
      }
      .check-title {
        display: inline-block;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .link-title {
        font-size: 14px;
        color: #333;
        line-height: 26px;
        margin-bottom: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
<style scoped>
.addCheckDuty .el-form-item__label {
  padding-right: 30px;
}

.addCheckDuty .el-textarea__inner {
  height: 100px;
}

.addCheckDuty .el-select {
  width: 100%;
}

.addCheckDuty .el-radio-group {
  height: 36px;
  line-height: 1;
  padding-top: 10px;
}
</style>
