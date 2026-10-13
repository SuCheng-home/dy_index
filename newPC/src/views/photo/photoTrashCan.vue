<template>
    <div class="page">
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <template v-if="albumList && albumList.length > 0">
                <div class="header">
                    <el-button type="primary"  size="medium" @click="updateAlbum(1)" v-if="isShowByPermission('/album/RecyAlbum')">还原相册</el-button>
                    <el-button type="danger"  size="medium" @click="updateAlbum(3)" v-if="isShowByPermission('/album/thoroughDelAlbum')">彻底删除</el-button>
                </div>
                <div class="album-list">
                    <div class="album-item" v-for="albumItem in albumList">
                        <div class="album-item__cover">
                            <img v-if="albumItem.cover" :src="albumItem.cover.minPic" />
                            <img v-else src="../../assets/images/common/alubmbackground.png" />
                        </div>
                        <div class="album-item__info">
                            <input type="checkbox" v-model="selectedAlbum" :value="albumItem.id" />
                            <el-tooltip class="item" effect="dark" :content="albumItem.name" placement="top">
                                <div>{{albumItem.name}}</div>
                            </el-tooltip>
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="photoList && photoList.length > 0">
                <div class="header">
                    <el-button type="primary" size="medium" @click="updatePhoto(1)" v-if="isShowByPermission('/album/RecyPhoto')">还原照片</el-button>
                    <el-button type="danger" size="medium" @click="updatePhoto(3)" v-if="isShowByPermission('/album/thoroughDelPhoto')">彻底删除</el-button>
                </div>
                <div class="photo-list">
                    <div class="photo-item" v-for="photoItem in photoList">
                        <input type="checkbox" v-model="selectedPhoto" :value="photoItem.id" />
                        <div>
                            <img :src="photoItem.minPic" />
                        </div>
                    </div>
                </div>
            </template>
            <template v-if="isHaveVideo && videoList && videoList.length > 0">
                <div class="header">
                    <el-button type="primary" size="medium" @click="updateVideo(1, true)" v-if="isShowByPermission('/album/RecyPhoto')">还原视频</el-button>
                    <el-button type="danger" size="medium" @click="updateVideo(3, true)" v-if="isShowByPermission('/album/thoroughDelPhoto')">彻底删除</el-button>
                </div>
                <div class="photo-list">
                    <div class="photo-item" v-for="videoItem in videoList">
                        <input type="checkbox" v-model="selectedVideo" :value="videoItem.id" />
                        <div>
                            <img :src="videoItem.minPic || 'https://cdnfile-10043692.file.myqcloud.com/admin/images/video-bg-default-2.png'" />
                        </div>
                    </div>
                </div>
            </template>
            <default-page v-if="!(photoList && photoList.length > 0) && !(albumList && albumList.length > 0)" Mes="暂无相册或照片"></default-page>
        </div>
    </div>
</template>

<script>
    import DefaultPage from '@/components/DefaultPage';

    import {isShowByPermission} from '@/utils';

    import {
        albumRecy,
        updateAlbumState,
        updatePhotoState,
        getAlbumInit
    } from '@/api/photo'
    import mixin from '@/mixins/windowResize';
    import {mapGetters} from 'vuex';

    export default {
        name: "photoTrashCan",
        data() {
            return {
                albumList: [],
                photoList: [],
                videoList: [],
                selectedAlbum: [],
                selectedPhoto: [],
                selectedVideo: [],
                isHaveVideo: false,

            }
        },
        mixins: [mixin],
        created() {
            this.albumRecyFunc();
            getAlbumInit()
                .then(res => res.data)
                .then(data => {
                    this.isHaveVideo = data.data.isHaveVideo == 2;
                })
        },
        computed: {
            ...mapGetters(['isStandalone'])
        },
        components: {DefaultPage},
        methods: {
            isShowByPermission,
            updateAlbum(isDelete) {
                if(this.selectedAlbum.length === 0) {
                    this.$message.error('请选择相册！')
                } else {
                    this.$confirm(`您是否要${isDelete === 1 ? '还原' : '删除'}该相册？`, isDelete === 1 ? '还原' : '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updateAlbumState({
                            ids: this.selectedAlbum.join(','),
                            isDelete
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: `已${isDelete === 1 ? '还原' : '删除'}相册!`,
                                    });
                                    this.selectedAlbum = [];
                                    this.albumRecyFunc();
                                }
                            })
                    }).catch(() => {
                    });
                }
            },
            updatePhoto(isDelete) {
                if(this.selectedPhoto.length === 0) {
                    this.$message.error('请选择照片！')
                } else {
                    this.$confirm(`您是否要${isDelete === 1 ? '还原' : '删除'}该照片？`, isDelete === 1 ? '还原' : '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updatePhotoState({
                            ids: this.selectedPhoto.join(','),
                            isDelete
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: `已${isDelete === 1 ? '还原' : '删除'}照片!`,
                                    });
                                    this.selectedPhoto = [];
                                    this.albumRecyFunc();
                                }
                            })
                    }).catch(() => {
                    });
                }
            },
            updateVideo(isDelete) {
                if(this.selectedVideo.length === 0) {
                    this.$message.error('请选择视频！')
                } else {
                    this.$confirm(`您是否要${isDelete === 1 ? '还原' : '删除'}该视频？`, isDelete === 1 ? '还原' : '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        updatePhotoState({
                            ids: this.selectedVideo.join(','),
                            isDelete
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: `已${isDelete === 1 ? '还原' : '删除'}照片!`,
                                    });
                                    this.selectedVideo = [];
                                    this.albumRecyFunc();
                                }
                            })
                    }).catch(() => {
                    });
                }
            },
            albumRecyFunc() {
                albumRecy()
                    .then(res => res.data)
                    .then(data => {
                        this.albumList = data.data.albumlist;
                        this.photoList = data.data.photoList;
                        this.videoList = data.data.videoList;
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
        margin-bottom: 10px;
    }
    .header {
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
        clear: both;
    }
    .album-list {
        @include clearfix;
        margin-bottom: 10px;
        padding-top: 10px;

    }
    .photo-list{
        padding-top: 10px;
        @include clearfix;
    }
    .album-item {
        box-sizing: content-box !important;
        background-color: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,.15);
        padding: 6px;
        float: left;
        margin: 0 15px 15px 0;
        width: 125px;
        .album-item__cover {
            width: 125px;
            height: 125px;
            img {
                width: 100%;
                height: 100%;
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
    .photo-item {
        background-color: #fff;
        box-shadow: 0 1px 4px rgba(0,0,0,.15);
        float: left;
        margin: 0 15px 15px 0;
        position: relative;
        input {
            position: absolute;
            left: 5px;
            top: 5px;
        }
        img {
            width: 125px;
            height: 125px;
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
