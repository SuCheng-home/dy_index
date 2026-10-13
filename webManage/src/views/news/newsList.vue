<template>
  <div class="newsIndexWrapper" :style="`height:${columnMax}px`">
    <el-row class="menu-row">
      <el-col :span="19">
        <div>
          <el-button size="small" class="filter-item" type="primary" @click="addmessage()"
                     v-if="permission.indexOf('/schoolWebTwo/columnManager')!==-1">新增
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="delMessages()"
                     v-if="permission.indexOf('/schoolWebTwo/columnManager')!==-1">删除
          </el-button>
          <el-select class="selectWidth left-line" v-model="listQuery.moduleId" size="small" placeholder="请选择模块"
                     @change="selectModule">
            <el-option label="全部" :value="0"></el-option>
            <el-option
              v-for="moduleId in moduleIds"
              :key="moduleId.id"
              :label="moduleId.name"
              :value="moduleId.id">
            </el-option>
          </el-select>
        </div>
      </el-col>
      <el-col :span="5">
        <el-input size="small" placeholder="请输入消息标题/老师姓名" v-model.trim="listQuery.title"
                  @change="handleInputChange"><i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="message-main custom—scrollbar" :style="`height:${columnMax-70}px`">
      <el-table
        ref="messageTable"
        :data="messageTable"
        class="messageTable custom—scrollbar"
        border
        :height="`${columnMax-160}`"
        fit highlight-current-row
        v-loading.body="listLoading"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection" align="center"
          width="55">
        </el-table-column>
        <el-table-column
          label="消息封面" align="center" show-overflow-tooltip width="80">
          <template slot-scope="scope">
            <img v-if="scope.row.logoUrl" @click="showModuleImg(scope.row.logoUrl)" class="moduleImg"
                 :src="scope.row.logoUrl" alt="">
            <img v-else class="moduleImg" src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png"
                 alt="">
          </template>
        </el-table-column>
        <el-table-column
          label="标题" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <router-link class="link-type" :to="{ path: 'newsDetail', query: { id:scope.row.id} }">
              <span>{{scope.row.title}}</span>
            </router-link>
          </template>
        </el-table-column>
        <el-table-column
          label="模块名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.moduleNames }}
          </template>
        </el-table-column>
        <el-table-column
          label="创建人" align="center" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            {{ scope.row.createUserName }}
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间" align="center" show-overflow-tooltip width="160">
          <template slot-scope="scope">
            {{ scope.row.createTime | filterTime}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="100" :filtered-value="filterTag"
                         :filter-multiple='false' :filters="filterState">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==0" type="info">全部</el-tag>
            <el-tag v-if="scope.row.state==1" type="info">未发布</el-tag>
            <el-tag v-if="scope.row.state==2" type="success">已发布</el-tag>
            <el-tag v-if="scope.row.state==3" type="warning">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否置顶" align="center" show-overflow-tooltip width="90">
          <template slot-scope="scope">
            <span v-if="scope.row.setTop!==-1">置顶</span>
            <span v-else>未置顶</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope" v-if="permission.indexOf('/schoolWebTwo/columnManager')!==-1">
            <el-button size="small" v-if="scope.row.state==2&&scope.row.setTop==-1" type="text"
                       @click.native="setTop(1,scope.row.id)">
              置顶
            </el-button>
            <el-button size="small" type="text" v-if="scope.row.state==2&&scope.row.setTop!==-1"
                       @click.native="setTop(2,scope.row.id)">
              取消置顶
            </el-button>
            <el-button size="small" type="text"
                       v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1&&scope.row.state==3"
                       @click="examMessage(scope.row.id)">
              通过审核
            </el-button>
            <el-button size="small" type="text" @click.native="editOneMessage(scope.row.id)">
              编辑
            </el-button>
            <el-button size="small" type="text" @click="deleOneMessage(scope.row.id)">
              删除
            </el-button>
            <el-button size="small" type="text" v-if="scope.row.state==2" @click.native="recycleHandler(scope.row.id)">
              撤回至回收箱
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                       :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30, 50]"
                       :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                       :total="total">
        </el-pagination>
      </div>
    </div>
    <previewer-dialog ref="previewer" :src="picSrc"></previewer-dialog>
  </div>
