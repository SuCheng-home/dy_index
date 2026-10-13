<template>
    <div class="page" id="photoClassList">
        <div class="page-header">
            <el-button type="primary"  size="medium" @click="createAlbum(1)" v-if="isShowByPermission('/album/addAlbumPage')">创建班级相册</el-button>
            <el-button type="danger"  size="medium" @click="deleteAlbum" v-if="isShowByPermission('/album/delAlbum')">删除</el-button>
        </div>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <div class="section" v-if="isShowByPermission('/album/classCirclePic') && isShowClassCircle">
                <div class="section-header">班级圈</div>
                <div class="section-main">
                    <div v-if="albumItem.length !== 0" @click="jumpToPage('photoList', {albumId: albumInfo.split(',')[0], isClassCircle: 1, className: albumInfo.split(',')[1]})" class="album-item" v-for="(albumItem, albumInfo) in classCirclePicMap">
                        <div class="album-item__cover">
                            <div class="photo" :style="{backgroundImage: `url(${albumItem[0].picUrl})`}"></div>
                        </div>
                        <div class="album-item__info">
                            {{albumInfo.split(',')[1]}}
                        </div>
                    </div>
                </div>
            </div>

            <div v-if="isShowClassPhoto" class="section" v-for="(sectionItem, sectionInfo) in albumByTeacherMap">
                <div class="section-header">{{sectionInfo.split(',')[1]}}</div>
                <div class="section-main">
                    <div @click="jumpToPage('photoList', {albumId: albumItem.id})" class="album-item" v-for="(albumItem, albumInfo) in sectionItem">
                        <div class="album-item__cover">
                            <div v-if="albumItem.cover" class="photo" :style="{backgroundImage: `url(${albumItem.cover.minPic})`}"></div>
                            <div v-else class="photo photo--default"></div>
                        </div>
                        <div class="album-item__info">
                            <input @click.stop type="checkbox" v-model="selectedAlbum" :value="albumItem.id" />
                            <el-tooltip class="item" effect="dark" :content="albumItem.name" placement="top">
                                <div>{{albumItem.name}}</div>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </div>

        </div>
        <default-page v-if="!isShowClassCircle && !isShowClassPhoto" Mes="暂无相册"></default-page>

        <el-dialog title="创建" :visible.sync="isShowDialog" custorm-class="dialog"
                   :close-on-press-escape="false"
                   :close-on-click-modal="false"
        >
            <div class="examForm">
                <el-form ref="form" :model="createQuery" :rules="rules" label-width="80px">
                    <el-form-item label="相册名称" prop="name">
                        <el-input v-model.trim="createQuery.name" :maxlength="15" placeholder="相册名称(1-15个字符)"></el-input>
                    </el-form-item>
                    <el-form-item label="相册描述">
                        <el-input type="textarea" :rows="3" :maxlength="100" v-model.trim="createQuery.infomation" placeholder="相册描述(1-100个字符)"></el-input>
                    </el-form-item>
                    <el-form-item v-if="albumType === 1" label="所属班级" prop="depart">
                        <el-select v-model="createQuery.departId" placeholder="请选择">
                            <el-option v-for="item in classList" :key="item.classId" :label="item.className"
                                       :value="item.classId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isShowDialog = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="createAlbumConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {isShowByPermission, isShowByRole} from '@/utils';
    import { listGetAlbum, delAlbum, addAlbum } from '@/api/photo';
    import { queryAllClassCourse} from '@/api/common/common';
    import {
        mapGetters
    } from 'vuex';
    import mixin from '@/mixins/windowResize';
    import DefaultPage from '@/components/DefaultPage';
    export default {
        name: "photoClassList",
        data() {
            const departValidator = (rule, value, callback) => {
                if (!this.createQuery.departId && this.albumType === 1) {
                    return callback(new Error('请选择相册所属班级！'));
                } else {
                    callback();
                }
            };

            return {
                classCirclePicMap: {},
                albumByTeacherMap: {},
                selectedAlbum: [],
                classList: [],
                isShowClassPhoto: true,
                isShowClassCircle: true,
                isShowDialog: false,
                createQuery: {
                    departId: null,
                    infomation: '',
                    name: ''
                },
                rules: {
                    name: [
                        {required: true, message: '请输入相册名称！', trigger: 'blur'},
                    ],
                    depart: [
                        {required: true, validator: departValidator, trigger: 'blur'},
                    ],
                },
                albumType: 1,
            }
        },
        computed: {
            ...mapGetters(['userInfo', 'isStandalone'])
        },
        components: {DefaultPage},
        mixins: [mixin],
        mounted() {
            this.listGetAlbumFunc();
            queryAllClassCourse({
                teacherId: this.userInfo.id
            })
                .then(res => res.data)
                .then(data => {
                    this.classList = data.data;
                    if(data.data.length !== 0) {
                        this.createQuery.departId = data.data[0].classId;
                    }
                })
        },
        methods: {
            isShowByPermission,
            isShowByRole,
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            deleteAlbum() {
                if(this.selectedAlbum.length === 0) {
                    this.$message.error('请选择删除的相册！');
                } else {
                    this.$confirm('确定要把相册放入回收站吗？', '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delAlbum({
                            ids: this.selectedAlbum.join(',')
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!',
                                    });
                                    this.selectedAlbum = [];
                                    this.listGetAlbumFunc();
                                }
                            })
                    }).catch(() => {
                    });
                }
            },
            createAlbum(albumType) {
                this.albumType = albumType;
                this.isShowDialog = true;
            },
            createAlbumConfirm() {
                this.$refs.form.validate((isValid) => {
                    if(isValid) {
                        let query = {
                            albumType: this.albumType,
                            infomation: this.createQuery.infomation,
                            name: this.createQuery.name
                        };
                        if(this.albumType === 1) {
                            query = Object.assign({}, {
                                departId: this.createQuery.departId
                            }, query);
                        }
                        addAlbum(query)
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: '创建成功!',
                                    });
                                    this.listGetAlbumFunc();
                                    this.createQuery = {
                                        name: '',
                                        infomation: '',
                                        departId: this.classList.length > 0 ? this.classList[0].classId : null
                                    };
                                    this.isShowDialog = false;
                                }
                            })
                    }
                })
            },
            listGetAlbumFunc() {
                listGetAlbum()
                    .then(res => res.data)
                    .then(data => {
                        const pageData = data.data;
                        this.classCirclePicMap = pageData.classCirclePicMap;
                        this.isShowClassCircle = Object.keys(pageData.classCirclePicMap).some(key => pageData.classCirclePicMap[key] && pageData.classCirclePicMap[key].length !== 0);
                        this.albumByTeacherMap = pageData.albumByTeacherMap;
                        this.isShowClassPhoto = Object.keys(pageData.albumByTeacherMap).length !== 0;
                    });
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "../../styles/mixin";

    .page {
        padding:12px;
    }
    .page-header {
        border-bottom: 1px solid #e7eaec;
        margin-bottom: 10px;
        padding-bottom: 10px;
    }
    .section-header {
        line-height: 16px;
        font-size: 16px;
        border-left: 4px solid #409EFF;
        padding-left: 10px;
        margin: 18px 0;
        color: #606266;
    }
    .section-main {
        @include clearfix;
    }
    .album-item {
        box-sizing: content-box !important;
        background-color: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,.15);
        padding: 6px;
        float: left;
        width: 125px;
        margin: 0 15px 15px 0;
        cursor: pointer;
        .album-item__cover {
            width: 125px;
            height: 125px;
            .photo {
                width: 100%;
                height: 100%;
                @include cover-bg;
            }
            .photo--default {
                background-image: url(../../assets/images/common/alubmbackground.png)
            }
        }
        .album-item__info {
            margin-top: 8px;
            font-size: 14px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            word-break: break-all;
            div {
                width: 100px;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            & > * {
                @include middleIB;
            }
        }
    }
    input[type=checkbox] {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        width: 16px;
        height: 16px;
    }
    .page-main--scroller {
        overflow-y: auto;
        height: 600px;
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

</style>
<style lang="scss">
    #photoClassList {
        .dialog {
            max-width: 600px;
        }
    }
</style>
