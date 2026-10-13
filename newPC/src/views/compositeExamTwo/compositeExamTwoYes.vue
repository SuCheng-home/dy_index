<template>
  <div class="compositeExamTwoYes">
    <div class="header">
      <el-row>
        <el-col :span="19">
          <el-button  size="medium" @click="$router.back()">返回</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="main-wrap">
      <el-table
        ref="multipleTable"
        :data="yesReaderUserList"
        :height="nobottommaxH"
        border stripe
        style="width: 100%">
        <el-table-column
          label="头像" width="80" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span>
              <img :src="scope.row.avatar" class="imgSize">
            </span>
          </template>
        </el-table-column>
        <el-table-column
          label="姓名"
         >
          <template slot-scope="scope">{{ scope.row.name }}</template>
        </el-table-column>
        <el-table-column
          label="阅读时间" show-overflow-tooltip>
          <template slot-scope="scope" v-if="scope.row.seeDateTime">{{ scope.row.seeDateTime|filterTime }}</template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import mixin from '@/mixins/windowResize';
 import {getComplexCheckStatistics} from '@/api/compositeExamSetTwo';
export default {
  data(){
    return{
        yesReaderUserList:[]
    }
  },
  created(){
       getComplexCheckStatistics(this.$route.query)
                    .then(res => res.data)
                    .then(data => {                       
                        this.yesReaderUserList = data.data.yesReaderUserList;
                    })
  },
  mixins:[
    mixin
  ],
  filters:{
    filterTime(date){
      return date?date.slice(0,19):''
    }
  },
}
</script>
<style lang="scss" scoped>
.compositeExamTwoYes{
  padding:12px;
  box-sizing: border-box;
  .header{
    margin-bottom:10px;
  }
  .main-wrap{
    padding-top: 0!important;
    .imgSize{
      width: 25px;
      height: 25px;
    }
  }
}
</style>

