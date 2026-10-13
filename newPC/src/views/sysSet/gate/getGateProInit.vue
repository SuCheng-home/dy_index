<template>
    <div class="app-container calendar-list-container">
        <backtool>
            <el-button type="primary" @click.native="preservation()" size="medium">保存</el-button>
        </backtool>
        <div style="width:810px;margin:20px auto;">
            <el-form label-width="140px" class="demo-ruleForm">
                <el-form-item>
                    <div>
                        <el-checkbox v-model="sendStudentMessage"> 学生进出校提醒（提醒家长）</el-checkbox>
                    </div>
                    <div>
                        <el-checkbox v-model="sendTeacherMessage"> 老师进出校提醒（提醒自己）</el-checkbox>
                    </div>                   
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>
<script>
    import Backtool from "@/components/BackTool";
    import {getGateProInit,addAndUpdateGateProInit} from "@/api/getGateProInit";
    export default {
        components: {
            Backtool
        },
        data() {
            return {
                sendStudentMessage: false,
                sendTeacherMessage: false,
                
            };
        },
        created() {
            getGateProInit()
                .then(res => {
                    let data = res.data.data;
                    if(data){
                        this.sendStudentMessage=(data.sendStudentMessage==1);
                        this.sendTeacherMessage=(data.sendTeacherMessage==1);
                    }         
                    
                })
                .catch();
        },
        methods: {
            preservation() {           
                addAndUpdateGateProInit({sendStudentMessage:this.sendStudentMessage?1:2,sendTeacherMessage:this.sendTeacherMessage?1:2})
                    .then(res => {
                        let data = res.data;
                        if (data.code == 200) {
                            this.$message({
                                message: '保存成功！',
                                type: 'success'
                            });
                            this.$router.back();
                        }
                    })
                    .catch();
            }
        }
    };
</script>
