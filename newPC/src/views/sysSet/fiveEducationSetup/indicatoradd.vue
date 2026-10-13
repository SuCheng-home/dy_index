<template>
    <div class="addCheckDuty">
        <div class="el-row">
            <div class="top">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-button size="medium" type="primary" @click.native="addPeanutIndicator()">保存</el-button>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':boxH-210+'px'}">
            <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="指标图标" class="is-required"> 
                     <uploader useSysBucket :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" openDelete showMode="button" v-model="logoUrl"></uploader>
                </el-form-item>
                <el-form-item label="指标名称" class="is-required">
                    <el-input v-model.trim="ruleForm.title" :maxlength="6" placeholder="请输入指标名称（1-6个字符）"></el-input>
                </el-form-item>
                <el-form-item label="指标分类" class="is-required" v-if="ruleForm.type==1">
                    <el-select v-model="ruleForm.typeCode">
                            <el-option v-for="certItem in certTypeList" :value="certItem.typeCode1" :key="certItem.typeCode1"
                                       :label="certItem.typeName"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="操作权限" class="is-required">
                     <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.operatTh" >老师</el-checkbox>
                     <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.operatClassHeader" >班主任</el-checkbox>
                     <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.operatPh" >家长</el-checkbox>
                </el-form-item>
                <el-form-item label="上报字段" class="is-required">
                    <el-checkbox disabled :true-label="1" :false-label="2" v-model="ruleForm.isTitle" >主题（名称）</el-checkbox>
                    <el-checkbox disabled :true-label="1" :false-label="2" v-model="ruleForm.isBehContext" >内容/评价/感受</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.isTime" >时间</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.isCurr" v-if="ruleForm.type==1">学科</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.isAdress" >地点</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.isTimeLength" >时长</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.isSport" >体健技能</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.isArt" >艺术技能</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.isLabor" >劳动技能</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.isFile" >附件/材料</el-checkbox>
                    
                </el-form-item>
                <el-form-item label="审核权限" class="is-required" v-if="ruleForm.operatPh==1">
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.batchClassHeader" >班主任</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.batchChineseTh" >语文老师</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.batchTh" >任课老师</el-checkbox>
                    <el-checkbox :true-label="1" :false-label="2" v-model="ruleForm.batchMan" >管理员</el-checkbox>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {getPeanutIndicator,addPeanutIndicator,updatePeanutIndicator,findSchoolHonorTypeCertList} from '@/api/fiveEducationSetup';
    import mixin from '@/mixins/windowResize';
    import Uploader from '@/components/Uploader/WebUploader';
    export default {
         components: {
            Uploader
        },
        data() {
            return {
                id: this.$route.query.id||0,
                ruleForm: {
                    cover:'',//	封面	string	
                    title:'',//	标题	string	
                    typeCode:'',//	分类code	string	
                    typeName:'',//	分类名称	string 
                    type: this.$route.query.type,
                    operatClassHeader:2,//	操作班主任 1 可以 2 否	number	
                    operatPh:2,//	操作家长 1 可以 2 否	number	
                    operatTh:2,//	操作老师 1 可以 2 否	number	
                    
                    isAdress:2,//	地点 1 有 2无	number	
                    isArt:2,//	艺术技能 1 有 2无	number	
                    isBehContext:1,//	内容评价感受 1 有 2无	number	
                    isFile:2,//	附件材料 1 有 2无	number	
                    isLabor:2,//	劳动技能 1 有 2无	number	
                    isSport:2,//	健体技能 1 有 2无	number	
                    isTime:2,//	时间 1 有 2无	number	
                    isTimeLength:2,//	时长 1 有 2无	number	
                    isTitle:1,//	标题 1 有 2无	number	
                    isCurr:2,
                    batchChineseTh:2,//	语文老师审批 1 可以 2否	number	
                    batchClassHeader:2,//	班主任审批 1 可以 2否	number	
                    batchMan:2,//	管理员审批 1 可以 2否	number	
                    batchTh:2,//	老师审批 1 可以 2否	number
                },              
                logoUrl:[],
                certTypeList:[]
            }
        },
        created() {
            if(this.ruleForm.type==1){
                  findSchoolHonorTypeCertList()
                .then(res => res.data)
                .then(data => {
                    this.certTypeList = data.data;
                    if (!this.id && data.data && data.data.length !== 0) {
                        this.ruleForm.typeCode = data.data[0].typeCode1;
                    }
                });

            }
            
            if(this.id){
                this.getPeanutIndicator()
            }
        },
        mixins: [mixin],
        methods: {
            getPeanutIndicator() {
                getPeanutIndicator(this.id).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let totalArray = data.data;
                        this.ruleForm = totalArray;
                         this.logoUrl = [{
                                fileUrl: data.data.cover
                            }];

                    }

                })
            },
            addPeanutIndicator() {
                //保存
                if ( this.logoUrl.length==0) {
                    this.$alert('请添加图标!', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                if (this.ruleForm.title === "") {
                    this.$alert('请填写指标名称！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }           
                if (this.ruleForm.operatClassHeader==2&&this.ruleForm.operatPh==2&&this.ruleForm.operatTh==2) {
                    this.$alert('请选择操作权限！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                if (this.ruleForm.operatPh==1&&(this.ruleForm.batchClassHeader==2&&this.ruleForm.batchChineseTh==2&&this.ruleForm.batchTh==2&&this.ruleForm.batchMan==2)) {
                    this.$alert('请选择审核权限！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
               
               let query=JSON.parse(JSON.stringify(this.ruleForm))
                if (query.operatPh == 2) {
                    query.batchClassHeader = 2;
                    query.batchChineseTh = 2;
                    query.batchTh = 2;
                    query.batchMan = 2;
                }
                if(this.ruleForm.type==1){
                     query.typeName=(this.certTypeList.find(item => item.typeCode1 == this.ruleForm.typeCode)).typeName
                }
                query.cover=this.logoUrl[0].fileUrl
                if(this.id){
                  query.id=this.id
                  updatePeanutIndicator(query).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '编辑成功！'
                        });
                         this.$router.back();
                    }
                })
                }else{
                    addPeanutIndicator(query).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '添加成功！'
                        });
                         this.$router.back();
                    }
                })

                }
                
            },
            hideVisible() {
                this.dialogFormVisible = false;
                this.ruleDialogForm.checkName = '';
                this.ruleDialogForm.checkScore = '';
                this.ruleDialogForm.remark = '';
            },
            addcheckScore() {
                this.ruleDialogForm.checkName = '';
                this.ruleDialogForm.checkScore = '';
                this.ruleDialogForm.remark = '';
                this.dialogFormVisible = true;
            },
            addCheckAndScore() {
                const _this = this;
                this.$refs.ruleDialogForm.validate((valid) => {
                    if (valid) {
                        this.ruleForm.listDetails.push({
                            checkName: _this.ruleDialogForm.checkName,
                            checkScore: _this.ruleDialogForm.checkScore,
                            remark: _this.ruleDialogForm.remark,
                        });
                        _this.ruleDialogForm.checkName = '';
                        _this.ruleDialogForm.checkScore = '';
                        if (this.ruleForm.listDetails.length) {
                          this.ruleForm.totalScore = this.ruleForm.listDetails.reduce((total, scoreItem) => total + Number(scoreItem.checkScore), 0);
                        }else{
                            this.ruleForm.totalScore=0
                        }
                        _this.dialogFormVisible = false;
                    } else {
                        return false;
                    }
                });
            },
           
        }
    }
