<template>
  <div class="linshilist">
    <div class="header">
        <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
    </div>
    <div class="main-wrap" id="outTable">
      <el-table
        border
        stripe
        style="width: 100%;"
        :height="nobottommaxH"
        :data="datalist"
      >
        <el-table-column align="center" label="日期" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.watchDate}}</template>
        </el-table-column>
         <el-table-column align="center" label="节次" show-overflow-tooltip>
            <template slot-scope="scope">
                <span v-if="scope.row.dayStage==1"> 早自习</span>
                <span v-if="scope.row.dayStage==2"> 上午</span>
                <span v-if="scope.row.dayStage==3"> 午自习</span>
                <span v-if="scope.row.dayStage==4"> 下午</span>
                <span v-if="scope.row.dayStage==5"> 晚自习</span>
                <span> 第{{scope.row.seq}}节</span>
            </template>
        </el-table-column>
         <el-table-column align="center" label="班级" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.className}}</template>
        </el-table-column>
         <el-table-column align="center" label="上课老师" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.teacherName}}</template>
        </el-table-column>
         <el-table-column align="center" label="课程" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.currName}}</template>
        </el-table-column>
      </el-table>
      </div>
    </div>
  </div>
</template>
<script>
import mixin from "@/mixins/windowResize";
import baseMixin from '@/mixins/baseMixin';
import {getClassScheduleStopDeails} from "@/api/classScheduleCard";
export default {
  data() {
    return {
        datalist:[]
    };
  },
  created() {
      getClassScheduleStopDeails(this.$route.query.id)
                    .then(res => {
                        this.datalist=res.data.data
                    })
                    .catch();
  },
  mixins: [mixin,baseMixin],
  methods: {  
  },
};
</script>
<style lang="scss" scoped>
.linshilist {
  padding:12px;
  box-sizing: border-box;
  .header {
    padding-bottom: 10px;
    margin-bottom: 0;
        overflow: hidden;
  }
 
}
</style>
