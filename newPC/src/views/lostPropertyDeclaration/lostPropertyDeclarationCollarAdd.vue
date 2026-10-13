<template>
  <div class="lostPropertyDeclarationAdd">
    <back-tool>
      <el-button
        type="primary"
        size="medium"
        @click="preservationNotice()"
      >保存</el-button>
      <el-button
        type="primary"
        size="medium"
        @click="releaseNotice()"
      >发布</el-button>
    </back-tool>
    <div
      style="padding-top:20px;"
      class="mainRepairContent"
      :style="`height: ${nobottommaxH}px;`"
    >
      <div class="body">
        <el-form
          ref="query"
          :model="query"
          label-width="140px"
          :rules="rules"
          style="overflow: hidden;"
        >
          <!-- <el-form-item label="是否对校外开放">
                    <el-tooltip :content="query.outSide === 1 ? '对校外开放' : '不对校外开放'" placement="top">
                        <el-switch v-model="query.outSide" :active-value="1" :inactive-value="0"></el-switch>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="是否对校友开放">
                    <el-tooltip :content="query.schoolFellow === 1 ? '对校友开放' : '不对校友开放'" placement="top">
                        <el-switch v-model="query.schoolFellow" :active-value="1" :inactive-value="0"></el-switch>
                    </el-tooltip>
                </el-form-item> -->
          <el-form-item
            prop="publishType"
            label="发布范围"
          >
            <el-radio-group v-model="query.publishType">
              <el-radio :label="1">全校</el-radio>
              <el-radio :label="2">教师</el-radio>
              <el-radio :label="3">家长</el-radio>
              <el-radio :label="4">其他</el-radio>
            </el-radio-group>
            <address-book
              :config="configData"
              v-if="query.publishType == 4"
              v-model="query.addressData"
            ></address-book>
          </el-form-item>
           <el-form-item label="落款部门" prop="inscribeDeptName">
            <div class="boxInput">
              <el-input
                v-model.trim="query.inscribeDeptName"
                placeholder="请输入或选则落款部门(1~10)"
                :maxlength="10"
              ></el-input>
              <div class="boederheid"></div>
            </div>
            <div class="box">
              <el-select v-model="query.inscribeDeptName">
                <el-option
                  v-for="item in departmentList"
                  :label="item.name"
                  :value="item.name"
                  :key="item.name"
                ></el-option>
              </el-select>
            </div>
          </el-form-item>
          <el-form-item
            class="form-item--richtext"
            prop="content"
            label="物品描述"
          >
            <el-input
              class="description"
              @blur="inputBlurHandler()"
              v-model="query.content"
              type="textarea"
              resize="none"
              placeholder="请输入物品描述(1~120)"
              :rows="6"
              :maxlength="120"
            ></el-input>
          </el-form-item>
          <el-form-item label="物品图片">
            <uploader
              pathPrefix="lost"
              showResult="image"
              showMode="image"
              :extList="['png', 'jpg', 'jpeg', 'bmp', 'gif']"
              v-model="query.lostSearchPic"
              :multiple="true"
            ></uploader>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
//获取添加失物申报的方法的方法  获取审批详情的方法
import {
  insertSearchAnnouncement,
  lostlostDeclareDetails,
} from "@/api/lostPropertyDeclaration";
//获取列表的方法
import { queryDepartByUserId } from "@/api/system";
//	返回按钮
import BackTool from "@/components/BackTool";
import Uploader from "@/components/Uploader/WebUploader";
import mixin from "@/mixins/windowResize";
import AddressBook from "@/components/AddressBook/indexExpand";

