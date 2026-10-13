<template>
  <div class="star_exchange_wrap">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="primary" size="medium" @click="saveSet" :loading="loading">保存</el-button>
    </div>
    <div class="star_exchange_box">
      <div class="check_star_box">
        <el-checkbox v-model="checked">开启点赞兑换星值</el-checkbox>
      </div>
      <div class="star_num_box" v-if="checked">
        <el-input-number v-model.trim="starNum" size="medium" :min="1" :max="999" :step="1" label="请输入点赞数"></el-input-number>&nbsp;&nbsp;赞=1星值
      </div>
    </div>
  </div>
</template>

<script>
  import { getSchoolPracticeActivityThumbExchange, savePracticeActivityThumbExchange} from '@/api/comprehensivepractice';

  export default {
    name: "starExchangeSet",
    data() {
      return {
        loading: false,
        checked: false,
        starNum: 1
      }
    },
    created() {
      this.getPracticeActivityPageLists();
    },
    methods: {
      getPracticeActivityPageLists() {
        getSchoolPracticeActivityThumbExchange().then(res => res.data).then(data => {
          if (data.code === 200) {
            this.checked = data.data.isOpen===1;
            if (this.checked) {
              this.starNum = data.data.standardNum
            }
          }
        })
      },
      saveSet() {
        if (this.checked && !this.starNum) {
          this.$message({
            message: '请输入点赞数',
            type: 'warning'
          });
          return;
        }
        let query = {
          isOpen: this.checked ? 1 : 0,
          standardNum: this.checked ? this.starNum : 0
        };
        this.savePracticeActivityThumbExchange(query);
      },
      savePracticeActivityThumbExchange(query) {
        this.loading = true;
        savePracticeActivityThumbExchange(query).then(res => res.data).then(data => {
          if (data.code === 200 && data.result) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
          this.loading = false;
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .star_exchange_wrap{
    padding:12px;
    .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .star_exchange_box{
      width: 820px;
      margin: 0 auto;
      .check_star_box{
        margin: 20px 0;
      }
      .star_num_box{
        margin-left: 25px;
      }
    }
  }
</style>
