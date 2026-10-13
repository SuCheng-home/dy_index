<!--添加通知-->
<template>
    <div class="app-container calendar-list-container" id="evTeaAddEdit">
        <backtool>
            <template v-if="state != 1">
                <el-button type="primary" size="medium" @click="jumpToPage('evTeaProg', {id, batchTitle})">查看进度
                </el-button>
                <el-button type="primary" size="medium" @click="republishHandler()" v-if="isShowByPermission('/evaluateTw/evaluateTwMangerYoung')">补发
                </el-button>
                <el-button type="primary" size="medium" @click="toCurrAccounting">查看统计
                </el-button>
            </template>
        </backtool>
        <div :class="['page-main']" :style="{'height':(nobottommaxH)+'px'}" style="overflow: auto">
            <div class="main-container">
                <div class="main-container__left">
                    <div class="title">{{batchTitle}}</div>
                    <div class="end-date">截止日期: {{deadline | trimTimeMinute}}<i class="el-icon-edit" v-if="isShowByPermission('/evaluateTw/evaluateTwMangerYoung')" @click="jumpToPage('evTeaAddEdit', {id})"></i></div>
                    <div class="batchDesc" v-html="batchDesc"></div>
                    <div class="pic-container" v-if="pics !== null && pics.length !== 0">
                        <image-previewer tag="richtext" viewclass="image_view" :images="pics">
                            <ul>
                                <li class="pic image_view" v-for="(picItem, index) in pics"
                                    :style="`background-image: url(${picItem.fileUrl})`"
                                    :key="index">
                                </li>
                            </ul>
                        </image-previewer>
                    </div>
                </div>
                <div class="main-container__right">
                    <div class="section">
                        <div class="section__title">发布范围</div>
                        <div class="publish-range">
                            <div class="scope-item" v-for="scopeItem in stuScopeText">{{scopeItem}}</div>
                        </div>
                    </div>
                    <div class="section" v-if="templateList && templateList.length !== 0">
                        <div class="section__title">
                            主班/副班模板
                        </div>
                        <div class="template-list">
                            <div class="link-type template-item" v-for="templateItem in templateList" @click="toDetailPage(templateItem.tempType, {batchId: id, id: templateItem.id, isFromBatch: 1, state})">{{templateItem.tempTitle}}
                            </div>
                        </div>
                    </div>
                    <div class="section" v-if="classTemplateList && classTemplateList.length !== 0">
                        <div class="section__title">
                            班级模板
                        </div>
                        <div class="template-list">
                            <div class="link-type template-item" v-for="templateItem in classTemplateList" @click="toDetailPage(templateItem.tempType, {batchId: id, id: templateItem.id, isFromBatch: 1, state})">{{templateItem.tempTitle}}
                            </div>
                        </div>
                    </div>
                    <div class="section" v-if="files.length !== 0">
                        <div class="section__title">附件</div>
                        <div>
                            <file-list :isShowTitle="false" :fileList="files"></file-list>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <el-dialog title="补发" :visible.sync="isShowRepublishDialog" size="tiny" width="600px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <el-form :model="ruleForm" :rules="rules" ref="addTimeItemForm">
                <el-form-item label="发布范围" prop="stuScope">
                    <el-select v-model="ruleForm.stuScope" multiple>
                        <el-option v-for="classItem in classList" :value="classItem.id"
                                   :label="classItem.name"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowRepublishDialog = false" size="medium">取 消</el-button>
                <el-button type="primary" @click="republishConfirm()" size="medium">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {isShowByPermission} from '@/utils';

    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import Backtool from '@/components/BackTool';
    import mixin from '@/mixins/windowResize';
    import baseMixin from '@/mixins/baseMixin';
    import FileList from '@/components/FileList/FileList';
    import {
        getEvaluateTwBatch,
        mendEvaluateTwBatchBatchUserStu
    } from '@/api/evTeaKinder';
    import {
        queryDepartListTerm,
    } from '@/api/common/common';
    import {mapGetters} from 'vuex';

    export default {
        components: {
            Backtool,
            ImagePreviewer,
            FileList
        },
        computed: {
            ...mapGetters(['userInfo'])
        },
        filters: {
            trimTimeMinute(datetime) {
                return datetime ? datetime.slice(0, datetime.lastIndexOf(':')) : '--';
            }
        },
        data() {
            const stuScopeValidator = (rule, value, callback) => {
                if (this.ruleForm.stuScope.length === 0) {
                    return callback(new Error('请选择发布范围！'));
                } else {
                    callback();
                }
            };
            return {
                isShowByPermission,
                id: this.$route.query.id,
                batchTitle: '',
                deadline: '',
                batchDesc: '',
                currentStuScope: [],
                stuScopeText: [],
                templateList: [],
                classTemplateList: [],
                files: [],
                pics: [],
                isShowRepublishDialog: false,
                ruleForm: {
                    stuScope: [],
                },
                rules: {
                    stuScope: [{
                        required: true, validator: stuScopeValidator, trigger: 'blur'
                    }],
                },
                classList: [],
            };
        },
        mixins: [mixin, baseMixin],
        mounted() {
            this.getEvaluateTwBatchFunc();
        },
        methods: {
            getEvaluateTwBatchFunc() {
                getEvaluateTwBatch({
                    batchId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.batchTitle = pageData.batchTitle;
                        this.batchDesc = pageData.batchDesc;
                        this.deadline = pageData.deadline;
                        const files = [], pics= [];
                        const fileList = JSON.parse(pageData.fileListJson);
                        fileList.forEach(item => {
                            const extName = item.fileName.split('.')[1].toLowerCase();
                            if(['png', 'jpg', 'jpeg', 'bmp', 'gif'].includes(extName)) {
                                item.src = item.fileUrl;
                                pics.push(item);
                            } else {
                                files.push(item);
                            }
                        });
                        this.files = files;
                        this.pics = pics;
                        this.templateList = JSON.parse(pageData.tempJson);
                        this.classTemplateList = JSON.parse(pageData.tempClassJson);
                        this.currentStuScope = JSON.parse(pageData.stuScope);
                        this.stuScopeText = JSON.parse(pageData.stuScope).map(item => item.className);
                        this.state = pageData.state;
                        queryDepartListTerm({
                            all: true,
                            currentTerm: true,
                            notlimit: true
                        })
                            .then(res => res.data)
                            .then(data => {
                                const pageData = data.data;
                                let classList = [];
                                pageData.forEach(item => {
                                    classList = [...classList, ...item.childList];
                                });
                                this.classList = classList.filter(item => {
                                    return !this.currentStuScope.find(scopeItem => scopeItem.classId == item.id);
                                });
                            });
                    })
            },
            toDetailPage(type, args = {}) {
                let url = '';
                switch(type) {
                    case 1:
                        args.isNormal = 1;
                        url = 'evTeaTempDetail';
                        break;
                    case 2:
                        args.isByQues = 1;
                        url = 'evTeaTempDetail';
                        break;
                    case 3:
                        args.isByOpt = 1;
                        url = 'evTeaTempDetail';
                        break;
                }
                this.jumpToPage(url, args);
            },
            republishHandler() {
                this.ruleForm.stuScope = [];
                this.isShowRepublishDialog = true;
            },
            republishConfirm() {
                if(this.ruleForm.stuScope.length === 0) {
                    this.$message.error('至少请选择一个班级');
                } else {
                    const stuScope = [];
                    this.ruleForm.stuScope.forEach(id => {
                        const stuObj = this.classList.find(item => item.id == id);
                        if(stuObj) {
                            stuScope.push({
                                classId: stuObj.id,
                                className: stuObj.name,
                                classOrder: stuObj.order
                            })
                        }
                    });

                    mendEvaluateTwBatchBatchUserStu({
                        batchTitle: this.batchTitle,
                        id: this.id,
                        stuScope
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message.success('补发成功');
                                this.getEvaluateTwBatchFunc();
                                this.isShowRepublishDialog = false;
                            } else {
                                this.$message.error(data.msg);
                            }
                        })
                }

            },
            toCurrAccounting() {
                let url = 'evTeaAccounting';

                this.jumpToPage(url, {
                    batchId: this.id
                })
            }
        }
    }
