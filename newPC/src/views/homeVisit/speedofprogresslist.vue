<template>
    <div class="speedofprogresslist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="nobottommaxH">	           			
                <el-table-column  label="年级"  width="200px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.num==1">{{scope.row.name}}</span>
                        <span v-else class="right-box">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="已家访">
                    <template slot-scope="scope">
                        <span>{{scope.row.visitCount}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="未家访">
                    <template slot-scope="scope">
                        <span>{{scope.row.noVisitCount}}</span>
                    </template>
                </el-table-column>               
            </el-table>     
    </div>
</template>
<script>
    import moment from "moment";
    import {getHomeVisitProgressRateDatas} from "@/api/homeVisit";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                dataList: [],
                exportUrl: '',
                id: this.$route.query.id
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.getHomeVisitProgressRateDatass();
        },
        methods: {
            getHomeVisitProgressRateDatass() {
                this.exportUrl = `${global.BasePath}structure/homevisit/exportHomeVisitProgressDatas?batchId=${this.id}&token=${this.$store.getters.token}`;
                getHomeVisitProgressRateDatas(this.id)
                    .then(res => res.data)
                    .then(data => {
                        let mydata=data.data;
                        for(let i=0;i<mydata.length;i++){
                            this.dataList.push({
                                name:mydata[i].gradeName,
                                noVisitCount:mydata[i].noVisitCount,
                                visitCount:mydata[i].visitCount,
                                num:1
                            });
                            for(let j=0;j<mydata[i].classStaticsList.length;j++){
                                  this.dataList.push({
                                   name:mydata[i].classStaticsList[j].className,
                                   noVisitCount:mydata[i].classStaticsList[j].noVisitCount,
                                   visitCount:mydata[i].classStaticsList[j].visitCount,
                                   num:2
                                });
                            }
                        }
                    })
            },
         
        }
    }
</script>

<style lang="scss" scoped>
    .speedofprogresslist {
        padding:12px;
        .top {
          padding-bottom: 10px;
       }
       .right-box{
    display: block;
    text-align: right;
  }
    }
</style>
