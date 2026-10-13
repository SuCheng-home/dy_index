<template>
    <div class="campusPatrolSetupTermAdd">
        <div class="el-row">
            <div class="top">
                  <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                   <el-button size="medium" type="primary" @click.native="addCheckSave()">保存</el-button>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':boxH-110+'px'}">
            <el-form :model="ruleForm" ref="ruleForm" label-width="160px" class="demo-ruleForm">
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="巡查项名称" class="is-required"></el-form-item>
                    </el-col>
                    <el-col :span="19">
                        <el-input v-model.trim="ruleForm.checkItemName" :maxlength="20"
                                  placeholder="请输入巡查项名称（1-20个字符）"></el-input>
                    </el-col>
                </el-row>
                 <el-row style="margin-bottom:20px">
                    <el-col :span="5">
                        <el-form-item label="排序号" class="is-required"></el-form-item>
                    </el-col>
                    <el-col :span="19">
                         <el-input-number v-model.trim="ruleForm.sortNo" size="medium" :precision="0" :min="1" placeholder='请输入排序号' :step="1" :max="1000" ></el-input-number>
                    </el-col>
                </el-row>
                 <el-row style="margin-bottom:20px">
                    <el-col :span="5">
                        <el-form-item label="logo" class="is-required"></el-form-item>
                    </el-col>
                    <el-col :span="19">
                        <div class="login-box" v-if="ruleForm.cover">
                            <img :src="ruleForm.cover" alt="">
                        </div>
                        <div class="logoAdd" @click="diaLogoVisible=true">
                            <i class="el-icon-plus avatar-uploader-icon navAddIcon"></i>
                            <span class="navAddTitle">添加logo</span>
                        </div>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="是否评价" class="is-required"></el-form-item>
                    </el-col>
                    <el-col :span="19">
                       <el-radio-group v-model="ruleForm.isEvaluate">
                            <el-radio :label="1">否</el-radio>
                            <el-radio :label="2">是</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                 <el-row>
                    <el-col :span="5">
                        <el-form-item label="关联年级" class="is-required"></el-form-item>
                    </el-col>
                    <el-col :span="19">
                       <el-radio-group v-model="ruleForm.isRelevanceGrade">
                            <el-radio :label="1">否</el-radio>
                            <el-radio :label="2">是</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="5">
                        <el-form-item label="关联责任人" class="is-required"></el-form-item>
                    </el-col>
                    <el-col :span="19">
                       <el-radio-group v-model="ruleForm.isDutyUser">
                            <el-radio :label="1">否</el-radio>
                            <el-radio :label="2">是</el-radio>
                        </el-radio-group>
                    </el-col>
                </el-row>
               
                <el-row style="margin-bottom:20px">
                    <el-col :span="5">
                        <el-form-item label="描述" ></el-form-item>
                    </el-col>
                    <el-col :span="19">
                        <el-input type="textarea" v-model="ruleForm.desc" placeholder="请输入描述（0-200个字符）"
                                  :maxlength="200"></el-input>
                    </el-col>
                </el-row>
            </el-form>
            <el-dialog title="logo添加或更换" :visible.sync="diaLogoVisible" class="dialoglinkWrap" width="590px">
                <div class="dialoglinkBox clearfix">
                <div class="checkitem" v-for="(logoItem,index) in logoList" :key="index">
                    <input class="check-select" type="checkbox" v-model="logoItem.isShow" name="imgText" v-on:click="Checklogo(logoItem)">
                    <div class="checkitem-box">
                        <img class="check-img" v-if="logoItem.url" :src="logoItem.url">
                        <img class="check-img" v-else src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png">
                        <p class="check-title" >{{logoItem.name}}</p>
                    </div>
                </div>
                </div>
                <div slot="footer" class="dialog-footer">
                    <el-button @click="diaLogoVisible=false">取 消</el-button>
                    <el-button type="primary" @click="addLogoHandler()">保 存</el-button>
                </div>
            </el-dialog>
        </div>
    </div>
