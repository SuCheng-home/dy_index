<template>
  <div class="goods_manage_wrap">
    <div class="header">
      <el-col :span="19">
        <el-select v-model="listQuery.gradeId" placeholder="请选择年级" size="medium" @change="changeGrade">
          <el-option label="全部年级" :value="0"></el-option>
          <el-option v-for="(item, index) in gradeList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-select v-model="listQuery.classId" placeholder="请选择班级" size="medium" @change="getSchoolUserIntegralDataPageList">
          <el-option label="全部班级" :value="0"></el-option>
          <el-option v-for="(item, index) in classList" :key="index" :label="item.name" :value="item.id"></el-option>
        </el-select>
        <el-button type="primary" size="medium" @click="toClassPage">班级统计</el-button>
      </el-col>
      <el-col :span="5">
        <el-input placeholder="请输入姓名" size="medium" v-model.trim="listQuery.stuName" @change="getSchoolUserIntegralDataPageList">
          <el-button slot="append" icon="el-icon-search" @click="getSchoolUserIntegralDataPageList"></el-button>
        </el-input>
      </el-col>
    </div>
    <el-table stripe :data="dataList" :height="`${maxH - 1}`" border style="width: 100%">
      <el-table-column align="center" label="姓名" show-overflow-tooltip>
        <template slot-scope="scope">
          <span @click="toStuPointPage(scope.row.stuId, scope.row.classId)" style="color: #409eff;cursor:pointer;">{{scope.row.stuName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="班级/部门" prop="className" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="积分总数" prop="point" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="已兑换积分" prop="spendPoint" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" label="积分剩余" prop="surplusPoint" show-overflow-tooltip></el-table-column>
    </el-table>

    <el-pagination class="pagination-container" @size-change="handleSizeChange" @current-change="handleCurrentChange"
      :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]" :page-size="listQuery.pageSize"
      layout="total, sizes, prev, pager, next, jumper" :total="total">
    </el-pagination>
  </div>
</template>

<script>
  import windowResize from "@/mixins/windowResize";
  import {getSchoolGradeClass} from '@/api/common/common';
  import {getSchoolUserIntegralDataPageList} from '@/api/integralBank';

  export default {
    name: "pointQueryList",
    data() {
      return {
        gradeList: [],
        classList: [],
        dataList: [],
        listQuery: {
          classId: 0,
          gradeId: 0,
          pageNo: 1,
          pageSize: 20,
          stuName: '',
          userType: 2
        },
        total: null,
      }
    },
    filters: {
      timeFormat(time) {
        return time ? time.substring(0, 19) : "--";
      }
    },
    mixins: [windowResize],
    created() {
      this.getSchoolGradeClass();
    },
    methods: {
      toClassPage() {
        this.$router.push({path: 'pointClassList'});
      },
      toStuPointPage(stuId, classId) {
        this.$router.push({path: 'pointStuInfo', query: {stuId: stuId, classId: classId}});
      },
      changeGrade(val) {
        let gradeIndex = this.gradeList.map(item => item.id).indexOf(val);
        if (gradeIndex > -1) {
          this.classList = this.gradeList[gradeIndex].classList;
          this.listQuery.classId = 0;
        } else {
          this.classList = [];
          this.listQuery.classId = 0;
        }
        this.getSchoolUserIntegralDataPageList();
      },
      getSchoolGradeClass() {
        getSchoolGradeClass().then(res => res.data).then(data => {
          if (data.code === 200 && data.result && data.data) {
            this.gradeList = data.data;
            this.getSchoolUserIntegralDataPageList();
          }
        });
      },
      getSchoolUserIntegralDataPageList() {
        getSchoolUserIntegralDataPageList({
          classId: this.listQuery.classId || 0,
          gradeId: this.listQuery.gradeId || 0,
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          stuName: this.listQuery.stuName,
          userType: this.listQuery.userType
        }).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
          }
        });
      },
      //切换码数
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getSchoolUserIntegralDataPageList();
      },
      //切换页数
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getSchoolUserIntegralDataPageList();
      },
    }
  }
</script>

<style lang="scss" scoped>
  .goods_manage_wrap{
    padding: 12px;

    .header {
      padding-bottom: 10px;
      overflow: hidden;
    }
    .picimg{
      display: block;
      width: 28px;
      height: 21px;
      margin: 0 auto;
      cursor: pointer;
    }
  }
</style>
