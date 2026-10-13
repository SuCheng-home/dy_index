<template>
    <div id="templateDataboardCustomSetting" class="app-container">
        <div class="filter-container">
            <el-button type="default" @click="$router.back()">返回</el-button>
            <el-button type="primary" @click="saveHandler">保存</el-button>
        </div>
        <div class="info-container">
            <span class="required-hint">*</span>模板名称：
            <el-input style="width: 200px;margin-right: 10px;" size="small" :maxlength="10" v-model.trim="tile"/>
            <span class="required-hint">*</span>模板描述：
            <el-input style="width: 500px" size="small" :maxlength="30" v-model.trim="introduce"/>
        </div>
        <div class="page-tag-container">
            <div :class="['page-tag-item', currentPageIndex === pageIndex ? 'page-tag-item--active' : '']"
                 @click="changeTag(pageIndex)" v-for="(pageItem, pageIndex) in customModule" :key="pageIndex">
                <el-tooltip :content="pageItem.pageName" placement="top">
                    <span class="page-name">{{pageItem.pageName}}</span>
                </el-tooltip>
                <span class="fa fa-edit" @click.stop="editPageClick(pageItem)"></span>
                <span class="fa fa-trash" v-show="customModule.length !== 1"
                      @click.stop="deletePage(pageIndex)"></span>
            </div>
            <div class="page-tag-item-add" @click="addPageClick">+</div>
        </div>
        <div class="main-container">
            <div class="base-card-container" :style="{backgroundImage: `url(${getBackground(background)})`}">
                <div class="base-card base-card--current">
                    <template v-for="rowIndex in 4">
                        <template v-for="colIndex in 4">
                            <div
                                :class="['card-section-item', `card-section-item--col${colIndex}`, `card-section-item--row${rowIndex}`]"
                                :data-row="rowIndex" :data-col="colIndex">
                                <i class="fa fa-close"></i>
                            </div>
                        </template>
                    </template>
                </div>
            </div>
            <div class="module-container">
                <div class="module-container__title">组件库</div>
                <div>
                    <el-input placeholder="搜索组件" size="small" v-model.trim="moduleSearchTitle"
                              class="input-with-select" @keyup.enter.native="nameSearch">
                        <el-select v-model="currentSize" @change="nameSearch" slot="prepend" placeholder="组件尺寸"
                                   style="width: 80px;">
                            <el-option
                                v-for="sizeItem in sizeList"
                                :key="sizeItem.value"
                                :label="sizeItem.label"
                                :value="sizeItem.value">
                            </el-option>
                        </el-select>
                        <el-button slot="append" type="primary" style="width: 50px;" icon="el-icon-search"
                                   @click="nameSearch"></el-button>
                    </el-input>
                </div>
                <div class="module-list">
                    <div class="module-item" data-isuse="0" :data-id="moduleItem.id" :data-size="moduleItem.sizeInfo"
                         :data-name="moduleItem.title" :data-code="moduleItem.componentCode" v-for="(moduleItem, index) in moduleList" :key="index">
                        <div class="module-item__photo">
                            <img :src="moduleItem.cover" :data-id="moduleItem.id" :data-size="moduleItem.sizeInfo"
                                 class="module-image"/>
                        </div>
                        <div class="module-item__info-container">
                            <div class="module-item__name">
                                {{moduleItem.title}}
                            </div>
                            <div class="module-item__size">
                                尺寸：{{moduleItem.sizeInfo | parseSize}}
                            </div>
                            <div class="module-item__desc">
                                介绍：{{moduleItem.introduce}}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            页面效果：
            <div class="page-preview">
                <uploader v-for="(pageItem, pageIndex) in customModule" showMode="image" :key="pageIndex"
                          pathPrefix="banpaiguanli" module="banpaiguanli" moduleCode="20181105"
                          v-show="currentPageIndex === pageIndex" :extList="allFileTypeList" v-model="files[pageIndex]"
                          :multiple="false" showResult="image" @delete="deleteFileHandler" @input="uploadFileHandler"></uploader>
            </div>
        </div>
        <el-dialog title="版面" :visible.sync="isShowPageDialog" :close-on-press-escape='false'
                   width="600px"
                   :close-on-click-modal='false' :modal-append-to-body='false'>
            <div>
                <el-form ref="pageForm" :model="pageArgs" :rules="pageRule" label-width="80px">
                    <el-form-item label="名称" prop="pageName">
                        <el-input v-model="pageArgs.pageName" :maxlength="20" style="width: 430px;"></el-input>
                    </el-form-item>
                    <el-form-item label="排序">
                        <el-input-number :step="1" @blur="numberBlurHandler" v-model="pageArgs.sort" :min="1"></el-input-number>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowPageDialog = false">取 消</el-button>
                <el-button type="primary" @click="changePage">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import Uploader from '@/components/Uploader/WebUploader';

    import sizeList from "../moduleSize";
    import {findDicsByCode} from '@/api/system'
    import {
        getClassCardComponentList,
        addClassCardTemplate,
        getClassCardTemplate,
        updateClassCardTemplate
    } from '@/api/classcardManagement';
    import $ from 'jquery';
    import 'jquery-ui/themes/base/draggable.css';
    import 'jquery-ui/ui/widgets/draggable';
    import 'jquery-ui/ui/widgets/droppable';
    import lodash from 'lodash';

    let $draggedModuleItem = null;



    export default {
        name: "templateDataboardCustomSetting",
        data() {
            return {
                files: [],
                allFileTypeList: ['jpg', 'jpeg', 'gif', 'bmp', 'png'],

                id: this.$route.query.id,
                isEdit: !!this.$route.query.id,

                isAddPage: true,
                isShowPageDialog: false,
                editPage: null,
                pageArgs: {
                    pageName: '',
                    sort: 1
                },
                pageRule: {
                    pageName: [{
                        required: true,
                        message: '请填写版面名称',
                        trigger: 'blur'
                    }]
                },
                typeCode: this.$route.query.typeCode,
                tile: '',
                templateType: this.$route.query.templateType,
                introduce: '',
                currentPageIndex: 0,
                customModule: [{
                    pageName: '首页',
                    sort: 1,
                    moduleList: [],
                    pageImage: ''
                }],
                currentSize: 0,
                sizeList,
                moduleSearchTitle: '',
                moduleList: [],
                background: 'bg1'
            }
        },
        filters: {
            parseSize(moduleValue) {
                return sizeList.find(({value}) => value == moduleValue).label;
            }
        },
        computed: {
            ...mapGetters(['schoolInfo'])
        },
        components: {Uploader},
        mounted() {
            const vm = this;
            $('.base-card-container')
                .on('click', '.fa-close', function() {
                    const $draggedModuleItem = $(this).prev('img');
                    const $moduleItem = $(`.module-item[data-id="${$draggedModuleItem.data('id')}"]`).show().attr('isuse', 0);
                    $('.module-list').append($moduleItem);
                    const index = vm.customModule[vm.currentPageIndex].moduleList.findIndex(({id}) => id == $draggedModuleItem.data('id'));
                    vm.customModule[vm.currentPageIndex].moduleList.splice(index, 1);
                    $draggedModuleItem.remove();
                })
                .on('mousedown', '.module-image', function() {
                    $(this).css({
                        zIndex: 2000
                    });
                })
                .on('mouseup', '.module-image', function() {
                    $(this).css({
                        zIndex: 3000
                    })
                });
            for(let i = 0;i < 30; i++) {
                this.files.push([]);
            }
            getClassCardComponentList()
                .then(res => res.data)
                .then(data => {
                    this.moduleList = data.data.filter(item => {
                        let result = false;
                        switch(item.componentType) {
                            case 1:
                                result = this.typeCode === 'classcard';
                                break;
                            case 2:
                                result = this.typeCode === 'schoolCard' || this.typeCode === 'classcard';
                                break;
                            case 3:
                                result = this.typeCode === 'areacard';
                                break;
                        }
                        return result;
                    });

                    new Promise((resolve) => {
                        if (this.isEdit) {
                            getClassCardTemplate({
                                templateId: this.id
                            })
                                .then(res => res.data)
                                .then(data => {
                                    const pageData = data.data;
                                    this.tile = pageData.tile;
                                    this.introduce = pageData.introduce;
                                    const cardCustomModuleJson = JSON.parse(pageData.cardCustomModuleJson);
                                    if(cardCustomModuleJson.customModule) {
                                        this.customModule = cardCustomModuleJson.customModule;
                                        this.background = cardCustomModuleJson.background;
                                    } else {
                                        this.customModule = cardCustomModuleJson;
                                    }

                                    this.customModule.forEach((baseCardItem, index) => {
                                        if(baseCardItem.pageImage) {
                                            this.files[index].push({
                                                fileUrl: baseCardItem.pageImage
                                            })
                                        }
                                        if (index !== 0) {
                                            let htmlStr = '<div class="base-card">';
                                            for (let row = 1; row <= 3; row++) {
                                                for (let col = 1; col <= 4; col++) {
                                                    htmlStr += `<div class="card-section-item card-section-item--col${col} card-section-item--row${row}" data-row="${row}" data-col="${col}"><i class="fa fa-close"></i></div>`;
                                                }
                                            }
                                            htmlStr += '</div>';
                                            $('.base-card-container').append(htmlStr);
                                        }

                                        setTimeout(() => {
                                            this.initCardDropzone(index);
                                            baseCardItem.moduleList = baseCardItem.moduleList.filter(moduleItem => {
                                                return $(`.module-item[data-id="${moduleItem.id}"]`).length !== 0;
                                            });
                                            baseCardItem.moduleList.forEach((moduleItem, moduleIndex) => {
                                                const cellWidth = 232;
                                                const margin = 5;
                                                const cellHeight = 113;
                                                const row = moduleItem.row, col = moduleItem.col;
                                                const $img = $(`.module-item[data-id="${moduleItem.id}"]`).hide().find('img').clone();
                                                $('.base-card').eq(index).find(`.card-section-item[data-row="${moduleItem.startRow}"][data-col=${moduleItem.startCol}]`).prepend($img);
                                                $img.attr({
                                                    'data-row': row,
                                                    'data-col': col,
                                                });
                                                $img.css({
                                                    position: 'relative',
                                                    top: 0,
                                                    left: 0,
                                                    width: col * cellWidth + (col - 1) * margin + 'px',
                                                    height: row * cellHeight + (row - 1) * margin + 'px'
                                                });
                                                $img.draggable({
                                                    helper: 'clone',
                                                    drag: function () {
                                                        $draggedModuleItem = $(this);
                                                    }
                                                });
                                            })
                                        }, 100);
                                    });
                                    resolve();
                                })
                        } else {
                            resolve();
                        }
                    })
                        .then(() => {
                            setTimeout(() => {
                                let $previousContainer = null;
                                const cellWidth = 232;
                                const margin = 5;
                                const cellHeight = 113;
                                vm.initCardDropzone();
                                $(".module-item").draggable({
                                    helper: function (event) {
                                        const $img = $(event.target).closest('.module-item').find('img').clone();
                                        const size = vm.sizeList.find(({value}) => value == $(event.target).closest('.module-item').data('size')).label.split('*');

                                        $img.css({
                                            width: parseInt(size[1]) * cellWidth + (parseInt(size[1]) - 1) * margin + 'px',
                                            height: parseInt(size[0]) * cellHeight + (parseInt(size[0]) - 1) * margin + 'px'
                                        });
                                        return $img;
                                    },
                                    start: function () {
                                        $draggedModuleItem = $(this);
                                    },
                                    drag: function () {
                                        $draggedModuleItem = $(this);
                                    }
                                });

                                $('.module-list').droppable({
                                    tolerance: 'pointer',
                                    drop: function () {
                                        var $this = $(this);
                                        if ($draggedModuleItem.is('img')) {
                                            const $moduleItem = $(`.module-item[data-id="${$draggedModuleItem.data('id')}"]`).show().attr('isuse', 0);
                                            $this.append($moduleItem);
                                            const index = vm.customModule[vm.currentPageIndex].moduleList.findIndex(({id}) => id == $draggedModuleItem.data('id'));
                                            vm.customModule[vm.currentPageIndex].moduleList.splice(index, 1);
                                            $draggedModuleItem.remove();
                                        }
                                    }
                                });
                            }, 300);
                        });
                });

        },
        methods: {
            getBackground(bgCode) {
                const backgroundMapping = {
                    bg1: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/class_brand_system/databoard_basecard.png',
                };
                return backgroundMapping[bgCode];
            },
            numberBlurHandler() {
                if(this.pageArgs.sort === undefined) {
                    this.pageArgs.sort = 1;
                } else {
                    this.pageArgs.sort = Math.floor(this.pageArgs.sort);
                }
            },
            uploadFileHandler(data) {
                if (data && data[0]) {
                    this.customModule[this.currentPageIndex].pageImage = data[0].fileUrl;
                }
            },
            deleteFileHandler() {
                this.customModule[this.currentPageIndex].pageImage = '';
            },
            saveHandler() {
                if (this.tile === '') {
                    this.$message.error('请填写模板名称');
                } else if(this.introduce === '') {
                    this.$message.error('请填写模板描述');
                } else {

                    const cardCustomModuleJson = {
                        customModule: this.customModule,
                        background: this.background
                    };
                    if (this.isEdit) {
                        updateClassCardTemplate({
                            id: this.id,
                            cardCustomModuleJson: JSON.stringify(cardCustomModuleJson),
                            introduce: this.introduce,
                            tile: this.tile
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功!'
                                    });
                                    this.$router.back();
                                }
                            });
                    } else {
                        addClassCardTemplate({
                            cardCustomModuleJson: JSON.stringify(cardCustomModuleJson),
                            introduce: this.introduce,
                            type: 2,
                            templateType: this.templateType,
                            tile: this.tile,
                            typeCode: this.typeCode
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增成功!'
                                    });
                                    this.$router.back();
                                }
                            });
                    }
                }
            },
            changeTag(pageIndex) {
                this.currentPageIndex = pageIndex;
                $('.base-card').hide().eq(pageIndex).show();
            },
            initCardDropzone(index = 0) {
                const cellWidth = 232;
                const margin = 5;
                const cellHeight = 113;
                const vm = this;
                $('.base-card').eq(index).find('.card-section-item').each(function (index, container) {
                    $(container).droppable({
                        tolerance: 'pointer',
                        hoverClass: 'card-section-item--highlight',
                        drop: function (event) {
                            var $this = $(this);
                            const size = vm.sizeList.find(({value}) => value == $draggedModuleItem.data('size')).label.split('*');

                            const row = Number.parseInt(size[0]), col = Number.parseInt(size[1]);
                            const startRow = Number.parseInt($(event.target).data('row')),
                                startCol = Number.parseInt($(event.target).data('col'));
                            if ($draggedModuleItem.is('img')) {

                                // 班牌上移动到班牌上
                                if (vm.checkPositionValid(row, col, startRow, startCol, $(event.target), $draggedModuleItem.data('id'))) {
                                    $this.prepend($draggedModuleItem);
                                    const moduleItem = vm.customModule[vm.currentPageIndex].moduleList.find(({id}) => id == $draggedModuleItem.data('id'));
                                    moduleItem.row = row;
                                    moduleItem.col = col;
                                    moduleItem.startRow = startRow;
                                    moduleItem.startCol = startCol;

                                } else {
                                    return false;
                                }
                            } else {
                                // 列表中移动到班牌上
                                const $img = $draggedModuleItem.find('img').clone();

                                if (vm.checkPositionValid(row, col, startRow, startCol, $(event.target), $img.data('id'))) {
                                    $this.prepend($img);
                                    $img.attr({
                                        'data-row': row,
                                        'data-col': col,
                                    });
                                    $img.css({
                                        position: 'relative',
                                        top: 0,
                                        left: 0,
                                        width: col * cellWidth + (col - 1) * margin + 'px',
                                        height: row * cellHeight + (row - 1) * margin + 'px'
                                    });
                                    $img.draggable({
                                        helper: 'clone',
                                        drag: function () {
                                            $draggedModuleItem = $(this);
                                        }
                                    });
                                    $draggedModuleItem.hide().attr('data-isuse', 1);
                                    vm.customModule[vm.currentPageIndex].moduleList.push({
                                        id: $draggedModuleItem.data('id'),
                                        name: $draggedModuleItem.data('name'),
                                        componentCode: $draggedModuleItem.data('code'),
                                        row, // 所占行数
                                        col, //所占列数,
                                        startRow, // 起始行号
                                        startCol, // 起始列号
                                    });
                                } else {
                                    return false;
                                }
                            }
                        }
                    });
                });
            },

            editPageClick(pageItem) {
                this.isAddPage = false;
                this.editPage = pageItem;
                this.pageArgs = {
                    pageName: pageItem.pageName,
                    sort: pageItem.sort
                };
                this.isShowPageDialog = true;
            },
            deletePage(pageIndex) {
                this.$confirm('确定要删除吗？', '提示', {
                    type: 'error'
                }).then(() => {
                    $('.base-card').eq(pageIndex).find('img').each(function (index, img) {
                        const $moduleItem = $(`.module-item[data-id="${$(img).data('id')}"]`).show().attr('isuse', 0);
                        $('.module-list').append($moduleItem);
                    });
                    setTimeout(() => {
                        this.currentPageIndex = 0;
                        this.customModule.splice(pageIndex, 1);
                        this.files.splice(pageIndex, 1);
                        $('.base-card').eq(pageIndex).remove();
                        this.changeTag(0);
                    }, 100);
                });
            },
            addPageClick() {
                this.isAddPage = true;
                this.pageArgs = {
                    pageName: '',
                    sort: 1
                };
                this.isShowPageDialog = true;
            },
            changePage(sort = null) {
                this.$refs.pageForm.validate((isValid) => {
                    if (isValid) {
                        if (this.isAddPage) {
                            let insertIndex = this.customModule.findIndex(({sort}) => sort > this.pageArgs.sort);
                            insertIndex = insertIndex === -1 ? this.customModule.length : insertIndex;

                            this.customModule.splice(insertIndex, 0, {
                                pageName: this.pageArgs.pageName,
                                sort: this.pageArgs.sort,
                                moduleList: [],
                                pageImage: ''
                            });

                            this.currentPageIndex = insertIndex;

                            let htmlStr = '<div class="base-card">';
                            for (let row = 1; row <= 3; row++) {
                                for (let col = 1; col <= 4; col++) {
                                    htmlStr += `<div class="card-section-item card-section-item--col${col} card-section-item--row${row}" data-row="${row}" data-col="${col}"><i class="fa fa-close"></i></div>`;
                                }
                            }
                            htmlStr += '</div>';
                            if (insertIndex === this.customModule.length - 1) {
                                $('.base-card-container').append(htmlStr);
                            } else {
                                $('.base-card').eq(insertIndex).before(htmlStr);
                            }
                            setTimeout(() => {
                                this.initCardDropzone(insertIndex);
                                this.changeTag(insertIndex);
                            }, 100);
                        } else {
                            const oldIndex = this.customModule.findIndex(item => item === this.editPage);
                            let insertIndex = this.customModule.findIndex(({sort}) => {
                                return sort > this.pageArgs.sort
                            });
                            insertIndex = insertIndex === -1 ? this.customModule.length : insertIndex;
                            this.editPage.sort = this.pageArgs.sort;
                            this.editPage.pageName = this.pageArgs.pageName;
                            this.customModule.sort((item1, item2) => {
                                return item1.sort - item2.sort;
                            });
                            window.$ = $;
                            if(insertIndex === this.customModule.length) {
                                $('.base-card').eq(oldIndex).insertAfter($('.base-card').eq(insertIndex - 1));
                            } else {
                                $('.base-card').eq(oldIndex).insertBefore($('.base-card').eq(insertIndex));
                            }


                            setTimeout(() => {
                                this.changeTag(insertIndex === this.customModule.length ? insertIndex - 1 : insertIndex);
                            }, 100);
                        }
                        this.isShowPageDialog = false;
                    }
                })
            },
            nameSearch() {
                const $moduleItem = $('.module-list').find('.module-item');
                if (this.currentSize !== 0) {
                    $moduleItem.hide().filter(`[data-isuse=0][data-size="${this.currentSize}"]${this.moduleSearchTitle !== '' ? `[data-name*="${this.moduleSearchTitle}"]` : ''}`).show();
                } else {
                    $moduleItem.hide().filter(`[data-isuse=0]${this.moduleSearchTitle !== '' ? `[data-name*="${this.moduleSearchTitle}"]` : ''}`).show();
                }
            },
            checkPositionValid(row, col, startRow, startCol, $dropContainer, id) {
                const vm = this;
                if (startRow - 1 + row <= 4 && startCol - 1 + col <= 4) {
                    let isValid = true;
                    const dropContainerIndex = $dropContainer.index();
                    const positionArray = [];
                    for (let i = startRow; i < row + startRow; i++) {
                        for (let j = startCol; j < col + startCol; j++) {
                            positionArray.push(`${i},${j}`);
                        }
                    }
                    $dropContainer.closest('.base-card').find('.card-section-item').each(function (index, item) {
                        const $item = $(item);
                        if ($item.find('img').length !== 0) {
                            const $img = $item.find('img');
                            if ($img.data('id') != id) {
                                const imgCol = Number.parseInt($img.data('col')),
                                    imgRow = Number.parseInt($img.data('row'));
                                const imgStartCol = Number.parseInt($item.data('col')),
                                    imgStartRow = Number.parseInt($item.data('row'));

                                const imgPositionArray = [];
                                for (let i = imgStartRow; i < imgRow + imgStartRow; i++) {
                                    for (let j = imgStartCol; j < imgCol + imgStartCol; j++) {
                                        imgPositionArray.push(`${i},${j}`);
                                    }
                                }
                                if (lodash.intersection(imgPositionArray, positionArray).length !== 0) {
                                    vm.$message.error('无效拖拽');
                                    isValid = false;
                                    return false;
                                }
                            }
                        }
                    });
                    return isValid;
                } else {
                    vm.$message.error('无效拖拽');
                    return false;
                }
            }
        }
    }
