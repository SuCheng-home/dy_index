<template>
    <div class="app-container calendar-list-container">
        <back-tool>
            <el-button class="filter-item" size="medium" type="primary" @click="submitFunc()"
                       :loading="listLoading">保存
            </el-button>
        </back-tool>
        <div style="padding-top:20px;">
            <el-form :model="formData" :rules="rules" ref="formData" label-position="right" label-width="140px"
                     style="width:810px;margin: 0 auto;">
                <el-form-item label="课程Logo">
                    <img v-if="isNS && isEdit && logoUrl.length !== 0" :src="logoUrl[0].fileUrl" style="width:50px;height:50px;vertical-align: middle;" />
                    <uploader v-else ref="coverUploader" pathPrefix="kechengshezhi" module="" moduleCode="" useSysBucket
                              :extList="['bmp', 'png', 'jpg', 'jpeg', 'gif','svg']" showResult="image" openDelete
                              showMode="button" v-model="logoUrl"></uploader>
                </el-form-item>
                <el-form-item label="课程名称" prop="name">
                    <span v-if="isEdit">{{formData.name}}</span>
                    <el-input v-else v-model="formData.name" :maxlength="50" placeholder="请输入课程名称"
                              @blur="formData.name = formData.name.trim()"></el-input>
                </el-form-item>
                <el-form-item label="课程简称" prop="otherName">
                    <el-input class="inputNick" v-model="formData.otherName" :maxlength="50"
                              @blur="formData.otherName = formData.otherName.trim()"></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="order">
                    <el-input-number v-model="formData.order" :min="1" :max="5000" label="排序"></el-input-number>
                </el-form-item>
                 <el-form-item label="课时系数" prop="classHourFactor">
                    <el-input-number v-model="formData.classHourFactor" :min="0" :precision="1" :max="9.9" label="课时系数"></el-input-number>
                </el-form-item>
                <el-form-item v-if="isEdit" label="课程编码" prop="code">
                    <span>{{formData.code}}</span>
                </el-form-item>
                <el-form-item label="课程类型" prop="isMain">
                    <span v-if="isNS && isEdit">{{['', '综合学科', '主学科', '校本学科', '其他'][formData.isMain]}}</span>
                    <el-select v-else size="medium" v-model="formData.isMain" placeholder="请选择">
                        <el-option :value="2" label="主学科"></el-option>
                        <el-option :value="1" label="综合学科"></el-option>
                        <el-option :value="3" label="校本学科"></el-option>
                        <el-option :value="4" label="其他"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学段" prop="level">
                    <span v-if="isNS && isEdit">
                        {{formData.level == 0 ? '未知' : parseToConstants(formData.level, 'schoolTypeConstants')}}
                    </span>
                    <el-select v-else size="medium" v-model="formData.level" placeholder="请选择">
                        <el-option :value="0" label="其他"></el-option>
                        <el-option :value="1" label="幼儿园"></el-option>
                        <el-option :value="2" label="小学"></el-option>
                        <el-option :value="3" label="初中"></el-option>
                        <el-option :value="4" label="高中"></el-option>
                        <el-option :value="7" label="大中专"></el-option>
                        <el-option :value="10" label="特殊教育"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="考试类型" prop="examType">
                    <span v-if="isNS && isEdit">{{['不明', '考试', '考查'][formData.examType]}}</span>
                    <el-select v-else size="medium" v-model="formData.examType" placeholder="请选择">
                        <el-option :value="1" label="考试"></el-option>
                        <el-option :value="2" label="考查"></el-option>
                    </el-select>
                </el-form-item>

            </el-form>
        </div>

    </div>

</template>

<script>
    import Uploader from '@/components/Uploader/WebUploader';
    import BackTool from '@/components/BackTool';
    import {curriculumSettingUpdate, curriculumSettingDetail, curriculumSettingAdd} from '@/api/systemSet/courseSet';
    import {parseToConstants} from '@/utils/utils';
    import {mapGetters} from 'vuex';

    export default {
        components: {
            BackTool,
            Uploader
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        data() {
            return {
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,
                isNS: this.$route.query.isNS == 1,
                // isNS: true,

                listLoading: false,
                logoUrl: [],
                formData: {
                    name: '',
                    otherName: '',
                    code: '',
                    isMain: 2,
                    level: '',
                    examType: 1,
                    order: 1,
                    classHourFactor:1
                },
                rules: {
                    name: [
                        {required: true, message: '请输入课程名', trigger: 'blur'},
                    ],
                    otherName: [
                        {required: true, message: '请输入课程简称', trigger: 'blur'},
                    ],
                    code: [
                        {required: true, message: '请输入课程编码', trigger: 'blur'},
                    ],
                    isMain: [
                        {required: true, message: '请选择学科类型', trigger: 'blur'},
                    ],
                    level: [
                        {required: true, message: '请选择学段', trigger: 'blur'},
                    ],
                    examType: [
                        {required: true, message: '请选择考试类型', trigger: 'blur'},
                    ],
                    order: [
                        {required: true, message: '请输入排序', trigger: 'blur'},
                    ],
                    classHourFactor: [
                        {required: true, message: '请输入课时系数', trigger: 'blur'},
                    ],
                }
            }
        },
        created() {
            if(this.isEdit) {
                curriculumSettingDetail({
                    id: this.id
                }).then(res => {
                    let data = res.data;
                    if (data.result) {
                        this.formData = data.data;
                        if(data.data.logoUrl) {
                            this.logoUrl = [{
                                fileUrl: data.data.logoUrl
                            }];
                        }
                    }
                });
            } else {
                this.formData.level = this.schoolInfo.type;
            }

        },
        methods: {
            parseToConstants,
            goback() {
                this.$router.back();
            },
            submitFunc() {
                this.$refs.formData.validate((valid) => {
                    if (valid) {
                        this.listLoading = true;
                        let args = {
                            id: this.id,
                            examType: this.formData.examType,
                            isMain: this.formData.isMain,
                            level: this.formData.level,
                            logoUrl: this.logoUrl && this.logoUrl.length !== 0 ? this.logoUrl[0].fileUrl : 'https://wxtestpb-10048617.image.myqcloud.com/70dde043-1baf-4c5e-9114-bfd1d41641ee?imageView2/q/100/w/800',
                            name: this.formData.name,
                            otherName: this.formData.otherName,
                            order: this.formData.order,
                            classHourFactor:this.formData.classHourFactor
                        };

                        new Promise(resolve => {
                            if(this.isEdit) {
                                curriculumSettingUpdate(args).then(resolve)
                            } else {
                                curriculumSettingAdd(args).then(resolve)
                            }
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success(`${this.isEdit ? '编辑' : '新增'}成功`);
                                    this.listLoading = false;
                                    this.goback();
                                } else {
                                    this.$message.error(data.msg);
                                    this.listLoading = false;
                                }
                            });

                    }

                })
            },

        }
    }
</script>

<style scoped="scoped">

    .inputNick {
        width: 100%;
    }
</style>
