<template>
    <div class="doc_flow_add_wrap app-container">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button type="primary" size="medium" @click="updateFundChargeApply(1)">保存草稿</el-button>
            <el-button type="primary" size="medium" @click="updateFundChargeApply(2)">提交审核</el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="flow_add_box">
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                    <el-row :gutter="50">
                        <el-col>
                            <el-form-item label="收费主题" prop="title">
                                <el-input v-model.trim="ruleForm.title" :maxlength="50"  size="medium" placeholder="请输入收费主题" ></el-input>
                            </el-form-item>
                              <el-form-item label="收费账户"  >
                              {{ruleForm.accountNum}}（{{ruleForm.accountName}}）
                            </el-form-item>
                             <el-form-item label="关联收费批次" prop="chargeJson">
                                   <el-select v-model="ruleForm.chargeJson" multiple size="medium" style="width: 100%;" placeholder="请选择" @change="numfun()">
                                        <el-option
                                        v-for="item in options"
                                        :key="item.cid"
                                        :label="item.cname"
                                        :value="item.cid">
                                        </el-option>
                                    </el-select>
                            </el-form-item>
                            <el-form-item label="申请金额" prop="amount" >
                                <el-input-number v-model.trim="ruleForm.amount" size="medium" placeholder="请输入金额" :precision="2"  :min="0.01" :max="99999999" :step="1"></el-input-number> 元
                            </el-form-item>
                            <!-- <el-form-item label="备注" >
                                <el-input v-model.trim="ruleForm.remark" :maxlength="500"   type="textarea" :autosize="{ minRows: 4, maxRows: 10}" placeholder="请输入申请理由"></el-input>
                            </el-form-item> -->
                            <el-form-item label="确认单" class="is-required">
                                <uploader  pathPrefix="zijinshenqing" module="zijinshenqing" moduleCode="20230829" :multiple="true" :extList="allFileTypeList"  v-model="ruleForm.fileJson"></uploader>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import Uploader from '@/components/Uploader/WebUploader';
    import {updateFundChargeApply,getFundChargeList,getFundChargeApply } from '@/api/fundApplication';
    export default {
        name: "documentFlowAdd",
        components: {
            Uploader
        },
        data() {
            return {
                ruleForm: {
                    amount:undefined,//	金额（分）	number	
                    applyState:1,//	1 草稿 2 待复核	number	
                    fileJson:[],//	附件	string
                    title:"",//	申请理由	string	
                    remark:"",//	资金用途	string
                    chargeJson:[],
                     accountNum:'',
                    accountName:'',
                },
                options:[],
                rules: {
                    title: [
                        {required: true, message: '请输入收费主题！', trigger: 'blur'}
                    ],
                    amount: [
                        { required: true, message: "请输入金额", trigger: "blur" }
                    ],
                    chargeJson: [
                            { type: 'array', required: true, message: '请至少选择一个收费批次', trigger: 'change' }
                     ],
                },
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar','jpg', 'jpeg', 'gif', 'bmp', 'png']
            }
        },
        mixins: [mixins],
        created() {
            getFundChargeApply(this.$route.query.id).then(res => {
                 const data = res.data.data;
                          if (res.data.code === 200 && data) {
                                this.ruleForm.amount = data.amount/100;
                                this.ruleForm.title = data.title;
                                this.ruleForm.fileJson = data.fileJson ? JSON.parse(data.fileJson) : [];
                                let chargeJson=JSON.parse(data.chargeJson)
                                 this.ruleForm.accountNum = data.accountNum;
                           this.ruleForm.accountName = data.accountName;
                                for(let i=0;i<chargeJson.length;i++){
                                    this.ruleForm.chargeJson.push(chargeJson[i].chargeId)
                                }
                            }
                            
                        }).catch();
            getFundChargeList(this.$route.query.id).then(res => {
                            const data = res.data;
                          this.options=data.data;
                        }).catch();
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            numfun(){
                let num=0
                for(let i=0;i<this.ruleForm.chargeJson.length;i++){
                    for(let j=0;j<this.options.length;j++){
                        if(this.ruleForm.chargeJson[i]==this.options[j].cid){
                            num=num+this.options[j].payTotal
                        }
                    }
                }
                this.ruleForm.amount=(num/100).toFixed(2)
            },
            updateFundChargeApply(applyState) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                         if(this.ruleForm.fileJson.length==0){
                         this.$message({
                                message: '请输上传确认单！',
                                type: 'warning'
                            });
                        return;
                    }
                        let query = {
                            amount: this.ruleForm.amount*100,
                            fileJson: this.ruleForm.fileJson,
                            remark: this.ruleForm.remark,
                            title: this.ruleForm.title,
                            applyState: applyState,
                            chargeJson:[],
                             id: this.$route.query.id,
                        };
                         for(let i=0;i<this.ruleForm.chargeJson.length;i++){
                            for(let j=0;j<this.options.length;j++){
                                if(this.ruleForm.chargeJson[i]==this.options[j].cid){
                                query.chargeJson.push({
                                    amount:this.options[j].payTotal,
                                    chargeId:this.options[j].cid,
                                    chargeName:this.options[j].cname,
                                })
                                } 
                            }
                        }
                       updateFundChargeApply(query).then(res => {
                            const data = res.data;
                            if (res.data.code === 200) {
                                this.$message({
                                    message: query.applyState==1?'保存草稿成功':'提交审核成功',
                                    type: 'success'
                                });
                                this.$router.back();
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'warning'
                                });
                            }
                        }).catch();
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .doc_flow_add_wrap {
        .header {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .body {
            overflow: auto;
            padding-top: 20px;
        }

        .flow_add_box {
            width: 810px;
            margin: 0 auto;
        }
    }
</style>
