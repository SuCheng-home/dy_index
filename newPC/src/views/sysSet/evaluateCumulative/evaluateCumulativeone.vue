<template>
  <div class="evaluateCumulativeone">
     <el-tabs type="border-card"  v-model="activeName" @tab-click="tabsfun()">
      <el-tab-pane label="评价维度设置" name="one">
         <div class="header">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="evaluateCumulativeoneadd()">新增</el-button>
          </div>
          <div class="body" :style="`height: ${maxH-20}px;`">
            <div class="ul">
              <div class="li" v-for="item in datalist" :key="item.id">
                <img :src="item.logo" alt="">
                <div class="name">{{item.name}}</div>
                <div class="pop"><i class="el-icon-edit" @click="evaluateCumulativeoneeidt(item.id)"></i><i class="el-icon-delete" @click="delAssessDimensionByIds(item.id)"></i></div>
              </div>
            </div>
            <default-page Mes="暂无评价维度" v-if="ishide==2"></default-page>
          </div>
      </el-tab-pane>
      <el-tab-pane label="换算设置" name="two" v-if="ishide!=2"></el-tab-pane>
      <el-tab-pane label="称号晋升设置" name="three"></el-tab-pane>
    </el-tabs> 
  </div>
</template>
<script>
  import mixins from '@/mixins/windowResize';
  import {delAssessDimensionById,getSchoolAssessDimensionList} from '@/api/evaluateCumulative';
  import DefaultPage from "@/components/DefaultPage";
  export default {
    data() {
      return {
        activeName:'one',
        ishide:0,
        datalist:[]
      }
    },
    mixins: [mixins],
    components: { DefaultPage},
    created() {
        this.getSchoolAssessDimensionLists();
    },
    methods: {   
      getSchoolAssessDimensionLists(){
        getSchoolAssessDimensionList().then(res => res.data).then(data => {
          this.datalist=data.data;
          if(data.data.length==0){
            this.ishide=2;
          }
        });
      },
      delAssessDimensionByIds(id){
      this.$confirm("确认要删除吗？", "删除", {confirmButtonText: "确定",cancelButtonText: "取消",type: "warning",lockScroll: false }).then(() => {         
          delAssessDimensionById(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.getSchoolAssessDimensionLists();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        }).catch(() => {});
      },
      tabsfun(){
        if(this.activeName=='two'){
           this.$router.replace({path: 'evaluateCumulativetwo'});
        }else if(this.activeName=='three'){
            this.$router.replace({path: 'evaluateCumulativethree'});
        }
      },
      evaluateCumulativeoneadd(){
           this.$router.push({path: 'evaluateCumulativeoneadd'});
      },
      evaluateCumulativeoneeidt(id){
           this.$router.push({path: 'evaluateCumulativeoneeidt',query: { id: id }});
      }
    
    }
  }
</script>

<style lang="scss" scoped>
.evaluateCumulativeone{
  padding: 12px;
  .header {
      padding-bottom: 10px;
      border-bottom: 1px solid #eee;
  }
  .body{
    overflow: auto;
    .ul{
      overflow: hidden;
      .li{
        float: left;
        width: 120px;
        height: 150px;
        margin: 10px 20px;
        position: relative;
        .name{
          text-align: center;
          font-size: 14px;
          line-height: 30px;
          color:#606266;
        }
        img{
          width: 120px;
          height: 120px;
        }
        .pop{
            position: relative;
            width: 100px;
            height: 100px;
            top: -145px;
            left: 10px;
            background: rgba(0,0,0,0.4);
            line-height: 100px;
            text-align: center;
            border-radius: 50%;
            display: none;
           i{
             margin: 0 5px;
             color: #409EFF;
             font-size: 18px;
             cursor:pointer;
           }
           .el-icon-delete{
             color: #F56C6C;
           }
        }
      }
      .li:hover{
        .pop{
          display:block;
        }
      }
    }
  }
}
</style>
