<template>
  <div class="goods_manage_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-date-picker v-model.trim="pointDate" type="daterange" class="mywidthdaterange" :clearable="false" size="medium" placeholder="请选择日期" @change="changePointDate"></el-date-picker>
      <el-select v-model="gradeId" placeholder="请选择年级" size="medium" @change="changeGrade">
        <el-option label="全部年级" :value="0"></el-option>
        <el-option v-for="(item, index) in gradeList" :key="index" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <a :href="downLoadUrl" v-if="dataList && dataList.length" target="_blank" download="examName">
        <el-button type="primary" size="medium">导出</el-button>
      </a>
    </div>
    <el-table stripe :data="dataList" :height="`${boxH - 201}`" border style="width: 100%">
      <el-table-column align="center" label="班级/部门" prop="className" show-overflow-tooltip></el-table-column>
      <el-table-column align="center" :label="item.cardName" show-overflow-tooltip :key="index" v-for="(item, index) in gainCardList">
        <template slot-scope="scope">
          <span>{{scope.row.cardPointList[index].point}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import windowResize from "@/mixins/windowResize";
  import {getSchoolGradeClass} from '@/api/common/common';
  import {getSchoolClassCardPointStaticsList} from '@/api/integralBank';

  export default {
    name: "pointClassList",
    data() {
      return {
        downLoadUrl: '',
        pointDate: [],
        gradeList: [],
        gainCardList: [],
        dataList: [],
        gradeId: 0
      }
    },
    filters: {
      timeFormat(time) {
        return time ? time.substring(0, 19) : "--";
      }
    },
    mixins: [windowResize],
    created() {
      this.pointDate = [this.getMonthOne(), new Date()];
      this.getSchoolGradeClass();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      changePointDate() {
        this.getSchoolClassCardPointStaticsList();
      },
      getMonthOne() {
        const date = new Date();
        date.setDate(1);
        return date;
      },
      changeGrade() {
        this.getSchoolClassCardPointStaticsList();
      },
      getSchoolGradeClass() {
        getSchoolGradeClass().then(res => res.data).then(data => {
          if (data.code === 200 && data.result && data.data) {
            this.gradeList = data.data;
            this.getSchoolClassCardPointStaticsList();
          }
        });
      },
      getSchoolClassCardPointStaticsList() {
        const query = {
          gradeId: this.gradeId || 0,
          startDate: this.$moment(this.pointDate[0]).format('YYYY-MM-DD'),
          endDate: this.$moment(this.pointDate[1]).format('YYYY-MM-DD')
        };
        this.downLoadUrl = global.BasePath + "structure/integralBank/exportSchoolClassCardPointStaticsDatas?gradeId=" + query.gradeId + "&startDate=" + query.startDate + "&endDate=" + query.endDate + "&token=" + this.$store.getters.token;
        getSchoolClassCardPointStaticsList(query).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.dataList = data.data.classCardStaticsList;
            this.gainCardList = data.data.gainCardList;
          }
        });
      }
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
