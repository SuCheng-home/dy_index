<template>
    <div class="homeVisitrecordlist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
             <el-select v-model="pagination.gradeId" style="width:180px"  size="medium" @change="gradelistfun()">
                <el-option    label="全部年级" :value="0"></el-option>
               <el-option   v-for="item in gradelist" :key="item.id"  :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="pagination.classId" style="width:180px" size="medium" @change="getBatchStuHomeVisitPageLists" v-if="pagination.gradeId">
                <el-option    label="全部班级" :value="0"></el-option>
               <el-option   v-for="item in classlist" :key="item.id"  :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="pagination.visitState"  style="width:180px" size="medium" @change="getBatchStuHomeVisitPageLists" >
                <el-option    label="全部家访状态" :value="0"></el-option>
                <el-option    label="未家访" :value="1"></el-option>
                <el-option    label="已家访" :value="2"></el-option>
            </el-select>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
            <el-button class="filter-item" type="primary" icon="upload" size="medium" @click="homeVisitViewdetails()">查看明细</el-button>
             <el-input class="search-input" style="width:20%;float: right;"
                          placeholder="学生姓名" icon="search" size="medium" @change="getBatchStuHomeVisitPageLists()"
                          v-model.trim="pagination.stuName">
                    <el-button slot="append" icon="el-icon-search" @click="getBatchStuHomeVisitPageLists()"></el-button>
            </el-input>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="maxH">            					           			
                <el-table-column align="center" label="学号" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.stuNum}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="姓名" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span class="link-type"  @click="homeVisitViewdetailsdetails(scope.row.stuId,scope.row.visitState)">{{scope.row.stuName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-tag  size="mini" v-if="scope.row.visitState==2">已家访</el-tag>
                        <el-tag  size="mini" type="danger"  v-else>未家访</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访老师" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.visitTeacher?scope.row.visitTeacher:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.visitType?scope.row.visitType:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.visitTime?scope.row.visitTime:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访地址" show-overflow-tooltip>
                    <template slot-scope="scope">
                       <span >{{scope.row.visitSite?scope.row.visitSite:'--'}}</span>
                    </template>
                </el-table-column>                
            </el-table>
            <div class="pagination-container">
                <el-pagination @size-change="getBatchStuHomeVisitPageLists" @current-change="getBatchStuHomeVisitPageLists"
                               :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                               :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                               :total="pagination.total">
                </el-pagination>
            </div>            
    </div>
</template>
<script>
    import moment from "moment";
    import {getBatchHomeVisitGradeClassList,getBatchStuHomeVisitPageList} from "@/api/homeVisit";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                dataList: [],
                exportUrl: '',
                pagination:{
                    pageNo:1,
                    pageSize:20,
                    total:null,
                    stuName:'',
                    batchId:this.$route.query.id,
                    classId:0,
                    gradeId:0,
                    receiptState:0,
                    visitState:0,
                    visitTypeId:0
                },
                gradelist:[],
                classlist:[],
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.getBatchStuHomeVisitPageLists();
            this.getBatchHomeVisitGradeClassLists();
        },
        methods: {
            homeVisitViewdetails(){
             this.$router.push({
                    path: "homeVisitViewdetails",
                    query: { id:this.$route.query.id }
                });
            },
            homeVisitViewdetailsdetails(stuId,num){
            
                if(num==2){
 this.$router.push({
                    path: "homeVisitViewdetailsdetails",
                    query: { id: this.$route.query.id,stuId:stuId}
                });
                }else{
                    this.$router.push({
                    path: "homeVisitViewdetailseidt",
                    query: { id: this.$route.query.id,stuId:stuId}
                });
                }
            },
            gradelistfun(){
                this.pagination.classId=0;
              if(this.pagination.gradeId==0){                  
                  this.classlist=[];
              }else{
                for(let i=0;i<this.gradelist.length;i++){
                    if(this.gradelist[i].id==this.pagination.gradeId){                        
                        this.classlist=this.gradelist[i].childList;
                    }
                }
              }
              this.getBatchStuHomeVisitPageLists();
            },
            getBatchHomeVisitGradeClassLists(){
                getBatchHomeVisitGradeClassList(this.$route.query.id)
                    .then(res => res.data)
                    .then(data => {
                        let mydata=data.data;
                        this.gradelist=mydata;
                    })
            },
            getBatchStuHomeVisitPageLists() {
                this.exportUrl = `${global.BasePath}structure/homevisit/exportHomeVisitListXls?batchId=${this.pagination.batchId}&classId=${this.pagination.classId}&gradeId=${this.pagination.gradeId}&receiptState=${this.pagination.receiptState}&stuName=${this.pagination.stuName}&addType=1&visitState=${this.pagination.visitState}&token=${this.$store.getters.token}`;
                getBatchStuHomeVisitPageList(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            }         
        }
    }
</script>

<style lang="scss" scoped>
    .homeVisitrecordlist {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
    }
</style>
