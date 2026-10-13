<template>
    <div class="face_user_edit_wrap">
        <back-tool>
            <el-button type="primary" @click.native="faceSave" size="medium" :disabled="canSave">保存</el-button>
        </back-tool>
        <div style="margin-top: 50px;">
            <div class="body">
               <el-form label-width="140px" class="demo-ruleForm">
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
    import Uploader from '@/components/Uploader/WebUploader';
    import { getFaceUserByUserId, addOrUpdateFaceUser, getFaceUserManager, addOrUpdateFaceManager } from '@/api/faceManage';

    export default {
        name: 'faceManageUserEdit',
        components: {
            Uploader,
            BackTool
        },
        data() {
            return {
                canSave: false,
                facePic: [],
                allFileTypeList: ['png', 'jpg']
            }
        },
        created() {
            if (!!this.$route.query.isPersonal) {
                this.getFaceUserByUserId();
            } else {
                this.getFaceUserManager();
            }
        },
        methods: {
            getFaceUserByUserId() {
                getFaceUserByUserId(parseInt(this.$route.query.id)).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && data.imageUrl) {
                        this.facePic = [{
                            fileUrl: data.imageUrl,
                            fileName: ''
                        }];
                    }
                }).catch(() => {
                });
            },
            getFaceUserManager() {
                getFaceUserManager(parseInt(this.$route.query.id)).then(res => {
                    let data = res.data.data;
                    if (res.data.code === 200 && data.imageUrl) {
                        this.facePic = [{
                            fileUrl: data.imageUrl,
                            fileName: ''
                        }];
                    }
                }).catch(() => {
                });
            },
            faceSave() {
                if (!(this.facePic && this.facePic.length)) {
                    this.$message({
                        message: '请上传人脸照片!',
                        type: 'warning'
                    });
                    return;
                }
                let query = {
                    imageUrl: this.facePic[0].fileUrl,
                    userId: parseInt(this.$route.query.id)
                };
                this.canSave = true;
                if (!!this.$route.query.isPersonal) {
                    this.addOrUpdateFaceUser(query);
                } else {
                    this.addOrUpdateFaceManager(query);
                }
            },
            addOrUpdateFaceUser(query) {
                addOrUpdateFaceUser(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$router.back();
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
            },
            addOrUpdateFaceManager(query) {
                addOrUpdateFaceManager(query).then(res => {
                    if (res.data.code === 200) {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.$router.back();
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
    .face_user_edit_wrap{
        padding:12px;
    }
      .body{
        width:810px;
        margin:0 auto;
    }
</style>
