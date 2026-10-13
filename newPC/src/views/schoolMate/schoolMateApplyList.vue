<template>
  <div class="school_mate_apply_list">
    <div class="header">
       <el-select size="medium"  v-model="pagination.gradeId" placeholder="请选择年级" style="width:150px" @change="queryClassByGradeIds()">
                <el-option label="全部年级" :value="0"></el-option>
                <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-select size="medium"  v-if="pagination.gradeId!=0" v-model="pagination.classId" style="width:150px"  @change="sizeChangeHandler()" placeholder="请选择班级">
                <el-option label="全部班级" :value="0"></el-option>
                <el-option v-for="item in classList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
      <el-select size="medium" v-model="selectStatus" placeholder="请选择" @change="changeAdviceType">
        <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value">
        </el-option>
      </el-select>
       <el-button size="medium" type="primary" @click="checkFellowApplyBatch()">一键通过</el-button>
      <el-button size="medium" type="primary" @click="toSetPage">申请设置</el-button>
      <a :href="exportUrl" download="导出结果" target="_blank" v-if="dataList.length">
        <el-button type="primary" size="medium" icon="upload">导出</el-button>
      </a>
        <el-button type="primary" size="medium" icon="upload" @click="exportSchoolFellowFile()">导出附件</el-button>
    </div>
    <div class="school_mate_apply_wrap">
      <el-table stripe :data="dataList" style="width: 100%" border highlight-current-row :height="maxH" @select="handleSelectionChange" @select-all="handleSelectionChange">
           <el-table-column type="selection" align="center" width="65px" :selectable="selectedfun" :resizable="false"></el-table-column>
        <el-table-column label="姓名" show-overflow-tooltip width="120px">
          <template slot-scope="scope">
            <span @click="toAdviceInfo(scope.row.id, scope.row.applyStatus)" class="advice_content">{{scope.row.realName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" width="80px">
          <template slot-scope="scope">
            <span>{{sexTypeList[scope.row.sex] || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号">
          <template slot-scope="scope">
            <span>{{scope.row.mobile}}</span>
          </template>
        </el-table-column>
         <el-table-column label="身份证号">
          <template slot-scope="scope">
            <span>{{scope.row.cardId}}</span>
          </template>
        </el-table-column>
        <el-table-column label="年级（毕业年份）">
          <template slot-scope="scope">
            <span>{{scope.row.gradeName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="班级">
          <template slot-scope="scope">
            <span>{{scope.row.className || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="班主任或老师">
          <template slot-scope="scope">
            <span>{{scope.row.teacherName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="审核状态">
          <template slot-scope="scope">
            <el-tag  size="mini" type="warning"  v-if="scope.row.applyStatus===0">待审核</el-tag>
            <el-tag  size="mini" type="success"  v-else-if="scope.row.applyStatus===1">已通过</el-tag>
            <el-tag  size="mini" type="danger"  v-else-if="scope.row.applyStatus===2">未通过</el-tag>
          </template>
        </el-table-column>
         <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
              <el-button size="small" type="text"  @click="toAdviceInfo(scope.row.id, scope.row.applyStatus)" :disabled="scope.row.applyStatus!=0">
                  审核
              </el-button>
              <el-button size="small" type="text"  class="buttontextred" @click="deleteFellowApply(scope.row.id)">
                  删除
              </el-button>
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
  import mixins from '@/mixins/windowResize';
  import {schoolfellowList, schoolfellowCommonList,deleteFellowApply,getGradeAndClass,checkFellowApplyBatch,exportSchoolFellowFile} from '@/api/schoolMate';
  import {thunderExport} from '@/utils/utils'
  export default {
    name: "schoolMateApplyList",
    data() {
      return {
        pagination: {
          pageNo: 1,
          pageSize: 20,
          total: null,
          classId:0,//	下拉选择的班级id	number
          gradeId:0,//	下拉选择的年级id	number
        },
        selectStatus: 0,
        sexTypeList: ['未知', '男', '女'],
        statusList: [
          {
            value: 0,
            label: '待审核'
          },
          {
            value: 1,
            label: '已通过'
          },
          {
            value: 2,
            label: '未通过'
          }
        ],
        dataList: [],
        exportUrl: '',
        gradeList:[],
        classList:[],
        selected: [],
      }
    },
    mixins: [mixins],
     activated() {
            this.getStatistics();
           this.getGradeAndClass()
        },
    created() {
      this.getStatistics();
      this.getGradeAndClass()
    },
    methods: {
      selectedfun(row) {
            if (row.applyStatus==0) { // 根据你的条件来设置
                return true //可选择
            } else {
                return false; //不可选择
            }
            },
      handleSelectionChange(val) {
                this.selected = val;
            },
      deleteFellowApply(id) {
                this.$confirm('是否删除', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    deleteFellowApply(id)
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.selected=[]
                                this.getStatistics();
                            }
                        })
                });

            },
          checkFellowApplyBatch() {
             if(this.selected.length==0){
                    this.$message({
                    message: "请勾选要通过的校友申请",
                    type: "error"
                    });
                  return;
                }
                this.$confirm('是否一键通过', '一键通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(() => {
                   let applyIds=[]
                    this.selected.forEach(v => {
                      applyIds.push(v.id)
                    })
                    checkFellowApplyBatch({
                        applyIds:applyIds,
                        status:1
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: data.msg
                                });
                                this.getStatistics();
                            }else{
                               this.$message({
                                message: data.msg,
                                type: "error"
                                });
                            }
                        })
                });

            },
      getGradeAndClass(){
        getGradeAndClass().then(res => {
          const data = res.data.data;
          this.gradeList=res.data.data 
        }).catch(() => {
        });
      },
      exportSchoolFellowFile(){
        exportSchoolFellowFile().then(res => {
          const data = res.data.data;
          thunderExport(data.fileName, data.redisKey)
        }).catch(() => {
        });
      },
       //获取班级
            queryClassByGradeIds() {
                this.classList=[];
                this.pagination.classId=0;
                if(this.pagination.gradeId!=0){                   
                 for(let i=0;i<this.gradeList.length;i++){
                   if(this.pagination.gradeId==this.gradeList[i].id){
                     this.classList=this.gradeList[i].classList
                   }
                 }
                }
                this.sizeChangeHandler();
               
            },
      toAdviceInfo(id, status) {
        this.$router.push({path: 'applyInfo', query: {applyId: id, applyStatus: status}});
      },
      toSetPage() {
        this.$router.push({path: 'applySet'});
      },
      changeAdviceType() {
        this.getStatistics();
      },
      getStatistics() {
        let query = {
          status: this.selectStatus,
          pageNo: this.pagination.pageNo,
          classId: this.pagination.classId,
          gradeId: this.pagination.gradeId,
          pageSize: this.pagination.pageSize
        };
        this.exportUrl = `${global.BaseNewPath}schoolfellow/exportSchoolFellow?token=${this.$store.getters.token}&gradeId=${this.pagination.gradeId}&classId=${this.pagination.classId}&status=${this.selectStatus}`;

        if (this.$route.query.code) {
          this.schoolfellowCommonList(query);
        } else {
          this.schoolfellowList(query);
        }
      },
      schoolfellowList(query) {
        schoolfellowList(query).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.dataList = data.dataList;
            this.pagination.total = data.pagination.total;
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch(() => {
        });
      },
      schoolfellowCommonList(query) {
        schoolfellowCommonList(query).then(res => {
          const data = res.data.data;
          if (res.data.code === 200) {
            this.dataList = data.dataList;
            this.pagination.total = data.pagination.total;
          } else {
            this.$message({
              message: data.msg,
              type: 'warning'
            });
          }
        }).catch(() => {
        });
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
  .school_mate_apply_list {
    padding:12px;

    .header {
      padding-bottom: 10px;
      margin-bottom: 0 !important;
    }

    .school_mate_apply_wrap {
      margin: 0 auto;

      .advice_content {
        color: #409eff;
        cursor: pointer;
      }
    }
  }
</style>
