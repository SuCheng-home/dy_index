<template>
    <div class="doc_flow_add_wrap app-container">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button type="primary" size="medium" @click="addDocFlow('save')" v-if="workFlowMsg.isSave === 1">
                {{workFlowMsg.saveName}}
            </el-button>
            <el-button type="primary" size="medium" @click="addDocFlow('submit')" v-if="workFlowMsg.isSubmit === 1">
                {{workFlowMsg.submitName}}
            </el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="flow_add_box">
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                    <el-row :gutter="50">
                        <el-col>
                            <el-form-item label="文件标题" prop="title">
                                <el-input v-model.trim="ruleForm.title" :maxlength="50" placeholder="请输入文件标题" ></el-input>
                            </el-form-item>
                            <el-form-item label="来文单位" prop="comeDepartName">
                                <el-input v-model.trim="ruleForm.comeDepartName" :maxlength="50" placeholder="请输入来文单位"></el-input>
                            </el-form-item>
                            <el-form-item label="来文编号" >
                                <el-input v-model.trim="ruleForm.comeNum" :maxlength="50" placeholder="请输入来文编号"></el-input>
                            </el-form-item>
                            <el-form-item label="来文日期" prop="comeDate" >
                                <el-date-picker v-model="ruleForm.comeDate" type="date" placeholder="选择日期" :clearable="false"></el-date-picker>
                            </el-form-item>
                             <el-form-item label="收文编号" prop="putNum" >
                                <el-input v-model.trim="ruleForm.putNum" :maxlength="50" placeholder="请输入收文编号"></el-input>
                            </el-form-item>
                            <el-form-item  label="附件" prop="fileJson" class="is-required">
                                <uploader pathPrefix="gongwenliuzhuan" module="gongwenliuzhuan" moduleCode="20200426" :multiple="true" :extList="allFileTypeList"
                                          v-model="fileJson"></uploader>
                            </el-form-item>
                             <el-form-item  label="图片" v-if="picjson.length" >
                                   <image-previewer tag="richtext">
                                          <img style="width: 100px!important;height: 100px;margin-right: 10px;"
                                                                        v-for="(picItem,inedx) in picjson"
                                                                        :src="picItem.fileUrl" :key="inedx"/>
                                            </image-previewer>
                                
                            </el-form-item>
                            <el-form-item prop="content">
                                <div slot="label">内容</div>
                                <br />
                                <ueditor style="width: 740px;position: relative;right: 70px;" class="rich-editor" ref="ueditor" :defaultMes="ruleForm.content"
                                         @editModel="richTextEditHandler"></ueditor>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import workFlow from '@/mixins/workFlow';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import Ueditor from "@/components/Ueditor";
    import Uploader from '@/components/Uploader/WebUploader';
    import FileList from '@/components/FileList/FileList.vue';
    import {getDocumentFlowById, addDocumentFlow, updateDocumentFlow} from '@/api/teachingStudy/documentFlow';

    export default {
        name: "documentFlowAdd",
        components: {
            ImagePreviewer,
            Ueditor,
            Uploader,
            FileList
        },
        data() {
            return {
                saveType: '',
                stepStateName: '',
                workFlowMsg: {},
                flowId: this.$route.query.id,
                ruleForm: {
                    title: '',
                    comeDepartName: '',
                    comeNum: '',
                    comeDate: '',
                    content: '',
                    putNum:""
                },
                fileJson: [],
                picjson:[],
                rules: {
                    title: [
                        {required: true, message: '请输入文件标题！', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符！', trigger: 'blur'}
                    ],
                    comeDepartName: [
                        {required: true, message: '请输入来文单位！', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符！', trigger: 'blur'}
                    ],
                    comeNum: [
                        {required: true, message: '请输入来文编号！', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符！', trigger: 'blur'}
                    ],
                    putNum: [
                        {required: true, message: '请输入收文编号！', trigger: 'blur'},
                        {min: 1, max: 50, message: '长度在 1 到 50 个字符！', trigger: 'blur'}
                    ],
                    comeDate: [
                        {required: true, message: '请选择来文日期！'}
                    ]
                },
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf', 'zip', 'rar','png', 'bmp', 'jpg', 'jpeg', 'gif']
            }
        },
        mixins: [workFlow],
        created() {
            this.getWorkFlow('documentflow').then(res => {
                if (res.data.id) {
                    this.getStartStep(res.data.id).then(res => {
                        this.workFlowMsg = res.data;
                    });
                }
            });
            if (this.flowId) {
                this.getDocumentFlowById();
            }
        },
        methods: {
            goBack() {
                this.$router.back();
            },
            getDocumentFlowById() {
                getDocumentFlowById(this.flowId).then(res => {
                    const data = res.data.data;
                    if (res.data.code === 200 && data) {
                        this.ruleForm.title = data.title;
                        this.ruleForm.comeDepartName = data.comeDepartName;
                        this.ruleForm.comeNum = data.comeNum;
                        this.ruleForm.putNum = data.putNum;
                        this.ruleForm.comeDate = data.comeDate;
                        this.ruleForm.content = data.content;
                        this.stepStateName = data.stepStateName || '';
                        this.$refs.ueditor.setContent(data.content);
                        this.fileJson = data.fileJson ? JSON.parse(data.fileJson) : [];
                        this.picjson=data.picjson ? JSON.parse(data.picjson) : [];
                        let self = this;
                        setTimeout(() => {
                            self.$refs.ueditor.setContent(data.content);
                        }, 300)
                    }
                }).catch();
            },
            addDocFlow(saveType) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                         if (!this.fileJson.length) {
                            this.$message({
                                message: '请上传附件！',
                                type: 'warning'
                            });
                            return;
                        }
                        // if (!this.ruleForm.content) {
                        //     this.$message({
                        //         message: '请输入内容！',
                        //         type: 'warning'
                        //     });
                        //     return;
                        // }

                        this.saveType = saveType;

                        let query = {
                            title: this.ruleForm.title,
                            comeDepartName: this.ruleForm.comeDepartName,
                            comeNum: this.ruleForm.comeNum,
                            putNum:this.ruleForm.putNum,
                            comeDate: this.$moment(this.ruleForm.comeDate).format('YYYY-MM-DD'),
                            content: this.$refs.ueditor.getContent(),
                            fileJson: JSON.stringify(this.fileJson),
                            picjson:JSON.stringify(this.picjson),
                            state: 1
                        };

                        if (this.flowId) { // 编辑
                            query.id = this.flowId;
                            query.stepStateName = this.stepStateName;
                            this.updateDocumentFlow(query);
                        } else { // 新增
                            this.addDocumentFlow(query);
                        }
                    }
                });
            },
            addDocumentFlow(query) {
                addDocumentFlow(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        if (this.saveType === 'submit') { // 提交
                            this.$router.replace({path: 'stepIndex', query: {id: data.data.id, state: 1}});
                        } else {
                            this.$router.replace({path: 'info', query: {id: data.data.id, state: 1}});
                        }
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            updateDocumentFlow(query) {
                updateDocumentFlow(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                        if (this.saveType === 'submit') { // 提交
                            this.$router.replace({path: 'stepIndex', query: {id: this.flowId, state: 1}});
                        } else {
                            this.$router.replace({path: 'info', query: {id: this.flowId, state: 1}});
                        }
                    } else {
                        this.$message({
                            message: data.msg,
                            type: 'warning'
                        });
                    }
                }).catch();
            },
            richTextEditHandler(content) {
                this.ruleForm.content = content;
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
