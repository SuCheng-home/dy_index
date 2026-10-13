<template>
    <div class="indicatoradd">
        <div class="el-row">
            <div class="top">
                <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
                <el-button size="medium" type="primary" @click.native="addPeanutScale()">保存</el-button>
            </div>
        </div>
        <div class="main-wrap scrollBar" :style="{'height':boxH-210+'px'}">
            <el-form :model="ruleForm" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                <el-form-item label="模块" class="is-required">
                    <el-select v-model="ruleForm.moduleType" :disabled="id">
                            <el-option  :value="1"  label="德育评价"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="分类" class="is-required">
                    <el-select v-model="ruleForm.dimensionId" :disabled="id">
                            <el-option v-for="certItem in  dimensionList" :value="certItem.id" :key="certItem.id" :label="certItem.dimensionName"></el-option>
                        </el-select>
                </el-form-item>
                <el-form-item label="五育指标" class="is-required">
                    <el-select v-model="ruleForm.indicatorId" :disabled="id">
                            <el-option v-for="certItem in indicatorList" :value="certItem.id" :key="certItem.id" :label="certItem.title"></el-option>
                        </el-select>
                </el-form-item>
                 <el-form-item label="兑换比例" class="is-required">
                    <el-input-number v-model.trim="ruleForm.scale" step-strictly controls-position="right" :min="1" :max="99999" :step="1"></el-input-number>&nbsp;&nbsp;：1
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {getPeanutScale,updatePeanutScale,addPeanutScale,getPeanutIndicatorList,getSchoolConductDimensionList} from '@/api/fiveEducationSetup';
    import mixin from '@/mixins/windowResize';
    export default {
        data() {
            return {
                id: this.$route.query.id||0,
                ruleForm: {
                    dimensionId:"",//	维度ID	number	
                    dimensionName:"",//		维度名称	string	
                    indicatorId:"",//		指标id	number	
                    indicatorName:"",//		指标名称	string	
                    moduleType:1,//		模块类型	number	
                    scale:1,//		比例	number
                },
                indicatorList:[],
                dimensionList:[]
            }
        },
        created() {
              getSchoolConductDimensionList()
                    .then(res => res.data)
                    .then(data => {
                        this.dimensionList = data.data;
                    });
             getPeanutIndicatorList({
                    title: '',
                    type: 1
                }).then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            this.indicatorList = data.data;
                        }
                    }).catch(() => {
                })
            if(this.id){
                this.getPeanutScale()
            }
        },
        mixins: [mixin],
        methods: {
            getPeanutScale() {
                getPeanutScale(this.id).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let totalArray = data.data;
                        this.ruleForm = totalArray;
                    }

                })
            },
            addPeanutScale() {
                if (!this.ruleForm.dimensionId) {
                    this.$alert('请选择分类！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }    
                if (!this.ruleForm.indicatorId) {
                    this.$alert('请选择五育指标！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }   
                 if (!this.ruleForm.scale) {
                    this.$alert('请输入兑换比例！', '提示', {
                        type: 'error'
                    }, {
                        confirmButtonText: '确定'
                    });
                    return false;
                }    
               let query=JSON.parse(JSON.stringify(this.ruleForm))
                query.dimensionName=(this.dimensionList.find(item => item.id == this.ruleForm.dimensionId)).dimensionName
                query.indicatorName=(this.indicatorList.find(item => item.id == this.ruleForm.indicatorId)).title
                if(this.id){
                  query.id=this.id
                  updatePeanutScale(query).then(res => {
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
                    addPeanutScale(query).then(res => {
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
           
        }
    }
</script>
<style lang="scss" scoped>
    .indicatoradd{
        padding:12px;
         .top {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
    }
    .el-form{
        width:810px;
        margin:10px auto;
    }
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
