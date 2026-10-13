<template>
    <div class="schoolLogReadlist">
        <div class="top">           
             <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
        </div>
       <div class="subject" :style="`height: ${maxH}px;`">
            <div class="ul">
                    <div class="li" v-for="(item,index) in dataList" :key="index"> 
                      <img :src="item.avatar" alt="">
                        <div> {{item.name}}</div>                   
                        <div> {{item.readDate|trimTime}}</div>
                    </div>
                    
            </div>
        </div>
        <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="pagination.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="pagination.total"> </el-pagination>
        </div>
    </div>
</template>
<script>
import windowResize from "@/mixins/windowResize";
import {listReadByLogIdAndStateAndPage} from "@/api/schoolLog";
export default {
  data() {
    return {
      dataList: [],
      pagination: {
        pageNo: 1,
        pageSize: 50,
        total: null,
        isRead:1,
        logId: this.$route.query.id,
      }
    };
  },
  mixins: [windowResize],
  filters: {
            trimTime(datetime) {
                return datetime ? datetime.slice(0, 19) : '';
            },
        },
  created() {
    this.listReadByLogIdAndStateAndPages();
  },
  methods: {
    //码数
    handleSizeChange() {
      this.pagination.pageNo = 1;
      this.listReadByLogIdAndStateAndPages();
    },
    //页数
    handleCurrentChange() {
      this.listReadByLogIdAndStateAndPages();
    },
    //获取列表
    listReadByLogIdAndStateAndPages() {     
      listReadByLogIdAndStateAndPage(this.pagination).then(res => res.data).then(data => {
          this.pagination.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    }
  }
};
</script>
<style lang="scss" scoped>
.schoolLogReadlist {
  padding:12px;
  .top {
    padding-bottom: 10px;
    border-bottom: 1px solid #e7eaec;
  }
  .subject{
      overflow: auto;
      .li{
        float: left;
        width: 100px;
        img{
          width: 60px;
          height: 60px;
          border-radius: 50%;
          margin: 5px 20px;
        }
        div{
          line-height: 20px;
          font-size: 14px;
          text-align: center;
          color: #606266;

        }
      }
  }
  .pagination-container {
    margin-top: 10px !important;
  }
}
</style>
