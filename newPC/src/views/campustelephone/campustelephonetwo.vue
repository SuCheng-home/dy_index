<template>
    <div class="campustelephonethree">
        <div class="top">
             <el-button type="primary" size="medium" @click="campustelephoneadd()">新增</el-button>
             <el-button type="primary" size="medium" @click="controlCommand('restart','重启')">重启</el-button>
             <el-button type="primary" size="medium" @click="controlCommand('off','关机')">关机</el-button>
             <el-button type="primary" size="medium" @click="controlCommand('clearCache','清除缓存')">清除缓存</el-button>
             <el-button type="primary" size="medium" @click="controlCommand('sendUserFaceAll','下发人脸')">下发人脸</el-button>
              <el-input class="search-input" style="width:20%;float: right;"  placeholder="请输入设备名称" icon="search" size="medium" @change="getVisitorListdun()"
                          v-model.trim="pagination.keywords">
                    <el-button slot="append" icon="el-icon-search" @click="getVisitorListfun()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH" @select="handleSelectionChange" @select-all="handleSelectionChange">
                  <el-table-column type="selection" align="center" width="65px"  :resizable="false"></el-table-column>
                <el-table-column align="center" label="设备名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="设备类型标识" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.mark}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="设备MAC" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.mac}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="APK版本" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.apkVersion}}</span>
                    </template>
                </el-table-column>  
                <el-table-column align="center" label="人脸数" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.faceCount}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="状态" show-overflow-tooltip>
                         <template slot-scope="scope">
                        <el-tag  size="mini" type="danger"  v-if="scope.row.status==0">离线</el-tag>
                        <el-tag  size="mini" type="success"  v-if="scope.row.status==1">在线</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="创建时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.createTime?scope.row.createTime.substring(0, 19):"----"}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="160">
                   <template slot-scope="scope">
                        <el-button  @click.native.prevent="delTelephoneDevices(scope.row.id)"  type="text" size="small"  class="buttontextred">删除</el-button>
                        <el-button  @click.native.prevent="campustelephoneeidt(scope.row.id)"  type="text" size="small">编辑</el-button>
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
import {getTelephoneDevicesForPage,controlCommand,delTelephoneDevices} from "@/api/campustelephone";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      dataList: [],
      exportUrl: "",
      pagination: {
        pageNo: 1,
        pageSize: 20,
        total: null,
        keywords: ""
      },
      selected: [],
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    this.getVisitorListfun();
  },
  methods: {
    campustelephoneadd(){
        this.$router.push({
            path: "campustelephoneadd",
            query: {}
          });
    },
    campustelephoneeidt(id){
           this.$router.push({
            path: "campustelephoneeidt",
            query: {id: id}
          });
    },
       controlCommand(type,name) {
                if(this.selected.length==0){
                    this.$message({
                    message: "请勾选要"+name+"操作的设备",
                    type: "error"
                    });
                  return;
                }
                let list=[];
                  this.selected.forEach(item => {
                            list.push(item.id);
                        });
                this.$confirm('是否'+name+'设备?', name+'设备', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    controlCommand({devicesIds:list,commandCode:type}).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '设备'+name+'成功!' });
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
      getTelephoneDevicesForPage(this.pagination)
        .then(res => res.data)
        .then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    delTelephoneDevices(id){
       this.$confirm('是否删除?', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delTelephoneDevices(id).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '删除成功!' });
                                  this.getVisitorListfun();
                           }
                        })
                });
    }
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
