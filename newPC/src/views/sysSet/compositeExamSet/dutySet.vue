<template>
  <div class="duty_set_wrap">
    <div class="el-row">
      <div class="top">
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
        <el-button size="medium" type="primary" @click.native="addAndUpdateCompositeCheckInit">保存</el-button>
      </div>
    </div>
    <div class="main-wrap scrollBar">
      <el-form label-position="left" :model="ruleForm" ref="ruleForm" label-width="140px"
               class="demo-ruleForm">
        <el-form-item label="评分方式" class="is-required">
          <el-radio-group v-model="chekType">
            <el-radio :label="1">按检查项</el-radio>
            <el-radio :label="2">按班级</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="全部清空" class="is-required">
          <el-radio-group v-model="allDelShow">
            <el-radio :label="1">不展示</el-radio>
            <el-radio :label="2">展示</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="全部满分/星" class="is-required">
          <el-radio-group v-model="allScoreShow">
            <el-radio :label="1">不展示</el-radio>
            <el-radio :label="2">展示</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {getCompositeCheckInit, addAndUpdateCompositeCheckInit} from '@/api/compositeExamSet';

  export default {
    name: 'dutySet',
    data() {
      return {
        chekType: null,
        allDelShow: null,
        allScoreShow: null,
        typeId: 0
      }
    },
    created() {
      this.getCompositeCheckInit();
    },
    methods: {
      getCompositeCheckInit() {
        getCompositeCheckInit().then(res => {
          let data = res.data;
          if (data.code === 200 && data.data) {
            this.chekType = data.data.chekType;
            this.allDelShow = data.data.allDelShow;
            this.allScoreShow = data.data.allScoreShow;
            this.typeId = data.data.id;
          }
        })
      },
      addAndUpdateCompositeCheckInit() {
        addAndUpdateCompositeCheckInit({
          chekType: this.chekType,
          allDelShow: this.allDelShow,
          allScoreShow: this.allScoreShow,
          id: this.typeId
        }).then(res => {
          let data = res.data;
          if (data.code === 200) {
            this.$message({
              type: 'success',
              message: '保存成功！'
            });
            this.$router.back();
          } else {
            this.$message({
              type: 'warning',
              message: data.msg
            });
          }
        })
      }
    }

  }
</script>
<style lang="scss" scoped>
  .duty_set_wrap{
    padding: 10px 15px;

    .top{
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
    }
    .main-wrap{
      width: 820px;
      margin: 10px auto;
    }
  }
</style>
