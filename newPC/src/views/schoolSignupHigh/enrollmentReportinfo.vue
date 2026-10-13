<template>
  <div class="enrollmentReportinfo">
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
                   <el-button type="primary" size="medium" @click.native="getNoticeEnrollCustomFilterData()">统计</el-button>
    </div>
    <div class="bigtitle">
        {{name}}
         <span v-if="pagination.searchMinScore&&pagination.searchMaxScore">分数段：{{pagination.searchMinScore}} =< 分数<{{pagination.searchMaxScore}}，</span>
         共计{{filterDataNum}}人，
         <span v-for="(newitem, newindex) in commMarkStaticsList" :key="newindex">
          {{newitem.commMark}}：{{biglist[newindex]}}人， 
        </span>
        具体如下：
    </div>
    <div  v-for="(items,indexs) in dataList" :key="indexs">
        <div class="title">{{items.schoolCountryName}}：共计{{items.dataNum}}人</div>
      <el-table
        border
        stripe
        style="width: 100%;"
        :data="items.schoolDataList"
      >     
        <el-table-column align="center" label="学校" show-overflow-tooltip>
          <template slot-scope="scope">
              {{ scope.row.graduateSchoolName}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="负责人" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.agentUserNames}}</template>
        </el-table-column>
        <el-table-column align="center" label="总人数" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.schoolDataNum}}</template>
        </el-table-column>
        <el-table-column align="center" :label="newitem.commMark" v-for="(newitem, newindex) in commMarkStaticsList" :key="newindex">
          <template slot-scope="scope">{{scope.row.commMarkStaticsList[newindex].stuNum}}</template>
        </el-table-column>
      </el-table>
    </div>
