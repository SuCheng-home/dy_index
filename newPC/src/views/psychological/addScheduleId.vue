<template>
    <div class="tao_statistics"  style="    padding: 12px;">
        <div class="header">
            <el-row>
                <el-col :span="19">
                     <el-date-picker
                        v-model="searchDate"
                        type="daterange" class="mywidthdaterange" size="medium"
                        range-separator="~"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="queryDateSchedule">
                      </el-date-picker>
                      <el-button type="primary"  size="medium" @click="newIt">新建</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table
            :data="tableData"
            border
            :height="`${boxH - 260}px`"
            :stripe='true'
            style="width: 100%">
            <el-table-column
              prop="scheduleDate"
              label="日期"
              align="center">
            </el-table-column>
            <el-table-column
              prop="dateRange"
              label="时间段"
              align="center">
            </el-table-column>
            <el-table-column
              prop="limitCount"
              label="可预约数"
              align="center">
            </el-table-column>
            <el-table-column
              prop="subscribeCount"
              label="已预约数"
              align="center">
            </el-table-column>
            <el-table-column
              label="操作"
              align="center">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="editIt(scope.row)">编辑</el-button>
                <el-button type="text" size="small" @click="deleteIt(scope.row)" class="buttontextred">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page.sync="listQuery.pageNo" :page-sizes="[10,20,30,50]"
                        :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                        :total="total" class="list-pagination">
        </el-pagination>
       <el-dialog title="新建" :visible.sync="dialogFormVisible" @close="cancelIt">
        <el-form :model="formData" :rules="rules" ref="dialogForm">
          <el-form-item label="日期" :label-width="formLabelWidth" prop="scheduleDate">
              <el-date-picker :disabled="disabled"
                v-model="formData.scheduleDate"
                type="date"
                placeholder="选择日期"
                :picker-options="pickOptions">
              </el-date-picker>
          </el-form-item>
          <el-form-item label="时间段" :label-width="formLabelWidth" prop="timeArr">
             <el-time-picker :disabled="disabled"
                is-range
                v-model="formData.timeArr"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                format="HH:mm"
                >
              </el-time-picker>
          </el-form-item>
          <el-form-item label="可预约数" :label-width="formLabelWidth"  prop="limitCount">
             <el-input-number v-model="formData.limitCount" @change="handleChange" :min="0" :max="10000" label="描述文字"></el-input-number>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cancelIt">取 消</el-button>
          <el-button type="primary" @click="confirmIt">确 定</el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
    import { queryDateSchedule, insertDateSchedule, editDateSchedule, deleteDateScheduleById } from '@/api/psychological';
    import baseMixin from '@/mixins/baseMixin';
    import windowResizeMixin from '@/mixins/windowResize';
    const _ = require('lodash');
    export default {
        mixins: [windowResizeMixin, baseMixin],
        data() {
            var validateLimitCount = (rule, value, callback) => {
              if (!value) {
                callback(new Error('请输入预约数！'));
              } else {
                callback();
              }
            };
            var validatetimeArr = (rule, value, callback) => {
              if (this.formData.timeArr && this.formData.timeArr[1]) {
                callback();
              } else {
                callback(new Error('请选择时间段！'));
              }
            };
            return {
                editNumber: '',
                disabled: false,
                editId: '',
                weekList: [],
                searchDate: [],
                listQuery:{
                  pageNo: 1,
                  pageSize: 10
                },
                pickOptions:{
                  disabledDate(time) {
                    return time.getTime() <= Date.now() - 60 * 60 * 24 * 1000
                  }
                },
                formLabelWidth: '80px',
                searchName:'',//搜索条件-老师姓名
                total:null,//数据总条数
                tableData: [],//表格数据源
                dialogFormVisible: false,
                rules: {
                  scheduleDate: [
                    {required: true, message: '请选择日期', trigger: 'blur' }
                  ],
                  limitCount:[
                   {required: true, validator: validateLimitCount, trigger: 'change' }
                  ],
                  timeArr: [
                   {required: true, validator: validatetimeArr, trigger: 'change' }
                  ],
                },
                formData: {
                  scheduleDate: '',
                  timeArr:[new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 9, 0)],
                  limitCount: 0
                }
         }
       },
        created(){
            let nowDate = new Date()
            let num = 8 - nowDate.getDay()
            this.searchDate[0] = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()-0 + num);
            this.searchDate[1] = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate()-0 + num + 6);
            this.queryDateSchedule()
        },
        methods: {
            // 取消对话框  清空校验
            cancelIt() {
               this.disabled = false
               this.editNumber = ''
               this.formData.scheduleDate = ''
               this.formData.scheduleDate = '',
               this.formData.timeArr = [new Date(2016, 9, 10, 8, 0), new Date(2016, 9, 10, 9, 0)]
               this.formData.limitCount = 0
               this.$refs.dialogForm.clearValidate('scheduleDate')
               this.$refs.dialogForm.clearValidate('limitCount')
               this.dialogFormVisible = false
            },
            // 删除时间表
            deleteIt(item) {
               if (item.subscribeCount > 0) {
                  this.$message({
                        type: 'warning',
                        message: '该时间已有预约,无法删除!'
                  });   
                  return
               }
               this.$confirm('确定要删除该条数据吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                   deleteDateScheduleById({
                     id: item.id
                   }).then(res => {
                      this.queryDateSchedule()
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                      });    
                   })
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });          
                });
            },
            // 新建
            newIt() {
               this.dialogFormVisible = true
               this.formData.limitCount = 0
               this.$refs.dialogForm.clearValidate('scheduleDate')
               this.$refs.dialogForm.clearValidate('limitCount')
               this.editId = ''
            },
            // 编辑时间表
            editIt(item) {
              if (item.subscribeCount > 0) {
                this.disabled = true
                this.editNumber = item.subscribeCount
              }
              this.dialogFormVisible = true
              this.formData.scheduleDate = new Date(item.scheduleDate)
              this.editId = item.id
              let arr = item.dateRange.split(' - ')
              let arr1 = arr[0].split(':')
              let arr2 = arr[1].split(':')
              this.formData.timeArr = [new Date(2022,3,7,arr1[0],arr1[1],0),new Date(2022,3,7,arr2[0],arr2[1],0)]
              console.log(this.formData.timeArr)
              this.formData.limitCount = item.limitCount
            },
            // 对话框确认
            confirmIt() {
              this.$refs['dialogForm'].validate((valid) => {
                if (valid) { 
                  if (!this.editId) {
                    insertDateSchedule({
                        dateRange: this.$moment(this.formData.timeArr[0]).format('HH:mm')+' - '+ this.$moment(this.formData.timeArr[1]).format('HH:mm'),
                        scheduleDate: this.$moment(this.formData.scheduleDate).format('YYYY-MM-DD'),
                        limitCount: this.formData.limitCount
                      }).then(res => {
                        if (res.data.result) {
                          this.formData.scheduleDate = ''
                          this.formData.timeArr = [new Date(2022, 3, 27, 8, 0), new Date(2022, 3, 27, 9, 0)]
                          this.formData.limitCount = 0
                          this.dialogFormVisible = false
                          this.queryDateSchedule() 
                          this.$message({
                            type: 'success',
                            message: '添加成功!'
                          });   
                        }
                      })
                  } else {
                    if (this.formData.limitCount < this.editNumber) {
                       this.$message({
                        type: 'warning',
                        message: '可预约人数不能小于已预约人数!'
                      });   
                      return
                    }
                    editDateSchedule({
                        dateRange: this.$moment(this.formData.timeArr[0]).format('HH:mm')+' - '+ this.$moment(this.formData.timeArr[1]).format('HH:mm'),
                        scheduleDate: this.$moment(this.formData.scheduleDate).format('YYYY-MM-DD'),
                        limitCount: this.formData.limitCount,
                        id: this.editId
                    }).then(res => {
                          if (res.data.result) {
                             this.formData.scheduleDate = ''
                             this.formData.timeArr = [new Date(2022, 3, 27, 8, 0), new Date(2022, 3, 27, 9, 0)]
                             this.formData.limitCount = 0
                             this.dialogFormVisible = false
                             this.editId = ''
                             this.queryDateSchedule() 
                          }    
                    })
                  }
                } else {

                }   
             })
            },
            //搜索面询统计
            queryDateSchedule(val){
                 queryDateSchedule({
                  startDate: this.$moment(this.searchDate[0]).format('YYYY-MM-DD'),
                  endDate: this.$moment(this.searchDate[1]).format('YYYY-MM-DD'),
                  ...this.listQuery
                }).then(res => {
                  this.tableData = res.data.data.dataList
                  this.total = res.data.data.pagination.total
                })
            },
            //每页条数更改
            handleSizeChange(val) {
                this.listQuery.pageNo = 1 
                this.listQuery.pageSize = val;
                this.queryDateSchedule();
            },
            //当前页码更改
            handleCurrentChange(val) {
                this.listQuery.pageNo = val;
                this.queryDateSchedule();
            }
        }
    };
</script>

<style scoped lang="scss">
.tao_statistics {
    padding:12px;
    .el-form-item__error {
      left: 56px !important;
    }
    .header{
        padding-bottom:10px;
    }
    .header_text{
        display: inline-flex;
        margin: 5px;
    }
    .age_num_box{
        display: inline-flex;
        width: 140px;
    }
    .list-pagination{
        margin-top: 10px;
    }
    .evaluateDetail{
        margin-bottom: 10px;
    }
    .statisticsTabCon{
        min-height: 600px;
    }
    /deep/ .el-dialog {
    width: 600px !important;
  }
}

 
</style>
