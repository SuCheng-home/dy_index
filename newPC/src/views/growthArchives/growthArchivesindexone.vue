<template>
<div class="growthArchivesindexone">
 <!-- <el-tabs type="border-card" v-model="activeName"  @tab-click="activeNamefun()">
  <el-tab-pane label="园内" name="one"> -->
     <div class="top">
         <el-col :span="19">
            <el-select class="filter-item"  size="medium" v-model="query.schoolTimeId" placeholder="请选择学期" @change="searchHandler()">
                <el-option v-for="item in schoolTimelist" :key="item.id" :label="item.schoolTimeName"  :value="item.id"></el-option>
            </el-select>
            <el-select class="filter-item"  size="medium" v-model="query.activityTypeCode" placeholder="请选择类型"  @change="searchHandler()">
                <el-option label="全部类型"  value="0"></el-option>
                <el-option v-for="item in typelist" :key="item.typeCode" :label="item.typeName"  :value="item.typeCode"></el-option>
            </el-select>
             <el-button type="primary" size="medium" @click="addGrowthArchiveActivitys()" v-if="myishide||istype">新增</el-button>
             <el-button type="primary" size="medium" @click="growthArchivesSetup()" v-if="isShowByPermission('/growthArchives/growthArchivesBasicSet')">类型设置</el-button>
        </el-col>
        <el-col :span="5">
           <el-input size="medium" placeholder="请输入活动名称" v-model.trim="query.searchTitle"  @change="searchHandler()">
            <el-button slot="append" icon="el-icon-search"  @click="searchHandler()"></el-button>
          </el-input>
        </el-col>
      </div>
      <div class="body" > 
          <div class="body-top"> 
            <el-form ref="form" :model="form" label-width="60px">
                <el-form-item label="关键字">
                    <el-checkbox-group v-model="checkboxGroup"   size="mini"  @change="searchHandler()">
                    <el-checkbox :label="item.code" border v-for="item in cruxlist" :key="item.id">{{item.value}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form> 
          </div>  
          <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="`${maxH-30}px`">               
           <el-table-column align="center" label="类型" width="100" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.typeName}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="活动名称"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <span class="link" @click="growthArchivesdetails(scope.row.id,scope.row.status)">{{scope.row.activityName}}</span>
                </template>
            </el-table-column>           
            <el-table-column align="center" label="发布范围" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.classNames}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="日期" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.activityDate}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="发布者" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createUser}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center"  label="状态" width="100"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <el-tag  size="mini"  type="info" v-if="scope.row.status==1">草稿</el-tag>
                    <el-tag  size="mini"  type="success" v-if="scope.row.status==2">已发布</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="150" v-if="myishide||istype">
                <template slot-scope="scope">
                    <el-button size="small" type="text"  @click.native="editGrowthArchiveActivitys(scope.row)">编辑 </el-button>
                    <el-button size="small" type="text"  @click.native="deleteGrowthArchivesActivityByIds(scope.row.id)" class="buttontextred">删除</el-button>
                </template>
            </el-table-column>
        </el-table>  
           <div class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="query.pageNo" :page-sizes="[10,20,30, 50]" :page-size.sync="query.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="query.total"> </el-pagination>
        </div>  
        <el-dialog :title="ruleForm.name" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
			  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
          <el-form-item label="活动名称" prop="activityName" >
            <el-input v-model.trim="ruleForm.activityName"  placeholder="请输入活动名称"   size="medium" :maxlength="20"></el-input>
          </el-form-item>
          <el-form-item label="活动类型" prop="typeCode">
             <el-select class="filter-item"  size="medium" v-model="ruleForm.typeCode" placeholder="请选择类型" >
                <el-option v-for="item in typelist" :key="item.typeCode" :label="item.typeName"  :value="item.typeCode"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="发布范围" prop="classlist" v-if="classlist.length!=1" >
             <el-select class="filter-item" :disabled="ruleForm.id!=0"   multiple  size="medium" v-model="ruleForm.classlist" placeholder="请选择发布范围" >
                <el-option v-for="item in classlist" :key="item.id" :label="item.name"  :value="item.id+''"></el-option>
            </el-select>
          </el-form-item>
           <el-form-item label="关键字">
                    <el-checkbox-group v-model="ruleForm.checkboxGroup" size="medium"  >
                    <el-checkbox :label="item.code-0" border v-for="item in cruxlist" :key="item.code">{{item.value}}</el-checkbox>
                    </el-checkbox-group>
            </el-form-item>
        
        </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="determine('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
      </div>
  <!-- </el-tab-pane>
  <el-tab-pane label="家长" name="two"></el-tab-pane> -->
