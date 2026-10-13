<template>
    <div style="padding:12px;">
        <back-tool>
            <el-button type="primary" @click.native="faceSave" :disabled="canSave" size="medium">保存</el-button>
        </back-tool>
        <div style="padding-top: 30px;">
            <div class="body">
                <el-form label-width="140px" class="demo-ruleForm">
                <el-form-item label="用户类型" prop="userType">
                            <el-radio-group v-model="userType">
                                <el-radio :label="'1'">老师</el-radio>
                                <el-radio :label="'2'">学生</el-radio>
                                <el-radio :label="'3'">家长</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="用户" prop="addressData">
                            <address-book v-model="addressData" :config="configData"></address-book>
                        </el-form-item>

                        <el-form-item label="照片" prop="facePic">
                            <uploader pathPrefix="renlian" module="renlian" moduleCode="20190509" useSysBucket :showMode="'image'" :showResult="'image'" :extList="allFileTypeList" v-model="facePic"></uploader>
                        </el-form-item>
            </el-form>

            </div>            
        </div>
    </div>
</template>

<script>
    import BackTool from '@/components/BackTool';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Uploader from '@/components/Uploader/WebUploader';
    import { addOrUpdateFaceManager } from '@/api/faceManage';

    export default {
        name: 'faceManageUserAdd',
        components: {
            AddressBook,
            Uploader,
            BackTool
        },
        data() {
            return {
                canSave: false,
                userType: '1',
                addressData: {},
                configData: {
                    title: '选择用户',
                    depart: { target: 'user', departType: 'all', userTypes: '1' },
                    SingleChose: true,
                    group: false
                },
                facePic: [],
                allFileTypeList: ['png', 'jpg']
            }
        },
        watch: {
            userType(typeNum) {
                this.addressData = {};
                this.configData = {
                    title: '选择用户',
                    depart: { target: 'user', departType: 'all', userTypes: typeNum },
                    SingleChose: true,
                    group: false
                };
            }
        },
        methods: {
            faceSave() {
                if (!(this.addressData && !!this.addressData.userJson && this.addressData.userJson.length)) {
                    this.$message({
                        message: '请选择用户!',
                        type: 'warning'
                    });
                    return;
                }
                if (!(this.facePic && this.facePic.length)) {
                    this.$message({
                        message: '请上传人脸照片!',
                        type: 'warning'
                    });
                    return;
                }

                let query = {
                    imageUrl: this.facePic[0].fileUrl,
                    userId: this.addressData.userJson[0].id
                };
                this.canSave = true;
                addOrUpdateFaceManager(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '添加成功',
                            type: 'success'
                        });
                        this.$router.push({path: 'faceManageIndex'});
                    } else {
                        this.$message({
                            message: res.data.msg,
                            type: 'error'
                        });
                    }
                    this.canSave = false;
                }).catch(() => {
                    this.canSave = false;
                });
            }
        }
    }
</script>

<style scoped>
    .pic_wrap .el-upload--picture-card {
        display: none;
    }
</style>

<style scoped>
    .body{
        width:810px;
        margin:0 auto;
    }
</style>
