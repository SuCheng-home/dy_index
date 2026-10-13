<template>
<div class="tiedCard"  >
     <div class="top"> 
          <el-col :span="19">
              <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
          </el-col>
         <el-col :span="5">
            <el-input placeholder="请输入卡号" size="medium" v-model.trim="sid" @change="getAllCardBySids()">
                <el-button slot="append" icon="el-icon-search" @click="getAllCardBySids()"></el-button>
            </el-input>
        </el-col>   
      </div>
      <el-table stripe  :data="datalist" border fit highlight-current-row  style="width: 100%" :height="nobottommaxH">                
                <el-table-column  label="卡号" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        {{scope.row.sid}}
                    </template>
                </el-table-column>
                <el-table-column  label="所属学校" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        {{scope.row.schoolName}}                        
                    </template>
                </el-table-column>
                <el-table-column  label="姓名" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        <!-- <span v-if="scope.row.cardType==1">{{scope.row.studentName}}</span> -->
                        <!-- <span v-if="scope.row.cardType==2">{{scope.row.teacherName}}</span>                         -->
                     {{scope.row.userName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户类型" >
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="warning"  v-if="scope.row.cardType==2">老师卡</el-tag>
                        <el-tag  size="mini" type="success"  v-if="scope.row.cardType==1">学生卡</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="部门/班级" show-overflow-tooltip  align="center">
                    <template slot-scope="scope">
                        {{scope.row.classDepartName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="卡片状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="danger"   v-if="scope.row.isDelete==0">已删除</el-tag>
                        <el-tag  size="mini" type="success"  v-if="scope.row.isDelete==1">已绑卡</el-tag>
                    </template>
                </el-table-column>
                <el-table-column  label="更新时间" show-overflow-tooltip align="center">
                    <template slot-scope="scope">
                        {{scope.row.updateTime}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                   <template slot-scope="scope">
                          <el-button :disabled="scope.row.isDelete==0" @click.native.prevent="resetCards(scope.row.sid)"  type="text" size="small">重置卡片</el-button>
                    </template>
                </el-table-column>
            </el-table>
     
</div> 
</template>
<script>
import { resetCard, getAllCardBySid } from "@/api/campusCrd";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      datalist: [],
      sid: ""
    };
  },
  mixins: [mixin],
  methods: {
    //获取详情
    getAllCardBySids() {
      this.datalist = [];
      if (this.sid) {
        getAllCardBySid(this.sid)
          .then(res => res.data)
          .then(data => {
            this.datalist = data.data;
            for (let i = 0; i < this.datalist.length; i++) {
              if (this.datalist[i].updateTime) {
                this.datalist[i].updateTime = this.funtime(
                  this.datalist[i].updateTime
                ); //时间
              } else {
                this.datalist[i].updateTime = this.funtime(
                  this.datalist[i].createTime
                ); //时间
              }
            }
          });
      }
    },
    funtime(value) {
      let date = new Date(value);
      return this.$moment(date).format('YYYY-MM-DD HH:MM:SS')
    },
    //重置
    resetCards(sid) {
      this.$confirm("确认要重置卡片吗？", "重置卡片", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          resetCard(sid).then(res => {
            if (res.data.code === 200) {
              this.$message.success("重置成功");
              this.getAllCardBySids();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.tiedCard {
  padding:12px;
  .top {
    padding-bottom: 10px;
    overflow: hidden;
  }
}
</style>