export default {
  name: "lostPropertyDeclarationAdd",
  //引入返回模块
  components: {
    BackTool,
    Uploader,
    AddressBook,
  },
  data: function () {
    return {
      dialogImageUrl: "", //图片预览路径
      dialogVisible: false, //是否展示图片
      UploadPath: `${global.BasePath}common/addImageUp`, //图片上传路径
      rules: {
        content: [
          {
            required: true,
            message: "请输入物品描述！",
            trigger: "blur",
          },
        ],
         inscribeDeptName: [
          {
            required: true,
            message: "请输入或选择部门！",
            trigger: "blur",
          },
        ],
      },
      // 地址簿参数
      configData: {
        title: "选择发布范围",
        depart: { target: "depart", departType: "t", userTypes: "1" },
      },
      query: {
        announcementType: 2, //1是申报2是招领
        outSide: 0, //校外 0是不对外 1是对外
        schoolFellow: 0, //校友  0是不对外 1是对外
        status: 2, //2发布表示
        content: "", //内容
        lostSearchPic: [], //图片数组
        declareUserId: 0,
        declareUserName: "", //姓名
        declareUserPhone: "", //电话
        inscribeDeptName: "", //落款部门
        declareId: 0, //	失物申报的id,由失物申报转为寻物启事时设值

        publishType: 1,
        auditStatus: 1,
        addressData: {
          departJson: [],
        },
      },
      getDetails: {
        lostDeclareId: this.$route.query.id,
      },
      exhibitionImg: [], //展示图片数组,
      departmentList:[]
    };
  },
  mixins: [mixin],
  created(){
      let userid = this.$store.getters.userInfo.id;
    queryDepartByUserId(userid, "")
      .then((res) => {
        //获取落款部门
        if (res.data.code === 200) {
          let lists = [];
          for (let item of res.data.data) {
            lists.push({
              name: item.name,
              value: item.id,
            });
            this.departmentList = lists;
          }
        } else {
          this.$message({
            type: "warning",
            message: "未获取到落款部门!",
          });
        }
      })
      .catch((err) => {});
  },
  methods: {
    
    // 去除参数空格
    inputBlurHandler() {
      this.query.content = this.query.content.trim();
    },
    //传输数据
    insertSearchAnnouncement() {
      const dataQuery = Object.assign({}, this.query, {
        announcementType: 2,
      });
      dataQuery.lostSearchPic.forEach((item) => {
        item.picUrl = item.fileUrl;
      });

      if (dataQuery.publishType == 4) {
        if (dataQuery.addressData.departJson.length) {
          dataQuery.departJson = [...dataQuery.addressData.departJson];
        } else {
          this.$message({
            type: "error",
            message: "请选择发布范围",
          });
          return;
        }
      } else {
        dataQuery.departJson = [];
      }

      this.$refs["query"].validate((valid) => {
        if (valid) {
          insertSearchAnnouncement(dataQuery)
            .then((res) => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "操作成功!",
                });
                this.$router.back();
              }
            })
            .catch(function () {});
        }
      });
    },
    // 发布寻物启事
    releaseNotice() {
      this.query.status = 2;
      this.insertSearchAnnouncement();
    },
    //保存
    preservationNotice() {
      this.query.status = 1;
      this.insertSearchAnnouncement();
    },
    //更改落款部门
    selectChange(val) {
      this.departmentList.forEach((item) => {
        if (item["id"] === val) {
          this.query.inscribeDeptName = item["name"];
        }
      });
    },
  },
};
</script>
<style scoped>
.lostPropertyDeclarationAdd {
  padding:12px;
}

.lostPropertyDeclarationAdd .el-textarea__inner,
.lostPropertyDeclarationAdd .el-input {
  width: 100%;
}
.body {
  width: 810px;
  margin: 0 auto;
}
.lostPropertyDeclarationAdd .box {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
}

.lostPropertyDeclarationAdd .box .el-select {
  width: 100%;
}

.lostPropertyDeclarationAdd .boxInput {
  width: 90%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 999;
  border-right: none;
}

.lostPropertyDeclarationAdd .boxInput .el-input {
  width: 100%;
}

.lostPropertyDeclarationAdd .boederheid {
  width: 50px;
  position: absolute;
  right: 0;
  top: 1px;
  z-index: 1000;
  background: #fff;
  height: 34px;
}
.el-textarea{
  width: 99%;
}
</style>
