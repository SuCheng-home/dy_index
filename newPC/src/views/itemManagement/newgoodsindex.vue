<template>
  <div class="goodsindex">
    <div class="goodsindex-tree" :style="`height:${notbmaxH+30}px`">
        <div class="top-name"><i class="el-icon-s-grid"></i> 物品管理</div>
       <el-tree  :data="data" node-key="id"  accordion   default-expand-all :expand-on-click-node="false" :default-expanded-keys="defaultExpandedArray">
        <span class="custom-tree-node" slot-scope="{ node, data }">
            <span  @click="() => Jump(data.id,data.pId,data.label)" class='span'>{{ node.label }}</span>          
        </span>
      </el-tree>
    </div>
    <div class="goodsindex-box clearfix" :style="`height:${notbmaxH}px`">
      <router-view :key="$route.fullPath"></router-view>
    </div>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {goodTypeData} from "@/api/itemManagement";
export default {
  data(){
    return{
      data: [],
      sourceData:[]
    }
  },   
  activated(){
      this.goodTypeDatas();
  },
 created(){
     this.goodTypeDatas();
 },
  mounted() {
        let _this = this //很重要把父路由的vue实例赋给_this
        _this.$root.$on('next', function () {  //监听next事件，这里$root很重要，不懂去官网介绍
            _this.onclidkfun() //调用父路由中的方法
        })
      },
  methods:{ 
    //获取列表  
    Jump(id,pId,name) {         
        this.$router.push({
                    path: 'newgoodslist',
                    query: {id:id,pId:pId,name:name}
        });
     },
     goodTypeDatas(){
        goodTypeData().then(res => {
            const data = res.data.data;
            this.sourceData=data;
            let packageArray = new Array();
            this.data = this.packageOrg(0, packageArray); 
            if(this.data.length){
             this.Jump(this.data[0].id,this.data[0].pId,this.data[0].label);
            }else{
              this.Jump(0,0,'');
            }
            
        }).catch();
     },
     onclidkfun(){
        goodTypeData().then(res => {
            const data = res.data.data;
            this.sourceData=data;
            let packageArray = new Array();
            this.data = this.packageOrg(0, packageArray); 
        }).catch();
     },
     packageOrg(pId, packageArray) {//组装数据
                let filterArray = this.sourceData.filter(function (item) {
                    return item.pId == pId;
                });                
                filterArray.forEach(item => {
                    if (item.hasChild == 0) {
                        let childArray = new Array();                        
                        packageArray.push({
                            id: item.id,
                            label: item.name,
                            pId: item.pId,
                            children: this.packageOrg(item.id, childArray),
                        });
                    } else {
                        packageArray.push({
                            id: item.id,
                            label: item.name,
                            pId: item.pId,
                        });
                    }
                })
                return packageArray;
            },
    
  },
  mixins:[mixins]
}
</script>
<style lang="scss" scoped>
.goodsindex{
  position: relative;
  .span{
    min-width: 80px;
    display: inline-block;
    font-size: 13px;
  }
  *{
    box-sizing: border-box;
  }
  .goodsindex-tree{
    position: absolute;
    width: 200px;
    overflow: auto;
    top:0;
    left: 0;
    border-right:2px #efefef solid;
    padding-top:10px;
  }
  .goodsindex-box{
    padding-left: 200px;
  }
  .top-name{
          padding: 10px;
    font-size: 16px;
    line-height: 24px;
    i{
        font-size: 24px;
    color: #409EFF;
    float: left;
    margin-right: 10px;
    }
  }
}
</style>


