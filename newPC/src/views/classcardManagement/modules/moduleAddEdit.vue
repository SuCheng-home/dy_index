<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button type="default" @click.native="$router.back()">返回</el-button>
            <el-button type="primary" @click.native="saveHandler">保存</el-button>
        </div>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <div class="form-container">
                <el-form ref="form" :model="formQuery" label-width="100px" :rules="formRules">
                    <el-form-item label="组件名称" prop="componentCode">
                        <el-select filterable v-if="!isEdit" v-model="formQuery.componentCode">
                            <el-option
                                v-for="componentItem in componentList"
                                :key="componentItem.code"
                                :label="componentItem.value"
                                :value="componentItem.code">
                            </el-option>
                        </el-select>
                        <span v-else>{{title}}</span>
                    </el-form-item>
                    <el-form-item label="组件类型" prop="componentType">
                        <el-radio-group v-model="formQuery.componentType">
                            <el-radio :label="1">班牌</el-radio>
                            <el-radio :label="2">校牌</el-radio>
                            <el-radio :label="3">区牌</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="组件大小" prop="sizeInfo">
                        <el-select v-if="!isEdit" v-model="formQuery.sizeInfo">
                            <el-option
                                v-for="sizeItem in sizeList"
                                :key="sizeItem.value"
                                :label="sizeItem.label"
                                :value="sizeItem.value">
                            </el-option>
                        </el-select>
                        <span v-else>{{size}}</span>
                    </el-form-item>
                    <el-form-item label="系统" prop="comSysType">
                        <el-select v-model="formQuery.comSysType">
                            <el-option
                                label="微校+"
                                :value="1">
                            </el-option>
                            <el-option
                                label="成长乐园"
                                :value="4">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="效果图" prop="cover">
                        <uploader pathPrefix="banpaiguanli" module="banpaiguanli" moduleCode="20181105" :extList="extList" v-model="formQuery.cover" showResult="image" showMode="image" :multiple="false"></uploader>
                    </el-form-item>
                    <el-form-item label="组件介绍" prop="introduce">
                        <el-input type="text" v-model="formQuery.introduce" :rows="4" :maxlength="20"></el-input>
                    </el-form-item>
                </el-form>
            </div>

        </div>
    </div>
</template>

<script>
    import {sizeList} from "../moduleSize";
    import {findDicsByCode} from '@/api/common/common';
    import {
        getClassCardComponent,
        addClassCardComponent,
        updateClassCardComponent
    } from '@/api/classcardManagement';
    import Uploader from '@/components/Uploader/WebUploader';
    import {mapGetters} from 'vuex';

    export default {
        name: "moduleAddEdit",
        data() {
            const coverValidator = (rule, value, callback) => {
                if (this.formQuery.cover.length === 0) {
                    callback(new Error('请上传效果图'));
                } else {
                    callback();
                }
            };

            return {
                isEdit: !!this.$route.query.id,
                id: this.$route.query.id,

                componentList: [],
                formQuery: {
                    componentType: 1,
                    componentCode: '',
                    sizeInfo: 1,
                    cover: [],
                    introduce: '',
                    comSysType: 1,
                },
                size: '',
                sizeList,
                title: '',
                formRules: {
                    componentType:[
                        { required: true, message: '请选择组件类型', trigger: 'blur' }
                    ],
                    componentCode: [
                        { required: true, message: '请选择组件名称', trigger: 'blur' }
                    ],
                    sizeInfo: [
                        { required: true, message: '请输入组件大小', trigger: 'blur' }
                    ],
                    cover: [
                        { required: true, message: '请上传效果图', trigger: 'blur', validator: coverValidator }
                    ],
                    introduce: [
                        { required: true, message: '请输入组件介绍', trigger: 'blur' }
                    ],
                    comSysType: [
                        { required: true, message: '请选择系统', trigger: 'blur' }
                    ]
                },
                extList: ['jpg', 'jpeg','bmp','gif', 'png']
            }
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        components: {Uploader},
        created() {
            findDicsByCode({
                dicCode: 'classcardComponent'
            })
                .then(res => res.data)
                .then(data => {
                    this.componentList = data.data;
                    if(this.isEdit) {
                        getClassCardComponent({
                            componentId: this.id
                        })
                            .then(res => res.data)
                            .then(data => {
                                const pageData = data.data;

                                const formQuery = {
                                    componentCode: pageData.componentCode,
                                    sizeInfo: pageData.sizeInfo,
                                    introduce: pageData.introduce,
                                    componentType: pageData.componentType,
                                    cover: [{
                                        fileUrl: pageData.cover
                                    }],
                                    comSysType: pageData.comSysType
                                };
                                this.title = this.componentList.find(({code}) => code == pageData.componentCode).value;
                                this.size = this.sizeList.find(({value}) => value == pageData.sizeInfo).label;
                                this.formQuery = formQuery;
                            });
                    } else {
                        if(data.data.length !== 0) {
                            this.formQuery.componentCode = data.data[0].code;
                        }
                    }
                });

        },
        methods: {
            saveHandler() {
                this.$refs.form.validate((valid) => {
                    if(valid) {
                        if(!this.isEdit) {
                            addClassCardComponent({
                                title: this.componentList.find(({code}) => code === this.formQuery.componentCode).value,
                                sizeInfo: this.formQuery.sizeInfo,
                                introduce: this.formQuery.introduce,
                                cover: this.formQuery.cover[0].fileUrl,
                                componentCode: this.formQuery.componentCode,
                                componentType: this.formQuery.componentType,
                                comSysType: this.formQuery.comSysType
                            })
                                .then(res => res.data)
                                .then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '新增成功',
                                            type: 'success',
                                            duration: 1000,
                                            onClose:() => {
                                                this.$router.back();
                                            }
                                        });
                                    }
                                })
                        } else {
                            updateClassCardComponent({
                                componentType: this.formQuery.componentType,
                                title: this.componentList.find(({code}) => code === this.formQuery.componentCode).value,
                                introduce: this.formQuery.introduce,
                                cover: this.formQuery.cover[0].fileUrl,
                                id: this.id,
                                comSysType: this.formQuery.comSysType
                            })
                                .then(res => res.data)
                                .then(data => {
                                    if(data.result) {
                                        this.$message({
                                            message: '修改成功',
                                            type: 'success',
                                            duration: 1000,
                                            onClose:() => {
                                                this.$router.back();
                                            }
                                        });
                                    }
                                })
                        }

                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .form-container {
        width: 810px;
        margin: 10px auto;
    }
</style>
