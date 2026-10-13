<template>
  <div>
    <div style="padding: 15px 15px 0 15px;">
      <back-tool>
        <template v-if="datalist.state === 1 || (datalist.state === 2 && datalist.auditState === 2)">
          <el-button type="danger" size="medium" @click="batchDeleteFunc">删除</el-button>
          <el-button type="primary" size="medium" @click="isImportDialogShow = true">导入</el-button>
          <a :href="downloadModalHref" target="_blank" download="studentName">
            <el-button type="primary" size="medium">导出</el-button>
          </a>
          <el-button type="primary" size="medium" @click="submitReportPerformanceAssess">上报</el-button>
        </template>
        <template v-else>
          <a :href="downloadModalHref" target="_blank" download="studentName">
            <el-button type="primary" size="medium">导出</el-button>
          </a>
        </template>
        <el-input style="float:right;width:20%" placeholder="请输入教师姓名" v-model="search" class="input-with-select"
                  size="medium">
          <el-button slot="append" icon="el-icon-search" @click="searchIt()"></el-button>
        </el-input>
      </back-tool>
    </div>

    <div style="padding:0 15px 15px">
      <el-table :data="tableData" border :height="maxH-1" @select="selectionChangeHandler" @select-all="selectionChangeHandler" v-if="showTable">
        <el-table-column type="selection" align="center" width="65px" :resizable="false"
                         v-if="datalist.state === 1 || (datalist.state === 2 && datalist.auditState === 2)">
        </el-table-column>
        <el-table-column label="教师姓名">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="部门" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.departNames }}</span>
          </template>
        </el-table-column>
        <el-table-column label="学科" width="150" show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span>{{ scope.row.currNames }}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级" show-overflow-tooltip width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.classNames }}</span>
          </template>
        </el-table-column>
        <!-- 渲染考核项 -->
        <template v-for="(item, index) in titleList">
          <el-table-column :width="item.pointType === 2 ? 220 : 180">
            <template slot="header" slot-scope="scope">
              <span>{{ item.itemName }}</span>
              <el-popover v-if="item.pointType === 2" placement="top" width="200" trigger="hover"
                          :content="'现金分值：' + item.cashScore + '元/分'">
                <i slot="reference" class="el-icon-question"></i>
              </el-popover>
            </template>
            <template slot-scope="scope">
							<span style="margin-left:3px" class="testInput">
								<span
                  v-if="item.pointType === 1 && (datalist.userJson || datalist.departJson) && datalist.state === 2 && !(datalist.state === 2 && datalist.auditState === 2)">{{ scope.row.pointList[index].point ? scope.row.pointList[index].point + '元' : '0元' }}</span>
								<span
                  v-else-if="item.pointType === 2 && (datalist.userJson || datalist.departJson) && datalist.state === 2 && !(datalist.state === 2 && datalist.auditState === 2)">
									{{ scope.row.pointList[index].score }}*{{ item.cashScore }}={{ (scope.row.pointList[index].score * item.cashScore).toFixed(2) }}元
								</span>
								<span v-else>
									<el-input v-if="item.pointType === 1" placeholder="0" maxlength="9"
                            @blur="setPerformance($event, scope, item, index)"
                            v-model.trim="scope.row.pointList[index].point"></el-input>
									<el-input style="width: 80px" v-else placeholder="0" maxlength="9"
                            @blur="setPerformance($event, scope, item, index)"
                            v-model.trim="scope.row.pointList[index].score"></el-input>
									<span v-if="item.pointType === 1">元</span>
									<span v-else>*{{ item.cashScore }}={{ (scope.row.pointList[index].score * item.cashScore).toFixed(2) }}元</span>
								</span>
							</span>
            </template>
          </el-table-column>
          <el-table-column :label="item.itemName + '备注'" v-if="item.haveRemark == 1" width="200">
            <template slot-scope="scope">
							<span
                v-if="(datalist.userJson || datalist.departJson) && datalist.state === 2 && !(datalist.state === 2 && datalist.auditState === 2)">
								{{ scope.row.pointList[index].remark || '--' }}
							</span>
              <el-input v-else v-model.trim="scope.row.pointList[index].remark" style="width: 100%"
                        @blur="setPerformance($event, scope, item, index, true)" placeholder="请输入备注"></el-input>
            </template>
          </el-table-column>
        </template>
        <el-table-column label="合计">
          <template slot-scope="scope">
            {{ scope.row.totalPoint ? scope.row.totalPoint + '元' : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="备注" show-overflow-tooltip width="200">
          <template slot-scope="scope">
            <div class="beizhu">
              <span
                v-if="(datalist.userJson || datalist.departJson) && datalist.state === 2 && !(datalist.state === 2 && datalist.auditState === 2)">{{ scope.row.remark || '--' }}</span>
              <el-input v-else v-model.trim="scope.row.remark" @blur="setRemark($event, scope.row)"
                        placeholder="请输入内容"></el-input>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="审核意见" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.auditRemark ? scope.row.auditRemark : '--' }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100"
                         v-if="datalist.state === 1 || (datalist.state === 2 && datalist.auditState === 2)">
          <template slot-scope="scope">
            <el-button @click="deleteFunc(scope.row)" type="text" size="small" class="buttontextred">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin: 15px 20px;">
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                     :page-sizes="[10, 20, 30, 40]" :page-size="10"
                     layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>

    <el-dialog title="导入" :visible.sync="isImportDialogShow" :close-on-press-escape='false'
               :close-on-click-modal='false' :modal-append-to-body='false' @open="synDailogOpen">
      <div class="bs-callout bs-callout-danger">
        <div class="title">导入说明：</div>
        <div class="info-title">1.请先下载模板，严格根据模板的格式来录入数据；</div>
        <div class="info-title">2.在执行批量导入操作后，会跳转到结果页面。如有失败用户，可修改后再次导入。</div>
      </div>
      <div class="sns-btn-div">
        <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :show-file-list='false'
                   accept=".xls" :before-upload="file => beforeUploadFunc(file, 1)"
                   :on-success="uploadSuccessFunc">
          <el-button size="medium" type="primary" :loading="importLoading">多项导入</el-button>
        </el-upload>
        <a :href="downloadModalHref" target="_blank" download="多项导入模版">
          <el-button type="text">模板下载</el-button>
        </a>
      </div>
      <div class="sns-btn-div">
        <el-upload class="upload-import" :action="uploadPathSingle" :data="uploadData" :show-file-list='false'
                   accept=".xls" :before-upload="file => beforeUploadFunc(file, 1)"
                   :on-success="uploadSuccessFunc">
          <el-button size="medium" type="primary" :loading="importLoading">单项导入</el-button>
        </el-upload>
        <a href="https://cdnfile-10043692.file.myqcloud.com/admin/xls/singleKaoheTempt.xls" target="_blank"
           download="单项导入模版">
          <el-button type="text">模板下载</el-button>
        </a>
      </div>

      <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="importDialogCloseFunc" size="medium">确 定</el-button>
          </span>
    </el-dialog>
  </div>
</template>
<script>
  import {
    getReportInfoById,
    queryReportUserByReportId,
    setPerformance,
    submitReportPerformanceAssess,
    setRemark,
    deleteUserByReportId
  } from '@/api/performance'
  import BackTool from '@/components/BackTool/index'
  import mixin from '@/mixins/windowResize'

  export default {
    components: {
      BackTool
    },
    data() {
      return {
        showTable: false,
        taskRelativeId: this.$route.query.taskRelativeId,
        reportId: this.$route.query.reportId,
        taskId: this.$route.query.taskId,
        pageSize: 10,
        pageNo: 1,
        total: '',
        search: '',
        titleList: '',
        datalist: '',
        tableData: [],
        taskInfo: {},
        uploadData: {},
        flag: true,
        uploadPath: '',
        uploadPathSingle: '',
        isImportDialogShow: false,
        resultShow: false,
        importLoading: false,
        selected: []
      }
    },
    mixins: [mixin],
    created() {
      this.taskInfo = JSON.parse(sessionStorage.getItem('taskInfo')) || {};
      this.getReportInfoById();
      this.queryReportUserByReportId();
    },
    computed: {
      downloadModalHref() {
        return global.BasePath + 'structure/performance/downReportUserByReportId?departId=0&taskId=' + this.datalist.taskId + '&reportId=' + this.reportId + '&searchName=' + this.search + '&token=' + this.$store.getters.token
      }
    },
    methods: {
      selectionChangeHandler(selection) {
        this.selected = selection;
      },
      batchDeleteFunc() {
        if (this.selected.length === 0) {
          this.$message.error('请选择要删除的教师');
        } else {
          this.deleteUserByReportIdFunc(this.selected.map(item => item.userId).join(','));
        }
      },
      deleteFunc(item) {
        this.deleteUserByReportIdFunc(item.userId);
      },
      deleteUserByReportIdFunc(userIds) {
        this.$confirm('是否确定要删除？', '删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          deleteUserByReportId({
            taskId: this.taskId,
            reportId: this.reportId,
            userIds
          })
            .then(res => res.data)
            .then(data => {
              if (data.result) {
                this.$message.success('删除成功');
                this.queryReportUserByReportId();
              } else {
                this.$message.error(data.msg);
              }
            })
        });

      },
      importDialogCloseFunc() {
        this.isImportDialogShow = false;
      },
      synDailogOpen() {
        this.resultShow = false;
      },
      //获取表格数据
      getReportInfoById() {
        getReportInfoById({
          reportId: this.reportId
        }).then(res => {
          this.datalist = res.data.data;
          this.uploadPath = global.BasePath + 'structure/performance/uploadPerformance';
          this.uploadPathSingle = global.BasePath + 'structure/performance/uploadSinglePerformance';
          this.uploadData = {
            reportId: this.reportId,
            token: this.$store.getters.token
          };
        })
      },
      //搜索
      searchIt() {
        this.pageNo = 1;
        this.queryReportUserByReportId()
      },
      beforeUploadFunc(file) {
        let suffix = file.name.split('.')[file.name.split('.').length - 1];
        if (suffix !== 'csv' && suffix !== 'xlsx' && suffix !== 'xls') {
          this.$message.error('请上传模版文件!');
          return false
        }
      },
      uploadSuccessFunc(res) {
        if (res.result) {
          this.$message({
            message: '模版导入成功！',
            type: 'success'
          });
          this.queryReportUserByReportId()
        } else {
          this.$message({
            message: res.msg,
            type: 'error'
          });
          this.queryReportUserByReportId()
        }
      },
      //获取表格数据
      queryReportUserByReportId() {
        this.selected = [];
        queryReportUserByReportId({
          departId: 0,
          searchName: this.search,
          taskId: this.$route.query.taskId,
          reportId: this.reportId,
          pageSize: this.pageSize,
          pageNo: this.pageNo
        }).then(res => {
          this.tableData = res.data.data.dataList;
          this.titleList = res.data.data.titleList;
          this.tableData.forEach(v => {
            v.pointList.forEach(item => {
              if (!item.itemId) {
                item.point = '';
                item.remark = ''
              }
            })
          });
          this.total = res.data.data.pagination.total;
          this.showTable = false;
          this.$nextTick(() => {
            this.showTable = true;
          })
        })
      },
      setPerformance(e, data, item, index, isRemark = false) {
        const reg = /(^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d{1,2})?$)/;
        let isTure = reg.test(data.row.pointList[index].point);
        if ((isTure && data.row.pointList[index].point <= 100000) || data.row.pointList[index].point == '' || isRemark) {
          setPerformance({
            classIds: data.row.classIds,
            classNames: data.row.classNames,
            currIds: data.row.currIds,
            currNames: data.row.currNames,
            remark: data.row.pointList[index].remark,
            assessDate: data.row.assessDate,
            departIds: data.row.departIds,
            departNames: data.row.departNames,
            haveRemark: item.haveRemark,
            itemId: item.itemId,
            itemName: item.itemName,
            orderNo: item.orderNo,
            point: (item.pointType === 1 ? data.row.pointList[index].point : (data.row.pointList[index].score * item.cashScore).toFixed(2)) || '0',
            taskId: data.row.taskId,
            taskName: data.row.taskName,
            typeId: data.row.typeId,
            typeName: data.row.typeName,
            userId: data.row.userId,
            userLoginName: data.row.userLoginName,
            userName: data.row.userName,
            cashScore: item.cashScore,
            pointType: item.pointType,
            score: data.row.pointList[index].score || '0'
          }).then(res => {
            let sum = 0;
            for (let i = 0; i < this.titleList.length; i++) {
              console.log(this.titleList[i].pointType, '123');
              if (this.titleList[i].pointType === 2) {
                sum += parseFloat((this.tableData[data.$index].pointList[i].score * this.titleList[i].cashScore).toFixed(2))
              } else {
                sum += parseFloat((this.tableData[data.$index].pointList[i].point - 0).toFixed(2))
              }
            }
            this.tableData[data.$index].totalPoint = parseFloat(sum.toFixed(2))
          })
        } else {
          this.$nextTick(function () {
            // data.pointList[index].point = parseInt(data.pointList[index].point)
            this.tableData[data.$index].pointList[index].point = ''
          });
          if (this.flag) {
            this.flag = false;
            setTimeout(() => {
              this.$message({
                message: '请输入正确的绩效金额',
                type: 'info'
              });
              this.flag = true
            }, 1000)
          }
        }
      },
      //提交上报
      submitReportPerformanceAssess() {
        this.$confirm('是否上报?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            submitReportPerformanceAssess({
              reportId: this.reportId,
              relativeId: this.taskRelativeId
            }).then(res => {
              this.$message({
                type: 'success',
                message: '上报成功!'
              });
              this.$router.back()
            })
          })
          .catch(() => {
          })
      },
      //提交备注
      setRemark(e, data) {
        setRemark({
          id: data.id,
          remark: data.remark
        }).then(res => {
        })
      },
      //分页操作
      handleSizeChange(val) {
        this.pageSize = val;
        this.queryReportUserByReportId()
      },
      handleCurrentChange(val) {
        this.pageNo = val;
        this.queryReportUserByReportId()
      }
    }
  }
</script>

<style scoped>
  /deep/ .testInput .el-input__inner {
    /*width: 110px;*/
  }

  /deep/ .beizhu .el-input {
    width: 100% !important;
  }

  /deep/ .el-input {
    width: 80%;
    margin-right: 8px;
  }

  /deep/ .menu-tools {
    border-bottom: none !important;
  }

  .sns-btn-div {
    height: 80px;
    padding-left: 20px;
    padding-top: 20px;
  }

  .title {
    font-size: 18px;
    font-weight: bold;
    height: 30px;
    line-height: 30px;
  }

  .bs-callout {
    padding: 20px;
    margin: 20px 0;
    border: 1px solid #eee;
    border-left-width: 5px;
    border-radius: 3px;
  }

  .bs-callout-danger {
    border-left-color: #ce4844;
  }

  .info-title {
    /* height:30px; */
    line-height: 30px;
  }

  .bs-callout-warning {
    border-left-color: #aa6708;
  }

  .upload-import {
    display: inline-block;
  }
</style>
