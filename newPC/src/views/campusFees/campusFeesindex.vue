<template>
    <div class="campusFeesindex">
        <!-- <el-tabs type="border-card"  v-model="activeName" @tab-click="funindex()">
            <el-tab-pane label="学生收费" name="one"> -->
                <div class="top">
                <el-col :span="19">
                    <div class="top-button"><el-button type="primary" size="medium" @click="campusFeesadds()" v-if="isShowByPermission('/chargeNotice/saveChargeNotice')">新建</el-button></div>
                </el-col>
                <el-col :span="5">
                    <el-input placeholder="收费名称" size="medium" v-model.trim="query.searchVal" @change="handleInputChange">
                         <el-button slot="append" icon="el-icon-search" @click="handleInputChange"></el-button>
                    </el-input>
                </el-col>
          </div>
         <div class="time-table">
            <el-table stripe  :data="dateList" border fit highlight-current-row  style="width: 100%" :height="maxH">
                <el-table-column  label="收费名称" show-overflow-tooltip >
                    <template slot-scope="scope">
                        <el-button @click.native.prevent="campusFeesdetails(scope.row.id,scope.row.status)"  type="text" size="small">{{scope.row.chargeName}}</el-button>
                        <!-- <span v-if="scope.row.status!=4">{{scope.row.chargeName}}</span> -->
                    </template>
                </el-table-column>
                <el-table-column align="center" label="收费类型" width="120px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.typeName"> <el-tag  size="mini" type="success">{{scope.row.typeName}}</el-tag></span>
                        <span  v-else>--</span>

                    </template>
                </el-table-column>
                 <el-table-column align="center" label="金额（元）" width="100px">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.payUserType==0"> {{scope.row.money}}</span>
                        <span  v-if="scope.row.payUserType==1">自定义</span>
                        <span  v-if="scope.row.payUserType==2">业务联动</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="截止日期" width="100px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.deadlineTime">{{scope.row.deadlineTime}}</span>
                        <span  v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column  label="缴费人群" show-overflow-tooltip >
                    <template slot-scope="scope">
                        <span v-if="scope.row.payUserType==0">{{scope.row.payDepartNames}}</span>
                        <span  v-if="scope.row.payUserType==1">自定义</span>
                        <span  v-if="scope.row.payUserType==2">业务联动</span>
                    </template>
                </el-table-column>
                 <el-table-column  label="创建人">
                    <template slot-scope="scope">
                        <span v-if="scope.row.createUserName">{{scope.row.createUserName}}</span>
                        <span  v-else>--</span>
                    </template>
                </el-table-column>
                <el-table-column  label="发布时间" width="160px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.examineTime">{{scope.row.examineTime}}</span>
                        <span  v-else>--</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="审核人" width="100">
                    <template slot-scope="scope">
                       {{scope.row.examineUserName}}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态" width="100">
                    <template slot-scope="scope">
                        <el-tag  size="mini" type="info" v-if="scope.row.status==1">草稿</el-tag>
                        <el-tag  size="mini" type="warning"  v-if="scope.row.status==2">待审核</el-tag>
                        <el-tag  size="mini" type="danger"  v-if="scope.row.status==3">被驳回</el-tag>
                        <el-tag  size="mini" type="success"  v-if="scope.row.status==4">已审核</el-tag>
                        <el-tag  size="mini" type="danger"  v-if="scope.row.status==5">已撤回</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160">
                   <template slot-scope="scope">
                        <el-button v-if="scope.row.status==2" @click.native.prevent="updateWithdraws(scope.row.id)"  type="text" size="small">撤回</el-button>
                         <el-button v-if="scope.row.status==3" @click.native.prevent="campusFeesRejects(scope.row.id)"  type="text" size="small">驳回历史</el-button>
                         <el-button v-if="scope.row.status==1||scope.row.status==3||scope.row.status==5" @click.native.prevent="deleteChargeNotices(scope.row.id)"   type="text" size="small" class="buttontextred">删除</el-button>
                         <el-button v-if="scope.row.status==1||scope.row.status==3||scope.row.status==5" @click.native.prevent="campusFeesedit(scope.row.id)"  type="text" size="small">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
         <div  class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                           :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]"
                           :page-size="query.pageSize" layout="total, sizes, prev, pager, next, jumper"
                           :total="total">
            </el-pagination>
        </div>
            <!-- </el-tab-pane>
            <el-tab-pane label="老师收费" name="two"></el-tab-pane>
       </el-tabs>  -->
    </div>
</template>
<script>
import {queryChargeNoticeList,deleteChargeNotice,updateWithdraw} from '@/api/campusFees';
import { isShowByPermission } from "@/utils";
import _ from 'lodash';
import mixin from '@/mixins/windowResize';
export default {
  name: "campusFeesindex",
  data: function() {
    return {
      dateList: [],//表格主题数据
      total:null,
      query: {
        pageNo: 1, //页数
        pageSize:20,//条数
        searchVal:'',
        chargeType:1
      },
      activeName:'one'

    };
  },

   mixins: [mixin],
     activated() {
            this.queryChargeNoticeLists();
        },
  created() {
    this.queryChargeNoticeLists()
  },
  methods: {
       //权限
    isShowByPermission,
      handleInputChange () {
                    this.queryChargeNoticeLists();
                },
    queryChargeNoticeLists() {
        queryChargeNoticeList(this.query).then(res => {
        let data = res.data.data;
        this.dateList=data.dataList;
        this.total = data.pagination.total;
      });
    },

    handleSizeChange(val) {
                this.query.pageSize = val;
                this.queryChargeNoticeLists();
            },
    handleCurrentChange(val) {
                this.query.pageNo = val;
                this.queryChargeNoticeLists();
    },
     updateWithdraws(id){
         this.$confirm('此操作将永久撤回此收费, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateWithdraw(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '撤回成功!'
                        });
                        this.queryChargeNoticeLists();
                    }).catch();

                }).catch(() => {
                });
    },
    //删除
    deleteChargeNotices(id){
         this.$confirm('此操作将永久删除此收费, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteChargeNotice(id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.queryChargeNoticeLists();
                    }).catch();

                }).catch(() => {
                });
    },
    //详情
    campusFeesdetails(id,num){
           this.$router.push({
            path: "campusFeesdetails",
            query: {id: id,num:num}
          });
    },
    //驳回历史
    campusFeesRejects(id){
           this.$router.push({
            path: "campusFeesReject",
            query: {id: id}
          });
    },
    //新建
    campusFeesadds(){
          this.$router.push({
            path: "campusFeesadd",
            query: {}
          });
    },
    //老师收费
    funindex(){     
      if(this.activeName=='two'){
           this.$router.push({
            path: "thcampusFeesindex",
            query: {}
          });
      };
    
    },
    //编辑
     campusFeesedit(id){
           this.$router.push({
            path: "campusFeesedit",
            query: {id: id}
          });
    },

  }
};
</script>
<style scoped>
.campusFeesindex {
  padding:12px;
}
.campusFeesindex .top{
       padding-bottom: 10px;
    overflow: hidden;
}
</style>
