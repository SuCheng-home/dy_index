<template>
<div class="foodReservationclassification"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="foodReservationclassificationadd()">添加分类</el-button>     
      </div>
        <el-table stripe :data="dataList"  border fit highlight-current-row style="width: 100%" :height="nobottommaxH">
                <el-table-column align="center" label="分类名称" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.typeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="支付方式" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if="scope.row.typePayWay==1">线上</span>
                        <span v-if="scope.row.typePayWay==2">线下</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="排序">
                    <template slot-scope="scope">
                        <span>{{scope.row.typeOrder}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="负责人">
                    <template slot-scope="scope">
                      <span  v-for="(item,index) in scope.row.userList" :key="index">&nbsp;&nbsp;{{item.userName}}&nbsp;&nbsp;</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button @click="deletePastryTypeByIds(scope.row.id)" type="text" size="small" class="buttontextred">删除</el-button>
                        <el-button type="text" size="small" @click="foodReservationclassificationeidt(scope.row.id)">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>    
</div> 
</template>
<script>
import {queryPastryTypeBySchoolId,deletePastryTypeById} from "@/api/foodReservation";
import mixin from "@/mixins/windowResize";
import {mapGetters} from 'vuex';
export default {
  data() {
    return {
      dataList: []
    };
  },
  mixins: [mixin],
   computed: {
    ...mapGetters(['schoolInfo']),
  },
  created() {
      this.queryPastryTypeBySchoolIds();
  },
  methods: {
    //获取列表
    queryPastryTypeBySchoolIds(){
        queryPastryTypeBySchoolId(this.schoolInfo.id).then(res => res.data).then(data => {
            this.dataList=data.data;
        })
    },
    //删除
    deletePastryTypeByIds(id){
        this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deletePastryTypeById(id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
               this.queryPastryTypeBySchoolIds()
              }
            })
            .catch(err => {});
        })
        .catch(() => {});

    },
    //新增
    foodReservationclassificationadd(){
         this.$router.push({
            path: "foodReservationclassificationadd"
          });
    },
    //编辑
    foodReservationclassificationeidt(id){
         this.$router.push({
        path: "foodReservationclassificationeidt",
        query: {id: id}
      });
    },
  }
};
</script>
<style lang="scss" scoped>
.foodReservationclassification{
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
   
}
</style>