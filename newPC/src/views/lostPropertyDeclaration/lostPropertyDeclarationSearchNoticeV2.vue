<template>
  <div class="lost-property-declaration-search-notice-V2">
    <div
      class="el-row"
      style="padding-bottom: 10px;"
    >
      <router-link
        v-if="isShowByPermission('/searchfound/createSearch')"
        :to="{ path:'lostPropertyDeclarationAdd'}"
      >
        <!--根据路由跳转页面-->
        <el-button
          type="primary"
          size="medium"
        >创建寻物启事</el-button>
      </router-link>
      <router-link
        v-if="isShowByPermission('/searchfound/createFound')"
        :to="{ path: 'lostPropertyDeclarationCollarAdd'}"
      >
        <!--根据路由跳转页面-->
        <el-button
          type="primary"
          size="medium"
        >创建招领启事</el-button>
      </router-link>
      <el-button
        size="medium"
        type="primary"
        @click="deleteSearchAnnouncement()"
        v-if="isShowByPermission('/searchfound/delete')"
      >删除
      </el-button>
      <!--根据名称进行过滤形成一个新的数组进行渲染达到搜素的目的 v-model双向数据绑定实时更新搜索数据   当变化时触发函数进行过滤-->
      <el-input
        size="medium"
        placeholder="内容"
        class="search-input"
        v-model="getListQuery.searchName"
        @change="handleInputChange"
        style='float: right; width: 20%;'
      >
        <el-button
          size="medium"
          slot="append"
          icon="el-icon-search"
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
        style="width: 100%;overflow: auto;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          align="center"
          width="64px"
        ></el-table-column>
        <!--自带路由根据id不同获取不同数据渲染跳转的页面-->
        <el-table-column
          prop="title"
          align="left"
          label="描述内容"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <!--点击触发函数跳转页面根据id渲染跳转的页面-->
            <span
              class="link-type"
              @click="goEnlightenments(scope.row)"
            >{{scope.row.content}}</span>

          </template>
        </el-table-column>
        <!--将后台传入时间参数放到监听发布时间的函数-->
        <el-table-column
          prop="createDate"
          align="left"
          label="发布时间"
          width="200px"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.status!==1">{{scope.row.declareDate |formatTimeFilter}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          label="类型"
          width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-show="scope.row.announcementType==1">寻物</span>
            <span v-show="scope.row.announcementType==2">招领</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          label="状态"
          width="120px"
        >
          <template slot-scope="scope">
            <el-tag  size="mini"
              v-if="scope.row.auditStatus == 0"
              type="info"
            >待审核</el-tag>
            <el-tag  size="mini"
              v-else-if="scope.row.auditStatus == 2"
              type="danger"
            >驳回</el-tag>
            <span v-else>
              <el-tag  size="mini"
                v-if="scope.row.status==1"
                type="danger"
              >草稿</el-tag>
              <el-tag  size="mini"
                v-if="scope.row.status==2"
                type="primary"
              >已发布</el-tag>
              <el-tag  size="mini"
                v-if="scope.row.status==3"
                type="success"
              >已找到</el-tag>
              <el-tag  size="mini"
                v-if="scope.row.status==4"
                type="success"
              >已领取</el-tag>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          label="已读人数"
          width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span>{{scope.row.readCount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          align="center"
          label="回复"
          width="100px"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <span v-show="scope.row.replyCount==0">0</span>
            <span
              class="link-type"
              v-show="scope.row.replyCount!=0"
              @click="goEnlightenment(scope.row.id)"
            >{{scope.row.replyCount}}</span>

          </template>
        </el-table-column>
        <el-table-column
          align="left"
          label="操作"
          width="160"
        >
          <template slot-scope="scope">
            <!--跳转和新建同一页面，根据id获取参数并渲染 -->

            <template v-if="scope.row.auditStatus != 1">
              <el-button
                size="small"
                type="text"
                :disabled="scope.row.auditStatus == 2"
                @click.native="gotoLostPropertyDeclarationExamine(scope.row)"
              >
                审核
              </el-button>
            </template>
            <template v-else>
              <template v-if="isShowByPermission('/searchfound/edit')">
                <el-button
                  v-if="scope.row.status==1&&scope.row.announcementType==1"
                  size="small"
                  type="text"
                  @click="generate(scope.row.id)"
                >编辑
                </el-button>
                <el-button
                  v-if="scope.row.status==1&&scope.row.announcementType==2"
                  size="small"
                  type="text"
                  @click="generates(scope.row.id)"
                >编辑
                </el-button>
              </template>
              <template v-if="isShowByPermission('/searchfound/changFoundStatus')">
                <el-button
                  v-if="scope.row.status!=1&&scope.row.status!=3&&scope.row.announcementType==1"
                  size="small"
                  type="text"
                  @click.native=" found(scope.row.id,scope.row.declareId,scope.row.declareUserId)"
                >
                  已找到
                </el-button>
                <el-button
                  v-if="scope.row.status==3&&scope.row.announcementType==1"
                  size="small"
                  type="text"
                  :disabled="true"
                >已找到
                </el-button>
                <el-button
                  v-if="scope.row.status!=4&&scope.row.status!=1&&scope.row.announcementType==2"
                  size="small"
                  type="text"
                  @click.native="giveBack(scope.row.id)"
                >已领取
                </el-button>
                <el-button
                  v-if="scope.row.status==4&&scope.row.announcementType==2"
                  size="small"
                  type="text"
                  :disabled="true"
                >已领取
                </el-button>
              </template>
            </template>
            <!--此删除和上面的删除不同只是删除本身，并不需要选中-->
            <el-button
              v-if="isShowByPermission('/searchfound/delete')"
              size="small"
              type="text"
              @click="handleDelete(scope.row)"
            >删除
            </el-button>
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
//返回按钮
import BackTool from "@/components/BackTool";
//lodash方法集合
import debounce from "lodash/debounce";
//获取请求审批列表的方法 和 删除失物的方法  归还 找到
import {
  searchFoundListBySchoolId,
  deleteSearchAnnouncement,
  giveBack,
  found,
} from "@/api/lostPropertyDeclaration";
//引入监听发布时间方法将时间转换
import { formatTime } from "@/utils";
//窗口大小调整
import mixin from "@/mixins/windowResize";

export default {
  name: "lostPropertyDeclarationList",
  //		引入文本框模块和返回模块
  components: {
    BackTool,
  },
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
  //过滤时间
  filters: {
    formatTimeFilter(date) {
      return date ? date.slice(0, 19) : "";
    },
  },
  created() {
    this.searchFoundListBySchoolId();
  },
  methods: {
    isShowByPermission,
    //1获取列表
    searchFoundListBySchoolId() {
      searchFoundListBySchoolId(this.getListQuery).then((res) => {
        this.list = res.data.data.dataList;
        this.total = res.data.data.pagination.total;
      });
    },
    // 2单个删除
    handleDelete(val) {
      this.$confirm("确定要删除吗？", "提示", {
        type: "warning",
      })
        .then(() => {
          deleteSearchAnnouncement(val.id)
            .then((res) => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "删除成功!",
                });
                this.searchFoundListBySchoolId();
              }
              this.manageLostDeclareList();
            })
            .catch(function (error) {});
        })
        .catch(() => {});
    },
    //3总删除
    deleteSearchAnnouncement() {
      if (!this.multipleSelection.length) {
        this.$message({
          message: "请选择要删除的记录!",
          type: "warning",
        });
      } else {
        this.$confirm("确定要删除吗？", "提示", {
          type: "warning",
        })
          .then(() => {
            //					获取id
            let arr = this.multipleSelection.map((obj) => {
              return obj.id;
            });
            //					根据获取的id删除
            deleteSearchAnnouncement(arr.toString())
              .then((res) => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "删除成功!",
                  });
                  this.searchFoundListBySchoolId();
                }
                this.getRecipeList();
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
      this.getListQuery.pageSize = val;
      this.searchFoundListBySchoolId();
    },
    handleCurrentChange(val) {
      this.getListQuery.pageNo = val;
      this.searchFoundListBySchoolId();
    },
    handleInputChange: debounce(
      function (val) {
        this.getListQuery.searchName = val.trim();
        this.searchFoundListBySchoolId();
      },
      // 这是我们为用户停止输入等待的毫秒数
      500
    ),
    //6跳转启示详情
    goEnlightenments(item) {
      this.$router.push({
        path: "lostPropertyDeclarationDetails",
        query: {
          id: item.id,
        },
      });
    },
    gotoLostPropertyDeclarationExamine(item) {
      this.$router.push({
        path: "lostPropertyDeclarationExamine",
        query: {
          id: item.id,
        },
      });
    },
    //7回复
    goEnlightenment(id) {
      this.$router.push({
        path: "lostPropertyDeclarationListReply",
        query: {
          id: id,
        },
      });
    },
    //8归还
    giveBack(id) {
      let _this = this;
      this.$confirm("确定物品已归还吗？", "提示", {
        type: "success",
      })
        .then(() => {
          giveBack(id).then((res) => {
            if (res.data.code === 200) {
              this.$message({
                type: "success",
                message: "已成功归还!",
              });
              _this.searchFoundListBySchoolId();
            }
          });
        })
        .catch(() => {});
    },
    //9已找到
    found(id, declareId, declareUserId) {
      let _this = this;
      this.$confirm("确定物品已找到吗？", "提示", {
        type: "success",
      })
        .then(() => {
          found(id, declareId, declareUserId).then((res) => {
            if (res.data.code === 200) {
              _this.searchFoundListBySchoolId();
              this.$message({
                type: "success",
                message: "已成功找到!",
              });
            }
          });
        })
        .catch(() => {});
    },
    //10寻物发布
    generate(id) {
      this.$router.push({
        path: "lostPropertyDeclarationCollarEdit",
        query: {
          id: id,
        },
      });
    },
    //11招领发布
    generates(id) {
      this.$router.push({
        path: "lostPropertyDeclarationCollarEditRecruit",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>

<style scoped>
.lost-property-declaration-search-notice-V2 {
  padding: 12px;
}
.lost-property-declaration-search-notice-V2 .bd .el-button {
  width: 40%;
  text-align: left;
}
</style>
