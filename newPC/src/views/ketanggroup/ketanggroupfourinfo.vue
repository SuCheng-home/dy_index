<template>
    <div class="ketanggroupone">
          <div class="top">
           <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
            <!-- <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `小组积分按天.xlsx`)"   v-if="dataList.length>0">导出</el-button> -->
        </div> 
        <div  id="outTable" >
          <el-table stripe :data="dataList"  :height="`${nobottommaxH}px`" border>             
                        <el-table-column label="分组名称" align="center">
                           <template slot-scope="scope">
                             {{scope.row.groupName}}
                          </template>
                        </el-table-column>  
                        <el-table-column label="日期" align="center">
                           <template slot-scope="scope">
                               {{scope.row.behDate}}
                          </template>
                        </el-table-column>  
                          <el-table-column label="事由" align="center">
                           <template slot-scope="scope">
                              总分第{{scope.row.rank}}名次
                          </template>
                        </el-table-column>
                         <el-table-column label="积分" align="center">
                           <template slot-scope="scope">
                             {{scope.row.score}}
                          </template>
                        </el-table-column>
      </el-table> 
      </div>
    </div>
</template>
<script>
    import windowResize from "@/mixins/windowResize";
    import baseMixin from '@/mixins/baseMixin';
    import {getSchoolBehaviorGroupDateListStatic} from "@/api/ketanggroupone";
    export default {
        data() {
            return {               
                dataList:[],
            };
        },
        mixins: [windowResize,baseMixin],
        mounted() {
           getSchoolBehaviorGroupDateListStatic(this.$route.query).then(res => {
                    let data = res.data.data;
                    this.dataList=data;
                    

                });
        },
        methods: {
            
        }
    };
</script>
<style lang="scss" scoped>
    .ketanggroupone{
        padding: 10px;
        .top {
            padding-bottom: 10px;
        }
    }
</style>
