<template>
  <div class="doc_flow_wrap">
    <div class="header">
      <el-row>
        <el-col :span="19">
           <el-select v-model="schoolName" placeholder="请选择学期" size="medium" @change="changeSchool">
            <el-option v-for="item in schoolYearList" :key="item.schoolTimeCode" :label="item.label"
                       :value="item.schoolTimeName">
            </el-option>
          </el-select>
          <el-button type="primary" v-if="isShowByPermission('/documentFlow/addDocumentFlowInit')" size="medium" @click="documentFlowup">提醒设置</el-button>
          <a :href="documentUrl" target="_blank" download="examName" v-if="dataList.length">
            <el-button type="primary" size="medium">导出</el-button>
          </a>
          <el-button type="primary" size="medium" @click="addDocFlow" v-show="isSchoolLeader">公文登记</el-button>
        </el-col>
        <el-col :span="5">
          <el-input size="medium" v-model.trim="title" placeholder="主题" @keyup.enter.native="nameSearch">
            <el-button slot="append" icon="el-icon-search" size="medium" @click="nameSearch"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </div>
    <div class="doc_flow_table_box">
      <el-table stripe :data="dataList" border fit highlight-current-row style="width: 100%" :height="maxH-1">
        <el-table-column align="center" label="文件标题" show-overflow-tooltip min-width="200">
          <template slot-scope="scope">
            <span class="name_title" @click="toDocumentFlowInfo(scope.row.id, scope.row.state)">{{scope.row.title}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="来文单位" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <span>{{scope.row.comeDepartName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="来文编号" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <span>{{scope.row.comeNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="来文日期" show-overflow-tooltip width="135">
          <template slot-scope="scope">
            <span>{{scope.row.comeDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前环节" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <span>{{scope.row.stepStateName}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="当前处理人" show-overflow-tooltip width="120">
          <template slot-scope="scope">
            <span :key="index" v-for="(item, index) in scope.row.userList">{{item.name}}&nbsp;&nbsp;</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="收文编号" show-overflow-tooltip width="150">
          <template slot-scope="scope">
            <span>{{scope.row.putNum}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="创建时间" show-overflow-tooltip width="135">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态"  width="80">
          <template slot-scope="scope">
            <el-tag  size="mini"   type="info" v-if="scope.row.state === 1">草稿</el-tag>
            <el-tag  size="mini"   type="warning" v-else-if="scope.row.state === 5">已完结</el-tag>
            <el-tag  size="mini"   type="danger" v-else-if="scope.row.state === 3">退回</el-tag>
            <el-tag  size="mini"   type="success"  v-else-if="scope.row.state === 2&&!scope.row.myisid">处理中</el-tag>
            <el-tag  size="mini"   type="danger" v-else-if="scope.row.state === 2&&scope.row.myisid">待处理</el-tag>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="100">
          <template slot-scope="scope">
            <el-button type="text" size="small" v-if="(scope.row.state !=1 &&scope.row.state != 3)&&isShowByPermission('/documentFlow/addDocumentFlowUpdate')" @click.native.prevent="neweditDocFlow(scope.row.id,0)">编辑</el-button>
            <el-button type="text" size="small" v-if="(scope.row.state === 1||scope.row.state === 3)&&(scope.row.createUserId == currentUserId)" @click.native.prevent="editDocFlow(scope.row.id,0)">编辑</el-button>
            <el-button type="text" size="small" :disabled="scope.row.createUserId !== currentUserId" @click.native.prevent="delDocumentFlowById(scope.row.id)" class="buttontextred">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" style="margin-top: 15px;">
        <el-pagination @size-change="sizeChangeHandler" @current-change="currentChangeHandler"
                       :current-page.sync="pagination.pageNo" :page-sizes="[10, 20, 30, 50]"
                       :page-size.sync="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="pagination.total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import baseMixin from '@/mixins/baseMixin';
  import mixins from '@/mixins/windowResize';
  import {getSchoolTimeList} from '@/api/record';
  import {getDocumentFlowList, delDocumentFlowById, possessRole} from '@/api/teachingStudy/documentFlow';
  import {isShowByPermission} from '@/utils/utils';
  export default {
    name: "documentFlowIndex",
    data() {
      return {
        documentUrl: '',
        currentUserId: this.$store.getters.userInfo.id,
        title: '',
        schoolName: '',
        schoolTimeCode: '',
        schoolYearList: [],
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: null
        },
        dataList: [],
        isSchoolLeader: false
      }
    },
    mixins: [baseMixin, mixins],
    filters: {
      formatTime(date) {
        if (date) {
          return date.substring(0, 10);
        }
        return '--';
      }
    },
    watch: {
      schoolName() {
        this.getStatistics();
      }
    },
    created() {
      this.possessRole();
      this.getSchoolTimeList();
    },
    methods: {
      isShowByPermission,
      possessRole() {
        possessRole(56).then(res  =>{
          if(res.data.code === 200){
            this.isSchoolLeader = res.data.data.result;
          }
        }).catch(err => {});
      },
      addDocFlow() {
        this.$router.push({path: 'add'});
      },
      documentFlowup() {
        this.$router.push({path: 'documentFlowup'});
      },
      editDocFlow(id) {
        this.$router.push({path: 'add', query: {id: id}});
      },
      neweditDocFlow(id) {
        this.$router.push({path: 'eidt', query: {id: id}});
      },
      toDocumentFlowInfo(id, state) {
        this.$router.push({path: 'info', query: {id: id, state: state}});
      },
      changeSchool(val) {
        const self = this;
        this.schoolName = val;
        this.schoolYearList.forEach((item) => {
          if (item.schoolTimeName === val) {
            self.schoolTimeCode = item.id;
          }
        });
      },
      getSchoolTimeList() {
        getSchoolTimeList().then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.schoolYearList = data;
            data.forEach((item) => {
              if (item.isCurrent === 1) {
                this.schoolName = item.schoolTimeName;
                this.schoolTimeCode = item.id;
              }
            });
          }
        }).catch();
      },
      delDocumentFlowById(id) {
        this.$confirm('此操作将删除此批次流转, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delDocumentFlowById(id).then(res => {
            if (res.data.code === 200) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              this.getStatistics();
            } else {
              this.$message.error(res.data.msg);
            }
          }).catch();
        }).catch(() => {
        });
      },
      nameSearch() {
        this.pagination.pageNo = 1;
        this.getStatistics();
      },
      getStatistics() {
        this.documentUrl = global.BasePath + "structure/documentFlow/exportDocumentFlowList?schoolTimeId=" + this.schoolTimeCode + "&workFlowType=documentflow&token=" + this.$store.getters.token;
        let query = {
          pageNo: this.pagination.pageNo,
          pageSize: this.pagination.pageSize,
          title: this.title,
          schoolTimeId: this.schoolTimeCode
        };
        this.getDocumentFlowList(query);
      },
      getDocumentFlowList(query) {
        getDocumentFlowList(query).then(res => {
          const data = res.data;
          if (res.data.code === 200) {
              for(let i=0;i<data.data.dataList.length;i++){
            data.data.dataList[i].myisid=false
            for(let j=0;j<data.data.dataList[i].userList.length;j++){
              if(this.$store.getters.userInfo.id==data.data.dataList[i].userList[j].id){
                    data.data.dataList[i].myisid=true
              }
            }
          }
            this.dataList = data.data.dataList;
            this.pagination.total = data.data.pagination.total;
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch();
      },
      sizeChangeHandler() {
        this.pagination.pageNo = 1;
        this.getStatistics();
      },
      currentChangeHandler() {
        this.getStatistics();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .doc_flow_wrap {
    .header {
      padding: 12px 12px 10px 12px;
    }

    .doc_flow_table_box {
      padding: 0 15px 15px 15px;
      margin: 0 auto;
      .name_title{
        color: #409eff;
        cursor: pointer;
      }
    }
  }
</style>
