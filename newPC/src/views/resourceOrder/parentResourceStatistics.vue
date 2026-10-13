<template>
    <div class="campustelephonethree">
        <div class="top">
            <el-date-picker v-model="daterange" size="medium" type="daterange" class="mywidthdaterange" range-separator="-" start-placeholder="开始日期" @change="getParentResourceRecordList()" end-placeholder="结束日期" :clearable="false"  ></el-date-picker>
              <el-select class="resource-select" size="medium" @change="getParentResourceRecordList" v-model="pagination.resourceId" placeholder="请选择资源">
                        <el-option
                            label="全部资源"
                            :value="0">
                        </el-option>
                        <el-option
                            v-for="( typeEntry, index ) in typeList"
                            :key="index"
                            :label="typeEntry.name"
                            :value="typeEntry.id">
                        </el-option>
                    </el-select>
                    <el-select class="resource-select" size="medium" @change="getParentResourceRecordList" v-model="pagination.state" placeholder="请选择">
                        <el-option
                            label="全部状态"
                            :value="0">
                        </el-option>
                         <el-option
                            label="未审批"
                            :value="1">
                        </el-option>
                         <el-option
                            label="已同意"
                            :value="2">
                        </el-option>
                         <el-option
                            label="已过期"
                            :value="3">
                        </el-option>
                    </el-select>
            <el-button type="primary" size="medium" @click="updateParentResourceRecordList(1)">批量同意</el-button>
             <a :href="exportUrl" target="_blank" download="examName" v-if="dataList.length">
                    <el-button type="primary" size="medium">导出</el-button>
                </a>
            <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入预约人" icon="search" size="medium" @change="getParentResourceRecordList()"
                          v-model.trim="pagination.createUserName">
                    <el-button slot="append" icon="el-icon-search" @click="getParentResourceRecordList()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH" @select="handleSelectionChange" @select-all="handleSelectionChange">
                  <el-table-column type="selection" align="center" width="65px" :selectable="selectedfun" :resizable="false"></el-table-column>
                <el-table-column align="center" label="预约人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="预约资源" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.resourceName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="预约时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.applyDate}}&nbsp;{{$moment(scope.row.startTime).format("HH:mm")}}~{{$moment(scope.row.endTime).format("HH:mm")}}</span>
                    </template>
                </el-table-column>
                  <el-table-column align="center" label="预约事由" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.applyReason}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="预约状态" show-overflow-tooltip>
                         <template slot-scope="scope">                       
                        <span v-if="scope.row.state==2">
                             <el-tag  size="mini" type="success">已同意</el-tag>
                        </span>
                        <span v-else>
                               <el-tag  size="mini" type="warning"  v-if="$moment().format('YYYY-MM-DD')<scope.row.applyDate||$moment().format('YYYY-MM-DD')==scope.row.applyDate">未审批</el-tag>
                               <el-tag  size="mini" type="danger"  v-else>已过期</el-tag>
                        </span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="审核人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.batchUserName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="160">
                   <template slot-scope="scope">
                        <el-button v-if="scope.row.state==1&&($moment().format('YYYY-MM-DD')<scope.row.applyDate||$moment().format('YYYY-MM-DD')==scope.row.applyDate)"  @click.native.prevent="updateParentResourceRecordList(2,scope.row)"  type="text" size="small">同意</el-button>
                   </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getParentResourceRecordList" @current-change="getParentResourceRecordList"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>
    </div>
</template>
<script>
import moment from "moment";
import {getParentResourceRecordList,getParentResourceList,updateParentResourceRecordList,updateParentResourceRecord} from "@/api/resourceOrder";
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
        createUserName: "",
        startDate: "",
        endDate: "",
        searchtype:0,
        state:0,
        resourceId:0,
      },
      selected: [],
      typeList:[],
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.daterange[0] = new Date(moment().set("date", 1).valueOf());
    this.getParentResourceRecordList();
     getParentResourceList(0).then(res => res.data)
                    .then(data => {
                        if (data.data) {
                          this.typeList = data.data;
                        }
                    }).catch(() => {
                })
  },
  methods: {
       updateParentResourceRecordList(num,obj) {
                if(this.selected.length==0&&num==1){
                    this.$message({
                    message: "请勾选要审批的资源",
                    type: "error"
                    });
                  return;
                }
                let list=[];
                if(num==1){
                     this.selected.forEach(item => {
                            list.push({
                                      applyDate:item.applyDate,
                                        applyReason:item.applyReason,
                                        id:item.id,
                                        resourceId:item.resourceId,
                                        resourceName:item.resourceName,
                                        createUserId:item.createUserId,
                                        state:2,
                            });
                        });

                }else{
                    list=[{
                        applyDate:obj.applyDate,
                        applyReason:obj.applyReason,
                        id:obj.id,
                        resourceId:obj.resourceId,
                        resourceName:obj.resourceName,
                        createUserId:obj.createUserId,
                        state:2,
                    }]
                }
                this.$confirm('是否同意资源申请?', '资源申请', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateParentResourceRecordList(list).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '资源申请审批成功!' });
                                  this.getParentResourceRecordList();
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
            if (row.state==1&&(this.$moment().format('YYYY-MM-DD')<row.applyDate||this.$moment().format('YYYY-MM-DD')==row.applyDate)) { // 根据你的条件来设置
                return true //可选择
            } else {
                return false; //不可选择
            }
            },
    getParentResourceRecordList() {
      this.pagination.startDate = moment(this.daterange[0]).format(
        "YYYY-MM-DD"
      );
      this.pagination.endDate = moment(this.daterange[1]).format(
        "YYYY-MM-DD"
      );
      this.exportUrl=`${global.BasePath}structure/parentResource/exportParentResourceRecordList?startDate=${this.pagination.startDate}&endDate=${this.pagination.endDate}&createUserName=${this.pagination.createUserName}&resourceId=${this.pagination.resourceId}&searchtype=${this.pagination.searchtype}&state=${this.pagination.state}&token=${this.$store.getters.token}`
       
      getParentResourceRecordList(this.pagination)
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
