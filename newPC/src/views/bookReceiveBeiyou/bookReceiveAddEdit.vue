<template>
    <div class="page news-add-page">
        <back-tool>
            <el-button size="medium" type="primary" @click="saveHandler()">保存</el-button>
        </back-tool>
        <div class="main-wrap" :style="`height: ${nobottommaxH}px;`">
            <div class="article-container">
                <el-form
                    :model="formData"
                    label-width="140px"
                    :rules="rules"
                    ref="form"
                >
                    <el-form-item label="类型" prop="typeId">
                        <el-select v-model="formData.typeId" size="medium" placeholder="请选择班级">
                            <el-option
                                v-for="item in typeList"
                                :key="item.id"
                                :label="item.typeName"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="名称" prop="bookName">
                        <el-input v-model="formData.bookName" :maxlength="20" placeholder="请输入名称"
                                  @blur="formData.bookName = formData.bookName.trim()"></el-input>
                    </el-form-item>
                    <el-form-item label="持有人" prop="receiveType">
                        <el-radio-group v-model="formData.receiveType">
                            <el-radio :label="1">个人</el-radio>
                            <el-radio :label="2">班级</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-if="formData.receiveType == 2" label="持有班级" prop="classId">
                        <el-select v-model="formData.classId" size="medium" placeholder="请选择班级">
                            <el-option
                                v-for="item in classList"
                                :key="item.id"
                                :label="item.name"
                                :value="item.id"
                            >
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="数量" prop="bookCount">
                        <el-input v-model="formData.bookCount" :maxlength="2"></el-input>
                    </el-form-item>
                    <el-form-item label="单价" prop="bookPrice">
                        <el-input v-model="formData.bookPrice" :maxlength="20"></el-input>
                    </el-form-item>
                    <el-form-item label="购买/领取日期" prop="receiveDate">
                        <el-date-picker format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd" v-model="formData.receiveDate"></el-date-picker>
                    </el-form-item>
                    <el-form-item label="图片" prop="pic">
                        <uploader :disabled="files.length >= 5" multiple v-model="files" pathPrefix="tushulingyong"
                                  moduleCode="20210720" module="tushulingyong"
                                  :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif']" :showMode="'image'" :showResult="'image'"
                        ></uploader>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input v-model="formData.remark" :maxlength="50"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Uploader from '@/components/Uploader/WebUploader';
    import mixin from '@/mixins/windowResize';
    import moment from 'moment';
    import BackTool from '@/components/BackTool';
    import {getSimpleRule} from '@/utils/validate';
    import {
        getBookTypeBySchoolId,
        insertBookReceiveRecord,
        editBookReceiveRecord,
        getBookReceiveRecordById
    } from '@/api/bookReceiveBeiyou';
    import {
        queryDepartListTerm,
    } from '@/api/common/common';

    export default {
        components: {
            BackTool,
            Uploader
        },
        data() {
            const imageValidator = (rule, value, callback) => {
                if (this.files.length === 0) {
                    callback(new Error('分区背景图不能为空'));
                } else {
                    callback();
                }
            };
            return {
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,
                files: [],
                typeList: [],
                formData: {
                    typeId: '',
                    bookName: '',
                    receiveType: 1,
                    bookCount: '',
                    bookPrice: '',
                    receiveDate: moment().format('YYYY-MM-DD'),
                    classId: '',
                    remark: ''
                },
                classList: [],
                rules: {
                    typeId: getSimpleRule('类型', false),
                    bookName: getSimpleRule('名称', false),
                    receiveType: getSimpleRule('持有人', false),
                    bookCount: getSimpleRule('数量', false, 'unsignedInteger'),
                    bookPrice: getSimpleRule('单价', false, 'unsignedFloat'),
                    receiveDate: getSimpleRule('购买/领取日期', false),
                    pic: [{
                        required: true, validator: imageValidator
                    }],
                    classId: getSimpleRule('持有班级', false),
                }
            }
        },
        mounted() {
            if (this.isEdit) {
                getBookReceiveRecordById({
                    id: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        if (pageData.classId == 0) {
                            pageData.classId = '';
                        }
                        pageData.bookPrice = pageData.bookPrice / 100;
                        this.files = JSON.parse(pageData.picJson).map(item => ({
                            fileUrl: item
                        }));
                        this.formData = data.data;
                        queryDepartListTerm({
                            all: false,
                            currentTerm: true,
                            manager: false,
                            notlimit: false,
                            submanager: false,
                            teacher: true,
                            uid: pageData.createId
                        })
                            .then(res => res.data)
                            .then(data => {
                                let classList = [];
                                data.data.forEach(item => {
                                    if (item.childList) {
                                        classList = [...classList, ...item.childList];
                                    }
                                });
                                this.classList = classList;
                            });
                    })
            } else {
                queryDepartListTerm({
                    all: false,
                    currentTerm: true,
                    manager: false,
                    notlimit: false,
                    submanager: false,
                    teacher: true,
                })
                    .then(res => res.data)
                    .then(data => {
                        let classList = [];
                        data.data.forEach(item => {
                            if (item.childList) {
                                classList = [...classList, ...item.childList];
                            }
                        });
                        this.classList = classList;
                        if (classList.length !== 0) {
                            this.formData.classId = classList[0].id;
                        }
                    });
            }

            getBookTypeBySchoolId()
                .then(res => res.data)
                .then(data => {
                    this.typeList = data.data;
                    if (data.data.length !== 0 && !this.isEdit) {
                        this.formData.typeId = `${data.data[0].id}`;
                    }
                })
        },
        mixins: [mixin],

        methods: {
            saveHandler() {
                this.$refs.form.validate(isValid => {
                    if (isValid) {
                        const args = {
                            bookCount: this.formData.bookCount,
                            bookName: this.formData.bookName,
                            bookPrice: Number.parseFloat(this.formData.bookPrice) * 100,
                            receiveDate: this.formData.receiveDate,
                            receiveType: this.formData.receiveType,
                            remark: this.formData.remark
                        };
                        args.typeId = this.formData.typeId;
                        const typeObj = this.typeList.find(item => item.id == this.formData.typeId);
                        if (typeObj) {
                            args.typeName = typeObj.typeName;
                        } else {
                            args.typeName = '';
                        }
                        args.picJson = JSON.stringify(this.files.map(item => item.fileUrl));
                        const totalPrice = Math.floor(Number.parseFloat(this.formData.bookPrice) * Number.parseInt(this.formData.bookCount) * 100);
                        args.totalPrice = totalPrice;
                        if (this.formData.receiveType == 2) {
                            args.classId = this.formData.classId;
                            const classObj = this.classList.find(item => item.id == this.formData.classId);
                            if (classObj) {
                                args.className = classObj.name;
                            } else {
                                args.className = '';

                            }
                        } else {
                            args.classId = 0;
                            args.className = '';
                        }
                        new Promise(resolve => {
                            if (this.isEdit) {
                                args.id = this.id;
                                editBookReceiveRecord(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            } else {
                                insertBookReceiveRecord(args)
                                    .then(res => res.data)
                                    .then(resolve)
                            }

                        })
                            .then((data) => {
                                if (data.result) {
                                    this.$message.success(`${this.isEdit ? '编辑' : '新增'}成功`);
                                    this.$router.back();
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })

                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .el-button + .el-button {
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

    .page {
        padding: 12px;
    }

    .news-add-page {
        .image-hint {
            color: #ff4949;
        }

        .main-wrap {
            width: 100%;
            padding-top: 20px;
            padding-bottom: 10px;
            overflow-x: hidden;
            overflow-y: auto;
            box-sizing: border-box;
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

    .campusFeesadd .my-ueditor-box {
        position: relative;
        width: 740px;
        float: right;

    }
</style>
<style scoped>
    .news-add-page .new-editor .el-form-item__error {
        left: -69px !important;
    }
</style>
