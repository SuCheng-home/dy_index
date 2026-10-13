<template>
    <div class="readingplatformsetup">
        <div class="el-row menu-tools">
            <el-button @click="$router.back()" size="medium">返回</el-button>
            <el-button type="primary" size="medium"   @click="insertOrUpdateReadPlatSysSets()">保存
            </el-button>
        </div>
        <div class="main-wrap">
            <el-form ref="ruleForm" :model="ruleForm" label-width="140px" class="demo-ruleForm">
              
                <el-form-item label="" prop="groupName">
                    <el-checkbox v-model="ruleForm.bookState" disabled>书库及任务库功能<span style="color:red">（默认勾选，不可取消）</span></el-checkbox>
                </el-form-item>
                 <el-form-item label="" prop="groupName">
                    <el-checkbox v-model="ruleForm.readRingState">阅读圈<span style="color:red">（默认勾选，可取消）</span></el-checkbox>
                </el-form-item>
                 <el-form-item label="" prop="groupName">
                    <el-checkbox v-model="ruleForm.pointsState" disabled>积分管理<span style="color:red">（默认勾选，不可取消）</span></el-checkbox>
                </el-form-item>
                 <el-form-item label="" prop="groupName">
                    <el-checkbox v-model="ruleForm.mapState">闯关地图<span style="color:red">（默认勾选，可取消）</span></el-checkbox>
                </el-form-item>
                 <el-form-item label="" prop="groupName">
                    <el-checkbox v-model="ruleForm.recommendState">阅读推荐</el-checkbox>
                </el-form-item>
                 <el-form-item label="" prop="groupName">
                    <el-checkbox v-model="ruleForm.borrowOrReturnState"> 借还书管理</el-checkbox>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import {insertOrUpdateReadPlatSysSet,getReadPlatSysSet} from '@/api/readingplatform';
    export default {
        data() {
            return {
                ruleForm: {
                    bookState:true,//	书库	number	
                    borrowOrReturnState:false,//	借还	number	
                    mapState:false,	//地图	number	
                    pointsState:true,//	积分	number	
                    readRingState:false,//	班级圈	number	
                    recommendState:false//推荐	number
                },
            }
        },
        created() {
            this.getReadPlatSysSets()
        },
        methods: {
            //获取详情
            getReadPlatSysSets() {
                getReadPlatSysSet().then(res => res.data)
                    .then(data => {
                        if (data.code === 200) {
                            let detailObject = data.data;
                             this.ruleForm.bookState = detailObject.bookState == 1 ? true : false;
                             this.ruleForm.borrowOrReturnState = detailObject.borrowOrReturnState == 1 ? true : false;
                             this.ruleForm.mapState = detailObject.mapState == 1 ? true : false;
                             this.ruleForm.pointsState = detailObject.pointsState == 1 ? true : false;
                             this.ruleForm.readRingState = detailObject.readRingState == 1 ? true : false;
                             this.ruleForm.recommendState = detailObject.recommendState == 1 ? true : false;
                        }
                    }).catch(() => {
                })
            },
            //保存
            insertOrUpdateReadPlatSysSets() {               
                let obj = {
                    bookState: this.ruleForm.bookState ? 1 : 0,
                    borrowOrReturnState: this.ruleForm.borrowOrReturnState ? 1 : 0,
                    mapState: this.ruleForm.mapState ? 1 : 0,
                    pointsState: this.ruleForm.pointsState ? 1 : 0,
                    readRingState: this.ruleForm.readRingState ? 1 : 0,
                    recommendState: this.ruleForm.recommendState ? 1 : 0
                };
                insertOrUpdateReadPlatSysSet(obj).then(res => res.data).then(data => {
                    if (data.code === 200) {
                        this.$message({message: '操作成功！', type: 'success'});
                        this.$router.back();
                    }
                }).catch(() => {
                })

            }
        }
    }
</script>
<style lang="scss" scoped>
    .readingplatformsetup {
        padding:12px;
        box-sizing: border-box;

        .menu-tools {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }
        .main-wrap {
            padding-top: 20px;
            padding-left: 20px;
            width: 810px;
            box-sizing: border-box;
            margin: 0 auto;
        }
    }
</style>


