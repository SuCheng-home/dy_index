<template>
  <div class="open_class_info_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
    </div>
    <div class="open_class_info_box" :style="`height:${nobottommaxH-5}px`">
      <el-form ref="ruleForm" label-width="100px" class="demo-ruleForm open_class_info_list">
        <el-form-item label="申请人">{{growUpInfo.stuName}}&nbsp;{{growUpInfo.className}}</el-form-item>
        <el-form-item label="主题">{{growUpInfo.title}}</el-form-item>
        <el-form-item label="时间">{{growUpInfo.openDate}}</el-form-item>
        <el-form-item label="类型">{{growUpInfo.pTypeName}}（{{growUpInfo.typeName}}）</el-form-item>
        <el-form-item label="内容">{{growUpInfo.content}}</el-form-item>
        <el-form-item label="审核信息">
          <el-timeline>
            <el-timeline-item v-for="(item, index) in checkStepList" :key="index" :timestamp="item.title" placement="top">
              <div>
                <el-tag  size="mini" effect="plain"  type="success" v-if="item.auditState === 1">通过</el-tag>
                <el-tag  size="mini" effect="plain"  type="danger" v-else-if="item.auditState === 1">驳回</el-tag>
                {{item.auditName}}&nbsp;&nbsp;{{item.auditDate | timeFilter}}
              </div>
              <div>{{item.auditContent}}</div>
            </el-timeline-item>
          </el-timeline>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getGrowthConferenceInfo} from '@/api/childrenGrowUp';

  export default {
    name: 'childrenGrowUpInfo',
    data() {
      return {
        growUpId: this.$route.query.growUpId,
        growUpInfo: {},
        checkStepList: []
      }
    },
    created() {
      this.getGrowthConferenceInfo();
    },
    filters: {
      timeFilter(time) {
        return time ? time.slice(0, 19) : '';
      }
    },
    mixins: [mixins],
    methods: {
      goBack() {
        this.$router.back()
      },
      getGrowthConferenceInfo() {
        getGrowthConferenceInfo({id: this.growUpId}).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.growUpInfo = data.data;
            this.checkStepList = [
              {
                title: '初审',
                auditContent: data.data.fAuditContent,
                auditDate: data.data.fAuditDate,
                auditName: data.data.fAuditName,
                auditState: data.data.fAuditState
              },
              {
                title: '终审',
                auditContent: data.data.sAuditContent,
                auditDate: data.data.sAuditDate,
                auditName: data.data.sAuditName,
                auditState: data.data.sAuditState
              }
            ]
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../../../src/styles/mixin.scss";

  .open_class_info_wrap {
    padding:12px;
    .header {
      padding-bottom: 10px;
      margin-bottom: 20px;
      font-size: 14px;
      border-bottom: 1px solid #eee;
    }

    .open_class_info_box {
      overflow-x: hidden;
      overflow-y: auto;
      @include scrollBar;

      .open_class_info_list {
        width: 820px;
        margin: 0 auto;
        padding: 0 20px;
        color: #333;
      }
    }
  }
</style>

<style scoped>
  .open_class_info_wrap .el-form-item__label {
    font-weight: 700;
    color: #333;
  }
</style>
