<template>
    <div class="chineseCharactersindex">
        <div class="top">
             <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
        </div>
        <div class="content" :style="`height:${notbmaxH -110}px`">
                <div class="top-name"  v-if="onelist.length">男生名单({{onelist.length}}人/次)</div>
                <div class="stu-ul"  v-if="onelist.length">
                    <div class="stu-li" v-for="(item,index) in onelist" :key="index">
                        <img :src="item.stuAvatar" alt="">
                        <div class="stu-li__stuname">{{item.stuName}}</div>
                        <!-- <div class="stu-li__classname">{{item.stuNo}}</div> -->
                        <!-- <div class="stu-li__count">{{item.stuNo}}</div> -->
                    </div>
                </div>
                <div class="top-name" v-if="twolist.length">女生名单({{twolist.length}}人/次)</div>
                <div class="stu-ul"  v-if="twolist.length">
                    <div class="stu-li" v-for="(item,index) in twolist" :key="index">
                        <img :src="item.stuAvatar" alt="">
                        <div class="stu-li__stuname">{{item.stuName}}</div>
                        <!-- <div class="stu-li__classname">{{item.stuNo}}</div> -->
                        <!-- <div class="stu-li__count">{{item.stuNo}}</div> -->
                    </div>
                </div>
        </div>

    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import {getZoneClassGenderDataList} from '@/api/devideSectionBeiyou';
    import DefaultPage from '@/components/DefaultPage';
    export default {
        data(){
            return{
              onelist:[],
              twolist:[],
              beginDate: this.$route.query.beginDate,
                endDate: this.$route.query.endDate,
                gradeId: this.$route.query.gradeId,
                classId: this.$route.query.classId,
                schoolTimeId: this.$route.query.schoolTimeId,
                 zoneTypeCode: this.$route.query.zoneTypeCode,
            }
        },
        mixins:[mixins],
        components: {DefaultPage},
        created(){
            this.getZoneClassGenderDataList()
        }, 
        methods:{
            //获取详情
            getZoneClassGenderDataList(){
                 getZoneClassGenderDataList({
                beginDate: this.beginDate,
                endDate: this.endDate,
                gradeId: this.gradeId,
                classId: this.classId,
                schoolTimeId: this.schoolTimeId,
                zoneTypeCode: this.zoneTypeCode,
                gender:1
            }).then(res => res.data).then(data => {
                    if(data.code==200){
                        console.log(data.data)
                        this.onelist=data.data;
                    }
                });
                 getZoneClassGenderDataList({
                beginDate: this.beginDate,
                endDate: this.endDate,
                gradeId: this.gradeId,
                classId: this.classId,
                schoolTimeId: this.schoolTimeId,
                gender:2,
                zoneTypeCode: this.zoneTypeCode,
            }).then(res => res.data).then(data => {
                    if(data.code==200){
                        this.twolist=data.data;
                    }
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
.chineseCharactersindex{
    padding: 12px;
    *{        
        box-sizing: border-box;
    }
    .top{
      padding-bottom: 10px;
      border-bottom: 1px solid #e7eaec;     
    }
    .content{
       overflow:auto;
       .top-name{
           margin:20px 0;
           border-left:5px #409EFF solid;
           line-height: 30px;
           padding-left: 10px;
           font-size: 20px;
           color:#666;
           font-weight: 600; 
       }
       .stu-ul{
           overflow: hidden;
           .stu-li{
               float: left;
               width: 10%;
               img{
                   display: block;
                   width: 60px;
                   height: 60px;
                   border-radius: 50%;
                   margin: 0 auto;
               }
               div {
                   font-size: 14px;
                   text-align: center;
                   line-height: 22px;
               }
               .stu-li__stuname {
                   color: #333;
               }
               .stu-li__classname {
                   color: #aaa;
                   font-size: 12px;
               }
               .stu-li__count {
                   font-size: 18px;
               }
           }
       }
    }
}
  
</style>


