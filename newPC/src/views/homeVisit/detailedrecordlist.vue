<template>
    <div class="detailedrecordlist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
             <el-select v-model="pagination.gradeId" style="width:150px"  size="medium" @change="gradelistfun()">
                <el-option    label="全部年级" :value="0"></el-option>
               <el-option   v-for="item in gradelist" :key="item.id"  :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="pagination.classId" style="width:150px" size="medium" @change="getBatchStuHomeVisitPageLists" v-if="pagination.gradeId">
                <el-option    label="全部班级" :value="0"></el-option>
               <el-option   v-for="item in classlist" :key="item.id"  :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="pagination.receiptState"  style="width:150px" size="medium" @change="getBatchStuHomeVisitPageLists" >
                <el-option    label="全部回执状态" :value="0"></el-option>
                <el-option    label="未回执" :value="1"></el-option>
                <el-option    label="已回执" :value="2"></el-option>
            </el-select>
             <el-select v-model="pagination.visitTypeId" style="width:120px" size="medium" @change="getBatchStuHomeVisitPageLists">
                <el-option    label="全部家访批次" :value="0"></el-option>
               <el-option   v-for="item in visitTypeslist" :key="item.id"  :label="item.name" :value="item.id"></el-option>
            </el-select>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
            <el-button class="filter-item" type="primary" icon="upload" size="medium" v-if="ispossessRole" @click="remindParentReceiptHomeVisits()">提醒未回执人员</el-button>
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
                        <span >{{scope.row.stuName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="班级" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.className}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="回执状态" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-tag  size="mini"  v-if="scope.row.receiptState==2">已回执</el-tag>
                        <el-tag  size="mini" type="danger"  v-else>未回执</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.visitType?scope.row.visitType:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访时间" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.entryTime?scope.row.entryTime:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="家访地址" show-overflow-tooltip>
                    <template slot-scope="scope">
                       <span >{{scope.row.homeAddress?scope.row.homeAddress:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="联系方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.contactInfo?scope.row.contactInfo:'--'}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="不能入户原因" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span >{{scope.row.enEntryReason?scope.row.enEntryReason:'--'}}</span>
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
    import {remindParentReceiptHomeVisit,getBatchHomeVisitGradeClassList,getBatchStuHomeVisitPageList,getHomeVisitBatchById,possessRole} from "@/api/homeVisit";
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
                    visitTypeId:0,
                },
                gradelist:[],
                classlist:[],
                visitTypeslist:[],
                ispossessRole:false
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.getBatchStuHomeVisitPageLists();
            this.getBatchHomeVisitGradeClassLists();
            this.getHomeVisitBatchByIds();
            //判断是不是管理员
			possessRole().then(res=>{
				this.ispossessRole= res.data.data.result;
			});
        },
        methods: {
            getHomeVisitBatchByIds(){
      getHomeVisitBatchById(this.$route.query.id).then(res => res.data).then(data => {
            let mydata=data.data;
            this.visitTypeslist=JSON.parse(mydata.visitTypes);
           
        })
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
                this.exportUrl = `${global.BasePath}structure/homevisit/exportHomeVisitReceiptDataXls?batchId=${this.pagination.batchId}&classId=${this.pagination.classId}&gradeId=${this.pagination.gradeId}&receiptState=${this.pagination.receiptState}&stuName=${this.pagination.stuName}&visitState=${this.pagination.visitState}&visitTypeId=${this.pagination.visitTypeId==0?"":this.pagination.visitTypeId}&token=${this.$store.getters.token}`;
                getBatchStuHomeVisitPageList(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        this.pagination.total = data.data.pagination.total;
                        this.dataList = data.data.dataList;
                    })
            },
            remindParentReceiptHomeVisits(){
                this.$confirm('确定要提醒未回执人员吗?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    remindParentReceiptHomeVisit(this.$route.query.id).then(res => {
                        this.$message({
                            type: 'success',
                            message: '提醒未回执人员成功!'
                        });
                    }).catch();

                }).catch(() => {
                });
            },
         
        }
    }
</script>

<style lang="scss" scoped>
    .detailedrecordlist {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
    }
</style>
