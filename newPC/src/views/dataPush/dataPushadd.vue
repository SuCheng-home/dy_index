<template>
  <div class="dataPushadd">
    <div class="header">
      <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button size="medium" @click="saveHandler" type="primary">保存</el-button>
    </div>
    <div class="body" :style="{height: `${maxH}px`}">  
         <div>
          
            <div class="content top">
                  <div class="myheader">               
                        说明
                    </div>
                <div>1.请先下载模板，严格根据模板的格式来录入数据。</div>
                <div>2.第一列为用户推送的标识列(身份证号)，请确保导入信息正确。</div>
                <div>3.第二列及以后为推送结果列。</div>
                <div>4.如果需要展示大分类，请在Excel里面添加 大分类#，以# 区分大分类的开始。</div>
            </div>
            <div class="content">
                <el-form
                    :model="formData"
                    label-width="150px"
                    :rules="formDataRules"
                    ref="form"
                >
                    <el-form-item label="主题" prop="batchName">
                        <div style="width: 500px;">
                            <el-input size="medium" maxlength="30" type="text" v-model.trim="formData.batchName" :readonly="!!batchId"
                                      placeholder="请输入主题"></el-input>
                        </div>
                    </el-form-item>
                    <el-form-item label="分类" prop="groupCode">
                    <el-select size="medium" v-model="formData.groupCode" placeholder="请选择分类">
                        <el-option v-for="item in typelist" :key="item.code" :label="item.value" :value="item.code"></el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item label="附件" prop="file">
                        <div style="width: 500px;">
                            <el-upload class="upload-import" :action="uploadPath" :data="uploadData"
                                       :show-file-list='false'
                                       accept=".csv,.xls" :before-upload="beforeAvatarUpload"
                                       :on-success="handleAvatarSuccess"
                                       :on-error="handleAvatarErr" name="rosterFile">
                                <el-button type="primary" size="medium" :loading="importLoading">导入</el-button>
                            </el-upload>
                            <a :href="templateHref" target="_blank"
                               download="模板">
                                <el-button type="text">模板下载</el-button>
                            </a>
                            <div v-if="isUped">导入成功。共{{totalCount}}个，导入成功{{successTotal}}个</div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
           
        </div>      							
       
    </div>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {addDateSendBatch,listValue} from '@/api/dataPush';
export default {
  data(){
      const fileValidator = (rule, value, callback) => {
                if (!this.importRosterJson || this.importRosterJson.length === 0) {
                    callback(new Error('请上传批次附件！'));
                } else {
                    callback();
                }
            };
            return {
                importLoading: false,
                uploadPath: '',
                uploadData: {},
                formData: {
                    batchName: '',
                    groupName:'',
                    groupCode:''
                },
                formDataRules: {
                    batchName: [
                        {required: true, message: '请输入批次主题', trigger: 'blur'}
                    ],
                      groupCode: [
                            {required: true, message: "请选择分类", trigger: "change"}
                        ],
                    file: [
                        {required: true, validator: fileValidator}
                    ]
                },
                importRosterJson: [],
                headerJson: [],
                successTotal: 0,
                totalCount: 0,
                isUped: false,
                templateHref: '',
                typelist:[]                
            }
  },
   created() {
       listValue().then((res) => {
        const data = res.data.data;
        if (res.data.code === 200) {
           this.typelist = data.dataList;
             this.formData.groupCode = this.typelist[0].code;
      
        }
      });
            this.templateHref = global.BasePath + `structure/dataSend/downloadInfoSearchNullModule?token=${this.$store.getters.token}`;
            this.uploadData = {token: this.$store.getters.token};
            this.uploadPath = global.BasePath + "structure/dataSend/dealImportInfoRosterData";
        },
 
  mixins:[mixins],
  methods:{    
     beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix != "csv" && suffix != "xls") {
                    this.$message.error("请上传模版文件!");
                } else {
                    this.importLoading = true;
                }
                this.formData.batchName=file.name.split(".")[0]
            },
            handleAvatarSuccess(res, file) {
                if (res.result) {
                    this.headerJson = JSON.parse(res.data.headerJson);
                    this.importRosterJson = JSON.parse(res.data.importRosterJson);
                    this.successTotal = res.data.successCount;
                    this.totalCount = res.data.totalCount;
                    this.importLoading = false;
                    this.isUped = true;
                } else {
                    this.importLoading = false;
                    this.$alert(res.msg, '提示', {
                        confirmButtonText: '确定'
                    });
                }
            },
            handleAvatarErr(err, file, fileList) {
            },
            saveHandler() {
                this.$refs.form.validate(isValid => {
                    if (isValid) {
                         for (let j = 0; j < this.typelist.length; j++) {
                            if (this.formData.groupCode == this.typelist[j].code) {
                                this.formData.groupName = this.typelist[j].value;
                            }
                            }
                        addDateSendBatch({
                            batchName: this.formData.batchName,
                            headerJson: this.headerJson,
                            groupCode:this.formData.groupCode,
                            groupName:this.formData.groupName,
                            importRosterJson: this.importRosterJson
                        }).then(res => res.data)
                            .then(data => {
                                if (data.code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功！'
                                    });
                                    this.$router.back();
                                }
                            })
                    }
                })
            },
  }
}
</script>
<style lang="scss" scoped>
.dataPushadd{
  padding:12px;
  box-sizing: border-box;
  font-size:14px; 
   .body {
        overflow-y: auto;
        margin-top: 20px;
        
    }
    .content{
        width: 810px;
        margin: 0 auto;
        font-size: 15px;
        color: #606266;
        line-height: 30px;
         .myheader {
        font-size: 18px;
        border-left: 4px solid #409EFF; 
        line-height: 18px;
        padding-left: 10px;
        margin: 10px 0;

       
    }
   
    }
     .top{
            padding-left: 100px;
    padding-bottom: 30px;
    }
  .header{
    padding-bottom:10px;
    border-bottom: 1px solid #e7eaec;       
  }
  
}
</style>

