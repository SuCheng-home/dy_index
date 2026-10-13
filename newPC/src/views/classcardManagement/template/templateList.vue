<template>
    <div class="app-container">
        <el-row :gutter="10">
            <el-col :span="4">
                <el-select v-model="cardType" placeholder="请选择" @change="getClassCardTemplateListFunc(true)">
                    <el-option v-for="(typeItem,index) in cardTypeList"  :key="index" :label="typeItem.value"
                               :value="typeItem.code"></el-option>
                </el-select>
            </el-col>
            <el-col :span="20">
                <div class="filter-container">
                    <el-button-group>
                        <el-button :type="type === 2 ? 'primary' : 'default'" @click="type = 2">横板</el-button>
                        <el-button :type="type === 1 ? 'primary' : 'default'" @click="type = 1">竖版</el-button>
                    </el-button-group>
                </div>
            </el-col>
        </el-row>
        <el-row :gutter="10">
            <el-col :span="24">
                <div class="page-main" :style="{height: `${maxH + 50}px`}">
                    <div class="template-item" v-show="type == 2" v-for="(templateItem, templateIndex) in templateList" :key="templateIndex">
                        <div v-if="templateItem.pageImageList && templateItem.pageImageList.length !== 0"
                             @click="showPreview(templateIndex)" class="cover"
                             :style="{backgroundImage: `url(${templateItem.pageImageList[0].src})`}"></div>
                        <div v-else class="cover"
                             style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/mobile/images/class_brand/card2.jpg)"></div>
                        <div v-if="templateItem.pageImageList && templateItem.pageImageList.length !== 0">
                            <image-previewer :ref="`preview${templateIndex}`" class="image-plate"
                                             :images="templateItem.pageImageList" tag="none"></image-previewer>
                        </div>
                        <div>
                            <span>{{templateItem.tile}}</span>
                        </div>
                        <el-tooltip effect="dark" :content="templateItem.introduce" placement="top">
                            <div class="template-desc">{{templateItem.introduce}}</div>
                        </el-tooltip>
                        <el-button-group>
                            <el-button v-if="code == 1 || templateItem.templateType === 2" size="mini" type="primary"
                                       @click.stop="jumpToTemplateSetting(templateItem.id)">
                                编辑
                            </el-button>
                            <el-button size="mini" type="primary" @click.stop="applyClick(templateItem.id)">应用到
                            </el-button>
                            <el-button v-if="code == 1 || templateItem.templateType === 2" size="mini" type="danger" @click.stop="deleteTemplate(templateItem.id)">删除
                            </el-button>
                        </el-button-group>
                    </div>
                    <div class="template-item" v-show="type == 1"
                         v-for="(templateItem, templateIndex) in templateListV" :key="templateIndex">
                        <div v-if="templateItem.pageImageList && templateItem.pageImageList.length !== 0"
                             @click="showPreview(`${templateIndex}V`)" class="cover"
                             :style="{backgroundImage: `url(${templateItem.pageImageList[0].src})`}"></div>
                        <div v-else class="cover"
                             style="background-image: url(https://cdnfile-10043692.file.myqcloud.com/mobile/images/class_brand/card2.jpg)"></div>
                        <div v-if="templateItem.pageImageList && templateItem.pageImageList.length !== 0">
                            <image-previewer :ref="`preview${templateIndex}V`" class="image-plate"
                                             :images="templateItem.pageImageList" tag="none"></image-previewer>
                        </div>
                        <div>
                            <span>{{templateItem.tile}}</span>
                        </div>
                        <el-tooltip effect="dark" :content="templateItem.introduce" placement="top">
                            <div class="template-desc">{{templateItem.introduce}}</div>
                        </el-tooltip>
                        <el-button-group>
                            <el-button v-if="code == 1 || templateItem.templateType === 2" size="mini" type="primary"
                                       @click.stop="jumpToTemplateSetting(templateItem.id)">
                                编辑
                            </el-button>
                            <el-button size="mini" type="primary" @click.stop="applyClick(templateItem.id)">应用到
                            </el-button>
                            <el-button v-if="code == 1 || templateItem.templateType === 2" size="mini" type="danger"
                                       @click.stop="deleteTemplate(templateItem.id)">删除
                            </el-button>
                        </el-button-group>
                    </div>
                    <div class="template-item template-item--add" @click="jumpToTemplateSetting(null)">+</div>
                </div>
            </el-col>
        </el-row>
        <el-dialog title="设备列表" :visible.sync="isShowCardListDialog" size="tiny" width="800px"
                   :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
            <div class="card-list">
                <div class="card-item">
                    <el-checkbox-group v-model="checkedCard" size="small">
                        <el-checkbox :label="cardItem.id" v-for="(cardItem,indexa) in cardList" :key="indexa">{{cardItem.deviceName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowCardListDialog = false">取 消</el-button>
                <el-button type="primary" @click="checkAll">全 选</el-button>
                <el-button type="primary" @click="applyFunc">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import mixin from '@/mixins/windowResize';
    import {
        getClassCardTemplateList,
        delClassCardTemplate,
        getSchoolClassCardDeviceListByTypeCode,
        addClassCardTempList
    } from '@/api/classcardManagement';
    import {findDicsByCode} from '@/api/common/common';
    import {mapGetters} from 'vuex';
    import ImagePreviewer from "@/components/ImagePreviewer/ImagePreviewer";

    export default {
        name: "templateList",
        components: {ImagePreviewer},
        mixins: [mixin],
        data() {
            return {
                cardType: 'classcard',
                cardTypeList: [],
                templateList: [],
                templateListV: [],
                templateType: 1,
                code: this.$route.query.code,
                type: 2,
                cardList: [],
                isShowCardListDialog: false,
                checkedCard: [],
                currentTemplateId: null
            }
        },
        created() {
            if (this.code) {
                this.templateType = this.code;
            }
            findDicsByCode({
                dicCode: 'classCardDeviceType'
            })
                .then(res => res.data)
                .then(data => {
                    const cardTypeList = data.data.filter(({code}) => code === 'schoolCard' || code === 'classcard');
                    if(this.schoolInfo.type == 5) {
                        cardTypeList.push({
                            code: 'areacard',
                            value: '大数据看板'
                        });
                    }
                    this.cardTypeList = cardTypeList;
                });
            this.getClassCardTemplateListFunc();
        },

        computed: {
            ...mapGetters([
                'schoolInfo',
            ])
        },
        methods: {
            showPreview(index) {
                this.$refs[`preview${index}`][0].showPreviewer()
            },
            jumpToTemplateSetting( id = null) {
                let routePath = '';
                if (this.cardType === 'areacard') {
                    routePath = 'templateDataboardCustomSetting';
                } else {
                    if (this.type === 2) {
                        routePath = 'templateCustomSetting';
                    } else {
                        routePath = 'templateCustomSettingVertical'
                    }
                }
                const query = {typeCode: this.cardType, templateType: this.templateType, type: this.type};
                if(id) {
                    query.id = id;
                }
                this.jumpToPage(routePath, query);
            },
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            getClassCardTemplateListFunc(isClear = false) {
                if (isClear) {
                    this.templateList = [];
                    this.templateListV = [];
                }
                getSchoolClassCardDeviceListByTypeCode({
                    typeCode: this.cardType
                })
                    .then(res => res.data)
                    .then(data => {
                        this.cardList = data.data;
                    });
                if (this.templateType == 2) {
                    getClassCardTemplateList({
                        templateType: 1,
                        typeCode: this.cardType
                    })
                        .then(res => res.data)
                        .then(data => {
                            data.data.forEach(item => {
                                item.templateType = 1;
                                const pageImageList = [];
                                let customModule = [];
                                const cardCustomModuleJson = JSON.parse(item.cardCustomModuleJson);
                                if (cardCustomModuleJson.customModule) {
                                    customModule = cardCustomModuleJson.customModule;
                                } else {
                                    customModule = cardCustomModuleJson;
                                }
                                customModule.forEach(pageItem => {
                                    if (pageItem.pageImage && pageItem.pageImage !== '') {
                                        pageImageList.push({
                                            src: pageItem.pageImage
                                        });
                                    }
                                });
                                item.pageImageList = pageImageList;
                            });
                            this.templateList = [...this.templateList, ...data.data.filter(({type}) => type == 2)];
                            this.templateListV = [...this.templateListV, ...data.data.filter(({type}) => type == 1)];
                        });
                    getClassCardTemplateList({
                        templateType: 2,
                        typeCode: this.cardType
                    })
                        .then(res => res.data)
                        .then(data => {
                            data.data.forEach(item => {
                                item.templateType = 2;
                                const pageImageList = [];
                                let customModule = [];
                                const cardCustomModuleJson = JSON.parse(item.cardCustomModuleJson);
                                if (cardCustomModuleJson.customModule) {
                                    customModule = cardCustomModuleJson.customModule;
                                } else {
                                    customModule = cardCustomModuleJson;
                                }
                                customModule.forEach(pageItem => {
                                    if (pageItem.pageImage && pageItem.pageImage !== '') {
                                        pageImageList.push({
                                            src: pageItem.pageImage
                                        });
                                    }
                                });
                                item.pageImageList = pageImageList;
                            });
                            this.templateList = [...this.templateList, ...data.data.filter(({type}) => type == 2)];
                            this.templateListV = [...this.templateListV, ...data.data.filter(({type}) => type == 1)];
                        });
                } else {
                    getClassCardTemplateList({
                        templateType: 1,
                        typeCode: this.cardType
                    })
                        .then(res => res.data)
                        .then(data => {
                            data.data.forEach(item => {
                                item.templateType = 1;
                                const pageImageList = [];
                                let customModule = [];
                                const cardCustomModuleJson = JSON.parse(item.cardCustomModuleJson);
                                if (cardCustomModuleJson.customModule) {
                                    customModule = cardCustomModuleJson.customModule;
                                } else {
                                    customModule = cardCustomModuleJson;
                                }
                                customModule.forEach(pageItem => {
                                    if (pageItem.pageImage && pageItem.pageImage !== '') {
                                        pageImageList.push({
                                            src: pageItem.pageImage
                                        });
                                    }
                                });
                                item.pageImageList = pageImageList;
                            });
                            this.templateList = [...this.templateList, ...data.data.filter(({type}) => type == 2)];
                            this.templateListV = [...this.templateListV, ...data.data.filter(({type}) => type == 1)];
                        });
                }

            },
            deleteTemplate(templateId) {
                this.$confirm('是否确定删除该模板？', '删除', {
                    type: 'error'
                }).then(() => {
                    delClassCardTemplate({
                        templateId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '删除成功!'
                                });
                                this.getClassCardTemplateListFunc(true);
                            }
                        });
                });

            },
            checkAll() {
                const checkedCard = [];
                this.cardList.forEach(item => {
                    checkedCard.push(item.id);
                });
                this.checkedCard = checkedCard;
            },
            applyFunc() {
                if(this.checkedCard.length === 0) {
                    this.$message.error('请选择班牌');
                } else {
                    addClassCardTempList({
                        classCardIdList: JSON.stringify(this.checkedCard),
                        templeateId: this.currentTemplateId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.result) {
                                this.$message({
                                    message: '设置成功',
                                    type: 'success'
                                });
                                this.isShowCardListDialog = false;
                            }
                        });
                }
            },
            applyClick(id) {
                this.currentTemplateId = id;
                const checkedCard = [];
                this.cardList.forEach(item => {
                    if (item.templateId == id) {
                        checkedCard.push(item.id);
                    }
                });
                this.checkedCard = checkedCard;
                this.isShowCardListDialog = true;
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../../../src/styles/mixin.scss";

    .type-container {
        overflow-y: auto;
        @include scrollBar;
    }

    .type-item {
        margin-bottom: 10px;
        padding: 5px;
        cursor: pointer;
    }

    .active {
        color: #20a0ff;
        background: #E5E9F2
    }

    .filter-container {
        text-align: center;
        margin-left: -217px;
    }

    .cover {
        @include wh(178px, 100px);
        @include cover-bg;
    }

    .template-item {
        float: left;
        width: 200px;
        height: 188px;
        box-sizing: border-box;
        border: 1px solid #999;
        margin-right: 10px;
        margin-bottom: 10px;
        padding: 10px;
        text-align: center;
        position: relative;

        img {
            width: 100%;
        }

        .template-desc {
            font-size: 14px;
            color: #999;
            white-space: nowrap;
            text-overflow: ellipsis;
            width: 100%;
            overflow: hidden;
        }

        &:hover .fa {
            display: block;
        }

        .fa {
            display: none;
            position: absolute;
            top: 10px;
            cursor: pointer;
        }

        .fa-edit {
            color: #409EFF;
            right: 30px;
        }

        .fa-trash {
            color: #F08080;
            right: 10px;
        }
    }

    .template-item--add {
        font-size: 30px;
        line-height: 160px;
        text-align: center;
        cursor: pointer;
    }
</style>