</template>
<script>
    import {addComplexCheckItem} from '@/api/compositeExamSetTwo';
    import mixin from '@/mixins/windowResize';
    export default {
        data() {
            return {
                ruleForm: {
                    checkItemName:'',//	检查项名称	string	
                    cover:'',//	封面	string	
                    desc:'',//	描述	string	
                    isEvaluate:1,//	是否评价 1不评价 2评价	number	
                    isRelevanceGrade:1,//	是否关联年级 1不关联 2关联	number	
                    sortNo:1,//	排序号	number	
                    isDutyUser:1
                },
                logoList:[
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/morningRead.png',
                        isShow:false,
                        name:'晨读'
                    },
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/noonCheck.png',
                        isShow:false,
                        name:'午间'
                    },
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/party.png',
                        isShow:false,
                        name:'集会'
                    },
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/clearCheck.png',
                        isShow:false,
                        name:'清校'
                    },
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/after_shcool.png',
                        isShow:false,
                        name:'放学'
                    },
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/teaching.png',
                        isShow:false,
                        name:'教学'
                    },
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/Ceremony.png',
                        isShow:false,
                        name:'礼仪'
                    },
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/eyeExerciseCheck.png',
                        isShow:false,
                        name:'眼操'
                    },
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/recess.png',
                        isShow:false,
                        name:'大课间'
                    },
                    {
                        url:'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/hygienicCheck.png',
                        isShow:false,
                        name:'卫生'
                    }, {
                        url: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/zaodu.png',
                        isShow: false,
                        name:'早读'
                    }, {
                        url: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/chenbao.png',
                        isShow: false,
                        name:'晨报'
                    }, {
                        url: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/generalCheck/duanlian.png',
                        isShow: false,
                        name:'锻炼'
                    }
                ],
                logoItem:{},
                diaLogoVisible:false
            }
           
        },
        created() {
           
        },
        mixins: [mixin],
        methods: {
            addLogoHandler(){
                if(Object.keys(this.logoItem).length==0||this.logoItem&&this.logoItem.isShow==false){
                    this.$message({
                        type: 'error',
                        message: '请选择logo'
                    })
                }else{
                    this.ruleForm.cover=this.logoItem.url;
                    this.diaLogoVisible=false;
                }
            },
            Checklogo(item){
                this.logoList.forEach((item)=>{
                    item.isShow=false;
                });
                this.logoItem=item;
            },
            addCheckSave() {
                //保存
                if (this.ruleForm.checkItemName === "") {
                    this.$alert('请填写巡查项名称！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                if (!this.ruleForm.sortNo) {
                    this.$alert('请输入排序!', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                if (this.ruleForm.cover === "") {
                    this.$alert('请添加logo!', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }
                addComplexCheckItem(this.ruleForm).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.$message({
                            type: 'success',
                            message: '巡查项添加成功！'
                        });
                        this.$router.back();
                    }
                })
            },
        }
    }
</script>
<style lang="scss" scoped>
.top {
      padding-bottom: 10px;
      border-bottom: 1px solid  #e7eaec;
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
    .demo-ruleForm{
        width: 810px;
        margin: 0 auto;
    }

    ul, li {
        list-style: none;
    }

    .campusPatrolSetupTermAdd {
        padding:12px;
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
    }

    .totalScore {
        line-height: 36px;
        padding: 0 20px;
    }
    .login-box{
        float: left;
        width:100px;
        height:100px;
        border-radius:6px;
        overflow: hidden;
        margin-right:20px;
        img{
            display: block;
            width:100px;
            height:100px;
        }
    }
    .logoAdd{
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
        .navAddIcon{
            font-size: 40px;
            color: #8c939d;
            width:auto;
            height:auto;
        }
        .navAddTitle{
            font-size: 14px;
            color: #8c939d;
            display: block;
            margin-top: 10px;
        }
    }
    .logoAdd:hover{
      border:1px solid  #409EFF;
    }
    .logoAdd:hover .navAddIcon{
      color:#409EFF;
    }
    .logoAdd:hover .navAddTitle{
      color:#409EFF;
    }
    .dialoglinkBox{
        .check-select{
        position: absolute;
        top: 0;
        right: 9px;
        width: 16px;
        height: 16px;
        cursor: pointer;
        z-index: 10;
        }
        .checkitem{
        width: 100px;
        float: left;
        position: relative;
        margin-right: 10px;
        .checkitem-box{
            width: 100px;
            padding: 10px 0;
            float: left;
            text-align: center;
            position: relative;
            .check-img{
            width: 66px;
            height: 66px;
            display: block;
            border-radius: 6px;
            margin: 0 auto;
            }
            .check-title{
            display: inline-block;
            width:100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            }
            .link-title{
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
<style scoped>
    .campusPatrolSetupTermAdd .el-form-item__label {
        padding-right: 30px;
    }

    .campusPatrolSetupTermAdd .el-textarea__inner {
        height: 100px;
    }

    .campusPatrolSetupTermAdd .el-select {
        width: 100%;
    }

    .campusPatrolSetupTermAdd .el-radio-group {
        height: 36px;
        line-height: 1;
        padding-top: 10px;
    }
</style>
