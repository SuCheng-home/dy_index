<template>
  <div class="homeschoolthroughapprovedetails">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
    </div>
    <div class="read_task_info_box" :style="`height:${nobottommaxH}px`">
       <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
          <el-form-item label="活动类型">
                        <span v-if="taskInfo.type==1">志愿服务</span>
                        <span v-if="taskInfo.type==2">家长培训</span>
                        <span v-if="taskInfo.type==3">社会实践</span>
          </el-form-item>
          <el-form-item label="家长">{{taskInfo.createName}}</el-form-item>
          <el-form-item label="时间">{{taskInfo.applyDate}}</el-form-item>
          <el-form-item label="时长(小时)" v-if="taskInfo.type!=3">{{taskInfo.duration}}</el-form-item>
          <el-form-item label="地点" v-if="taskInfo.type==3">{{taskInfo.placeName}}</el-form-item>
          <el-form-item label="活动内容">{{taskInfo.content}}</el-form-item>
          <el-form-item label="活动照片" v-if="taskInfo.type==3&&picJson.length">
           <image-previewer  tag="richtext">
                   <img v-for="(pic,picIndex) in picJson" :key="picIndex" class="view-img" :src="pic" alt=""> 
                  </image-previewer>
          </el-form-item>
          <el-form-item label="审核人" v-if="taskInfo.status>2">{{taskInfo.auditName}}</el-form-item>
          <el-form-item label="审核时间" v-if="taskInfo.status>2">{{taskInfo.auditDate.split('.')[0]}}</el-form-item>
          <el-form-item label="审核状态" v-if="taskInfo.status>2">{{taskInfo.status==3?"通过":"不通过"}}</el-form-item>
          <el-form-item label="审核意见" v-if="taskInfo.status>2">{{taskInfo.auditContent}}</el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
  import {getApplyInfoById} from "@/api/homeschoolthrough";
  export default {
    name: 'homeschoolthroughapprovedetails',
    components: {
      ImagePreviewer
    },
    data() {
      return {
        id: this.$route.query.id,
        taskInfo: {},
        picJson:[]
      }
    },
    mixins: [mixins],
    created() {
      this.getApplyInfoByIds();
    },
    methods: {
      goBack() {
        this.$router.back()
      },
      getApplyInfoByIds() {
        getApplyInfoById(this.id).then(res => {
          let data = res.data.data;
          if (res.data.code === 200 && res.data.result) {
            this.taskInfo = data;
            this.picJson=JSON.parse(data.picJson);
          }
        });
      },
    }
  }
</script>

<style lang="scss" scoped>
  .homeschoolthroughapprovedetails {
    padding:12px;
    .header {
      padding-bottom: 10px;
      margin-bottom: 10px;
      font-size: 14px;
      border-bottom: 1px solid #eee;
    }
    .read_task_info_box {
      overflow-x: hidden;
      overflow-y: auto;
    }
    .view-img{
        float:left;
        width:50px;
        margin: 0 5px;
    }
    .demo-ruleForm{
      width: 810px;
      margin: 20px auto;
    }
  }
</style>
