<template>
  <div class="clock_module_list_wrap">
    <common-header show-back show-search @search="nameSearch" placeholder="请输入姓名">
      <el-select v-model="listQuery.classId" placeholder="请选择" size="medium" style="width: 150px;" @change="getEcardUserList">
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
        <el-table-column align="center" label="上传时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime | timeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态">
          <template slot-scope="scope">
            <el-tag  size="mini"  type="success" v-if="scope.row.achievementisState === 4">已评价</el-tag>
            <el-tag  size="mini"  v-else-if="scope.row.achievementisState === 2">已上传</el-tag>
            <el-tag  size="mini"  type="info" v-else>未上传</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="分数">
          <template slot-scope="scope">
            <span>{{ scope.row.achievementisState===4 ? scoreFilter(scope.row.batchScore) : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="160px">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click.native="toAchieveInfo(scope.row.userId)" v-if="scope.row.achievementisState!==1">评分</el-button>
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
  import {getEcardUserList, getDepartListByUserId} from '@/api/eClock'

  export default {
    name: 'clockCardAchieve',
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
        curDateStr: this.$moment().format('YYYY-MM-DD')
      }
    },
    mixins: [baseMixin, mixin],
    filters: {
      timeFilter(date) {
        return date ? date.substring(0, 19) : '--';
      }
    },
    created() {
      this.getDepartListByUserId();
      if (this.isShowByPermission('/ecard/ecardTempList')) {
        this.getEcardUserList();
      }
    },
    methods: {
      isShowByPermission,
      nameSearch(val) {
        this.listQuery.userName = val;
        this.getEcardUserList();
      },
      scoreFilter(value) {
        return value ? parseFloat(value).toFixed(1) : '';
      },
      toAchieveInfo(userId) {
        this.$router.push({path: 'clockCardAchieveInfo', query: {cardId: this.cardId, userId: userId}});
      },
      // 获取数据列表
      getDepartListByUserId() {
        getDepartListByUserId({type: this.sendUserType === 2 ? 4 : 7}).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.departList = data.data;
            if (!this.isShowByPermission('/ecard/ecardTempList') && data.data && data.data.length) {
              this.listQuery.classId = data.data[0].id;
              this.getEcardUserList();
            }
          } else {
            this.$message({type: 'error', message: res.data.msg})
          }
        }).catch(() => {})
      },
      // 获取数据列表
      getEcardUserList() {
        this.exportUrl = global.BasePath + "structure/ecard/exportEcardUserListAll?eCardId=" + this.cardId + '&classId=' + this.listQuery.classId + '&userName=' + this.listQuery.userName + "&token=" + this.$store.getters.token;
        getEcardUserList(this.listQuery).then(res => res.data).then(data => {
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
        this.getEcardUserList();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getEcardUserList();
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