</script>

<style lang="scss">
    @import "../../../../src/styles/mixin.scss";

    #templateDataboardCustomSetting {
        .base-card--bg {
            @include wh(960px, 540px);
            background: no-repeat center center / 100% 100%;
            position: absolute;
            top: 10px;
        }
        .info-container {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.85);
        }

        .base-card {
            @include wh(960px, 540px);
            background: no-repeat center center / 100% 100%;
            display: none;
        }

        .base-card--current {
            display: block;
        }

        .base-card-container {
            float: left;
            margin-top: 10px;
            margin-right: 20px;
            @include wh(960px, 540px);
            background: no-repeat center center / 100% 100%;
        }

        .module-container {
            float: left;
            width: 350px;
            margin-left: 20px;
            margin-top: 10px;
            padding:12px;
            background: #f4f4f5;
            height: 600px;
            color: rgba(0, 0, 0, 0.65);
        }

        .base-card {
            position: relative;
        }

        .card-section-item {
            height: 113px;
            width: 232px;
            position: absolute;
            box-sizing: border-box;
            /*img {*/
            /*    z-index: 2000;*/
            /*}*/
        }

        .card-section-item--col1 {
            left: 9px;
        }

        .card-section-item--col2 {
            left: 246px;
        }

        .card-section-item--col3 {
            left: 483px;
        }

        .card-section-item--col4 {
            left: 720px;
        }

        .card-section-item--row1 {
            top: 56px;
        }

        .card-section-item--row2 {
            top: 174px;
        }

        .card-section-item--row3 {
            top: 292px;
        }
        .card-section-item--row4 {
            top: 410px;
        }
        .card-section-item--highlight {
            border: 3px solid #1AAD19;
        }

        .module-container {
            background-color: #F4F4F5;

            .module-container__title {
                font-weight: bold;
                font-size: 18px;
                margin-bottom: 10px;
            }

            .module-list {
                height: 512px;
                overflow-y: auto;
                @include scrollBar;
            }

            .module-item {
                border: 1px solid #ccc;
                box-sizing: border-box;
                height: 200px;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 7px;
                padding: 10px;
                margin: 10px 0;

                &:hover {
                    border-color: #2c91e9;
                }

                .module-item__photo {
                    width: 105px;

                    img {
                        width: 100%;
                    }
                }

                .module-item__info-container {
                    flex: 1;
                    margin-left: 15px;

                    & > * {
                        margin-bottom: 10px;
                    }
                }

                .module-item__name {
                    font-size: 16px;
                    font-weight: bold;
                }
            }
        }

        .page-tag-container {
            margin-top: 10px;
        }

        .page-tag-item {
            padding: 5px;
            width: 120px;
            border: 1px solid #666;
            border-radius: 5px;
            text-align: center;
            font-size: 14px;
            @include middleIB;
            margin-right: 10px;
            cursor: pointer;

            &.page-tag-item--active {
                border-color: #409EFF;
                color: #409EFF;
            }

            & > * {
                @include middleIB;

            }
            .page-name {
                max-width: 50%;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
            }

            .fa-edit {
                color: #409EFF;
            }

            .fa-trash {
                color: #F08080;
            }
        }

        .page-tag-item-add {
            @include middleIB;
            width: 20px;
            height: 20px;
            text-align: center;
            line-height: 20px;
            border: 1px solid #409EFF;
            border-radius: 50%;
            cursor: pointer;
            box-sizing: border-box;
            color: #409EFF;
        }

        .main-container {
            @include clearfix;
            position: relative;
            min-width: 1400px;
        }

        .required-hint {
            color: #ff0000;
            margin-right: 5px;
        }

        .page-preview {
            display: inline-block;
            vertical-align: top;
        }
        .fa-close {
            color: #ff0000;
            position: absolute;
            left: 5px;
            top: 5px;
            z-index: 3500;
            display: none;
            cursor: pointer;
        }
        .card-section-item:hover {
            img + .fa-close {
                display: block;
            }
        }
    }


</style>
<style scoped>
    .input-with-select .el-input-group__prepend {
        background-color: #fff;
    }
</style>
