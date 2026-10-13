<template>
  <div class="registrationSpecialist">
    <div class="header">
        <el-col :span="19">
          <template>
          <el-select style="width:150px" size="medium" v-model="pagination.noticeId" placeholder="请选择报名批次" @change="getNoticeCountryListFromDatas()">
                        <el-option v-for="item in noticeList" :key="item.id" :label="item.title"
                                   :value="item.id"></el-option>
                    </el-select>
                    <el-select style="width:150px" @change="getNoticeEnrollSpecialistPageList" size="medium" v-model="pagination.schoolCountryCode" placeholder="请选择区">
                        <el-option :key="0" label="全部区" value=""></el-option>
                        <el-option v-for="item in qulist" :key="item.schoolCountryCode" :label="item.schoolCountyName" :value="item.schoolCountryCode"></el-option>
                    </el-select>
          </template>
          <a :href="exportUrlone" download="导出" target="_blank" v-if="dataList.length">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
          <el-button type="primary" size="medium"  @click="dealNotAllocationStuDatas()">自动分配</el-button>
          
          </el-col>
            <el-col :span="5">
              <el-input  size="medium" placeholder="请输入学校名称" v-model.trim="pagination.graduateSchoolName" @input="getNoticeEnrollSpecialistPageList">
            <el-button slot="append" icon="el-icon-search" @click="getNoticeEnrollSpecialistPageList"></el-button>
       </el-input>
            </el-col>
    </div>
    <div class="main-wrap" id="outTable">
      <el-table
        border
        stripe
        style="width: 100%;"
        :height="maxH"
        :data="dataList"
      >     
        <el-table-column align="center" label="区域" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.schoolCountyName}}</template>
        </el-table-column>
        <el-table-column align="center" label="学校名称" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.graduateSchoolName}}</template>
        </el-table-column>
        <el-table-column align="center" label="登记人数" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="link-type" @click="signupStuList(scope.row)">
               {{ scope.row.applyStuNum}}
            </span>
           </template>
        </el-table-column>
        <el-table-column align="center" label="待分配" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.unabsorbedStuNum}}</template>
        </el-table-column>
         <el-table-column align="center" v-for="(item, index) in commMarkStaticsList" :key="index"  :label="item.commMark+'人数'" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.commMarkStaticsList[index].stuNum}}</template>
        </el-table-column>
        <el-table-column align="center" label="负责人" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.agentUserNames}}</template>
        </el-table-column>
        <el-table-column align="center" label="分管领导" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.inchargeUserName}}</template>
        </el-table-column>
       <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <address-book v-model="scope.row.addressData"  @confirm="saveNoticeSpecialist(scope.row)" :config="activityScopeData" dataSuffix="List" mytype="text" :isbutton="true" >设置专员</address-book>
           </template>
         </el-table-column>
      </el-table>
        <el-pagination
            style="margin-top: 20px"
            layout="total, sizes, prev, pager, next, jumper"
            :current-page.sync="pagination.pageNo"
            :page-size="pagination.pageSize"
            :page-sizes="pagination.pageSizes"
            :total="pagination.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import baseMixin from '@/mixins/baseMixin';
