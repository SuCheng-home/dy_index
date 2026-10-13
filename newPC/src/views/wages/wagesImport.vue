<template>
  <div class="wagesImport" v-loading.body="listLoading">
    <div class="wagesImport-top">
         <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
    </div>     
    <div class="subject" :style="`height: ${nobottommaxH}px;`">
        <div class="body">
           <div class="import-hint">
                <p>Excel导入成员说明详情：</p>
                <p>1.导入顺序：EXCEL中必须包含姓名和身份证号码两个字段，根据身份证号码比对用户信息。</p>
                <p>2.导入规则：系统自动把EXCEL所有列导入。</p>
                <p>3.导入结果：导入成功后会返回导入结果，并查看工资详情后再发布。</p>
                <p>4.导入请严格按照模板进行导入。</p>
            </div>
            <el-form :model="uploadData"  ref="ruleForm" label-width="140px" class="demo-ruleForm">  
                <el-form-item label="发薪类型">
                    <el-select v-model="uploadData.payrollTypeId" @change="payrollTypeIdfun()">
                    <el-option :label="item.payrollType" v-for="(item,index) in typelist" :key="index" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="年度月份">
                    <el-form-item>
                        <el-date-picker @change="uploadDatadata()" type="month" :editable='false' :clearable='false' v-model="uploadData.monthDate" style="width: 100%;"></el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="下载模板">
                     <a :href="exportURL" class="color">模板下载</a>（点击下载导入模板）
                </el-form-item>
                <el-form-item label="导入工资" v-show="typelist.length">
                     <el-upload class="upload-import" :action="uploadPath" :data="uploadData" :show-file-list='false' accept=".xls" :before-upload="beforeAvatarUpload" :on-success="handleAvatarSuccess">
                        <el-button type="primary"  size="medium">导入</el-button>
                    </el-upload>
                </el-form-item>
            </el-form>
        </div>
        <el-dialog  title="导入返回错误信息" :visible.sync="mydialogVisibles" :close-on-press-escape="false" :close-on-click-modal="false">
              <div class="content-box" v-html="mydataname"></div>
              <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="mydialogVisibles = false">确定</el-button>
              </span>
            </el-dialog>
     </div>
  </div>
</template>
<script>
  import mixin from '@/mixins/windowResize';
  import {payrollTypeList} from "@/api/wages";
  export default {
    data() {
      return {
       exportURL:'',
       listLoading:false,
       uploadPath:global.BasePath + "structure/payroll/uploadPayroll",
       uploadData: {
            payrollTypeId: '', 
            payrollType:'',       
            monthDate:'',
            token: this.$store.getters.token
        },
        typelist:[],
        mydialogVisibles:false,
        mydataname:''
      }
    },
    mixins: [mixin],
    created() {
            let nowDate = new Date();
            let year=nowDate.getFullYear();
            let month= nowDate.getMonth() + 1;
            if((month-0)<10){
              month='0'+month;
            }; 
            this.payrollTypeLists();           
            this.uploadData.monthDate=year+'-'+month;
            this.exportURL =`${global.BasePath}structure/payroll/downLoadPayrollTemplate?token=${this.$store.getters.token}`;
    },
    methods: {  
            uploadDatadata(){
                this.uploadData.monthDate = this.$moment(this.uploadData.monthDate).format('YYYY-MM');
            },
            payrollTypeIdfun(){
                for(let i=0;i<this.typelist.length;i++){
                    if(this.typelist[i].id==this.uploadData.payrollTypeId){
                        this.uploadData.payrollType=this.typelist[i].payrollType
                    }
                }
            },
            //导入
            handleAvatarSuccess(res) {
                if ((res.code == 200)) {
                    this.$message({
                    message: "模版导入成功！",
                    type: "success"
                    });
                    this.listLoading = false; 
                    this.$router.back();        
                }else{
                    this.listLoading = false; 
                    this.mydataname=res.msg;
                    this.mydialogVisibles=true;
                }
            },
            beforeAvatarUpload(file) {
            let suffix = file.name.split(".")[file.name.split(".").length - 1];
            if (suffix !== "xls") {
                this.$message.error("请上传后缀为.xls的模版文件!");
                return false;
            } else {
                this.listLoading = true;
            }
            },
            //获取列表
            payrollTypeLists(){
                payrollTypeList().then(res => res.data).then(data => {
                            if(data.code==200) {
                               this.typelist=data.data;  
                            };
                            if(this.typelist.length==0){
                                this.$message.error("暂无发薪类型,请创建发薪类型!");
                            }else{
                                this.uploadData.payrollType=this.typelist[0].payrollType;
                                this.uploadData.payrollTypeId=this.typelist[0].id;
                            }
                        })
            }
    }
  };
</script>

<style lang="scss" scoped>
.wagesImport{
    padding:12px;
    .wagesImport-top{
       padding-bottom: 10px;
       border-bottom: 1px solid #e7eaec;
    }
    .subject{
        overflow: auto;
        .body{
            width: 810px;
            margin: 0 auto;
            .import-hint{
                    padding: 10px 70px;
                    color:#333;
                    p{
                     margin: 0 0 10px;
                    }
            }
            .color{
                color:#1fc7cb;
            }
            .el-select{
                width: 670px;
            }
        }
    }
}
</style>