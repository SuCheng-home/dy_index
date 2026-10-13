<template>
  <div class="app-container calendar-list-container" id="signupStuDetail">
    <div class="filter-container">
      <el-row>
        <el-col :span="19">
          <el-button v-if="!hideReturn" type="default" @click="$router.back()" size="medium">返回</el-button>
          <el-button @click="print()" type="primary" size="medium">打印</el-button>
        </el-col>
      </el-row>
    </div>
    <div ref="print">
      <div class="content" id="content">
         <img v-if="studentData.firstExamState==1" style="float: right; height: 30px;" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/chushentongguo.png" />
        <div class="print-header print-header--sub">
          特长生登记表         
          <!-- {{studentData.subjectStudentName}}登记表 -->
        </div>
        <table class="talent-table" border="1">
          <tr>
            <td class="table-title" colspan="28">姓名</td>
            <td colspan="42">{{studentData.stuName}}</td>
            <td class="table-title" colspan="28">登记ID号</td>
            <td colspan="42">{{studentData.orderNo}}</td>
            <td class="table-title" colspan="28">建档号</td>
            <td colspan="42">{{studentData.recordNum}}</td>
          </tr>
          <tr>
            <td class="table-title" colspan="28">是否应届生</td>
            <td colspan="42">{{studentData.isFreshGraduate === 2 ? '是' : '否'}}</td>
            <td class="table-title" colspan="28">家长电话1</td>
            <td colspan="42">{{studentData.loginPhone}}</td>
            <td class="table-title" colspan="28">家长电话2</td>
            <td colspan="42">{{studentData.loginPhone2}}</td>
          </tr>
          <tr>
            <td class="table-title" colspan="28">初中所在区</td>
            <td colspan="42">{{studentData.schoolCountyName}}</td>
            <td class="table-title" colspan="28">初中学校</td>
            <td colspan="42">{{studentData.graduateSchoolName}}</td>
            <td class="table-title" colspan="28">特长生志愿是否服从调剂</td>
            <td colspan="42">{{studentData.isObey==1?'否':'是'}}</td>
          </tr>
          <tr>
            <td class="table-title" :colspan="(schoolId!=852)?28:42" >班级</td>
            <td  :colspan="(schoolId!=852)?42:63">{{studentData.locateClassName}}</td>
            <td class="table-title" :colspan="(schoolId!=852)?28:42">特长生选报科目（首选）</td>
            <td  :colspan="(schoolId!=852)?42:63">{{studentData.subjectStuSchoolName}}{{studentData.subjectStudentName}}</td>
            <td class="table-title" v-if="schoolId!=852" colspan="28">特长生选报科目（备选）</td>
            <td colspan="42"  v-if="schoolId!=852">{{studentData.spareSubStuSchoolName}}{{studentData.spareSubStuName}}</td>
          </tr>
          <tr>
            <td class="table-title" colspan="210">成绩信息 以下信息有则填，无则打斜杠“/”</td>
          </tr>
          <tr>
            <td class="table-title" :colspan="isShowBySetting('showSubjectsScore')?28:35">考试名称</td>
            <td class="table-title" :colspan="isShowBySetting('showSubjectsScore')?12:25">总分</td>
            <td class="table-title" colspan="12"  v-if="isShowBySetting('showSubjectsScore')">语文</td>
            <td class="table-title" colspan="12"  v-if="isShowBySetting('showSubjectsScore')">数学</td>
            <!-- <td class="table-title" colspan="12"  v-if="isShowBySetting('showSubjectsScore')">英语(试卷满分)</td> -->
            <td class="table-title" colspan="12"  v-if="isShowBySetting('showSubjectsScore')">英语</td>
            <td class="table-title" colspan="12"  v-if="isShowBySetting('showSubjectsScore')">物理</td>
            <td class="table-title" colspan="12"  v-if="isShowBySetting('showSubjectsScore')">化学</td>
            <td class="table-title" colspan="12"  v-if="isShowBySetting('showSubjectsScore')">历史</td>
            <td class="table-title" colspan="12"  v-if="isShowBySetting('showSubjectsScore')">政治</td>
            <td class="table-title" :colspan="isShowBySetting('showSubjectsScore')?12:25" >班级排名</td>
            <td class="table-title" :colspan="isShowBySetting('showSubjectsScore')?12:25">年级排名</td>
            <td class="table-title" :colspan="isShowBySetting('showSubjectsScore')?12:25">区排名</td>
            <td class="table-title" :colspan="isShowBySetting('showSubjectsScore')?23:25">是否联合体考试</td>
            <td class="table-title" :colspan="isShowBySetting('showSubjectsScore')?12:25">联合体排名</td>
            <td class="table-title" :colspan="isShowBySetting('showSubjectsScore')?15:25">成绩单</td>
          </tr>
          <tr v-for="(item, index) in scoreTableData" :key="index">
            <td :colspan="isShowBySetting('showSubjectsScore')?28:35">{{item.name}}</td>
            <td :colspan="isShowBySetting('showSubjectsScore')?12:25">{{item.sumScore | scoreFilter}}</td>
            <td colspan="12" v-if="isShowBySetting('showSubjectsScore')">{{item.ywScore | scoreFilter}}</td>
            <td colspan="12" v-if="isShowBySetting('showSubjectsScore')">{{item.sxScore | scoreFilter}}</td>
            <!-- <td colspan="12" v-if="isShowBySetting('showSubjectsScore')">{{item.yysjScore | scoreFilter}}</td> -->
            <td colspan="12" v-if="isShowBySetting('showSubjectsScore')">{{item.yyScore | scoreFilter}}</td>
            <td colspan="12" v-if="isShowBySetting('showSubjectsScore')">{{item.wlScore | scoreFilter}}</td>
            <td colspan="12" v-if="isShowBySetting('showSubjectsScore')">{{item.hxScore | scoreFilter}}</td>
            <td colspan="12" v-if="isShowBySetting('showSubjectsScore')">{{item.lsScore | scoreFilter}}</td>
            <td colspan="12" v-if="isShowBySetting('showSubjectsScore')">{{item.zzScore | scoreFilter}}</td>
            <td :colspan="isShowBySetting('showSubjectsScore')?12:25">{{item.classRank | scoreFilter}}</td>
            <td :colspan="isShowBySetting('showSubjectsScore')?12:25">{{item.gradeRank | scoreFilter}}</td>
            <td :colspan="isShowBySetting('showSubjectsScore')?12:25">{{item.areaRank | scoreFilter}}</td>
            <td :colspan="isShowBySetting('showSubjectsScore')?23:25">{{item.isJointExam === 2 ? '是' : '否'}}</td>
            <td :colspan="isShowBySetting('showSubjectsScore')?12:25">{{item.jointRank | scoreFilter}}</td>
            <td :colspan="isShowBySetting('showSubjectsScore')?15:25">
               <div v-if="item.scorePics&&item.scorePics.length"  style="color:#409EFF">
                     <image-previewer  :images="getViewPic(item.scorePics)" tag="img" text="查看图片"></image-previewer>
              </div>
              <span v-else>/</span>
                                                 
            </td>
          </tr>
          <tr>
            <td class="table-title" colspan="28">市三好学生次数</td>
            <td colspan="42">{{studentData.sshCount}}</td>
            <td class="table-title" colspan="28">区三好学生次数</td>
            <td colspan="42">{{studentData.qshCount}}</td>
            <td class="table-title" colspan="28">校三好学生次数</td>
            <td colspan="42">{{studentData.xshCount}}</td>
          </tr>
          <tr>
            <td class="table-title" colspan="28">市优秀学生干部次数</td>
            <td colspan="42">{{studentData.syxxsgbCount}}</td>
            <td class="table-title" colspan="28">区优秀学生干部次数</td>
            <td colspan="42">{{studentData.qyxxsgbCount}}</td>
            <td class="table-title" colspan="28">校优秀学生干部次数</td>
            <td colspan="42">{{studentData.xyxxsgbCount}}</td>
          </tr>
          <tr>
            <td class="table-title" colspan="28">其他获奖</td>
            <td colspan="77">{{studentData.otherAwardInfo}}</td>
             <td class="table-title" colspan="28">获奖证书</td>
            <td colspan="77">
              <div v-if="studentData.honorAwardPicJson.length" style="color:#409EFF">
                     <image-previewer  :images="getViewPic(studentData.honorAwardPicJson)" tag="img" text="查看图片"></image-previewer>
              </div>
            </td>
          </tr>
          <tr>
            <td class="table-title" colspan="210">
              <div v-if="keywordConfig.remark">
                {{keywordConfig.remark}}
              </div>
              <template v-else>
                <div>学科特长生—请对应所报特长生学科，仅填写学科获市二等奖及以上奖项的名称及次数</div>
                <div>科技特长生—请对应招生简章，按要求填写相关获奖信息</div>
              </template>
            </td>
          </tr>
          <tr>
            <td class="table-title" colspan="70">获奖名称</td>
            <td class="table-title" colspan="70">级别</td>
            <!-- <td class="table-title" colspan="70">次数</td> -->
            <td class="table-title" colspan="70">图片</td>
          </tr>
          <tr v-for="item in studentData.subjectAwardJson" :key="item.id">
            <td colspan="70">{{item.awardName}}</td>
            <td colspan="70">{{item.levelName}}</td>
            <!-- <td colspan="70">{{item.awardNum}}</td> -->
            <td colspan="70" style="color:#409EFF"><image-previewer v-if="item.awardPics&&item.awardPics.length" :images="getViewPic(item.awardPics)" tag="img"
                                                 text="查看图片"></image-previewer></td>
          </tr>
        </table>
        <div class="sign_box">
          <span class="sign_label">考生：</span>
          <span class="sign_content"></span>
          <span class="sign_label">家长：</span>
          <span class="sign_content"></span>
          <span class="sign_label">日期：</span>
          <span class="sign_content"></span>
        </div>
      </div>
    </div>
  </div>  