<!-- </el-tabs> -->
</div> 
</template>
<script>
import mixin from "@/mixins/windowResize";
import { mapGetters } from "vuex";
import { isShowByPermission } from "@/utils";
import {
  getSchoolTimeAllList,
  findSchoolDicsByCode,
  getSchoolGrowthTypeDicList,
  getGrowthArchivesActivityPageList,
  addGrowthArchiveActivity,
  getTeacherClassList,
  editGrowthArchiveActivity,
  deleteGrowthArchivesActivityById,possessRole
} from "@/api/growthArchives";
export default {
  data() {
    return {
      activeName: "one",
      query: {
        activityKeys: "", //	关键字","分割	string
        activityTypeCode: "0", //	活动类型code	string
        classId: 0, //	班级ID	number
        gradeId: 0, //	年级ID	number
        pageNo: 1, //	pageNo	number
        pageSize: 20, //	pageSize	number
        schoolTimeId: "", //	学期ID	number
        searchTitle: "", //	模糊查询	string
        type: "1", //	类型 1园内 2个人	number
        total: null
      },
      dataList: [],
      schoolTimelist: [],
      cruxlist: [],
      checkboxGroup: [],
      classlist: [],
      dialogVisible: false,
      ruleForm: {
        activityName: "", //	活动名称	string
        classIds: "", //	班级ID集合	string
        classNames: "", //	班级名称集合	string
        createType: 1, //	创建类型 1园内 2个人	number
        keyCodes: "", //	关键字编码集合	string
        keyNames: "", //	关键字集合	string
        stuId: 0, //	学生ID	number
        typeCode: "", //	活动类型编码	string
        typeName: "", //	活动类型名称	string
        name: "",
        id: "",
        checkboxGroup: [],
        classlist: [],
        schoolTimeId:''
      },
      rules: {
        activityName: [
          { required: true, message: "请输入活动名称", trigger: "blur" }
        ],
        typeCode: [
          { required: true, message: "请选择活动类型", trigger: "change" }
        ],
        classlist: [
          {
            type: "array",
            required: true,
            message: "请至少选择一个发布班级",
            trigger: "change"
          }
        ]
      },
      myishide:false,
      istype:false,
      status:1
    };
  },
  mixins: [mixin],
  computed: {
    ...mapGetters(["userInfo"])
  },
  mounted() {
    possessRole('29').then(res => {
         this.myishide = !res.data.data.result;
    });
     possessRole('10086').then(res => {
         this.istype = res.data.data.result;
    });
    getSchoolTimeAllList()
      .then(res => {
        for (let item of res.data.data) {
          if (item.isCurrent == 1) {
            this.query.schoolTimeId = item.id;
          }
        }
        this.schoolTimelist = res.data.data;
        findSchoolDicsByCode()
          .then(res => res.data)
          .then(data => {
            this.cruxlist = data.data;
            this.getGrowthArchivesActivityPageLists();
          });
      })
      .catch(err => {});
    getSchoolGrowthTypeDicList()
      .then(res => res.data)
      .then(data => {
        this.typelist = data.data;
      });
   
  },
  methods: {
    isShowByPermission,
    growthArchivesdetails(id,status){
      if(status==2){
           this.$router.push({path: "growthArchivesReportdetails",query: {id: id}});
      }else{
         this.$router.push({path: "growthArchivesdetails",query: {id: id,status:status}});
      }
     
    },
    //删除
    deleteGrowthArchivesActivityByIds(id) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteGrowthArchivesActivityById(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.searchHandler();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    },    
    addGrowthArchiveActivitys() {
    getTeacherClassList()
      .then(res => res.data)
      .then(data => {
        this.classlist = data.data;   
        this.ruleForm.name = '新建活动';
        this.ruleForm.activityName = "";
        this.ruleForm.typeCode = "";
        this.ruleForm.id = 0;
        this.dialogVisible = true;
        this.ruleForm.checkboxGroup = [];
        this.ruleForm.classlist = [];
        this.ruleForm.schoolTimeId=this.query.schoolTimeId;
        if(this.classlist.length==1){
            this.ruleForm.classlist.push(this.classlist[0].id+'');
          }     
      });
      
    },
    editGrowthArchiveActivitys(obj){
      this.ruleForm.name = '编辑活动';
      this.ruleForm.activityName = obj.activityName;
      this.ruleForm.typeCode = obj.typeCode;
      this.ruleForm.id = obj.id;
      this.status=obj.status;
      this.dialogVisible = true;
      let idlist= obj.classIds.split(',');
      let namelist=obj.classNames.split(',');
      this.classlist=[]
      for(let i=0;i<idlist.length;i++){
            this.classlist.push({
              id:idlist[i],
              name:namelist[i],
            })
      }
      
      if(obj.keyCodes!=""){
        this.ruleForm.checkboxGroup =obj.keyCodes.split(',');
        for(let i=0;i<this.ruleForm.checkboxGroup.length;i++){
          this.ruleForm.checkboxGroup[i]=this.ruleForm.checkboxGroup[i]-0
        }
      }   
      this.ruleForm.classlist = obj.classIds.split(',');
    },
    determine(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.keyCodes = this.ruleForm.checkboxGroup.join(",");
          this.ruleForm.classIds = this.ruleForm.classlist.join(",");
          this.ruleForm.classNames = "";
          this.ruleForm.keyNames = "";
          for (let i = 0; i < this.typelist.length; i++) {
            if (this.ruleForm.typeCode == this.typelist[i].typeCode) {
              this.ruleForm.typeName = this.typelist[i].typeName;
            }
          }
          for (let i = 0; i < this.ruleForm.checkboxGroup.length; i++) {
            for (let j = 0; j < this.cruxlist.length; j++) {
              if (this.ruleForm.checkboxGroup[i] == this.cruxlist[j].code) {
                if (i < this.ruleForm.checkboxGroup.length - 1) {
                  this.ruleForm.keyNames =
                    this.ruleForm.keyNames + this.cruxlist[j].value + ",";
                } else {
                  this.ruleForm.keyNames =
                    this.ruleForm.keyNames + this.cruxlist[j].value;
                }
              }
            }
          }
          for (let i = 0; i < this.ruleForm.classlist.length; i++) {
            for (let j = 0; j < this.classlist.length; j++) {
              if (this.ruleForm.classlist[i] == this.classlist[j].id) {
                if (i < this.ruleForm.classlist.length - 1) {
                  this.ruleForm.classNames =
                    this.ruleForm.classNames + this.classlist[j].name + ",";
                } else {
                  this.ruleForm.classNames =
                    this.ruleForm.classNames + this.classlist[j].name;
                }
              }
            }
          }
          if(this.ruleForm.id==0){
             addGrowthArchiveActivity(this.ruleForm)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "新建成功!"
                });
              }
              this.dialogVisible = false;
               this.$router.push({path: "growthArchivesdetails",query: {id: res.data.data.id,status:1}});
            })
            .catch(err => {});
          }else{
            editGrowthArchiveActivity(this.ruleForm)
            .then(res => {
              if (res.data.code === 200) {
                this.$message({
                  type: "success",
                  message: "编辑成功!"
                });
              }
              this.dialogVisible = false;
              this.$router.push({path: "growthArchivesdetails",query: {id: res.data.data.id,status:this.status}});
            })
            .catch(err => {});
          }
          
        }
      });
    },
    getGrowthArchivesActivityPageLists() {
      this.query.activityKeys = this.checkboxGroup.join(",");
      getGrowthArchivesActivityPageList(this.query)
        .then(res => res.data)
        .then(data => {
          this.query.total = data.data.pagination.total;
          this.dataList = data.data.dataList;
        });
    },
    activeNamefun() {
      if (this.activeName == "one") {
        this.$router.push({
          path: "growthArchivesindexone"
        });
      }
      if (this.activeName == "two") {
        this.$router.push({
          path: "growthArchivesindextwo"
        });
      }
    },
    growthArchivesSetup() {
      this.$router.push({
        path: "growthArchivesSetup"
      });
    },
    //搜索
    searchHandler() {
      this.query.pageNo = 1;
      this.getGrowthArchivesActivityPageLists();
    },
    //码数
    handleSizeChange() {
      this.query.pageNo = 1;
      this.getGrowthArchivesActivityPageLists();
    },
    //页数
    handleCurrentChange() {
      this.getGrowthArchivesActivityPageLists();
    }
  }
};
</script>
<style>
.growthArchivesindexone .el-checkbox__input {
  display: none;
}
.growthArchivesindexone .el-checkbox__label {
  padding: 0;
}
.growthArchivesindexone .body-top .el-form-item__label {
  line-height: 28px;
}
</style>

<style lang="scss" scoped>
.growthArchivesindexone {
  padding: 10px;
  .top {
    padding-bottom: 10px;
    overflow: hidden;
  }
  .link {
    color: #409EFF;
    cursor: pointer;
  }
  * {
    box-sizing: border-box;
    word-break: break-all;
    word-wrap: break-word;
  }
  .demo-ruleForm {
    .el-select {
      width: 100%;
    }
  }
  .body {
    .body-top {
      .el-form-item {
        padding: 0;
        margin: 0;
      }
      .el-checkbox {
        padding: 3px 8px;
      }
    }
    .el-checkbox {
      margin: 0 5px;
    }
    .el-checkbox.is-bordered.is-checked {
      color: #409EFF;
      border-color: #ecf5ff;
      background-color:  #d9ecff;
    }
  }
}
</style>
