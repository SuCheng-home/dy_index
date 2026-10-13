<template>
  <div class="leave_board_wrap">
    <div class="leave_board_box" :style="`height: ${boxH - 30}px;`">
      <div class="leave_board_item leave_board_bg">
        <div class="board_top_title">
          <i class="el-icon-user-solid"></i>
          <span>待接离学生</span>
        </div>
        <div class="stay_stu_list clearfix" v-if="stayLeaveList.length">
          <div class="stu_item" :key="index" v-for="(item, index) in stayLeaveList">
            <img :src="item.avatar" alt="" class="avatar_box">
            <div class="stu_name">{{item.studentName}}</div>
            <div class="stu_name">{{item.className}}</div>
          </div>
        </div>
        <div class="no_stu_msg" v-else>
          <img src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png" alt="">
          <div>暂无待接离学生</div>
        </div>
      </div>
      <div class="leave_board_item mid_board_item">
        <div class="board_top_title">
          <i class="el-icon-user-solid"></i>
          <span>申请接离学生</span>
        </div>
        <div class="apply_stu_list" v-if="applyLeaveList.length">
          <div class="stu_item_line stu_item_line_header">
            <div class="avatar_box">&nbsp;&nbsp;</div>
            <div class="stu_name">姓名</div>
            <div class="stu_name">班级</div>
            <div class="stu_name">操作</div>
          </div>
          <div class="stu_item_line" :key="index" v-for="(item, index) in applyLeaveList">
            <div class="avatar_box">
              <img :src="item.avatar" alt="">
            </div>
            <div class="stu_name">{{item.studentName}}</div>
            <div class="stu_name">{{item.className}}</div>
            <div class="stu_name">
              <el-button type="primary" size="mini" @click.native="toLeaveStu(item.id, item.studentName)">放行</el-button>
            </div>
          </div>
        </div>
        <div class="no_stu_msg" v-else>
          <img src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png" alt="">
          <div>暂无申请接离学生</div>
        </div>
      </div>
      <div class="leave_board_item">
        <div class="board_top_title">
          <i class="el-icon-user-solid"></i>
          <span>已接离学生</span>
        </div>
        <div class="apply_stu_list" v-if="hasLeaveList.length">
          <div class="stu_item_line stu_item_line_header">
            <div class="avatar_box">&nbsp;&nbsp;</div>
            <div class="stu_name">姓名</div>
            <div class="stu_name">班级</div>
            <div class="stu_name">放行时间</div>
          </div>
          <div class="stu_item_line" :key="index" v-for="(item, index) in hasLeaveList">
            <div class="avatar_box">
              <img :src="item.avatar" alt="">
            </div>
            <div class="stu_name">{{item.studentName}}</div>
            <div class="stu_name">{{item.className}}</div>
            <div class="stu_name">{{item.releaseTime | leaveTimeFilter}}</div>
          </div>
        </div>
        <div class="no_stu_msg" v-else>
          <img src="https://cdnfile-10043692.file.myqcloud.com/class_brand/gridClasscard/nodata/elastic-nodata2.png" alt="">
          <div>暂无已接离学生</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import mixins from '@/mixins/windowResize';
  import {getStuAskleaveThreeList, updateStuAskleaveThree} from '@/api/studentLeave';

  export default {
    name: "studentLeaveSchoolBoard",
    data() {
      return {
        stayLeaveList: [],
        applyLeaveList: [],
        hasLeaveList: []
      }
    },
    mixins: [mixins],
    filters: {
      leaveTimeFilter(time) {
        if (time) {
          return time.substring(11, 19);
        }
        return '--'
      }
    },
    created() {
      if (!!this.$route.query.userToken) {
        this.$router.push({path: 'schoolBoard'});
      }
      this.initStuTree();
    },
    mounted() {
      setInterval(() => {
        this.initStuTree();
      }, 600000);
    },
    methods: {
      initStuTree() {
        // 待接离
        this.getStuAskLeaveThreeList(2);
        // 申请接离
        this.getStuAskLeaveThreeList(4);
        // 放行 已接离
        this.getStuAskLeaveThreeList(5);
      },
      // 获取数据列表
      getStuAskLeaveThreeList(leaveState) {
        let startDate = this.$moment(new Date()).format('YYYY-MM-DD');
        if (leaveState === 2 || leaveState === 4) {
          startDate = this.$moment(this.$moment().subtract(100, 'days')).format('YYYY-MM-DD');
        }
        getStuAskleaveThreeList({
          startDate: startDate,
          endDate: this.$moment(new Date()).format('YYYY-MM-DD'),
          leaveState: leaveState
        }).then(res => res.data).then(data => {
          if (data.code === 200) {
            if (leaveState === 2) {
              this.stayLeaveList = data.data;
            } else if (leaveState === 4) {
              this.applyLeaveList = data.data;
            } else if (leaveState === 5) {
              this.hasLeaveList = data.data;
            }
          } else {
            this.$message({
              type: 'error',
              message: data.msg
            });
          }
        }).catch(() => {
        })
      },
      toLeaveStu(leaveId, studentName) {
        this.$confirm('是否确认放行' + studentName + '？', '放行', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          updateStuAskleaveThree({
            id: leaveId,
            leaveState: 5,
            leaveStateName: '放行'
          }).then(res => res.data).then(data => {
            if (data.code === 200) {
              this.$message({
                type: 'success',
                message:'放行成功！'
              });
              this.initStuTree();
            } else {
              this.$message({
                type: 'error',
                message: data.msg
              });
            }
          }).catch(() => {
          })
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "./../../styles/style";

  .leave_board_wrap {
    .leave_board_box {
      display: flex;

      .leave_board_item {
        flex: 1;
        overflow-x: hidden;
        overflow-y: auto;

        .board_top_title {
          height: 50px;
          line-height: 50px;
          padding-left: 20px;
          font-size: 22px;
          color: #54A2ED;

          i {
          }

          span {
            margin-left: 10px;
          }
        }

        .stay_stu_list{
          padding: 10px;
          box-sizing: border-box;

          .stu_item{
            float: left;
            margin: 10px 20px;
            text-align: center;
            font-size: 14px;
            color: #333;
            overflow: hidden;
            .avatar_box{
              display: block;
              width: 56px;
              height: 56px;
              margin: 0 auto 10px;
              border-radius: 50%;
            }
            .stu_name{
              height: 20px;
              line-height: 20px;
              overflow: hidden;
            }
          }
        }

        .apply_stu_list{
          padding: 10px 20px;
          .stu_item_line{
            display: flex;
            text-align: center;
            margin-bottom: 10px;
            font-size: 14px;
            color: #333;
            .avatar_box{
              width: 80px;
              img{
                display: block;
                width: 40px;
                height: 40px;
                margin: 0 auto;
                border-radius: 50%;
              }
            }
            .stu_name{
              flex: 1;
              height: 40px;
              line-height: 40px;
              overflow: hidden;
            }
          }
          .stu_item_line_header{
            font-weight: bold;
            margin-bottom: 0;
          }
        }

        .no_stu_msg{
          text-align: center;
          font-size: 15px;
          color: #999;
          img{
            display: block;
            margin: 30px auto 0;
          }
          div{
            height: 20px;
            line-height: 20px;
            margin-top: -40px;
          }
        }
      }

      .leave_board_bg{
        background: url("https://cdnfile-10043692.file.myqcloud.com/admin/images/others/board_left_bg.png") left bottom no-repeat;
        background-size: 320px 320px;
      }

      .mid_board_item {
        border-right: 3px solid #ECF0FB;
        border-left: 3px solid #ECF0FB;
      }
    }
  }
</style>
