<template>
  <div class="healthTotalList">
    <div class="header-wrap">
      <div class="header">
        <el-row>
          <template>
            <el-date-picker
                    v-model="date"
                    type="date"
                    size="medium"
                    class="btnLeftLine"
                    placeholder="请选择日期"
                    :clearable="false"
                    @change="dateChangeHandler"
            >
            </el-date-picker>
          </template>
        </el-row>
      </div>
    </div>
    <div class="main-wrap"  :style="{'height':nobottommaxH+'px'}" style="overflow: auto">
      <div class="schoolTitle">
        {{date}}全校晨午检统计
      </div>
      <div class="section">
        <div class="sectionTop">
          教职工
          <span @click="jumpTo('healthTeaTotalList',{day:date})">查看详情</span>
        </div>
        <div class="sectionCont clearfix">
          <div class="sumBlock">
            <div class="sumTitle">
              {{teacherhealthList.allCount}}
            </div>
            <div class="sumTxt">
              总人数
            </div>
          </div>
          <div class="sumBlock">
            <div class="sumTitle">
              {{teacherhealthList.mUnusualCount}}
            </div>
            <div class="sumTxt">
              晨检体温异常
            </div>
          </div>
          <div class="sumBlock">
            <div class="sumTitle">
              {{teacherhealthList.nUnusualCount}}
            </div>
            <div class="sumTxt">
              午检体温异常
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <div class="sectionTop">
          学生
          <span @click="jumpTo('healthStuTotalList',{day:date})">查看明细</span>
        </div>
        <div class="sectionCont clearfix">
          <div class="sumBlock">
            <div class="sumTitle">
              {{studenthealthList.allCount}}
            </div>
            <div class="sumTxt">
              总人数
            </div>
          </div>
          <div class="sumBlock">
            <div class="sumTitle">
              {{studenthealthList.mReportCount}}
            </div>
            <div class="sumTxt">
              晨检人数
            </div>
          </div>
          <div class="sumBlock">
            <div class="sumTitle">
              {{studenthealthList.mAbsenceCount}}
            </div>
            <div class="sumTxt">
              晨检请假
            </div>
          </div>
          <div class="sumBlock">
            <div class="sumTitle">
              {{studenthealthList.mUnusualCount}}
            </div>
            <div class="sumTxt">
              晨检体温异常
            </div>
          </div>
          <div class="sumBlock">
            <div class="sumTitle">
              {{studenthealthList.nReportCount}}
            </div>
            <div class="sumTxt">
              午检人数
            </div>
          </div>
          <div class="sumBlock">
            <div class="sumTitle">
              {{studenthealthList.nAbsenceCount}}
            </div>
            <div class="sumTxt">
              午检请假
            </div>
          </div>
          <div class="sumBlock">
            <div class="sumTitle">
              {{studenthealthList.nUnusualCount}}
            </div>
            <div class="sumTxt">
              午检体温异常
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import mixin from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import {getSchoolThTempStaticsData,getSchoolStuTempAndDutyStaticsData} from '@/api/healthNewCheck';
export default {
  data(){
    return{
      date:this.$moment(new Date()).format('YYYY-MM-DD'),
      teacherhealthList: {},
      studenthealthList: {},
    }
  },
  created(){
    this.twoFunc();
  },
  mounted(){

  },
  computed: {
    ...mapGetters(['userInfo']),
  },
  mixins: [mixin],
  methods:{
    jumpTo(path,query){
      this.$router.push({
        path,
        query
      })
    },
    twoFunc(){
      this.getSchoolThTempStaticsDataFunc();
      this.getSchoolStuTempAndDutyStaticsDataFunc();
    },
    getSchoolThTempStaticsDataFunc() {
      getSchoolThTempStaticsData({
        day:this.date
      }).then(res => res.data)
      .then(data => {
        if (data.code === 200) {
          this.teacherhealthList=data.data;
        }else{
          this.$message({
            type: "error",
            message: `${data.msg}`
          });
        }
      }).catch(()=>{});
    },
    getSchoolStuTempAndDutyStaticsDataFunc() {
      getSchoolStuTempAndDutyStaticsData({
          day:this.date
      }).then(res => res.data)
      .then(data => {
          if (data.code === 200) {
            this.studenthealthList=data.data;
          }else{
            this.$message({
              type: "error",
              message: `${data.msg}`
            });
        }
      }).catch(()=>{});
    },
    dateChangeHandler(value){
      this.date = this.$moment(value).format('YYYY-MM-DD');
      this.twoFunc();
    }
  }
}
</script>

<style lang="scss" scoped>
.clearfix:after {
  content: "";
  height: 0;
  display: block;
  clear: both;
  visibility: hidden;
}
.healthTotalList{
  padding:12px;
  box-sizing: border-box;
  background-color: #fff;
  .header-wrap{
    padding-bottom:10px;
    border-bottom: 1px solid #e7eaec;
  }
  .main-wrap{
    padding-top: 20px;
    .schoolTitle{
      height: 30px;
      line-height: 30px;
      text-align: center;
      margin-bottom: 30px;
      font-size: 20px;
      font-weight: 700;
    }
    .section{
      margin-bottom:20px;
      .sectionTop{
        height: 20px;
        line-height: 22px;
        margin-bottom: 20px;
        padding-left: 10px;
        border-left: 4px solid #409eff;
        font-size: 16px;
        font-weight: 700;
        position: relative;
        box-sizing: border-box;
        span{
          margin-left: 20px;
          color: #409eff;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
        }
      }
      .sectionCont{
        padding-left:20px;
        box-sizing: border-box;
        .sumBlock{
          text-align: center;
          float: left;
          width: 133px;
          margin-top: 10px;
          margin-right:60px;
          padding: 10px;
          border-radius: 5px;
          background: #eff6fe;
          .sumTitle{
            width:100%;
            height: 50px;
            line-height: 50px;
            margin-bottom: 5px;
            font-size: 40px;
            font-weight: 700;
            color: #409eff;
          }
          .sumTxt{
            height: 32px;
            line-height: 22px;
            width:100%;
            color: #83bbff;
            overflow: hidden;
          }
        }
      }
    }
  }
}
.healthSectionRed{
  color:#F66C6C
}
</style>
<style lang="scss">
.healthTotalList .el-button+.el-button{
  margin-left:4px;
}
</style>
