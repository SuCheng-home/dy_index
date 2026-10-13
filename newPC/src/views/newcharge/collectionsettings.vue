<template>
    <div class="collectionsettings">
        <div class="top">
            <el-button type="primary"   size="medium" @click="dialogVisible=true">新建</el-button> 
        </div>
        <div class="time-table">
            <el-table stripe :data="dateList"  border fit highlight-current-row style="width: 100%" :height="nobottommaxH">              
                <el-table-column  prop="moduleName"  label="模块名称"></el-table-column>
                <el-table-column  prop="moduleCode" align="center"  label="模块编码"></el-table-column>
                 <el-table-column align="center" label="缴费类型" width="120px">
                    <template slot-scope="scope">
                       <el-tag  size="mini"  >{{scope.row.typeName}}</el-tag>
                    </template>
                </el-table-column>  
                <el-table-column  prop="typeId" align="center"  label="项目编号"></el-table-column>
                  
                 <el-table-column align="center" label="操作" width="120px">
                    <template slot-scope="scope">
                       <el-button size="small" type="text"   @click.native="deleteGroupCollectionSetting(scope.row.id)" class="buttontextred">删除</el-button>
                    </template>
                </el-table-column>         
            </el-table>
        </div>
        <el-dialog title="新增收款设置" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="500px" :lock-scroll="false" :modal-append-to-body='false'>
			  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">         
          <el-form-item label="模块" prop="moduleCode">
             <el-select class="filter-item" filterable   size="medium" v-model="ruleForm.moduleCode" placeholder="请选择模块" >
                <el-option v-for="item in moduleList" :key="item.code" :label="item.name"  :value="item.code"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收费类型" prop="typeId">
             <el-select class="filter-item"  size="medium" v-model="ruleForm.typeId" placeholder="请选择收费类型" >
                <el-option v-for="item in NoticeType" :label="item.typeName" :value="item.typeId" :key="item.typeId"></el-option>
            </el-select>
          </el-form-item>
        
        </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="determine('ruleForm')">确 定</el-button>
			</span>
		</el-dialog>
    </div>
</template>
<script>
import {queryGroupCollectionSettingList,deleteGroupCollectionSetting,addGroupCollectionSetting} from '@/api/newcharge';
import mixin from "@/mixins/windowResize";
import {moduleManageIndex} from '@/api/system';
import {queryChargeTypeList} from "@/api/campusFees";
export default {
  name: "collectionsettings",
  data: function() {
    return {
      dateList: [], //表格主题数据  
       dialogVisible: false,
      ruleForm: {
        moduleCode:"",//	业务模块标识	string	
        moduleName:"",//	业务模块名称	string	
        typeId:"",//	收费类型标识	string	
        typeName:"",//	收费类型名称	string
      },
      NoticeType: [],
      moduleList:[],
      rules: {
        moduleCode: [
          { required: true, message: "请选择模块", trigger: "change" }
        ],
        typeId: [
          { required: true, message: "请选择收费类型", trigger: "change" }
        ],
      },  
    };
  },
  mixins: [mixin],
  //获取渲染数据当数据加载完成后执行(生命周期中的钩子函数)
  created() {
       moduleManageIndex({
        moduleName:""
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.moduleList=data.data;
        }
      })
       queryChargeTypeList().then(res => {
      let data = res.data.data;
      this.NoticeType = data;
    });
    this.queryGroupCollectionSettingList();
  },
  methods: {
       determine(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (let i = 0; i < this.NoticeType.length; i++) {
            if (this.ruleForm.typeId == this.NoticeType[i].typeId) {
              this.ruleForm.typeName = this.NoticeType[i].typeName;
            }
          }
           for (let i = 0; i < this.moduleList.length; i++) {
            if (this.ruleForm.moduleCode == this.moduleList[i].code) {
              this.ruleForm.moduleName = this.moduleList[i].name;
            }
          }
         
         addGroupCollectionSetting(this.ruleForm)
            .then(res => {
              if (res.data.result) {
                this.$message({
                  type: "success",
                  message: "新建成功!"
                });
                this.ruleForm.moduleCode="";
                this.ruleForm.typeId="";
                this.dialogVisible = false;
                this.queryGroupCollectionSettingList();
              }else{
                 this.$message({
                  type: "error",
                  message: res.data.msg
                });                
              }             
            }).catch(err => {});
          
        }
      });
    },
     deleteGroupCollectionSetting(id){
           this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteGroupCollectionSetting(id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.queryGroupCollectionSettingList();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
        },
    //搜索
    handleInputChange() {
        this.queryGroupCollectionSettingList();
      },
    //获取列表
    queryGroupCollectionSettingList() {
      this.dateList = [];
      queryGroupCollectionSettingList().then(res => {
          let data = res.data.data;
          this.dateList = data;
      });
    },
    //切换页码
    handleSizeChange(val) {
      this.query.pageSize = val;
      this.queryGroupCollectionSettingList();
    },
    handleCurrentChange(val) {
      this.queryGroupCollectionSettingList();
    },
  }
};
</script>
<style scoped="scoped">
.collectionsettings {
  padding:12px;
}
.collectionsettings .top {
  padding-bottom: 10px;
}
</style>
