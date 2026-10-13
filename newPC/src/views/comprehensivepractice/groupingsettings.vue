<template>
<div class="homeVisitadd"  v-loading="loading">
     <div class="header"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="groupingsettingsadd()">新增</el-button>   
      </div>
     <div class="body ">
         <el-table ref="table" stripe :data="dataList" border fit highlight-current-row
                  style="width: 100%" :height="nobottommaxH ">
            <el-table-column align="center" label="分组名称" show-overflow-tooltip >
                <template slot-scope="scope">
                    <span >
                        {{scope.row.groupName}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="学生" show-overflow-tooltip>
                <template slot-scope="scope">
                     {{funname(scope.row.groupStuList)}}
                    <!-- <range-list :userJson="JSON.parse(scope.row.studentsJson).userJson" :departJson="JSON.parse(scope.row.studentsJson).departJson"></range-list> -->
                </template>
            </el-table-column>
            <el-table-column align="center" label="排序" >
                <template slot-scope="scope">
                    <span>{{scope.row.orderNo}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button  size="small" type="text" @click="groupingsettingseidt(scope.row.id)" >编辑</el-button>
                    <el-button  size="small" type="text" @click="delActivityGroupByGroupIds(scope.row.id)"  class="buttontextred">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
     </div>
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import moment from "moment";
import RangeList from "@/components/RangeList/RangeList";
import {delActivityGroupByGroupId,getActivityGroupListByActivityId} from "@/api/comprehensivepractice";
export default {
  data() { 
    return {   
        dataList:[]
    };
  },
  components: { RangeList},
  mixins: [mixin],
  created() {
      this.getActivityGroupListByActivityIds();
  },
  methods: {
      funname(list){
          let name="";
          for(let i=0;i<list.length;i++){
              name=name+" "+list[i].stuName+" "
          }
        return name;
      },
    getActivityGroupListByActivityIds(){
      getActivityGroupListByActivityId(this.$route.query.id).then(res => res.data).then(data => {
            this.dataList=data.data;            
        })
    },
    delActivityGroupByGroupIds(id) {
                this.$confirm('是否删除', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delActivityGroupByGroupId(id).then(res => res.data).then(data => {
                        if (data.code === 200) {
                            this.$message({
                                message: "删除成功！",
                                type: "success"
                            });
                            this.getActivityGroupListByActivityIds()
                        }
                    })

                }).catch(() => {
                });
    },
     groupingsettingseidt(id){
                this.$router.push({
                            path: "groupingsettingseidt",
                            query: {id:id,activityId:this.$route.query.id}
                    })            
            },
            groupingsettingsadd(){
                this.$router.push({
                            path: "groupingsettingsadd",
                            query: {activityId:this.$route.query.id}
                    })            
            },
    
  }
};
</script>
<style lang="scss" scoped>
.homeVisitadd {
  padding:12px;
  .header {
    padding-bottom: 10px;
  }
  .range-list{
      padding: 3px;
  }
  
}
</style>