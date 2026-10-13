<template>
<div class="growthArchivesSetup"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="saveSchoolGrowthTypeDicss()">保存</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
      <el-checkbox-group v-model="checkList">
            <el-checkbox :label="item.code" v-for="item in datalist" :key="item.id">
                {{item.value}}
            </el-checkbox>
        </el-checkbox-group>
     </div>   
</div> 
</template>
<script>
import {findDicsByCode,getSchoolGrowthTypeDicList,saveSchoolGrowthTypeDics} from "@/api/growthArchives";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      datalist: [],
      checkList:[]
    };
  },
  mixins: [mixin],
  created() {
    this.findDicsByCodes();
  },
  methods: {
    //获取学校字典
    findDicsByCodes() {
      findDicsByCode()
        .then(res => res.data)
        .then(data => {
            this.datalist=data.data;
        });
      getSchoolGrowthTypeDicList()
        .then(res => res.data)
        .then(data => {
           let mydata=data.data;
           this.checkList=[];
           for(let i=0;i<mydata.length;i++){
                this.checkList.push(mydata[i].typeCode)
           }
        });
    },
    //保存
    saveSchoolGrowthTypeDicss(){
        if(!this.checkList.length){
        this.$message({type: "warning",message: "至少选择一个类型!"});
                    return
        }
        let list=[];
        for(let i=0;i<this.checkList.length;i++){
            for(let j=0;j<this.datalist.length;j++){
              if(this.checkList[i]==this.datalist[j].code){
                  list.push({
                      typeCode:this.datalist[j].code,
                      typeName:this.datalist[j].value,
                      useType:1
                  })
              }
            }
        }
        saveSchoolGrowthTypeDics(list)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "保存成功!"
                });
              }
            })
            .catch(err => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.growthArchivesSetup {
  padding: 15px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    padding: 30px 0;
    width: 810px;
    margin: 0 auto;
  }
}
</style>