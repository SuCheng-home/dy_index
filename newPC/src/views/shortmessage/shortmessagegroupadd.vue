<template>
    <div class="shortmessageMassadd">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="addSmsMobileGroup()">保存</el-button>
        </div>
        <div class="body" :style="`height: ${maxH}px;`">
            <div class="from-box">
                <el-form :model="singleData" label-width="180px" :rules="singleRules" ref="single">
                    <el-form-item label="组名称" prop="groupName">
                      <el-input v-model.trim="singleData.groupName" placeholder="请输入组名称" :maxlength="30"></el-input>
                   </el-form-item>
                    <el-form-item label="手机号（每行一条）" prop="mobiles">
                        <el-input type="textarea" rows="8" v-model="singleData.mobiles"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
    import {addSmsMobileGroup,getSmsMobileGroupInfoById,editSmsMobileGroup} from "@/api/shortmessage";
    import baseMixin from "@/mixins/baseMixin";
    import mixin from "@/mixins/windowResize";
    export default {
        name: "statisticsIndex",
        data() {
            return {
                singleData: {
                    mobiles: '',
                    groupName:""
                },
                singleRules: {
                    mobiles: [{
                        required: true, message: '手机号不能为空', trigger: 'blur'
                    }],
                    groupName: [{required: true, message: "请输入组名称", trigger: "blur"}],
                },
            };
        },
        mixins: [baseMixin, mixin],
        created() {
            if(this.$route.query.id!=0){
                 getSmsMobileGroupInfoById(this.$route.query.id)
                    .then(res => res.data)
                    .then(data => {
                        this.singleData.groupName= data.data.groupName;
                        this.singleData.mobiles= JSON.parse(data.data.mobiles).join('\n');
                    })
            }
        },
        methods: {           
            addSmsMobileGroup() {
                 let phoneValid = true;
                if (this.singleData.mobiles) {
                    const phoneList = this.singleData.mobiles.split('\n');
                    phoneList.forEach(phone => {
                        if (!/^0?1[0-9]\d{9}$/.test(`${phone}`.trim())) {
                            phoneValid = false;
                            return false;
                        }
                    });
                }
                if (!phoneValid) {
                    this.$message({
                        type: 'error',
                        message: '手机号的格式存在不正确的'
                    });
                    return false;
                }
                this.$refs.single.validate((valid) => {
                    if (valid) {                       
                        const args = {
                            id:this.$route.query.id,
                            groupName: this.singleData.groupName,
                            mobiles:JSON.stringify(this.singleData.mobiles.split('\n'))                         
                        }
                        if(this.$route.query.id!=0){
                            editSmsMobileGroup(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message({
                                        message: '创建成功',
                                        type: 'success'
                                    });
                                    this.$router.back();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: data.msg
                                    });
                                }
                            });
                           
                        }else{
                            addSmsMobileGroup(args)
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message({
                                        message: '创建成功',
                                        type: 'success'
                                    });
                                    this.$router.back();
                                } else {
                                    this.$message({
                                        type: 'error',
                                        message: data.msg
                                    });
                                }
                            });
                        }                        
                    }
                });
            }
        }
    };
</script>

<style lang="scss" scoped>
    .shortmessageMassadd {
        padding: 12px;

        .top {
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .body {
            overflow: auto;

            .from-box {
                padding-top: 20px;
                width: 810px;
                margin: 0 auto;
            }
        }
    }
</style>
