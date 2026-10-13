<template>
<div class="weekWorkplanindex" >
     <div class="top">
      
            <el-select class="filter-item" v-model="ListQuery.schoolTimeId" size="medium" placeholder="请选择学期" @change="changeschoolTimeId()">
                <el-option v-for="item in SchoolTimeAllList" :key="item.id" :label="item.schoolTimeName"  :value="item.id"></el-option>
            </el-select>
               <el-button type="primary" :disabled="ListQuery.schoolTimeId!=showid" size="medium" @click="weekWorkplanadd(0,3)">新建工作计划</el-button>
          <el-button type="primary" :disabled="ListQuery.schoolTimeId!=showid" size="medium" @click="weekWorkplansetup()">审核设置</el-button>
       
    </div>
     <div class="subject">
            <el-table :data="dataList" border   :height="nobottommaxH">
                  <el-table-column  label="周次" align="center">
                       <template slot-scope="scope">
                           <span class="link-type" @click="weekWorkplanadd(scope.row.id,scope.row.status)">{{scope.row.weekName}}</span>
                        </template>
                  </el-table-column>
                  <el-table-column  label="状态" align="center">
                      <template slot-scope="scope">
                          	<el-tag  size="mini" v-if="scope.row.status==1" type="success">已发布</el-tag>
                            <el-tag  size="mini" v-if="scope.row.status==0" type="info">草稿</el-tag>
                            <el-tag  size="mini" v-if="scope.row.status==2" type="danger">审核中</el-tag>
					</template>
                  </el-table-column>
                   <el-table-column   label="上报人" align="center">
                       <template slot-scope="scope">
                           <span>{{scope.row.reportUserName||'----' }}</span>
			             		</template>
                 </el-table-column>
                  <el-table-column   label="发布时间" align="center">
                       <template slot-scope="scope">

                           <span v-if="scope.row.reportTime">{{scope.row.reportTime }}</span>
                           <span v-else>----</span>
					</template>
                 </el-table-column>
                  <el-table-column      label="操作"  align="center">
                      <template slot-scope="scope">
					       <el-button :disabled="scope.row.status==1" @click="deleteWeeklyWorkPlans(scope.row.id)" type="text" size="small" class="buttontextred">删除</el-button>
                          <el-button type="text" size="small" @click="weekWorkplanadd(scope.row.id,scope.row.status)">编辑</el-button>

					  </template>
                </el-table-column>

            </el-table>
     </div>
</div>
</template>
<script>
//窗口大小调整
import mixin from '@/mixins/windowResize';
import {getSchoolTimeAllList,listWeeklyPlan,deleteWeeklyWorkPlan} from "@/api/weekWorkplan";
export default {
  data() {
    return {
      ListQuery: {schoolTimeId:''},
      dataList: [],
      SchoolTimeAllList:[],
      showid:''
    };
  },
  mixins: [mixin],

  mounted() {
    getSchoolTimeAllList()
      .then(res => {
        this.SchoolTimeAllList =res.data.data;
        for (let item of this.SchoolTimeAllList) {
          if (item.isCurrent == 1) {
            this.ListQuery.schoolTimeId = item.id;
            this.showid=item.id;
          }
        };
        this.listWeeklyPlans()
      })
      .catch(err => {});
  },
  methods: {
    //切换学期
    changeschoolTimeId() {
        this.listWeeklyPlans()
    },
    //新建
    weekWorkplanadd(id,num){
         this.$router.push({
        path: "weekWorkplanadd",
        query: {id: id,num:num}
      });
    },
    weekWorkplansetup(){
         this.$router.push({
        path: "weekWorkplansetup"
      });
    },
    //获取详情
    listWeeklyPlans(){
        this.dataList=[];
        listWeeklyPlan( this.ListQuery.schoolTimeId).then(res => {
        this.dataList =res.data.data;
      })
      .catch(err => {});
    },
    //删除
    deleteWeeklyWorkPlans(id){
        this.$confirm("确定要删除吗？", "提示", {
        type: "warning"
      })
        .then(() => {
          deleteWeeklyWorkPlan(id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
               this.listWeeklyPlans()
              }
            })
            .catch(err => {});
        })
        .catch(() => {});

    }


  }
};
</script>
<style scoped>
.weekWorkplanindex{
    padding:12px;
}
.weekWorkplanindex .top {
  padding-bottom: 10px;
}
</style>
