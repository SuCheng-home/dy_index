<template>
  <div class="clock_module_list_wrap">
    <common-header show-back show-border :show-search="tabCard==='1'" @search="nameSearch" placeholder="请输入姓名">
      <el-radio-group v-model="tabCard" size="medium" style="margin-top: -2px;">
        <el-radio-button label="1">已打卡</el-radio-button>
        <el-radio-button label="2">未打卡</el-radio-button>
      </el-radio-group>
      <template v-if="tabCard==='2'">
        <a :href="exportUrl" target="_blank" download="examName">
          <el-button type="primary" size="medium">导出未打卡</el-button>
        </a>
        <el-button type="primary" size="medium" @click="remindClock">提醒未打卡</el-button>
      </template>
    </common-header>
    <div>
      <card-clock ref="cardBox" :card-id="cardId" :card-date="cardDate" :card-score="taskInfo.cardScore" :is-card="taskInfo.isCardBatch" v-show="tabCard==='1'"></card-clock>
      <card-not :card-id="cardId" :card-date="cardDate" v-show="tabCard==='2'"></card-not>
    </div>
  </div>
</template>

<script>
  import CardClock from './components/CardClock'
  import CardNot from './components/CardNot'
  import CommonHeader from './components/CommonHeader'
  import {remindNotEcardUserList} from '@/api/eClock'

  export default {
    name: 'clockCardInfo',
    components: {CommonHeader, CardClock, CardNot},
    data() {
      return {
        cardId: this.$route.query.cardId,
        cardDate: this.$route.query.cardDate,
        tabCard: '1',
        exportUrl: '',
        taskInfo: {}
      }
    },
    created() {
      this.taskInfo = JSON.parse(sessionStorage.getItem('taskInfo')) || {};
      this.exportUrl = global.BasePath + "structure/ecard/exportNotEcardUserDateList?eCardId=" + this.cardId + '&cardDate=' + this.cardDate + "&token=" + this.$store.getters.token;
    },
    methods: {
      nameSearch(val) {
        this.$refs.cardBox.initData(val);
      },
      remindClock() {
        this.$confirm('确认提醒未打卡人员?', '提醒', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          remindNotEcardUserList({
            eCardId: this.cardId,
            cardDate: this.cardDate,
            sendUserType: this.taskInfo.sendUserType,
            title: this.taskInfo.title
          }).then(res => res.data).then(data => {
            if (data.code === 200) {
              this.$message({type: 'success', message: '提醒成功!'});
            } else {
              this.$message({type: 'error', message: data.msg})
            }
          }).catch();
        }).catch(() => {});
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
