<template>
    <div class="growthArchivesdetails">
        <div class="top">
            <el-button @click="$router.back()" type="default" size="medium">返回</el-button>
            <el-button type="primary" size="medium" @click="isCanPublishActivitys()" v-if="status==1">发布</el-button>
            <el-button type="primary" size="medium" @click="growthArchivesclassliststu()">活动数据分析</el-button>
            <el-button type="primary" size="medium" @click="popfun(1)">上传照片</el-button>
            <el-button type="primary" size="medium" @click="popfun(2)">上传视频</el-button>
            <!-- <el-button type="primary" size="medium" @click="popfun(3)">上传音频</el-button>         -->
        </div>
        <div class="subject" :style="`height: ${nobottommaxH}px;`">
            <div class="top-name" v-if="activityPhotoList.length">
                <i class="el-icon-picture-outline"></i> 照片
            </div>
            <div class="carousel-box" v-if="activityPhotoList.length">
                <el-carousel v-if="activityPhotoList.length>5" type="card" height="100px" :autoplay="false"
                             arrow="always" @change="funchangeone" style="width:50%;margin: 0 auto;overflow-x:unset;">
                    <el-carousel-item v-for="(item,index) in activityPhotoList" :key="index">
                        <div class="img-box">
                            <img
                                :src="item.fileUrl+(funwidthheight(item.photoDetails)==1?'?imageView2/q/100/w/200':'?imageView2/q/100/h/100')"
                                :class="{'width' : funwidthheight(item.photoDetails)==1, 'heigth': funwidthheight(item.photoDetails)==2}"
                                alt="">
                            <div class="img-name img-name-num">{{index+1}}</div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
                <div style="width:400px" v-else>
                    <el-carousel type="card" height="100px" :autoplay="false" arrow="always" @change="funchangeone">
                        <el-carousel-item v-for="(item,index) in activityPhotoList" :key="index">
                            <div class="img-box">
                                <img calss="big-width"
                                     :src="item.fileUrl+(funwidthheight(item.photoDetails)==1?'?imageView2/q/100/w/200':'?imageView2/q/100/h/100')"
                                     :class="{'width' : funwidthheight(item.photoDetails)==1, 'heigth': funwidthheight(item.photoDetails)==2}"
                                     alt="">
                                <div class="img-name img-name-num">{{index+1}}</div>
                            </div>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
            <div class="img-stu-box" v-if="activityPhotoList.length">
                <div class="top-box">
                    <div class="img-box img-box-img">
                        <i class="el-icon-star-on" :class="{'color':activityPhotoList[onenum].isStar==2}"
                           @click="starOrCancelStarActivityFiles(1,onenum,activityPhotoList[onenum])"></i>
                        <i class="el-icon-remove" @click="deleteActivityFileByIds(activityPhotoList[onenum].id,1)"></i>
                        <image-previewer tag="richtext">
                            <img
                                :class="{'width' : funwidthheight(activityPhotoList[onenum].photoDetails)==1, 'heigth': funwidthheight(activityPhotoList[onenum].photoDetails)==2}"
                                :src="activityPhotoList[onenum].fileUrl" alt="">
                        </image-previewer>
                    </div>
                    <div class="stu-box">
                        <el-checkbox v-model="activityPhotoList[onenum].checkAll"
                                     @change="handleCheckAllChange(activityPhotoList[onenum].id,activityPhotoList[onenum].checkAll)">
                            全班
                        </el-checkbox>
                        <div class="stu-box-box">
                            <img class="gender"
                                 src="https://cdnfile-10043692.cossh.myqcloud.com/vuewxcep/common_img/user_default_head.jpg"
                                 alt="">
                            <el-checkbox-group v-model="activityPhotoList[onenum].checkboxlist">
                                <el-checkbox v-for="(city,index) in malelist" :label="city.id" :key="index"
                                             @change="handleCheckedCitiesChange(1,onenum,city.id)">{{city.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="stu-box-box">
                            <img class="gender"
                                 src="https://cdnfile-10043692.cossh.myqcloud.com/vuewxcep/common_img/user_girl_head.jpg"
                                 alt="">
                            <el-checkbox-group v-model="activityPhotoList[onenum].checkboxlist">
                                <el-checkbox v-for="(city,index) in femalelist" :label="city.id" :key="index"
                                             @change="handleCheckedCitiesChange(1,onenum,city.id)">{{city.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <div class="input-box">
                    <div class="button" v-if="activityPhotoList[onenum].fileStuList.length"
                         @click="batchpopfun(activityPhotoList[onenum].id)"><span>批量录入评语</span></div>
                    <el-form class="demo-form-inline" label-width="100px">
                        <el-form-item :label="item.stuName"
                                      v-for="(item,index) in activityPhotoList[onenum].fileStuList" :key="index">
                            <el-input size="medium" placeholder="请输入评语（0~15）" @change="addActivityFileStuComments(item)"
                                      maxlength="15" v-model.trim="item.comment"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <div class="top-name" v-if="activityVideoList.length">
                <i class="el-icon-video-play"></i> 视频
            </div>
            <div class="carousel-box" v-if="activityVideoList.length" style="width:340px">
                <el-carousel type="card" height="100px" :autoplay="false" arrow="always" @change="funchangetwo">
                    <el-carousel-item v-for="(item,index) in activityVideoList" :key="index">
                        <div class="img-box">
                            <div class="img-name">{{index+1}}</div>
                            <div class="video-pop"></div>
                            <div class="video-box">
                                <video :src="item.fileUrl" controls="controls"></video>
                            </div>
                        </div>
                    </el-carousel-item>
                </el-carousel>
            </div>
            <div class="img-stu-box" v-if="activityVideoList.length">
                <div class="top-box">
                    <div class="img-box img-box-video">
                        <i class="el-icon-star-on" :class="{'color':activityVideoList[twonum].isStar==2}"
                           @click="starOrCancelStarActivityFiles(2,twonum,activityVideoList[twonum])"></i>
                        <i class="el-icon-remove" @click="deleteActivityFileByIds(activityVideoList[twonum].id,2)"></i>
                        <video :src="activityVideoList[twonum].fileUrl" controls="controls"></video>
                    </div>
                    <div class="stu-box">
                        <el-checkbox v-model="activityVideoList[twonum].checkAll"
                                     @change="handleCheckAllChange(activityVideoList[twonum].id,activityVideoList[twonum].checkAll)">
                            全班
                        </el-checkbox>
                        <div class="stu-box-box">
                            <img class="gender"
                                 src="https://cdnfile-10043692.cossh.myqcloud.com/vuewxcep/common_img/user_default_head.jpg"
                                 alt="">
                            <el-checkbox-group v-model="activityVideoList[twonum].checkboxlist">
                                <el-checkbox v-for="(city,index) in malelist" :label="city.id" :key="index"
                                             @change="handleCheckedCitiesChange(2,twonum,city.id)">{{city.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                        <div class="stu-box-box">
                            <img class="gender"
                                 src="https://cdnfile-10043692.cossh.myqcloud.com/vuewxcep/common_img/user_girl_head.jpg"
                                 alt="">
                            <el-checkbox-group v-model="activityVideoList[twonum].checkboxlist">
                                <el-checkbox v-for="(city,index) in femalelist" :label="city.id" :key="index"
                                             @change="handleCheckedCitiesChange(2,twonum,city.id)">{{city.name}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
                <div class="input-box">
                    <div class="button" v-if="activityVideoList[twonum].fileStuList.length"
                         @click="batchpopfun(activityVideoList[twonum].id)"><span>批量录入评语</span></div>
                    <el-form class="demo-form-inline" label-width="100px">
                        <el-form-item :label="item.stuName"
                                      v-for="(item,index) in activityVideoList[twonum].fileStuList" :key="index">
                            <el-input size="medium" placeholder="请输入评语（0~15）" @change="addActivityFileStuComments(item)"
                                      maxlength="15" v-model.trim="item.comment"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
            <!-- <div class="top-name" v-if="activityVoiceList.length">
             <i class="el-icon-microphone"></i> 音频
            </div>
            <div class="carousel-box" v-if="activityVoiceList.length" style="width:100%">
              <div class="img-ul">
                 <div class="img-box img-box-Voice-img"  v-for="(item,index) in activityVoiceList" :key="index" @click="funchangethree(index)">
                   <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/resource_manage/audio.png" v-if="threenum==index"  alt="">
                   <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/grey.png" v-else  alt="">
                 </div>
              </div>

            </div>
            <div class="img-stu-box" v-if="activityVoiceList.length">
              <div class="top-box">
                <div class="img-box img-box-Voice">
                   <i class="el-icon-star-on" :class="{'color':activityVoiceList[threenum].isStar==2}" @click="starOrCancelStarActivityFiles(3,threenum,activityVoiceList[threenum])"></i>
                   <i class="el-icon-remove" @click="deleteActivityFileByIds(activityVoiceList[threenum].id,3)"></i>
                   <div class="right_icons_wrap">
                      <img class="img" src="https://cdnfile-10043692.file.myqcloud.com/admin/images/resource_manage/audio.png" alt="">
                       <audio id="audio" :src="activityVoiceList[threenum].fileUrl" controls style="display: none;"></audio>
                       <span class="icon_box" @click="audioPlay" v-if="isPauseNow">
                         <i class="el-icon-video-play"></i>
                         <span>播放</span>
                       </span>
                       <span class="icon_box" @click="audioPause" v-else>
                         <i class="el-icon-video-pause"></i>
                         <span>暂停</span>
                       </span>
                   </div>
                </div>
                <div class="stu-box">
                  <el-checkbox  v-model="activityVoiceList[threenum].checkAll" @change="handleCheckAllChange(activityVoiceList[threenum].id,activityVoiceList[threenum].checkAll)">全班</el-checkbox>
                  <div class="stu-box-box">
                    <img class="gender" src="https://cdnfile-10043692.cossh.myqcloud.com/vuewxcep/common_img/user_default_head.jpg" alt="">
                     <el-checkbox-group v-model="activityVoiceList[threenum].checkboxlist">
                       <el-checkbox v-for="(city,index) in malelist" :label="city.id" :key="index"  @change="handleCheckedCitiesChange(3,threenum,city.id)" >{{city.name}}</el-checkbox>
                     </el-checkbox-group>
                  </div>
                  <div class="stu-box-box">
                    <img class="gender" src="https://cdnfile-10043692.cossh.myqcloud.com/vuewxcep/common_img/user_girl_head.jpg" alt="">
                     <el-checkbox-group v-model="activityVoiceList[threenum].checkboxlist">
                       <el-checkbox v-for="(city,index) in femalelist" :label="city.id" :key="index" @change="handleCheckedCitiesChange(3,threenum,city.id)">{{city.name}}</el-checkbox>
                     </el-checkbox-group>
                  </div>
                </div>
              </div>
              <div class="input-box" >
                   <div class="button" v-if="activityVoiceList[threenum].fileStuList.length" @click="batchpopfun(activityVoiceList[threenum].id)"><span>批量录入评语</span></div>
                   <el-form  class="demo-form-inline" label-width="100px">
                     <el-form-item :label="item.stuName"  v-for="(item,index) in activityVoiceList[threenum].fileStuList" :key="index">
                      <el-input  size="medium" placeholder="请输入评语（0~15）" @change="addActivityFileStuComments(item)" maxlength="15" v-model.trim="item.comment"></el-input>
                     </el-form-item>
                   </el-form>
              </div>
            </div> -->


            <el-dialog title="上传" :close-on-press-escape='false' :close-on-click-modal='false'
                       :visible.sync="dialogVisible" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
                <uploader moduleCode="20220607" module="chengzhangdangan" :multiplechoice="true" v-if="popnum==1" :multiple="true" pathPrefix="chengzhangdangan"
                          picOperationRule="imageMogr2/thumbnail/1920x1920" :showMode="'image'" :showResult="'image'"
                          :extList="['png', 'jpg', 'image', 'jpeg', 'gif']" v-model="imglist"></uploader>
                <video-uploader moduleCode="20220607" module="chengzhangdangan" :extList="videoTypes" v-if="popnum==2" @deleteVideo="deleteVideoHandler"
                                :value="videoList" showMode="button"></video-uploader>
                <uploader moduleCode="20220607" module="chengzhangdangan" :multiplechoice="false" :multiple="false" pathPrefix="chengzhangdangan" v-if="popnum==3"
                          :extList="voiceTypes" :value="voiceList"></uploader>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="determine()">确 定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="批量录入评语" :close-on-press-escape='false' :close-on-click-modal='false'
                       :visible.sync="batchpop" width="700px" :lock-scroll="false" :modal-append-to-body='false'>
                <el-form ref="form" :model="form" label-width="80px">
                    <el-form-item label="评语">
                        <el-input type="textarea" maxlength="15" v-model.trim="comment"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="batchpop = false">取 消</el-button>
                    <el-button type="primary" @click="batchAddActivityFileStuComments()">确 定</el-button>
                </span>
            </el-dialog>
            <default-page Mes="暂无照片,视频" v-if="myisnum==0"></default-page>
        </div>
    </div>
</template>
<script>
    import {
        batchAddActivityFileStuComment,
        batchAddOrCancelFileStu,
        getGrowthArchivesActivityInfo,
        isCanPublishActivity,
        publishGrowthArchivesActivity,
        batchAddActivityFiles,
        addActivityFileStuComment,
        addActivityFile,
        queryStudentsByClassIds,
        addActivityFileStu,
        deleteActivityFileStu,
        starOrCancelStarActivityFile,
        deleteActivityFileById
    } from "@/api/growthArchives";
    import mixin from "@/mixins/windowResize";
    import DefaultPage from "@/components/DefaultPage";
    import Uploader from "@/components/Uploader/WebUploader2";
    import VideoUploader from '@/components/Uploader/VideoUploader';
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue';

    let is_playFinish;
    export default {
        components: {DefaultPage, Uploader, VideoUploader, ImagePreviewer},
        data() {
            return {
                activityPhotoList: [],
                activityVideoList: [],
                activityVoiceList: [],
                id: this.$route.query.id,
                status: this.$route.query.status,
                myisnum: 1,
                imglist: [],
                popnum: 1,
                dialogVisible: false,
                myimglist: [],
                voiceList: [],
                videoList: [],
                voiceTypes: ["mp3"],
                videoTypes: ['mp4'],
                onenum: 0,
                twonum: 0,
                threenum: 0,
                malelist: [],
                femalelist: [],
                comment: '',
                batchpop: false,
                fileId: '',
                isPauseNow: true
            };
        },
        mixins: [mixin],
        created() {
            this.getGrowthArchivesActivityInfos();
        },
        methods: {
            handleCheckAllChange(id, num) {
                batchAddOrCancelFileStu(this.id, id, num - 0).then(res => {
                    if ((res.data.code === 200) && res.data.result) {
                        this.getGrowthArchivesActivityInfos();
                    } else {
                        this.$message.error(res.data.msg);
                    }
                });
            },
            //判断宽高
            funwidthheight(obj) {
                let width = JSON.parse(obj).width - 0;
                let height = JSON.parse(obj).height - 0;
                return width > height ? 2 : 1;
            },
            //数据分析
            growthArchivesclassliststu() {
                this.$router.push({path: "growthArchivesclassliststu", query: {id: this.id}});
            },
            //发布
            isCanPublishActivitys() {
                isCanPublishActivity(this.id).then(res => {
                    if ((res.data.code === 200) && res.data.result) {
                        let name = res.data.msg ? res.data.msg : '确认发布吗？';
                        this.$confirm(name, '发布', {
                            confirmButtonText: "确定",
                            cancelButtonText: "取消",
                            type: "warning",
                            lockScroll: false
                        }).then(() => {
                            publishGrowthArchivesActivity(this.id).then(res => {
                                if ((res.data.code === 200) && res.data.result) {
                                    this.$message.success("发布成功！");
                                    this.$router.replace({path: "growthArchivesReportdetails", query: {id: this.id}});
                                } else {
                                    this.$message.error(res.data.msg);
                                }
                            });
                        }).catch(() => {
                        });

                    } else {
                        this.$message.error(res.data.msg);
                    }
                });


            },
            audioPlay() {
                let self = this;
                this.isPauseNow = false;
                const audioBtn = document.getElementById('audio');
                audioBtn.play();
                is_playFinish = setInterval(() => {
                    if (audioBtn.ended) {
                        self.isPauseNow = true;
                        window.clearInterval(is_playFinish);
                    }
                }, 1000);
            },
            audioPause() {
                this.isPauseNow = true;
                const audioBtn = document.getElementById('audio');
                audioBtn.pause();
                window.clearInterval(is_playFinish);
            },
            batchpopfun(id) {
                this.fileId = id;
                this.batchpop = true;
            },
            batchAddActivityFileStuComments() {
                // if(!this.comment){
                //   this.$message.error('评语不能为空！');
                //   return;
                // }
                let obj = {
                    activityId: this.id,//	活动ID	number
                    comment: this.comment,//	评价内容	string
                    fileId: this.fileId,//	附件ID	number
                }
                batchAddActivityFileStuComment(obj).then(res => {
                    if (res.data.code === 200) {
                        this.$message.success("批量录入评语成功！");
                        this.getGrowthArchivesActivityInfos();
                        this.batchpop = false;
                        this.comment = '';
                    }
                });

            },
            //新增评语
            addActivityFileStuComments(obj) {
                addActivityFileStuComment(obj).then(res => {
                });
            },
            //加精
            starOrCancelStarActivityFiles(num, index, obj) {
                let isStar = obj.isStar == 1 ? 2 : 1;
                let name = obj.isStar == 1 ? '加精' : '取消加精';
                this.$confirm("确认要" + name + "吗？", name, {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    lockScroll: false
                }).then(() => {
                    starOrCancelStarActivityFile(obj.id, isStar).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success(name + "成功！");
                            if (num == 1) {
                                this.activityPhotoList[index].isStar = isStar;
                            } else if (num == 2) {
                                this.activityVideoList[index].isStar = isStar;
                            } else {
                                this.activityVoiceList[index].isStar = isStar;
                            }
                        } else {
                            this.$message.error(res.data.msg);
                        }
                    });
                })
                    .catch(() => {
                    });
            },
            //删除
            deleteActivityFileByIds(id, num) {
                this.$confirm("确认要删除吗？", '删除', {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                    lockScroll: false
                }).then(() => {
                    deleteActivityFileById(id).then(res => {
                        if (res.data.code === 200) {
                            this.$message.success("删除成功！");
                            this.getGrowthArchivesActivityInfos();
                        } else {
                            this.$message.error(res.data.msg);
                        }
                        if (num == 2) {
                            this.twonum = this.twonum == 0 ? this.twonum : (this.twonum - 1);
                        }
                        if (num == 1) {
                            this.onenum = this.onenum == 0 ? this.onenum : (this.onenum - 1);
                        }
                        if (num == 3) {
                            this.threenum = this.threenum == 0 ? this.threenum : (this.threenum - 1);
                        }
                    });
                })
                    .catch(() => {
                    });
            },
            handleCheckedCitiesChange(num, index, id) {
                if (num == 1) {//图片
                    if (this.activityPhotoList[index].checkboxlist.join(",").indexOf(id) !== -1) {//新增学生
                        this.addActivityFileStus(this.activityPhotoList[index].id, id)
                    } else {
                        this.deleteActivityFileStus(this.activityPhotoList[index].id, id)
                    }
                } else if (num == 2) {
                    if (this.activityVideoList[index].checkboxlist.join(",").indexOf(id) !== -1) {//新增学生
                        this.addActivityFileStus(this.activityVideoList[index].id, id)
                    } else {
                        this.deleteActivityFileStus(this.activityVideoList[index].id, id)
                    }
                } else {
                    if (this.activityVoiceList[index].checkboxlist.join(",").indexOf(id) !== -1) {//新增学生
                        this.addActivityFileStus(this.activityVoiceList[index].id, id)
                    } else {
                        this.deleteActivityFileStus(this.activityVoiceList[index].id, id)
                    }
                }
            },
            addActivityFileStus(fileId, stuId) {
                addActivityFileStu(this.id, fileId, stuId).then(res => {
                    this.getGrowthArchivesActivityInfos();
                }).catch(err => {
                });
            },
            deleteActivityFileStus(fileId, stuId) {
                deleteActivityFileStu(fileId, stuId).then(res => {
                    this.getGrowthArchivesActivityInfos();
                }).catch(err => {
                });
            },
            funchangeone(num) {
                this.onenum = num
            },
            funchangetwo(num) {
                this.twonum = num
            },
            funchangethree(num) {
                this.threenum = num;
                this.audioPause();
            },
            popfun(num) {
                this.popnum = num;
                this.imglist = [];
                this.voiceList = [];
                this.videoList = [];
                this.dialogVisible = true;
            },
            //获取学生
            queryStudentsByClassIdss(ids) {
                this.malelist = [];
                this.femalelist = [];
                queryStudentsByClassIds(ids).then(res => {
                    let mydata = res.data.data;
                    for (let i = 0; i < mydata.length; i++) {
                        if (mydata[i].gender == 1) {
                            this.malelist.push(mydata[i])
                        }
                        if (mydata[i].gender == 2) {
                            this.femalelist.push(mydata[i])
                        }
                    }
                    for (let i = 0; i < this.activityPhotoList.length; i++) {
                        this.activityPhotoList[i].checkboxlist = [];
                        for (let j = 0; j < this.activityPhotoList[i].fileStuList.length; j++) {
                            this.activityPhotoList[i].checkboxlist.push(this.activityPhotoList[i].fileStuList[j].stuId - 0)
                        }
                        this.activityPhotoList[i].checkAll = (this.activityPhotoList[i].checkboxlist.length == (this.femalelist.length + this.malelist.length));
                    }
                    for (let i = 0; i < this.activityVoiceList.length; i++) {
                        this.activityVoiceList[i].checkboxlist = [];
                        for (let j = 0; j < this.activityVoiceList[i].fileStuList.length; j++) {
                            this.activityVoiceList[i].checkboxlist.push(this.activityVoiceList[i].fileStuList[j].stuId - 0)
                        }
                        this.activityVoiceList[i].checkAll = (this.activityVoiceList[i].checkboxlist.length == (this.femalelist.length + this.malelist.length));
                    }
                    for (let i = 0; i < this.activityVideoList.length; i++) {
                        this.activityVideoList[i].checkboxlist = [];
                        for (let j = 0; j < this.activityVideoList[i].fileStuList.length; j++) {
                            this.activityVideoList[i].checkboxlist.push(this.activityVideoList[i].fileStuList[j].stuId - 0)
                        }
                        this.activityVideoList[i].checkAll = (this.activityVideoList[i].checkboxlist.length == (this.femalelist.length + this.malelist.length));
                    }
                })
                    .catch(err => {
                    });
            },
            determine() {
                if (this.popnum == 1 && this.imglist.length == 0) {
                    this.$message({message: "请至少上传一张图片", type: "error"});
                    return;
                }
                if (this.popnum == 2 && this.videoList.length == 0) {
                    this.$message({message: "请上传视频", type: "error"});
                    return;
                }
                //  if (this.popnum == 3 && this.voiceList.length == 0) {
                //   this.$message({ message: "请上传音频", type: "error" });
                //   return;
                // }
                if (this.popnum == 1) {
                    this.imgfun();
                } else if (this.popnum == 3) {
                    let obj = {
                        activityId: this.id, //	活动ID	number
                        fileType: 3, //	附件类型 1照片 2视频 3语音	number
                        fileUrl: this.voiceList[0].fileUrl, //	附件URL	string
                        photoAxis: 0, //	图片坐标 1横向 2纵向	number
                        photoDetails: "", //图片详细信息JSON	string
                        stuId: 0
                    };
                    addActivityFile(obj)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: "success",
                                    message: "上传成功!"
                                });
                                this.dialogVisible = false;
                                this.getGrowthArchivesActivityInfos();
                            }
                        })
                        .catch(err => {
                        });
                } else {
                    let obj = {
                        activityId: this.id, //	活动ID	number
                        fileType: 2, //	附件类型 1照片 2视频 3语音	number
                        fileUrl: this.videoList[0].url, //	附件URL	string
                        photoAxis: 0, //	图片坐标 1横向 2纵向	number
                        photoDetails: this.videoList[0].serverFileId, //图片详细信息JSON	string
                        stuId: 0
                    };
                    addActivityFile(obj)
                        .then(res => {
                            if (res.data.code === 200) {
                                this.$message({
                                    type: "success",
                                    message: "上传成功!"
                                });
                                this.dialogVisible = false;
                                this.getGrowthArchivesActivityInfos();
                            }
                        })
                        .catch(err => {
                        });
                }
            },
            deleteVideoHandler() {
                // videoUrl 置空
                this.videoList = [];
            },
            imgfun() {
                let num = 0;
                this.myimglist = [];
                let bsplength = this.imglist.length;
                for (let i = 0; i < this.imglist.length; i++) {
                    this.myimglist.push({
                        activityId: this.id, //	活动ID	number
                        fileType: 1, //	附件类型 1照片 2视频 3语音	number
                        fileUrl: this.imglist[i].fileUrl, //	附件URL	string
                        photoAxis: 1, //	图片坐标 1横向 2纵向	number
                        photoDetails: "", //图片详细信息JSON	string
                        stuId: 0
                    });
                }

                for (let i = 0; i < this.myimglist.length; i++) {
                    // this.imglist[i].fileUrl.replace('http://', 'https://');
                    this.$http.get(this.imglist[i].fileUrl + "?imageInfo").then(
                        res => {
                            this.myimglist[i].photoDetails = res.bodyText;
                            let obj = JSON.parse(res.bodyText);
                            this.myimglist[i].photoAxis =
                                obj.width - 0 < obj.height - 0 ? 2 : 1;
                            num++;

                            if (num == bsplength) {
                                batchAddActivityFiles(this.myimglist)
                                    .then(res => {
                                        if (res.data.code === 200) {
                                            this.$message({
                                                type: "success",
                                                message: "上传成功!"
                                            });
                                            this.getGrowthArchivesActivityInfos();
                                        }
                                    })
                                    .catch(err => {
                                    });
                            }
                        },
                        err => {
                        }
                    );
                }
                this.dialogVisible = false;
            },
            //获取详情
            getGrowthArchivesActivityInfos() {
                getGrowthArchivesActivityInfo(this.id)
                    .then(res => res.data)
                    .then(data => {
                        let mydata = data.data;
                        for (let i = 0; i < mydata.activityPhotoList.length; i++) {
                            mydata.activityPhotoList[i].checkboxlist = [];
                            mydata.activityPhotoList[i].checkAll = false;
                            for (let j = 0; j < mydata.activityPhotoList[i].fileStuList.length; j++) {
                                mydata.activityPhotoList[i].checkboxlist.push(mydata.activityPhotoList[i].fileStuList[j].stuId - 0)
                            }
                            mydata.activityPhotoList[i].checkAll = (mydata.activityPhotoList[i].checkboxlist.length == (this.femalelist.length + this.malelist.length));
                        }
                        for (let i = 0; i < mydata.activityVoiceList.length; i++) {
                            mydata.activityVoiceList[i].checkboxlist = [];
                            mydata.activityVoiceList[i].checkAll = false;
                            for (let j = 0; j < mydata.activityVoiceList[i].fileStuList.length; j++) {
                                mydata.activityVoiceList[i].checkboxlist.push(mydata.activityVoiceList[i].fileStuList[j].stuId - 0)
                            }
                            mydata.activityVoiceList[i].checkAll = (mydata.activityVoiceList[i].checkboxlist.length == (this.femalelist.length + this.malelist.length));
                        }
                        for (let i = 0; i < mydata.activityVideoList.length; i++) {
                            mydata.activityVideoList[i].checkboxlist = [];
                            mydata.activityVideoList[i].checkAll = false;
                            for (let j = 0; j < mydata.activityVideoList[i].fileStuList.length; j++) {
                                mydata.activityVideoList[i].checkboxlist.push(mydata.activityVideoList[i].fileStuList[j].stuId - 0)
                            }

                            mydata.activityVideoList[i].checkAll = (mydata.activityVideoList[i].checkboxlist.length == (this.femalelist.length + this.malelist.length));
                        }
                        this.activityPhotoList = mydata.activityPhotoList;
                        this.activityVideoList = mydata.activityVideoList;
                        this.activityVoiceList = mydata.activityVoiceList;
                        this.myisnum = mydata.activityVoiceList.length + mydata.activityVideoList.length + mydata.activityPhotoList.length;
                        if ((this.malelist.length + this.femalelist) == 0) {
                            this.queryStudentsByClassIdss(mydata.classIds);
                        }
                    });
            }
        }
    };
