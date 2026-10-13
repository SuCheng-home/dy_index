<template>
    <div class="page news-add-page">
        <back-tool>
            <el-button size="medium" type="primary" @click="saveHandler()">保存</el-button>
        </back-tool>
        <div class="main-wrap" :style="`height: ${notbmaxH -50}px;`">
            <div class="article-container">
                <el-form
                    :model="formData"
                    label-width="140px"
                    :rules="rules"
                    ref="form"
                >
                    <el-form-item label="书籍名称" prop="boolName">
                        <el-input v-model.trim="formData.boolName" placeholder="请输入书籍名称（1-20个字符）" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="书籍封面" prop="coverUrl">
                        <li class="image_view"  :style="`background-image: url(${formData.coverUrl})`"></li>            
                      </el-form-item>
                    <el-form-item label="书籍类型" prop="typeCode">
                       {{formData.typeName}}
                    </el-form-item>
                     <el-form-item label="附件">
                    <uploader pathPrefix="zizhuyuedu" module="zizhuyuedu" moduleCode="20210608" :multiple="true" :extList="allFileTypeList"
                              v-model="formData.fileJson"></uploader>
                </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Uploader from '@/components/Uploader/WebUploader';
    import mixin from '@/mixins/windowResize';
    import BackTool from '@/components/BackTool';
    import {updateReadIndependBookSch,getReadIndependBookSch} from '@/api/readBookBeiyou';  
    export default {
        components: {
            BackTool,
            Uploader
        },
        data: function () {
            return {
                id: this.$route.query.id,
                formData: {
                    boolName: '',
                    typeCode: '',
                    fileJson:[],
                    coverUrl:''
                },
                allFileTypeList: ['doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'pdf','mp4', '3gp', 'rmvb', 'rm', 'mov', 'avi', 'flv', 'mpeg', 'wmv','png', 'bmp', 'jpg', 'jpeg', 'gif','mp3','wma','mp2','flac','midi','ra','ape','aac','cda','mov'],
                rules: {
                    boolName: [{
                        required: true, message: '书籍名称不能为空', trigger: 'blur'
                    }],
                }
            }
        },
        created() {
            	getReadIndependBookSch(this.id)
				.then(res => res.data)
				.then(data => {
                    data.data.fileJson= data.data.fileJson?JSON.parse( data.data.fileJson):[];
					this.formData = data.data
				})
        },
        mixins:[mixin],

        methods: {
            saveHandler() {
                this.$refs.form.validate(isValid => {
                    if(isValid) {
                            updateReadIndependBookSch({
                                boolName: this.formData.boolName,
                                id: this.formData.id,
                                fileJson:this.formData.fileJson,
                            })
                                .then(res => res.data)
                                .then(data => {
                                    this.$message.success('编辑成功');
                                    setTimeout(() => {
                                        this.$router.back();
                                    }, 500);
                                })
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
	.image_view {
		width: 70px;
		height: 100px;
		background: no-repeat center center / cover;
		float: left;
		margin: 0 5px 5px 0;
	}
    .el-button+.el-button {
        margin-left: 0;
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
    .page{
        padding:12px;
    }
    .news-add-page {
        .image-hint {
            color: #ff4949;
        }
        .main-wrap{
            width:100%;
            padding-top:20px;
            padding-bottom:10px;
            overflow-x: hidden;
            overflow-y: auto;
            box-sizing: border-box;
            background: #fff;
        }
        .article-container {
            width: 810px;
            margin: 0 auto;
            font-size: 15px;
            line-height: 26px;
            color: #676A6C;
        }

        .logo-image {
            width: 180px;
            height: 100px;
        }

        .rich-editor {
            line-height: 1em;
        }
    }

    .logo-uploader {
        height: 216px;
    }
    .img-item {
        width: 160px;
        height: 200px;
        float: left;
        margin-right: 10px;
        margin-top: 10px;
        background-position: center center;
        background-size: cover;
        position: relative;
        border: 1px solid #d0d0d0;
    }

    .img-box-item-close {
        width: 36px;
        height: 36px;
        display: block;
        float: right;
        background-size: cover;
        background-position: center center;
        background-image: url(https://cdnfile-10043692.file.myqcloud.com/vuewxcep/common_img/wxcep_phone_close.png);
        cursor: pointer;
    }

    .upload-hint {
        width: 405px;
        height: 216px;
        border: 1px dashed #ccc;
        font-size: 60px;
        color: #ccc;
        line-height: 216px;
    }
    .custom-cover__radio {
        position: absolute;
        right: 25px;
        top: 2px;
    }

    .form-item--cover {
        vertical-align: middle;
    }

    .dialog-button-container {
        margin-top: 10px;
        text-align: right;
    }
    .campusFeesadd .my-ueditor-box{
        position: relative;
        width: 740px;
        float:right;

    }
</style>
<style scoped>
    .news-add-page .new-editor .el-form-item__error{
        left:-69px !important;
    }
</style>