</script>
<style lang="scss">
    @import "../../styles/mixin";
    #evTeaAddEdit {
        .main-container {
            min-width: 1000px;
            width: 76%;
            height: 98%;
            margin: 10px auto 0 auto;

            .main-container__left {
                float: left;
                min-width: 690px;
                width: 69%;
                box-sizing: border-box;
                height: 100%;
                border: 1px solid #F2F2F2;
            }

            .main-container__right {
                float: right;
                min-width: 260px;
                width: 30%;
                box-sizing: border-box;
                height: 100%;
                border: 1px solid #F2F2F2;
                padding: 24px 14px;
            }

            .section {
                margin-bottom: 45px;
            }

            .section__title {
                border-left: 2px solid #38ACFF;
                padding-left: 5px;
                clear: both;
                color: #333333;
                margin-bottom: 16px;
            }

            .title, .end-date {
                text-align: center;
            }

            .title {
                margin: 10px 0;
                font-size: 20px;
            }

            .batchDesc {
                padding: 10px;
                min-height: 250px;
                @include richtext;
            }

            .end-date {
                padding-bottom: 10px;
                border-bottom: 1px solid #EEEEEE;
            }

            .el-icon-edit {
                margin-left: 10px;
                color: #409eff;
                cursor: pointer;
            }

            .publish-range {
                @include clearfix;
                border: 1px solid #E7EAEC;
                padding: 10px;
            }

            .scope-item {
                padding-left: 28px;
                height: 24px;
                line-height: 24px;
                color: #676A6C;
                background: no-repeat left center / 24px 24px url(../../assets/images/depart.png) #EEEEEE;
                padding-right: 10px;
                font-size: 14px;
                float: left;
                margin-right: 14px;
                margin-bottom: 14px;

            }

            .template-item {
                margin-bottom: 10px;
                font-size: 14px;
            }

            .file_list_box .file_item .file_item-des {
                padding-left: 0;
                line-height: 30px;
                padding-right: 0;
                margin-right: 0;
                display: inline-block;
                vertical-align: middle;
                min-width: unset;
                max-width: unset;
                width: 61%;
                color: #676a6c;
                white-space: nowrap;
                overflow-x: hidden;
                text-overflow: ellipsis;
            }
        }
        .pic-container {
            padding: 10px;
            ul {
                list-style-type: none;
                @include clearfix();
                .image_view {
                    @include backgroundCover(100px, 100px);
                    float: left;
                    margin: 0 10px 10px 0;
                }
            }
        }
    }
</style>
