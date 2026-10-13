<template>
  <div class="homeVisitadd" v-loading="loading">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="warning" size="medium" v-if="state==1 && applyState!=2" @click="updatePracticeActivityEvalInfos(1)">保存草稿</el-button>
      <el-button type="primary" size="medium" v-if="state==1" @click="updatePracticeActivityEvalInfos(2)">{{scopeType==2 ? '保存并下一步' : '保存并发布'}}</el-button>
    </div>
    <div class="body " :style="`height: ${nobottommaxH}px;`">
      <el-steps :active="1" finish-status="success" process-status="finish" class="step_head_box">
        <el-step title="活动基本信息"></el-step>
        <el-step title="评价项设置"></el-step>
        <el-step title="活动分组设置" v-if="scopeType==2"></el-step>
      </el-steps>
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
        <el-form-item label="评价人">
          <el-checkbox-group v-model="checkedCities" :disabled="state==2">
            <el-checkbox label="1">老师</el-checkbox>
            <el-checkbox label="2">同伴</el-checkbox>
            <el-checkbox label="3">家长</el-checkbox>
            <el-checkbox label="4">自己</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="评价项">
          <el-button type="primary" v-if="state==1" size="mini" @click="addpop=true" plain>添加系统评价项</el-button>
          <el-button type="primary" v-if="state==1" size="mini" @click="addfun()" plain>添加自定义评价项</el-button>
          <div class="ul">
            <div class="li" v-for="(item,index) in ruleForm.activityEvalOptionList" :key="index">
              评价项 {{index+1}}
              <el-input type="input" :disabled="state==2" size="small" v-model.trim="item.optionName"
                        placeholder="请输入评价项" :maxlength="20"></el-input>
              <i v-if="state==1" class="el-icon-remove" @click="deletefun(index)"></i>
              <i v-if="state==1&&(index !== 0)" @click="changeQuestionPosition('up', index)"
                 class="el-icon-caret-top"></i>
              <i v-if="state==1&&(index !== ruleForm.activityEvalOptionList.length - 1)"
                 @click="changeQuestionPosition('down', index)" class="el-icon-caret-bottom"></i>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <el-dialog title="系统评价项" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="addpop"
                 width="700px" :lock-scroll="false" :modal-append-to-body='false'>
        <el-checkbox-group v-model="popchecked">
          <el-checkbox v-for="city in typelist" :label="city.value" :key="city">{{city.value}}</el-checkbox>
        </el-checkbox-group>
        <span slot="footer" class="dialog-footer">
                    <el-button @click="addpop = false">取 消</el-button>
                    <el-button type="primary" @click="popcheckedfun()">确 定</el-button>
                </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  import mixin from "@/mixins/windowResize";
  import {
    getPracticeActivityInfoById,
    findSchoolDicsByCode,
    updatePracticeActivityEvalInfo,
    publishPracticeActivityById
  } from "@/api/comprehensivepractice";

  export default {
    name: 'activityAddTwo',
    data() {
      return {
        ruleForm: {
          evalUserTypes: "",
          evalUserTypeNames: "",
          id: this.$route.query.id,
          activityEvalOptionList: []
        },
        typelist: [],
        checkedCities: [],
        addpop: false,
        popchecked: [],
        state: this.$route.query.state,
        applyState: this.$route.query.applyState,
        scopeType: this.$route.query.scopeType
      };
    },
    mixins: [mixin],
    created() {
      findSchoolDicsByCode("practiceEvalList").then((res) => {
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
          if (mydata.activityEvalOptionList.length) {
            this.ruleForm.activityEvalOptionList = mydata.activityEvalOptionList;
            this.checkedCities = mydata.evalUserTypes.split(',');

          }
        })
      },
      deletefun(index) {
        this.ruleForm.activityEvalOptionList.splice(index, 1);
      },
      popcheckedfun() {
        if (this.popchecked.length == 0) {
          this.$message({
            message: '请选择系统评价项！',
            type: 'warning'
          });
          return;
        }
        for (let i = 0; i < this.popchecked.length; i++) {
          this.ruleForm.activityEvalOptionList.push({
            optionName: this.popchecked[i],
            orderNo: "",
          })
        }
        this.addpop = false;
        this.popchecked = [];
      },
      addfun() {
        this.ruleForm.activityEvalOptionList.push({
          optionName: "",
          orderNo: "",
        })
      },
      changeQuestionPosition(type, questionIndex) {
        if (type === 'up') {
          this.ruleForm.activityEvalOptionList = [
            ...this.ruleForm.activityEvalOptionList.slice(0, questionIndex - 1),
            this.ruleForm.activityEvalOptionList[questionIndex],
            this.ruleForm.activityEvalOptionList[questionIndex - 1],
            ...this.ruleForm.activityEvalOptionList.slice(questionIndex + 1)
          ];
        } else {
          this.ruleForm.activityEvalOptionList = [
            ...this.ruleForm.activityEvalOptionList.slice(0, questionIndex),
            this.ruleForm.activityEvalOptionList[questionIndex + 1],
            this.ruleForm.activityEvalOptionList[questionIndex],
            ...this.ruleForm.activityEvalOptionList.slice(questionIndex + 2)
          ];
        }
      },
      richTextEditHandler(introduce) {
        this.ruleForm.introduce = introduce;
      },
      updatePracticeActivityEvalInfos(state) {
        if (this.checkedCities.length == 0) {
          this.$message({
            message: '请选择评价人！',
            type: 'warning'
          });
          return;
        }
        if (this.ruleForm.activityEvalOptionList.length == 0) {
          this.$message({
            message: '请添加评价项！',
            type: 'warning'
          });
          return;
        }
        for (let j = 0; j < this.ruleForm.activityEvalOptionList.length; j++) {
          if (!this.ruleForm.activityEvalOptionList[j].optionName) {
            this.$message({
              message: '评价项名称不能为空！',
              type: 'warning'
            });
            return;
          }
          this.ruleForm.activityEvalOptionList[j].orderNo = j + 1;
        }
        this.loading = true;
        let namelist = [];
        for (let i = 0; i < this.checkedCities.length; i++) {
          if (this.checkedCities[i] == 1) {
            namelist.push("老师")
          }
          if (this.checkedCities[i] == 2) {
            namelist.push("同学")
          }
          if (this.checkedCities[i] == 3) {
            namelist.push("家长")
          }
          if (this.checkedCities[i] == 4) {
            namelist.push("自己")
          }
        }
        this.ruleForm.evalUserTypes = this.checkedCities.join(',');
        this.ruleForm.evalUserTypeNames = namelist.join(',');
        updatePracticeActivityEvalInfo(this.ruleForm).then(res => res.data).then(data => {
          if (data.result) {
            this.loading = false;
            if (state===2) {
              if (this.scopeType == 2) {
                this.$message({
                  message: '操作成功！',
                  type: 'success',
                  duration: 1000
                });
                // 下一步
                this.$router.replace({path: 'activityAddTree', query: {id: this.ruleForm.id, createType: this.$route.query.createType, applyState: this.applyState}})
              } else {
                // 发布
                publishPracticeActivityById(this.ruleForm.id).then(res => res.data).then(data => {
                  if (data.result) {
                    this.$message({
                      message: "发布成功！",
                      type: "success"
                    });
                    this.$router.back();
                  }else{
                    this.$message({
                      message: data.msg,
                      type: 'warning'
                    });
                    this.$router.back();
                  }
                })
              }
            } else {
              this.$message({
                message: '操作成功！',
                type: 'success',
                duration: 1000
              });
              this.$router.back();
            }
          }
        }).catch(() => {
        })
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

      .step_head_box{
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
              color: #409EFF;
              font-size: 22px;
              margin: 5px;
              top: 4px;
              position: relative;
            }

            .el-icon-remove {
              color: #F56C6C;
            }
          }
        }
      }
    }
  }
</style>
