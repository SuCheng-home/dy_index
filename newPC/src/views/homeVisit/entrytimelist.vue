<template>
    <div class="entrytimelist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
            <a class="export-btn" :href="exportUrl" download="导出" v-if="dataList.length" target="_blank">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
        </div>
        <el-table stripe ref="table" :data="dataList" border fit highlight-current-row  :height="nobottommaxH">	           			
                <el-table-column  label="年级" width="200px">
                    <template slot-scope="scope">
                       <span v-if="scope.row.num==1">{{scope.row.name}}</span>
                        <span v-else class="right-box">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" :label="item.entryTime"  v-for="(item,index) in entryTimeStaticsList" :key="index">
                    <template slot-scope="scope">
                        <span>{{scope.row.entryTimeStaticsList[index].visitCount}}</span>
                    </template>
                </el-table-column>           
            </el-table>     
    </div>
</template>
<script>
    import moment from "moment";
    import {getHomeVisitEntryTimeDatas} from "@/api/homeVisit";
    import baseMixin from '@/mixins/baseMixin';
    import mixin from '@/mixins/windowResize';
    export default {
        name: "statisticsIndex",
        data() {
            return {
                dataList: [],
                exportUrl: '',
                id: this.$route.query.id,
                entryTimeStaticsList:[],
                timer: null
            }
        },
        mixins: [baseMixin, mixin],
        created() {
            this.getHomeVisitEntryTimeDatass();
            this.$nextTick(() => {
      this.timer = setTimeout(() => {
        this.$refs.table.doLayout();
      }, 300);
    });
        },
        beforeDestroy() {
    clearTimeout(this.timer);
  },
        methods: {
            getHomeVisitEntryTimeDatass() {
                this.exportUrl = `${global.BasePath}structure/homevisit/exportHomeVisitEntryTimeDatas?batchId=${this.id}&token=${this.$store.getters.token}`;
                getHomeVisitEntryTimeDatas(this.id)
                    .then(res => res.data)
                    .then(data => {
                        let mydata=data.data;
                        this.entryTimeStaticsList=mydata[0].entryTimeStaticsList
                        for(let i=0;i<mydata.length;i++){
                            this.dataList.push({
                                name:mydata[i].gradeName,
                                num:1,
                                entryTimeStaticsList:mydata[i].entryTimeStaticsList,
                            });
                            for(let j=0;j<mydata[i].classStaticsList.length;j++){
                                  this.dataList.push({
                                   name:mydata[i].classStaticsList[j].className,
                                   num:2,
                                   entryTimeStaticsList:mydata[i].classStaticsList[j].entryTimeStaticsList,
                                });
                            }
                        }
                        this.$nextTick(() => {
                        this.timer = setTimeout(() => {
                            this.$refs.table.doLayout();
                        }, 300);
                        });
                    })
            },
         
        }
    }
</script>

<style lang="scss" scoped>
    .entrytimelist {
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
