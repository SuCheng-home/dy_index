<template>
  <div class="honourGradeList padding">
    <div class="header">
      <el-row>
        <el-col :span="24">
          <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
          <el-button type="primary" size="medium"  @click="addOrganHandler">创建</el-button>
        </el-col>
      </el-row>
    </div>
    <div>
      <el-table
        ref="multipleTable"
        :data="honourTable"
        border
        stripe
        class="honourTable"
        :height="maxH"
        style="width: 100%">
        <el-table-column
          label="机构名称" align="center" show-overflow-tooltip>
          <template slot-scope="scope">{{ scope.row.issueOrgan }}</template>
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          label="操作" width="220">
          <template slot-scope="scope">
              <el-button size="small" type="text"
                          @click="editOrganHandler(scope.row.id)">编辑
              </el-button>
              <el-button  size="small" type="text"
                          @click="delHander(scope.row.id)">删除
              </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div v-show="!listLoading" class="pagination-container">
          <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                          :current-page.sync="pageNo" :page-sizes="[10,20,30, 50]"
                          :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper"
                          :total="total">
          </el-pagination>
      </div>
    </div>
    <el-dialog
      title="机构名称设置"
      :visible.sync="addOrganListDialog"
      width="40%">
      <el-form :model="addOrgan" :rules="addOrganRules" ref="addOrgan" label-width="100px" class="addOrganFrom">
          <el-form-item label="机构名称" prop="issueOrgan">
            <el-input v-model.trim="addOrgan.issueOrgan" maxlength="50"  placeholder="机构名称（1-50个字符）"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addOrganListDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrganSave">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="机构名称设置"
      :visible.sync="editOrganListDialog"
      width="40%">
      <el-form :model="editOrgan" :rules="editOrganRules" ref="editOrgan" label-width="100px" class="addOrganFrom">
          <el-form-item label="机构名称" prop="issueOrgan">
            <el-input v-model.trim="editOrgan.issueOrgan" maxlength="50"  placeholder="机构名称（1-50个字符）"></el-input>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editOrganListDialog = false">取 消</el-button>
        <el-button type="primary" @click="editOrganSave">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {getSchoolHonororganList,addSchoolHonororgan,delSchoolHonorType,getSchoolHonororganById,updateSchoolHonororgan,delSchoolHonororgan} from '@/api/honour/honourGradeSet';
export default {
  data(){
    return{
      pageNo:1,
      pageSize:10,
      honorTypeId:this.$route.query.honorTypeId,
      honourTable:[],
      total:null,
      listLoading:false,
      addOrganListDialog:false,
      addOrgan:{
        issueOrgan:''
      },
      addOrganRules:{
        issueOrgan:[
          {
            required: true,
            message: '请输入机构名称！',
            trigger: 'blur'
          }
        ]
      },
      editOrgan:{
        issueOrgan:''
      },
      editOrganRules:{
        issueOrgan:[
          {
            required: true,
            message: '请输入机构名称！',
            trigger: 'blur'
          }
        ]
      },
      editOrganListDialog:false,
      editOrganId:''
    }
  },
  created(){
    // document.title="机构列表";
    this.getSchoolHonororganListFunc();
  },
  mixins:[mixins],
  mounted(){
    
  },
  methods:{
    editOrganHandler(id){
      getSchoolHonororganById({
        honorTypeId:this.honorTypeId,
        issId:id
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let organInfo=data.data;
          this.editOrgan.issueOrgan=organInfo.issueOrgan;
          this.editOrganId=organInfo.id;
          this.editOrganListDialog=true;
        }
      })
    },
    editOrganSave(){
      this.$refs.editOrgan.validate((valid)=>{
        if(valid){
          updateSchoolHonororgan({
            id:this.editOrganId,
            issueOrgan:this.editOrgan.issueOrgan
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.$message({
                type: 'success',
                message: '编辑成功!'
              });
              this.editOrganListDialog=false;
              this.getSchoolHonororganListFunc();
            }else{
              this.$message({
                type: 'error',
                message: '编辑失败,请稍后重试!'
              });
            }
          })
        }else{
          return false;
        }
      });
    },
    addOrganSave(){
      this.$refs.addOrgan.validate((valid)=>{
        if(valid){
          addSchoolHonororgan({
            honorTypeId:this.honorTypeId,
            issueOrgan:this.addOrgan.issueOrgan
          }).then(res=>res.data)
          .then(data=>{
            if(data.code===200){
              this.$message({
                type: 'success',
                message: '新建成功!'
              });
              this.addOrgan.issueOrgan='';
              this.addOrganListDialog=false;
              this.getSchoolHonororganListFunc();
            }else{
              this.$message({
                type: 'error',
                message: '新建失败,请稍后重试!'
              });
            }
          })
        }else{
          return false;
        }
      })
    },
    addOrganHandler(){
      this.addOrganListDialog=true;
    },
    goBack(){
      this.$router.push({
        path:'honourGradeList'
      })
    },
    delHander(id){
      this.$confirm('您确认删除当前机构吗?', '提示', {
        type: 'error'
      }).then(() => {
        delSchoolHonororgan({
          issIds:id
        }).then(res=>{
          let data=res.data;
          if(data.code===200){
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getSchoolHonororganListFunc();
          }
        })
      }).catch(() => {
            
      });
    },
    jumpPage(path,query={}){
      this.$router.push({
          path,
          query
      })
    },
    handleCurrentChange(val){
      this.pageNo=val;
      this.getSchoolHonororganListFunc();
    },
    handleSizeChange(val){
      this.pageSize=val;
      this.pageNo=1;
      this.getSchoolHonororganListFunc();
    },
    getSchoolHonororganListFunc(){
      this.listLoading=true;
      getSchoolHonororganList({
        pageNo:this.pageNo,
        pageSize:this.pageSize,
        honorTypeId:this.honorTypeId
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          let honourData=data.data;
          this.honourTable=honourData.schoolHonorTypeIssueorganList;
          if(this.honourTable.length==0&&this.pageNo>1){
            this.pageNo--;
            this.getSchoolHonororganListFunc();
          }
          this.total=honourData.pagination.total;
          this.listLoading=false
        }
      }).catch(()=>{
        this.listLoading=false;
      })
    }
  }
}
</script>
<style lang="scss" scoped>

.padding{
  padding:12px;
  box-sizing: border-box;
}
.honourGradeList{
  .header{
    padding-bottom:10px;
    //border-bottom:1px solid  #e7eaec;
    //margin-bottom:20px;
  }
  .pagination-container{
    margin-top:20px;
  }
}
.addOrganFrom{
  width:80%;
}

</style>
<style lang="scss">
@import "../../styles/mixin";
</style>

