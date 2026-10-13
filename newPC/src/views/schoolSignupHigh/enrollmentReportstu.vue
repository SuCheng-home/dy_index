<template>
  <div class="enrollmentReportstu">
    <div class="header">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-select style="width:120px" size="medium" v-model="pagination.noticeId" placeholder="请选择报名批次" >
                        <el-option v-for="item in noticeList" :key="item.id" :label="item.title"
                                   :value="item.id"></el-option>
                    </el-select>
                    <el-select style="width:120px" multiple  collapse-tags   size="medium" v-model="pagination.searchQuotaTypeCodes" placeholder="请选择指标生">
                             <el-option v-for="item in list1" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                    <el-select style="width:120px" multiple  collapse-tags   size="medium" v-model="pagination.searchZhiYuanACodes" placeholder="请选择A志愿">
                             <el-option v-for="item in list2" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                    <el-select style="width:120px" multiple   collapse-tags   size="medium" v-model="pagination.searchZhiYuanBCodes" placeholder="请选择B志愿">
                             <el-option v-for="item in list3" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                    <el-select style="width:120px" multiple   collapse-tags   size="medium" v-model="pagination.searchZhiYuanCCodes" placeholder="请选择C志愿">
                             <el-option v-for="item in list4" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                    <el-select style="width:120px"  multiple   collapse-tags   size="medium" v-model="pagination.searchCommMarkCodes" placeholder="请选择结果">
                             <el-option v-for="item in list5" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                     <el-select style="width:120px"  multiple   collapse-tags   size="medium" v-model="pagination.promiseLevelBm" placeholder="请选择承诺级别">
                             <el-option v-for="item in list6" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                     <el-select style="width:120px"  size="medium" v-model="pagination.isHasWishPic" placeholder="请选中考志愿截图">
                             <el-option v-for="item in list7" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                    <el-input-number style="width:140px" size="medium" v-model="pagination.searchMinScore" :min="0" :max="pagination.searchMaxScore" label="开始分数"></el-input-number>
                    <el-input-number  style="width:140px" size="medium" v-model="pagination.searchMaxScore"  :min="pagination.searchMinScore" :max="1000" label="结束分数"></el-input-number>
                   <el-button type="primary" size="medium" @click.native="getNoticeEnrollCustomFilterStuPageList()">统计</el-button>
                    <a :href="exportUrlone" download="导出" target="_blank" v-if="dataList.length">
              <el-button type="primary" size="medium" icon="upload">导出</el-button>
          </a>
    </div>
    <div class="bigtitle">
       <el-table
        border
        stripe
        style="width: 100%;"
        :height="maxH"
        :data="dataList"
      >     
        <el-table-column align="center" label="姓名" show-overflow-tooltip>
          <template slot-scope="scope">
            <span class="link-type" @click="jumpToPage('communicationRecordsinfo', {id: scope.row.stuId})">{{ scope.row.stuName}}</span>
            </template>
        </el-table-column>
         <el-table-column align="center" label="区域" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.schoolCountyName}}</template>
        </el-table-column>
        <el-table-column align="center" label="毕业学校" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.graduateSchoolName}}</template>
        </el-table-column>
        <el-table-column align="center" label="中考分数" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.score}}</template>
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
         <el-table-column align="center" label="确认结果" show-overflow-tooltip>
          <template slot-scope="scope">
                <el-tag  size="mini" type="warning"  v-if="scope.row.commMark">{{scope.row.commMark}}</el-tag>
                <el-tag  size="mini"  type="danger" v-else>未标记</el-tag>     
          </template>
        </el-table-column>
         <el-table-column align="center" label="负责人" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.agentUserName}}</template>
        </el-table-column>
        <el-table-column align="center" label="分管领导" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.inchargeUserName}}</template>
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
import {getSchoolPublishEnrollNoticeList,getNoticeEnrollCustomFilterStuPageList} from "@/api/schoolSignupHigh";
export default {
  data() {
    return { 
      dataList: [],
      commMarkStaticsList:[],
      pagination:{
        noticeId:this.$route.query.noticeId-0,
        searchZhiYuanACodes:[], 
        searchZhiYuanBCodes:[],        
        searchZhiYuanCCodes:[],
        searchQuotaTypeCodes:[],
        searchCommMarkCodes:[],
        promiseLevelBm:[],
        searchMaxScore:this.$route.query.maxScore||undefined,
        searchMinScore:this.$route.query.minScore||undefined,
        isHasWishPic:0,
        pageNo: 1,
        pageSize: 20,
      },
      noticeList:[],
      list1:[],
      list2:[],
      list3:[],
      list4:[],  
      list5:[],
      list6:[],
       list7:[{value:0,text:"志愿截图不限"},{value:1,text:"已上传"},{value:2,text:"未上传"}], 
      biglist:[],
      filterDataNum:"",
      name:"",
      exportUrlone: '',
    };
  },
   activated() {
     this.pagination.isHasWishPic=this.$route.query.isHasWishPic-0
            if(this.$route.query.preferenceACode){
                this.pagination.searchZhiYuanACodes=[this.$route.query.preferenceACode]
            }
            if(this.$route.query.preferenceBCode){
                this.pagination.searchZhiYuanBCodes=[this.$route.query.preferenceBCode]
            }
            if(this.$route.query.preferenceCCode){
                this.pagination.searchZhiYuanCCodes=[this.$route.query.preferenceCCode]
            }
            if(this.$route.query.quotaStuTypeBm){
                this.pagination.searchQuotaTypeCodes=[this.$route.query.quotaStuTypeBm]
            }
            if(this.pagination.searchMaxScore&&this.pagination.searchMinScore){
                this.getNoticeEnrollCustomFilterStuPageList();
            }
        },
  created() {
           this.pagination.isHasWishPic=this.$route.query.isHasWishPic-0
           if(this.$route.query.preferenceACode){
                this.pagination.searchZhiYuanACodes=[this.$route.query.preferenceACode]
            }
            if(this.$route.query.preferenceBCode){
                this.pagination.searchZhiYuanBCodes=[this.$route.query.preferenceBCode]
            }
            if(this.$route.query.preferenceCCode){
                this.pagination.searchZhiYuanCCodes=[this.$route.query.preferenceCCode]
            }
            if(this.$route.query.quotaStuTypeBm){
                this.pagination.searchQuotaTypeCodes=[this.$route.query.quotaStuTypeBm]
            }
             if(this.$route.query.promiseLevelBm){
                this.pagination.promiseLevelBm=[this.$route.query.promiseLevelBm]
            }
          findSchoolDicsByCode({ dicCode: 'enrollQuotaStuType'})
                .then(res => res.data)
                .then(({data}) => {
                    if (data && data.length !== 0) {
                        for(let i=0;i<data.length;i++){
                              this.list1.push({
                                  value:data[i].code,
                                  text:data[i].value,
                              })
                            }   
                    }
                });
              findSchoolDicsByCode({ dicCode: 'enrollPreferenceAType'})
                .then(res => res.data)
                .then(({data}) => {
                    if (data && data.length !== 0) {
                        for(let i=0;i<data.length;i++){
                              this.list2.push({
                                  value:data[i].code,
                                  text:data[i].value,
                              })
                            }   
                    }
                });

              findSchoolDicsByCode({ dicCode: 'enrollPreferenceBType'})
                .then(res => res.data)
                .then(({data}) => {
                    if (data && data.length !== 0) {
                        for(let i=0;i<data.length;i++){
                              this.list3.push({
                                  value:data[i].code,
                                  text:data[i].value,
                              })
                            }   
                    }
                });
              findSchoolDicsByCode({ dicCode: 'enrollPreferenceCType'})
                .then(res => res.data)
                .then(({data}) => {
                    if (data && data.length !== 0) {
                        for(let i=0;i<data.length;i++){
                              this.list4.push({
                                  value:data[i].code,
                                  text:data[i].value,
                              })
                            }   
                    }
                });
         getSchoolPublishEnrollNoticeList()
                .then(res => res.data)
                .then(data => {
                    this.noticeList = data.data;
                });
         findSchoolDicsByCode({ dicCode: 'commMarkType',schoolId:this.schoolId })
                .then(res => res.data)
                .then(({data}) => {
                    if (data && data.length !== 0) {
                        for(let i=0;i<data.length;i++){
                              this.list5.push({
                                  value:data[i].code,
                                  text:data[i].value,
                              })
                            }   
                    }
                });
                findSchoolDicsByCode({ dicCode: 'promiseLevelType',schoolId:this.schoolId })
                .then(res => res.data)
                .then(({data}) => {
                    if (data && data.length !== 0) {
                        for(let i=0;i<data.length;i++){
                              this.list6.push({
                                  value:data[i].code,
                                  text:data[i].value,
                              })
                            }   
                    }
                });
    
  },
  mixins: [mixin,baseMixin],
  methods: { 
           // 分页 - pageSize 改变
            handleSizeChange(pageSize) {
                this.pagination.pageSize = pageSize;
                this.getNoticeEnrollCustomFilterStuPageList();
            },
            // 分页 - currentPage 改变
            handleCurrentChange(pageNo) {
                this.pagination.pageNo = pageNo;
                this.getNoticeEnrollCustomFilterStuPageList();
            },
    getNoticeEnrollCustomFilterStuPageList() {
        let name=""
        if(!this.pagination.searchMaxScore||!this.pagination.searchMinScore&&this.pagination.searchMinScore!==0){
               this.$message({
                        type: "error",
                        message: "分数段不能为空！"
                    });
                    return false;
        }
    this.exportUrlone = `${global.BasePath}structure/enrollStudentInfo/exportNoticeEnrollCustomFilterStuList?token=${this.$store.getters.token}&noticeId=${this.pagination.noticeId}&searchMaxScore=${this.pagination.searchMaxScore}&isHasWishPic=${this.pagination.isHasWishPic}&searchMinScore=${this.pagination.searchMinScore}&promiseLevelBm=${this.pagination.promiseLevelBm.join(',')}&searchCommMarkCodes=${this.pagination.searchCommMarkCodes.join(',')}&searchQuotaTypeCodes=${this.pagination.searchQuotaTypeCodes.join(',')}&searchZhiYuanACodes=${this.pagination.searchZhiYuanACodes.join(',')}&searchZhiYuanBCodes=${this.pagination.searchZhiYuanBCodes.join(',')}&searchZhiYuanCCodes=${this.pagination.searchZhiYuanCCodes.join(',')}`;
      getNoticeEnrollCustomFilterStuPageList(
          {
              noticeId:this.pagination.noticeId,//	通知ID	number	
              searchCommMarkCodes:this.pagination.searchCommMarkCodes.join(',') ,//	查询沟通标记编码，逗号分隔	string	
              searchMaxScore:this.pagination.searchMaxScore,//	查询最大分数	string	
              searchMinScore:this.pagination.searchMinScore,//	查询最低分数	string	
              searchQuotaTypeCodes:this.pagination.searchQuotaTypeCodes.join(','),//	查询指标生编码，逗号分隔	string	
              searchZhiYuanACodes:this.pagination.searchZhiYuanACodes.join(','),//	查询志愿A编码，逗号分隔	string	
              searchZhiYuanBCodes:this.pagination.searchZhiYuanBCodes.join(','),//	查询志愿B编码，逗号分隔	string	
              searchZhiYuanCCodes:this.pagination.searchZhiYuanCCodes.join(','),//	查询志愿C编码，逗号分隔	string	
              promiseLevelBm:this.pagination.promiseLevelBm.join(','),//	查询志愿C编码，逗号分隔	string
              isHasWishPic:this.pagination.isHasWishPic
          },this.pagination.pageNo,this.pagination.pageSize
      ).then(res => res.data)
                .then(data => {
                    this.dataList=data.data.dataList
                   this.pagination.total = data.data.pagination.total;
                });   
    }
  },
};
</script>
<style lang="scss" scoped>
.enrollmentReportstu {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    overflow: hidden;
  }
  
 
}
</style>
 