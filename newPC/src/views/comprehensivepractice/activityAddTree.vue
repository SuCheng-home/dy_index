<template>
  <div class="homeVisitadd" v-loading="loading">
    <div class="header">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
      <el-button type="warning" size="medium" @click="saveSend(1)" v-if="applyState!=2">保存草稿</el-button>
      <el-button type="primary" size="medium" @click="saveSend(2)">{{createType===2 ? '保存并提交' : '保存并发布'}}</el-button>
    </div>
    <div class="body ">
      <el-steps :active="2" finish-status="success" process-status="finish" class="step_head_box">
        <el-step title="活动基本信息"></el-step>
        <el-step title="评价项设置"></el-step>
        <el-step title="活动分组设置"></el-step>
      </el-steps>
      <div style="padding-bottom: 10px;">
        <el-button type="primary" size="medium" @click="groupingsettingsadd()">添加分组</el-button>
      </div>
      <el-table ref="table" stripe :data="dataList" border fit highlight-current-row
                style="width: 100%" :height="nobottommaxH -100 ">
        <el-table-column align="center" label="分组名称" show-overflow-tooltip>
          <template slot-scope="scope">
                    <span>
                        {{scope.row.groupName}}
                    </span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="学生" show-overflow-tooltip>
          <template slot-scope="scope">
            {{funname(scope.row.groupStuList)}}
            <!-- <range-list :userJson="JSON.parse(scope.row.studentsJson).userJson" :departJson="JSON.parse(scope.row.studentsJson).departJson"></range-list> -->
          </template>
        </el-table-column>
        <el-table-column align="center" label="排序">
          <template slot-scope="scope">
            <span>{{scope.row.orderNo}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button size="small" type="text" @click="groupingsettingseidt(scope.row.id)">编辑</el-button>
            <el-button size="small" type="text" @click="delActivityGroupByGroupIds(scope.row.id)" class="buttontextred">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
  import mixin from "@/mixins/windowResize";
  import RangeList from "@/components/RangeList/RangeList";
  import {delActivityGroupByGroupId, getActivityGroupListByActivityId, publishPracticeActivityById, submitPracticeActivityToApprove} from "@/api/comprehensivepractice";

  export default {
    name: 'activityAddTree',
    data() {
      return {
        createType: 1,
        applyState: this.$route.query.applyState,
        dataList: []
      };
    },
    components: {RangeList},
    mixins: [mixin],
    created() {
      if (this.$route.query.createType == '2') {
        this.createType = 2;
      }
      this.getActivityGroupListByActivityIds();
    },
    methods: {
      funname(list) {
        let name = "";
        for (let i = 0; i < list.length; i++) {
          name = name + " " + list[i].stuName + " "
        }
        return name;
      },
      getActivityGroupListByActivityIds() {
        getActivityGroupListByActivityId(this.$route.query.id).then(res => res.data).then(data => {
          this.dataList = data.data;
        })
      },
      delActivityGroupByGroupIds(id) {
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delActivityGroupByGroupId(id).then(res => res.data).then(data => {
            if (data.code === 200) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getActivityGroupListByActivityIds()
            }
          })

        }).catch(() => {
        });
      },
      groupingsettingseidt(id) {
        this.$router.push({
          path: "groupingsettingseidt",
          query: {id: id, activityId: this.$route.query.id}
        })
      },
      groupingsettingsadd() {
        this.$router.push({
          path: "groupingsettingsadd",
          query: {activityId: this.$route.query.id}
        })
      },
      saveSend(state) {
        if (state===2) {
          if (this.createType===1) {
            // 发布
            publishPracticeActivityById(this.$route.query.id).then(res => res.data).then(data => {
              if (data.result) {
                this.$message({
                  message: "发布成功！",
                  type: "success"
                });
                this.$router.back();
              }else{
                this.$message({
                  message: data.msg,
                  type: 'warning'
                });
                this.$router.back();
              }
            })
          } else if (this.applyState==2) {
            // 发布
            this.$message({
              message: "操作成功！",
              type: "success"
            });
            this.$router.back();
          } else {
            // 提交
            submitPracticeActivityToApprove({id: this.$route.query.id}).then(res => res.data).then(data => {
              if (data.result) {
                this.$message({
                  message: "提交成功！",
                  type: "success"
                });
                this.$router.back();
              }else{
                this.$message({
                  message: data.msg,
                  type: 'warning'
                });
                this.$router.back();
              }
            })
          }

        } else {
          this.$router.back();
        }
      }
    }
  };
</script>
<style lang="scss" scoped>
  .homeVisitadd {
    padding: 12px;

    .header {
      padding-bottom: 10px;
    }

    .step_head_box{
      width: 600px;
      margin: 0 auto 20px;
    }
    .range-list {
      padding: 3px;
    }

  }
</style>
