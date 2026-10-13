<template>
  <div class="open_class_info_wrap">
    <div class="header">
      <el-button size="medium" @click="goBack">返回</el-button>
      <el-button size="medium" type="primary" @click="showCheckDialog(4)" v-if="openClassInfo.state === 2 && isApprovalInfo">同意
      </el-button>
      <el-button size="medium" type="danger" @click="showCheckDialog(3)" v-if="openClassInfo.state === 2 && isApprovalInfo">驳回
      </el-button>
    </div>
    <div class="open_class_info_box" :style="`height:${nobottommaxH-30}px`">
      <div class="open_class_info_list">
        <el-row :gutter="50">
          <el-col :span="14" :offset="2" style="border-right: 1px solid #eee;">
            <el-form ref="ruleForm" label-width="140px" class="demo-ruleForm">
              <el-form-item label="时间">{{openClassInfo.listenDate}}&nbsp;{{openClassInfo.listenWeek}}&nbsp;{{openClassInfo.classNoName}}</el-form-item>
              <el-form-item label="班级">{{openClassInfo.className?openClassInfo.className:"无"}}</el-form-item>
              <el-form-item label="主讲人">{{openClassInfo.teacherName}}</el-form-item>
              <el-form-item label="学科">{{openClassInfo.subjectName}}</el-form-item>
              <el-form-item label="课题" v-if="openClassInfo.subjectTheme">{{openClassInfo.subjectTheme}}</el-form-item>
              <el-form-item label="地点">{{openClassInfo.place}}</el-form-item>
              <el-form-item label="级别">{{openClassInfo.levelName}}</el-form-item>
              <el-form-item label="公开课类型">{{openClassInfo.openClassType}}</el-form-item>

              <el-form-item label="形式"  v-if="openClassInfo.modality" >{{openClassInfo.modality}}</el-form-item>      
              <el-form-item label="参加对象"  v-if="openClassInfo.participant" >{{openClassInfo.participant}}</el-form-item>
              <el-form-item label="督查领导"  v-if="openClassInfo.supervisoryLeader" >{{openClassInfo.supervisoryLeader}}</el-form-item>
              <el-form-item label="备注"  v-if="openClassInfo.applyRemark" >{{openClassInfo.applyRemark}}</el-form-item>

              <el-form-item label="签到二维码" v-if="openClassInfo.state === 4">
                <img :src="openClassInfo.qRcode" class="qr_img" alt="">
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <div class="header_top_title">审核记录</div>
            <div class="check_msg_list" :key="index" v-for="(item, index) in openClassInfo.rejectList">
              <div><el-tag type="danger" size="medium">驳回</el-tag>&nbsp;&nbsp;{{item.examineUserName}}&nbsp;{{item.rejectDate | timeFilter}}</div>
              <div class="reject_text">{{item.rejectReason}}</div>
            </div>
            <div class="check_msg_list" v-if="openClassInfo.state === 4">
              <div><el-tag type="success" size="medium">同意</el-tag>&nbsp;&nbsp;{{openClassInfo.examineUserName}}&nbsp;{{openClassInfo.publishTime | timeFilter}}</div>
              <div class="reject_text">{{openClassInfo.approveRemark}}</div>
            </div>
            <div class="check_msg_list" v-if="openClassInfo.state === 2 && !openClassInfo.rejectList.length">暂无记录</div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog :visible.sync="dialogFormVisible" width="600px">
      <div slot="title">审核意见 <span style="color: #f00;" v-show="state === 3">*</span></div>
      <div class="check_info_box">
        <el-input type="textarea" v-model.trim="checkInfoText"></el-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button size="medium" @click="hideVisible">取 消</el-button>
        <el-button size="medium" type="primary" @click="addCheckInfo">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {registerDetail, examineRegister} from "@/api/teachingStudy/openClass";

  export default {
    name: 'openClassApprovalInfo',
    data() {
      return {
        isApprovalInfo: false,
        dialogFormVisible: false,
        checkInfoText: '',
        state: 4,
        openClassId: this.$route.query.id,
        openClassInfo: {
          applyRemark:"",//	申请人备注	string	
          approveRemark:"",//		审批人通过的意见	string	
          classId:"",//		班级id	number	
          className:"",//		班级名称	string	
          classNo:"",//		节次id	string	
          classNoName:"",//		节次名称	string	
          createName:"",//		创建人名称	string	
          createTime:"",//		创建时间	string	
          createType:"",//		创建用户类型 1个人创建 2教务处创建	number	
          createUserId:"",//		创建人id	number	
          examineUserId:"",//		审批人id	number	
          examineUserName:"",//		审批人名字	string	
          gradeId:"",//		年级id	number	
          gradeName:"",//		年级名称	string	
          id:"",//		id	number	
          isDelete:"",//		是否删除 1未删除 2已删除	number	
          level:"",//		公开课级别 市1 区2 校3 组4	number	
          levelName:"",//		级别名称 市级 区级 校级 组级	string	
          listenDate:"",//		听课日期	string	
          listenWeek:"",//		听课日期对应的星期	string	
          modality:"",//		形式	string	2025-03-07
          participant:"",//		参加对象	string	2025-03-07
          place:"",//		听课地点	string	
          publishTime:"",//		发布时间	string	
          schoolId:"",//		学校id	number	
          schoolTimeId:"",//		学期id	number	
          schoolTimeName:"",//		学期名	string	
          state:"",//		1 草稿 2待审核 3 驳回 4 已发布	number	
          subjectId:"",//		课程id	number	
          subjectName:"",//		课程名称	string	
          supervisoryLeader:"",//		督查领导	string	2025-03-07
          teacherJson:"",//		上课老师json	string	
          weekNo:"",//		周的序号 第四周 存4	number	
          rejectList: []
        }
      }
    },
    created() {
      this.isApprovalInfo = !!this.$route.query.isApproval;
      this.registerDetail();
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
      showCheckDialog(state) {
        this.state = state;
        this.dialogFormVisible = true;
      },
      hideVisible() {
        this.dialogFormVisible = false;
      },
      addCheckInfo() {
        if (this.state === 3 && !this.checkInfoText) {
          this.$message({
            message: '请输入审核意见！',
            type: 'warning'
          });
          return;
        }
        let query = {
          registerId: this.openClassId,
          remark: this.checkInfoText,
          state: this.state,
        };
        this.examineRegister(query);
      },
      registerDetail() {
        registerDetail(this.openClassId).then(res => res.data).then(data => {
          if (data.code === 200) {
            this.openClassInfo = data.data;
          }
        });
      },
      examineRegister(query) {
        examineRegister(query).then(res => res.data).then(data => {
          this.dialogFormVisible = false;
          if (data.code === 200) {
            this.$message({
              message: '审批成功',
              type: 'success'
            });
            this.$router.back();
          } else {
            this.$message({
              message: data.msg,
              type: 'danger'
            });
          }
        });
      }
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
        /*width: 820px;*/
        /*margin: 0 auto;*/
        padding: 0 20px;
        color: #333;

        .qr_img {
          width: 200px;
          height: 200px;
        }

        .header_top_title{
          height: 18px;
          line-height: 18px;
          padding-left: 6px;
          border-left: 4px solid #409eff;
        }

        .check_msg_list{
          padding: 10px;
          color: #555;
          .reject_text{
            margin-top: 8px;
            color: #888;
          }
        }
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
