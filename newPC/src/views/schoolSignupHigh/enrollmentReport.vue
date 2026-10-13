<template>
  <div class="enrollmentReport">
    <div class="header">
          <el-select style="width:150px" size="medium" v-model="pagination.noticeId" placeholder="请选择报名批次" @change="getNoticeStuScoreMarkStaticsList()">
                        <el-option v-for="item in noticeList" :key="item.id" :label="item.title"
                                   :value="item.id"></el-option>
                    </el-select>
                    <el-select style="width:150px" @change="getNoticeStuScoreMarkStaticsList" size="medium" v-model="pagination.quotaStuTypeBm" placeholder="请选择区">
                             <el-option v-for="item in list1" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                     <el-select style="width:150px" @change="getNoticeStuScoreMarkStaticsList" size="medium" v-model="pagination.preferenceACode" placeholder="请选择区">
                             <el-option v-for="item in list2" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                     <el-select style="width:150px" @change="getNoticeStuScoreMarkStaticsList" size="medium" v-model="pagination.preferenceBCode" placeholder="请选择区">
                             <el-option v-for="item in list3" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                     <el-select style="width:150px" @change="getNoticeStuScoreMarkStaticsList" size="medium" v-model="pagination.preferenceCCode" placeholder="请选择区">
                             <el-option v-for="item in list4" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                      <el-select style="width:150px" @change="getNoticeStuScoreMarkStaticsList" size="medium" v-model="pagination.promiseLevelBm" placeholder="请选承诺">
                             <el-option v-for="item in list5" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                       <el-select style="width:150px" @change="getNoticeStuScoreMarkStaticsList" size="medium" v-model="pagination.isHasWishPic" placeholder="请选中考志愿截图">
                             <el-option v-for="item in list6" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
               <el-button type="primary" size="medium" @click.native="enrollmentReportinfo('','')">自定义筛选</el-button>
               <el-button type="primary" size="medium" @click.native="enrollmentReportstu('','')">查看明细</el-button>
               <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `明细.xlsx`)"   v-if="dataList.length>0">导出</el-button>
              <el-button type="primary" size="medium"   @click="print()">打印</el-button>
    </div>
    <div class="main-wrap" id="outTable">
      <el-table
        border
         ref="print"
        stripe
        style="width: 100%;"
        :height="maxH"
        :data="dataList"
      >     
        <el-table-column align="center" label="分数段" show-overflow-tooltip>
          <template slot-scope="scope">
              <span v-if="scope.row.scoreRange!='总计'" class="link-type" @click="enrollmentReportinfo(scope.row.minScore,scope.row.maxScore)">{{ scope.row.scoreRange}}</span>
               <span v-else>{{ scope.row.scoreRange}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="登记" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.stuNum}}</template>
        </el-table-column>
        <el-table-column align="center" label="未沟通" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.notCommStuNum}}</template>
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
import {getSchoolPublishEnrollNoticeList,getNoticeStuScoreMarkStaticsList} from "@/api/schoolSignupHigh";
export default {
  data() {
    return { 
      dataList: [],
      commMarkStaticsList:[],
      pagination:{
        noticeId:"",
        preferenceACode:0, 
        preferenceBCode:0,        
        preferenceCCode:0,
        quotaStuTypeBm:0,
        promiseLevelBm:0,
        isHasWishPic:0
      },
      noticeList:[],
      list1:[{value:0,text:"指标生不限"}],
      list2:[{value:0,text:"A志愿不限"}],
      list3:[{value:0,text:"B志愿不限"}],
      list4:[{value:0,text:"C志愿不限"}],  
      list5:[{value:0,text:"承诺不限"}],   
      list6:[{value:0,text:"志愿截图不限"},{value:1,text:"已上传"},{value:2,text:"未上传"}],   
    };
  },
   activated() {
            if(this.pagination.noticeId){
                this.getNoticeStuScoreMarkStaticsList()
            }
        },
  created() {
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
                  findSchoolDicsByCode({ dicCode: 'promiseLevelType'})
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
         getSchoolPublishEnrollNoticeList()
                .then(res => res.data)
                .then(data => {
                    this.noticeList = data.data;
                    if(data.data.length !== 0) {
                        this.pagination.noticeId = data.data[0].id;
                        this.getNoticeStuScoreMarkStaticsList()
                    }
                });
    
  },
  mixins: [mixin,baseMixin],
  methods: {  
      //打印
    print() {
      this.$print(this.$refs.print);
    },
    enrollmentReportinfo(minScore,maxScore) {
         this.$router.push({
                                    path:"enrollmentReportinfo",
                                    query: {
                                        noticeId:this.pagination.noticeId,
                                        minScore:minScore,
                                        maxScore:maxScore,
                                        preferenceACode:this.pagination.preferenceACode||'', 
                                        preferenceBCode:this.pagination.preferenceBCode||'',        
                                        preferenceCCode:this.pagination.preferenceCCode||'',
                                        quotaStuTypeBm:this.pagination.quotaStuTypeBm||'',
                                        promiseLevelBm:this.pagination.promiseLevelBm||'',
                                        isHasWishPic:this.pagination.isHasWishPic
                                    }
                                });     
     },
     enrollmentReportstu(minScore,maxScore) {
         this.$router.push({
                                    path:"enrollmentReportstu",
                                    query: {
                                        noticeId:this.pagination.noticeId,
                                        minScore:minScore,
                                        maxScore:maxScore,
                                        preferenceACode:this.pagination.preferenceACode||'', 
                                        preferenceBCode:this.pagination.preferenceBCode||'',        
                                        preferenceCCode:this.pagination.preferenceCCode||'',
                                        quotaStuTypeBm:this.pagination.quotaStuTypeBm||'',
                                        promiseLevelBm:this.pagination.promiseLevelBm||'',
                                        isHasWishPic:this.pagination.isHasWishPic
                                    }
                                });     
     },
    getNoticeStuScoreMarkStaticsList() {
      getNoticeStuScoreMarkStaticsList(this.pagination).then(res => res.data)
                .then(data => {
                    this.dataList = data.data;
                    if(data.data.length){
                       this.commMarkStaticsList=data.data[0].commMarkStaticsList
                    }
                    let obj={
                        scoreRange:'总计',
                        stuNum:0,
                        notCommStuNum:0,
                        commMarkStaticsList:[]
                    } 
                    for(let i=0;i< this.dataList.length;i++){
                       obj.stuNum+=(this.dataList[i].stuNum-0)
                       obj.notCommStuNum+=(this.dataList[i].notCommStuNum-0)
                    }
                    obj.stuNum=Math.floor(obj.stuNum)||0
                    obj.notCommStuNum=Math.floor(obj.notCommStuNum)||0
                     for(let i=0;i< this.commMarkStaticsList.length;i++){
                         let num=0
                         for(let j=0;j<this.dataList.length;j++){
                             num+=(this.dataList[j].commMarkStaticsList[i].stuNum-0)                            
                         }
                          obj.commMarkStaticsList.push({
                             stuNum:Math.floor(num)
                           })
                        
                    }
                    this.dataList.push(obj)
                });   
    }
  },
};
</script>
<style lang="scss" scoped>
.enrollmentReport {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 0;
        overflow: hidden;
  }
 
}
</style>
 