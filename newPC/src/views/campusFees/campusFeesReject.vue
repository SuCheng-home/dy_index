<template>
    <div class="campusFeesReject">
           <div class="bigtop"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
      </div>
            <el-table stripe ref="multipleTable" border :data="datalist" tooltip-effect="dark" :height="nobottommaxH">
                <el-table-column prop="title" align="left" label="驳回人" width="160px">
                    <template slot-scope="scope">
                        <span>{{scope.row.examineUserName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" align="left" label="驳回时间" width="180px">
                    <template slot-scope="scope">
                        <span>{{scope.row.rejectTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="title" align="left" label="原因" >
                    <template slot-scope="scope">
                        <span>{{scope.row.rejectReason}}</span>
                    </template>
                </el-table-column>

            </el-table>
    </div>
</template>

<script>
    //返回按钮
    import BackTool from '@/components/BackTool';
    import {queryChargeNoticeRejectList} from '@/api/campusFees';
    import mixin from '@/mixins/windowResize';
    export default {
        name: 'campusFeesReject',
        components: {
            BackTool
        },
        data: function () {
            return {
               id: this.$route.query.id,
               datalist:[]
            }
        },
        //窗口大小调整
        mixins: [mixin],

        //钩子函数
        created() {
          queryChargeNoticeRejectList(this.id).then(res => {
         this.datalist = res.data.data;
          });
        },
        methods: {

        }
    }
</script>

<style scoped>
  .campusFeesReject{
      padding:12px;
  }
  .bigtop {
    padding-bottom: 10px;
    overflow: hidden;
  }
</style>
