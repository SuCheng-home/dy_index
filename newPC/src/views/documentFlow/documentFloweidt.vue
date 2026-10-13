<template>
    <div class="doc_flow_add_wrap app-container">
        <div class="header">
            <el-button size="medium" @click="goBack">返回</el-button>
            <el-button type="primary" size="medium" @click="addDocFlow()">
               保存
            </el-button>
        </div>
        <div class="body" :style="`height: ${nobottommaxH}px;`">
            <div class="flow_add_box">
                <el-form ref="ruleForm" :model="ruleForm" :rules="rules" label-width="140px" class="demo-ruleForm">
                    <el-row :gutter="50">
                        <el-col>
                            <el-form-item label="文件标题">
                               {{ruleForm.title}}
                            </el-form-item>
                            <el-form-item label="来文单位" prop="comeDepartName">
                                <el-input v-model.trim="ruleForm.comeDepartName" :maxlength="50" placeholder="请输入来文单位"></el-input>
                            </el-form-item>
                            <el-form-item label="来文编号" >
                                <el-input v-model.trim="ruleForm.comeNum" :maxlength="50" placeholder="请输入来文编号"></el-input>
                            </el-form-item>
                             <el-form-item label="收文编号" prop="putNum" >
                                <el-input v-model.trim="ruleForm.putNum" :maxlength="50" placeholder="请输入收文编号"></el-input>
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
    import {getDocumentFlowById, updateDocumentFlow} from '@/api/teachingStudy/documentFlow';

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
                    putNum:"",
                    state:""
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
                        this.ruleForm.state = data.state;
                        this.ruleForm.comeDate = data.comeDate;
                        this.ruleForm.content = data.content;
                        this.stepStateName = data.stepStateName || '';
                        this.fileJson = data.fileJson ? JSON.parse(data.fileJson) : [];
                        this.picjson=data.picjson ? JSON.parse(data.picjson) : [];
                        let self = this;
                    }
                }).catch();
            },
            addDocFlow(saveType) {
                this.$refs['ruleForm'].validate((valid) => {
                    if (valid) {
                        this.saveType = saveType;

                        let query = {
                            title: this.ruleForm.title,
                            comeDepartName: this.ruleForm.comeDepartName,
                            comeNum: this.ruleForm.comeNum,
                            putNum:this.ruleForm.putNum,
                            comeDate: this.$moment(this.ruleForm.comeDate).format('YYYY-MM-DD'),
                            content: this.ruleForm.content,
                            fileJson: JSON.stringify(this.fileJson),
                            picjson:JSON.stringify(this.picjson),
                            state: this.ruleForm.state
                        };
                        query.id = this.flowId;
                        query.stepStateName = this.stepStateName;
                        this.updateDocumentFlow(query);
                    }
                });
            },
           
            updateDocumentFlow(query) {
                updateDocumentFlow(query).then(res => {
                    const data = res.data;
                    if (res.data.code === 200) {
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        });
                       this.$router.go(-1);
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
