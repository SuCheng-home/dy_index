<template>
  <div class="flow_info_list_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="printHandler">打印</el-button>
      <el-button size="medium" v-if="flowInfoList.length" type="primary" @click="exportExcel('#outTable', `${schoolName}流动人口防疫登记信息表.xlsx`)">导出</el-button>
    </div>

    <div class="flow_info_list_box">
      <el-table stripe :data="flowInfoList" border style="width: 100%;" :height="maxH" id="outTable" ref="print">
        <el-table-column align="center">
          <template slot="header">
            <div style="padding: 10px;font-size: 24px;">{{schoolName}}流动人口防疫登记信息表</div>
          </template>
          <el-table-column align="center">
            <template slot="header">
              <span>填表单位：{{schoolName}}</span>
              <span>填表日期：{{createDate}}</span>
            </template>
            <el-table-column align="center" label="姓名" prop="userName"></el-table-column>
            <el-table-column align="center" label="性别">
              <template slot-scope="scope">
                <span v-if="scope.row.gender === 1">男</span>
                <span v-else-if="scope.row.gender === 2">女</span>
                <span v-else>-</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="身份证号" prop="idCard" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="户籍地址" prop="hujidizhi" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.hujidizhiNameS}} {{scope.row.hujidizhiNameC}} {{scope.row.hujidizhiNameQ}} {{scope.row.hujidizhi}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="联系方式" prop="mobile" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="家长有无暂住证">有</el-table-column>
            <el-table-column align="center" label="是否离宁">
              <template slot-scope="scope">
                <span>{{scope.row.goNameJing === 2 ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="`是否在${areaName}`">
              <template slot-scope="scope">
                <span v-if="scope.row.goNameJing === 1 || (scope.row.goNameJing === 2 && isBackNanJing(scope.row.comeDate))">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column align="center" :label="`是否计划回${areaName}`">
              <template slot-scope="scope">
                <span v-if="scope.row.goNameJing === 1 || (scope.row.goNameJing === 2 && isBackNanJing(scope.row.comeDate))"></span>
                <span v-else>是</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="来宁前所在地" show-overflow-tooltip>
              <template slot-scope="scope">
                <span>{{scope.row.destinationNameS}} {{scope.row.destinationNameC}} {{scope.row.destinationNameQ}} {{scope.row.destination}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="来宁时间" prop="comeDate"></el-table-column>
            <el-table-column align="center" label="目前症状" prop="userName" show-overflow-tooltip>
              <template slot-scope="scope">
                <span v-if="scope.row.sickFever === 2 && scope.row.animalHeat === 2">低烧（37.3—38度）</span>
                <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 3">中度发烧（38.1—39度）</span>
                <span v-else-if="scope.row.sickFever === 2 && scope.row.animalHeat === 4">高烧（39.1—42度）</span>
                <span v-else-if="scope.row.sickFuxie === 1 && scope.row.sickFuxie === 1">正常</span>
                <span v-if="scope.row.sickFuxie === 2">&nbsp;腹泻</span>
                <span v-if="scope.row.sickKeshu === 2">&nbsp;咳嗽</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="就诊情况">
              <template slot-scope="scope">
                <span>{{scope.row.toHos === 2 ? '是' : '否'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否上门">否</el-table-column>
            <el-table-column align="center" label="是否见到此人">否</el-table-column>
            <el-table-column align="center" label="是否去过湖北/温州">
              <template slot-scope="scope">
                <span v-if="scope.row.goWuHan === 2 && isGoHuBei(scope.row.addressList)">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="是否超过14天">
              <template slot-scope="scope">
                <span v-if="(scope.row.goWuHan === 2 && (getDays(scope.row.comeDate, scope.row.createDate) >= 14)) || (scope.row.comeToWuHan === 2 && (getDays(scope.row.comeToDate, scope.row.createDate) >= 14))">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column label="是否超过7天">
              <template slot-scope="scope">
                <span v-if="(scope.row.goWuHan === 2 && (getDays(scope.row.comeDate, scope.row.createDate) >= 7)) || (scope.row.comeToWuHan === 2 && (getDays(scope.row.comeToDate, scope.row.createDate) >= 7))">是</span>
                <span v-else>否</span>
              </template>
            </el-table-column>
            <el-table-column align="center" label="是否追访不到"></el-table-column>
            <el-table-column align="center" label="追访不到的原因"></el-table-column>
          </el-table-column>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import baseMixin from '@/mixins/baseMixin';
  import moment from "moment";
  import {getDiseaseSchoolReportList} from "@/api/schoolManage/diseaseReport";

  export default {
    name: "diseaseReportSchoolFlowInfoList",
    data() {
      return {
        flowInfoList: [],
        schoolName: '',
        areaName: '',
        createDate: '',
        nowDate: ''
      }
    },
    mixins: [mixins, baseMixin],
    created() {
      this.schoolName = this.$store.getters.schoolInfo.name;
      this.areaName = this.$route.query.areaName;
      this.createDate = this.$route.query.reportDate;
      this.nowDate = moment().format("YYYY-MM-DD");
      this.getDiseaseSchoolReportList();
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getDiseaseSchoolReportList() {
        getDiseaseSchoolReportList(this.createDate).then(res => {
          if (res.data.code === 200) {
            this.flowInfoList = res.data.data
          }
        }).catch()
      },
      isBackNanJing(date){
        if (date && (date <= this.nowDate)) {
          return true;
        }
        return false;
      },
      isGoHuBei(list){
        if (!!list.length) {
          let codeList = list.map(item => item.codeType);
          if (codeList.indexOf(10001) > -1 || codeList.indexOf(10002) > -1) {
            return true;
          } else {
            return false;
          }
        }
        return false;
      },
      getDays(date1 , date2){
        if (date1 && date2 && (date1 > date2)) {
          return -1;
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
          return days;
        }
        return -1;
      },
      printHandler(){
        this.$print(this.$refs.print);
      }
    }
  }
</script>

<style lang="scss" scoped>
  .flow_info_list_wrap {
    .header {
      padding: 12px 12px 10px 12px;
      border-bottom: 1px solid #eee;
    }

    .flow_info_list_box {
      padding:12px;
    }
  }
</style>
