<template>
  <div class="homeVisitadd" v-loading="loading">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <!--         <el-button type="primary" size="medium" v-if="ruleForm.scopeType==2" @click="groupingsettings()" >分组设置</el-button>-->
      <!--         <el-button type="primary" size="medium" @click="evaluationsetting()" >评价设置</el-button>-->
      <el-button type="primary" size="medium" @click="saveActivity(2)" v-if="state==-1">通过</el-button>
      <el-button type="danger" size="medium" @click="showBox=true" v-if="state==-1">驳回</el-button>
    </div>
    <div class="body " :style="`height: ${nobottommaxH}px;`">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
        <el-form-item label="活动名称">
          {{ruleForm.activityName}}
        </el-form-item>
        <el-form-item label="实践类型" prop="typeCode">
          {{ruleForm.typeName}}
        </el-form-item>
        <el-form-item label="阶段设置">
          <div class="ul">
            <div class="li" v-for="(item,index) in ruleForm.activityStageList" :key="index">
              第 {{index+1}} 阶段：
              {{item.stageName}}
            </div>
          </div>
        </el-form-item>
        <el-form-item label="活动人员设置">
          {{ruleForm.scopeType==1?"按教师":"自定义分组"}}
        </el-form-item>
        <el-form-item label="教师">
          <range-list :departJson="ruleForm.mainUserJson.departJson"
                      :userJson="ruleForm.mainUserJson.userJson"></range-list>
        </el-form-item>
        <el-form-item class="new-editor" label="活动介绍">
          <image-previewer tag="richtext">
            <div v-html="ruleForm.introduce"></div>
          </image-previewer>
        </el-form-item>
        <el-form-item label="" v-if="ruleForm.filesJson.length">
          <file-list :fileList="ruleForm.filesJson"></file-list>
        </el-form-item>
      </el-form>
    </div>

    <el-dialog title="驳回" :visible.sync="showBox" width="500px" :close-on-press-escape='false'
               :close-on-click-modal='false' :modal-append-to-body='false'>
      <div>
        <el-form :model="listQuery" :rules="rules" ref="form" class="demo-ruleForm">
          <el-form-item label="" prop="approveOption">
            <el-input type="textarea" :rows="4" placeholder="请填写审批意见" maxlength="200" v-model="listQuery.approveOption"></el-input>
          </el-form-item>
        </el-form>

      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="showBox = false">取 消</el-button>
        <el-button type="primary" @click="saveActivity(3)" :loading="isLoading">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import mixin from "@/mixins/windowResize";
  import moment from "moment";
  import RangeList from "@/components/RangeList/RangeList";
  import FileList from '@/components/FileList/FileList.vue';
  import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
  import {
    getPracticeActivityInfoById, approvePracticeActivity
  } from "@/api/comprehensivepractice";

  export default {
    components: {RangeList, FileList, ImagePreviewer},
    data() {
      return {
        isLoading: false,
        showBox: false,
        listQuery: {
          approveOption: ''
        },
        rules: {
          approveOption: [{ required: true, message: '请填写审批意见', trigger: 'change' }]
        },
        ruleForm: {
          activityName: "",
          mainUserJson: {departJson: [], groupJson: [], userJson: []},
          filesJson: [],
          state: 1,
          typeName: "",
          introduce: "",
          activityStageList: []
        },
        state: this.$route.query.state
      };
    },
    mixins: [mixin],
    created() {
      this.getPracticeActivityInfoByIds();
    },
    methods: {
      getPracticeActivityInfoByIds() {
        getPracticeActivityInfoById(this.$route.query.id).then(res => res.data).then(data => {
          let mydata = data.data;
          this.ruleForm.activityName = mydata.activityName;
          this.ruleForm.introduce = mydata.introduce;
          this.ruleForm.filesJson = JSON.parse(mydata.filesJson);
          this.ruleForm.scopeType = mydata.scopeType;
          this.ruleForm.typeName = mydata.typeName;
          this.ruleForm.activityStageList = mydata.activityStageList;
          this.$set(this.ruleForm, "mainUserJson", JSON.parse(mydata.mainUserJson))
        })
      },
      evaluationsetting() {
        this.$router.push({
          path: "evaluationsetting",
          query: {id: this.$route.query.id, state: this.$route.query.state}
        })
      },
      groupingsettings() {
        this.$router.push({
          path: "groupingsettings",
          query: {id: this.$route.query.id}
        })
      },
      saveActivity(state) {
        if (state===2) {
          this.approvePracticeActivity({
            approveOption: '',
            id: this.$route.query.id,
            state: state
          });
        } else {
          this.$refs.form.validate(isValid => {
            if (isValid) {
              this.approvePracticeActivity({
                approveOption: this.listQuery.approveOption,
                id: this.$route.query.id,
                state: state
              });
            }
          })
        }
      },
      approvePracticeActivity(query) {
        this.isLoading = true;
        approvePracticeActivity(query).then(res => {
          const data = res.data;
          if (data.code === 200 && data.result) {
            this.$message.success('操作成功');
            this.$router.back()
          } else {
            this.$message.error(data.msg);
          }
          this.isLoading = false;
        }).catch(() => {
          this.isLoading = false;
        });
      },
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
