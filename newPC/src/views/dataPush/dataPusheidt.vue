<template>
  <div class="dataPushadd">
    <div class="header">
      <el-button  @click="$router.back()" type="default" size="medium">返回</el-button>
         <el-button size="medium" @click="saveHandler" type="primary">保存</el-button>
    </div>
    <div class="body" :style="{height: `${maxH}px`}">  
         <div>
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
                </el-form>
            </div>
           
        </div>      							
       
    </div>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import {updateDateSendBatch,listValue,getDataSendSearchBatchInfo} from '@/api/dataPush';
export default {
  data(){
    
            return {
                formData: {
                    batchName: '',
                    groupName:'',
                    groupCode:'',
                    id:this.$route.query.id
                },
                formDataRules: {
                    batchName: [
                        {required: true, message: '请输入批次主题', trigger: 'blur'}
                    ],
                     groupCode: [
                            {required: true, message: "请选择分类", trigger: "change"}
                        ],
                },
                typelist:[]                
            }
  },
   created() {
       listValue().then((res) => {
        const data = res.data.data;
        if (res.data.code === 200) {
           this.typelist = data.dataList;
        }
      });
      getDataSendSearchBatchInfo(this.$route.query.id).then((res) => {
        const data = res.data.data;
        if (res.data.code === 200) {
            console.log(data)
            this.formData.batchName=data.batchName;
            this.formData.groupCode=data.groupCode;
        }
      });
        },
 
  mixins:[mixins],
  methods:{   
            saveHandler() {
                this.$refs.form.validate(isValid => {
                    if (isValid) {
                         for (let j = 0; j < this.typelist.length; j++) {
                            if (this.formData.groupCode == this.typelist[j].code) {
                                this.formData.groupName = this.typelist[j].value;
                            }
                            }
                        updateDateSendBatch({
                            batchName: this.formData.batchName,
                            id: this.formData.id,
                            groupCode:this.formData.groupCode,
                            groupName:this.formData.groupName,
                        }).then(res => res.data)
                            .then(data => {
                                if (data.code === 200) {
                                    this.$message({
                                        type: 'success',
                                        message: '编辑成功！'
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

