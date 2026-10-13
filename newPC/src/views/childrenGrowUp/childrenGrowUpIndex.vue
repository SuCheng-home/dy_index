<template>
  <div class="supply_class_wrap">
    <div class="header">
      <template>
        <el-select size="medium" v-model="schoolName" placeholder="请选择学期" @change="changeSchoolTime">
          <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                     :value="item.schoolTimeName">
          </el-option>
        </el-select>
      </template>
      <el-select v-model="typeSelect" size="medium" placeholder="请选择类型" @change="changeType">
        <el-option v-for="item in typeList" :key="item.code" :label="item.name" :value="item.code">
        </el-option>
      </el-select>
      <a :href="exportUrl" download="导出" target="_blank"  v-if="growUpList.length">
        <el-button type="primary" size="medium" icon="upload">导出</el-button>
      </a>
      <el-button type="primary" size="medium" @click.native="toInfoList">查看明细</el-button>
    </div>
    <div class="offset_table_wrap">
      <el-table stripe :data="growUpList" border style="width: 100%;" :height="boxH - 200">
        <el-table-column label="年级" align="center">
          <template slot-scope="scope">
            <div :style="`${scope.row[typeLevelList.length+1] ? 'text-align: left;' : ''}`">{{scope.row[0] || '--'}}</div>
          </template>
        </el-table-column>
        <el-table-column :label="item.value" align="center" :key="index" v-for="(item, index) in typeLevelList">
          <template slot-scope="scope">
            <span>{{scope.row[index + 1] || 0}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getSchoolDicDetailsByTypeCode} from '@/api/common/common';
  import {getSchoolTimeList} from '@/api/record';
  import {growthConferenceAnalysis} from '@/api/childrenGrowUp';

  export default {
    name: "childrenGrowUpIndex",
    data() {
      return {
        schoolName: '',
        schoolTimeCode: '',
        schoolYearList: [],
        typeSelect: null,
        typeList: [],
        growUpList: [],
        typeLevelList: [],
        exportUrl:''
      }
    },
    mixins: [mixins],
    created() {
      this.getSchoolTimeList();
      this.getSchoolDicDetailsByTypeCode();
    },
    methods: {
      toInfoList() {
        this.$router.push({path: 'infoList', query: {schoolTimeCode: this.schoolTimeCode, schoolTimeName: this.schoolName}});
      },
      changeSchoolTime(val) {
        const self = this;
        this.schoolName = val;
        self.date = [];
        this.schoolYearList.forEach(function (item) {
          if (item.schoolTimeName === val) {
            self.schoolTimeCode = item.id;
            self.date.push(item.startDate);
            self.date.push(item.endDate);
          }
        });
        this.getStatistics();
      },
      changeType() {
        this.getStatistics();
      },
      getSchoolTimeList() {
        getSchoolTimeList().then(res => {
          if (res.data.code === 200) {
            this.schoolYearList = res.data.data;
            const self = this;
            this.schoolYearList.forEach((item) => {
              if (item.isCurrent === 1) {
                self.schoolName = item.schoolTimeName;
                self.schoolTimeCode = item.id;
                this.getStatistics();
              }
            });
          }
        }).catch();
      },
      getSchoolDicDetailsByTypeCode() {
        getSchoolDicDetailsByTypeCode({
          typeCode: 'growthConferenceType'
        }).then(res => {
          if (res.data.code === 200 && res.data.data.length) {
            this.typeList = res.data.data;
            this.typeSelect = res.data.data[0].code;
            this.getStatistics();
          }
        }).catch();
      },
      getStatistics() {
        if (!this.schoolTimeCode) {
          return;
        }
        if (!this.typeSelect && this.typeSelect !== 0) {
          return;
        }

        this.exportUrl = `${global.BasePath}structure/growthConference/downGrowthConferenceAnalysis?token=${this.$store.getters.token}&pTypeCode=${this.typeSelect}&schoolTimeId=${this.schoolTimeCode}&schoolId=${this.$store.getters.schoolInfo.id}`;

        let query = {
          pTypeCode: this.typeSelect,
          schoolTimeId: this.schoolTimeCode,
          schoolId: this.$store.getters.schoolInfo.id
        };

        this.growthConferenceAnalysis(query);
      },
      growthConferenceAnalysis(query) {
        growthConferenceAnalysis(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            this.typeLevelList = data.data.valueList;
            this.typeLevelList.push({
              value: '总计'
            });
            let newList = [];
            data.data.gradeClassCountList.forEach((item) => {
              item.gradeCount.push(1);
              newList.push(item.gradeCount);
              newList = [...newList, ...item.classCountList];
            });
            this.growUpList = newList;
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch();
      },
      sizeChangeHandler() {
        this.getStatistics();
      },
      currentChangeHandler() {
        this.getStatistics();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .supply_class_wrap {
    padding:12px;

    .header {
      padding-bottom: 10px;

      .button_wrap {
        width: 60%;
        margin-left: 20%;
        overflow: hidden;

        span {
          width: 50%;
          line-height: 34px;
          float: left;
          text-align: center;
          background: #fff;
          border: 1px solid #bfcbd9;
          cursor: pointer;
        }

        .tab_left {
          border-radius: 4px 0 0 4px;
        }

        .tab_right {
          border-radius: 0 4px 4px 0;
        }

        .tab_color {
          color: #fff;
          background-color: #409eff;
          border-color: #409eff;
          -webkit-box-shadow: -1px 0 0 0 #409eff;
          box-shadow: -1px 0 0 0 #409eff;
        }
      }

      .header_line2 {
        margin-top: 10px;

       
      }
    }

    .offset_table_wrap {
      margin: 0 auto;
    }
  }
</style>
