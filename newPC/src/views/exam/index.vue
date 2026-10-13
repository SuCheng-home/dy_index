<template>
    <div class="app-container">
        <div class="filter-container">
            <el-row>
                <el-col :span="19">
                    <el-button class="filter-item" type="primary" @click="addExam" size="medium" v-if="isShowByPermission('/exam/create')">创建考试 </el-button>
                    <el-button class="filter-item" type="primary" @click="loadExamScoreCollect" size="medium">成绩汇总</el-button>
                    <el-button class="filter-item" type="primary" size="medium"  v-if="isShowByPermission('/exam/examReport')" @click="loadExamScorePresentation">成绩报告</el-button>
                </el-col>
                <el-col :span="5">
                  <el-input size="medium" class="search-input" placeholder="请输入考试名称" v-model.trim="listQuery.examName" @change="handleFilter">
                        <el-button size="medium" slot="append" icon="el-icon-search" @click="handleFilter"></el-button>
                    </el-input>
                 </el-col>
            </el-row>            
            
        </div>
        <el-table stripe :key='tableKey' :data="list" v-loading.body="listLoading" border fit highlight-current-row
                  style="width: 100%" :height="maxH">
            <!-- <el-table-column border align="center" label="序号" width="65">
                <template slot-scope="scope">
                    <span>{{(listQuery.pageNo-1)*listQuery.pageSize+scope.$index+1}}</span>
                </template>
            </el-table-column> -->
            <el-table-column  label="考试名称" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link-type" @click="loadexamScoreAnalysis(scope.row.id)">{{scope.row.name}}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" align="center" label="考试班级">
                <template slot-scope="scope">
                    <span>{{scope.row.departName }}</span>
                </template>
            </el-table-column>
            <el-table-column width="100px" show-overflow-tooltip align="center" label="考试类型">
                <template slot-scope="scope">
                    <span>{{scope.row.examType|statusTypeFilter}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="考试科目" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>
                    <template v-for="item in scope.row.currList">
                         {{item.curriculumName}}
                   </template>
                    </span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="考试时间" width="120">
                <template slot-scope="scope">
                    {{scope.row.examDate}}
                </template>
            </el-table-column>
            <el-table-column align="center" label="状态" width="100">
                <template slot-scope="scope">
                    <el-tag  size="mini" v-if="scope.row.sendScore==0" type="danger">未发布</el-tag>
                    <el-tag  size="mini" v-if="scope.row.sendScore==1" type="primary">已发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="300">
                <template slot-scope="scope">
                    <el-button size="small" type="text" :disabled="!scope.row.uploadScore"
                               v-if="isShowByPermission('/exam/sendScore')"
                               @click.native="showSendDialog(scope.row)">成绩发布
                    </el-button>
                    <el-button size="small" type="text"
                               v-if="isShowByPermission('/exam/examScoreMaintain')"
                               @click.native="loadExamScoreMaintainPage(scope.row.id,scope.row.classType)">分数维护
                    </el-button>
                    <el-button size="small" type="text" :disabled="!scope.row.uploadScore"
                               v-if="isShowByPermission('/exam/examScoreAnalysis')"
                               @click.native="loadexamScoreAnalysis(scope.row.id)">成绩分析
                    </el-button>
                    <el-button size="small" type="text" :disabled="scope.row.uploadScore"
                               v-if="isShowByPermission('/exam/edit')"
                               @click.native="editExam(scope.row)">编辑
                    </el-button>
                    <el-button size="small" type="text"
                               v-if="isShowByPermission('/exam/delete')"
                               @click.native="delExam(scope.row.id)" class="buttontextred">删除
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

        <el-dialog :title="dialogParams.title" :visible.sync="dialogVisible" size="tiny" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' top="10%">
            <div class="examForm">
                <el-form ref="form" :model="ruleForm" :rules="rules" label-width="80px">
                    <el-form-item label="考试名称" prop="name">
                        <el-input v-model="ruleForm.name" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="考试时间" prop="examDate">
                        <el-col>
                            <el-date-picker v-model="ruleForm.examDate" :editable='false' :clearable='false' type="date"
                                            placeholder="选择日期" >
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="考试班级" prop="departId">
                        <el-select v-model="ruleForm.departId" placeholder="请选择" @change="departChange">
                            <el-option v-for="item in departList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="考试类型" prop="examType">
                        <el-select v-model="ruleForm.examType" placeholder="请选择">
                            <el-option v-for="item in examTypeList" :key="item.value" :label="item.label"
                                       :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div class="box-large ">
                        <div class="rule-item" v-for="(item,index) in Subjectlist" :key="index">
                            <div class="box">
                                <div class="box-big-left">
                                    <el-form-item label="考试科目">
                                        <el-checkbox v-model="item.isFback">{{item.name}}</el-checkbox>
                                    </el-form-item>
                                </div>
                                <div class="box-big-right">
                                    <el-form-item label="科目总分">
                                        <div class="boxSelect">
                                            <el-select v-model="item.num">
                                                <el-option v-for="item in Fractionlist" :key="item.value"
                                                           :label="item.label" :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </div>
                                        <div class="boxInput">
                                            <el-input :maxlength="3" v-model="item.num" placeholder="请输入或选则"></el-input>
                                            <div class="boederheid"></div>
                                        </div>
                                    </el-form-item>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="insertAndUpdateExam" size="medium">{{dialogParams.btnActiveTxt}}</el-button>
            </span>
        </el-dialog>
        <send-dialog ref="showSendDialog"></send-dialog>
    </div>
</template>
<script>
import { isShowByPermission } from "@/utils";
import SendDialog from "./sendDialog";
import {
  examList,
  insertExam,
  deleteExam,
  editExam,
  examDetails,
  changeDepart,getThManageWalkClassList
} from "@/api/systemSet/exam";
import { queryClassGrade, queryAllClassCourse } from "@/api/system";
import { parseTime } from "@/utils";
import mixin from "@/mixins/windowResize";

const SendScore = { OK: 1, NO: 0 }; //是否已发布成绩，0代表未发布，1代表已发布
const STATE = { OK: 1, NO: 0 }; //是否关闭考试，打开为“1”，关闭为“0”

export default {
  components: {
    SendDialog
  },
  data() {
    const checkExamScore = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请输入成绩！"));
      }
      let g = /^[1-9]*[1-9][0-9]*$/;
      if (!g.test(value)) {
        callback(new Error("请输入正整数！"));
      } else {
        callback();
      }
    };
    const checkDepartId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择考试班级！"));
      } else {
        callback();
      }
    };
    const checkExamType = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择考试类型！"));
      } else {
        callback();
      }
    };
    const checkCurriculumId = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("请选择考试科目！"));
      } else {
        callback();
      }
    };
    return {
      createId: "", //用户id
      Mid: this.$store.getters.userInfo.id,
      Subjectlist: [], //科目集合
      currArr: [], //选中科目集合
      tableKey: "examIndex",
      list: null,
      total: null,
      listLoading: false,
      listQuery: {
        pageNo: 1,
        pageSize: 20,
        examName: ""
      },
      dialogVisible: false,
      createState: "", ////add添加 edit编辑
      examDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      examDate: "",
      departList: [],
      curriculumList: [],
      Fractionlist: [
        { label: "100", value: 100 },
        { label: "120", value: 120 },
        { label: "150", value: 150 }
      ],
      examTypeList: [
        { label: "测验考试", value: 1 },
        { label: "专项考试", value: 2 },
        {
          label: "期中考试",
          value: 3
        },
        { label: "期末考试", value: 4 }
      ],
      ruleForm: {
        name: "", //考试名称
        examDate: this.$moment().format("YYYY-MM-DD"), //考试时间
        departId: "", //部门id
        departName: "", //考试班级
        examType: "", //考试类型,1测验考试,2专项考试,3期中考试,4期末考试
        gradeId: "", //年级id
        gradeName: "", //年级名称
        state: STATE.OK, //是否关闭考试，打开为“1”，关闭为“0”
        sendScore: SendScore.NO, //是否已发布成绩，0代表未发布，1代表已发布
        currArr: [], //科目集合
        classType: 0 //0代表班级，1代表走班
      },
      rules: {
        name: [
          { required: true, message: "请输入考试名称！", trigger: "blur" },
          {
            min: 1,
            max: 50,
            message: "长度在 1 到 50 个字符！",
            trigger: "blur"
          }
        ],
        examDate: [{ required: true }],
        departId: [
          { required: true, validator: checkDepartId, trigger: "change" }
        ],
        examType: [
          { required: true, validator: checkExamType, trigger: "blur" }
        ]
      },
      dialogParams: {
        title: "创建考试",
        btnActiveTxt: "创 建"
      },
      sendExamId: ""
    };
  },
  mixins: [mixin],
  filters: {
    formatTimeFilter(date) {
      return parseTime(date);
    },
    statusTypeFilter(type) {
      let stateTxt = "--";
      switch (type) {
        case 1:
          stateTxt = "测验考试";
          break;
        case 2:
          stateTxt = "专项考试";
          break;
        case 3:
          stateTxt = "期中考试";
          break;
        case 4:
          stateTxt = "期末考试";
          break;
      }
      return stateTxt;
    }
  },
  created() {
    const promisList = JSON.parse(localStorage.getItem("_simplepermission"));
    this.getList();
    queryAllClassCourse()
      .then(res => {
        res.data.data.forEach(item => {
          this.departList.push({
            name: item.className,
            id: item.classId,
            parentId: item.gradeId,
            parentName: item.gradeName,
            isnum:1
          });
        });
        if (this.departList.length > 0) {
          this.ruleForm.departId =
            this.departList.length > 0 ? this.departList[0].id : "";
          this.queryCourseByClassIds(this.ruleForm.departId);
        }
        getThManageWalkClassList().then(res => {
          let data = res.data.data;
         data.forEach(item => {
          this.departList.push({
            name: item.name,
            id: item.id,
            parentId: item.pid,
            parentName: item.gradeName,
            isnum:2,
            courseName:item.courseName,
            curriculumId:item.curriculumId
            
          });
        });
         if(data.length==this.departList.length){
            this.Subjectlist=[{
              num: 100,
              isFback: false,
              name: this.departList[0].courseName,
              id: this.departList[0].curriculumId
            }];
            this.ruleForm.classType=1;
         }
        })
        .catch(err => {});
      })
      .catch();
    this.ruleForm.examType = this.examTypeList[0].value;
  },
  methods: {
    isShowByPermission,
    getList() {
      this.listLoading = true;
      examList({
        pageNo: this.listQuery.pageNo,
        pageSize: this.listQuery.pageSize,
        examName: this.listQuery.examName
      })
        .then(res => {
          let data = res.data.data;
          this.list = data.dataList;
          this.total = data.pagination.total;
          this.listLoading = false;
          this.createId = data.dataList[0].createId;
        })
        .catch(err => {
          this.listLoading = false;
        });
    },
    handleFilter() {
      if (this.listQuery.examName.length > 0) {
        if (this.listQuery.examName.trim().length > 0) {
          this.listQuery.pageNo = 1;
          this.listQuery.examName = this.listQuery.examName.trim();
          this.getList();
        }
      } else {
        this.listQuery.pageNo = 1;
        this.getList();
      }
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.listQuery.pageNo = val;
      this.getList();
    },
    queryCourseByClassIds(classId) {
      let _this = this;
      _this.Subjectlist = [];
      changeDepart(classId)
        .then(res => {
          let data = res.data;
          data.forEach(item => {
            _this.Subjectlist.push({
              num: 100,
              isFback: false,
              name: item.name,
              id: item.id
            });
          });
          this.ruleForm.curriculumId =
            this.curriculumList.length > 0 ? this.curriculumList[0].id : "";
        })
        .catch();
    },
    departChange(val) {
      let num=0;
      for(let i=0;i<this.departList.length;i++){
        if(this.departList[i].id==val){
            num=this.departList[i].isnum;
            if(num==2){
               this.Subjectlist=[{
              num: 100,
              isFback: false,
              name: this.departList[i].courseName,
              id: this.departList[i].curriculumId
            }];
            }
        }
        
      }
     
      if(num==1){
        this.ruleForm.classType=0;
           this.queryCourseByClassIds(val);
      }else{
         this.ruleForm.classType=1;
      }
    },
    addExam() {      
      this.Subjectlist.forEach(item => {
        item.num = 100;
        item.isFback = false;
      });
      this.currArr = [];
      this.createState = "add";
      this.dialogParams = { title: "创建考试", btnActiveTxt: "创 建" };
      this.dialogVisible = true;
      this.setDefualtExam();
    },
    insertAndUpdateExam() {
      let _this = this;
      let judge = true;
      _this.currArr = [];
      _this.Subjectlist.forEach(item => {
        if (item.isFback) {
          item.num = item.num - 0;
          if (!item.num) {
            _this.$message("请选择或填写" + item.name + "总分数！");
            item.num = "";
            judge = false;
            return;
          }
          if (item.num < 1) {
            _this.$message("请选择或填写" + item.name + "总分数大于0！");
            judge = false;
            item.num = "";
            return;
          }
          if (!Number.isInteger(item.num)) {
            _this.$message("填写" + item.name + "总分数是数字！");
            item.num = "";
            judge = false;
            return;
          }
          _this.currArr.push({
            curriculumId: item.id,
            score: item.num,
            curriculumName: item.name
          });
        }
      });
      if (!judge) {
        return;
      }
      if (_this.currArr.length < 1) {
        _this.$message("请选择科目！");
        return;
      }
      _this.ruleForm.currArr = JSON.stringify(_this.currArr);
      this.$refs["form"].validate(valid => {
        if (valid) {
          this.dialogVisible = false;
          let gradeItem = this.departList.find(
            item => item.id == this.ruleForm.departId
          );
          if (gradeItem) {
            this.ruleForm.departName = gradeItem.name;
            this.ruleForm.gradeId = gradeItem.parentId;
            this.ruleForm.gradeName = gradeItem.parentName;

            this.ruleForm.examDate = this.$moment(
              this.ruleForm.examDate
            ).format("YYYY-MM-DD");


            if (this.createState == "add") {
              insertExam(this.ruleForm)
                .then(res => {
                  this.getList();
                  let _this = this;
                  this.$confirm("考试创建成功, 现在要录入成绩么?", "提示", {
                    confirmButtonText: "去录入",
                    cancelButtonText: "暂不",
                    type: "success"
                  })
                    .then(() => {
                      this.$router.push({
                        path: "examScoreMaintain",
                        query: { examId: res.data.data.id,classType:this.ruleForm.classType}
                      });
                    })
                    .catch(() => {});
                })
                .catch();
              this.ruleForm.currArr = [];
            } else {
              editExam(this.ruleForm)
                .then(res => {
                  this.getList();
                  let _this = this;
                  this.$confirm("考试维护成功, 现在要录入成绩么?", "提示", {
                    confirmButtonText: "去录入",
                    cancelButtonText: "暂不",
                    type: "success"
                  })
                    .then(() => {
                      this.$router.push({
                        path: "examScoreMaintain",
                        query: { examId: res.data.data.id,classType:this.ruleForm.classType }
                      });
                    })
                    .catch(() => {});
                })
                .catch();
              this.ruleForm.currArr = [];
            }
          }
        }
      });
    },
    editExam(row) {
      this.currArr = [];
      this.Subjectlist.forEach(item => {
        item.num = 100;
        item.isFback = false;
      });
      this.ruleForm.classType=row.classType;
      var _this = this;
      this.createState = "edit";
      this.dialogParams = { title: "编辑考试", btnActiveTxt: "编 辑" };
      this.ruleForm.id = row.id;
      this.dialogVisible = true;
      examDetails(row.id)
        .then(res => {
          let data = res.data.data;
          this.ruleForm.name = data.name;
          // this.ruleForm.currArr=data.currList;
          this.ruleForm.examDate = data.examDate;
          this.ruleForm.departId = data.departId;
          this.ruleForm.examType = data.examType;
          this.ruleForm.curriculumId = data.curriculumId;
          this.ruleForm.score = data.score;
          this.ruleForm.gradeId = data.gradeId;
          if(row.classType==0){
            changeDepart(data.departId)
            .then(res => {
              let mydata = res.data;
              _this.Subjectlist = [];
              mydata.forEach(item => {
                _this.Subjectlist.push({
                  num: 100,
                  isFback: false,
                  name: item.name,
                  id: item.id
                });
              });
              data.currList.forEach(item => {
                let Name = item.curriculumName;
                let Num = item.score;
                let Id = item.curriculumId;
                _this.Subjectlist.forEach(item => {
                  if (item.name == Name) {
                    item.num = Num;
                    item.id = Id;
                    item.isFback = true;
                  }
                });
              });
            })
            .catch();
          }else{
             _this.Subjectlist = [];
             _this.Subjectlist=[{
              num: data.currList[0].score,
              isFback: true,
              name: data.currList[0].curriculumName,
              id:  data.currList[0].curriculumId
            }];
          }
          
        })
        .catch();
    },
    delExam(id) {
      this.$confirm("此操作将永久删除此考试, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteExam(id)
            .then(res => {
              this.getList();
              this.$message({
                type: "success",
                message: "删除成功!",
                onClose: function() {}
              });
            })
            .catch();
        })
        .catch(() => {});
    },
    setDefualtExam() {
      this.ruleForm = {
        name: "",
        examDate: this.$moment().format("YYYY-MM-DD"),
        departId: "",
        departName: "",
        examType: this.examTypeList[0].value,
        curriculumId: "",
        curriculumName: "",
        score: "",
        gradeId: "",
        gradeName: "",
        state: STATE.OK,
        sendScore: SendScore.NO,
        classType:this.ruleForm.classType
      };
      this.ruleForm.departId =
        this.departList.length > 0 ? this.departList[0].id : "";
      if (this.ruleForm.departId) {
        //如果存在部门才请求
        this.queryCourseByClassIds(this.ruleForm.departId);
      }
    },
    loadExamScoreMaintainPage(examId,classType) {
      this.$router.push({
        path: "examScoreMaintain",
        query: { examId: examId,classType:classType }
      });
    },
    loadexamScoreAnalysis(examId) {
      this.$router.push({
        path: "examScoreAnalysis",
        query: { examId: examId }
      });
    },
    loadExamScoreCollect() {
      this.$router.push({ path: "examScoreCollect" });
    },
    loadExamScorePresentation() {
      this.$router.push({
        path: "examScorePresentation",
        query: { createId: this.createId }
      });
    },
    showSendDialog(row) {
      let currIds = row.currList;
      this.$refs.showSendDialog.showDialog(row.id, currIds);
    },
    reload() {
      this.getList();
    }
  }
};
</script>
<style scoped>
.examForm {
  padding: 10px;
}

.examForm .el-date-editor.el-input,
.examForm .el-select {
  width: 100%;
}

.box-big-right,
.box-big-left {
  width: 45%;
  display: inline-block;
  height: 36px;
  padding-bottom: 48px;
  position: relative;
}

.box-big-left {
  top: -24px;
}

.boxSelect {
  position: absolute;
  width: 120%;
}

.boxInput {
  position: absolute;
  width: 80%;
}

.boederheid {
  background: #fff;
  position: absolute;
  right: 0px;
  height: 34px;
  z-index: 9999;
  width: 3px;
  top: 1px;
}

.box-large {
  max-height: 195px;
  overflow-y: auto;
}
</style>