import AddressBook from '@/components/AddressBook/indexExpand';
import {dealNotAllocationStuDatas,getNoticeEnrollSpecialistPageList,getNoticeCountryListFromDatas,getSchoolPublishEnrollNoticeList,saveNoticeSpecialist} from "@/api/schoolSignupHigh";
export default {
  components:{
    AddressBook,
  },
  data() {
    return { 
      dataList: [],
      pagination:{
        pageNo: 1,
        pageSize: 20,
        total: 0,
        noticeId:"",
        graduateSchoolName:'',
        schoolCountryCode:"",
        noticeId:""
      },
      noticeList:[],
      qulist:[],
      activityScopeData: {
          title: '设置专员',          
          depart: {target: 'user', departType: 't', userTypes: '1', notCheckSchool: true},
          group: false,
      },
      commMarkStaticsList:[],
      exportUrlone: '',
    };
  },
  created() {
         getSchoolPublishEnrollNoticeList()
                .then(res => res.data)
                .then(data => {
                    this.noticeList = data.data;
                    if(data.data.length !== 0) {
                        this.pagination.noticeId = data.data[0].id;
                    }
                    this.getNoticeCountryListFromDatas()
                    this.getNoticeEnrollSpecialistPageList();
                });
    
  },
  mixins: [mixin,baseMixin],
  methods: {  
      dealNotAllocationStuDatas(id) {
                this.$confirm('是否自动分配', '自动分配', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                    dealNotAllocationStuDatas(this.pagination.noticeId)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '分配成功!'
                                });
                                this.getNoticeEnrollSpecialistPageList();
                            }
                        })
                });

            },
    saveNoticeSpecialist(obj){
      let args={
         agentUserJson:obj.addressData.userList,
      }
      if(obj.id){
        args.id=obj.id
      }else{
         args.graduateSchoolCode=obj.graduateSchoolCode
         args.graduateSchoolName=obj.graduateSchoolName
         args.noticeId=this.pagination.noticeId
         args.schoolCountryCode=obj.schoolCountryCode
         args.schoolCountyName=obj.schoolCountyName
      }
        saveNoticeSpecialist(args)
                    .then(res => res.data)
                    .then(data => {
                        if (data.result&&!data.msg) {
                            this.$message({
                                message: '设置成功',
                                type: 'success'
                            });
                        }else{
                          this.$message({
                                    type: 'error',
                                    message: data.msg
                                });
                        }
                         this.getNoticeEnrollSpecialistPageList();
                    });

    },
          getNoticeCountryListFromDatas(){
               this.pagination.schoolCountryCode=""
                getNoticeCountryListFromDatas(this.pagination.noticeId).then(res => {
                    const data = res.data;
                    this.qulist=data.data;     
                    this.getNoticeEnrollSpecialistPageList()                       
               }).catch(() => {});
            },
       // 分页 - pageSize 改变
            handleSizeChange(pageSize) {
                this.pagination.pageSize = pageSize;
                this.getNoticeEnrollSpecialistPageList();
            },
            // 分页 - currentPage 改变
            handleCurrentChange(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getNoticeEnrollSpecialistPageList();
            },
    signupStuList(obj){
         this.$router.push({
            path:'signupStuList',
            query:{
                  noticeId:this.pagination.noticeId,
                  schoolCountryCode:obj.schoolCountryCode,
                  graduateSchoolCode:obj.graduateSchoolCode
            }
          })
    },
    getNoticeEnrollSpecialistPageList() {
        this.exportUrlone = `${global.BasePath}structure/enrollStudentInfo/exportNoticeSpecialistDataList?token=${this.$store.getters.token}&graduateSchoolName=${this.pagination.graduateSchoolName}&noticeId=${this.pagination.noticeId}&schoolCountryCode=${this.pagination.schoolCountryCode}`;
      getNoticeEnrollSpecialistPageList({
        pageSize: this.pagination.pageSize,
        schoolCountryCode: this.pagination.schoolCountryCode,
        noticeId: this.pagination.noticeId,
        pageNo: this.pagination.pageNo,
        graduateSchoolName:this.pagination.graduateSchoolName
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200 && data.data) {
            if(data.data.dataList.length){
              this.commMarkStaticsList=data.data.dataList[0].commMarkStaticsList
            }             
              for(let i=0;i<data.data.dataList.length;i++){
                if(data.data.dataList[i].agentUserJson){
                  data.data.dataList[i].addressData={
                    userList:JSON.parse(data.data.dataList[i].agentUserJson)
                  }
                }else{
                  data.data.dataList[i].addressData={
                    userList:[]
                 }
                }
                
              }
               this.dataList=data.data.dataList
                this.pagination.total = data.data.pagination.total;
          }
        })
        .catch(() => {});
    }
  },
};
</script>
<style lang="scss" scoped>
.registrationSpecialist {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 0;
        overflow: hidden;
  }
 
}
</style>
 