</template>

<script>
import {
    getEnrollStuInfoByIdNoToken,
    getDicDetailInfoByCode,newgetEnrollStuFieldBySchoolId,enrollStudentInfofun
} from '@/api/schoolSignupHigh';
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
import aesEncryptor from '@/utils/aesEncryptor'
export default {
  name: 'signupStuTalentTable',
  props: {
    hideReturn: {
      type: Boolean,
      default: false
    }
  },
  components: {ImagePreviewer},
  data() {
    return {
      id: this.$route.query.id,
      schoolId: this.$route.query.schoolId,
      studentData: {},
      keywordConfig: {
        name: '学科、科技特长生',
        remark: ''
      },
      settingData:[],
      enKey:this.$route.query.enKey
    }
  },
  filters: {
    scoreFilter(val) {
      console.log(val);
      return val === '' || val === undefined ? '/' : val
    }
  },
  computed: {     
    scoreTableData() {
      const tableData = []
       tableData.push({
        name: '0模成绩',
        ...this.studentData.zeroTestGradeJson
      })   
      tableData.push({
        name: '区一模成绩',
        ...this.studentData.firstTestGradeJson
      })      
      tableData.push({
        name: '初三上期末成绩',
        ...this.studentData.thirdUppFinalExamGradeJson
      })
      tableData.push({
        name: '初三上期中成绩',
        ...this.studentData.thirdUppMidTermGradeJson
      })
      if (this.isShowBySetting('secLowFinalExamGrade')) {
                    tableData.push({
                        name: '初二下期末成绩',
                        ...this.studentData.secLowFinalExamGradeJson
                    })
      }
      return tableData
    }
  },
  created() {
    if(this.$route.query.key){
        enrollStudentInfofun(this.$route.query.key)
                .then(res => res.data)
                .then(data => {
                  if(!data.result){
                     this.message.error(data.msg);
                  }else{
                     this.schoolId=data.data.schoolId
                     this.id=data.data.id
                     this.enKey=data.data.enKey
                     newgetEnrollStuFieldBySchoolId(this.schoolId)
                .then(res => res.data)
                .then(data => {
                    this.settingData = data.data;
                });
    this.getKeyWord()
    getEnrollStuInfoByIdNoToken({
      enKey: this.enKey
    })
      .then(res => res.data)
      .then(data => {
          const pageData = data.data;
          const picKeyList = [
            'ssqjjsPicList',
          ];
          picKeyList.forEach(key => {
              if (pageData[key] && pageData[key].length !== 0) {
                  pageData[key].forEach(item => {
                      item.src = item.picUrl;
                  });
              }
          });
          if (pageData.growFootScores) {
              pageData.growFootScores = JSON.parse(pageData.growFootScores);
          }
          if (pageData.growFootTwoScores) {
              pageData.growFootTwoScores = JSON.parse(pageData.growFootTwoScores);
          }
          pageData.midTestPicJson = JSON.parse(pageData.midTestPicJson || '[]')
          pageData.thirdUppMidTermGradeJson = JSON.parse(pageData.thirdUppMidTermGradeJson || '{}')
          pageData.thirdUppFinalExamGradeJson = JSON.parse(pageData.thirdUppFinalExamGradeJson || '{}')
          pageData.thirdLowMidTermGradeJson = JSON.parse(pageData.thirdLowMidTermGradeJson || '{}')
          pageData.thirdLowFinalExamGradeJson = JSON.parse(pageData.thirdLowFinalExamGradeJson || '{}')
          pageData.firstTestGradeJson = JSON.parse(pageData.firstTestGradeJson || '{}')
          pageData.zeroTestGradeJson = JSON.parse(pageData.zeroTestGradeJson || '{}')
          pageData.secTestGradeJson = JSON.parse(pageData.secTestGradeJson || '{}')
          pageData.subjectAwardJson = JSON.parse(pageData.subjectAwardJson || '[]')
          pageData.honorAwardPicJson = JSON.parse(pageData.honorAwardPicJson || '[]')
          pageData.secLowFinalExamGradeJson = JSON.parse(pageData.secLowFinalExamGradeJson || '[]')
           pageData.idCard=aesEncryptor.decrypt(pageData.idCard)
                                    pageData.loginPhone=aesEncryptor.decrypt(pageData.loginPhone)
                                    pageData.loginPhone2=aesEncryptor.decrypt(pageData.loginPhone2)
                                    pageData.loginPhone3=aesEncryptor.decrypt(pageData.loginPhone3)
          this.studentData = pageData;
      })
                  }
                 
                   
        });

    }else{

       newgetEnrollStuFieldBySchoolId(this.schoolId)
                .then(res => res.data)
                .then(data => {
                    this.settingData = data.data;
                });
    this.getKeyWord()
    getEnrollStuInfoByIdNoToken({
      enKey: this.enKey
    })
      .then(res => res.data)
      .then(data => {
          const pageData = data.data;
          const picKeyList = [
            'ssqjjsPicList',
          ];
          picKeyList.forEach(key => {
              if (pageData[key] && pageData[key].length !== 0) {
                  pageData[key].forEach(item => {
                      item.src = item.picUrl;
                  });
              }
          });
          if (pageData.growFootScores) {
              pageData.growFootScores = JSON.parse(pageData.growFootScores);
          }
          if (pageData.growFootTwoScores) {
              pageData.growFootTwoScores = JSON.parse(pageData.growFootTwoScores);
          }
          pageData.midTestPicJson = JSON.parse(pageData.midTestPicJson || '[]')
          pageData.thirdUppMidTermGradeJson = JSON.parse(pageData.thirdUppMidTermGradeJson || '{}')
          pageData.thirdUppFinalExamGradeJson = JSON.parse(pageData.thirdUppFinalExamGradeJson || '{}')
          pageData.thirdLowMidTermGradeJson = JSON.parse(pageData.thirdLowMidTermGradeJson || '{}')
          pageData.thirdLowFinalExamGradeJson = JSON.parse(pageData.thirdLowFinalExamGradeJson || '{}')
          pageData.firstTestGradeJson = JSON.parse(pageData.firstTestGradeJson || '{}')
          pageData.zeroTestGradeJson = JSON.parse(pageData.zeroTestGradeJson || '{}')
          pageData.secTestGradeJson = JSON.parse(pageData.secTestGradeJson || '{}')
          pageData.subjectAwardJson = JSON.parse(pageData.subjectAwardJson || '[]')
          pageData.honorAwardPicJson = JSON.parse(pageData.honorAwardPicJson || '[]')
          pageData.secLowFinalExamGradeJson = JSON.parse(pageData.secLowFinalExamGradeJson || '[]')
           pageData.idCard=aesEncryptor.decrypt(pageData.idCard)
                                    pageData.loginPhone=aesEncryptor.decrypt(pageData.loginPhone)
                                    pageData.loginPhone2=aesEncryptor.decrypt(pageData.loginPhone2)
                                    pageData.loginPhone3=aesEncryptor.decrypt(pageData.loginPhone3)
          this.studentData = pageData;
      })

    }
   
  },
  methods: {
      isShowBySetting(fieldName) {
                return this.settingData.findIndex(item => item.fieldName === fieldName && item.fieldValue == 1) !== -1;
            },
     getViewPic(picList) {
                if (picList) {
                    return picList.map((item) => {
                        return {'src': item.picUrl}
                    });
                }
                return [];
            },
    async getKeyWord() {
        try {
            const { data } = await getDicDetailInfoByCode({
                code: 'subjectStudentDec',
                schoolId: this.schoolId
            });
            if (data.data) {
                this.keywordConfig.name = data.data.name || this.keywordConfig.name
                this.keywordConfig.remark = data.data.remark
            }
            console.log(data);
        } catch (err) {
            console.log(err)
        }
    },
    print() {
      this.$print(this.$refs.print)
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../../styles/mixin";
@include globalstyle;

.print-header {
  font-size: 18px;
  text-align: center;
  position: relative;
  .print-header__recruit-no {
      position: absolute;
      left: 0;
  }
  .print-header__status {
      position: absolute;
      right: 0;
  }
}
.talent-table {
  font-size: 14px;
  width: 1000px;
  margin: 20px auto;
  border-collapse: collapse;
  table-layout: fixed;
  td {
    // white-space: nowrap;
    padding: 10px 7px;
  }
  .table-title {
    text-align: center;
    background-color: #eee;
  }
}
.content{
  width: 1000px;
  margin: 0 auto;
}
.sign_box {
  text-align: right;
  width: 1000px;
  margin: 50px auto 100px;
  padding-right: 50px;
  .sign_label {
    margin-left: 10px;
  }
  .sign_content {
    display: inline-block;
    width: 100px;
    border-bottom: 1px solid gray;
  }
}
</style>
