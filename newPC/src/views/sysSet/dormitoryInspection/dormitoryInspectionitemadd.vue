<template>
    <div class="addCheckDuty">
        <div class="el-row">
            <div class="top">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-button size="medium" type="primary" @click.native="addCheckSave()">保存</el-button>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':boxH-210+'px'}">
            <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="检查项名称" class="is-required">
                    <el-input v-model.trim="ruleForm.title" :maxlength="20" placeholder="请输入检查项名称（1-20个字符）"></el-input>
                </el-form-item>
                <el-form-item label="排序" class="is-required">
                    <el-input-number v-model.trim="ruleForm.orderNum" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>
                </el-form-item>
                 <el-form-item label="评价方式" class="is-required">
                        <el-radio-group v-model="ruleForm.isStar" :disabled="id">
                            <el-radio :label="1">打星</el-radio>
                            <el-radio :label="2">打分</el-radio>
                        </el-radio-group>
                 </el-form-item>
                  <el-form-item v-if="ruleForm.isStar==2" label="加减分步长" class="is-required">
                      <el-radio-group v-model="ruleForm.scoreStep">
                                <el-radio :label="0.1">0.1</el-radio>
                                <el-radio :label="0.2">0.2</el-radio>
                                <el-radio :label="0.5">0.5</el-radio>
                                <el-radio :label="1">1</el-radio>
                            </el-radio-group>
                  </el-form-item>
                   <el-form-item label="检查对象" class="is-required">
                        <el-radio-group v-model="ruleForm.checkType" :disabled="id">
                            <el-radio :label="1">宿舍</el-radio>
                            <el-radio :label="2">床铺（住宿生）</el-radio>
                        </el-radio-group>
                 </el-form-item>
                  <el-form-item label="图标" class="is-required"> 
                    <!-- <img v-if="logoUrl.length !== 0" :src="logoUrl[0].fileUrl" style="width:50px;height:50px;vertical-align: middle;" /> -->
                    <uploader useSysBucket :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" showResult="image" openDelete showMode="button" v-model="logoUrl"></uploader>
                </el-form-item>
                  <el-form-item label="描述" >
                     <el-input type="textarea" v-model="ruleForm.descRemark" placeholder="请输入描述（1-200个字符）"
                                  :maxlength="200"></el-input>
                  </el-form-item>
                  <el-form-item label="设置考核项分数"  class="is-required" v-if="ruleForm.isStar==2">
                       <el-button type="text" class="jia_btn" @click="addcheckScore()" title="添加">+</el-button>
                       <div class="totalScore">
                            总分：{{ruleForm.totalScore}}
                       </div>
                      
                  </el-form-item>
                  <el-form-item label=" " v-if="ruleForm.isStar==2">
                       <div class="grid-content bg-purple-dark" v-for="(item,index) in ruleForm.listDetails" :key="index">
                                   {{index+1}}. <span class="scoreShow">{{item.checkName}}</span>
                                    <span class="scoreShow remarkShow" style="color:#909399" :title="item.remark">{{item.remark}}</span>
                                    <span style="color:#67C23A;width: 50px;">{{item.checkScore}}分</span>
                                    <span class="delete">
                                        <el-button type="danger" size="mini" plain @click="deleteResult(item,index)"  icon="el-icon-delete" circle></el-button>
                                    </span>
                                </div>
                  </el-form-item>
            </el-form>
            <el-dialog title="设置考核项分数" :visible.sync="dialogFormVisible">
                <el-form :model="ruleDialogForm" :rules="rulesDialog" ref="ruleDialogForm" label-width="100px">
                    <el-form-item label="评分项" prop="checkName">
                        <el-input v-model.trim="ruleDialogForm.checkName" :maxlength="100"></el-input>
                    </el-form-item>
                    <el-form-item label="分数" prop="checkScore">
                         <el-input-number v-model.trim="ruleDialogForm.checkScore" size="medium" :precision="1" placeholder='请输入分数' :step="0.1" :max="100" ></el-input-number>
                    </el-form-item>
                     <el-form-item label="备注" >
                     <el-input type="textarea" v-model="ruleDialogForm.remark" placeholder="请输入备注"
                                  :maxlength="200"></el-input>
                  </el-form-item>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="hideVisible()">取 消</el-button>
                    <el-button type="primary" @click="addCheckAndScore()">确 定</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {getItem,addItem,updateItem} from '@/api/dormitoryInspection';
    import mixin from '@/mixins/windowResize';
    import Uploader from '@/components/Uploader/WebUploader';
    export default {
         components: {
            Uploader
        },
        data() {
            const checkScoreRu = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入分数'));
                } else if (!(/-?\d+$/).test(value)) {
                    callback(new Error("请填写的数字"));
                } else if (value > 100) {
                    callback(new Error("考核分数超过限制！"));
                } else {
                    callback();
                }
            };
            return {
                id: this.$route.query.id||0,
                ruleForm: {
                    title: '',
                    checkType: 1,
                    descRemark: '',
                    isStar: 1,
                    listDetails: [],
                    logo: '',
                    orderNum: 1,
                    totalScore: 0,
                    scoreStep:0.1
                },
                ruleDialogForm: {
                    checkName: '',
                    checkScore: '',
                    remark:""
                },
                rulesDialog: {
                    checkName: [
                        {required: true, message: '请输入考核项', trigger: 'blur'}
                    ],
                    checkScore: [{
                        required: true,
                        trigger: 'blur',
                        validator: checkScoreRu
                    }]
                },
                dialogFormVisible: false,
                logoUrl:[]
            }
        },
        created() {
            if(this.id){
                this.getItem()
            }
        },
        mixins: [mixin],
        methods: {
            deleteResult(item, index) {
                this.ruleForm.listDetails.splice(index, 1);
                this.ruleForm.totalScore = this.ruleForm.listDetails.reduce((total, scoreItem) => total + Number(scoreItem.checkScore), 0);
            },
            getItem() {
                getItem(this.id).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let totalArray = data.data;
                        this.ruleForm.title = totalArray.title;
                        this.ruleForm.checkType = totalArray.checkType;
                        this.ruleForm.descRemark = totalArray.descRemark;
                        this.ruleForm.listDetails = totalArray.listDetails;
                        this.ruleForm.orderNum = totalArray.orderNum;
                        this.ruleForm.totalScore = totalArray.totalScore;
                        this.ruleForm.isStar = totalArray.isStar-0;
                        this.ruleForm.scoreStep = totalArray.scoreStep-0||0.1;
                         this.logoUrl = [{
                                fileUrl: data.data.logo
                            }];

                    }

                })
            },
            addCheckSave() {
                //保存
                if (this.ruleForm.title === "") {
                    this.$alert('请填写检查项名称！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                if ( this.logoUrl.length==0) {
                    this.$alert('请添加图标!', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                if (this.ruleForm.desc === "") {
                    this.$alert('请填写检查项描述！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                if (this.ruleForm.isStar == 2 && this.ruleForm.listDetails.length == 0) {
                    this.$alert('请设置考核项分数！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }              
               
               let query=this.ruleForm
                if (query.isStar == 1) {
                    query.listDetails = [];
                }
                query.logo=this.logoUrl[0].fileUrl
                if(this.id){
                  query.id=this.id
                  updateItem(query).then(res => {
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
                    addItem(query).then(res => {
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
    .grid-content {
        display: flex;
        align-items: center;
    }
    .scoreShow {
        padding: 0 20px;
        display: inline-block;
        min-width: 200px;
    }
    .remarkShow {
        flex: 1;
        width: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
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
    .addCheckDuty{
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
