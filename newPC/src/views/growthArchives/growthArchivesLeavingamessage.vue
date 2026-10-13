<template>
<div class="growthArchivesLeavingamessage"  >
     <div class="top"> 
         <el-button @click="$router.back()" type="default" size="medium">返回</el-button> 
      </div>
     <div class="subject">
         <el-table stripe :data="dataList" border fit highlight-current-row   style="width: 100%" :height="`${nobottommaxH}px`">               
           <el-table-column align="center" label="留言人"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.messageUser}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="留言时间"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.messageTime.split(".")[0]}}</span>
                </template>
            </el-table-column>
             <el-table-column align="center" label="留言内容"  show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.message}}</span>
                </template>
            </el-table-column>  
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text"  @click.native="batchpopfun(scope.row.stuId,scope.row.message)">编辑 </el-button>
                    <el-button size="small" type="text"  @click.native="deleteActivityFileStuMessages(scope.row.stuId)" class="buttontextred">删除</el-button>
                </template>
            </el-table-column>
        </el-table>  
         <el-dialog title="编辑留言" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="batchpop" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
			         <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="留言">
                      <el-input type="textarea" maxlength="15" v-model.trim="message"></el-input>
                    </el-form-item>
                  </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="batchpop = false">取 消</el-button>
                    <el-button type="primary" @click="addActivityFileStuMessages()">确 定</el-button>
                </span>
            </el-dialog> 
     </div>   
</div> 
</template>
<script>
import {getFileMessageList,deleteActivityFileStuMessage,addActivityFileStuMessage} from "@/api/growthArchives";
import mixin from "@/mixins/windowResize";
export default {
  data() {
    return {
      dataList: [],
      id: this.$route.query.id,
      fileId:this.$route.query.fileId,
      message:'',
      batchpop:false,
      stuId:''
    };
  },
  mixins: [mixin],
  created() {
    this.getFileMessageLists();
  },
  methods: {
      batchpopfun(id,message){
      this.stuId=id;
      this.message=message;
      this.batchpop=true;
    },
    getFileMessageLists(){
        getFileMessageList(this.fileId)
          .then(res => res.data)
          .then(data => {
              this.dataList=data.data;
          });
    },
    addActivityFileStuMessages(){
      if(!this.message){
        this.$message.error('留言不能为空！');
        return;
      }
      let obj={
        activityId:this.id,//	活动ID	number	
        message:this.message,//	评价内容	string
        fileId:this.fileId,//	附件ID	number
        stuId:this.stuId
      }
      addActivityFileStuMessage(obj).then(res => {
        if (res.data.code === 200) {
              this.$message.success("编辑留言成功！");
              this.getFileMessageLists(); 
              this.batchpop=false;
              this.message='';
        }
      });
    },
    deleteActivityFileStuMessages(id){
      this.$confirm("确认要删除吗？", "删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
        lockScroll: false
      }).then(() => {         
          deleteActivityFileStuMessage(this.fileId,id).then(res => {
            if (res.data.code === 200) {
              this.$message.success("删除成功！");
               this.getFileMessageLists();
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
.growthArchivesLeavingamessage {
  padding: 15px;
  .top {
    padding-bottom: 10px;
  }
}
</style>