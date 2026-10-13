<template>
<div class="sortingindex"  >
     <div class="subject">
         <el-table stripe  :data="dataList" border fit highlight-current-row  :height="notbmaxH" style="width: 100%" >
                <el-table-column  label="二级账户" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.subMerName}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="待清分金额" align="center">
                    <template slot-scope="scope">
                       <span >{{scope.row.balance?scope.row.balance:"---"}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="收费类型" align="center" >
                    <template slot-scope="scope">
                       <span >{{scope.row.metadata.typeList[0].typeName}}</span>
                    </template>
                </el-table-column>
                 <el-table-column align="center" label="操作" width="180">
                   <template slot-scope="scope">
                         <el-button type="text" v-if="scope.row.balance" size="small" @click.native.prevent="dialogVisiblefun(scope.row.subMerId,scope.row.balance)">清分</el-button>
                          <el-button type="text" size="small" @click.native.prevent="sortinglist(scope.row.subMerId,scope.row.subMerName)">清分明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
     </div>
      <el-dialog title="清分"   :visible.sync="dialogVisible" width="400px">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                <el-form-item label="清分金额" prop="totalfee" >
                     <el-input-number v-model.trim="ruleForm.totalfee" size="medium" placeholder="请输入金额" :precision="2"  :min="0.01" :max="99999" :step="1"></el-input-number>
                </el-form-item>
                </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addWithdBatch('ruleForm')">确 定</el-button>
            </span>
        </el-dialog> 
</div> 
</template>
<script>
import {querySubmerhPurseWithTypeList,addWithdBatch} from "@/api/newcharge";
import mixin from "@/mixins/windowResize";
import baseMixin from '@/mixins/baseMixin';
export default {
  data() {
    return {    
      dataList: [],
      dialogVisible:false,  
      num:0,
       rules: {
        totalfee: [
          { required: true, message: "请输入清分金额", trigger: "blur" }
        ],
       },
       ruleForm: {
        subMerId: "", 
        totalfee:""
      },
    };
  },
  mixins: [mixin,baseMixin],
  created() {
      this.querySubmerhPurseWithTypeList();
  },
  methods: {
    addWithdBatch(formName) {
      let $this = this;
      this.$refs[formName].validate(valid => {
        if (valid) {         
            addWithdBatch({
               subMerId: $this.ruleForm.subMerId,
               totalfee: $this.ruleForm.totalfee
            })
              .then(res => {
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "清分成功!"
                  });
                  this.querySubmerhPurseWithTypeList();
                } else {
                  this.$message({
                    type: "error",
                    message: res.data.msg
                  });
                }
              })
              .catch(function() {});
        }
      });
    },
      querySubmerhPurseWithTypeList(){
        querySubmerhPurseWithTypeList().then(res => {
          if (res.data.code === 200) {
            this.dataList = res.data.data;
          }
        })
        .catch(function() {});
      },
      dialogVisiblefun(id,num){
          this.dialogVisible=true;
          this.num=num/100;
          this.ruleForm.subMerId=id;
          this.ruleForm.totalfee=undefined;
      },
      sortinglist(id,name){
        this.$router.push({path:'sortinglist',query:{id:id,name:name}});
      }
  }
};
</script>
<style lang="scss" scoped>
.sortingindex {
  padding:12px;
}
</style>