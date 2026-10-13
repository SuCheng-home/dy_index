<template>
    <div class="app-container calendar-list-container" id="benifitsAddEdit">
        <backtool>
            <template v-if="!isEdit">
                <el-button type="primary" size="medium" :disabled="isLoading" :loading="isLoading"
                           @click.native="saveHandler(1)">存草稿
                </el-button>
                <el-button type="primary" size="medium" :disabled="isLoading" :loading="isLoading"
                           @click.native="saveHandler(2)">发布
                </el-button>
            </template>
            <template v-else>
                <template v-if="!isRelease">
                    <el-button type="primary" size="medium" :disabled="isLoading" :loading="isLoading"
                               @click.native="saveHandler(1)">存草稿
                    </el-button>
                    <el-button type="primary" size="medium" :disabled="isLoading" :loading="isLoading"
                               @click.native="saveHandler(2)">发布
                    </el-button>
                </template>
                <template v-else>
                    <el-button type="primary" size="medium" :disabled="isLoading" :loading="isLoading"
                               @click.native="saveHandler(3)">保存
                    </el-button>
                </template>
            </template>
        </backtool>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']"
             :style="`height: ${nobottommaxH}px;overflow: auto;`">
            <div style="width: 810px;padding-top:20px;margin: 0 auto;">
                <el-form :model="formData" :rules="formRules" ref="form" label-width="140px">
                    <el-form-item label="福利名称" prop="title">
                        <el-input v-if="!isRelease" v-model="formData.title" placeholder="请输入福利名称"
                                  :maxlength="20"></el-input>
                        <span v-else>{{formData.title}}</span>
                    </el-form-item>
                    <el-form-item label="发放范围" prop="thAddressData">
                        <address-book v-if="!isRelease" v-model="formData.thAddressData" :config="configData"
                                      dataSuffix="List"></address-book>
                        <div v-else class="range-list">
                            <template v-for="item in formData.thAddressData.departList">
                                <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+require('@/assets/images/depart.png')+')'}"
                                              style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                    <span class="range-item-des">{{item.name}}</span>
                                </div>
                            </template>
                            <template v-for="item in formData.thAddressData.groupList">
                                <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+require('@/assets/images/group.png')+')'}"
                                              style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/testimg/photo.jpg);"></span>
                                    <span class="range-item-des">{{item.name}}</span>
                                </div>
                            </template>
                            <template v-for="item in formData.thAddressData.userList">
                                <div class="range-item">
                                        <span class="range-item-img"
                                              :style="{backgroundImage:'url('+item.avatar+')'}"></span>
                                    <span class="range-item-des">{{item.name}}</span>
                                </div>
                            </template>
                            <div class="clear"></div>
                        </div>
                    </el-form-item>
                    <el-form-item label="福利物品" prop="goodsList">
                        <template v-if="!isRelease">
                            <el-button type="primary" size="small" icon="el-icon-plus" @click="addGood">添加物品</el-button>
                            <div class="good-list">
                                <div v-for="(goodItem, goodIndex) in formData.goodsList" class="good-item">
                                    <div class="good-item__title-container">
                                        <el-input v-model="goodItem.title" placeholder="物品名称"
                                                  :maxlength="20"></el-input>
                                    </div>
                                    <div>
                                        <el-checkbox :true-label="2" :false-label="1" v-model="goodItem.isSelected"
                                                     @change="goodIsSelectChange">必选物品
                                        </el-checkbox>
                                    </div>
                                    <i class="fa fa-close" @click="deleteGood(goodIndex)"></i>
                                </div>
                            </div>
                        </template>
                        <template v-else>
                            <div class="good-list">
                                <div v-for="(goodItem, goodIndex) in formData.goodsList" class="good-item">
                                    <div class="good-item__title-container">
                                        <span class="good-item__title">{{goodItem.title}}</span>
                                        <el-tag v-if="goodItem.isSelected === 2" size="medium">必选</el-tag>
                                    </div>

                                </div>
                            </div>
                        </template>
                    </el-form-item>
                    <el-form-item label="限选数量" prop="maxVoteCount">
                        <el-input v-if="!isRelease" v-model="formData.maxVoteCount" placeholder="不填则不限制选择数量"
                                  @blur="numberBlurHandler"></el-input>
                        <span v-else>{{formData.maxVoteCount || '不限'}}</span>
                    </el-form-item>
                    <el-form-item label="登记截止时间" prop="expriyTime">
                        <el-col :span="6">
                            <el-date-picker type="datetime" placeholder="不填即没有截止时间" format="yyyy-MM-dd HH:mm"
                                            :editable='false' v-model="formData.expriyTime"
                                            style="width: 180px"></el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="领取方式" prop="wayType">
                        <el-radio-group v-if="!isRelease" v-model="formData.wayType">
                            <el-radio :label="1">在校领取</el-radio>
                            <el-radio :label="2">到店自提</el-radio>
                            <el-radio :label="3">物流配送</el-radio>
                        </el-radio-group>
                        <span v-else>
                            {{formData.wayType | getWayText}}
                        </span>
                    </el-form-item>
                    <el-form-item label="落款部门" prop="inscribe">
                        <template v-if="!isRelease">
                            <el-col :span="2">
                                <el-switch on-text="" off-text="" v-model="isInscribe"></el-switch>
                            </el-col>
                            <el-col :span="6">
                                <el-select allow-create filterable v-show="isInscribe" v-model.trim="formData.inscribe"
                                           placeholder="请选择">
                                    <el-option v-for="item in departList" :key="item.value" :label="item.label"
                                               :value="item.label">
                                    </el-option>
                                </el-select>
                            </el-col>
                        </template>
                        <span v-else>{{formData.inscribe || '无'}}</span>
                    </el-form-item>

                    <el-form-item label="通知内容" prop="content">
                        <br v-if="!isRelease" />
                        <ueditor style="width: 740px;position: relative;right: 70px;" v-if="!isRelease" class="rich-editor" ref="ueditor" :defaultMes="formData.content"
                                 @editModel="richTextEditHandler"></ueditor>
                        <image-previewer v-else tag="richtext">
                            <div class="notice-content" v-html="formData.content"></div>
                        </image-previewer>
                    </el-form-item>
                    <br/>
                </el-form>
            </div>

        </div>
    </div>
