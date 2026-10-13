<template>
    <div class="app-container">
        <div class="filter-container">
            <el-button type="default" @click.native="$router.back()">返回</el-button>
            <el-button type="primary" @click.native="jumpToPage('moduleAddEdit')">新增组件</el-button>
            <el-select v-model="currentSize">
                <el-option
                    v-for="sizeItem in sizeList"
                    :key="sizeItem.value"
                    :label="sizeItem.label"
                    :value="sizeItem.value">
                </el-option>
            </el-select>
            <el-select v-model="componentType" placeholder="请选择" @change="getClassCardComponentListFunc">
                <el-option label="班牌" :value="1"></el-option>
                <el-option label="校牌" :value="2"></el-option>
                <el-option label="区牌" :value="3"></el-option>
            </el-select>
            <el-select v-model="comSysType" placeholder="请选择" @change="getClassCardComponentListFunc">
                <el-option label="微校+" :value="1"></el-option>
                <el-option label="成长乐园" :value="4"></el-option>
            </el-select>
            <el-input class="search-input search-input--right" v-model.trim="searchTitle"
                      placeholder="组件名称">
                <el-button slot="append" icon="el-icon-search"></el-button>
            </el-input>
        </div>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <image-previewer tag="richtext" viewclass="image">
                <div :title="moduleItem.introduce" class="module-item" v-if="(currentSize === 0 || moduleItem.sizeInfo == currentSize) && (searchTitle === '' || moduleItem.title.indexOf(searchTitle) !== -1)" v-for="moduleItem in moduleList">
                    <div class="module-item__photo">
                        <img :src="moduleItem.cover" class="image" />
                    </div>
                    <div class="module-item__info-container">
                        <div class="module-item__name">
                            {{moduleItem.title}}
                        </div>
                        <div class="module-item__size">
                            大小：{{moduleItem.sizeInfo | parseSize}}
                        </div>
                    </div>
                    <i class="fa fa-edit" @click="jumpToPage('moduleAddEdit', {id: moduleItem.id})"></i>
                    <i class="fa fa-trash" @click="deleteModule(moduleItem.id)"></i>
                </div>
            </image-previewer>
        </div>
    </div>
</template>

<script>
    import {
        getClassCardComponentList,
        delClassCardComponent
    } from '@/api/classcardManagement';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';
    import {mapGetters} from 'vuex';
    import sizeList from "../moduleSize";

    export default {
        name: "moduleList",
        computed: {
            ...mapGetters(['isStandalone'])
        },
        components: {ImagePreviewer},
        data() {
            return {
                sizeList,
                componentType: 1,
                comSysType: 1,
                currentSize: 0,
                searchTitle: '',
                moduleList: [],
            }
        },
        created() {
            this.getClassCardComponentListFunc();
        },
        filters: {
            parseSize(moduleValue) {
                return sizeList.find(({value}) => value == moduleValue).label;
            }
        },
        methods: {
            getClassCardComponentListFunc() {
                getClassCardComponentList()
                    .then(res => res.data)
                    .then(data => {
                        this.moduleList = data.data.filter(({componentType, comSysType}) => componentType === this.componentType && comSysType === this.comSysType);
                    });
            },
            deleteModule(componentId) {
                this.$confirm('是否确认要删除该模块？', '删除', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    delClassCardComponent({
                        componentId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.getClassCardComponentListFunc();
                            }
                        })
                });
            },
            jumpToPage (path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .page-main--scroller {
        overflow-y: auto;
        height: 600px;
        overflow-x: hidden;
    }
    .page-main--scroller::-webkit-scrollbar {
        width: 6px;
    }
    .page-main--scroller::-webkit-scrollbar-thumb {
        background: #99a9bf;
        border-radius: 20px;
    }
    .page-main--scroller::-webkit-scrollbar-track-piece {
        background: #d3dce6;
    }
    .module-item {
        width: 22%;
        border: 1px solid #999;
        float: left;
        margin: 5px 2% 5px 0;
        box-sizing: border-box;
        padding: 16px;
        height: 180px;
        display: inline-block;
        position: relative;
        .module-item__photo {
            float: left;
            width: 60%;
            max-height: 100%;
            max-width: 100% !important;
            overflow: hidden;;
            img {
                width: 100%;
                max-width: 100% !important;
            }
        }
        .module-item__info-container {
            float: right;
            margin-top: 40px;
            width: 35%;
            font-size: 14px;
            & > * {
                margin-bottom: 20px;
            }
            .module-item__size {
                color: #666;
            }
        }
        .module-item__name {
            font-size: 20px;
        }
        .fa {
            position: absolute;
            cursor: pointer;
            display: none;
        }
        &:hover .fa {
            display: block;
        }
        .fa-edit {
            right: 40px;
            color: #87cefa;
        }
        .fa-trash {
            right: 20px;
            color: #f08080;
        }
    }
</style>