</template>

<script>
  import _ from 'lodash';
  import mixins from '@/mixins/windowResize';
  import {
    getSchoolWebModuleMessageList,
    delSchoolWebModuleMessageByIds,
    updateSchoolWebModuleMessageTop,
    batchSchoolWebModuleMessage,
    getSchoolWebModuleListByWebId
  } from '@/api/webManage';
  import {mapGetters} from 'vuex';
  import PreviewerDialog from '@/components/ImagePreviewer/PreviewerDialogOne.vue';

  export default {
    components: {
      PreviewerDialog
    },
    data() {
      return {
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          title: '',
          state: 0,
          moduleId: 0
        },
        listLoading: false,
        messageTable: [],
        filterState: [//状态数据
          {text: "全部", value: "0"},
          {text: "未发布", value: "1"},
          {text: "待审批", value: "3"},
          {text: "已发布", value: "2"}
        ],
        filterTag: [],//刷选绑定值
        total: null,
        multipleSelection: [],
        picSrc: '',
        isBatch: null,
        moduleIds: []
      }
    },
     activated(){
        this.getSchoolWebModuleMessageListFunc();
    },
    created() {
      if (this.webId) {
        localStorage.setItem('webId', this.webId);
        this.getSchoolWebModuleListByWebIdFunc();
        this.listQuery.moduleId = 0;
      }
    },
    mounted() {
      this.$store.dispatch('getOneWebInfo', {webId: localStorage.getItem('webId')}).then(res => res.data)
        .then(data => {
          if (data.code === 200) {
            let serviceData = data.data;
            this.isBatch = serviceData.isBatch;
            if (this.isBatch == 2) {
              this.filterState = [
                {text: "全部", value: "0"},
                {text: "未发布", value: "1"},
                {text: "待审批", value: "3"},
                {text: "已发布", value: "2"},
              ]
              this.listQuery.state = 3;
            } else if (this.isBatch == 1 || this.isBatch == 0) {
              this.filterState = [
                {text: "全部", value: "0"},
                {text: "未发布", value: "1"},
                {text: "已发布", value: "2"}
              ]
            }
            this.getSchoolWebModuleMessageListFunc();
          }
        })


    },
    computed: {
      ...mapGetters([
        'webId',
        'webName',
        'permission'
      ])
    },
    mixins: [mixins],
    filters: {
      filterTime(date) {
        return date == '' ? '' : date.split(".")[0];
      }
    },
    watch: {
      filterTag: function (val) {
        this.listQuery.state = val[0];
        this.getSchoolWebModuleMessageListFunc();
      }
    },
    methods: {
      selectModule(val) {
        this.listQuery.moduleId = val;
        this.getSchoolWebModuleMessageListFunc();
      },
      getSchoolWebModuleListByWebIdFunc() {
        getSchoolWebModuleListByWebId({
          webId: localStorage.getItem("webId"),
          type: 23
        }).then(res => res.data)
          .then(data => {
            this.moduleIds = data.data;
          })
      },
      recycleHandler(id) {
        this.$confirm('撤回回收箱网站上将不再展示？', '提示', {type: 'error'}).then(() => {
          batchSchoolWebModuleMessage({
            addType: 1,
            id: id,
            state: 1
          }).then(res => res.data)
            .then(data => {
              this.getSchoolWebModuleMessageListFunc();
              this.$message({
                type: 'success',
                message: '撤回回收箱成功!'
              });
            })
        }).catch(() => {
        })
      },
      examMessage(id) {
        batchSchoolWebModuleMessage({
          id: id,
          addType: 0,
          state: 2
        }).then(res => res.data)
          .then(data => {
            this.getSchoolWebModuleMessageListFunc();
            this.$message({
              type: 'success',
              message: '通过审核!'
            });

          })
      },
      showModuleImg(src) {
        this.picSrc = src;
        this.$refs.previewer.show();
      },
      delMessages() {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要删除的消息'
          })
        } else {
          this.$confirm('删除此消息网站上将不再展示？', '提示', {type: 'error'}).then(() => {
            let arr = this.multipleSelection.map(obj => {
              return obj.id;
            })
            delSchoolWebModuleMessageByIds({
              messageIds: arr.toString()
            }).then(res => res.data)
              .then(data => {
                if (data.code === 200) {
                  this.getSchoolWebModuleMessageListFunc();
                  this.$message({
                    type: 'success',
                    message: '删除成功!'
                  });
                }
              })
          }).catch(() => {
          })
        }
      },
      setTop(code, id) {
        updateSchoolWebModuleMessageTop({
          messageId: id,
          ropAndDownState: code
        }).then(res => res.data)
          .then(data => {
            if (data.code === 200) {
              if (code == 1) {
                this.$message({
                  type: 'success',
                  message: '置顶成功!'
                });
                this.getSchoolWebModuleMessageListFunc();
              } else if (code == 2) {
                this.$message({
                  type: 'success',
                  message: '取消置顶成功!'
                });
                this.getSchoolWebModuleMessageListFunc();
              }
            }
          })
      },
      deleOneMessage(id) {
        this.$confirm('删除此消息网站上将不再展示？', '提示', {type: 'error'}).then(() => {
          delSchoolWebModuleMessageByIds({
            messageIds: id
          }).then(res => res.data)
            .then(data => {
              if (data.code === 200) {
                this.getSchoolWebModuleMessageListFunc();
                this.$message({
                  type: 'success',
                  message: '删除成功!'
                });
              }
            })
        }).catch(() => {
        })
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getSchoolWebModuleMessageListFunc();
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.getSchoolWebModuleMessageListFunc();
      },
      handleInputChange: _.debounce(function (val) {
        this.getSchoolWebModuleMessageListFunc();
      }, 500),
      getSchoolWebModuleMessageListFunc() {
        this.listLoading = true;
        getSchoolWebModuleMessageList({
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          title: this.listQuery.title,
          moduleId: this.listQuery.moduleId,
          state: this.listQuery.state,
          webId: localStorage.getItem("webId")
        }).then(res => res.data)
          .then(data => {
            if (data.code === 200) {
              if (this.listQuery.state == 3 && data.data && data.data.dataList.length == 0) {
                this.listQuery.state = 2;
                this.getSchoolWebModuleMessageListFunc();
              } else {
                this.messageTable = data.data.dataList;
                // if(this.messageTable.length==0&&this.listQuery.pageNo!==1){
                //   this.listQuery.pageNo--;
                //   this.getSchoolWebModuleMessageListFunc();
                // }
                this.total = data.data.pagination.total;
                this.listLoading = false;
              }

            }
          }).catch(res => {
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      addmessage() {
        //新增
        this.$router.push({
          path: 'newsJia'
        })
      },
      editOneMessage(id) {
        //编辑
        this.$router.push({
          path: 'editNews',
          query: {
            id: id
          }
        })
      },
      setNew() {
        //设置
      }
    }
  }
</script>

<style lang="scss" scoped>
  .newsIndexWrapper {
    .menu-row {
      border-bottom: 1px solid #e7eaec;
      box-sizing: border-box;
      padding-bottom: 15px;
      padding-top: 15px;
    }

    .message-main {
      margin-top: 20px;
    }

    .pagination-container {
      margin-top: 20px;
    }
  }

  .newList-wrap {
    width: 100%;
    padding: 20px 15px;
    overflow-x: hidden;
    overflow-y: auto;
    box-sizing: border-box;
  }

  .menu-row {
    border-bottom: 1px solid #e7eaec;
    box-sizing: border-box;
    padding-bottom: 20px;
  }

  .menu-row .el-button {
    margin-left: 15px;
  }

  .messageTable {
    .moduleImg {
      display: inline-block;
      width: 25px;
      height: 25px;
      vertical-align: middle;
    }
  }

  .el-table__body-wrapper {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #999;
  }

  .el-table__body-wrapper::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .left-line {
    margin-left: 15px;
  }
</style>
<style lang="scss">
  .el-table-filter__list-item:nth-child(1) {
    display: none !important;
  }

  .messageTable .el-table__header .has-gutter th {
    background: #EEF1F6;
    font-size: 14px;
    color: #1f2d3d;
  }

</style>
