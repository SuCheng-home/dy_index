<template>
  <div class="clock_module_list_wrap">
    <common-header show-back>
      <a :href="exportUrl" v-if="dataList && dataList.length" target="_blank" download="examName">
        <el-button type="primary" size="medium">导出</el-button>
      </a>
    </common-header>
    <div>
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="boxH-200">
        <el-table-column align="center" label="时间" show-overflow-tooltip width="400px">
          <template slot-scope="scope">
            <span :class="`${curDateStr>=scope.row.cardDate ? 'link-type' : ''}`" @click="toCardInfo(scope.row.cardDate)">{{ scope.row.cardDate }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打卡人数">
          <template slot-scope="scope">
            <span>{{ scope.row.userCount }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="已打卡">
          <template slot-scope="scope">
            <span>{{ curDateStr>=scope.row.cardDate ? scope.row.cardCount : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="未打卡">
          <template slot-scope="scope">
            <span>{{ curDateStr>=scope.row.cardDate ? (scope.row.userCount - scope.row.cardCount) : '--' }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="打卡率">
          <template slot-scope="scope">
            <span>{{ curDateStr>=scope.row.cardDate ? (percentFilter(scope.row.userCount, scope.row.cardCount) + '%') : '--' }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixin from '@/mixins/windowResize'
  import baseMixin from '@/mixins/baseMixin'
  import CommonHeader from './components/CommonHeader'
  import {getDatestatisticsList} from '@/api/eClock'

  export default {
    name: 'clockCardStatistics',
    components: {CommonHeader},
    data() {
      return {
        cardId: this.$route.query.cardId,
        exportUrl: '',
        dataList: [],
        curDateStr: this.$moment().format('YYYY-MM-DD')
      }
    },
    mixins: [baseMixin, mixin],
    created() {
      this.getClockList();
    },
    methods: {
      percentFilter(total, num) {
        return total && num ? (num/total*100).toFixed(1) : 0;
      },
      toCardInfo(cardDate) {
        if (this.curDateStr >= cardDate) {
          this.$router.push({path: 'clockCardInfo', query: {cardId: this.cardId, cardDate: cardDate}});
        }
      },
      // 获取数据列表
      getClockList() {
        this.exportUrl = global.BasePath + "structure/ecard/exportDatestatisticsList?eCardId=" + this.cardId + "&token=" + this.$store.getters.token;
        getDatestatisticsList({eCardId: this.cardId}).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.dataList = data.data;
          } else {
            this.$message({type: 'error', message: data.msg})
          }
        }).catch(() => {})
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