</div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import baseMixin from '@/mixins/baseMixin';
import {findSchoolDicsByCode} from '@/api/common/common';
import {getSchoolPublishEnrollNoticeList,getNoticeEnrollCustomFilterData} from "@/api/schoolSignupHigh";
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
        searchMaxScore:undefined,
        searchMinScore:undefined,
        isHasWishPic:0
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
      name:""
    };
  },
  created() {
      this.pagination.isHasWishPic=this.$route.query.isHasWishPic-0
        if(this.$route.query.maxScore){
            this.pagination.searchMaxScore=this.$route.query.maxScore-0
            this.pagination.searchMinScore=this.$route.query.minScore-0
        }
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
    getNoticeEnrollCustomFilterData() {
        let name=""
        if(!this.pagination.searchMaxScore||(!this.pagination.searchMinScore&&this.pagination.searchMinScore!==0)){
               this.$message({
                        type: "error",
                        message: "分数段不能为空！"
                    });
                    return false;
        }
       
    if(this.pagination.searchQuotaTypeCodes.length){
        name+='指标生：'
        for(let i=0;i<this.pagination.searchQuotaTypeCodes.length;i++){
            for(let j=0;j<this.list1.length;j++){
                if(this.pagination.searchQuotaTypeCodes[i]==this.list1[j].value){
                    name+=(this.list1[j].text+'， ')
                }
            }
        }
    }
     if(this.pagination.searchZhiYuanACodes.length){
        name+='A志愿：'
        for(let i=0;i<this.pagination.searchZhiYuanACodes.length;i++){
            for(let j=0;j<this.list2.length;j++){
                if(this.pagination.searchZhiYuanACodes[i]==this.list2[j].value){
                    name+=(this.list2[j].text+'， ')
                }
            }
        }
    }
    if(this.pagination.searchZhiYuanBCodes.length){
        name+='B志愿：'
        for(let i=0;i<this.pagination.searchZhiYuanBCodes.length;i++){
            for(let j=0;j<this.list3.length;j++){
                if(this.pagination.searchZhiYuanBCodes[i]==this.list3[j].value){
                    name+=(this.list3[j].text+'， ')
                }
            }
        }
    }
    if(this.pagination.searchZhiYuanCCodes.length){
        name+='C志愿：'
        for(let i=0;i<this.pagination.searchZhiYuanCCodes.length;i++){
            for(let j=0;j<this.list4.length;j++){
                if(this.pagination.searchZhiYuanCCodes[i]==this.list4[j].value){
                    name+=(this.list4[j].text+'， ')
                }
            }
        }
    }
    
    if(this.pagination.searchCommMarkCodes.length){
        name+='确定结果：'
        for(let i=0;i<this.pagination.searchCommMarkCodes.length;i++){
            for(let j=0;j<this.list5.length;j++){
                if(this.pagination.searchCommMarkCodes[i]==this.list5[j].value){
                    name+=(this.list5[j].text+'， ')
                }
            }
        }
    }
    if(this.pagination.promiseLevelBm.length){
        name+='承诺级别：'
        for(let i=0;i<this.pagination.promiseLevelBm.length;i++){
            for(let j=0;j<this.list6.length;j++){
                if(this.pagination.promiseLevelBm[i]==this.list6[j].value){
                    name+=(this.list6[j].text+'， ')
                }
            }
        }
    }
     name+='中考志愿截图：'
     if(this.pagination.isHasWishPic==0){
         name+='不限'
     }
      if(this.pagination.isHasWishPic==1){
         name+='已上传'
     }
      if(this.pagination.isHasWishPic==3){
         name+='未上传'
     }
    this.name=name
      getNoticeEnrollCustomFilterData(
          {
              noticeId:this.pagination.noticeId,//	通知ID	number	
              searchCommMarkCodes:this.pagination.searchCommMarkCodes.join(',') ,//	查询沟通标记编码，逗号分隔	string	
              promiseLevelBm:this.pagination.promiseLevelBm.join(',') ,//	查询沟通标记编码，逗号分隔	string	
              searchMaxScore:this.pagination.searchMaxScore,//	查询最大分数	string	
              searchMinScore:this.pagination.searchMinScore,//	查询最低分数	string	
              searchQuotaTypeCodes:this.pagination.searchQuotaTypeCodes.join(','),//	查询指标生编码，逗号分隔	string	
              searchZhiYuanACodes:this.pagination.searchZhiYuanACodes.join(','),//	查询志愿A编码，逗号分隔	string	
              searchZhiYuanBCodes:this.pagination.searchZhiYuanBCodes.join(','),//	查询志愿B编码，逗号分隔	string	
              searchZhiYuanCCodes:this.pagination.searchZhiYuanCCodes.join(','),//	查询志愿C编码，逗号分隔	string	
              isHasWishPic:this.pagination.isHasWishPic
          }
      ).then(res => res.data)
                .then(data => {
                    let mydata=data.data.dataList    
                    this.filterDataNum=data.data.filterDataNum;               
                    if(mydata.length){
                        this.commMarkStaticsList=mydata[0].schoolDataList[0].commMarkStaticsList
                    }
                    let list=[]
                    for(let i=0;i<this.commMarkStaticsList.length;i++){
                        list.push(0)
                    }
                    for(let i=0;i< mydata.length;i++){
                        let obj={
                            graduateSchoolName:'总计',
                            agentUserNames:'',
                            schoolDataNum:0,
                            commMarkStaticsList:[]
                        } 
                        for(let j=0;j<mydata[i].schoolDataList.length;j++){
                            obj.schoolDataNum+=(mydata[i].schoolDataList[j].schoolDataNum-0)
                           
                        }
                         for(let x=0;x<this.commMarkStaticsList.length;x++){
                              let num=0
                               for(let j=0;j<mydata[i].schoolDataList.length;j++){
                                   num+=(mydata[i].schoolDataList[j].commMarkStaticsList[x].stuNum-0)    
                                   list[x]+=(mydata[i].schoolDataList[j].commMarkStaticsList[x].stuNum-0)                              
                                }
                                obj.commMarkStaticsList.push({
                                    stuNum:Math.floor(num)
                                })
                            }
                           obj.schoolDataNum=Math.floor(obj.schoolDataNum)||0
                           mydata[i].schoolDataList.push(obj)
                    }
                     this.dataList = mydata;
                     this.biglist=list
                });   
    }
  },
};
</script>
<style lang="scss" scoped>
.enrollmentReportinfo {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 10px;
        overflow: hidden;
         border-bottom: 1px solid #e7eaec;
  }
  .bigtitle{
       line-height: 20px;
    font-size: 16px;
    padding: 10px;
    margin: 15px 0;
    color:#303133;
    font-weight: 600;
    background: #eee;
    border-radius: 8px;
  }
  .title{
    line-height: 20px;
    font-size: 15px;
    border-left: 3px solid #409eff;
    padding-left: 10px;
    margin: 15px 0;
    color:#606266;
  }
 
}
</style>
 