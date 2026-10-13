<template>
  <div class="clock_module_list_wrap">
    <common-header show-back show-search @search="nameSearch" placeholder="请输入姓名">
      <el-select v-model="listQuery.classId" placeholder="请选择" size="medium" style="width: 150px;" @change="getEcardUserCardStaticList">
        <el-option label="全部部门" :value="0" v-if="isShowByPermission('/ecard/ecardTempList')"></el-option>
        <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id"></el-option>
      </el-select>
      <a :href="exportUrl" v-if="dataList && dataList.length" target="_blank" download="examName">
        <el-button type="primary" size="medium">导出</el-button>
      </a>
    </common-header>
    <div>
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH-20">
        <el-table-column align="center" label="姓名" show-overflow-tooltip width="400px">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="部门/班级">
          <template slot-scope="scope">
            <span>{{ scope.row.classDepartName }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打卡率">
          <template slot-scope="scope">
            <span>{{cardPercent(scope.row.cardCount, scope.row.totalCount)}}%</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="平均得分">
          <template slot-scope="scope">
            <span>{{scope.row.avgScore | filterScore}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="text-align: right;">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.pageNo" :page-sizes="[20, 30, 50, 100]"
                       :page-size.sync="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total"></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import { isShowByPermission } from "@/utils/utils";
  import baseMixin from '@/mixins/baseMixin'
  import CommonHeader from './components/CommonHeader'
  import {getEcardUserCardStaticList, getDepartListByUserId} from '@/api/eClock'

  export default {
    name: 'clockCardScore',
    components: {CommonHeader},
    data() {
      return {
        cardId: this.$route.query.cardId,
        sendUserType: Number(this.$route.query.sendUserType),
        listQuery: {
          classId: 0,
          eCardId: this.$route.query.cardId,
          pageNo: 1,
          pageSize: 20,
          userName: ''
        },
        total: null,
        exportUrl: '',
        departList: [],
        dataList: [],
        taskInfo: {},
        curDateStr: this.$moment().format('YYYY-MM-DD')
      }
    },
    mixins: [baseMixin, mixin],
    filters: {
      filterScore(date) {
        return date ? parseFloat(date).toFixed(1) : '--';
      }
    },
    created() {
      this.taskInfo = JSON.parse(sessionStorage.getItem('taskInfo')) || {};
      if (this.isShowByPermission('/ecard/ecardTempList')) {
        this.getEcardUserCardStaticList();
        if (this.taskInfo.sendUserType === 2) {
          this.departList = this.taskInfo.stuDepartJson ? JSON.parse(this.taskInfo.stuDepartJson) : [];
        } else {
          this.departList = this.taskInfo.thScopeJson ? JSON.parse(this.taskInfo.thScopeJson).departJson : [];
        }
      } else {
        this.getDepartListByUserId();
      }
    },
    methods: {
      isShowByPermission,
      cardPercent(num, total) {
        if (num && total) {
          return parseFloat(num/total*100).toFixed(1);
        }
        return 0;
      },
      nameSearch(val) {
        this.listQuery.userName = val;
        this.getEcardUserCardStaticList();
      },
      scoreFilter(value) {
        return value ? parseFloat(value).toFixed(1) : '';
      },
      // 获取数据列表
      getDepartListByUserId() {
        getDepartListByUserId({type: this.sendUserType === 2 ? 4 : 7}).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.departList = data.data;
            if (data.data && data.data.length) {
              this.listQuery.classId = data.data[0].id;
              this.getEcardUserCardStaticList();
            }
          } else {
            this.$message({type: 'error', message: res.data.msg})
          }
        }).catch(() => {})
      },
      // 获取数据列表
      getEcardUserCardStaticList() {
        this.exportUrl = global.BasePath + "structure/ecard/exportEcardUserCardStaticListAll?eCardId=" + this.cardId + '&classId=' + this.listQuery.classId + '&userName=' + this.listQuery.userName + "&token=" + this.$store.getters.token;
        getEcardUserCardStaticList(this.listQuery).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.dataList = data.data.dataList;
            this.total = data.data.pagination.total;
          } else {
            this.$message({type: 'error', message: res.data.msg})
          }
        }).catch(() => {})
      },
      handleSizeChange(val) {
        this.listQuery.pageNo = 1;
        this.listQuery.pageSize = val;
        this.getEcardUserCardStaticList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getEcardUserCardStaticList();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .clock_module_list_wrap {
    padding: 12px;
    box-sizing: border-box;
  }
</style>
