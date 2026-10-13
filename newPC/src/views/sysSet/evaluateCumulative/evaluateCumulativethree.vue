<template>
  <div class="evaluateCumulativethree">
     <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="评价维度设置" name="one"></el-tab-pane>
      <el-tab-pane label="换算设置" name="two" v-if="myishide!=2"></el-tab-pane>
      <el-tab-pane label="称号晋升设置" name="three">
          <div class="header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="evaluateCumulativethreeadd()">新增</el-button>
          </div>
          <div class="body" :style="`height: ${maxH-20}px;`">
            <div class="ulbox">
              <div class="ul">
              <div class="li" v-for="(item,index) in datalist" :key="index" v-if="index<5">
                <div class="img"><img :src="item.logo" alt=""></div>
                <div class="name">{{item.name}}<i class="el-icon-edit" @click="evaluateCumulativethreeeidt(item.id)"></i><i class="el-icon-delete" @click="delAssessMedalByIds(item.id)"></i></div>
                <div class="name">所需花朵数：{{item.flowerNum}}</div>
                <img class="imgone" v-if="index<4" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/evaluateCumulative/one.png" alt="">
                 <img class="imgtwo" v-if="index==4" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/evaluateCumulative/two.png" alt="">
              </div>
            </div>
             <div class="ul">
              <div class="li liright" v-for="(item,index) in datalist" :key="index" v-if="index>4&&index<10">
                <div class="img"><img :src="item.logo" alt=""></div>
                <div class="name">{{item.name}}<i class="el-icon-edit" @click="evaluateCumulativethreeeidt(item.id)"></i><i class="el-icon-delete" @click="delAssessMedalByIds(item.id)"></i></div>
                <div class="name">所需花朵数：{{item.flowerNum}}</div>
                <img class="imgfour" v-if="index<9" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/evaluateCumulative/four.png" alt="">
                <img class="imgthree" v-if="index==9" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/evaluateCumulative/mythree.png" alt="">
              </div>
            </div>
            <div class="ul">
              <div class="li" v-for="(item,index) in datalist" :key="index" v-if="index>9">
                <div class="img"><img :src="item.logo" alt=""></div>
                <div class="name">{{item.name}}<i class="el-icon-edit" @click="evaluateCumulativethreeeidt(item.id)"></i><i class="el-icon-delete" @click="delAssessMedalByIds(item.id)"></i></div>
                <div class="name">所需花朵数：{{item.flowerNum}}</div>
                <img class="imgone" v-if="index<14" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/evaluateCumulative/one.png" alt="">                 
              </div>
            </div>
            </div>            
            <default-page Mes="暂无称号" v-if="ishide==2"></default-page>              
          </div>
      </el-tab-pane>
    </el-tabs> 
  </div>
</template>
<script>
  import mixins from '@/mixins/windowResize';
  import { getAssessMedalList,delAssessMedalById,getSchoolAssessDimensionList} from "@/api/evaluateCumulative";
  import DefaultPage from "@/components/DefaultPage";
  export default {
    data() {
      return {
        activeName:'three',
        datalist:[],
        ishide:0,
        myishide:0,
      }
    },
    mixins: [mixins],
    components: { DefaultPage},
    created() {
      this.getAssessMedalLists();
      this.getSchoolAssessDimensionLists();
    },
    methods: {  
       getSchoolAssessDimensionLists(){
        getSchoolAssessDimensionList().then(res => res.data).then(data => {
          if(data.data.length==0){
            this.myishide=2;
          }
        });
      },
       getAssessMedalLists(){
        getAssessMedalList().then(res => res.data).then(data => {
          this.datalist=data.data;
          if(data.data.length==0){
            this.ishide=2;
          }
        });
      },   
      delAssessMedalByIds(id){
      this.$confirm("确认要删除吗？", "删除", {confirmButtonText: "确定",cancelButtonText: "取消",type: "warning",lockScroll: false }).then(() => {         
          delAssessMedalById(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.getAssessMedalLists();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }).catch(() => {});
      }, 
      tabsfun(){
        if(this.activeName=='one'){
           this.$router.replace({path: 'evaluateCumulativeone'});
        }else if(this.activeName=='two'){
            this.$router.replace({path: 'evaluateCumulativetwo'});
        }
      },
      evaluateCumulativethreeadd(){
           this.$router.push({path: 'evaluateCumulativethreeadd'});
      },
      evaluateCumulativethreeeidt(id){
           this.$router.push({path: 'evaluateCumulativethreeeidt',query: { id: id }});
      }
    
    }
  }
</script>

<style lang="scss" scoped>
.evaluateCumulativethree{
  padding: 12px;
  .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
  }
  .body{
    overflow: auto;
    .ulbox{      
      width: 1000px;
      margin: 25px auto;
      .ul{
      width: 1000px;
      height: 138px;
      .li{
        width: 200px;
        box-sizing: border-box;
        float: left;
        position: relative;
        padding-right: 100px;
        .img{
        width: 100px;
        height: 50px;
        display: block;
        margin: 3px 0px;
        position: relative;
        z-index: 100;
        background: #fff;
        img{
          width: 100%;
          height: 100%;
        }
        }
        .imgone{
           position: absolute;
          top: 25px;
          left: 55px;
        }
        .imgfour{
           position: absolute;
          top: 25px;
          right: 140px;
        }
        .imgtwo{
          position: absolute;
          top: 25px;
          right: 50px;
          z-index: 200;
        }
        .imgthree{
          position: absolute;
          top: 25px;
          left:-28px;
          z-index: 200;
        }
        .name{
          font-size: 13px;
          line-height: 20px;
          color:#606266;
          padding-bottom: 5px;
            i{
             margin: 0 5px;
             color: #409EFF;
             font-size: 18px;
             cursor:pointer;
             float: right;
             line-height: 20px;
           }
           .el-icon-delete{
             color: #F56C6C;
           }

        }
      }
      .liright{
        float: right;
      }
    }
    }    
  }
}
</style>
