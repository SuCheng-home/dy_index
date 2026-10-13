<template>
  <div class="signUserList">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
          <template>
            <!-- <el-select v-model="listQuery.stateType" placeholder="请选择签到状态"  size="medium"   @change="stateChange">
              <el-option label="全部签到状态" :value="0"></el-option>
              <el-option v-for="statusItem in statusList" :key="statusItem.id" :label="statusItem.signNo" :value="statusItem.id">
                </el-option>
            </el-select> -->
            <el-select style="width:200px" size="medium" v-model="listQuery.gradeId" placeholder="请选择年级"
              @change="gradeIdEvent">
              <el-option label="全部年级" :value="0">
              </el-option>
              <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-select size="medium" style="width:200px" v-model="listQuery.classId" placeholder="请选择班级"
              @change="twoTypeFunc" v-if="listQuery.gradeId">
              <el-option label="全部班级" :value="0"></el-option>
              <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select>

          </template>
          <!-- <a :href="exportUrl" download="导出结果" target="_blank"  v-if="meetingUser.length">
              <el-button type="primary" size="medium" icon="upload">导出签到未签统计</el-button>
          </a> -->
          <!-- <el-button type="primary" size="medium"  @click="jumpTo('unattendedpersonnel',query)">未签到人员</el-button> -->

        </el-col>
        <el-col :span="5">
          <el-input class="search-input" placeholder="搜索姓名" icon="search" size="medium"
            @keyup.enter.native="twoTypeFunc" v-model.trim="listQuery.studentName">
            <el-button slot="append" icon="el-icon-search" @click="twoTypeFunc"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="main-wrap">
      <el-table ref="multipleTable" :data="meetingUser" :height="maxH" v-loading="listLoading" border stripe
        style="width: 100%">
        <el-table-column label="学号" align="center" min-width="2">
          <template slot-scope="scope">{{ scope.row.studentNo }}</template>
        </el-table-column>
        <el-table-column label="学生姓名" align="center" min-width="2">
          <template slot-scope="scope">{{ scope.row.studentName }}</template>
        </el-table-column>
        <el-table-column label="班级" align="center" min-width="2">
          <template slot-scope="scope">{{ scope.row.className }}</template>
        </el-table-column>
        <el-table-column label="签到详情" show-overflow-tooltip align="center" min-width="4">
          <template slot-scope="scope">{{ convertEvent(scope.row.parentSignInfo) }}</template>
        </el-table-column>

      </el-table>

    </div>
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
import _ from 'lodash';
import { getActivityStList, getGradeAndClassList } from '@/api/activity';
export default {
  name: 'parentSignUserList',
  data() {
    return {
      activityId: this.$route.query.activityId,
      activityTitle: this.$route.query.activityTitle,
      signTimeId: this.$route.query.signTimeId,
      activityType: this.$route.query.activityType,
      query: this.$route.query,
      listQuery: {
        activityId: this.$route.query.activityId,
        classId: 0,
        gradeId: 0,
        studentName: ''
      },

      total: 0,
      listLoading: false,
      meetingUser: [],
      exportUrl: '',
      gradeList: [],
      classList: []
    }
  },
  created() {
    this.meetingUser = [];
    this.listQuery.stateType = Number(this.signTimeId);
    this.getGradeByTermIds();

  },
  mounted() {

  },
  mixins: [
    mixin
  ],
  filters: {
    filterTime(date) {
      return date ? date.slice(0, 19) : ''
    },
    filterStartTime(date) {
      return date ? date.slice(0, 16) : ''
    }
  },
  methods: {
    //获取年级
    getGradeByTermIds() {
      getGradeAndClassList({
        activityId: this.$route.query.activityId
      }).then(res => {
        this.gradeList = res.data.data;
        this.twoTypeFunc();
      });

    },
    //年级选择事件
    gradeIdEvent(val) {
      this.classList = [];
      if (val) {
        let arr = this.gradeList.filter(item => item.id == val)
        this.classList = arr[0].childList;
      }
      this.twoTypeFunc();
    },

    twoTypeFunc() {
      if (this.activityType == 0) {
        this.listLoading = true;
        getActivityStList({
          activityId: this.activityId,
          classId: this.listQuery.classId,
          gradeId: this.listQuery.gradeId,
          studentName: this.listQuery.studentName

        }).then(res => {
          console.log(res);
          if (res.data.code === 200) {
            console.log('getActivityStList', res);

            this.listLoading = false;

            this.meetingUser = res.data.data;
            // this.total = meetingData.pagination.total;
            // this.exportUrl = `${global.BasePath}structure/activity/downloadSignXls?token=${this.$store.getters.token}&activityId=${this.activityId}&signNo=${this.listQuery.signNo}&signTimeId=${this.listQuery.stateType}`;
          } else {
            this.listLoading = false;
          }
        }).catch(() => {
          this.listLoading = false;
        })
      }
    },
    // 转换事件
    convertEvent(event) {
      if (event) {
        return event.split(';')
          .map(item => {
            const parts = item.split('#');
            const name = parts[0];
            const time = parts[1];
            const address = parts[2];

            if (address) {
              return `${name} (${time} ${address})`;
            } else {
              return `${name} (${time})`;
            }
          })
          .join(';');
      }
      return '';
    },
    jumpTo(path, query = {}) {
      this.$router.push({
        path,
        query
      })
    },

  }
}
</script>
<style lang="scss" scoped>
.signUserList {
  padding: 12px;
  box-sizing: border-box;

  .header {
    margin-bottom: 10px;
  }

  .main-wrap {
    padding-top: 0 !important;

    .imgSize {
      width: 25px;
      height: 25px;
    }
  }
}
</style>

<style scoped>
.signUserList .search-input {
  margin: 0;
}
</style>
