<template>
<div class="ventilatearoomDictionarieslist" >
     <div class="top"> 
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium" @click="ventilatearoomDictionariesadd()">新增</el-button> 
      </div>
     <div class="subject">
            <el-table :data="tableData" border :height="maxH">
              <el-table-column prop="code" label="打卡项编码"  align="center"  width="150" show-overflow-tooltip></el-table-column>
              <el-table-column  prop="value"  label="打卡项名称"    show-overflow-tooltip></el-table-column>
              <el-table-column  prop="sort"  label="打卡项排序号"  align="center"  width="150"  show-overflow-tooltip></el-table-column>
              <el-table-column  prop="remark"  label="打卡项描述"  align="center"  width="150"  show-overflow-tooltip></el-table-column>
              <el-table-column  label="操作"  align="center"   width="150">
                <template slot-scope="scope">                 
                  <el-button   type="text" size="small" @click="deleteDicValueByIds(scope.row.id)" class="buttontextred">删除</el-button>
                  <el-button   type="text" size="small" @click="ventilatearoomDictionarieseidt(scope.row.id)">编辑</el-button>
                </template>
              </el-table-column>
           </el-table>
           <div class="pagination-container">
                <el-pagination  @size-change="sizeChangeHandler" @current-change="currentChangeHandler" :current-page.sync="listQuery.pageNo" :page-sizes="[10 , 20, 30, 50]" :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper" :page-count="listQuery.pages" :total="listQuery.total"></el-pagination>
            </div>
     </div>
</div> 
</template>
<script>
import {
  getDicDetailValuePageList,
  saveSchoolDicType,
  saveDicDetail,
  deleteDicValueById,
  getDicDetailInfoByCode,
  getSchoolDicTypeInfoByCode
} from "@/api/ventilatearoom";
import mixin from "@/mixins/windowResize";
export default {
  name: "Dictionariesindex",
  data() {
    return {
      listQuery: {
        pages: 1,
        total: 0,
        pageNo: 1, //页码
        pageSize: 20 //页数
      },
      code: "ventilatearoom",
      name: "打卡项",
      tableData: []
    };
  },
  mixins: [mixin],
  created() {
   //获得字典类型信息
    getDicDetailInfoByCode(this.code)
      .then(res => {
        const data = res.data.data;
        if (data.code == null) {
          getSchoolDicTypeInfoByCode("ventilatearoombig")
            .then(res => {
              const mydata = res.data.data;
              if (mydata.code == null) {
                //创建父
                saveSchoolDicType()
                  .then(res => {
                    //创建父
                    saveDicDetail(this.code, this.name)
                      .then(res => {
                        this.getDicDetailValuePageLists();
                      })
                      .catch(err => {});
                  })
                  .catch(err => {});
              } else {
                //创建父
                saveDicDetail(this.code, this.name)
                  .then(res => {
                    this.getDicDetailValuePageLists();
                  })
                  .catch(err => {});
              }
            })
            .catch(err => {});
        } else {
          this.getDicDetailValuePageLists();
        }
      })
      .catch(err => {});
  },
  methods: {
    //获取详情
    getDicDetailValuePageLists() {
      getDicDetailValuePageList(
        this.listQuery.pageNo,
        this.listQuery.pageSize,
        this.code
      )
        .then(res => {
          const data = res.data.data;
          this.tableData = data.dataList;
          this.listQuery.total = data.pagination.total;
          this.listQuery.pages = data.pagination.pages;
        })
        .catch(err => {});
    },
    //新建
    ventilatearoomDictionariesadd(){
      this.$router.push({path: 'ventilatearoomDictionariesadd'})
    }, 
    //编辑
   ventilatearoomDictionarieseidt(id){
           this.$router.push({path: 'ventilatearoomDictionarieseidt', query: { id:id  } })
    },
    //切换页码
    sizeChangeHandler(pageSize) {
      this.listQuery.pageNo = 1;
      this.listQuery.pageSize = pageSize;
      this.getDicDetailValuePageLists();
    },
    //切换页数
    currentChangeHandler(pageNo) {
      this.listQuery.pageNo = pageNo;
      this.getDicDetailValuePageLists();
    },
    //删除
    deleteDicValueByIds(id) {
      this.$confirm("确定要删除吗？", "提示", { type: "warning" })
        .then(() => {
          deleteDicValueById(id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.getDicDetailValuePageLists();
              }
            })
            .catch(function(error) {});
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.ventilatearoomDictionarieslist {
  padding:12px;
  .top {
    padding-bottom: 10px;
  }
}
</style>