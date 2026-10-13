<template>
    <div class="page">
        <back-tool>
            <el-button type="primary" size="medium" @click="saveClickHandler" :disabled="isButtonDisabled" :loading="isLoading">保存
            </el-button>
        </back-tool>
        <div class="form-container">
            <el-form :model="formData" label-width="140px" :rules="rules" ref="form">
                <el-form-item label="资源名称" prop="name">
                    <el-input v-model.trim="formData.name" placeholder="类型名称(1-10个字符)"></el-input>
                </el-form-item>
                <el-form-item label="资源状态">
                    <el-select v-model="formData.status" placeholder="">
                        <el-option label="可用" :value="1"></el-option>
                        <el-option label="维护中" :value="2"></el-option>
                        <el-option label="损坏" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="设备">
                    <el-select v-model="formData.equipmentid" placeholder="请选择设备">
                        <el-option v-for="item in typelist" :label="item.equipmentName" :key="item.id"  :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="序号">
                    <el-input-number v-model="formData.resoureNo" :min="1" :max="100000"></el-input-number>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import {addResources,getScancodeEquipmentListByType} from '@/api/resourceOrder';

    export default {
        data: function () {
            return {
                formData: {
                    name: '',
                    remark: '',
                    resoureNo: 1,
                    status: 1,
                    typeId: this.$route.query.typeId,
                    deviceSerial:"",
                    deviceJson:"",
                    equipmentid:""
                },
                isLoading: false,
                isButtonDisabled: false,
                typelist:[],
                rules: {
                    name: [
                        {required: true, message: '请输入类型名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ]
                },
            }
        },
        created() {
            getScancodeEquipmentListByType(this.$route.query)
                .then(res => res.data)
                .then(data => {
                    this.typelist=data.data;
                })
                .catch(error => {
                    this.$message.error(error);
                })

        },
        methods: {
            saveClickHandler() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if(this.formData.equipmentid){
                            let myobj={
                                equipType:'',
                                equipTypeName:"",
                                equipmentId:"",
                                id:"",
                                equipmentName:"",
                            }
                            for(let i=0;i<this.typelist.length;i++){
                                if(this.formData.equipmentid==this.typelist[i].id){
                                    myobj.equipType=this.typelist[i].equipType;
                                    myobj.equipTypeName=this.typelist[i].equipTypeName;
                                    myobj.equipmentId=this.typelist[i].equipmentId;
                                    myobj.id=this.typelist[i].id;
                                    myobj.equipmentName=this.typelist[i].equipmentName;
                                    this.formData.deviceSerial=this.typelist[i].equipmentId;
                                    this.formData.deviceJson=JSON.stringify(myobj);
                                }
                            }

                        }
                        const args = this.formData,
                              vm = this;
                        this.isLoading = true;
                        this.isButtonDisabled = true;
                        addResources(args)
                            .then(res => res.data)
                            .then(data => {
                                vm.isLoading = false;
                                if (data.result) {
                                    vm.$message({
                                        message: '资源添加成功',
                                        type: 'success'
                                    });
                                    setTimeout(() => {
                                        window.history.back();
                                    }, 500)
                                }else{
                                     vm.$message.error(data.msg);
                                }
                            })
                            .catch(() => {
                                vm.isButtonDisabled = false;
                                vm.isLoading = false;
                                vm.$message.error('error');
                            })
                    }
                });
            }
        },
        components: {
            BackTool
        }
    }
</script>

<style scoped>
    .page {
        padding:12px;
    }

    .form-container {
        width: 810px;
        margin: 10px auto;
    }
    .el-select{
        width: 100%;
    }
</style>