</template>

<script>
    import moment from 'moment';
    import AddressBook from '@/components/AddressBook/indexExpand';
    import Ueditor from '@/components/Ueditor';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
    import mixin from "@/mixins/windowResize";
    import {
        addThWelfare,
        getThWelfare,
        updateThWelfare
    } from '@/api/benifits';
    import {queryDepartByUserId} from '@/api/system';
    import {thWefareStatusEnum, wayTypeEnum} from './constants';

    import {mapGetters} from 'vuex';

    export default {
        name: "benifitsAddEdit",
        data() {
            const thAddressValidator = (rule, value, callback) => {
                if ((value.userList && value.userList.length > 0) ||
                    (value.departList && value.departList.length > 0) ||
                    (value.groupList && value.groupList.length > 0)) {
                    callback();
                } else {
                    return callback(new Error('发放范围不能为空！'));
                }
            };

            const goodsListValidator = (rule, value, callback) => {
                if (this.formData.goodsList.length === 0) {
                    callback(new Error('至少需要有一种福利物品！'));
                } else {
                    let isTitleError = false;
                    this.formData.goodsList.forEach(goodItem => {
                        if (!goodItem.title) {
                            isTitleError = true;
                        }
                    });
                    if (isTitleError) {
                        callback(new Error('请填写福利物品名称'));
                    } else {
                        callback();
                    }
                }
            };

            const maxVoteCountValidator = (rule, value, callback) => {
                if (this.formData.maxVoteCount) {
                    const maxVoteCount = Number.parseInt(this.formData.maxVoteCount);
                    if (maxVoteCount > this.formData.goodsList.length) {
                        callback('限选数量不能大于物品数量');
                    } else if (maxVoteCount < this.formData.goodsList.filter(({isSelected}) => isSelected === 2).length) {
                        callback('限选数量不能小于必选物品数量');
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            };

            const expriyTimeValidator = (rule, value, callback) => {
                if (this.formData.expriyTime &&
                    moment(this.formData.expriyTime).format('YYYY-MM-DD HH:mm') <= moment().format('YYYY-MM-DD HH:mm')
                ) {
                    callback(new Error('截至时间应大于当前时间'));
                } else {
                    callback();
                }
            };

            return {
                thWefareStatusEnum,
                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,
                isInscribe: false,
                departList: [],
                thWefareStatus: 0,
                formData: {
                    content: '',
                    expriyTime: '',
                    goodsList: [{
                        isSelected: 1,
                        title: '',
                    }],
                    maxVoteCount: '',
                    inscribe: '',
                    sendTime: '',
                    thAddressData: {},
                    title: '',
                    wayType: 1,
                },
                formRules: {
                    title: [
                        {required: true, message: '福利名称不能为空', trigger: 'blur'}
                    ],
                    thAddressData: [{
                        required: true, trigger: 'blur', validator: thAddressValidator
                    }],
                    goodsList: [{
                        required: true, trigger: 'blur', validator: goodsListValidator
                    }],
                    maxVoteCount: [{
                        trigger: 'blur', validator: maxVoteCountValidator
                    }],
                    expriyTime: [{
                        trigger: 'blur', validator: expriyTimeValidator
                    }],
                    wayType: [
                        {required: true, message: '领取方式必选', trigger: 'blur'}
                    ],
                    content: [
                        {required: true, message: '通知内容不能为空', trigger: 'blur'}
                    ],
                },
                configData: {
                    title: '选择发放范围',
                    depart: {target: 'all', departType: 't', userTypes: '1'},
                    group: true,
                    notCheckSchool: true
                },
                isLoading: false
            }
        },
        mixins: [mixin],
        components: {
            AddressBook,
            Ueditor,
            ImagePreviewer
        },
        filters: {
            trimTime(time) {
                return time.slice(0, time.lastIndexOf('.'));
            },
            getWayText(wayType) {
                const mapping = {
                    [wayTypeEnum.zaixiao]: '在校领取',
                    [wayTypeEnum.daodian]: '到店自提',
                    [wayTypeEnum.wuliu]: '物流配送',
                };
                return mapping[wayType];
            }
        },

        computed: {
            ...mapGetters(['isStandalone', 'userInfo']),
            isRelease() {
                return this.thWefareStatus === thWefareStatusEnum.thWefareStatus_ALREADY;
            },
        },
        mounted() {
            if (this.isEdit) {
                getThWelfare({
                    welfareId: this.id
                })
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.$refs.ueditor.setContent(pageData.content);
                        this.formData.content = pageData.content;
                        this.formData.title = pageData.title;
                        this.createTime = pageData.createTime;
                        this.createUserName = pageData.createUserName;
                        this.isInscribe = !!pageData.inscribe;
                        this.formData.inscribe = pageData.inscribe;
                        this.formData.thAddressData = JSON.parse(pageData.thScopeJson);
                        this.thWefareStatus = pageData.thWefareStatus;
                        this.formData.maxVoteCount = pageData.maxVoteCount === 0 ? '' : pageData.maxVoteCount;
                        this.formData.expriyTime = pageData.expriyTime;
                        this.formData.goodsList = pageData.goodsList;
                        this.formData.wayType = pageData.wayType;
                    })
            }
            queryDepartByUserId(this.userInfo.id, 7)
                .then(res => res.data)
                .then(data => {
                    if (data.data && data.data.length !== 0) {
                        this.departList = data.data.map(({id, name}) => ({
                            value: id,
                            label: name
                        }));
                        if (!this.isEdit) {
                            this.formData.inscribe = data.data[0].name;
                        }
                    }

                }).catch(err => {
            });
        },
        methods: {
            saveHandler(thWefareStatus) {
                this.$refs.form.validate((isValid) => {
                    if (isValid) {
                        this.isLoading = true;
                        let args = {
                            expriyTime: this.formData.expriyTime ? moment(this.formData.expriyTime).format('YYYY-MM-DD HH:mm') : '',
                            goodsList: this.formData.goodsList,
                            inscribe: this.isInscribe ? this.formData.inscribe : '',
                            maxVoteCount: this.formData.maxVoteCount || 0,
                            sendTime: moment().format('YYYY-MM-DD'),
                            sendUserType: 1,
                            stuDepartJson: {},
                            thScopeJson: this.formData.thAddressData,
                            thWefareStatus,
                            title: this.formData.title,
                            wayType: this.formData.wayType
                        };
                        if (!this.isRelease) {
                            args.content = this.$refs.ueditor.getContent();
                        } else {
                            args.content = this.formData.content;
                        }
                        if (!this.isEdit) {
                            addThWelfare(args)
                                .then(res => res.data)
                                .then(data => {
                                    if (data.result) {
                                        this.$message({
                                            type: 'success',
                                            message: '新增成功！',
                                        });
                                        this.$router.back();
                                    } else {
                                        this.$message.error(data.msg);
                                        this.isLoading = false;
                                    }
                                })
                                .catch(error => {
                                    this.$message.error(error);
                                    this.isLoading = false;
                                })
                        } else {
                            if (thWefareStatus === 3) {
                                args = {
                                    expriyTime: this.formData.expriyTime ? moment(this.formData.expriyTime).format('YYYY-MM-DD HH:mm') : '',
                                    thWefareStatus,
                                };
                            }

                            args.id = this.id;
                            updateThWelfare(args)
                                .then(res => res.data)
                                .then(data => {
                                    if (data.result) {
                                        this.$message({
                                            type: 'success',
                                            message: '编辑成功！',
                                        });
                                        this.$router.back();
                                    } else {
                                        this.$message.error(data.msg);
                                        this.isLoading = false;
                                    }
                                })
                                .catch(error => {
                                    this.$message.error(error);
                                    this.isLoading = false;
                                })
                        }
                    }
                })
            },
            richTextEditHandler(content) {
                this.formData.content = content;
            },
            goodIsSelectChange() {
                this.$refs.form.validateField('maxVoteCount');
            },
            numberBlurHandler() {
                this.formData.maxVoteCount = this.formData.maxVoteCount.replace(/^\D*(\d*)(\D*|\..+)$/, '$1');
            },
            addGood() {
                this.formData.goodsList.push({
                    isSelected: 1,
                    title: '',
                });
                this.$refs.form.validateField('maxVoteCount');
            },
            deleteGood(index) {
                this.formData.goodsList.splice(index, 1);
                this.$refs.form.validateField('maxVoteCount');
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin";

    .good-item {
        & > * {
            @include middleIB;
        }

        .good-item__title-container {
            width: 50%;
            margin-right: 10px;

            .good-item__title {
                display: inline-block;
                min-width: 30%;
                margin-right: 20px;
            }
        }

        .fa {
            margin-left: 10px;
            color: #f08080;
            cursor: pointer;
        }
    }

    .range-item {
        height: 30px;
        display: block;
        float: left;
        margin-left: 4px;
        margin-top: 4px;
        margin-right: 20px;
    }

    .range-item-img {
        height: 28px;
        width: 28px;
        display: block;
        float: left;
        background-position: center center;
        background-size: cover;
    }

    .range-item-des {
        padding-left: 4px;
        line-height: 30px;
        padding-right: 4px;
        color: #676A6C;
        font-size: 13px;
        float: left;
    }
</style>
<style lang="scss">
    #benifitsAddEdit {
        .notice-content a {
            color: #337ab7 !important;
            text-decoration: underline !important;
        }

        .notice-content img {
            display: block;
            max-width: 100%;
        }

        .notice-content ol, .notice-content ul {
            padding-left: 30px;
        }

        .notice-content td, .notice-content th {
            padding: 5px 10px;
            border: 1px solid #DDD;
        }

        .notice-content p {
            margin: 0 0 10px;
        }

        .notice-content table {
            border-collapse: collapse;
            border-spacing: 0;
            margin-bottom: 10px;
        }
    }

</style>
