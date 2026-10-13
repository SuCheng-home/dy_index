<template>
    <div class="pretunelist">
        <div class="top">
            <el-button  type="default" @click="$router.back()" size="medium">返回</el-button>
            <el-button class="filter-item" type="primary" size="medium" @click="detailedrecordlist()" >查看详细记录</el-button>
            <el-button class="filter-item" type="primary" size="medium" @click="entrytimelist()" v-if="ispossessRole">入户时间统计</el-button>
            <a class="export-btn" :href="exportUrl" download="导出" target="_blank" v-if="dataList.length">
                <el-button class="filter-item" type="primary" icon="upload" size="medium">导出</el-button>
            </a>
        </div>
        <el-table stripe :data="dataList" border fit highlight-current-row  :height="nobottommaxH">	           			
                <el-table-column  label="年级" width="200px">
                    <template slot-scope="scope">
                        <span v-if="scope.row.num==1">{{scope.row.name}}</span>
                        <span v-else class="right-box">{{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="已回执">
                      <el-table-column align="center" :label="item.name"  v-for="(item,index) in visitTypeslist" :key="index">
                        <template slot-scope="scope">
                            <span>{{scope.row.visitTypeStaticsList[index].visitCount}}</span>
                        </template>
                      </el-table-column>  
                 <el-table-column align="center" label="总计">
                    <template slot-scope="scope">
                        <span>{{scope.row.receiptCount}}</span>
                    </template>
                </el-table-column>  
                </el-table-column>
                <el-table-column align="center" label="未回执">
                    <template slot-scope="scope">
                        <span>{{scope.row.noReceiptCount}}</span>
                    </template>
                </el-table-column>               
            </el-table>     
    </div>
</template>
<script>
import moment from "moment";
import { getHomeVisitPretuneRateDatas,possessRole,getHomeVisitBatchById} from "@/api/homeVisit";
import baseMixin from "@/mixins/baseMixin";
import mixin from "@/mixins/windowResize";
export default {
  name: "statisticsIndex",
  data() {
    return {
      dataList: [],
      exportUrl: "",
      id: this.$route.query.id,
      ispossessRole:false,
      visitTypeslist:[]
    };
  },
  mixins: [baseMixin, mixin],
  created() {
    //判断是不是管理员
			possessRole().then(res=>{
				this.ispossessRole= res.data.data.result;
			});
    this.getHomeVisitPretuneRateDatass();
    this.getHomeVisitBatchByIds();
  },
  methods: {
      getHomeVisitBatchByIds(){
      getHomeVisitBatchById(this.$route.query.id).then(res => res.data).then(data => {
            let mydata=data.data;
            this.visitTypeslist=JSON.parse(mydata.visitTypes);
        })
      },
      countfun(num){
        for(let i=0;i<this.visitTypeslist.length;i++){
          if(this.visitTypeslist[i].id==num){
            return true
          }
        }

      },
    getHomeVisitPretuneRateDatass() {
      this.exportUrl = `${
        global.BasePath
      }structure/homevisit/exportHomeVisitReceiptDatas?batchId=${
        this.id
      }&token=${this.$store.getters.token}`;
      getHomeVisitPretuneRateDatas(this.id)
        .then(res => res.data)
        .then(data => {
          let mydata = data.data;
          for (let i = 0; i < mydata.length; i++) {
            this.dataList.push({
              name: mydata[i].gradeName,
              entryCount: mydata[i].entryCount,
              receiptCount: mydata[i].receiptCount,
              teleContactCount: mydata[i].teleContactCount,
              toSchoolCount: mydata[i].toSchoolCount,
              noReceiptCount: mydata[i].noReceiptCount,
              visitTypeStaticsList:mydata[i].visitTypeStaticsList,
              num:1
            });
            for (let j = 0; j < mydata[i].classStaticsList.length; j++) {
              this.dataList.push({
                name: mydata[i].classStaticsList[j].className,
                entryCount: mydata[i].classStaticsList[j].entryCount,
                receiptCount: mydata[i].classStaticsList[j].receiptCount,
                teleContactCount:
                  mydata[i].classStaticsList[j].teleContactCount,
                toSchoolCount: mydata[i].classStaticsList[j].toSchoolCount,
                noReceiptCount: mydata[i].classStaticsList[j].noReceiptCount,
                visitTypeStaticsList: mydata[i].classStaticsList[j].visitTypeStaticsList,
                num:2
              });
            }
          }
        });
    },
    entrytimelist() {
      this.$router.push({
        path: "entrytimelist",
        query: { id: this.id }
      });
    },
    detailedrecordlist() {
      this.$router.push({
        path: "detailedrecordlist",
        query: { id: this.id }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.pretunelist {
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
