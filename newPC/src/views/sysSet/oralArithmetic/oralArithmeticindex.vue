<template>
  <div class="oralArithmeticindex">
    <backtool>
      <el-button type="primary" size="medium" @click.native="addAndUpdateOralClockInit()">保存</el-button>
    </backtool>
    <div>
      <el-form label-width="200px" class="demo-ruleForm">
        <el-form-item>
          <div class="top_title">提醒家长</div>
          <div class="check_box_wrap">
            <el-checkbox v-model="isSendParent">打卡提醒(每天20：00)</el-checkbox>
          </div>  
          <div class="top_title">提醒老师</div>
          <div class="check_box_wrap">
            <el-checkbox v-model="isSendTh">查看打卡情况(每天13:00)</el-checkbox>
          </div>
          <div class="top_title">执行范围</div>
          <div class="check_box_wrap">
            <el-radio-group v-model="scopeType">
              <el-radio :label="1">全校</el-radio>
              <el-radio :label="2">按年级</el-radio>
            </el-radio-group>
          </div>
          <div class="check_box_wrap" v-show="scopeType === 2">
            <el-checkbox-group v-model="selectGrade">
              <el-checkbox :label="item.levelName" :key="index" v-for="(item, index) in gradeList"></el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import Backtool from '@/components/BackTool';
  import { listGradeBySchoolType, addAndUpdateOralClockInit, getOralClockInit} from '@/api/oralArithmetic';
  export default {
    name: 'readPunchClockSetIndex',
    components: {
      Backtool
    },
    data() {
      return {
        isSendParent: false,//打卡提醒
        isSendTh: false,//查看打卡情况
        scopeType: 1,//发布范围
        selectGrade: [],//选中年级数组
        gradeList: []//年级数组
      };
    },
    created() {
      //获取详情
      this.getOralClockInit();
      this.listGradeBySchoolType(this.$store.getters.schoolInfo.type);
    },
    methods: {
     //获取学校年级
      listGradeBySchoolType(type) {
        listGradeBySchoolType(type).then(res => {
          let data = res.data.data;
          if (res.data.code === 200) {
            data.forEach((item) => {
              this.gradeList.push({
                  level: item.level,
                  levelName: item.name
              });
            });
          }
        }).catch();
      },      
      getOralClockInit() {
        getOralClockInit().then(res => {
          let data = res.data.data;
          if(data){
              if (res.data.code === 200) {
              if(data.isSendParent==2){
                  this.isSendParent=true;
              };
              if(data.isSendTh==2){
                  this.isSendTh=true;
              }
              this.scopeType = data.scopeType;
              if (JSON.parse(data.levelJson).length) {
                JSON.parse(data.levelJson).forEach((item) => {
                  this.selectGrade.push(item.levelName);
                });
              }
            }

          }
          
        }).catch();
      },
      //保存设置
      addAndUpdateOralClockInit() {
        let levelJson=[];
        this.gradeList.forEach((item) => {
          if (this.selectGrade.indexOf(item.levelName) > -1) {
            levelJson.push({
                  level: item.level,
                  levelName: item.levelName
            })
          }
        });
        let query = {
          scopeType: this.scopeType,
          levelJson: this.scopeType==1 ? [] : levelJson,
          isSendParent: this.isSendParent ? 2 : 1,
          isSendTh: this.isSendTh ? 2 : 1,
        };
        addAndUpdateOralClockInit(query).then(res => {
          let data = res.data;
          if (data.code === 200) {
            this.$message({
              message: '设置成功！',
              type: 'success'
            });
            this.$router.back();
          }
        }).catch();
      }
    }
  };
</script>
<style lang="scss" scoped>
  .oralArithmeticindex{
    padding:12px;
    .top_title{
      height: 30px;
      line-height: 30px;
      margin-top: 10px;
      font-size: 16px;
      font-weight: 700;
    }
    .check_box_wrap{
      margin-left: 30px;
    }
  }
</style>
