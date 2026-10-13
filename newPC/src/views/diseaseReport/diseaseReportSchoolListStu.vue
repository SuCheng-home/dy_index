<template>
  <div class="report_school_receipt_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-date-picker v-model.trim="reportDate" type="date" :clearable="false" size="medium"
                      placeholder="请选择日期" @change="changeReportDate"></el-date-picker>
      <el-select v-model="selectGrade" placeholder="请选择年级" size="medium" style="margin-right: 10px;">
        <el-option v-for="item in gradeList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-select v-model="selectClass" placeholder="请选择班级" size="medium" style="margin-right: 10px;" @change="changeClass">
        <el-option v-for="item in classList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary" size="medium"
                 @click="exportExcel('#outTable', `${dateStr(reportDate)}学生明细.xlsx`)">导出</el-button>
      <el-button type="primary" size="medium"
                 @click="exportExcel('#outTableAll', `${dateStr(reportDate)}全部学生明细.xlsx`)">导出全部</el-button>
    </div>

    <div class="school_receipt_box">
      <el-table stripe :data="reportReceiptList" border style="width: 100%;" :height="nobottommaxH" id="outTable">
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="班级" prop="className"></el-table-column>
<!--        <el-table-column label="联系方式" prop="mobile"></el-table-column>-->
        <el-table-column label="体温" align="center">
          <template slot-scope="scope">
            <span v-if="!!scope.row.animal" :style="`${scope.row.animal >= 37.3 ? 'color: red;' : ''}`">{{scope.row.animal}}℃</span>
            <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 2" style="color: red;">低烧（37.3—38度）</span>
            <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 3" style="color: red;">中度发烧（38.1—39度）</span>
            <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 4" style="color: red;">高烧（39.1—42度）</span>
            <span v-else>正常（36.5——37.2度）</span>
          </template>
        </el-table-column>
        <el-table-column label="师生本人" align="center">
          <el-table-column label="14天内风险区接触史" align="center">
            <el-table-column label="接触情况">
              <template slot-scope="scope">
                <span v-if="scope.row.jiechuwuhan === 2">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人员（与师生关系）">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanRelat || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触日期">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanDate || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触地点">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanAddress || '--'}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="14天内境外接触史" align="center">
            <el-table-column label="接触情况">
              <template slot-scope="scope">
                <span v-if="scope.row.jiechujingwai === 2">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人员（与师生关系）">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiRelat || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触日期">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiDate || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触地点">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiAddress || '--'}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="健康情况">
            <template slot-scope="scope">
              <span v-if="scope.row.fever === 2">有发热、咳嗽、干咳、腹泻等症状</span>
              <span v-else>健康</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="同住人" align="center">
          <el-table-column label="14天内风险区接触史" align="center">
            <el-table-column label="接触情况">
              <template slot-scope="scope">
                <span v-if="scope.row.jiechuwuhanP === 2">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人员（与师生关系）">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanRelatP || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触日期">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanDateP || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触地点">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanAddressP || '--'}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="14天内境外接触史" align="center">
            <el-table-column label="接触情况">
              <template slot-scope="scope">
                <span v-if="scope.row.jiechujingwaiP === 2">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人员（与师生关系）">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiRelatP || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触日期">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiDateP || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触地点">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiAddressP || '--'}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="健康情况">
            <template slot-scope="scope">
              <span v-if="scope.row.feverP === 2">有发热、咳嗽、干咳、腹泻等症状</span>
              <span v-else>健康</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="14天内（含今日）离开本市">
          <template slot-scope="scope">
            <span>{{scope.row.goNameJing === 2 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="目的地" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.goNameJing === 2 && scope.row.destinationNameS === '海外'">{{scope.row.destination}}</span>
            <span v-else-if="scope.row.goNameJing === 2">{{scope.row.destinationNameS}} {{scope.row.destinationNameC}} {{scope.row.destinationNameQ}} {{scope.row.destination}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="返回时间">
          <template slot-scope="scope">
            <span>{{(scope.row.comeDateType !== 2 && scope.row.comeDate && scope.row.goNameJing === 2) ? scope.row.comeDate : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="具体行程" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.trafficTool}}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前所在地址" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.liveNameS === '海外'">{{scope.row.live}}</span>
            <span v-else>{{scope.row.liveNameS}} {{scope.row.liveNameC}} {{scope.row.liveNameQ}} {{scope.row.live}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="all_list_box" style="display: none;">
      <el-table stripe :data="reportReceiptListAll" border style="width: 100%;" id="outTableAll">
        <el-table-column label="姓名" prop="userName"></el-table-column>
        <el-table-column label="班级" prop="className"></el-table-column>
<!--        <el-table-column label="联系方式" prop="mobile"></el-table-column>-->
        <el-table-column label="体温" align="center">
          <template slot-scope="scope">
            <span v-if="!!scope.row.animal" :style="`${scope.row.animal >= 37.3 ? 'color: red;' : ''}`">{{scope.row.animal}}℃</span>
            <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 2" style="color: red;">低烧（37.3—38度）</span>
            <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 3" style="color: red;">中度发烧（38.1—39度）</span>
            <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 4" style="color: red;">高烧（39.1—42度）</span>
            <span v-else>正常（36.5——37.2度）</span>
          </template>
        </el-table-column>
        <el-table-column label="师生本人" align="center">
          <el-table-column label="14天内风险区接触史" align="center">
            <el-table-column label="接触情况">
              <template slot-scope="scope">
                <span v-if="scope.row.jiechuwuhan === 2">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人员（与师生关系）">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanRelat || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触日期">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanDate || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触地点">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanAddress || '--'}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="14天内境外接触史" align="center">
            <el-table-column label="接触情况">
              <template slot-scope="scope">
                <span v-if="scope.row.jiechujingwai === 2">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人员（与师生关系）">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiRelat || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触日期">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiDate || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触地点">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiAddress || '--'}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="健康情况">
            <template slot-scope="scope">
              <span v-if="scope.row.fever === 2">有发热、咳嗽、干咳、腹泻等症状</span>
              <span v-else>健康</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="同住人" align="center">
          <el-table-column label="14天内风险区接触史" align="center">
            <el-table-column label="接触情况">
              <template slot-scope="scope">
                <span v-if="scope.row.jiechuwuhanP === 2">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人员（与师生关系）">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanRelatP || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触日期">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanDateP || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触地点">
              <template slot-scope="scope">
                <span>{{scope.row.jiechuwuhanAddressP || '--'}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="14天内境外接触史" align="center">
            <el-table-column label="接触情况">
              <template slot-scope="scope">
                <span v-if="scope.row.jiechujingwaiP === 2">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="接触人员（与师生关系）">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiRelatP || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触日期">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiDateP || '--'}}</span>
              </template>
            </el-table-column>
            <el-table-column label="接触地点">
              <template slot-scope="scope">
                <span>{{scope.row.jiechujingwaiAddressP || '--'}}</span>
              </template>
            </el-table-column>
          </el-table-column>
          <el-table-column label="健康情况">
            <template slot-scope="scope">
              <span v-if="scope.row.feverP === 2">有发热、咳嗽、干咳、腹泻等症状</span>
              <span v-else>健康</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="14天内（含今日）离开本市">
          <template slot-scope="scope">
            <span>{{scope.row.goNameJing === 2 ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="目的地" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.goNameJing === 2 && scope.row.destinationNameS === '海外'">{{scope.row.destination}}</span>
            <span v-else-if="scope.row.goNameJing === 2">{{scope.row.destinationNameS}} {{scope.row.destinationNameC}} {{scope.row.destinationNameQ}} {{scope.row.destination}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column label="返回时间">
          <template slot-scope="scope">
            <span>{{(scope.row.comeDateType !== 2 && scope.row.comeDate && scope.row.goNameJing === 2) ? scope.row.comeDate : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="具体行程" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.trafficTool}}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前所在地址" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.liveNameS === '海外'">{{scope.row.live}}</span>
            <span v-else>{{scope.row.liveNameS}} {{scope.row.liveNameC}} {{scope.row.liveNameQ}} {{scope.row.live}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import moment from "moment";
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import {getDiseaseReportClassStuDetail, getSchoolGradeClass} from "@/api/schoolManage/diseaseReport";

  export default {
    name: "diseaseReportSchoolListStu",
    data() {
      return {
        reportDate: '',
        reportReceiptList: [],
        reportReceiptListAll: [],
        gradeList: [],
        selectGrade: null,
        classList: [],
        selectClass: null,
        gradeIds: []
      }
    },
    mixins: [mixins, baseMixin],
    filters: {
      formatTimeMap(type) {
        if (type) {
          return type.substring(0,19);
        }
        return '-';
      }
    },
    watch: {
      selectGrade(gradeVal) {
        if (!!gradeVal) {
          let gradeIndex = this.gradeIds.indexOf(gradeVal);
          this.classList = JSON.parse(JSON.stringify(this.gradeList[gradeIndex])).childrenList;
          this.selectClass = this.classList[0].value;
        } else {
          this.classList = [];
          this.selectClass = 0;
        }
        this.getDiseaseReportClassStuDetail()
      }
    },
    created() {
      this.reportDate = this.$route.query.reportDate;
      this.getSchoolGradeClass();
      this.getDiseaseReportClassStuDetailAll();
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      changeReportDate() {
        this.getDiseaseReportClassStuDetail();
        this.getDiseaseReportClassStuDetailAll()
      },
      changeClass() {
        this.getDiseaseReportClassStuDetail()
      },
      getDiseaseReportClassStuDetail() {
        if (!this.selectGrade || !this.selectClass) {
          return;
        }
        getDiseaseReportClassStuDetail({
          createDate: this.dateStr(this.reportDate),
          gradeId: this.selectGrade,
          classId: this.selectClass
        }).then(res => {
          if (res.data.code === 200) {
            this.reportReceiptList = res.data.data
          }
        }).catch()
      },
      getDiseaseReportClassStuDetailAll() {
        getDiseaseReportClassStuDetail({
          createDate: this.dateStr(this.reportDate),
          gradeId: 0,
          classId: 0
        }).then(res => {
          if (res.data.code === 200) {
            this.reportReceiptListAll = res.data.data
          }
        }).catch()
      },
      getSchoolGradeClass() {
        getSchoolGradeClass().then((res) => {
          const data= res.data.data;
          if (res.data.code === 200) {
            this.gradeIds = [];
            data.forEach((item) => {
              let newArray = [];
              item.classList.forEach((item) =>{
                newArray.push({
                  label: item.name,
                  value: item.id,
                });
              });
              this.gradeList.push({
                label: item.name,
                value: item.id,
                childrenList: newArray
              });
              this.gradeIds.push(item.id);
            });
            this.selectGrade = data[0].id;
          }
        }).catch(() => {});
      },
      dateStr(val) {
        return moment(val).format("YYYY-MM-DD")
      },
      getDays(date1 , date2){
        if (date1 && date2 && (date1 > date2)) {
          return '未返回';
        } else if (date1 && date2) {
          var date1Str = date1.split("-");//将日期字符串分隔为数组,数组元素分别为年.月.日
          //根据年 . 月 . 日的值创建Date对象
          var date1Obj = new Date(date1Str[0],(date1Str[1]-1),date1Str[2]);
          var date2Str = date2.split("-");
          var date2Obj = new Date(date2Str[0],(date2Str[1]-1),date2Str[2]);
          var t1 = date1Obj.getTime();
          var t2 = date2Obj.getTime();
          var dateTime = 1000*60*60*24; //每一天的毫秒数
          var minusDays = Math.floor(((t2-t1)/dateTime));//计算出两个日期的天数差
          var days = Math.abs(minusDays);//取绝对值
          return days + '天';
        }
        return '--'
      }
    }
  }
</script>

<style lang="scss" scoped>
  .report_school_receipt_wrap {
     padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
  }
</style>
