<template>
<div class="questiontypesetting" >
     <div class="top"> 
            <el-col :span="19">
              <el-button  @click="$router.back()" type="default" size="medium">返回</el-button> 
              <el-button type="primary" size="medium" @click="questiontypesettingadd()">新增</el-button> 
              <el-button type="primary" size="medium" @click="questiontypesettingSetupone()">题型设置</el-button> 
              <el-button type="primary" size="medium" @click="questiontypesettingSetuptwo()">考试类型设置</el-button> 
            </el-col>
            <el-col :span="5">
              <el-input placeholder="请输入科目年级" size="medium"  v-model.trim="listQuery.searchName" @change="queryScoreBookSets()">
                  <el-button slot="append" icon="el-icon-search" @click="queryScoreBookSets()"></el-button>
              </el-input>
            </el-col>  
           
     </div>        
     <div class="subject">
                 <el-table :data="tableData" border :height="maxH">
                    <el-table-column prop="currName" label="学科"  show-overflow-tooltip></el-table-column>
                    <el-table-column  prop="levelName"  label="年级"    show-overflow-tooltip></el-table-column>
                    <el-table-column  label="考试类型"    show-overflow-tooltip>
                      <template slot-scope="scope">                 
                          <span v-for="(item,index) in scope.row.examTypeList" :key="index" >
                            <span v-if="item.joinQuestion">{{item.typeName}}；</span>
                          </span>
                      </template>
                    </el-table-column>
                    <el-table-column  label="题型"    show-overflow-tooltip>
                        <template slot-scope="scope">                 
                          <span v-for="(item,index) in scope.row.questionTypeList" :key="index">{{item.typeName}}；</span>
                        </template>
                    </el-table-column>
                    <el-table-column  label="操作"  align="center" >
                      <template slot-scope="scope">                 
                        <el-button   type="text" size="small" @click="deleteScoreBookSetByIdss(scope.row.id)" class="buttontextred">删除</el-button>
                        <el-button   type="text" size="small" @click="questiontypesettingeidt(scope.row.id)">编辑</el-button>
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
import mixin from "@/mixins/windowResize";
import { queryScoreBookSet, deleteScoreBookSetByIds } from "@/api/recordbook";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      listQuery: {
        pages: 1,
        total: 0,
        pageNo: 1, //页码
        pageSize: 20, //页数
        searchName: "",
        schoolId: ""
      },
      tableData: []
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["schoolInfo"])
  },
  mounted() {
    this.listQuery.schoolId = this.schoolInfo.id;
    this.queryScoreBookSets();
  },
  methods: {
    //获取详情
    queryScoreBookSets() {
      queryScoreBookSet(this.listQuery)
        .then(res => {
          const data = res.data.data;
          this.tableData = data.dataList;
          this.listQuery.total = data.pagination.total;
          this.listQuery.pages = data.pagination.pages;
        })
        .catch(err => {});
    },
    //题型设置
    questiontypesettingSetupone() {
      this.$router.push({
        path: "questiontypesettingSetupone"
      });
    },
    //考试类型设置
    questiontypesettingSetuptwo() {
      this.$router.push({
        path: "questiontypesettingSetuptwo"
      });
    },
    //新增
    questiontypesettingadd() {
      this.$router.push({
        path: "questiontypesettingadd"
      });
    },
    //编辑
    questiontypesettingeidt(id) {
      this.$router.push({ path: "questiontypesettingeidt", query: { id: id } });
    },
    //切换页码
    sizeChangeHandler(pageSize) {
      this.listQuery.pageNo = 1;
      this.listQuery.pageSize = pageSize;
      this.queryScoreBookSets();
    },
    //切换页数
    currentChangeHandler(pageNo) {
      this.listQuery.pageNo = pageNo;
      this.queryScoreBookSets();
    },
    //删除
    deleteScoreBookSetByIdss(id) {
      this.$confirm("确定要删除吗？", "提示", { type: "warning" })
        .then(() => {
          deleteScoreBookSetByIds(id)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!"
                });
                this.queryScoreBookSets();
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
.questiontypesetting {
  padding:12px;
  .top {
    padding-bottom: 10px;
    overflow: hidden;
  }
}
</style>