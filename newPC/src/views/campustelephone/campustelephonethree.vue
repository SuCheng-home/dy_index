<template>
    <div class="campustelephonethree">
        <div class="top">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="getVisitorListfun()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
            <el-button type="danger" size="medium" @click="delTelephoneDevicesCommandRecord(1)">删除</el-button>
            <sapn>仅保留三个月内数据</sapn>
            <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入设备名称" icon="search" size="medium" @change="getVisitorListdun()"
                          v-model.trim="pagination.keywords">
                    <el-button slot="append" icon="el-icon-search" @click="getVisitorListfun()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH" @select="handleSelectionChange" @select-all="handleSelectionChange">
                  <el-table-column type="selection" align="center" width="65px" :selectable="selectedfun" :resizable="false"></el-table-column>
                <el-table-column align="center" label="设备名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.devicesName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="设备Key" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.devicesKey}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="指令" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.commandDescribe}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="执行状态" show-overflow-tooltip>
                         <template slot-scope="scope">
                        <el-tag  size="mini" type="gray" v-if="scope.row.status==0">未下发</el-tag>
                        <el-tag  size="mini" type="warning"  v-if="scope.row.status==1">处理中</el-tag>
                        <el-tag  size="mini" type="danger"  v-if="scope.row.status==3">失败</el-tag>
                        <el-tag  size="mini" type="success"  v-if="scope.row.status==2">成功</el-tag>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="反馈信息" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.message}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="执行时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime?scope.row.createTime.substring(0, 19):"----"}}</span>
                    </template>
                </el-table-column> 
                 <el-table-column align="center" label="操作" width="160">
                   <template slot-scope="scope">
                        <el-button :disabled="scope.row.status<2" @click.native.prevent="delTelephoneDevicesCommandRecord(2,scope.row.id)"  type="text" size="small"  class="buttontextred">删除</el-button>
                   </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getVisitorListfun" @current-change="getVisitorListfun"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import {getTelephoneDevicesCommandRecordForPage,delTelephoneDevicesCommandRecord} from "@/api/campustelephone";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      daterange: [new Date(), new Date()],
      dataList: [],
      exportUrl: "",
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        keywords: "",
        startDate: "",
        endDate: "",
      },
      selected: [],
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.getVisitorListfun();
  },
  methods: {
       delTelephoneDevicesCommandRecord(num,id) {
                if(this.selected.length==0&&num==1){
                    this.$message({
                    message: "请勾选要删除的密令返回",
                    type: "error"
                    });
                  return;
                }
                let list=[];
                if(num==1){
                     this.selected.forEach(item => {
                            list.push(item.id);
                        });

                }else{
                    list=[id]
                }
                this.$confirm('是否删除密令返回?', '删除密令返回', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delTelephoneDevicesCommandRecord(list).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '删除密令返回成功!' });
                                  this.getVisitorListfun();
                                   if(num==1){
                                    this.selected=[]
                                }
                           }
                        })
                });
            },
              handleSelectionChange(val) {
                this.selected = val;
            },
        selectedfun(row, index) {
            if (row.status ==3|| row.status==2) { // 根据你的条件来设置
                return true //可选择
            } else {
                return false; //不可选择
            }
            },
    getVisitorListfun() {
      this.pagination.startDate = moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      );
      this.pagination.endDate = moment(this.daterange[1]).format(
        "YYYY-MM-DD"
      );
      getTelephoneDevicesCommandRecordForPage(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
  }
};
</script>

<style lang="scss" scoped>
.campustelephonethree {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
  .img{
      height: 20px;
  }
}
</style>
