<template>
    <div class="campusPatrolSetupTermAdd">
        <div class="el-row">
            <div class="top">
                  <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                   <el-button size="medium" type="primary" @click.native="campusPatrolSetupTermEidt()">编辑</el-button>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':boxH-110+'px'}">
            <el-form :model="ruleForm" ref="ruleForm" label-width="160px" class="demo-ruleForm">
                <el-form-item label="巡查项名称" >{{ruleForm.checkItemName}}</el-form-item>
                <el-form-item label="排序号" > {{ruleForm.sortNo}}</el-form-item>
                <el-form-item label="logo">
                    <div class="login-box" >
                            <img :src="ruleForm.cover" alt="">
                        </div>
                </el-form-item>
                <el-form-item label="是否评价" >{{ruleForm.isEvaluate==1?'否':'是'}}</el-form-item>
                <el-form-item label="关联年级">{{ruleForm.isRelevanceGrade==1?'否':'是'}}</el-form-item>
                <el-form-item label="描述" > {{ruleForm.desc}}</el-form-item>
            </el-form>
           
        </div>
    </div>
</template>
<script>
    import {updateComplexCheckItem,getComplexCheckItem} from '@/api/compositeExamSetTwo';
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
                    id: this.$route.query.id,
                },
            }
           
        },
        created() {
           getComplexCheckItem(this.$route.query.id).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        this.ruleForm.checkItemName=data.data.checkItemName
                        this.ruleForm.cover=data.data.cover
                        this.ruleForm.desc=data.data.desc
                        this.ruleForm.isEvaluate=data.data.isEvaluate
                        this.ruleForm.isRelevanceGrade=data.data.isRelevanceGrade
                        this.ruleForm.sortNo=data.data.sortNo
                    }
                }).catch(() => {
                })
        },
        mixins: [mixin],
       methods:{
            campusPatrolSetupTermEidt() {
                this.$router.push({
                    path: 'campusPatrolSetupTermEidt',
                    query: {
                        id: this.$route.query.id
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
