<template>
<div class="homeVisitViewdetailsdetails"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="homeVisitViewdetailseidt()">编辑</el-button>   
         <el-button type="primary" size="medium"   v-if="visitState==2" @click="print()">打印</el-button>  
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
         <div class="body" ref="print" id="print">
             <div class="h3" style="font-size: 24px;text-align: center;line-height: 80px;color: #303133;">{{name}}</div>
             <div class="ul">
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="visitTeacher">
                     <div class="name" style="font-size: 14px;line-height: 20px; position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访教师</div>
                     {{visitTeacher}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="visitTime">
                     <div class="name" style=" font-size: 14px;line-height: 20px; position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访时间</div>
                     {{visitTime}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="visitSite">
                     <div class="name" style=" font-size: 14px;line-height: 20px; position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">地点</div>
                     {{visitSite}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="visitContent.length">
                     <div class="name" style=" font-size: 14px;line-height: 20px;  position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访内容</div>
                    <span v-for="item in visitContent" :key="item.id">
                      {{item.name}}；
                    </span>
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="visitEffect">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访效果</div>
                     {{visitEffect}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="parentOpinion">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家长意见</div>
                     {{parentOpinion}}
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="visitPics.length">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访照片</div>
                    <image-previewer tag="richtext">
                                <img style="width: 80px!important;height: 80px;margin-right: 10px;"
                                     v-for="picItem in visitPics" :src="picItem.picUrl"
                                     :key="picItem.id">
                        </image-previewer>
                 </div>
                 <div class="li"  style="font-size: 14px;line-height: 20px;position: relative;padding:10px 0 10px 120px;color:#909399;" v-if="visitTablePics.length">
                     <div class="name" style=" font-size: 14px;line-height: 20px;   position: absolute;left: 0;width: 110px;text-align: right;color: #606266;">家访表照片</div>
                     <image-previewer tag="richtext">
                                <img style="width: 80px!important;height: 80px;margin-right: 10px;"
                                     v-for="picItem in visitTablePics" :src="picItem.picUrl"
                                     :key="picItem.id">
                        </image-previewer>
                 </div>
             </div>

         </div>    
         <default-page Mes="未家访" v-if="visitState==1"></default-page>   
     </div>
</div> 
</template>
<script>
import { getBatchStuHomeVisitInfo } from "@/api/homeVisit";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
export default {
  data() {
    return {
      id: this.$route.query.id,
      stuId: this.$route.query.stuId,
      name: "",
      visitTime: "",
      visitTeacher: "",
      visitSite: "",
      visitContent: [],
      visitEffect: "",
      visitPics: [],
      visitTablePics: [],
      visitState:1
    };
  },
  mixins: [mixin],
  components: {ImagePreviewer,DefaultPage},
  created() {
    this.getBatchStuHomeVisitInfos();
  },
  methods: {
    print() {
      this.$print(this.$refs.print);
    },
    getBatchStuHomeVisitInfos() {
      getBatchStuHomeVisitInfo(this.id, this.stuId)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          this.name =
            mydata.className + "    " + mydata.stuName + "   " + " 家访记录表";
          this.visitTeacher = mydata.visitTeacher;
          this.visitTime = mydata.visitTime;
          this.visitEffect = mydata.visitEffect;
          this.visitSite = mydata.visitSite;
          this.parentOpinion = mydata.parentOpinion;
          this.visitPics = mydata.visitPics?JSON.parse(mydata.visitPics):[];
          this.visitContent = mydata.visitContent?JSON.parse(mydata.visitContent):[];
          this.visitTablePics = mydata.visitTablePics?JSON.parse(mydata.visitTablePics):[];
          this.visitState=mydata.visitState;
        });
    },
    homeVisitViewdetailseidt() {
      this.$router.push({
        path: "homeVisitViewdetailseidt",
        query: { id: this.id, stuId: this.stuId }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.homeVisitViewdetailsdetails {
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
    }
  }
}
</style>