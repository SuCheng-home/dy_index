<template>
    <div class="advice_info_wrap">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button size="medium" type="primary" @click="replayAdviceDialog" v-if="adviceInfoMsg.status===0">回复</el-button>
            <el-button size="medium" type="primary" @click="ignoreAdvice" v-if="adviceInfoMsg.status===0">忽略</el-button>
            <template v-if="(adviceInfoMsg.status === 1|| adviceInfoMsg.status === 2)&&type!=1">
                <el-button size="medium" type="primary" @click="checkAdviceIsPublicFunc(1)" v-if="adviceInfoMsg.isPublic === 0">公开</el-button>
                <el-button size="medium" type="primary" @click="checkAdviceIsPublicFunc(0)"  v-else-if="adviceInfoMsg.isPublic === 1">取消公开</el-button>
            </template>
            
        </div>
        <div class="advice_info_box">
            <div class="info_title">建议</div>
            <div class="info_content">
                <div class="rich_content_wrap">
                    <div>{{adviceInfoMsg.adviceContent}}</div>
                </div>
                <image-previewer tag="richtext" v-show="photoList.length">
                    <span class="img" :key="index" v-for="(item, index) in photoList">
                        <img :src="item">
                    </span>
                </image-previewer>
                <div class="info_time">{{adviceInfoMsg.createUserName}}{{adviceInfoMsg.createTime | formatTimeMap}}</div>
            </div>
            <div class="info_title">回复</div>
            <div class="info_content">
                <div class="rich_content_wrap">{{adviceInfoMsg.dealContent || '暂无回复'}}</div>
                <div class="info_time">{{adviceInfoMsg.batchUserName}}{{adviceInfoMsg.batchTime | formatTimeMap}}</div>
            </div>
        </div>
        <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="40%">
            <el-form :model="ruleForm" class="card-dialog-padding" :rules="rules" ref="ruleDialogForm" label-width="80px">
                <el-form-item label="回复信息" prop="replyContent">
                    <el-input type="textarea" :rows="4" v-model.trim="ruleForm.replyContent" :maxlength="500" ></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureDialog()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import mixins from '@/mixins/windowResize';
    import {getAdviceById,batchAdvice,updateAdviceIsPublic,getIsBatchUser} from '@/api/advice';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer.vue";

    export default {
        name: "adviceInfo",
        components: {
            ImagePreviewer
        },
        data() {
            return {
                adviceInfoMsg: {},
                photoList: [],
                adviceTypeId: 0,
                isManageRole: false,
                id:this.$route.query.id,
                type:this.$route.query.type,
                dialogVisible:false,
                ruleForm:{
                    replyContent:''
                },
                rules:{
                    replyContent: [
                        {required: true, message: '请填写回复内容！', trigger: 'blur'},
                    ]
                }
            }
        },
        filters: {
            formatTimeMap(type) {
                if (type) {
                    return type.substring(0,19);
                }
                return '-';
            }
        },
        mixins: [mixins],
        created() {
            this.getAdviceById();
        },
        methods: {
            ignoreAdvice(){
                this.$confirm("是否忽略此建议？", '删除', {
                    type: 'warning'
                }).then(() => {
                    this.batchAdviceFunc(2);
                }).catch(() => {         
                });
            },
            sureDialog(){
                this.$refs.ruleDialogForm.validate((valid) => {
                    if(valid){
                       this.batchAdviceFunc(1);
                       this.dialogVisible=false;
                    }
                })
            },
            batchAdviceFunc(status){
                //回复
                
                const dealContent = (status === 2) ? '' : this.ruleForm.replyContent;
                batchAdvice({
                    dealContent: dealContent,
                    id: this.id,
                    status: status
                }).then(res=>res.data)
                .then(data=>{
                    if(data.code===200){
                        this.$message({
                            type: 'success',
                            message: '操作成功！'
                        });
                        this.getAdviceById();
                    }else{
                        this.$message({
                            type: 'error',
                            message: data.msg
                        });
                    }
                }).catch(()=>{
                    this.$message({
                        type: 'error',
                        message: data.msg
                    });
                })
            },
            replayAdviceDialog(){
                this.dialogVisible=true;
            },
            goBack() {
                this.$router.back();
            },
            getAdviceById() {
                getAdviceById(this.$route.query.id).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200) {
                        this.adviceInfoMsg = data;
                        this.photoList = JSON.parse(data.photoJson);
                        this.adviceTypeId=data.typeId;
                        this.getIsBatchUserFunc();
                    }
                }).catch(() => {
                });
            },
            getIsBatchUserFunc(){
                getIsBatchUser(this.adviceTypeId).then(res => {
                    if (res.data.code === 200) {
                        this.isManageRole = true;
                    }
                }).catch(() => {
                });
            },
            // 是否公开操作
            checkAdviceIsPublicFunc(isPublic){
                const publicText = isPublic ? '公开' : '取消公开';
                this.$confirm(`是否${publicText}此建议？`, '删除', {
                    type: 'warning'
                }).then(() => {
                    updateAdviceIsPublic({
                        id: this.id,
                        isPublic: isPublic
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.code===200) {
                                this.$message({
                                    type: 'success',
                                    message: '操作成功！'
                                });
                                this.getAdviceById();
                            }
                        });
                }).catch(() => {         
                });

            }
        }
    }
</script>

<style scoped>
    .advice_info_wrap .img img {
        width: 80px;
        height: 80px;
        margin: 10px;
    }
</style>
<style lang="scss" scoped>
    .advice_info_wrap{
         padding:12px;
        .header{
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .advice_info_box{
            width: 810px;
            margin: 0 auto;
            .info_title{
                height: 20px;
                line-height: 20px;
                margin: 10px;
                padding-left: 10px;
                border-left: 4px solid #409eff;
                color: #333;
            }
            .info_content{
                overflow: hidden;
                width: 90%;
                margin: 0 auto;
                
                border: 1px solid #eee;
                border-radius: 4px;
                .rich_content_wrap{
                    color: #666;
                    margin: 10px;
                    overflow: hidden;
                    word-break: break-all;
                }
                .info_time{
                    height: 20px;
                    line-height: 20px;
                    margin: 10px;
                    text-align: right;
                    color: #999;
                }
            }
        }
    }
</style>