</script>
<style lang="scss" scoped>
    .top {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
    }
    .totalScore{
        float: right;
        color:#67C23A;
    }
    .scrollBar {
        overflow-x: hidden;
        overflow-y: auto;

        &::-webkit-scrollbar-track-piece {
            background: #d3dce6;
        }

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-thumb {
            background: #99a9bf;
            border-radius: 20px;
        }
    }

    .clearfix:after {
        content: "";
        height: 0;
        display: block;
        clear: both;
        visibility: hidden;
    }

    .demo-ruleForm {
        width: 810px;
        margin: 0 auto;
    }

    ul, li {
        list-style: none;
    }

    .addCheckDuty {
        padding: 12px;
    }

    .main-wrap {
        width: 100%;
        padding-top: 20px;
    }

    .el-form-item.is-required .el-form-item__label:before {
        content: "*";
        color: #ff4949;
        margin-right: 4px;
    }

    .jia_btn {
        font-size: 32px;
        line-height: 1;
        padding: 0;
        display: inline-block;
    }

    .scoreShow {
        padding: 0 20px;
        display: inline-block;
        min-width: 200px;
    }

    .totalScore {
        line-height: 36px;
        padding: 0 20px;
    }

    .login-box {
        float: left;
        width: 100px;
        height: 100px;
        border-radius: 6px;
        overflow: hidden;
        margin-right: 20px;

        img {
            display: block;
            width: 100px;
            height: 100px;
        }
    }

    .logoAdd {
        float: left;
        width: 100px;
        height: 100px;
        padding-top: 17px;
        line-height: 1;
        border: 1px solid #d0d0d0;
        background-color: #fbfdff;
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        text-align: center;

        .navAddIcon {
            font-size: 40px;
            color: #8c939d;
            width: auto;
            height: auto;
        }

        .navAddTitle {
            font-size: 14px;
            color: #8c939d;
            display: block;
            margin-top: 10px;
        }
    }

    .logoAdd:hover {
        border: 1px solid #409EFF;
    }

    .logoAdd:hover .navAddIcon {
        color: #409EFF;
    }

    .logoAdd:hover .navAddTitle {
        color: #409EFF;
    }

    .dialoglinkBox {
        .check-select {
            position: absolute;
            top: 0;
            right: 9px;
            width: 16px;
            height: 16px;
            cursor: pointer;
            z-index: 10;
        }

        .checkitem {
            width: 100px;
            float: left;
            position: relative;
            margin-right: 10px;

            .checkitem-box {
                width: 100px;
                padding: 10px 0;
                float: left;
                text-align: center;
                position: relative;

                .check-img {
                    width: 66px;
                    height: 66px;
                    display: block;
                    border-radius: 6px;
                    margin: 0 auto;
                }

                .check-title {
                    display: inline-block;
                    width: 100%;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .link-title {
                    font-size: 14px;
                    color: #333;
                    line-height: 26px;
                    margin-bottom: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

            }
        }
    }
</style>
<style lang="scss" scoped>
    .indicatoradd{
         .el-select {
            width: 100%;
        }
        .el-radio-group {
            height: 36px;
            line-height: 1;
            padding-top: 10px;
        }
    }
</style>
