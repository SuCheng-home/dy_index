<template>
  <div class="messageList-wrap">
    <el-row class="menu-row">
      <el-col :span="19">
        <div>
          <el-button size="small" class="filter-item" type="primary" @click="addmessage">新建消息
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="delMessages">删除消息
          </el-button>
          <el-button size="small" class="filter-item" type="primary" @click="moveMessages">移动
          </el-button>
        </div>
      </el-col>
      <el-col :span="5">
        <el-input size="small" placeholder="请输入消息标题" v-model.trim="listQuery.title"
                  @change="handleInputChange"><i slot="suffix" class="el-input__icon el-icon-search"></i>
        </el-input>
      </el-col>
    </el-row>
    <div class="org-main custom—scrollbar">
      <el-table
        ref="columnTable"
        :data="messageTable"
        class="columnTable "
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
          label="标题" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            <!-- <router-link :to="{ path: 'messageDetail', query: { id:columnId,moduleId:moduleId,messageId: scope.row.id } }"> -->
              <span class="link-type" @click="messageDetail(scope.row.id)">{{scope.row.title}}</span>
            <!-- </router-link> -->
          </template>
        </el-table-column>
        <el-table-column
          label="模块名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.moduleNames }}
          </template>
        </el-table-column>
        <el-table-column
          label="发布时间" align="center" show-overflow-tooltip width="160">
          <template slot-scope="scope">
            {{ scope.row.createTime | filterTime}}
          </template>
        </el-table-column>
        <el-table-column align="center" label="状态" width="110" :filtered-value="filterTag"
                         :filter-multiple='false' :filters="filterState">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.state==0" type="info">全部</el-tag>
            <el-tag v-if="scope.row.state==1" type="info">未发布</el-tag>
            <el-tag v-if="scope.row.state==2" type="success">已发布</el-tag>
            <el-tag v-if="scope.row.state==3" type="warning">待审核</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="是否置顶" align="center" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.setTop!==-1">置顶</span>
            <span v-else>未置顶</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="240">
          <template slot-scope="scope">
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
                       @click.native="examMessage(scope.row.id)">
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
    <el-dialog title="消息移动" :visible.sync="dialogmoveVisible">
      <el-form :model="ruleForm" :rules="ruleFormRules" ref="ruleForm" label-width="100px">
        <el-form-item label="模块" prop="id">
          <el-select class="selectWidth" v-model="ruleForm.id" multiple placeholder="请选择模块">
            <el-option
              v-for="moduleItem in moduleList"
              :key="moduleItem.id"
              :label="moduleItem.name"
              :value="moduleItem.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogmoveVisible=false">取 消</el-button>
        <el-button type="primary" @click="addMoveModule()">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import _ from 'lodash';
  import mixins from '@/mixins/windowResize';
  import {mapGetters} from 'vuex';
  import {
    getSchoolWebModuleMessageList,
    delSchoolWebModuleMessageByIds,
    updateSchoolWebModuleMessageTop,
    getSchooWebColumnById,
    batchSchoolWebModuleMessage,
    getSchoolWebModuleListByWebId,
    moveSchoolWebModuleMessage
  } from '@/api/webManage';

  export default {
    data() {
      return {
        messageTable: [],
        moduleId: this.$route.query.moduleId,
        columnId: this.$route.query.id,

        listLoading: false,
        listQuery: {
          pageNo: 1,
          pageSize: 10,
          title: '',
          state: 2
        },
        filterState: [//状态数据

        ],
        filterTag: [
          {text: "全部", value: "0"},
          {text: "未发布", value: "1"},
          {text: "发布", value: "2"}
        ],//刷选绑定值
        total: null,
        multipleSelection: [],
        manageUser: '',
        isBatch: null,
        dialogmoveVisible: false,
        moduleList: [],
        ruleForm: {
          id: []
        },
        ruleFormRules: {
          id: [
            {required: true, message: '请选择模块', trigger: 'change'}
          ]
        },
        datamoduleIds: ''
      }
    },
    mounted() {
      this.listQuery.pageNo =  localStorage.getItem('mypageNo')?(localStorage.getItem('mypageNo')-0):1;
      this.listQuery.pageSize = 10;
      var This = this;
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
                {text: "已发布", value: "2"}
              ]
              this.listQuery.state = 3;
            } else if (this.isBatch == 1 || this.isBatch == 0) {
              this.filterState = [
                {text: "全部", value: "0"},
                {text: "未发布", value: "1"},
                {text: "已发布", value: "2"}
              ]
            }
            setTimeout(function () {
              This.getSchoolWebModuleMessageListFunc();
              This.getSchooWebColumnByIdFunc();
            }, 300);

          }
        }).catch(res => {
      })
      //模块
      this.getSchoolWebModuleListByWebIdFunc();
    },
    mixins: [mixins],
    filters: {
      filterTime(dateTime) {
        return dateTime == '' ? '' : dateTime.split(".")[0];
      }
    },
    computed: {
      ...mapGetters([
        'permission',
        'name',
        'webId'
      ])
    },
    watch: {
      $route(to, from) {
        if (to.query) {
          this.columnId = to.query.id;
          this.moduleId = to.query.moduleId;
          this.listQuery.pageNo = 1;
          this.listQuery.pageSize = 10;
          this.$store.dispatch('getOneWebInfo', {webId: this.webId}).then(res => res.data)
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
                } else if (this.isBatch == 1) {
                  this.filterState = [
                    {text: "全部", value: "0"},
                    {text: "未发布", value: "1"},
                    {text: "已发布", value: "2"}
                  ]
                }
                this.getSchoolWebModuleMessageListFunc();
                this.getSchooWebColumnByIdFunc();
              }
            }).catch(res => {
          })
          this.getSchoolWebModuleListByWebIdFunc();
        }
      },

      filterTag: function (val) {
        //console.log("val",val)
        this.listQuery.state = val[0];
        this.getSchoolWebModuleMessageListFunc();
      }
    },
    methods: {
      addMoveModule() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            // console.log(this.ruleForm.id)
            this.datamoduleIds = this.ruleForm.id;
            let arr = this.multipleSelection.map(obj => {
              return obj.id;
            })
            moveSchoolWebModuleMessage({
              messageIds: arr.toString(),
              moduleIds: this.datamoduleIds.toString()
            }).then(res => res.data)
              .then(data => {
                if (data.code === 200) {
                  this.dialogmoveVisible = false;
                  this.getSchoolWebModuleMessageListFunc();
                  this.ruleForm.id = [];
                  this.$message({
                    type: 'success',
                    message: '消息移动成功！'
                  })
                }
              })
            //

          }
        })
      },
      getSchoolWebModuleListByWebIdFunc() {
        getSchoolWebModuleListByWebId({
          webId: localStorage.getItem("webId"),
          type: 23
        }).then(res => res.data)
          .then(data => {
            this.moduleList = data.data;
          })
      },
      moveMessages() {
        if (!this.multipleSelection.length) {
          this.$message({
            type: 'warning',
            message: '请选择要移动的消息'
          })
        } else {
          this.dialogmoveVisible = true;
        }
      },
      recycleHandler(id) {
        this.$confirm('撤回回收箱网站上将不再展示？', '提示', {type: 'error'}).then(() => {
          this.listQuery.state = 1;
          batchSchoolWebModuleMessage({
            addType: 1,
            id: id,
            state: this.listQuery.state
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
        //消息审核
        var This = this;
        this.listQuery.state = 2;
        batchSchoolWebModuleMessage({
          addType: 0,
          id: id,
          state: this.listQuery.state
        }).then(res => res.data)
          .then(data => {

            setTimeout(function () {
              This.getSchoolWebModuleMessageListFunc();
              This.$message({
                type: 'success',
                message: '通过审核!'
              });
            }, 100);
          }).catch(res => {
        })
      },
      getSchooWebColumnByIdFunc() {
        getSchooWebColumnById({
          columnId: this.columnId
        }).then(res => res.data)
          .then(data => {
            if (data.code === 200) {
              this.manageUser = data.data.managerUserJson;
            }
          })
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
      handleInputChange: _.debounce(function (val) {
        this.getSchoolWebModuleMessageListFunc();
      }, 500),
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        this.listQuery.pageSize = val;
        this.getSchoolWebModuleMessageListFunc();
      },
      handleCurrentChange(val) {
        this.listQuery.pageNo = val;
        this.getSchoolWebModuleMessageListFunc();
      },
      getSchoolWebModuleMessageListFunc() {
        this.listLoading = true;
        var This = this;
        getSchoolWebModuleMessageList({
          pageNo: this.listQuery.pageNo,
          pageSize: this.listQuery.pageSize,
          title: this.listQuery.title,
          moduleId: this.moduleId,
          state: this.listQuery.state,
          webId: localStorage.getItem("webId")
        }).then(res => res.data)
          .then(data => {
            if (data.code === 200) {
              if (this.listQuery.state == 3 && data.data.dataList.length == 0) {
                this.listQuery.state = 2;
                setTimeout(function () {
                  This.getSchoolWebModuleMessageListFunc();
                }, 300)
              }
              this.messageTable = data.data.dataList;
              this.total = data.data.pagination.total;
              this.listLoading = false;

            }
          }).catch(res => {
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
      delMessages(id) {
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
      editOneMessage(id) {       
        localStorage.setItem('mypageNo',this.listQuery.pageNo);
        this.$router.push({
          path: 'editMessage',
          query: {
            id: this.columnId,
            moduleId: this.moduleId,
            messageId: id
          }
        })
      },
      messageDetail(id) {       
        localStorage.setItem('mypageNo',this.listQuery.pageNo);
        this.$router.push({
          path: 'messageDetail',
          query: {
            id: this.columnId,
            moduleId: this.moduleId,
            messageId: id
          }
        })
      },

      addmessage() {
         localStorage.setItem('mypageNo',this.listQuery.pageNo);
        this.$router.push({
          path: 'messageJia',
          query: {
            moduleId: this.moduleId,
            id: this.columnId
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
  .messageList-wrap {
    .menu-row {
      border-bottom: 1px solid #e7eaec;
      box-sizing: border-box;
      padding-bottom: 15px;
      padding-top: 15px;
    }

    .menu-row .el-button {
      margin-left: 15px;
    }

    .org-main {
      width: 100%;
    }

    .columnTable {
      margin-top: 20px;

      .moduleImg {
        width: 25px;
        height: 25px;
      }
    }
  }

  .pagination-container {
    margin-top: 20px;
  }

  .selectWidth {
    width: 80%;
    height: auto;
  }
</style>
<style lang="scss">
  .columnTable .el-table__header .has-gutter th {
    background: #EEF1F6;
    font-size: 14px;
    color: #1f2d3d;
  }

  .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar {
    width: 6px;
    background-color: rgba(255, 255, 255, 0.1);
  }

  .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-thumb {
    background-color: #999;
  }

  .el-table--scrollable-y .el-table__body-wrapper::-webkit-scrollbar-track {
    background-color: rgba(255, 255, 255, 0.1);
  }

  .el-table-filter__list-item:nth-child(1) {
    display: none !important;
  }
</style>
