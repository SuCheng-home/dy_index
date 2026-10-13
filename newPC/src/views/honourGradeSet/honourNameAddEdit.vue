<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="noticeAdd">
        <backtool>
            <el-button type="primary" size="medium" @click="submitHandler()">保存
            </el-button>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']" :style="{'height':nobottommaxH+'px'}"
             style="overflow: auto">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="荣誉名称" prop="honorName">
                        <el-input  v-model="ruleForm.honorName" placeholder="请输入荣誉名称" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item label="所属分类" prop="certTypeCode">
                        <el-select v-model="ruleForm.certTypeCode">
                            <el-option v-for="certItem in certTypeList" :value="certItem.typeCode1"
                                       :label="certItem.typeName"></el-option>
                        </el-select>

                    </el-form-item>
                    <el-form-item label="适用年级" prop="gradeLeaves">
                        <div>
                            <el-checkbox-group v-model="ruleForm.gradeLeaves">
                                <el-checkbox v-for="gradeItem in allGradeList" :label="`${gradeItem.level}`">
                                    {{gradeItem.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </el-form-item>
                    <el-form-item label="证书级别" prop="honorTypeId">
                        <el-select v-model="ruleForm.honorTypeId">
                            <el-option v-for="honorItem in allHonorList" :value="honorItem.honorTypeCode"
                                       :label="honorItem.honorTypeName"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="排序" prop="order">
                        <el-input-number v-model="ruleForm.orderNum" :min="0" :max="5000" label="排序"></el-input-number>
                    </el-form-item>
                    <el-form-item label="奖项及分值" prop="award">
                        <i type="primary" class="add-icon el-icon-circle-plus-outline" @click="addAwardItem"></i>
                        <div class="award-item" v-for="(awardItem, index) in ruleForm.awardList">
                            <el-select v-model="awardItem.id" @change="awardChangeHandler(index, $event)">
                                <el-option v-for="awardOptionItem in allAwardList" :value="awardOptionItem.id"
                                           :label="awardOptionItem.levelName"></el-option>
                            </el-select>
                            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <el-input-number v-model="awardItem.score" :min="1" :max="200" step-strictly
                                             label="上报名额"
                                             @blur="awardItem.score = awardItem.score || 1"></el-input-number>&nbsp;&nbsp;
                            <i class="fa fa-trash" @click="deleteAwardItem(index)"></i>
                        </div>
                    </el-form-item>

                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import Backtool from '@/components/BackTool';
    import Uploader from '@/components/Uploader/WebUploader';
    import mixin from '@/mixins/windowResize';
    import {querySchoolGrade} from '@/api/system';
    import {
        addSchoolHonorTitle,
        updateSchoolHonorTitle,
        findSchoolHonorTypeCertList,
        findSchoolHonorTypeList,
        listBySchoolId,
        getSchoolHonorTitle,
        listGradeLevel
    } from '@/api/honour/honourGradeSet';


    import {mapGetters} from 'vuex';

    export default {
        components: {
            Backtool,
            Uploader
        },
        computed: {
            ...mapGetters(['isStandalone', 'userInfo']),
        },
        data() {

            const awardValidator = (rule, value, callback) => {
                if (!this.ruleForm.awardList || this.ruleForm.awardList.length === 0) {
                    callback(new Error('请添加可申报奖项'));
                } else {
                    let isValid = true;
                    const awardIds = this.ruleForm.awardList.map(item => item.id);
                    awardIds.forEach((id, index) => {
                        if (awardIds.includes(id, index + 1)) {
                            isValid = false;
                        }
                    });
                    if (isValid) {
                        callback();
                    } else {
                        callback('不能重复添加奖项');
                    }
                }
            };

            const gradeLeavesValidator = (rule, value, callback) => {
                if (!this.ruleForm.gradeLeaves || this.ruleForm.gradeLeaves.length === 0) {
                    callback(new Error('请选择适用年级'));
                } else {
                    callback()
                }
            };

            return {
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,
                allAwardList: [],
                allHonorList: [],
                allGradeList: [],
                files: [],
                ruleForm: {
                    honorName: '',
                    certTypeCode: '',
                    gradeLeaves: [],
                    honorTypeId: '',
                    awardList: [],
                    honorList: [],
                    orderNum: 1
                },
                rules: {

                    honorName: [
                        {required: true, message: "请输入荣誉名称", trigger: "blur"},
                    ],
                    certTypeCode: [{
                        required: true, message: "请选择所属类型", trigger: "blur"
                    }
                    ],
                    honorTypeId: [{
                        required: true, message: "请选择适用级别", trigger: "blur"
                    }],
                    gradeLeaves: [{
                        required: true, validator: gradeLeavesValidator
                    }],
                    award: [{
                        required: true, validator: awardValidator
                    }],
                },
                certTypeList: [],
                schoolTimeId: '',
                schoolTimeName: ''
            };
        },
        mixins: [mixin],
        created() {
           
            listGradeLevel()
                .then(res => res.data)
                .then(data => {
                    this.allGradeList = data.data;
                });
            findSchoolHonorTypeCertList()
                .then(res => res.data)
                .then(data => {
                    this.certTypeList = data.data;
                    if (!this.isEdit && data.data && data.data.length !== 0) {
                        this.ruleForm.certTypeCode = data.data[0].typeCode1;
                    }
                });
            findSchoolHonorTypeList()
                .then(res => res.data)
                .then(data => {
                    this.allHonorList = data.data;
                    if (!this.isEdit && data.data && data.data.length !== 0) {
                        this.ruleForm.honorTypeId = data.data[0].honorTypeCode;
                    }
                });
            listBySchoolId()
                .then(res => res.data)
                .then(data => {
                    this.allAwardList = data.data;
                     if(this.isEdit) {
                getSchoolHonorTitle({
                    titleId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        pageData.gradeLeaves = pageData.gradeLeaves.split(',');
                        let mylist= JSON.parse(pageData.awardLevelJson);
                        for(let i=0;i<mylist.length;i++){
                            for(let j=0;j<this.allAwardList.length;j++){
                                if(mylist[i].id==this.allAwardList[j].id){
                                    mylist[i].levelName=this.allAwardList[j].levelName
                                }
                            }
                        }
                        pageData.awardList = mylist;
                        this.ruleForm = data.data;
                        this.schoolTimeId = data.data.schoolTimeId;
                        this.schoolTimeName = data.data.schoolTimeName;
                    })
            }
                });
        },
        methods: {
            submitHandler() {
                this.$refs.ruleForm.validate(isValid => {
                    if (isValid) {
                        const certTypeObj = this.certTypeList.find(item => item.typeCode1 == this.ruleForm.certTypeCode);
                        const honorTypeObj = this.allHonorList.find(item => item.honorTypeCode == this.ruleForm.honorTypeId);
                        const gradeLeaveName = [];
                        this.allGradeList.forEach(item => {
                            if(this.ruleForm.gradeLeaves.includes(`${item.level}`)) {
                                gradeLeaveName.push(item.name);
                            }
                        });
                        if(certTypeObj && honorTypeObj) {
                            const args = {
                                awardLevelJson: this.ruleForm.awardList,
                                certTypeCode: certTypeObj.typeCode1,
                                certTypeId: certTypeObj.id,
                                certType: certTypeObj.typeName,
                                gradeLeaveName: gradeLeaveName.join(','),
                                gradeLeaves: this.ruleForm.gradeLeaves.join(','),
                                honorName: this.ruleForm.honorName,
                                honorTypeId: honorTypeObj.honorTypeCode,
                                honorTypeName: honorTypeObj.honorTypeName,
                                orderNum: this.ruleForm.orderNum
                            };
                            new Promise(resolve => {
                                if(this.isEdit) {
                                    args.id = this.id;
                                    args.schoolTimeId = this.schoolTimeId;
                                    args.schoolTimeName = this.schoolTimeName;
                                    updateSchoolHonorTitle(args)
                                        .then(res => res.data)
                                        .then(resolve)
                                } else {
                                    addSchoolHonorTitle(args)
                                        .then(res => res.data)
                                        .then(resolve)
                                }
                            })
                                .then(data => {
                                    if(data.result) {
                                        this.$message.success(`${this.isEdit ? '编辑' : '新增'}成功`);
                                        window.setTimeout(() => {
                                            this.$router.back();
                                        }, 1000);
                                    } else {
                                        this.$message.error(data.msg);
                                    }
                                })
                        }

                    }
                })
            },
            awardChangeHandler(index, awardId) {
                const awardObj = JSON.parse(JSON.stringify(this.allAwardList.find(item => item.id == awardId)));
                this.ruleForm.awardList = [...this.ruleForm.awardList.slice(0, index), {
                    id: awardObj.id,
                    levelName: awardObj.levelName,
                    score: 1
                }, ...this.ruleForm.awardList.slice(index + 1)];

            },
            deleteAwardItem(index) {
                this.ruleForm.awardList = [...this.ruleForm.awardList.slice(0, index), ...this.ruleForm.awardList.slice(index + 1)];
            },
            addAwardItem() {
                if (this.allAwardList && this.allAwardList.length !== 0) {
                    const awardObj = JSON.parse(JSON.stringify(this.allAwardList[0]));
                    this.ruleForm.awardList = [...this.ruleForm.awardList, {
                        id: awardObj.id,
                        levelName: awardObj.levelName,
                        score: 1
                    }];
                }

            }
        }
    }
</script>
<style scoped lang="scss">
    @import "../../styles/mixin";


    .award-item {
        margin-bottom: 10px;
    }

    .fa-trash {
        color: #F08080;
        cursor: pointer;
    }

    .condition-item {
        float: left;
        width: 50%;
        box-sizing: border-box;
        padding: 10px;
    }

    .condition-item__name {
        width: 6em;
        text-align: right;
    }

    .condition-item > * {
        display: inline-block;
        vertical-align: top;
    }

    .section {
        border: 1px solid #ddd;
        padding: 10px 10px 0 10px;
        margin-bottom: 22px;
    }

    .section-title__sub {
        font-weight: bold;
    }

    .section-label {
        display: inline-block;
        width: 8em;
        margin-right: 5px;
        text-align: right;
    }

    .course-list {
        display: inline-block;
        vertical-align: top;
    }

    .condition-list-container {
        clear: both;
    }

    .add-icon {
        font-size: 20px;
        cursor: pointer;
        color: #409EFF;
    }
</style>
