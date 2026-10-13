<template>
<div class="rollCall"  >
    <div class="top">
        <el-date-picker
      v-model="date" :clearable="false" :editable="false"   @change="getCallNames()"
      type="date"  size="medium"
      placeholder="选择日期">
    </el-date-picker>
    </div>
     <el-table stripe :data="dataList"  :height="`${nobottommaxH}px`" border style="width: 100%">
             <el-table-column  label="班级" show-overflow-tooltip align="center" >
                <template slot-scope="scope">
                    {{scope.row.className}}
                </template>
            </el-table-column>
            <el-table-column  label="学生数" show-overflow-tooltip align="center" >
                <template slot-scope="scope">
                    {{scope.row.id?scope.row.classStuCount:"----"}}
                </template>
            </el-table-column>
            <el-table-column  label="参与数" show-overflow-tooltip align="center" >
                <template slot-scope="scope">
                    {{scope.row.id?scope.row.applyStuCount:"----"}}
                </template>
            </el-table-column>
            <el-table-column  label="今日请假人数" show-overflow-tooltip align="center" >
                <template slot-scope="scope">
                   {{scope.row.id?scope.row.askLeaveStuCount:"----"}}
                </template>
            </el-table-column>
            <el-table-column  label="到勤人数" show-overflow-tooltip align="center" >
                <template slot-scope="scope">
                   {{scope.row.id?scope.row.attendStuCount:"----"}}
                </template>
            </el-table-column>
            <el-table-column  label="点名时间" show-overflow-tooltip align="center" >
                <template slot-scope="scope">
                    {{scope.row.id?scope.row.createDate.split('.')[0]:"----"}}
                </template>
            </el-table-column>
            <el-table-column  label="点名老师" show-overflow-tooltip align="center" >
                <template slot-scope="scope">
                    {{scope.row.id?scope.row.createName:"----"}}
                </template>
            </el-table-column>           
        </el-table>
</div>
</template>
<script>
import {getCallName} from "@/api/rollCall";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
    date:new Date(),
    dataList:[]
    };
  },
  mixins: [mixin],
  created() {
      this.getCallNames();
  },
  methods: {     
      getCallNames(){
          getCallName(this.$moment(this.date).format('YYYY-MM-DD'))
                    .then(res => res.data)
                    .then(data => {
                        this.dataList = data.data;
                    }).catch(err => {
                })
      }   
  }
};
</script>
<style lang="scss" scoped>
.rollCall {
   padding: 12px;
  .top {
    padding-bottom: 10px;
    overflow: hidden;
  }
  .picimg{
      height: 28px;
      max-width:50px;
  }
}
</style>
