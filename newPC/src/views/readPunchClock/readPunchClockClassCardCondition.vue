<template>
  <div class="readPunchClockClassCardCondition">
    <div class="top">
      <el-row  style="padding-bottom: 10px">
        <el-col :span="20">
          <el-button @click="goBack"  size="medium">返回</el-button>
          <el-button type="primary"   v-if="tableList.length"  size="medium" @click="exportExcel('#outTable', `${className}学生打卡情况.xlsx`)">导出</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table stripe :data="tableList" border :height="maxH" id="outTable">
        <el-table-column prop="stuName" label="姓名"></el-table-column>
        <el-table-column label="打卡情况">
          <template slot-scope="scope">
            <span v-if="scope.row.id">已打卡</span>
            <span v-else>未打卡</span>
          </template>
        </el-table-column>
        <el-table-column label="阅读执行情况">
          <template slot-scope="scope">
            <span v-if="scope.row.finished === 1">已完成</span>
            <span v-else>未完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="readPage" label="总阅读页数" sortable></el-table-column>
        <el-table-column prop="readTime" label="阅读时长(分)" sortable></el-table-column>
      </el-table>

      <div class="footer_wrap">
        <el-radio-group v-model="hasIdType" @change="typeChange">
          <el-radio :label="0">全部</el-radio>
          <el-radio :label="1">已打卡</el-radio>
          <el-radio :label="2">未打卡</el-radio>
        </el-radio-group>
      </div>
    </div>
  </div>
</template>

<script>
  import { getStuPunchClockCondition } from '@/api/readPunchClock';
  import baseMixin from '@/mixins/baseMixin';
  import mixin from '@/mixins/windowResize';
  export default {
    name: 'readPunchClockClassCardCondition',
    data() {
      return {
        tableList: [],
        hasIdType: 0,
        className: ''
      }
    },
    mixins: [baseMixin,mixin],
    created() {
      this.className = this.$route.query.className;
      this.getStuPunchClockCondition();
    },
    methods: {
      goBack() {
        this.$router.back();
      },
      typeChange(val) {
        this.hasIdType = val;
        this.getStuPunchClockCondition();
      },
      getStuPunchClockCondition() {
        let query = {
          classId: parseInt(this.$route.query.classId),
          date: this.$route.query.date,
          type: this.hasIdType
        };
        getStuPunchClockCondition(query).then((res) => {
          const data= res.data.data;
          if (res.data.code === 200) {
            this.tableList = data;
          }
        }).catch(() => {});
      },
    }
  }
</script>

<style scoped>
  .footer_wrap{
    padding:12px;
  }
  .readPunchClockClassCardCondition{
    padding:12px;
  }
</style>
