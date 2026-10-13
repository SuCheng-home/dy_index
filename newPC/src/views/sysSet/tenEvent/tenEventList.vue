<template>
  <div class="tenEventList">
    <div class="el-row menu-tools">
      <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
    </div>
    <div class="main-wrap">
      <div class="title"><span class="square"></span>{{gradeName}}上学期</div>
      <div class="lastTerm clearfix">
        <div class="lastTermItem" v-if="lastThingTypeList&&lastThingTypeList.length!==0" v-for="(lastThingItem,lastThingIndex) in lastThingTypeList" :key="lastThingIndex">
          <span class="text">{{lastThingItem.thingName}}</span>
          <i class="el-icon-edit-outline" @click="editHandle(lastThingItem,lastThingItem.id)"></i>
          <i class="el-icon-delete" @click="delHandle(lastThingItem.id)"></i>
        </div>
        <div class="lastTermItem lastTermItemAdd" @click="lastAddHandle">
          <i class="el-icon-plus"></i>
        </div>
      </div>
      <div class="title"><span class="square"></span>{{gradeName}}下学期</div>
      <div class="lastTerm clearfix">
        <div class="lastTermItem" v-if="nextThingTypeList&&nextThingTypeList.length!==0" v-for="(nextThingItem,nextThingIndex) in nextThingTypeList" :key="nextThingIndex">
          <span class="text">{{nextThingItem.thingName}}</span>
          <i class="el-icon-edit-outline" @click="editHandle(nextThingItem,nextThingItem.id)"></i>
          <i class="el-icon-delete" @click="delHandle(nextThingItem.id)"></i>
        </div>
        <div class="lastTermItem lastTermItemAdd" @click="nextAddHandle">
          <i class="el-icon-plus"></i>
        </div>
      </div>
    </div>
    <el-dialog
      title="项目"
      :visible.sync="lastAddVisible"
      width="40%"
      :before-close="cancelLastAdd" :close-on-click-modal="false">
      <el-form :model="lastTerm" :rules="lastTermRules" ref="lastTerm" label-width="80px" class="failPurchaseFrom">
          <el-form-item label="名称" prop="name">
            <el-input v-model="lastTerm.name" placeholder="请输入名称（1-20个字符）" :maxlength="20"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLastAdd">取 消</el-button>
        <el-button type="primary" @click="lastAddSure">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="项目"
      :visible.sync="lastEditVisible"
      width="40%"
      :before-close="cancelLastEdit" :close-on-click-modal="false">
      <el-form :model="lastTerm" :rules="lastTermRules" ref="lastTerm" label-width="80px" class="failPurchaseFrom">
          <el-form-item label="名称" prop="name">
            <el-input v-model="lastTerm.name" placeholder="请输入名称（1-20个字符）" :maxlength="20"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelLastEdit">取 消</el-button>
        <el-button type="primary" @click="lastEditSure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {findThingByGradeLevel,insertThingType,deleteThingType,updateThingType} from '@/api/systemSet/tenEvent';
export default{
  data(){
    return{
      gradeLevel:this.$route.query.gradeLevel,
      gradeName:this.$route.query.gradeName,
      lastThingTypeList:[],//上学期
      nextThingTypeList:[],//下学期
      lastAddVisible:false,
      lastTerm:{
        name:''
      },
      lastTermRules:{
        name:[
          {
            required: true,
            message: '请输入名称！',
            trigger: 'blur'
          }
        ]
      },
      lastEditVisible:false,
      editId:null,
      nextAddType:1,
    }
  },
  created(){
    this.findThingByGradeLevelFunc();
  },
  mounted(){

  },
  methods:{
    cancelLastEdit(){
      this.lastEditVisible=false;
      this.lastTerm.name='';
      this.editId=null;
    },
    lastEditSure(){
      this.$refs.lastTerm.validate((valid)=>{
        if(valid){
          updateThingType({
            id:this.editId,
            thingName:this.lastTerm.name
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.$message({
                type: 'success',
                message: '修改成功!'
              });
              this.lastTerm.name='';
              this.editId=null;
              this.lastEditVisible=false;
              this.findThingByGradeLevelFunc();
            }
          })
        }
      })
    },
    editHandle(item,id){
      this.lastTerm.name=item.thingName;
      this.editId=id;
      this.lastEditVisible=true;
    },
    delHandle(id){
      this.$confirm('确认要删除吗？', '提示', {
          type: 'warning'
      }).then(() => {
        deleteThingType({
          id:id,
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.findThingByGradeLevelFunc();
          }else{
            this.$message({
              type: 'error',
              message: data.msg
            });
          }
        })
      }).catch(() => {
      });
    },
    findThingByGradeLevelFunc(){
      findThingByGradeLevel({
        gradeLevel:this.gradeLevel
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let ThingTypeData=data.data;
          if(ThingTypeData&&ThingTypeData.length!==0){
            this.lastThingTypeList=ThingTypeData.lastThingTypeList;
            this.nextThingTypeList=ThingTypeData.nextThingTypeList;
          }
        }
      }).catch(()=>{})
    },
    cancelLastAdd(){
      this.lastAddVisible=false;
      this.lastTerm.name='';
    },
    lastAddSure(){
      this.$refs.lastTerm.validate((valid)=>{
        if(valid){
          insertThingType({
            gradeLevel:this.gradeLevel,
            gradeName:this.gradeName,
            schoolTimeType:this.nextAddType,
            thingName:this.lastTerm.name
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.$message({
                type: 'success',
                message: '新增成功!'
              });
              this.lastTerm.name='';
              this.lastAddVisible=false;
              this.findThingByGradeLevelFunc();
            }
          })
        }
      })
    },
    lastAddHandle(){
      this.lastAddVisible=true;
      this.nextAddType=1;
    },
    nextAddHandle(){
      this.lastAddVisible=true;
      this.nextAddType=2;
    },
    goback(){
      this.$router.back();
    }
  }
}
</script>
<style lang="scss" scoped>
.tenEventList{
  padding:12px;
  box-sizing: border-box;
  .menu-tools {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
}
.main-wrap{
  padding-top:20px;
  .title{
    padding:0px 0  20px;
    .square{
      display: inline-block;
      width:10px;
      height:10px;
      background: #20A0FF;
      margin: 15px 8px 0 0;
    }
  }
}
.lastTerm{
  .lastTermItem{
    float:left;
    width:auto;
    padding:10px 15px;
    box-sizing: border-box;
    border:1px solid #84BFFF;
    background:#EEF7FF;
    color:#6AB4FD;
    border-radius:6px;
    overflow: hidden;
    margin-right:20px;
    margin-bottom:20px;
    .text{
      min-width:60px;
      display: inline-block;
      text-align: center;
    }
    i{
      font-size:16px;
      margin-left:4px;
      cursor: pointer;
    }
  }
  .lastTermItemAdd{
    width:126px;
    padding:10px 15px;
    box-sizing: border-box;
    border:1px solid #ccc;
    background:#fff;
    color:#bbb;
    text-align: center;
    border-radius:6px;
    overflow: hidden;
    cursor: pointer;
  }
}
</style>