<template>
  <div>
    <div style="padding:15px 15px 0 15px" class="tool">
      <back-tool>
      </back-tool>
    </div>

    <el-form :model="form" style="padding-top:20px;width:810px;margin:0 auto">
      <el-form-item class="newTask" label="考核任务:" :label-width="formLabelWidth" :required="true">
        <el-input size="medium" v-model.trim="name" autocomplete="off" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="类型:" :label-width="formLabelWidth">
        <el-radio v-model="testType" label="1" :disabled="true">月考核</el-radio>
      </el-form-item>
      <el-form-item label="考核时间:" :label-width="formLabelWidth" :required="true">
        <el-date-picker
          :disabled="true"
          value-format="yyyy年MM月"
          v-model="date"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="考核员:" class="newTask" :label-width="formLabelWidth" :required="true">
        <div
          style="position:relative;vertical-align:top;display:inline-block;width:600px;padding:20px;border:1px solid #ccc;">
          <el-button style="margin:10px" :class="{primary:item.ischeck}" size="medium" v-for="(item,index) in btnList"
                     :key="index">{{item.name}}
          </el-button>
        </div>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
  import BackTool from '@/components/BackTool/index'
  import {getTestRole, getTaskDetailById, editTask} from '@/api/performance.js'

  export default {
    components: {
      BackTool
    },
    data() {
      return {
        date: '',
        name: '',
        testType: '1',
        editdata: '',
        btnList: [],
        formLabelWidth: '120px',
      }
    },
    computed: {
      getAssessUserList() {
        let newArr = [];
        this.btnList.forEach(v => {
          if (v.ischeck) {
            let obj = {
              userId: v.id,
              userLoginName: v.loginName,
              userName: v.name
            };
            newArr.push(obj)
          }
        });
        return newArr
      }
    },
    created() {
      this.getTestRole();
      this.daterange[0] = new Date(this.$moment().set('date', 1).valueOf());
      this.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
      this.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD');
    },
    methods: {
      //获取考核员列表
      getTestRole() {
        getTestRole().then(res => {
          this.btnList = res.data.data;
          this.btnList = this.btnList.map(v => {
            return {
              ischeck: false,
              name: v.name,
              id: v.id,
              loginName: v.loginname
            }
          });
          let id = this.$route.query.id;
          if (id) {
            getTaskDetailById(id).then(res => {
              this.editData = res.data.data;
              this.name = this.editData.taskName;
              this.date = this.editData.assessDate;

              this.btnList.forEach(v => {
                this.editData.assessUserList.forEach(item => {
                  if (item.userId == v.id) {
                    v.ischeck = true
                  }
                })
              })
            })
          }

        })
      },
      //按钮点击事件
      selectIt(item) {
        item.ischeck = !item.ischeck
      },
      findDate() {
        this.startDate = this.$moment(this.daterange[0]).format('YYYY-MM-DD'); //时间
        this.endDate = this.$moment(this.daterange[1]).format('YYYY-MM-DD'); //时间
      },
      //创建任务
      setNewTask(state) {
        if (!this.date || this.getAssessUserList.length == 0 || !this.name) {
          this.$message({
            message: '必填项不能为空',
            type: 'info'
          });
          return
        }
        editTask({
          assessDate: this.date,
          assessUserList: this.getAssessUserList,
          taskName: this.name,
          taskState: state,
          typeId: 1,
          typeName: '月绩效',
          id: this.editData.id
        }).then(res => {
          if (state == 1) {
            this.$message({
              message: '任务保存成功',
              type: 'success'
            });
          } else {
            this.$message({
              message: '任务发布成功',
              type: 'success'
            });
          }
          this.$router.back();
        })
      }
    },
  }
</script>

<style scoped>
  .primary {
    background: #409EFF !important;
    color: #fff;
  }

  .primary span {
    color: #fff !important;
  }

  .primary:hover {
    color: #fff !important;
  }


  .newTask .address-input {
    width: 600px;
  }

  .newTask .el-input__inner {
    width: 600px;
  }
</style>
