<template>
<div class="homeVisitViewdetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-select v-model="pagination.gradeId" style="width:180px"  size="medium" @change="gradelistfun()">
               <el-option   v-for="item in gradelist" :key="item.id"  :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select v-model="pagination.classId" style="width:180px" size="medium" @change="getClassStuHomeVisitInfoLists" v-if="pagination.gradeId">
                <el-option   v-for="item in classlist" :key="item.id"  :label="item.name" :value="item.id"></el-option>
            </el-select> 
         <el-button type="primary" size="medium" v-if="dataList.length"   @click="print()">导出</el-button> 
         <el-button type="primary" size="medium"   @click="printbig()">导出全部</el-button>  
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <div class="body"  style="display: none;">
             <div ref="printbig" id="printbig">
             <div style="page-break-after: always" v-for="(items,indexs) in dataList" :key="indexs" v-if="items.visitState==2">
             <div class="h3" style="font-size: 24px;text-align: center;line-height: 80px;color: #303133;">{{items.name}}</div>
             <div class="ul">
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitTeacher">
                     <div class="name" style="font-size: 14px;line-height: 20px; position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访教师</div>
                     {{items.visitTeacher}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitTime">
                     <div class="name" style=" font-size: 14px;line-height: 20px; position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访时间</div>
                     {{items.visitTime}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitSite">
                     <div class="name" style=" font-size: 14px;line-height: 20px; position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">地点</div>
                     {{items.visitSite}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitContent.length">
                     <div class="name" style=" font-size: 14px;line-height: 20px;  position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访内容</div>
                    <span v-for="item in items.visitContent" :key="item.id">
                      {{item.name}}；
                    </span>
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitEffect">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访效果</div>
                     {{items.visitEffect}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.parentOpinion">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家长意见</div>
                     {{items.parentOpinion}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitPics.length">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访照片</div>
                    <image-previewer tag="richtext">
                                <img style="width: 80px!important;height: 80px;margin-right: 10px;"
                                     v-for="picItem in items.visitPics" :src="picItem.picUrl"
                                     :key="picItem.id">
                        </image-previewer>
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitTablePics.length">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访表照片</div>
                     <image-previewer tag="richtext">
                                <img style="width: 80px!important;height: 80px;margin-right: 10px;"
                                     v-for="picItem in items.visitTablePics" :src="picItem.picUrl"
                                     :key="picItem.id">
                        </image-previewer>
                 </div>
             </div>
            </div>
            </div>
         </div>   
         <div class="body">
             <div id="print">
                 <div class="stulist" :style="`height: ${nobottommaxH-50}px;`">
                     <span v-for="(items,indexs) in dataList" :key="indexs"  @click="stufun(items.stuId,items.visitState)">
                         <span v-if="items.visitState==1">
                             <el-tag type="info" size="medium">{{items.stuName}}</el-tag>
                         </span>
                         <span v-else>
                            <el-tag v-if="items.stuId==stuId" size="medium">{{items.stuName}}</el-tag>
                            <el-tag type="success" size="medium" v-else>{{items.stuName}}</el-tag>
                         </span>
                           
                     </span>
                   
                 </div>
                 <div ref="print" :style="`minHeight: ${nobottommaxH-50}px;`">
                      <div  v-for="(items,indexs) in dataList" :key="indexs" v-if="items.stuId==stuId">
             <div class="h3" style="font-size: 24px;text-align: center;line-height: 80px;color: #303133;">{{items.name}}</div>
             <div class="ul">
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitTeacher">
                     <div class="name" style="font-size: 14px;line-height: 20px; position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访教师</div>
                     {{items.visitTeacher}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitTime">
                     <div class="name" style=" font-size: 14px;line-height: 20px; position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访时间</div>
                     {{items.visitTime}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitSite">
                     <div class="name" style=" font-size: 14px;line-height: 20px; position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">地点</div>
                     {{items.visitSite}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitContent.length">
                     <div class="name" style=" font-size: 14px;line-height: 20px;  position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访内容</div>
                    <span v-for="item in items.visitContent" :key="item.id">
                      {{item.name}}；
                    </span>
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitEffect">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访效果</div>
                     {{items.visitEffect}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.parentOpinion">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家长意见</div>
                     {{items.parentOpinion}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitPics.length">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访照片</div>
                    <image-previewer tag="richtext">
                                <img style="width: 80px!important;height: 80px;margin-right: 10px;"
                                     v-for="picItem in items.visitPics" :src="picItem.picUrl"
                                     :key="picItem.id">
                        </image-previewer>
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="items.visitTablePics.length">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访表照片</div>
                     <image-previewer tag="richtext">
                                <img style="width: 80px!important;height: 80px;margin-right: 10px;"
                                     v-for="picItem in items.visitTablePics" :src="picItem.picUrl"
                                     :key="picItem.id">
                        </image-previewer>
                 </div>
             </div>
                 </div>
             
            </div>
            </div>
         </div>    
     </div>
</div> 
</template>
<script>
import {
  getBatchStuHomeVisitInfo,
  getClassStuHomeVisitInfoList,
  getBatchHomeVisitGradeClassList
} from "@/api/homeVisit";
import mixin from "@/mixins/windowResize";
import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";
export default {
  data() {
    return {
      dataList: [],
      pagination: {
        batchId: this.$route.query.id,
        classId: 0,
        gradeId: 0
      },
      gradelist: [],
      classlist: [],
      stuId:""
    };
  },
  mixins: [mixin],
  components: { ImagePreviewer },
  created() {
     this.getBatchHomeVisitGradeClassLists();
  },
  methods: {
    printbig() {
      this.$print(this.$refs.printbig);
    },
    print() {
      this.$print(this.$refs.print);
    },
    stufun(stuId,visitState){
        if(visitState==2){
            this.stuId=stuId;
        }else{
             this.$router.push({
                    path: "homeVisitViewdetailseidt",
                    query: { id: this.$route.query.id,stuId:stuId}
                });
        }
      
    },
    getBatchHomeVisitGradeClassLists(){
       getBatchHomeVisitGradeClassList(this.$route.query.id)
                    .then(res => res.data)
                    .then(data => {
                        let mydata=data.data;
                        this.gradelist=mydata;
                        this.classlist=this.gradelist[0].childList;
                        this.pagination.classId=this.classlist[0].id;
                        this.pagination.gradeId=this.gradelist[0].id;
                        this.getClassStuHomeVisitInfoLists()
                    })
    },
     gradelistfun(){
             for(let i=0;i<this.gradelist.length;i++){
                    if(this.gradelist[i].id==this.pagination.gradeId){                        
                        this.classlist=this.gradelist[i].childList;
                        this.pagination.classId=this.classlist[0].id;
                    }
                }
              this.getClassStuHomeVisitInfoLists();
            },
    getClassStuHomeVisitInfoLists() {
        this.dataList=[];
         getClassStuHomeVisitInfoList(this.pagination)
                    .then(res => res.data)
                    .then(data => {
                        let mydata=data.data;                        
                        for(let i=0;i<mydata.length;i++){
                            this.dataList.push({
                                name: mydata[i].className + "    " + mydata[i].stuName + "   " + " 家访记录表",
                                visitTeacher:mydata[i].visitTeacher,
                                visitTime:mydata[i].visitTime,
                                visitEffect:mydata[i].visitEffect,
                                visitSite:mydata[i].visitSite,
                                parentOpinion:mydata[i].parentOpinion,
                                visitPics:mydata[i].visitPics ? JSON.parse(mydata[i].visitPics) : [],
                                visitContent:mydata[i].visitContent ? JSON.parse(mydata[i].visitContent) : [],
                                visitTablePics:mydata[i].visitTablePics ? JSON.parse(mydata[i].visitTablePics) : [],
                                stuId:mydata[i].stuId,
                                stuName:mydata[i].stuName,
                                visitState:mydata[i].visitState,
                            })
                        }
                        for(let i=0;i<this.dataList.length;i++ ){
                           if(this.dataList[i].visitState==2){
                             this.stuId=this.dataList[i].stuId;
                              return false
                           }
                        }
                        
                    })
            }    
  }
};
</script>
<style lang="scss" scoped>
.homeVisitViewdetails {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    .body {
      width: 810px;
      margin: 10px auto;
      position: relative;
      #print{
          width: 560px;          
      }
      .stulist{
          width: 240px;
          position:absolute;
          top:0;
          right:0;
          overflow: auto;
          .el-tag{
              min-width: 72px;
              margin: 3px;
              text-align: center;
              cursor:pointer;
          }
          
      }
    }
  }
}
</style>