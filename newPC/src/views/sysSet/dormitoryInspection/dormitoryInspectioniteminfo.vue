<template>
    <div class="addCheckDuty">
        <div class="el-row">
            <div class="top">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-button size="medium" type="primary" @click.native="dormitoryInspectionitemadd()">编辑</el-button>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':boxH-210+'px'}">
            <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="检查项名称" >
                   {{ruleForm.title}}
                </el-form-item>
                <el-form-item label="排序" >
                    {{ruleForm.orderNum}}
                </el-form-item>
                 <el-form-item label="评价方式" >
                          {{ruleForm.isStar==1?'打星':'打分'}}
                 </el-form-item>
                  <el-form-item v-if="ruleForm.isStar==2" label="加减分步长" >
                   {{ruleForm.scoreStep}}
                  </el-form-item>
                   <el-form-item label="检查对象" >
                       {{ruleForm.checkType==1?'宿舍':'床铺（住宿生）'}}
                 </el-form-item>
                  <el-form-item label="图标" > 
                    <img  :src="ruleForm.logo" style="width:50px;height:50px;vertical-align: middle;" />
                    </el-form-item>
                  <el-form-item label="描述" >
                     {{ruleForm.descRemark||'--'}}
                  </el-form-item>
                  <el-form-item label="设置考核项分数"   v-if="ruleForm.isStar==2">
                       <div class="totalScore">
                            总分：{{ruleForm.totalScore}}
                       </div>
                      
                  </el-form-item>
                  <el-form-item label=" " v-if="ruleForm.isStar==2">
                       <div class="grid-content bg-purple-dark" v-for="(item,index) in ruleForm.listDetails" :key="index">
                                   {{index+1}}. <span class="scoreShow" >{{item.checkName}}</span>
                                    <span class="scoreShow remarkShow" style="color:#909399" :title="item.remark">{{item.remark}}</span>
                                    <span style="color:#67C23A;width: 50px;">{{item.checkScore}}分</span>
                                </div>
                  </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {getItem} from '@/api/dormitoryInspection';
    import mixin from '@/mixins/windowResize';
    export default {
        data() {
            return {
                id: this.$route.query.id,
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
            }
        },
        created() {
            if(this.id){
                this.getItem()
            }
        },
        mixins: [mixin],
        methods: {
            dormitoryInspectionitemadd() {
                this.$router.push({
                    path: 'dormitoryInspectionitemadd',
                    query: {
                        id: this.id
                    }
                })
            },
            getItem() {
                getItem(this.id).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let totalArray = data.data;
                        this.ruleForm = totalArray;
                    }

                })
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
