<template>
<div class="packageLibraryindex"  >
     <div class="top"> 
       <template v-if="isStandalone">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            </template>  
         <el-button type="primary" size="medium"   @click="packageLibraryadd()">添加套餐</el-button>     
      </div>
     <div class="subject " :style="`height: ${nobottommaxH}px;`">
                    <div class="box" v-for="(items,indexs) in datalist" :key="indexs">  
                      <el-tag size="small" v-if="items.setType==1" type="success">早餐</el-tag>
                      <el-tag size="small" v-if="items.setType==2">午餐</el-tag>
                      <el-tag size="small" v-if="items.setType==3" type="warning">晚餐</el-tag>
                        <div class="box-top">
                           <el-image
                          style="width: 100px;
                        height: 100px;
                        margin-right: 5px;
                        float: left;
                        margin-bottom: 8px;"
                          :src="items.setPic"
                          fit="cover"></el-image>
                          <!-- <img :src="items.setPic" alt="">  -->
                          <div v-if="items.foodList.length">
                              <div class="li"  v-for="(item,index) in items.foodList" :key="index">{{item.name}}&nbsp;&nbsp;{{item.weight}}g</div>
                          </div>
                          <div v-else >
                              <div v-html="items.content"></div>  
                          </div>                          
                        </div> 
                        <div class="box-foot">{{items.name}}
                            <i class="el-icon-delete" @click="deleteMealSets(items.id)"></i>
                            <i class="el-icon-edit" @click="packageLibraryeidt(items.id)"></i>                           
                          </div>                  
                    </div>
          <default-page Mes="暂无套餐" v-if="ishide==0"></default-page>
     </div>
</div> 
</template>
<script>
import {getMealSetBySchoolId,deleteMealSet} from "@/api/recipeOrdering";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      datalist: [],
      ishide:1
    };
  },
  mixins: [mixin],
  created() {
    this.getMealSetBySchoolIds();
  },
  computed: {
            ...mapGetters(['isStandalone'])
        },
  components: { DefaultPage},
  methods: {
    //新增
    packageLibraryadd(){
      this.$router.push({
            path: "packageLibraryadd"
          });
    },
    //编辑
    packageLibraryeidt(id){
      this.$router.push({
            path: "packageLibraryeidt", query: {id: id}
          });
    },

    //获取详情
    getMealSetBySchoolIds() {
      getMealSetBySchoolId()
        .then(res => res.data)
        .then(data => {
           for(let i=0;i<data.data.length;i++){
               data.data[i].content=data.data[i].content.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, '&nbsp;');
            }
            this.datalist=data.data;
            this.ishide=this.datalist.length;            
        });
    },
    //删除
    deleteMealSets(id) {
      this.$confirm("确认要删除套餐吗？", "删除套餐", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteMealSet(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除套餐成功！");
               this.getMealSetBySchoolIds();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },
   
  }
};
</script>
<style lang="scss" scoped>
.packageLibraryindex {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    padding-top: 10px;
    overflow: auto;
    
  }
  .box{
    width: 360px;
    color: #606266;
    background: #fff;
    border: 1px solid #E4E7ED;
    margin: 5px;
    border-radius: 5px;
    padding: 10px 10px;
    float: left;
    position: relative;
    .el-tag{
      position: absolute;
    right: 10px;
    top:10px
    }
    .box-top{
      overflow: hidden;
      font-size: 12px;
      line-height: 18px;
      
      img{
        width: 100px;
        height: 100px;
        margin-right: 5px;
        float: left;
        margin-bottom: 8px;
      }
    } 
    .box-foot{
      padding-top: 5px;
      font-size: 14px;
       color:#409EFF;
      i{
        float: right;
         color:#409EFF;
         font-size: 20px;
         margin: 0 5px;
         cursor:pointer;
      }
       .el-icon-delete{
          color: #F56C6C
        }
    }  
  }
}
</style>