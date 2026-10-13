<template>
    <div class="nonTaxRefundAdd">
        <back-tool>
            <el-button v-if="id" type="primary" size="medium" @click="batchFeesave()">保存补录</el-button>
            <el-button v-else type="primary" size="medium" @click="batchFeesave()">保存</el-button>
        </back-tool>
        <div :style="'overflow: auto;padding-top:20px;height:'+nobottommaxH+'px'"  >
          <div class="body">
              <el-form ref="query" :model="query" label-width="140px" :rules="rules">
                <el-form-item label="收费名称" prop="chargeName">
                    <el-input :disabled="id" v-model.trim="query.chargeName" placeholder="请输入收费名称" :maxlength="30"></el-input>
                </el-form-item>
                <el-form-item label="缴费名单" class="is-required">
                       <uploader pathPrefix="piliangtuifei" module="piliangtuifei" moduleCode="20211229" :extList="allFileTypeList" v-model="fileJson" :multiple="false"></uploader>
                       <a :href="downLoadHref"  target="_blank" download="examName" style="color:#409EFF">模板下载</a>
                    </el-form-item>      
            </el-form>
          </div>
            
        </div>
         <el-dialog title="未绑卡用户" :close-on-press-escape='false' :close-on-click-modal='false' :visible.sync="mymsgpop" width="500px" :lock-scroll="false" :modal-append-to-body='false'>
		  <div v-html="mymsg"></div>
       <div  style="display: none;"   id="outTable" >
          <el-table border fit stripe   highlight-current-row style="width: 100%;" ref="print"  :data="datalist"  >
             <el-table-column  label="学号" v-if="query.refundUser==1">
               <template slot-scope="scope">
                    <span>{{scope.row.loginName}}</span>
                </template>
           </el-table-column>
            <el-table-column  label="姓名" >
               <template slot-scope="scope">
                    <span>{{scope.row.name}}</span>
                </template>
           </el-table-column>             
            <el-table-column  label="手机号" v-if="query.refundUser==2">
               <template slot-scope="scope">
                    <span>{{scope.row.mobile}}</span>
                </template>
           </el-table-column>   
           <el-table-column  label="班级" v-if="query.refundUser==1">
                <template slot-scope="scope">
                    <span>{{scope.row.departName}}</span>
                </template>
           </el-table-column>
           <el-table-column  label="部门" v-if="query.refundUser==2">
                <template slot-scope="scope">
                    <span>{{scope.row.departName}}</span>
                </template>
           </el-table-column>   
           <el-table-column  label="失败原因" >
               <template slot-scope="scope">
                    <span>{{scope.row.reason}}</span>
                </template>
           </el-table-column>
    </el-table>
                
        </div> 
			<span slot="footer" class="dialog-footer">
        <el-button type="primary" size="medium"  @click="exportExcel('#outTable', `未通过信息.xlsx`)"   v-if="datalist.length>0">导出</el-button>
				<el-button type="primary" size="medium" @click="mymsgpop=false">确 定</el-button>
			</span>
		</el-dialog> 
    </div>
</template>

<script>
import BackTool from "@/components/BackTool";
import baseMixin from '@/mixins/baseMixin';
import moment from "moment";
import Uploader from '@/components/Uploader/WebUploader';
import {checkExcel,batchFeesave} from "@/api/campusFees";
import mixin from "@/mixins/windowResize";
export default {
  //引入返回模块
  components: { BackTool, Uploader },
  data: function() {   
    return {     
      rules: {
        chargeName: [
          {
            required: true,
            message: "请输入收费名称",
            trigger: "blur"
          }
        ]  
      },
      query: {
        FileName:'',//		文件名称	string	
        FileUrl:'',//	文件url	string	
        chargeName:this.$route.query.chargeName||'',//	批次名称	string
      },
      downLoadHref: "https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/csv/非税模板.csv",     
      allFileTypeList: ["csv"],
      fileJson:[],
      mymsg:"",
      mymsgpop:false,
      datalist:[],
      id:this.$route.query.id||0
    };
  },
  mixins: [mixin,baseMixin],
  created() {
  },
  methods: {  
   
    //保存
    batchFeesave() {
      if (this.fileJson.length == 0) {
          this.$message({
            type: "warning",
            message: "请上传缴费名单！"
          });
          return;
        }
        let obj={
            fileName:this.fileJson[0].fileName,
            fileUrl:this.fileJson[0].fileUrl,
            chargeName:this.query.chargeName
        } 
       
        this.$refs["query"].validate(valid => {
            if (valid) {
               checkExcel(this.fileJson[0].fileUrl).then(res => {
                        let mydata=res.data;
                        if(mydata.code==200){
                          if(this.id){
                            obj.id=this.id
                          }
                             batchFeesave(obj)
                                .then(res => {
                                    if (res.data.code === 200) {
                                        this.$message({
                                            type: "success",
                                            message: "保存成功!"
                                        });
                                        this.$router.back();
                                    }
                                })
                                .catch(function () {});
                        }
                    }).catch();
            
            }
        });
    }
  }
};
</script>
<style scoped>
.nonTaxRefundAdd {
  padding:12px;
}
.body{
  width: 810px;
  margin: 0 auto;
}
.el-select,
.el-input {
  width: 100%;
}

</style>
