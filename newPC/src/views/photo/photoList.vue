<template>
    <div id="photoList" class="page">
        <div class="page-header">
            <el-button type="default" size="medium" @click="$router.back()">返回</el-button>
            <template v-if="!isClassCircle && (!isSchool || isShowByRole(118))">
                <label v-show="activeName === 'photo'" id="img-upload-label" for="img-upload" v-if="isShowByPermission('/album/download')">上传照片</label>
                <input type="file" id="img-upload" accept="image/*" multiple @change="upload($event)" style="display:none;">
                <video-uploader module="xiangce" moduleCode="1219" v-show="activeName === 'video'" v-if="isHaveVideo" btnText="上传视频" isProgressOnBtn @inputVideo="inputVideo" @inputVideoAll="inputVideoAll" multiple></video-uploader>
                <el-button type="danger" @click="deletePhoto" v-if="isShowByPermission('/album/delPhoto')" size="medium">删除</el-button>
                <el-button v-show="activeName === 'photo'" type="primary" @click="setCover" v-if="isShowByPermission('/album/updateAlbumCover')" size="medium">设置为封面</el-button>
                <el-button type="primary" @click="movePhoto" size="medium" v-if="isShowByPermission('/album/movePhoto') &&
                    (schoolAlbumList.length > 0 && isSchool) ||
                    (Object.keys(albumByTeacherMap).length > 1 || Object.keys(albumByTeacherMap)[0] && albumByTeacherMap[Object.keys(albumByTeacherMap)[0]].length > 0 && !isSchool)
                ">移动到相册</el-button>
            </template>
            <el-button v-show="activeName === 'photo'" v-if="!isSchool || isShowByRole(118)" type="primary" @click="exportPhotos" size="medium">导出全部</el-button>
        </div>
        <div :class="['page-main', isStandalone ? 'page-main--scroller' : '']">
            <div class="album-header">
                <div class="album-header__checkbox-container" v-if="!isClassCircle">
                    <label><input type="checkbox" @change="selectAll" v-model="isSelectAll" />本页全选</label>
                </div>
                <div class="album-name">
                    {{isClassCircle ? '班级圈' : albumInfo.name}}
                    &nbsp;
                    <el-button v-if="isShowByPermission('/album/updateAlbum') && !isClassCircle && (!isSchool || isShowByRole(118))" type="text" @click="isShowEditDialog = true"><span class="edit-btn">编辑相册信息</span></el-button>
                </div>
                <div class="album-info" v-if="!isClassCircle">
                    {{albumInfo.infomation}}
                </div>
            </div>
            <el-tabs v-if="isHaveVideo" v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="照片" name="photo"></el-tab-pane>
                <el-tab-pane label="视频" name="video"></el-tab-pane>
            </el-tabs>
            <template v-if="!isClassCircle">
                <div class="photo-list" v-show="activeName === 'photo'">
                    <image-previewer tag="richtext" viewclass="photo" :images="previewPhotoList">
                        <div class="photo-item" v-for="photoItem in photoList">
                            <input type="checkbox" v-model="selectedPhoto" :value="photoItem.id" />
                            <div>
                                <div class="photo" :style="{backgroundImage: `url(${photoItem.minPic})`}"></div>
                                <div class="photo-item__remark" v-if="!isClassCircle" @click.stop="editRemark(photoItem)"><i class="el-icon-edit" v-if="(!isSchool || isShowByRole(118)) && !isClassCircle"></i>{{photoItem.remark || '描述'}}</div>
                            </div>
                        </div>
                    </image-previewer>
                </div>
                <div class="photo-list" v-show="activeName === 'video'">
                    <div class="photo-item" @click="showVideo(videoItem)" v-for="videoItem in videoList">
                        <input @click.stop type="checkbox" v-model="selectedPhoto" :value="videoItem.id" />
                        <i class="fa fa-play-circle-o " v-if="videoItem.minPic"></i>
                        <div>
                            <div class="photo" :style="{backgroundImage: `url(${videoItem.minPic || 'https://cdnfile-10043692.file.myqcloud.com/admin/images/video-bg-default-2.png'})`}"></div>
                            <div class="photo-item__remark" v-if="!isClassCircle" @click.stop="editRemark(videoItem)"><i class="el-icon-edit" v-if="(!isSchool || isShowByRole(118)) && !isClassCircle"></i>{{videoItem.remark || '描述'}}</div>
                        </div>
                    </div>
                </div>
            </template>

            <div class="photo-list" v-else>
                <image-previewer tag="richtext" viewclass="photo" :images="classCirclePicList">
                    <div class="photo-item" v-for="photoItem in classCirclePicList">
                        <div>
                            <div class="photo" :style="{backgroundImage: `url(${photoItem.picUrl})`}"></div>
                        </div>
                    </div>
                </image-previewer>
            </div>
        </div>
        <div v-if="isShowRemarkText" class="remark-text">{{remark || '描述'}}</div>

        <el-dialog title="移动到相册" :visible.sync="isShowMoveDialog" custom-class="dialog">
            <div>
                <el-form ref="form" label-width="80px">
                    <el-form-item v-if="isSchool" label="选择相册">
                        <el-select v-model="moveTargetAlbumId" placeholder="请选择">
                            <el-option v-for="albumItem in schoolAlbumList" :key="albumItem.id" :label="albumItem.name"
                                       :value="albumItem.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-else label="选择相册">
                        <el-select v-model="moveTargetAlbumId" placeholder="请选择">
                            <template v-for="item in albumByTeacherMap">
                                <el-option v-for="albumItem in item" :key="albumItem.id" :label="`${albumItem.name}`"
                                           :value="albumItem.id">
                                </el-option>
                            </template>
                        </el-select>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowMoveDialog = false">取 消</el-button>
                <el-button type="primary" @click="movePhotoConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="修改相册" :visible.sync="isShowEditDialog" custom-class="dialog">
            <el-form :model="albumInfoQuery" ref="albumForm" label-width="140px" :rules="albumFormRule">
                <el-form-item label="相册名称" prop="name">
                    <el-input v-model.trim="albumInfoQuery.name" :maxlength="15" placeholder="相册名称（1-15个字符）"></el-input>
                </el-form-item>
                <el-form-item label="相册描述">
                    <el-input v-model.trim="albumInfoQuery.infomation" type="textarea" :maxlength="100" :rows="3" placeholder="相册描述（1-100个字符）"></el-input>
                </el-form-item>
                  <el-form-item label="相册上传权限" v-if="isSchool">
                          <el-radio v-model="albumInfoQuery.isPublic" :label="1">仅管理员上传</el-radio>
                          <el-radio v-model="albumInfoQuery.isPublic" :label="2">所有人可上传</el-radio>
                     </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowEditDialog = false">取 消</el-button>
                <el-button type="primary" @click="editAlbumConfirm">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog title="视频" :visible.sync="isShowVideo" @close="isShowRemarkText = false" custom-class="video-dialog">
            <div>
                <video id="video-container" :src="videoUrl" class="video-container" controls="controls"></video>
            </div>
        </el-dialog>
        <el-dialog title="修改描述" :visible.sync="isShowRemark" custom-class="dialog">
            <div>
                <el-form ref="remarkForm" :model="remarkForm" :rules="remarkFormRule" label-width="80px">
                    <el-form-item label="描述" prop="remark">
                        <el-input type="textarea" v-model.trim="remarkForm.remark" :maxlength='50' :rows="4" placeholder='请输入描述'></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShowRemark = false">取 消</el-button>
                <el-button type="primary" @click="editRemarkConfirm">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {isShowByPermission, isShowByRole} from '@/utils';
    import {
        getWxCosFileSign,
        addWxfileInfo,
        delWxfileInfo
    } from '@/api/common/common';
    import _ from 'lodash';

    import {mapGetters} from 'vuex';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer';
    import VideoUploader from '@/components/Uploader/VideoUploader';
    import {
        listGetAlbum,
        showPhoto,
        delPhoto,
        updateAlbumCover,
        movePhoto,
        addPhoto,
        updateAlbum,
        exportAlbumPicList,
        exportClassCircleAlbumPicList,
        getAlbumInit,
        updatePhotoState
    } from '@/api/photo';

    export default {
        name: "photoList",
        data() {
            return {
                cos: null,
                bucket: '',// 存储桶名称，需修改
                region: 'ap-shanghai',

                isShowEditDialog: false,

                isShowMoveDialog: false,
                moveTargetAlbumId: null,

                albumId: this.$route.query.albumId,
                isClassCircle: this.$route.query.isClassCircle == 1,
                isSchool: this.$route.query.isSchool == 1,
                albumInfo: {
                    name: '--',
                    infomation: '--'
                },
                albumInfoQuery: {
                    name: '',
                    infomation: '',
                    isPublic:1
                },
                albumFormRule: {
                    name: [{
                        required: true, trigger: 'blur', message: '请填写相册名称'
                    }]
                },

                photoList: [],
                previewPhotoList: [],
                videoList: [],
                selectedPhoto: [],
                isSelectAll: false,

                schoolAlbumList: [],
                albumByTeacherMap: [],
                classCirclePicList: [],

                activeName: 'photo',
                upPhotoCount: 0,

                className: this.$route.query.className,

                isHaveVideo: false,
                isShowVideo: false,
                videoUrl: '',

                remarkForm: {
                    remark: ''
                },
                remarkFormRule: {
                    remark: [{
                        required: true, trigger: 'blur', message: '请填写描述'
                    }]
                },
                isShowRemark: false,
                isShowRemarkText: false,
                remark: '',
                editPhoto: {}
            }
        },
        computed: {
            ...mapGetters(['isStandalone', 'schoolInfo'])
        },
        components: {ImagePreviewer, VideoUploader},
        created() {

            if(!this.isClassCircle) {
                this.showPhotoFunc();
                getAlbumInit()
                    .then(res => res.data)
                    .then(data => {
                        this.isHaveVideo = data.data.isHaveVideo == 2;
                    });
            }
            listGetAlbum()
                .then(res => res.data)
                .then(data => {
                    const pageData = data.data;

                    if(this.isClassCircle) {
                        let classCirclePicList = [];
                        Object.keys(pageData.classCirclePicMap).forEach(key => {
                            if(key.split(',')[0] == this.albumId) {
                                classCirclePicList = pageData.classCirclePicMap[key];
                            }
                        });
                        classCirclePicList.forEach(item => {
                            item.src = item.picUrl;
                        });
                        this.classCirclePicList = classCirclePicList;
                    } else {
                        this.schoolAlbumList = pageData.schoolAlbumList.filter(({id}) => id != this.albumId);
                        Object.keys(pageData.albumByTeacherMap).forEach(key => {
                            if(pageData.albumByTeacherMap[key].length === 0) {
                                delete pageData.albumByTeacherMap[key];
                                return true;
                            }
                            const albumList = [];
                            pageData.albumByTeacherMap[key].forEach((albumItem, albumIndex) => {
                                if(albumItem.id != this.albumId) {
                                    albumItem.name = `${albumItem.depart.name}/${albumItem.name}`;
                                    albumList.push(albumItem);
                                }
                            });
                            pageData.albumByTeacherMap[key] = albumList;
                        });
                        this.albumByTeacherMap = pageData.albumByTeacherMap;
                        if(this.isSchool) {
                            this.moveTargetAlbumId = pageData.schoolAlbumList[0].id;
                        } else {
                            this.moveTargetAlbumId = pageData.albumByTeacherMap[Object.keys(pageData.albumByTeacherMap)[0]][0].id;
                        }
                    }
                });
        },
        mounted() {

            getWxCosFileSign()
                .then(res => res.data)
                .then(data => {
                    if(data.result) {
                        const pageData = JSON.parse(data.data);
                        this.bucket = pageData.bucketName;
                        //实例化COS对象
                       //实例化COS对象
                        if(this.bucket=='wxtestfile-1251008840'||this.bucket=='wxcepfile-1251008840'){
                            this.cos = new COS({
                            Domain:global.command === 'production' ?'cos.zhxiaoyuan.cn':'cos.weixiaojia.net',
                            // 必选参数
                            getAuthorization: function (options, callback) {
                                callback({
                                    TmpSecretId: pageData.credentials.tmpSecretId,// 你的固定密钥SecretId，需修改
                                    TmpSecretKey: pageData.credentials.tmpSecretKey,// 你的固定密钥SecretKey，需修改
                                    XCosSecurityToken: pageData.credentials.sessionToken,
                                    ExpiredTime: pageData.expiredTime
                                });
                            }
                        });
                        }else{
                            this.cos = new COS({
                            // 必选参数
                            getAuthorization: function (options, callback) {
                                callback({
                                    TmpSecretId: pageData.credentials.tmpSecretId,// 你的固定密钥SecretId，需修改
                                    TmpSecretKey: pageData.credentials.tmpSecretKey,// 你的固定密钥SecretKey，需修改
                                    XCosSecurityToken: pageData.credentials.sessionToken,
                                    ExpiredTime: pageData.expiredTime
                                });
                            }
                        });
                        }
                    } else {
                        this.$message.error(data.msg);
                    }
                })
        },
        methods: {
            isShowByRole,
            isShowByPermission,
            editRemarkConfirm() {
                this.$refs.remarkForm.validate(isValid => {
                    if(isValid) {
                        updatePhotoState({
                            ids: this.editPhoto.id,
                            isDelete: 0,
                            remark: this.remarkForm.remark
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message.success('修改成功');
                                    this.selected = [];
                                    setTimeout(() => {
                                        this.isShowRemark = false;
                                        this.showPhotoFunc();
                                    }, 500);
                                }
                            })
                    }
                })
            },
            showVideo(videoItem) {
                this.isShowVideo = true;
                this.isShowRemarkText = true;
                this.remark = videoItem.remark;
                this.videoUrl = videoItem.videoJson;
            },
            editRemark(photoItem) {
                if(!this.isSchool || this.isShowByRole(118)) {
                    this.editPhoto = photoItem;
                    this.remarkForm = {
                        remark: photoItem.remark
                    };
                    this.isShowRemark = true;
                }

            },
            tabClick() {
                this.selectedPhoto = [];
                this.isSelectAll = false;
            },
            inputVideoAll() {
                setTimeout(() => {
                    this.$message.success('上传成功');
                    this.showPhotoFunc();
                }, 500);
            },
            inputVideo(video) {
                addPhoto({
                    albumId: this.albumId,
                    photoName: video.serverFileId,
                    photoUrl: '',
                    type: 2,
                    videoJson: video.url,
                    videoSize: video.size
                });
            },
            exportPhotos() {
                if(this.isClassCircle) {
                    if(this.classCirclePicList.length === 0) {
                        this.$message.error('该相册暂无可导出的照片');
                    } else {
                        exportClassCircleAlbumPicList({
                            classId: this.albumId,
                            albumName: `${this.className}班级圈`
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'http://api.weixiaojia.net/';
                                    window.open(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${data.data.zipName}&key=${data.data.key}&token=${this.$store.getters.token}`, "_blank");
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                } else {
                    if(this.photoList.length === 0) {
                        this.$message.error('该相册暂无可导出的照片');
                    } else {
                        exportAlbumPicList({
                            albumId: this.albumId,
                            albumName: this.albumInfo.name
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    const prefixUrl = global.command === 'production' ? 'https://www.zhxiaoyuan.cn/' : 'http://api.weixiaojia.net/';
                                    window.open(`${prefixUrl}thunder/archive/getArchiveByKey?archiveName=${data.data.zipName}&key=${data.data.key}&token=${this.$store.getters.token}`, "_blank");
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                }
            },
            editAlbumConfirm() {
                this.$refs.albumForm.validate((isValid) => {
                    if(isValid) {
                        updateAlbum({
                            id: this.albumId,
                            infomation: this.albumInfoQuery.infomation,
                            name: this.albumInfoQuery.name,
                            isPublic:this.albumInfoQuery.isPublic,
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改成功'
                                    });
                                    this.showPhotoFunc();
                                    this.isShowEditDialog = false;
                                }
                            })
                    }
                })
            },
            upload(e) {
                this.totalUpPhotoCount = e.target.files.length;

                for(let i = 0; i < e.target.files.length ; i ++) {
                    const timestamp = new Date().valueOf();
                    const file = e.target.files[i];
                    let strFileName = file.name.slice(0, file.name.lastIndexOf('.'));  //正则表达式获取文件名，不带后缀
                    let fileExt = file.name.slice(file.name.lastIndexOf('.') + 1).toLowerCase();   //正则表达式获取后缀
                    const year = moment().format('YYYY');
                    const name = `${timestamp}_${_.padStart(_.random(1, 100000, false), 6, '0')}.${fileExt}`;
                    const Key = `xiangce/${year}/${timestamp}/${name}`
                    if(['jpg', 'jpeg', 'png', 'gif', 'bmp'].indexOf(fileExt) === -1) {
                        this.$message.error('请选择扩展名为图片类型的文件');
                    } else if(strFileName.length > 0){
                        this.cos.putObject({
                            Bucket: this.bucket,
                            Region: this.region,
                            Key,
                            Body: file,
                            onTaskReady(taskId) {}
                        }, (err, data) => {
                            if(err) {
                                this.$message.error(err.error)
                            } else {
                                this.cos.putObjectTagging({
                                    Bucket: this.bucket, /* 必须 */
                                    Region: this.region,     /* 存储桶所在地域，必须字段 */
                                    Key, /* 存储在桶里的对象键（例如1.jpg，a/b/test.txt），必须字段 */
                                    Tags: [
                                        {"Key": "year", "Value": year},
                                        {"Key": "school", "Value": this.schoolInfo.id},
                                        {"Key": "module", "Value": 'xiangce'},
                                        {"Key": "modulecode", "Value": '1219'}
                                    ],
                                    // VersionId: 'MTg0NDUwOTMyODM1MDg2MTA1xxx' /* 对象版本 ID，非必须 */
                                }, (err, _1) => {
                                    let fileUrl = `https://${data.Location}`;
                                    fileUrl = fileUrl.replace(/\.cos\.ap-.+?\./, '\.picsh\.');
                                    addWxfileInfo({
                                        fileId: '',
                                        fileSize: file.size,
                                        fileUrl,
                                        moduleCode: '1219',
                                        moduleName: 'xiangce',
                                        schoolId: this.schoolInfo.id
                                    });
                                    addPhoto({
                                        albumId: this.albumId,
                                        minPic: fileUrl,
                                        maxPid: fileUrl,
                                        photoName: name,
                                        type: 1,
                                        videoJson: '',
                                        videoSize: 0
                                    })
                                        .then(res => res.data)
                                        .then(data => {
                                            if(data.result) {
                                                this.upPhotoCount ++ ;

                                                if(this.upPhotoCount === this.totalUpPhotoCount) {
                                                    this.$message({
                                                        type: 'success',
                                                        message: '上传成功'
                                                    });
                                                    this.showPhotoFunc();
                                                    this.upPhotoCount = 0;
                                                }
                                            } else {
                                                this.upPhotoCount = 0;
                                            }
                                        });
                                })
                            }
                        });
                    }
                }
                document.getElementById('img-upload').value = '';
                return false;
            },
            exceedHandler() {
                this.$message({
                    type: 'warning',
                    message: '每次最多上传十张图片'
                });
            },
            showPhotoFunc() {
                showPhoto({
                    albumId: this.albumId
                })
                    .then(res => res.data)
                    .then(data => {
                        this.albumInfo.name = data.data.albumModel.name;
                        this.albumInfo.infomation = data.data.albumModel.infomation;
                        this.albumInfoQuery.name = data.data.albumModel.name;
                        this.albumInfoQuery.infomation = data.data.albumModel.infomation;
                        this.albumInfoQuery.isPublic = data.data.albumModel.isPublic;
                        const previewPhotoList = [];
                        data.data.photoList.forEach(item => {
                            item.src = item.minPic;
                            const previewItem = JSON.parse(JSON.stringify(item));
                            previewItem.remark = previewItem.remark || '描述';
                            previewPhotoList.push(previewItem)
                        })
                        this.previewPhotoList = previewPhotoList;
                        this.photoList = data.data.photoList;
                        this.videoList = data.data.videoList;
                    })
            },
            deletePhoto() {
                if(this.selectedPhoto.length === 0) {
                    this.$message.error(`请选择要删除的${this.activeName === 'photo' ? '照片' : '视频'}！`);
                } else {
                    this.$confirm(`确定要把${this.activeName === 'photo' ? '照片' : '视频'}放入回收站吗？`, '删除', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        delPhoto({
                            ids: this.selectedPhoto.join(',')
                        })
                            .then(res => res.data)
                            .then(data => {
                                if(data.result) {
                                    if(this.activeName === 'photo') {
                                        this.selectedPhoto.forEach(id => {
                                            const photoItem = this.photoList.find(item => item.id == id);
                                            delWxfileInfo({
                                                fileUrl: photoItem.minPic
                                            })
                                        })
                                    } else {
                                        this.selectedPhoto.forEach(id => {
                                            const videoItem = this.videoList.find(item => item.id == id);
                                            console.log('videoItem', videoItem)
                                            delWxfileInfo({
                                                fileUrl: videoItem.videoJson
                                            })
                                        })
                                    }

                                    this.$message({
                                        type: 'success',
                                        message: '删除成功！',
                                    });
                                    this.selectedPhoto = [];
                                    this.showPhotoFunc();
                                }
                            })
                    }).catch(() => {
                    });
                }
            },
            setCover() {
                if(this.selectedPhoto.length === 0) {
                    this.$message.error('请选择要设为封面的照片！');
                } else if(this.selectedPhoto.length !== 1) {
                    this.$message.error('封面只能选择一张照片！');
                } else {
                    updateAlbumCover({
                        cover: this.selectedPhoto[0],
                        albumId: this.albumId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if(data.result) {
                                this.$message({
                                    type: 'success',
                                    message: '设置封面成功！',
                                });
                            }
                        })
                }

            },
            movePhoto() {
                if(this.selectedPhoto.length === 0) {
                    this.$message.error('请选择要移动的照片！');
                } else {
                    this.isShowMoveDialog = true;
                }
            },
            movePhotoConfirm() {
                movePhoto({
                    albumId: this.moveTargetAlbumId,
                    oldAlbumId: this.albumId,
                    photoIds: this.selectedPhoto.join(',')
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            this.$message({
                                type: 'success',
                                message: '移动成功！',
                            });
                            this.selectedPhoto = [];
                            this.showPhotoFunc();
                            this.isShowMoveDialog = false;
                        }
                    })
            },
            selectAll() {
                if(this.isSelectAll) {
                    if(this.activeName === 'photo') {
                        this.selectedPhoto = this.photoList.map(({id}) => id);
                    } else {
                        this.selectedPhoto = this.videoList.map(({id}) => id);
                    }
                } else {
                    this.selectedPhoto = [];
                }
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
        width: 100%;
        background-color: #fff;
        padding-bottom: 10px;
        border-bottom: 1px solid #e7eaec;
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
        .image-item {
            width: 125px;
            height: 125px;
            position: relative;
            .image-item__del {
                width: 20px;
                height: 20px;
                position: absolute;
                right: 0;
                top: 0;
                background: no-repeat center center / 100% 100% url(../../assets/images/pic_del_icon.png);
            }
            .fa {
                font-size: 24px;
                position: absolute;
                right: 0;
                top: 0;
                color: #0BB20C;
            }
        }
        img {
            width: 125px;
            height: 125px;
        }
    }

    .album-header__checkbox-container {
        margin-top: 10px;
    }
    .album-name {
        margin-top: 10px;
        font-weight: bold;
        font-size: 24px;
    }
    .album-info {
        color: #999;
    }
    input[type=checkbox] {
        margin-top: 0 !important;
        margin-bottom: 0 !important;
        width: 16px;
        height: 16px;
        display: inline-block;
        margin-right: 10px;
        vertical-align: middle;

    }
    .edit-btn {
        font-size: 14px;
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
    .image-item {
        width: 125px;
        height: 125px;
        margin: 0 10px 10px 0;
    }
    #img-upload-label {
        display: inline-block;
        line-height:12px;
        white-space: nowrap;
        cursor: pointer;
        -webkit-appearance: none;
        text-align: center;
        box-sizing: border-box;
        outline: 0;
        transition: .1s;
        font-weight: 500;
        -moz-user-select: none;
        padding: 12px 20px;
        font-size: 14px;
        border-radius: 4px;
        color: #FFF;
        background-color: #409EFF;
        border-color: #409EFF;
        &:hover {
            background: #66b1ff;
            border-color: #66b1ff;
            color: #FFF;
        }
    }
    .photo-item__remark {
        position: absolute;
        bottom: 0;
        width: 100%;
        padding: 2px;
        box-sizing: border-box;
        background: rgba(0,0,0, 0.3);
        color: #fff;
        font-size: 14px;
        text-align: center;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
</style>
<style lang="scss">
    @import "../../styles/mixin";
    #photoList {
        .dialog {
            max-width: 600px;
        }
        .img-box {
            display: inline-block;
        }
        .uploadFile-ul {
            display: none;
        }
        .video-container {
            width: 980px;
            height: 500px;
            margin: 0 auto;
        }
        .video-dialog {
            width: 1020px;
        }
        .fa-play-circle-o {
            font-size: 40px;
            top: 50%;
            left: 50%;
            width: 50px;
            height: 50px;
            position: absolute;
            transform: translate(-50%, -50%);
            text-align: center;
            line-height: 50px;
            color: #fff;
        }
        .photo {
            width: 125px;
            height: 125px;
            @include cover-bg;
        }
        .photo--default {
            background-image: url(../../assets/images/common/alubmbackground.png)
        }
    }
    .remark-text {
        position: fixed;
        width: 100%;
        color: #fff;
        font-size: 14px;
        text-align: center;
        top: 80px;
        z-index: 9000;
        left: 0;
    }
</style>
