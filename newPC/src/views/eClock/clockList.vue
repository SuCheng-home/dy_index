<template>
  <div class="clock_list_wrap">
    <common-header show-search @search="nameSearch" placeholder="请输入任务名称">
      <el-date-picker v-model="dateRange" type="daterange" class="mywidthdaterange" size="medium" range-separator="-" start-placeholder="开始日期"
                      end-placeholder="结束日期" :clearable="false" @change="changeDate"></el-date-picker>
      <el-button type="primary" size="medium" @click="addClock">新建</el-button>
      <el-button type="primary" size="medium" @click="toModulePage" v-if="isShowByPermission('/ecard/ecardTempList')">任务模板</el-button>
      <el-button type="primary" size="medium" @click="toScorePage" v-if="isShowByPermission('/ecard/ecardTempList')">评分统计</el-button>
    </common-header>
    <div>
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH-1">
        <el-table-column align="center" label="打卡任务名称" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="link-type" @click="toClockInfo(scope.row.id)">{{ scope.row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布对象" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.sendUserType===1 ? '教师' : '学生' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布范围" show-overflow-tooltip>
          <template slot-scope="scope">
            <span v-if="scope.row.sendUserType===1">{{ scope.row.thScopeJson | thRangFilter}}</span>
            <span v-else>{{ scope.row.stuDepartJson | stRangFilter}}{{scope.row.stuDepartJson&&scope.row.stuGroupJson ? '' : ''}}{{ scope.row.stuGroupJson | stRangFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="发布人" show-overflow-tooltip width="100px">
          <template slot-scope="scope">
            <span>{{ scope.row.createUserName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="起止时间" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.dateJson | timeRangFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="最终成果上传" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>{{ scope.row.isAchievementis===2 ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" show-overflow-tooltip>
          <template slot-scope="scope">
            <span>
              <el-tag  size="mini" type="info" v-if="scope.row.state===1">草稿</el-tag>
              <el-tag  size="mini" v-else-if="curDateStr < scope.row.startDate">未开始</el-tag>
              <el-tag  size="mini" type="warning" v-else-if="curDateStr > scope.row.endDate">已结束</el-tag>
              <el-tag  size="mini" type="success" v-else>进行中</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160px">
          <template slot-scope="scope">
            <template v-if="scope.row.createUserId===curUserId || isShowByPermission('/ecard/ecardTempList')">
              <el-button size="small" type="text" @click.native="editClock(scope.row.id)" v-if="scope.row.state===1">编辑</el-button>
              <el-button size="small" type="text" @click.native="delClock(scope.row.id)" class="buttontextred">删除</el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]"
                       :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import {isShowByPermission} from '@/utils';
  import baseMixin from '@/mixins/baseMixin'
  import CommonHeader from './components/CommonHeader'
  import {getEcardList, delEcard, getDepartListByUserId} from '@/api/eClock'

  export default {
    name: 'clockList',
    components: {CommonHeader},
    data() {
      return {
        dateRange: [],
        exportUrl: '',
        dataList: [],
        listQuery: {
          searchType: 1,
          classIds: '',
          pageNo: 1,
          pageSize: 20,
          startDate: '',
          endDate: '',
          title: ''
        },
        total: 0,
        curUserId: this.$store.getters.userInfo.id,
        curDateStr: this.$moment().format('YYYY-MM-DD')
      }
    },
    mixins: [baseMixin, mixin],
    filters: {
      thRangFilter(val) {
        if (val) {
          const departArr = JSON.parse(val).departJson.map(i => i.name);
          const userArr = JSON.parse(val).userJson.map(i => i.name);
          const groupArr = JSON.parse(val).groupJson.map(i => i.name);
          return [...departArr, ...userArr, ...groupArr].toString();
        }
        return '';
      },
      stRangFilter(val) {
        return val ? JSON.parse(val).map(i => i.name).toString() : '';
      },
      timeRangFilter(val) {
        return val ? `${JSON.parse(val)[0]}~${JSON.parse(val)[JSON.parse(val).length-1]}` : '';
      }
    },
    created() {
      this.listQuery.pageNo = this.$store.state.app.clockPage.clockPageNo || 1;
      this.listQuery.pageSize = this.$store.state.app.clockPage.clockPageSize || 20;
      if (this.$store.state.app.clockPage.endDate) {
        this.dateRange = [this.$store.state.app.clockPage.startDate, this.$store.state.app.clockPage.endDate];
      } else {
        this.dateRange = [new Date(this.$moment().set('date', 1).valueOf()), new Date()];
      }
      if (this.isShowByPermission('/ecard/ecardTempList')) {
        this.getClockList();
      } else {
        this.getDepartListByUserId();
      }
    },
    methods: {
      isShowByPermission,
      getDepartListByUserId() {
        getDepartListByUserId().then(res => res.data).then(data => {
          if (data.code === 200 && data.data && data.data.length) {
            this.listQuery.searchType = 2;
            this.listQuery.classIds = data.data.map(item => item.id).toString();
          } else {
            this.listQuery.searchType = 3;
          }
          this.getClockList();
        }).catch(() => {})
      },
      toModulePage() {
        this.$router.push({path: 'clockModuleList'});
      },
      toScorePage() {
        this.$router.push({path: 'clockScore', query: {startDate: this.$moment(this.dateRange[0]).format('YYYY-MM-DD'), endDate: this.$moment(this.dateRange[1]).format('YYYY-MM-DD')}});
      },
      toClockInfo(cardId) {
        this.$router.push({path: 'clockInfo', query: {cardId: cardId}});
      },
      addClock() {
        this.$router.push({path: 'clockAdd'});
      },
      editClock(cardId) {
        this.$router.push({path: 'clockAdd', query: {cardId: cardId}});
      },
      nameSearch(val) {
        this.listQuery.title = val;
        this.listQuery.pageNo = 1;
        this.getClockList()
      },
      changeDate() {
        this.listQuery.pageNo = 1;
        this.$store.commit("CLOCK_PAGE_CHANGE", this.listQuery);
        this.getClockList()
      },
      delClock(clockId) {
        this.$confirm('是否删除该打卡任务?', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delEcard({eCardId: clockId}).then(res => res.data).then(data => {
            if (data.code === 200) {
              this.$message({type: 'success', message: '删除成功!'});
              this.getClockList();
            } else {
              this.$message({type: 'error', message: data.msg})
            }
          }).catch();
        }).catch(() => {
        });
      },
      // 获取数据列表
      getClockList() {
        this.listQuery.startDate = this.$moment(this.dateRange[0]).format('YYYY-MM-DD'); //时间
        this.listQuery.endDate = this.$moment(this.dateRange[1]).format('YYYY-MM-DD'); //时间
        getEcardList(this.listQuery).then(res => res.data).then(data => {
          if (data.code === 200) {
            let tableData = data.data;
            this.dataList = tableData.dataList;
            this.total = tableData.pagination.total;
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch(() => {})
      },
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.$store.commit("CLOCK_PAGE_CHANGE", this.listQuery);
        this.getClockList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.$store.commit("CLOCK_PAGE_CHANGE", this.listQuery);
        this.getClockList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .clock_list_wrap {
    padding: 12px;
    box-sizing: border-box;
  }
</style>
