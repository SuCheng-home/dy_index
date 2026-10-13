<template>
  <div class="lostPropertyDeclarationIndex">
    <div class="el-row">
      <el-col :span="16">
        <el-button
          type="danger"
          size="medium"
          @click="handleMultDelete"
        >删除</el-button>
      </el-col>
      <!--根据名称进行过滤形成一个新的数组进行渲染达到搜素的目的 v-model双向数据绑定实时更新搜索数据   当变化时触发函数进行过滤-->
      <el-input
        size="medium"
        placeholder="内容"
        icon="el-icon-search"
        class="search-input"
        v-model.trim="getListQuery.searchName"
        @keyup.enter.native="handleInputChange"
        style='float: right; width: 20%;'
      >
        <el-button
          size="medium"
          slot="append"
          icon="el-icon-search"
          @click="handleInputChange"
        ></el-button>
      </el-input>
    </div>
    <div class="bd">
      <!--列表部分-->
      <el-table
        stripe
        ref="multipleTable"
        border
        :data="list"
        tooltip-effect="dark"
        :height="maxH"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="64px"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          label="失主姓名"
          width="120px"
        >
          <template slot-scope="scope">
            <span>{{scope.row.declareUserName}}</span>
          </template>
        </el-table-column>
        <!--自带路由根据id不同获取不同数据渲染跳转的页面-->
        <el-table-column
          prop="title"
          align="left"
          label="内容"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <!--点击触发函数跳转页面根据id渲染跳转的页面-->
            <span
              class="link-type"
              @click="showDetailDialog(scope.row.id,scope.row.status)"
            >{{scope.row.content}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          label="失主手机"
          width="140px"
        >
          <template slot-scope="scope">
            <span>{{scope.row.declareUserPhone}}</span>
          </template>
        </el-table-column>
        <!--将后台传入时间参数放到监听发布时间的函数-->
        <el-table-column
          prop="createDate"
          align="left"
          label="申报时间"
          width="200px"
        >
          <template slot-scope="scope">
            <span>{{scope.row.createDate | formatTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          label="申报状态"
          width="120px"
        >
          <template slot-scope="scope">
            <el-tag  size="mini"
              v-if="scope.row.status==1"
              type="danger"
            >未处理</el-tag>
            <el-tag  size="mini"
              v-if="scope.row.status==2"
              type="primary"
            >已处理</el-tag>
            <el-tag  size="mini"
              v-if="scope.row.status==3"
              type="success"
            >已找到</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="操作"
          width="150"
        >
          <template slot-scope="scope">
            <!--跳转和新建同一页面，根据id获取参数并渲染-->
            <template v-if="isShowByPermission('/lostDeclare/changeSearch')">
              <el-button
                v-if="scope.row.status!==1"
                size="small"
                type="text"
                :disabled="true"
              >生成寻物启事</el-button>
              <el-button
                v-else
                size="small"
                type="text"
                @click="generate(scope.row.id)"
              >生成寻物启事</el-button>
            </template>
            <!--此删除和上面的删除不同只是删除本身，并不需要选中-->
            <el-button
              size="small"
              type="text"
              @click="handleDelete(scope.row)" 
            class="buttontextred">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="getListQuery.pageNo"
          :page-sizes="[10,20,30,40]"
          :page-size="getListQuery.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { isShowByPermission } from "@/utils";
//lodash方法集合
import debounce from "lodash/debounce";
//获取请求审批列表的方法 和 删除失物的方法
import {
  lostDeclareBySchoolId,
  deleteDeClare,
} from "@/api/lostPropertyDeclaration";
//引入监听发布时间方法将时间转换
import { formatTime } from "@/utils";
//窗口大小调整
import mixin from "@/mixins/windowResize";
export default {
  name: "lostPropertyDeclarationIndex",
  data: function () {
    return {
      listQuery: {
        //删除传输方法
        declareIds: "", //失物申报ids,以“，”分割
      },
      getListQuery: {
        pageNo: 1,
        pageSize: 20,
        searchName: "",
      },
      //获取的后台列表数据
      list: null,
      total: null,
      multipleSelection: "", //选中项id
    };
  },
  //窗口大小调整
  mixins: [mixin],
  filters: {
    formatTimeFilter(date) {
      // return formatTime(date);
      return date ? date.slice(0, 19) : "";
    },
  },
  created() {
    this.lostDeclareBySchoolIdFunc();
  },
  methods: {
    isShowByPermission,
    //1获取列表
    lostDeclareBySchoolIdFunc() {
      lostDeclareBySchoolId(this.getListQuery).then((res) => {
        this.list = res.data.data.dataList;
        if (this.getListQuery.pageNo !== 0 && this.list.length == 0) {
          this.getListQuery.pageNo--;
          this.lostDeclareBySchoolIdFunc();
        }
        this.total = res.data.data.pagination.total;
      });
    },
    // 2单个删除
    handleDelete(val) {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deleteDeClare(val.id)
            .then((res) => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.lostDeclareBySchoolIdFunc();
              }
            })
            .catch(function (error) {});
        })
        .catch(() => {});
    },
    //3总删除
    handleMultDelete() {
      if (!this.multipleSelection.length) {
        this.$message({
          message: "请选择要删除的记录！",
          type: "warning",
        });
      } else {
        this.$confirm("确定要删除吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            //获取id
            let arr = this.multipleSelection.map((obj) => {
              return obj.id;
            });
            //根据获取的id删除
            deleteDeClare(arr.toString())
              .then((res) => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                  this.lostDeclareBySchoolIdFunc();
                } else {
                  this.$message({
                    type: "success",
                    message: "删除失败!",
                  });
                }
              })
              .catch(function (error) {});
          })
          .catch(() => {});
      }
    },
    //4获取被选中项
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    //5分页
    handleSizeChange(val) {
      //每页展示条数
      this.getListQuery.pageSize = val;
      this.lostDeclareBySchoolIdFunc();
    },
    handleCurrentChange(val) {
      this.getListQuery.pageNo = val;
      this.lostDeclareBySchoolIdFunc();
    },
    handleInputChange: debounce(
      function (val) {
        this.getListQuery.pageNo = 1;
        this.lostDeclareBySchoolIdFunc();
      },
      // 这是我们为用户停止输入等待的毫秒数
      500
    ),
    //6跳转审批详情
    showDetailDialog(id, status) {
      this.$router.push({
        path: "lostPropertyDeclarationDeclareDetails",
        query: {
          id: id,
          status: status,
        },
      });
    },
    //7生成启示跳转
    generate(id) {
      this.$router.push({
        path: "lostPropertyDeclarationAdd",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style scoped>
.lostPropertyDeclarationIndex {
  padding:12px;
}

.lostPropertyDeclarationIndex .el-row {
  padding-bottom: 10px;
}
</style>
