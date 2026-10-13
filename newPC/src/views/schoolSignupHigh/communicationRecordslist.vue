<template>
  <div class="communicationRecordslist">
    <div class="header">
        <!-- <div  @click="jumpToPage('communicationRecordsinfo', {id:217})">21323</div> -->
        <el-col :span="19">
          <template>
          <el-select style="width:150px" size="medium" v-model="pagination.noticeId" placeholder="请选择报名批次" @change="getNoticeCountryListFromDatas()">
                        <el-option v-for="item in noticeList" :key="item.id" :label="item.title"
                                   :value="item.id"></el-option>
                    </el-select>
                     <el-select style="width:150px" @change="selectJuniorSchoolFunc" size="medium" v-model="schoolCountryCode" placeholder="请选择区">
                        <el-option :key="0" label="全部区" value=""></el-option>
                        <el-option v-for="item in newqulist" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                    <el-select style="width:150px" @change="getNoticeStuCommLastestInfoPageList" size="medium" v-model="graduateSchoolCode" placeholder="请选择毕业学校">
                        <el-option :key="0" label="全部毕业学校" value=""></el-option>
                        <el-option v-for="item in juniorSchoolList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                    <el-select style="width:150px" @change="getNoticeStuCommLastestInfoPageList" size="medium" v-model="pagination.commMarkBm" placeholder="请选择区">
                        <el-option :key="0" label="全部标记" value=""></el-option>
                        <el-option v-for="item in qulist" :key="item.code" :label="item.value" :value="item.code"></el-option>
                         <el-option label="未标记" :value="-1"></el-option>
                    </el-select>
                      <a :href="exportUrlone" download="导出" target="_blank" v-if="dataList.length">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
            <a :href="exportUrltwo" download="导出" target="_blank" v-if="dataList.length">
              <el-button type="primary" size="medium" icon="upload">导出所有记录</el-button>
          </a>
          </template></el-col>
            <el-col :span="5">
              <el-input  size="medium" placeholder="请输入学生姓名" v-model.trim="pagination.stuName" @input="getNoticeStuCommLastestInfoPageList">
            <el-button slot="append" icon="el-icon-search" @click="getNoticeStuCommLastestInfoPageList"></el-button>
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
        <el-table-column align="center" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.stuName}}</template>
        </el-table-column>
        <el-table-column align="center" label="中考分数" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.score}}</template>
        </el-table-column>
        <el-table-column align="center" label="沟通人" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.createUser}}</template>
        </el-table-column>
        <el-table-column align="center" label="沟通方式" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.commType}}</template>
        </el-table-column>
        <el-table-column align="center" label="指标生" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.quotaStuType}}</template>
        </el-table-column>
        <el-table-column align="center" label="A志愿" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.preferenceA}}</template>
        </el-table-column>
        <el-table-column align="center" label="B志愿" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.preferenceB}}</template>
        </el-table-column>
        <el-table-column align="center" label="C志愿" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.preferenceC}}</template>
        </el-table-column>
        <el-table-column align="center" label="待解决问题" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.waitSloveIssue}}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.waitSloveIssueBz}}</template>
        </el-table-column>
          <el-table-column align="center" label="承诺" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.promiseType}}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.promiseLevel}}&nbsp;&nbsp;&nbsp;&nbsp;{{ scope.row.promiseRemark}}</template>
        </el-table-column>
         <el-table-column align="center" label="沟通标记" show-overflow-tooltip>
          <template slot-scope="scope">
                <el-tag  size="mini" type="warning"  v-if="scope.row.commMark">{{scope.row.commMark}}</el-tag>
                <el-tag  size="mini"  type="danger" v-else>未标记</el-tag>     
          </template>
        </el-table-column>
        <el-table-column align="center" label="标记备注" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.commMarkRemark}}</template>
        </el-table-column>
         <el-table-column align="center" label="时间" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.createTime?scope.row.createTime.substring(0, 19):""}}</template>
        </el-table-column>
       <el-table-column align="center" label="操作">
            <template slot-scope="scope">
                <el-button size="small" type="text"
                               @click="jumpToPage('communicationRecordsinfo', {id: scope.row.stuId})">沟通记录
                    </el-button>
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
import {findSchoolDicsByCode} from '@/api/common/common';
import {getSpecialistManageSchoolList,getSchoolPublishEnrollNoticeList,getNoticeStuCommLastestInfoPageList,getNoticeCountryListFromDatas,selectJuniorSchool} from "@/api/schoolSignupHigh";
export default {
  data() {
    return { 
      dataList: [],
      pagination:{
        pageNo: 1,
        pageSize: 20,
        total: 0,
        noticeId:"",
        commMarkBm:'',
        noticeId:"",
        stuName:""
      },
      noticeList:[],
      qulist:[],
      exportUrlone: '',
      exportUrltwo: '', 
      newqulist:[],
       schoolCountryCode: '',
                juniorSchoolList: [],
                zhiyuanList: [],
                graduateSchoolCode: '',
                firBatchFirWishSchoolCode: '',
                subjectStudentCode: '',
    };
  },
  created() {
        findSchoolDicsByCode({ dicCode: 'commMarkType' })
                .then(res => res.data)
                .then(({data}) => {
                    if (data && data.length !== 0) {
                        this.qulist = data;
                    }
                });
         getSchoolPublishEnrollNoticeList()
                .then(res => res.data)
                .then(data => {
                    this.noticeList = data.data;
                    if(data.data.length !== 0) {
                        this.pagination.noticeId = data.data[0].id;
                        this.getNoticeCountryListFromDatas()
                    }
                });
    
  },
  mixins: [mixin,baseMixin],
  methods: {  
      getNoticeCountryListFromDatas(){
                this.juniorSchoolList=[]
                this.graduateSchoolCode='',
                this.schoolCountryCode=''
                this.getNoticeStuCommLastestInfoPageList();
                this.newqulist=[]
                 getSpecialistManageSchoolList(this.pagination.noticeId)
                    .then(res => res.data)
                    .then(data => {
                         let mydata=data.data;
                         for(let i=0;i<mydata.length;i++){
                             let is=true
                             for(let j=0;j<this.newqulist.length;j++){
                                 if(mydata[i].schoolCountryCode==this.newqulist[j].id){
                                      is=false
                                 }
                             }
                             if(is){
                                this.newqulist.push({
                                    title:mydata[i].schoolCountyName,
                                    id:mydata[i].schoolCountryCode,
                                    list:[]
                                })
                             }
                         }
                         for(let i=0;i<this.newqulist.length;i++){
                             for(let j=0;j<mydata.length;j++){
                                 if(mydata[j].schoolCountryCode==this.newqulist[i].id){
                                    this.newqulist[i].list.push({
                                        title:mydata[j].graduateSchoolName,
                                        id:mydata[j].graduateSchoolCode,
                                    })
                                 }
                             }
                         }
                          // for(let j=0;j<mydata.length;j++){
                          //          this.newqulist[0].list.push({
                          //               title:mydata[j].graduateSchoolName,
                          //               id:mydata[j].graduateSchoolCode,
                          //           })
                          //    }
                          //    this.juniorSchoolList = this.newqulist[0].list;
                 })
                // getNoticeCountryListFromDatas(this.pagination.noticeId).then(res => {
                //             const data = res.data;
                //             this.newqulist=data.data;                            
                //             }).catch(() => {});
            },
     selectJuniorSchoolFunc(obj) {
                      this.graduateSchoolCode=''
                       for(let i=0;i<this.newqulist.length;i++){
                              if(obj==this.newqulist[i].id){
                                 this.juniorSchoolList = this.newqulist[i].list;
                                 }
                         }
                        
                         this.getNoticeStuCommLastestInfoPageList();
            },
       // 分页 - pageSize 改变
            handleSizeChange(pageSize) {
                this.pagination.pageSize = pageSize;
                this.getNoticeStuCommLastestInfoPageList();
            },
            // 分页 - currentPage 改变
            handleCurrentChange(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getNoticeStuCommLastestInfoPageList();
            },
    getNoticeStuCommLastestInfoPageList() {
      this.exportUrlone = `${global.BasePath}structure/enrollStudentInfo/exportCommRecordDataList?token=${this.$store.getters.token}&commMarkBm=${this.pagination.commMarkBm}&noticeId=${this.pagination.noticeId}&graduateSchoolCode=${this.graduateSchoolCode}&schoolCountryCode=${this.schoolCountryCode}&stuName=${this.pagination.stuName}&exportType=1`;
      this.exportUrltwo = `${global.BasePath}structure/enrollStudentInfo/exportCommRecordDataList?token=${this.$store.getters.token}&commMarkBm=${this.pagination.commMarkBm}&noticeId=${this.pagination.noticeId}&graduateSchoolCode=${this.graduateSchoolCode}&schoolCountryCode=${this.schoolCountryCode}&stuName=${this.pagination.stuName}&exportType=2`;
     getNoticeStuCommLastestInfoPageList({
        pageSize: this.pagination.pageSize,
        commMarkBm: this.pagination.commMarkBm,
        noticeId: this.pagination.noticeId,
        pageNo: this.pagination.pageNo,
        stuName:this.pagination.stuName,
        schoolCountryCode:this.schoolCountryCode,
        graduateSchoolCode:this.graduateSchoolCode
      })
        .then((res) => res.data)
        .then((data) => {
          if (data.code === 200 && data.data) {            
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
.communicationRecordslist {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 0;
        overflow: hidden;
  }
 
}
</style>
 