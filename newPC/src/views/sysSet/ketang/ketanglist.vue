<template>
  <div class="honourGradeList padding ketanglist">
    <div class="header">
        <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
    </div>
    <div>
      <el-table ref="multipleTable" :data="datalist" border :height="nobottommaxH" style="width: 100%">        
        <el-table-column label="学科" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.curriculumName }}</template>
        </el-table-column>
        <el-table-column label="加分项" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
              {{ scope.row.addname }}
          </template>
        </el-table-column>
        <el-table-column label="减分项" align="center" show-overflow-tooltip>
             <template slot-scope="scope">
              {{ scope.row.lessname }}
             </template>
        </el-table-column>
        <el-table-column prop="address" align="center" label="操作" width="220">
          <template slot-scope="scope">
              <el-button size="small" type="text"  @click="popfun(scope.row)">编辑</el-button>             
          </template>
        </el-table-column>
      </el-table>
      
    </div>
    <el-dialog title="编辑学科评价项" :visible.sync="isShowDialog" width="880px">
            <div class="title">加分项</div>
            <el-checkbox-group v-model="checkboxGroup" size="medium">
              <el-checkbox :label="item.id" border :key="item" v-for="item in oneList"><img class="img" :src="item.cover" />{{item.title}}</el-checkbox>
            </el-checkbox-group>
            <div class="title">减分项</div>
             <el-checkbox-group v-model="checkboxGroup" size="medium">               
              <el-checkbox :label="item.id" border :key="item" v-for="item in twoList"><img class="img" :src="item.cover" />{{item.title}}</el-checkbox>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowDialog = false">取 消</el-button>
                <el-button type="primary" @click="addSchoolBehaviorTypeCurrList">确 定</el-button>
              </span>
        </el-dialog>
  </div>
</template>
<script>
import mixins from "@/mixins/windowResize";
import { getCurrListBySchoolId,addSchoolBehaviorTypeCurrList,getSchoolBehaviorTypeListBySchoolId} from "@/api/ketang";
export default {
  data() {
    return {
      datalist: [],
      oneList:[],
      twoList:[],
      isShowDialog:false,
      checkboxGroup:[]
    };
  },
  mixins: [mixins],
  mounted() {
      getSchoolBehaviorTypeListBySchoolId(0)
                                    .then(res => res.data)
                                    .then(data => {
                                    this.oneList=data.data;
                                    });
      getSchoolBehaviorTypeListBySchoolId(1)
                                    .then(res => res.data)
                                    .then(data => {
                                    this.twoList=data.data;
                                    });
   this.getCurrListBySchoolId()
  },
  methods: {
    popfun(obj){
       this.isShowDialog=true
       this.checkboxGroup=[]
       this.curriculumId=obj.curriculumId
       for(let i=0;i<obj.addTypeCurrList.length;i++){
          this.checkboxGroup.push(obj.addTypeCurrList[i].typeId)
       }
       for(let i=0;i<obj.lessTypeCurrList.length;i++){
          this.checkboxGroup.push(obj.lessTypeCurrList[i].typeId)
       }
    },
    addSchoolBehaviorTypeCurrList() {
      let list=[]
      for(let i=0;i<this.checkboxGroup.length;i++){
        for(let j=0;j<this.oneList.length;j++){
          if(this.checkboxGroup[i]==this.oneList[j].id){
            list.push({
              curriculumId:this.curriculumId,
              title:this.oneList[j].title,
              typeId:this.oneList[j].id,
              type:this.oneList[j].type,
            })
          }
        }
        for(let j=0;j<this.twoList.length;j++){
          if(this.checkboxGroup[i]==this.twoList[j].id){
            list.push({
              curriculumId:this.curriculumId,
              title:this.twoList[j].title,
              typeId:this.twoList[j].id,
              type:this.twoList[j].type,
            })
          }
        }
      }
      if(list.length==0){
        this.$message.error('至少绑定一个评价项');
        return;
      }
               addSchoolBehaviorTypeCurrList(list).then(res => {
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: 'success',
                                            message:'编辑成功！'
                                        });
                                        this.isShowDialog=false;
                                        this.getCurrListBySchoolId()
                                    }
                                   }).catch(function () {})
            },
       getCurrListBySchoolId(){
           getCurrListBySchoolId()
      .then(res => {
         this.datalist=res.data.data;
         let addname='';
         let lessname='';
         for(let i=0;i<this.datalist.length;i++){
             addname='';
             lessname='';
            for(let j=0;j<this.datalist[i].addTypeCurrList.length;j++){
                addname=addname+this.datalist[i].addTypeCurrList[j].title+';'
            };
            for(let j=0;j<this.datalist[i].lessTypeCurrList.length;j++){
                lessname=lessname+this.datalist[i].lessTypeCurrList[j].title+';'
            };
             this.datalist[i].addname=addname;
             this.datalist[i].lessname=lessname;
           

         }
        
      })
      .catch(function() {});
       }
  }
};
</script>
<style>
.ketanglist .img{
    width: 20px;
    height: 20px;
    float: left;
    margin-right: 5px;
}
.ketanglist .el-checkbox{
 width:200px;
 margin:0 5px 5px 5px !important;
}
</style>
<style lang="scss" scoped>
.padding {
  padding:12px;
  box-sizing: border-box;
}
.honourGradeList {
  .header {
    padding-bottom: 10px;
  }
}
.title {
        line-height: 18px;
        border-left: 3px #409eff solid;
        padding-left: 10px;
        font-size: 14px;
        color: #666;
        font-weight: 600;
        margin: 10px 0;
    }
</style>

