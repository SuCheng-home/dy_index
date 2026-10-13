<template>
    <div class="page">
        <back-tool>
            <el-button size="medium" type="primary" @click="saveClickHandler" :loading="isLoading">保存</el-button>
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
    import {getResourcesInfo, updateResources,getScancodeEquipmentListByType} from '@/api/resourceOrder';

    export default {
        data: function () {
            return {
                isLoading: false,
                rules: {
                    name: [
                        {required: true, message: '请输入类型名称', trigger: 'blur'},
                        {min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur'}
                    ]
                },
                formData: {
                    id: null,
                    isDelete: 1,
                    name: '',
                    remark: '',
                    resourceNo: null,
                    schoolId: null,
                    status: null,
                    typeId: null,
                    deviceSerial:"",
                    deviceJson:"",
                    equipmentid:"",
                    resoureNo:""
                },
                typelist:[],
            }
        },
        created() {
            getResourcesInfo(this.$route.query)
                .then(res => res.data)
                .then(data => {
                    if (data.result) {
                        this.formData.id = data.data.id;
                        this.formData.isDelete = data.data.isDelete;
                        this.formData.name = data.data.name;
                        this.formData.remark = data.data.remark;
                        this.formData.resoureNo = data.data.resoureNo;
                        this.formData.schoolId = data.data.schoolId;
                        this.formData.status = data.data.status;
                        this.formData.typeId = data.data.typeId;
                        this.formData.equipmentid =  (JSON.parse(data.data.deviceJson)).id;
                    }
                })
                .catch(error => {
                    this.$message.error(error);
                })
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
                        const
                            args = this.formData,
                            vm = this;
                        this.isLoading = true;
                        updateResources(args)
                            .then(res => res.data)
                            .then(data => {
                                vm.isLoading = false;
                                if (data.result) {
                                    vm.$message({
                                        message: '资源编辑成功',
                                        type: 'success'
                                    });
                                    setTimeout(() => {
                                        window.history.back();
                                    }, 500)
                                }else{
                                     vm.$message.error(data.msg);
                                }
                            })
                            .catch(error => {
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
        margin: 10px auto;
        width: 810px;
    }
     .el-select{
        width: 100%;
    }
</style>