</script>
<style>
    .growthArchivesdetails .el-carousel__indicators--outside {
        display: none;
    }
</style>
<style lang="scss" scoped>
    .growthArchivesdetails {
        padding: 15px;

        * {
            box-sizing: border-box;
            word-break: break-all;
            word-wrap: break-word;
        }

        .el-checkbox {
            margin: 3px 0;
            margin-right: 10px;
            min-width: 80px;

        }

        .input-box {
            width: 700px;
            padding: 10px 0;
            float: left;

            .button {
                padding: 10px 30px;

                span {
                    cursor: pointer;
                    color: #409EFF;
                    font-size: 16px;
                }
            }

            .el-form-item {
                margin-bottom: 10px;
            }
        }

        .top {
            border-bottom: 1px solid #e7eaec;
            padding-bottom: 10px;
        }

        .subject {
            overflow: auto;
            padding: 20px 0;
            margin: 0 auto;
            width: 1000px;

            .carousel-box {
                width: 600px;
                margin: 20px 0;
                overflow: hidden;

                .img-box-Voice-img {
                    float: left;
                    margin: 5px;
                    cursor: pointer;
                }
            }

            .img-stu-box {
                overflow: hidden;
                padding-bottom: 30px;

                .img-box {
                    float: left;
                    width: 180px;
                    height: 240px;
                    overflow: hidden;
                    text-align: center;
                    position: relative;
                    background: #fdfdfd;

                    .img {
                        max-height: 100%;
                        width: 100%;
                    }

                    .width {
                        width: 180px;
                        min-height: 240 px；
                    }

                    .heigth {
                        height: 240px;
                        min-width: 180px;

                    }

                    video {
                        height: 100%;
                        width: 100%;
                        background: #000;
                    }

                    .el-icon-star-on {
                        color: #EBEEF5;
                        position: absolute;
                        top: 5px;
                        right: 35px;
                        font-size: 24px;
                        cursor: pointer;
                        z-index: 1000;
                    }

                    .el-icon-star-on:hover, .el-icon-star-on.color {
                        color: #E6A23C;
                    }

                    .el-icon-remove {
                        color: #EBEEF5;
                        position: absolute;
                        top: 6px;
                        right: 5px;
                        font-size: 22px;
                        cursor: pointer;
                        z-index: 1000;
                    }

                    .el-icon-remove:hover, .el-icon-remove.color {
                        color: #F56C6C;
                    }
                }

                .img-box-img {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }

                .img-box-video {
                    text-align: right;
                }

                .img-box-Voice {
                    .el-icon-star-on {
                        top: 15px;
                        right: 50px;
                        color: #DCDFE6
                    }

                    .el-icon-remove {
                        top: 16px;
                        right: 20px;
                        color: #DCDFE6
                    }

                    .icon_box {
                        color: #909399;
                        font-size: 14px;
                        float: left;
                        padding-left: 20px;

                        i {
                            font-size: 20px;
                            color: #409EFF;
                            float: left;
                            padding-right: 3px;
                        }
                    }
                }

                .stu-box {
                    width: 810px;
                    float: right;
                    padding: 0 0 0 10px;
                    overflow: hidden;
                    min-height: 240px;

                    .stu-box-box {
                        min-height: 80px;
                        padding: 5px 0 10px 45px;
                        position: relative;

                        .gender {
                            position: absolute;
                            left: 5px;
                            top: 5px;
                            width: 32px;
                        }
                    }
                }
            }

            .el-carousel__item {
                background-color: #efefef;

                .img-box {
                    position: relative;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    .img-name {
                        position: absolute;
                        top: 10px;
                        left: 10px;
                        color: #409EFF;
                        z-index: 100;
                        font-size: 14px;
                    }

                    .img-name-num {
                        top: 30px;
                        left: 40%;
                        line-height: 30px;
                        width: 30px;
                        border-radius: 50%;
                        font-size: 16px;
                        color: #fff;
                        text-align: center;
                        background: rgba(255, 255, 255, 0.5);
                    }

                    .video-pop {
                        width: 100%;
                        height: 100%;
                        position: absolute;
                        top: 0;
                        left: 0;
                        z-index: 1000;
                    }

                    .video-box {
                        text-align: center;
                    }

                    video {
                        width: 100%;
                        height: 100px;
                    }

                    img {
                        margin: 0 auto;
                        overflow: hidden;
                        display: block;
                    }

                    .width {
                        width: 200px;
                        min-height: 100px;
                    }

                    .big-width {
                        width: 150px;
                    }

                    .heigth {
                        height: 100px;
                        min-width: 200px;

                    }
                }
            }

            .top-name {
                color: #606266;
                background-color: #d9ecff;
                padding: 8px 5px;
                font-size: 15px;
                line-height: 20px;

                i {
                    color: #409EFF;
                    font-size: 20px;
                    float: left;
                    margin-right: 5px;
                }
            }
        }
    }
</style>
