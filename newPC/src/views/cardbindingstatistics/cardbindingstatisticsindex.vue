<template>
<div class="recordsofconsumption"  >
     <div class="top"> 
         <el-select size="medium" v-model="pagination.utype" placeholder="请选择类型" @change="queryAccountUserLists()" style="width:120px">
                <el-option label="学生" :value="1"></el-option>
                <el-option label="老师" :value="2"></el-option>
            </el-select>
            <el-select size="medium" v-model="pagination.bind" placeholder="请选择类型" @change="queryAccountUserLists()" style="width:120px">
                <el-option label="已绑定" :value="1"></el-option>
                <el-option label="未绑定" :value="2"></el-option>
            </el-select>
           <el-select size="medium" v-if="pagination.utype==1" v-model="pagination.gradeId" placeholder="请选择年级" style="width:150px" @change="queryClassByGradeIds()">
                <el-option label="全部年级" :value="0"></el-option>
                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select size="medium"  v-if="pagination.utype==1&&pagination.gradeId!=0" v-model="pagination.classId" style="width:150px" placeholder="请选择班级" @change="queryAccountUserLists()">
                <el-option label="全部班级" :value="0"></el-option>
                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
              <a :href="exportUrl" download="导出" target="_blank"  v-if="dataList.length">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
            <el-button type="primary" size="medium" @click="updateRemindNonbind()">提醒未绑卡用户</el-button>   
            <el-input class="search-input" style="width:20%;    float: right;"  placeholder="老师或学生姓名" icon="search" size="medium" @keyup.enter.native="queryAccountUserLists()" v-model.trim="pagination.uname">
                <el-button slot="append" icon="el-icon-search" @click="queryAccountUserLists()"></el-button>
            </el-input>    
      </div>
      <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH"> 
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.uname}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="班级" v-if="pagination.utype==1" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="学号" v-if="pagination.utype==1" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.learnNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="卡号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.account?scope.row.account:"----"}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="持卡人" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.accountname?scope.row.accountname:"----"}}</span>
                    </template>
                </el-table-column>
              
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="queryAccountUserLists" @current-change="queryAccountUserLists"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>   
</div> 
</template>
<script>
import {querySchoolGrade,queryClassByGradeId} from "@/api/recordsofconsumption";
import {queryAccountUserList,updateRemindNonbind} from '@/api/generationrefund';
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
           gradeList: [],          
           classList: [],
           dataList:[],
           exportUrl:"",
           pagination: {
                pageNo: 1,
                pageSize: 20,
                total: null,
                uname: "",
                utype:1,
                gradeId: 0,
                classId: 0,
                bind:1
            }
    };
  },
  mixins: [mixin],
  created() {
        querySchoolGrade().then(res => res.data).then(data => {
                this.gradeList = data.data;
                if (data.data.length !== 0) {
                    this.queryClassByGradeIds();
                }
            });
  },
  methods: {
       updateRemindNonbind() {
                this.$confirm('是否提醒未绑卡用户', '提醒', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    updateRemindNonbind(this.pagination.utype).then(res => res.data).then(data => {
                            if(data.result) {
                                  this.$message({type: 'success', message: '提醒成功!' });
                           }
                        })
                });
            },
       //获取班级
            queryClassByGradeIds() {
                this.classList=[];
                this.classId=0;
                if(this.pagination.gradeId!=0){
                     queryClassByGradeId(this.pagination.gradeId).then(res => res.data).then(data => {
                    this.classList = data.data;
                    if (data.data.length !== 0) {
                        this.classId = data.data[0].id;
                        this.queryAccountUserLists();
                    }
                });

                }else{
                    this.queryAccountUserLists();
                }
               
            },
             queryAccountUserLists() {
                  this.exportUrl = `${global.newcharge}abcpay/payAccount/exportAccountUser?token=${this.$store.getters.token}&utype=${this.pagination.utype}&bind=${this.pagination.bind==1}&classId=${this.pagination.classId!=0?this.pagination.classId:''}&gradeId=${this.pagination.gradeId!=0?this.pagination.gradeId:''}&uname=${this.pagination.uname}`;
                queryAccountUserList(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data.dataList;
                        this.pagination.total = data.data.pagination.total;
                    })
            },
     
  }
};
</script>
<style lang="scss" scoped>
.recordsofconsumption {
  padding:12px;
  *{
      box-sizing:border-box;
  }
  .top {
    padding-bottom: 10px;
  }
}
</style>