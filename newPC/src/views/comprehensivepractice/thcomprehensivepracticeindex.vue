<template>
  <div class="app-container calendar-list-container comprehensivepracticeindex">
    <div class="filter-container">
      <el-row>
        <el-col :span="19">
          <el-select size="medium" v-model="pagination.schoolTimeId" @change="getThPracticeActivityPageLists()"
                     placeholder="请选择学期">
            <el-option label="全部学期" :value="0"></el-option>
            <el-option v-for="item in termList" :key="item.id" :label="item.schoolTimeName"
                       :value="item.id"></el-option>
          </el-select>
          <el-select size="medium" v-model="pagination.typeCode" @change="getThPracticeActivityPageLists()"
                     placeholder="请选择类型">
            <el-option label="全部类型" :value="0"></el-option>
            <el-option v-for="item in typelist" :key="item.code" :label="item.value" :value="item.code"></el-option>
            `
          </el-select>
          <el-button type="primary" size="medium" @click="comprehensivepracticeadd()">新建主题活动</el-button>
        </el-col>
        <el-col :span="5">
          <el-input size="medium"
                    placeholder="名称" icon="el-icon-search" @keyup.enter.native="getThPracticeActivityPageLists()"
                    v-model="pagination.activityName">
            <el-button slot="append" icon="el-icon-search" @click="getThPracticeActivityPageLists()"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <el-table ref="table" stripe :data="dataList" border fit highlight-current-row
              style="width: 100%" :height="maxH ">
      <el-table-column align="center" label="主题活动名称" show-overflow-tooltip>
        <template slot-scope="scope">
                    <span class="link" @click="thcomprehensivepracticedetails(scope.row.id,scope.row.isMain,scope.row.state)">
                        {{scope.row.activityName}}
                    </span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="实践类型">
        <template slot-scope="scope">
          <span>{{scope.row.typeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="学期">
        <template slot-scope="scope">
          <span>{{scope.row.schoolTimeName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="指导教师">
        <template slot-scope="scope">
          <span>{{scope.row.guideTeacherNames || scope.row.createUserName}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="协助指导教师">
        <template slot-scope="scope">
          <span>{{scope.row.assistTeacherNames||"----"}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="状态" >
        <template slot-scope="scope">
          <el-tag  size="mini" type="info"  v-if="scope.row.state == 1">草稿</el-tag>
          <el-tag  size="mini"  v-else-if="scope.row.state == 2">已通过</el-tag>
          <el-tag  size="mini" type="info"  v-else-if="scope.row.state == -1">待审核</el-tag>
          <el-tag  size="mini" type="danger"  v-else-if="scope.row.state == 3" :title="scope.row.approveOption">驳回</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button  type="text" @click="comprehensivepracticeeidt(scope.row.id, scope.row.state)" v-if="scope.row.state === 1 || scope.row.state === 2 || scope.row.state === 3">编辑</el-button>
          <el-button  type="text" @click="deletePracticeActivityById(scope.row.id)"  class="buttontextred" v-if="scope.row.state === 1 || scope.row.state === 3">删除</el-button>
          <el-button  type="text" @click="revokePracticeActivity(scope.row.id)" v-if="scope.row.state === -1">撤回</el-button>
          <el-button size="small" type="text" :disabled="scope.row.isMain==0" v-if="scope.row.state === 2"
                     @click="thcomprehensivepracticeadd(scope.row.id)">添加协助
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination
        @size-change="sizeChangeHandler"
        @current-change="currentChangeHandler"
        :current-page.sync="pagination.pageNo"
        :page-sizes="[10 , 20, 30, 50]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import baseMixin from '@/mixins/baseMixin';
  import mixin from '@/mixins/windowResize';
  import {getSchoolTimeAllList, getThPracticeActivityPageList, findSchoolDicsByCode, revokePracticeActivity, deletePracticeActivityById} from '@/api/comprehensivepractice';

  export default {
    name: 'comprehensivepracticeindex',
    data() {
      return {
        dataList: [],
        pagination: {
          pageSize: 20,
          pageNo: 1,
          typeCode: 0,
          activityName: "",
          schoolTimeId: 0,
          total: null
        },
        termList: [],
        typelist: []
      }
    },
    mixins: [baseMixin, mixin],
    computed: {
      ...mapGetters(['userInfo'])
    },
    created() {
      getSchoolTimeAllList()
        .then(res => res.data)
        .then(data => {
          this.termList = data.data;
        });
      findSchoolDicsByCode("practiceActivityType").then((res) => {
        const data = res.data.data;
        if (res.data.code === 200) {
          this.typelist = data;
        }
      });
      this.getThPracticeActivityPageLists();
    },
    methods: {
      getThPracticeActivityPageLists() {
        getThPracticeActivityPageList(this.pagination)
          .then(res => res.data)
          .then(data => {
            this.dataList = data.data.dataList;
            this.pagination.total = data.data.pagination.total;
          })
      },
      deletePracticeActivityById(id) {
        this.$confirm('是否删除', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deletePracticeActivityById(id).then(res => res.data).then(data => {
            if (data.code === 200) {
              this.$message({
                message: "删除成功！",
                type: "success"
              });
              this.getThPracticeActivityPageLists()
            }
          })
        }).catch(() => {
        });
      },
      sizeChangeHandler(val) {
        this.pagination.pageNo = 1;
        this.pagination.pageSize = val;
        this.getThPracticeActivityPageLists();
      },
      currentChangeHandler() {
        this.getThPracticeActivityPageLists();
      },
      thcomprehensivepracticedetails(id, isMain, state) {
        this.$router.push({
          path: "thcomprehensivepracticedetails",
          query: {id: id, isMain: isMain, state: state}
        })
      },
      thcomprehensivepracticeadd(id) {
        this.$router.push({
          path: "thcomprehensivepracticeadd",
          query: {id: id}
        })
      },
      comprehensivepracticeadd() {
        this.$router.push({
          path: "comprehensivepracticeadd",
          query: {createType: 2}
        })
      },
      comprehensivepracticeeidt(id, state){
        this.$router.push({
          path: "comprehensivepracticeeidt",
          query: {id:id, createType: 2, state: state}
        })
      },
      revokePracticeActivity(id) {
        this.$confirm('是否撤回', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          revokePracticeActivity({id: id}).then(res => res.data).then(data => {
            if (data.result) {
              this.$message({
                message: "撤回成功！",
                type: "success"
              });
              this.getThPracticeActivityPageLists()
            }else{
              this.$message({
                message: data.msg,
                type: 'warning'
              });
            }
          })
        }).catch(() => {
        });
      },
    }
  }
</script>

<style scoped>
  .link {
    color: #409eff;
    cursor: pointer;
  }

</style>
