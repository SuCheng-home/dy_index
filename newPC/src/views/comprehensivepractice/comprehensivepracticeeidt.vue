<template>
  <div class="homeVisitadd" v-loading="loading">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="warning" size="medium" @click="addPracticeActivityBaseInfos(1)" v-if="state!=2">保存草稿</el-button>
      <el-button type="primary" size="medium" @click="addPracticeActivityBaseInfos(2)">保存并下一步</el-button>
    </div>
    <div class="body " :style="`height: ${nobottommaxH}px;`">
      <el-steps :active="0" finish-status="success" process-status="finish" class="step_head_box">
        <el-step title="活动基本信息"></el-step>
        <el-step title="评价项设置"></el-step>
        <el-step title="活动分组设置"></el-step>
      </el-steps>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
        <el-form-item label="活动名称" prop="activityName">
          <el-input type="input" v-model.trim="ruleForm.activityName" placeholder="请输入活动名称" :maxlength="20"></el-input>
        </el-form-item>
        <el-form-item label="实践类型" prop="typeCode">
          <el-select size="medium" v-model="ruleForm.typeCode" disabled placeholder="请选择类型">
            <el-option v-for="item in typelist" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="阶段设置">
          <el-button type="primary" size="mini" @click="addfun()" plain>+ 添加</el-button>
          <div class="ul">
            <div class="li" v-for="(item,index) in ruleForm.activityStageList" :key="index">
              第 {{index+1}} 阶段
              <el-input type="input" size="small" v-model.trim="item.stageName" placeholder="请输入阶段名称"
                        :maxlength="20" :disabled="state=='2' && item.id"></el-input>
              <i class="el-icon-remove-outline" @click="deletefun(index)" v-if="!(state=='2' && item.id)"></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="活动人员设置" v-show="ruleForm.createType===1">
          <el-radio-group v-model="ruleForm.scopeType" disabled>
            <el-radio :label="1">按教师</el-radio>
            <el-radio :label="2">自定义分组</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="指导教师" prop="mainUserJsonprop" v-show="ruleForm.createType===1">
          <address-book v-model="ruleForm.mainUserJson" :config="teacherConfigData"
                        :isSchoolManager="true"></address-book>
        </el-form-item>
        <el-form-item class="new-editor" label="活动介绍" prop="introduce">
          <ueditor class="rich-editor new-editor" ref="ueditor" :defaultMes="ruleForm.introduce"
                   @editModel="richTextEditHandler"></ueditor>
        </el-form-item>
        <el-form-item label="附件">
          <uploader pathPrefix="zongheshijianpingjia" module="zongheshijianpingjia" moduleCode="20220418" :multiple="true" :extList="allFileTypeList"
                    v-model="ruleForm.filesJson"></uploader>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import mixin from "@/mixins/windowResize";
  import AddressBook from "@/components/AddressBook/indexExpand";
  import Uploader from '@/components/Uploader/WebUploader';
  import {
    updatePracticeActivityBaseInfo,
    editPracticeActivityBaseInfoAfterPublish,
    findSchoolDicsByCode,
    getPracticeActivityInfoById
  } from "@/api/comprehensivepractice";
  import Ueditor from "@/components/Ueditor";

  export default {
    components: {AddressBook, Ueditor, Uploader},
    data() {
      const mainUserJsonpropfun = (rule, value, callback) => {
        if (this.ruleForm.scopeType == 1) {
          if (this.ruleForm.mainUserJson.departJson.length || this.ruleForm.mainUserJson.userJson.length) {
            return callback();
          } else {
            return callback(new Error("请选择教师"));
          }
        } else {
          if ((this.ruleForm.mainUserJson.departJson.length == 0) && (this.ruleForm.mainUserJson.userJson.length == 1)) {
            return callback();
          } else {
            return callback(new Error("自定义分组请选择一名老师"));
          }
        }

      };
      return {
        state: this.$route.query.state,
        teacherConfigData: {
          title: "教师",
          depart: {target: "all", departType: "t", userTypes: "1"},
          group: false
        },
        ruleForm: {
          activityName: "",
          mainUserJson: {departJson: [], groupJson: [], userJson: []},
          filesJson: [],
          state: 1,
          typeCode: 0,
          scopeType: 1,
          createType: 1,
          typeName: "",
          introduce: "",
          activityStageList: [],
          id: this.$route.query.id
        },
        rules: {
          activityName: [
            {required: true, message: "请输入活动名称", trigger: "blur"}
          ],
          mainUserJsonprop: [
            {validator: mainUserJsonpropfun, trigger: "change", required: true}
          ],
          typeCode: [
            {required: true, message: "请选择实践类型", trigger: "change"}
          ],
          introduce: [
            {required: true, message: "活动介绍不能为空", trigger: "change"}
          ]
        },
        loading: false,
        allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf'],
        typelist: []

      };
    },
    mixins: [mixin],
    created() {
      if (this.$route.query.createType == '2') {
        this.ruleForm.createType = 2;
      }
      findSchoolDicsByCode("practiceActivityType").then((res) => {
        const data = res.data.data;
        if (res.data.code === 200) {
          this.typelist = data;
        }
      });
      this.getPracticeActivityInfoByIds();
    },
    methods: {
      getPracticeActivityInfoByIds() {
        getPracticeActivityInfoById(this.$route.query.id).then(res => res.data).then(data => {
          let mydata = data.data;
          this.ruleForm.activityName = mydata.activityName;
          this.ruleForm.introduce = mydata.introduce;
          this.$refs.ueditor.setContent(mydata.introduce);
          this.ruleForm.filesJson = JSON.parse(mydata.filesJson);
          this.ruleForm.scopeType = mydata.scopeType;
          this.ruleForm.typeCode = mydata.typeCode;
          this.ruleForm.activityStageList = mydata.activityStageList;
          this.$set(this.ruleForm, "mainUserJson", JSON.parse(mydata.mainUserJson))
        })
      },
      deletefun(index) {
        this.ruleForm.activityStageList.splice(index, 1);
      },
      addfun() {
        this.ruleForm.activityStageList.push({
          stageName: "",
          orderNo: "",
        })
      },
      richTextEditHandler(introduce) {
        this.ruleForm.introduce = introduce;
      },
      addPracticeActivityBaseInfos(state) {
        this.$refs.ruleForm.validate(valid => {
          if (valid) {
            for (let j = 0; j < this.typelist.length; j++) {
              if (this.ruleForm.typeCode == this.typelist[j].code) {
                this.ruleForm.typeName = this.typelist[j].value;
              }
            }
            if (this.ruleForm.activityStageList.length == 0) {
              this.$message({
                message: '请添加活动阶段！',
                type: 'warning'
              });
              return;
            }
            for (let j = 0; j < this.ruleForm.activityStageList.length; j++) {
              if (!this.ruleForm.activityStageList[j].stageName) {
                this.$message({
                  message: '活动阶段名称不能为空！',
                  type: 'warning'
                });
                return;
              }
              this.ruleForm.activityStageList[j].orderNo = j + 1;
            }
            this.loading = true;
            if (this.state == 2) {
              this.ruleForm.state = 2;
              editPracticeActivityBaseInfoAfterPublish(this.ruleForm).then(res => res.data).then(data => {
                if (data.result) {
                  this.$message({
                    message: '操作成功！',
                    type: 'success',
                    duration: 1000
                  });
                  this.loading = false;
                  if (state===2) {
                    this.$router.replace({path: 'activityAddTwo', query: {id: this.ruleForm.id, scopeType: this.ruleForm.scopeType, state: 1, createType: this.ruleForm.createType, applyState: this.state}})
                  } else {
                    this.$router.back();
                  }
                }
              }).catch(() => {})
            } else {
              updatePracticeActivityBaseInfo(this.ruleForm).then(res => res.data).then(data => {
                if (data.result) {
                  this.$message({
                    message: '操作成功！',
                    type: 'success',
                    duration: 1000
                  });
                  this.loading = false;
                  if (state===2) {
                    this.$router.replace({path: 'activityAddTwo', query: {id: data.data.id, scopeType: data.data.scopeType, state: 1, createType: this.ruleForm.createType, applyState: this.state}})
                  } else {
                    this.$router.back();
                  }
                }
              }).catch(() => {})
            }
          }
        });
      }
    }
  };
</script>
<style lang="scss" scoped>
  .homeVisitadd {
    padding: 12px;

    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }

    .body {
      overflow: auto;

      .step_head_box {
        width: 600px;
        margin: 20px auto;
      }

      .demo-ruleForm {
        width: 810px;
        margin: 20px auto;

        .ul {
          .li {
            .el-input {
              width: 400px;
            }

            i {
              font-size: 22px;
              margin: 5px;
              color: #F56C6C;
            }
          }
        }
      }
    }
  }
</style>
