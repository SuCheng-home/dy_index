<template>
  <div class="supply_class_wrap">
    <div class="header">
      <el-row>
        <el-col :span="20">
          <el-button @click="goBack" size="medium">返回</el-button>
          <template>
            <el-select size="medium" v-model="schoolName" placeholder="请选择学期" @change="changeSchool" style="width: 195px;">
              <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                         :value="item.schoolTimeName">
              </el-option>
            </el-select>
          </template>
          <el-select v-model="gradeId" size="medium" placeholder="请选择年级" @change="changeGrade" style="width: 130px;">
            <el-option key="0" label="全部年级" :value="0"></el-option>
            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="classId" size="medium" placeholder="请选择班级" @change="changeClass" style="width: 130px;">
            <el-option key="0" label="全部班级" :value="0"></el-option>
            <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
          <el-select v-model="typeSelect" size="medium" placeholder="请选择类型" @change="changeType" style="width: 140px;">
            <el-option key="0" label="全部一级类型" value=""></el-option>
            <el-option v-for="item in typeList" :key="item.code" :label="item.name" :value="item.code">
            </el-option>
          </el-select>
          <el-select v-model="typeTwoSelect" size="medium" placeholder="请选择类型" @change="changeTwoType" style="width: 140px;">
            <el-option key="0" label="全部二级类型" value=""></el-option>
            <el-option v-for="item in typeTwoList" :key="item.code" :label="item.value" :value="item.code"></el-option>
          </el-select>
          <a :href="exportUrl" download="导出" target="_blank"  v-if="recordList.length">
            <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
        </el-col>
        <el-col :span="4">
          <el-input @keyup.enter.native="getStatistics" size="medium" class="filter-item" placeholder="申请人姓名" v-model.trim="searchName" maxlength="20">
            <el-button slot="append" icon="el-icon-search" @click="getStatistics"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="offset_table_wrap">
      <el-table stripe :data="recordList" border style="width: 100%;" :height="maxH - 1">
        <el-table-column prop="stuName" label="申请人" align="center"></el-table-column>
        <el-table-column prop="className" label="所在班级" align="center"></el-table-column>
        <el-table-column label="主题" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span style="color: #409eff;cursor:pointer;" @click="toGrowUpInfo(scope.row.id)">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column label="时间" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.openDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.pTypeName}}（{{scope.row.typeName}}）</span>
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{scope.row.content}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 15px;">
        <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                       :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                       :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getSchoolDicDetailsByTypeCode, findSchoolDicsByCode, getSchoolGradeClass} from '@/api/common/common';
  import {getSchoolTimeList} from '@/api/record';
  import {queryGrowthConference} from '@/api/childrenGrowUp';

  export default {
    name: "childrenGrowUpInfoList",
    data() {
      return {
        schoolTimeCode: this.$route.query.schoolTimeCode,
        schoolName: this.$route.query.schoolTimeName,
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: null
        },
        schoolYearList: [],
        typeSelect: '',
        typeList: [],
        typeTwoSelect: '',
        typeTwoList: [],
        gradeId: 0,
        gradeList: [],
        classId: 0,
        classList: [],
        searchName: '',
        recordList: [],
        exportUrl:''
      }
    },
    mixins: [mixins],
    created() {
      this.getSchoolTimeList();
      this.getSchoolGradeClass();
      this.getSchoolDicDetailsByTypeCode();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      toGrowUpInfo(growUpId) {
        this.$router.push({path: 'info', query: {growUpId: growUpId}});
      },
      changeSchool(val) {
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
        this.gradeId = 0;
        this.classId = 0;
        this.typeSelect = '';
        this.typeTwoSelect = '';
        this.searchName = '';
        this.getStatistics();
      },
      changeType() {
        this.typeTwoSelect = '';
        this.typeTwoList = [];
        if (this.typeSelect) {
          this.findSchoolDicsByCode();
        }
        this.getStatistics();
      },
      changeTwoType() {
        this.getStatistics();
      },
      changeGrade() {
        this.classId = 0;
        this.classList = [];
        if (this.gradeId) {
          this.classList = this.gradeList[this.gradeList.map(item => item.id).indexOf(this.gradeId)].classList || [];
        }
        this.getStatistics();
      },
      changeClass() {
        this.getStatistics();
      },
      getSchoolTimeList() {
        getSchoolTimeList().then(res => {
          this.schoolYearList = res.data.data;
        }).catch();
      },
      // 获取年级班级列表
      getSchoolGradeClass() {
        getSchoolGradeClass().then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.gradeList = data;
          }
        }).catch(() => {
        });
      },
      getSchoolDicDetailsByTypeCode() {
        getSchoolDicDetailsByTypeCode({
          typeCode: 'growthConferenceType'
        }).then(res => {
          if (res.data.code === 200 && res.data.data.length) {
            this.typeList = res.data.data;
            this.getStatistics();
          }
        }).catch();
      },
      findSchoolDicsByCode() {
        findSchoolDicsByCode({
          dicCode: this.typeSelect
        }).then((res) => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.typeTwoList = data;
          }
        })
      },
      getStatistics() {
        if (!this.schoolTimeCode) {
          return;
        }
        let query = {
          classId: this.classId,
          gradeId: this.gradeId,
          pTypeCode: this.typeSelect,
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          schoolTimeId: this.schoolTimeCode,
          searchName: this.searchName,
          typeCode: this.typeTwoSelect
        };

        this.exportUrl = `${global.BasePath}structure/growthConference/downGrowthConference?token=${this.$store.getters.token}&classId=${this.classId}&gradeId=${this.gradeId}&schoolTimeId=${this.schoolTimeCode}&pTypeCode=${this.typeSelect}&typeCode=${this.typeTwoSelect}&searchName=${this.searchName}`;

        this.queryGrowthConference(query);
      },
      queryGrowthConference(query) {
        queryGrowthConference(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
            this.recordList = data.data.dataList;
            this.pagination.total = data.data.pagination.total;
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
