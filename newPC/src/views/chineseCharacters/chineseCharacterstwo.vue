<template>
    <div class="chineseCharactersindex">
        <div class="top">
            <el-select size="medium" v-model="gradeId" placeholder="请选择年级" @change="gradeIdFun">
                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
        </div>
        <div class="content" :style="`height:${notbmaxH -110}px`">
            <div v-if="onelist.length>0">
                <div class="top-name">识字之星(top10)</div>
                <div class="stu-ul">
                    <div class="stu-li" v-for="(item,index) in onelist" :key="index">
                        <img :src="item.avatar" alt="">
                        <div class="stu-li__stuname">{{item.studentName}}</div>
                        <div class="stu-li__classname">{{item.className}}</div>
                        <div class="stu-li__count">{{item.rightCount}}</div>
                    </div>
                </div>
                <div class="top-name">重点关注(end10)</div>
                <div class="stu-ul">
                    <div class="stu-li" v-for="(item,index) in twolist" :key="index">
                        <img :src="item.avatar" alt="">
                        <div class="stu-li__stuname">{{item.studentName}}</div>
                        <div class="stu-li__classname">{{item.className}}</div>
                        <div class="stu-li__count">{{item.rightCount}}</div>
                    </div>
                </div>
            </div>
            <default-page Mes="暂无数据" v-else></default-page>
        </div>

    </div>
</template>
<script>
    import mixins from '@/mixins/windowResize';
    import {querySchoolGrade,getGradeRankStuList} from '@/api/chineseCharacters';
    import DefaultPage from '@/components/DefaultPage';
    export default {
        data(){
            return{
              gradeId:'',
              gradeList:[],
              onelist:[],
              twolist:[],
            }
        },
        mixins:[mixins],
        components: {DefaultPage},
        created(){
              querySchoolGrade().then(res => res.data).then(data => {
                    this.gradeList = data.data;
                    if (data.data.length !== 0) {
                        this.gradeId = data.data[0].id;
                        this.getGradeRankStuLists();
                    }
                });
        }, 
        methods:{

            //切换年级 
            gradeIdFun(){
                 this.getGradeRankStuLists();
            },
            //获取详情
            getGradeRankStuLists(){
                 getGradeRankStuList(this.gradeId,10,10).then(res => res.data).then(data => {
                    if(data.code==200){
                        this.onelist=data.data.firstRankList;
                        this.twolist=data.data.lastRankList;
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


