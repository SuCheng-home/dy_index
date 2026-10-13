<template>
    <div class="campusFeesadd">
        <back-tool>
            <el-button type="primary" size="medium" @click="saveChargeNotice()">下一步</el-button>
        </back-tool>
        <div :style="'overflow: auto;padding-top:20px;height:'+nobottommaxH+'px'"  >
          <div class="body">
              <el-form ref="query" :model="query" label-width="140px" :rules="rules">
                <el-form-item label="退费名称" prop="refundName">
                    <el-input v-model.trim="query.refundName" placeholder="请输入退费名称" :maxlength="30"></el-input>
                </el-form-item>
                  <el-form-item label="商户号" prop="merhId">
                    <el-select v-model="query.merhId" placeholder="请选择商户号">
                        <el-option v-for="item in merhIdlist" :label="item" :value="item" :key="item"></el-option>
                    </el-select>
                </el-form-item>
                 <el-form-item label="退费类型">
                        <el-radio-group v-model="query.refundUser" @change="urlfun()">
                            <el-radio :label="1">学生退费</el-radio>
                            <el-radio :label="2">老师退费</el-radio>
                        </el-radio-group>
                </el-form-item> 
                 <el-form-item label="数据来源">
                        <el-radio-group v-model="query.datasource">
                            <el-radio :label="1">Excel 导入</el-radio>
                            <el-radio :label="2">平台统计</el-radio>
                        </el-radio-group>
                </el-form-item> 
                 <el-form-item label="退费方式" v-if="query.datasource==1" >
                        <el-radio-group v-model="query.refundType"  @change="urlfun()">
                            <el-radio :label="1">按登记的银行卡号</el-radio>
                            <el-radio :label="2">按缴费订单</el-radio>
                        </el-radio-group>
                </el-form-item> 
                <div v-if="query.datasource==2">
                     <el-form-item label="统计模块">
                        <el-radio-group v-model="query.moduleCode">
                            <el-radio :label="2">停伙退费</el-radio>
                        </el-radio-group>
                </el-form-item> 
                <el-form-item label="时段" prop="bigdate">
                   <el-date-picker v-model="query.bigdate" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
                </el-form-item>
                </div>
                <div v-if="query.datasource==1">
                    <el-form-item label="退费名单">
                       <uploader pathPrefix="piliangtuifei" module="piliangtuifei" moduleCode="20211229" :extList="allFileTypeList" v-model="fileJson" :multiple="false"></uploader>
                       <a :href="downLoadHref"  target="_blank" download="examName" style="color:#409EFF">模板下载</a>
                    </el-form-item>  
                </div>      
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
import {addPayRefundapply,querymchIdList} from "@/api/generationrefund";
import mixin from "@/mixins/windowResize";
export default {
  //引入返回模块
  components: { BackTool, Uploader },
  data: function() {   
    return {     
      rules: {
        refundName: [
          {
            required: true,
            message: "请输入退费名称",
            trigger: "blur"
          }
        ],
        merhId: [
          { required: true, message: "请选择商户号", trigger: "change" }
        ],
         bigdate: [
          { type: 'array', required: true, message: '请选择时段', trigger: 'change' }
        ],    
      },
      query: {
        datasource:1,//		数据来源	number	1excel导入 2平台统计
        filename:"",//		excel名称	string	datasource=1必填
        fileurl:"",//		excel远程路径	string	datasource=1必填
        merhId:"",//		商户号	string	
        moduleCode:2,//		关联模块code	string	datasource=2必填
        refundName:"",//		退费名称	string	
        refundUser:1,//		退费类型	number	1学生退费 2老师退费
         bigdate:['',''],
         refundType:1
      },
      downLoadHref: "",     
      allFileTypeList: ["xls"],
      fileJson:[],
      merhIdlist:[],
      mymsg:"",
      mymsgpop:false,
      datalist:[]
    };
  },
  mixins: [mixin,baseMixin],
  created() {
   this.querymchIdLists();
   this.downLoadHref=`${global.newcharge}abcpay/refundapply/downloadTemplate?refundUser=${this.query.refundUser}&refundType=${this.query.refundType}&token=${this.$store.getters.token}`
  },
  methods: {  
       querymchIdLists(){
          querymchIdList(5).then(res => {
              this.merhIdlist=res.data.data.mchIdList;
              if(this.merhIdlist.length){
                 this.query.merhId=this.merhIdlist[0];
              }
          }).catch(function (error) {
     })
    }, 
    urlfun(){
       this.downLoadHref=`${global.newcharge}abcpay/refundapply/downloadTemplate?refundUser=${this.query.refundUser}&refundType=${this.query.refundType}&token=${this.$store.getters.token}`
    },
    //保存
    saveChargeNotice() {
      let $this = this;
      if (this.query.datasource == 1) {
        if (this.fileJson.length == 0) {
          this.$message({
            type: "warning",
            message: "请上传缴费名单！"
          });
          return;
        }
        this.query.filename = this.fileJson[0].fileName;
        this.query.fileurl = this.fileJson[0].fileUrl;
      }   
      this.$refs["query"].validate(valid => {
        if (valid) {
            if(this.query.datasource == 1){
                addPayRefundapply({detailList:[],refundapply:this.query})
              .then(res => {
                this.is = true;
                if (res.data.code === 200) {
                  this.$message({
                    type: "success",
                    message: "操作成功!"
                  });
                   this.$router.replace({
                    path:'generationrefunddetails',
                    query: { 
                        applyBatchSn: res.data.data
                    }
                })
                }else{
                  this.mymsg=res.data.msg
                  this.datalist=res.data.data||[]
                  this.mymsgpop=true
                }
              })
              .catch(function() {
              });

            }else{
               this.$router.replace({
                    path:'generationrefundlist',
                    query: { 
                        refundName: this.query.refundName,
                        moduleCode: this.query.moduleCode,
                        refundUser: this.query.refundUser,
                        merhId: this.query.merhId,
                        startDate:this.$moment(this.query.bigdate[0]).format("YYYY-MM-DD"),
                        endDate:this.$moment(this.query.bigdate[1]).format("YYYY-MM-DD"),
                    }
                })
            }
          
        }
      });
    }
  }
};
</script>
<style scoped>
.campusFeesadd {
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
