<template>
<div class="campusCircletype"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
         <el-button type="primary" size="medium"   @click="dialogVisible=true">新增</el-button>     
      </div>
     <div class="subject" :style="`height: ${nobottommaxH}px;`">
          <div class="ul">
              <div class="li" v-for="(item,index) in datalist" :key="index">
                  <i class="el-icon-delete"   @click.stop="deleteTopicOptionByIds(item.id)"></i>
                  <span v-html="strToHtml(item.optionName)"></span>
              </div>
          </div>         
          <default-page Mes="暂无类型" v-if="!mynum"></default-page>
          <el-dialog title="新增类型" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
			<el-form :model="myForm" ref="myForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="主题类型" prop="optionName" :rules="[{ required: true, message: '主题类型不能为空'}]">
                  <el-input v-model.trim="myForm.optionName" maxlength="10"  placeholder="请输入主题类型"></el-input>
              </el-form-item>
            </el-form>
			<span slot="footer" class="dialog-footer">
				<el-button @click="dialogVisible = false">取 消</el-button>
				<el-button type="primary" @click="addTopicOptions()">确 定</el-button>
			</span>
		</el-dialog> 
     </div>
</div> 
</template>
<script>
import { getTopicOptionList, deleteTopicOptionById,addTopicOption} from "@/api/campusCircle";
import mixin from "@/mixins/windowResize";
import DefaultPage from "@/components/DefaultPage";
import {strToHtml} from '@/utils/utils';
export default {
  data() {
    return {
      datalist: [],
      mynum: 1,
      id: this.$route.query.id,
      dialogVisible:false,
      myForm:{
          optionName:""
      }
    };
  },
  mixins: [mixin],
  created() {
    this.getTopicOptionLists();
  },
  components: { DefaultPage },
  methods: {
      strToHtml,
      addTopicOptions(){
            this.$refs.myForm.validate((valid) => {
          if (valid) {
           addTopicOption({
               optionName:this.myForm.optionName,
               topicId:this.id,
               optionOrder:this.datalist.length
           }).then(res => res.data).then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '新增成功！',
                                            type: 'success',
                                            duration: 1000
                                        });
                                        this.dialogVisible=false;
                                        this.myForm.optionName='';
                                        this.getTopicOptionLists();
                }else{
                  this.$message.error(data.msg)
                   this.dialogVisible=false;
                                        this.myForm.optionName='';
                }
            }).catch(() => {})
          } else {
            
            return false;
          }
        });
      },
    getTopicOptionLists() {
      getTopicOptionList(this.id)
        .then(res => res.data)
        .then(data => {
          this.datalist = data.data;
          this.mynum = this.datalist.length;
        });
    },
    deleteTopicOptionByIds(sid) {
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      })
        .then(() => {
          deleteTopicOptionById(sid).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功");
              this.getTopicOptionLists();
            } else {
              this.$message.error(res.data.msg);
            }
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style lang="scss" scoped>
.campusCircletype {
  padding:12px;
  .top {
    border-bottom: 1px solid #e7eaec;
    padding-bottom: 10px;
  }
  .subject {
    overflow: auto;
    .ul {
      overflow: hidden;
      .li {
        float: left;
        width: 180px;
        margin: 10px;
        text-align: center;
        background-color: #ecf5ff;
        color: #409eff;
        border: 1px solid #d9ecff;
        border-radius: 4px;
        line-height: 52px;
        font-size: 14px;
        cursor:pointer;
        i {
          font-size: 18px;
          color: #f56c6c;
          display: none;
        }
      }
      .li:hover{
           i {
          display: inline-block
        }
      }
    }
  }
}
</style>