<template>
    <div>
        <div v-if="!isNewFace" class="face_manage_wrap">
            <div class="header_title_wrap">
                <el-row>
                    <el-col :span="19">
                        <span class="manage_name">{{ baseStoreData.name }}</span>
                        <i class="el-icon-edit" @click="showNameEditBox = true"
                           style="cursor: pointer;color: #20A0FF;"></i>
                        <el-select style="width: 80px" size="medium" v-model="listQuery.status"
                                   @change="getFaceUserList">
                            <el-option label="全部上传状态" :value="0"></el-option>
                            <el-option label="已上传" :value="1"></el-option>
                            <el-option label="未上传" :value="2"></el-option>
                        </el-select>
                        <el-select style="width: 80px" size="medium" v-model="listQuery.userType"
                                   @change="getFaceUserList">
                            <el-option label="老师" :value="1"></el-option>
                            <el-option label="学生" :value="2"></el-option>
                            <el-option label="家长" :value="3"></el-option>
                        </el-select>
                        <el-select v-show="listQuery.userType != 1" @change="selectGradeChange"
                                   v-model="listQuery.gradeId" placeholder="请选择年级" size="medium" style="width: 100px;">
                            <el-option :key="0" label="全部年级" :value="0"></el-option>
                            <el-option v-for="item in gradeList" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                        <el-select v-show="listQuery.gradeId != 0 && listQuery.userType != 1"
                                   v-model="listQuery.classId" placeholder="请选择班级" size="medium" style="width: 120px;"
                                   @change="getFaceUserList">
                            <el-option :key="0" label="全部班级" :value="0"></el-option>
                            <el-option v-for="item in classList" :key="item.id" :label="item.name"
                                       :value="item.id"></el-option>
                        </el-select>
                        <a :href="exportURL" download="导出结果" target="_blank" v-if="listData.length">
                            <el-button class="filter-item" size="medium" type="primary" icon="upload">导出</el-button>
                        </a>
                        <!--                        <el-button type="primary" @click="toAddFace" size="medium" style="float:right;">添加人脸</el-button>-->
                        <el-button class="filter-item" size="medium" type="primary" @click="exportFileFunc">导出文件
                        </el-button>
                        <el-button class="filter-item" size="medium" type="primary" @click="isShowSetting = true">设置
                        </el-button>
                         <el-button type="primary" size="medium" v-if="listQuery.userType!=3" @click="dialogImportTeacherVisible = true">导入人脸</el-button>
                        <el-button type="text" size="medium" style="float:right;margin: 0px 10px;"
                                   @click="handleDelAlumnusFace">清除校友数据
                        </el-button>
                         <el-button type="text" size="medium" style="float:right;margin: 0px 10px;"
                                   @click="delFaces()">清除同步失败数据
                        </el-button>
                        <el-checkbox v-model="syncStatus" :true-label="2" :false-label="0" @change="getFaceUserList">
                            仅展示同步失败数据
                        </el-checkbox>
                    </el-col>
                    <el-col :span="5">
                        <el-input placeholder="请输入姓名" icon="el-icon-search" size="medium" class="search-input"
                                  v-model.trim="listQuery.userName" @keyup.enter.native="searchFaceName">
                            <el-button slot="append" icon="el-icon-search" @click="searchFaceName"></el-button>
                        </el-input>
                    </el-col>
                </el-row>
            </div>
            <!--            <div class="statistics_card_wrap clearfix">-->
            <!--                <div class="statistics_card_item">-->
            <!--                    <div class="card_item_number">{{baseStoreData.userCount}}</div>-->
            <!--                    <div class="card_item_desc">人脸用户</div>-->
            <!--                </div>-->
            <!--                <div class="statistics_card_item">-->
            <!--                    <div class="card_item_number">{{baseStoreData.teacherCount}}</div>-->
            <!--                    <div class="card_item_desc">老师</div>-->
            <!--                </div>-->
            <!--                <div class="statistics_card_item">-->
            <!--                    <div class="card_item_number">{{baseStoreData.studentCount}}</div>-->
            <!--                    <div class="card_item_desc">学生</div>-->
            <!--                </div>-->
            <!--                <div class="statistics_card_item">-->
            <!--                    <div class="card_item_number">{{baseStoreData.parentCount}}</div>-->
            <!--                    <div class="card_item_desc">家长</div>-->
            <!--                </div>-->
            <!--            </div>-->

            <el-table stripe :key="tableKey" :data="listData" v-loading.body="listLoading" border fit @select="selectionChangeHandler" @select-all="selectionChangeHandler"
                      highlight-current-row style="width: 100%" :height="maxH">
                      <el-table-column type="selection" :selectable="selectable" align="center" width="65">
                </el-table-column>
                <el-table-column align="center" label="姓名">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="注册照片">
                    <template slot-scope="scope">
                        <image-previewer v-if="scope.row.imageUrl" tag="richtext" viewclass="image_view"
                                         :images="[{ src: scope.row.imageUrl }]">
                            <img class="image_view" :src="scope.row.imageUrl" width="27" height="27"
                                 style="margin-top: 5px;" :alt="scope.row.name"/>
                        </image-previewer>
                        <span v-else>-</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="性别">
                    <template slot-scope="scope">
                        <span v-if="scope.row.gender === 1">男</span>
                        <span v-else-if="scope.row.gender === 2">女</span>
                        <span v-else>未知</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="部门（班级）" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-for="(item, index) in scope.row.departs">{{ item.name }}&nbsp;&nbsp;</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="用户类型">
                    <template slot-scope="scope">
                        <span v-if="scope.row.type === '1'">老师</span>
                        <span v-else-if="scope.row.type === '2'">学生</span>
                        <span v-else-if="scope.row.type === '3'">家长</span>
                        <span v-else-if="scope.row.type === '13'">老师&nbsp;&nbsp;家长</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" style="margin-right: 0;" v-if="scope.row.imageUrl" type="primary">已上传</el-tag>
                        <el-tag  size="mini" style="margin-right: 0;" v-else type="danger">未上传</el-tag>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="同步状态">
                    <template slot-scope="scope">
                        <el-tag  size="mini" style="margin-right: 0;" v-if="scope.row.syncStatus == 1" type="primary">成功</el-tag>
                        <template v-else-if="scope.row.syncStatus == 2">
                            <el-tag  size="mini" style="margin-right: 0;" type="danger">失败</el-tag>
                            <i class="el-icon-question" @click.stop="showErrorMsg(scope.row.syncMsg)"></i>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="150">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" v-if="!scope.row.imageUrl"
                                   @click.native="editFace(scope.row.id)">上传
                        </el-button>
                        <el-button size="small" type="text" v-if="!scope.row.imageUrl"
                                   @click.native="shootFace(scope.row.id)">拍摄
                        </el-button>
                        <el-button size="small" type="text" v-else @click.native="delFace(scope.row.id)" class="buttontextred">清除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="footer_wrap clearfix">
                <div v-show="!listLoading">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                   :current-page.sync="listQuery.pageNo" :page-sizes="[10, 20, 30, 50]"
                                   :page-size="listQuery.pageSize" layout="total, sizes, prev, pager, next, jumper"
                                   :total="total"></el-pagination>
                </div>
            </div>
        </div>

        <div v-else class="face_init_wrap">
            <h3>学校人脸库尚未生成，请先初始化人脸库！</h3>
            <el-button type="primary" @click="initFaceStore" :disabled="canInitFace">初始化人脸库</el-button>
        </div>

        <el-dialog title="编辑" :visible.sync="showNameEditBox" :close-on-click-modal="false" :show-close="false">
            <el-form>
                <el-form-item label="名称" label-width="60px">
                    <el-input v-model="manageName" auto-complete="off" maxlength="20"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelName">取 消</el-button>
                <el-button type="primary" @click="editManageName" :disabled="checkDisabled">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="上传照片" :visible.sync="showUploaderBox" :close-on-click-modal="false" :show-close="false">
            <el-form :model="editForm" ref="editForm" :rules="rules">
                <el-form-item label="照片" label-width="60px" prop="facePic">
                    <uploader pathPrefix="renlian" module="renlian" moduleCode="20190509" useSysBucket :showMode="'image'" :showResult="'image'"
                              :extList="['png', 'jpg']" v-model="editForm.facePic"></uploader>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showUploaderBox = false">取 消</el-button>
                <el-button type="primary" @click="faceSave">确 定</el-button>
            </div>
        </el-dialog>
        <capture-avatar @inputface="inputFace" ref="captureavatar"></capture-avatar>
        <el-dialog title="" :visible.sync="isShowSetting" width="600px">
            <el-form ref="settingForm" :model="settingForm" :rules="settingFormRules" label-width="140px">
                <el-form-item label="证件照上传限制" prop="userType">
                    <el-checkbox-group v-model="settingForm.userType">
                        <el-checkbox :label="1">教师照片</el-checkbox>
                        <el-checkbox :label="2">学生照片</el-checkbox>
                        <el-checkbox :label="3">家长照片</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="对接人脸识别硬件"  class="is-required">
                    <div class="radio-container">
                        <el-radio-group v-model="settingForm.deviceType">
                            <div class="radio-item">
                                <el-radio :label="1">海康云眸</el-radio>
                                <div v-if="settingForm.deviceType == 1" class="extra-info">
                                    <div class="extra-info__line">
                                        &nbsp;&nbsp;&nbsp;&nbsp;appKey:
                                        <el-input placeholder="请输入appKey" v-model.trim="settingForm.clientId" auto-complete="off" maxlength="100"
                                                  size="small" style="width: 250px;margin-left: 2px;margin-bottom: 5px;"></el-input>
                                    </div>
                                    <div class="extra-info__line">
                                        appSecret:
                                        <el-input  placeholder="请输入appSecret" v-model.trim="settingForm.secret" auto-complete="off" maxlength="100"
                                                  size="small" style="width: 250px;margin-bottom: 5px;"></el-input>
                                    </div>
                                </div>

                            </div>
                            <div class="radio-item">
                                <el-radio :label="2">天波设备</el-radio>
                            </div>
                            <div class="radio-item">
                                <el-radio :label="3">虹软设备</el-radio>
                            </div>
                            <div class="radio-item">
                                <el-radio :label="4">新开普设备</el-radio>
                                 <div v-if="settingForm.deviceType == 4" class="extra-info">
                                    <div class="extra-info__line">
                                        &nbsp;&nbsp;&nbsp;&nbsp;appKey:
                                        <el-input placeholder="请输入appKey" v-model.trim="settingForm.clientId" auto-complete="off" maxlength="100"
                                                  size="small" style="width: 250px;margin-left: 2px;margin-bottom: 5px;"></el-input>
                                    </div>
                                    <div class="extra-info__line">
                                        appSecret:
                                        <el-input  placeholder="请输入appSecret" v-model.trim="settingForm.secret" auto-complete="off" maxlength="100"
                                                  size="small" style="width: 250px;margin-bottom: 5px;"></el-input>
                                    </div>
                                    <div class="extra-info__line">
                                       &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;key:
                                        <el-input v-model.trim="settingForm.key" auto-complete="off" maxlength="100"
                                         placeholder="请输入key"
                                                  size="small" style="width: 250px;margin-bottom: 5px;"></el-input>
                                    </div>
                                </div>
                            </div>
                        </el-radio-group>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" @click="isShowSetting = false">取 消</el-button>
                <el-button size="medium" type="primary" @click="settingConfirm">确 定</el-button>
              </span>
        </el-dialog>


        <el-dialog title="人脸导入" :visible.sync="dialogImportTeacherVisible" :close-on-press-escape='false'
                   :close-on-click-modal='false' :modal-append-to-body='false' >
            <div class="bs-callout bs-callout-danger">
              <div class="title">导入说明：</div>
              <div class="info-title">1.只允许上传zip格式，里面直接是人脸图片文件，不能再包含压缩包文件</div>
              <div class="info-title">2.人脸图片以系统中用户名字命名，如果来源数据包含非中文特殊字符不用额外手动处理，系统会过滤掉只匹配中文</div>
              <div class="info-title">3.学生可以放到以班级命名的文件夹中，这样只会匹配该班级下学生</div>
            </div>
           <div class="sns-btn-div">
               <el-upload class="upload-import"  name='file' :action="uploadPath" :data="uploadData" :show-file-list='false'
                          accept=".zip" :before-upload="beforeAvatarUpload" :on-success="newhandleAvatarSuccess"
                          :on-error="handleAvatarErr">
                   <el-button type="primary" :loading="importAvatarLoading">{{btnText}}</el-button>
               </el-upload>
           </div>
           <div v-show="resultShow" class="bs-callout bs-callout-warning" id="callout-glyphicons-dont-mix">
              <div class="title">导入结果：</div>
              <div class="info-title">本次共导入：{{totalUserCount}}人</div>
              <div class="info-title">成功导入：{{successUserCount}}人</div>
              <div class="info-title">导入失败：{{errorUserCount}}人
                 <a v-if="errorUserCount>0" target="_blank" :href="downloadErrorUrl" download="下载失败名单">
                    <el-button type="text">下载失败名单</el-button>
                  </a>
              </div>
            </div>

           <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogImportTeacherVisible=false">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>

<script>
    import ImagePreviewer from '@/components/ImagePreviewer/ImagePreviewer.vue'
    import CaptureAvatar from '@/components/CaptureAvatar'
    import windowResizeMixin from '@/mixins/windowResize'
    import {
        isInstallFaceBase,uploadBatchFace,
        createFaceBase,
        getFaceDataBase,
        getFaceUserList,
        updateFaceBase,
        deleteFaceBaseUser,
        delAlumnusFace,
        getFaceUserManager,
        addOrUpdateFaceManager,
        queryFaceUserImageArchive,
        setFaceBase
    } from '@/api/faceManage'
    import {getSchoolGradeClass} from '@/api/common/common'
    import {thunderExport} from '@/utils/utils'
    import Uploader from '@/components/Uploader/WebUploader'
   import {importSchedulefun} from "@/api/systemSet/org.js";
    export default {
        name: 'faceManageIndex',
        data() {
            var facePicValidator = (rule, value, callback) => {
                if (!this.editForm.facePic || this.editForm.facePic.length === 0) {
                    return callback(new Error('请上传图片！'))
                } else {
                    callback()
                }
            };
            var userTypeValidator = (rule, value, callback) => {
                if (!this.settingForm.userType || this.settingForm.userType.length === 0) {
                    return callback(new Error('请设置证件照上传限制！'))
                } else {
                    callback()
                }
            };
            // var deviceTypeValidator = (rule, value, callback) => {
            //     if (this.settingForm.deviceType == 1) {
            //         if (this.settingForm.clientId.trim() == '') {
            //             return callback(new Error('请输入appKey！'));
            //         } else if (this.settingForm.secret.trim() == '') {
            //             return callback(new Error('请输入appSecret！'));
            //         } else {
            //             callback()
            //         }
            //     } else {
            //         callback()
            //     }
            // };
            return {
                facePic: [],
                editForm: {
                    facePic: []
                },
                showUploaderBox: false,
                currentEditId: null,
                rules: {
                    facePic: [{required: true, validator: facePicValidator, trigger: 'blur'}]
                },

                isCollectParentFace: false,
                checkDisabled: false,
                showNameEditBox: false,
                baseId: 0,
                manageName: '',
                isNewFace: false,
                canInitFace: false,
                baseStoreData: {},
                listQuery: {
                    userName: '',
                    pageNo: 1,
                    pageSize: 20,
                    userType: 1,
                    classId: 0,
                    gradeId: 0,
                    status: 0
                },
                listData: [],
                total: 0,
                listLoading: false,
                tableKey: 0,
                allGradeClassList: [],
                gradeList: [],
                classList: [],
                syncStatus: 0,

                isShowSetting: false,
                settingForm: {
                    clientId: '',
                    deviceType: 2,
                    secret: '',
                    userType: [1, 2],
                    key:''
                },
                settingFormRules: {
                    userType: [
                        {required: true, validator: userTypeValidator, trigger: 'blur'}
                    ],
                   
                },
                selected:[],
               
               dialogImportTeacherVisible: false,
                uploadPath: global.renlianPath + "thunder/archive/uploadToCOS",
                uploadData: {
                    token: this.$store.getters.token
                },
                downloadErrorUrl: '',
                importAvatarLoading: false,
                errorUserCount: 0,
                totalUserCount: 0,
                successUserCount: 0,
                resultShow: false,
                downloadUpdateUrl: '',
                btnText: '选择导入文件'
            }
        },
        mixins: [windowResizeMixin],
        components: {Uploader, ImagePreviewer, CaptureAvatar},
        created() {
            this.isInstallFaceBase();
            this.getSchoolGradeClassFunc();
        },
        computed: {
            exportURL() {
                return `${global.BaseNewPath}sys/user/export/exportFaceUser?userType=${this.listQuery.userType}&token=${this.$store.getters.token}&gradeId=${this.listQuery.gradeId}&classId=${this.listQuery.classId}&status=${this.listQuery.status}&userName=${this.listQuery.userName}`
            }
        },
        methods: {
            handleAvatarErr(err, file, fileList) {
            },
            newhandleAvatarSuccess(newres) {
              if (newres.code === 200) {
                  uploadBatchFace(newres.data.uploadNum,this.listQuery.userType)
                    .then(res => {
                        if (res.data.code === 200) {
                           this.totalUserCount = res.data.data.totalCount;
                           this.handleAvatarSchedule(res.data.data.importMarkId);
                        }
                    })
                    .catch(() => {
                    });
                 
              } else {
                  this.importAvatarLoading = false;
                  this.$alert(res.msg, '提示', {
                      confirmButtonText: '确定'
                  });
              }
            },
             handleAvatarSchedule(importMarkId) {
              let self = this;
              importSchedulefun(importMarkId).then(res => {
                    let data = res.data;
                    if (data.code === 200) {
                        let currCount = data.data.currCount ? data.data.currCount : 0;
                        if (!data.data.allHandled) {
                             this.btnText = '导入中（' + currCount + '/' + this.totalUserCount + '）';                           
                            setTimeout(() => {
                                self.handleAvatarSchedule(importMarkId);
                            }, 2000);
                        } else {
                            this.btnText = '选择导入文件';
                            this.newbtnText = '选择导入文件';                            
                            this.errorUserCount = data.data.failCount;
                            this.successUserCount = data.data.succeedCount;
                            this.downloadErrorUrl = global.BaseNewPath + 'sys/user/import/common/downloadResultXls?importMarkId=' + importMarkId + '&token=' + this.$store.getters.token;
                            this.importAvatarLoading = false;
                            this.resultShow=true;
                            this.isInstallFaceBase();
                            this.getSchoolGradeClassFunc();
                        }
                    } else {
                        this.importAvatarLoading = false;
                    }
                }).catch(res => {
                    this.importAvatarLoading = false;
                });
            },
            beforeAvatarUpload(file) {
                let suffix = file.name.split(".")[file.name.split(".").length - 1];
                if (suffix !== 'zip') {
                    this.$message.error("请上传后缀为.zip的模版文件!");
                    return false;
                }
            },
             selectionChangeHandler(selection) {
                this.selected = selection;
            },
             selectable(row) {
                if (row.syncStatus == 2) {
                    return true;
                }
            },
            //多选删除
            delFaces() {
                let delArr = [];
                if (this.selected.length > 0) {
                    this.$confirm('确认要清除勾选的用户人脸同步失败数吗？', '清除用户人脸同步失败数', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.selected.forEach(item => {
                            delArr.push(item.id);
                        });
                        deleteFaceBaseUser(delArr.join(",")).then(res => {
                            if (res.data.code === 200) {
                                this.$message.success("清除用户人脸同步失败数据成功");
                                this.getFaceDataBase()
                                 this.getFaceUserList()
                                this.selected = [];
                            } else {
                                this.$message.error(res.data.msg);
                            }

                        })
                    }).catch(() => {
                    });

                } else {
                    this.$message.warning("请选择要清除同步失败数据！");
                    this.listLoading = false;
                }
            },
            showErrorMsg(msg) {
                if(msg) {
                    this.$alert(msg, '信息', {
                        confirmButtonText: '确定',
                    });
                }

            },
            settingConfirm() {
                
                  if (this.settingForm.deviceType == 1) {
                    if (!this.settingForm.clientId) {
                         this.$message.error('请输入appKey！');
                        return
                    } 
                    if (!this.settingForm.secret) {
                        this.$message.error('请输入appSecret！');
                         return
                    } 
                } 
                 if (this.settingForm.deviceType == 4) {
                    if (!this.settingForm.clientId) {
                         this.$message.error('请输入appKey！');
                        return
                    } 
                    if (!this.settingForm.secret) {
                        this.$message.error('请输入appSecret！');
                         return
                    } 
                     if (!this.settingForm.key) {
                        this.$message.error('请输入key！');
                         return
                    } 
                } 
                this.$refs.settingForm.validate(isValid => {
                    if (isValid) {
                        setFaceBase({
                            deviceType: this.settingForm.deviceType,
                            id: this.baseId,
                            userType: parseInt(this.settingForm.userType.sort().join('')),
                            secret: (this.settingForm.deviceType == 1||this.settingForm.deviceType == 4)? this.settingForm.secret : '',
                            clientId:( this.settingForm.deviceType == 1||this.settingForm.deviceType == 4)? this.settingForm.clientId : '',
                            key:this.settingForm.deviceType == 4? this.settingForm.key : '',
                        })
                            .then(res => res.data)
                            .then(data => {
                                if (data.result) {
                                    this.$message.success('设置成功');
                                    this.isShowSetting = false;
                                } else {
                                    this.$message.error(data.msg);
                                }
                            })
                    }
                })
            },
            exportFileFunc() {
                let error = '';
                if (this.listQuery.userType != 1 && (this.listQuery.classId == 0 || this.listQuery.gradeId == 0)) {
                    error = '请按班级导出'
                }
                if (this.listQuery.status == 2) {
                    error = '暂无人脸'
                }
                if (error) {
                    this.$message.error(error)
                } else {
                    queryFaceUserImageArchive({
                        userName: this.listQuery.userName,
                        userType: this.listQuery.userType,
                        classId: this.listQuery.userType == 1 ? 0 : this.listQuery.classId,
                        gradeId: this.listQuery.userType == 1 ? 0 : this.listQuery.gradeId
                    })
                        .then(res => res.data)
                        .then(data => {
                            if (data.data) {
                                thunderExport(data.data.fileName, data.data.redisKey)
                            } else {
                                this.$message.error('暂无人脸')
                            }
                        })
                }
            },
            faceSave() {
                this.$refs.editForm.validate(isValid => {
                    if (isValid) {
                        let query = {
                            imageUrl: this.editForm.facePic[0].fileUrl,
                            userId: parseInt(this.currentEditId)
                        };
                        addOrUpdateFaceManager(query)
                            .then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        message: '修改成功',
                                        type: 'success'
                                    })
                                    this.getFaceDataBase()
                                    this.getFaceUserList()
                                    this.showUploaderBox = false
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'error'
                                    })
                                }
                            })
                            .catch(() => {
                            })
                    }
                })
            },
            // 学校年级班级
            getSchoolGradeClassFunc() {
                return getSchoolGradeClass()
                    .then(res => res.data)
                    .then(data => {
                        if (data.result) {
                            const pageData = JSON.parse(JSON.stringify(data.data))
                            this.allGradeClassList = pageData
                            this.gradeList = JSON.parse(JSON.stringify(pageData))
                            this.listQuery.gradeId = 0
                            this.selectGradeChange(0)
                        }
                    })
            },
            selectGradeChange(gradeVal) {
                this.listQuery.classId = 0

                if (gradeVal != 0) {
                    let gradeObj = this.allGradeClassList.find(item => item.id == gradeVal)
                    if (gradeObj) {
                        this.classList = JSON.parse(JSON.stringify(gradeObj.classList))
                    }
                }
                this.getFaceUserList()
            },
            isInstallFaceBase() {
                isInstallFaceBase()
                    .then(res => {
                        if (res.data.code === 200 && res.data.data === 'false') {
                            // 未安装
                            this.isNewFace = true
                        } else {
                            this.getFaceDataBase()
                        }
                    })
                    .catch(() => {
                    })
            },
            initFaceStore() {
                this.canInitFace = true
                createFaceBase()
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$router.go(0)
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'warning'
                            })
                        }
                        this.canInitFace = false
                    })
                    .catch(() => {
                        this.canInitFace = false
                    })
            },
            getFaceDataBase() {
                getFaceDataBase()
                    .then(res => {
                        let data = res.data.data;
                        if (res.data.code === 200) {
                            this.baseStoreData = data;
                            this.manageName = data.name;
                            this.baseId = data.id;
                            this.isCollectParentFace = data.isParentFace === 2;
                            if(data.userType) {
                                this.settingForm = {
                                    clientId: data.clientId||'',
                                    key:data.key||'',
                                    secret: data.secret||'',
                                    deviceType: data.deviceType,                                    
                                    userType: `${data.userType}`.split('').map(num => parseInt(num))
                                }
                                console.log('this.settingForm', this.settingForm)
                            }
                        }
                    })
                    .catch(() => {
                    })
            },
            getFaceUserList() {
                const args = {
                    userName: this.listQuery.userName,
                    pageNo: this.listQuery.pageNo,
                    pageSize: this.listQuery.pageSize,
                    userType: this.listQuery.userType,
                    classId: this.listQuery.userType == 1 ? 0 : this.listQuery.classId,
                    gradeId: this.listQuery.userType == 1 ? 0 : this.listQuery.gradeId,
                    status: this.listQuery.status,
                    syncStatus: this.syncStatus
                };
                getFaceUserList(args)
                    .then(res => {
                        let data = res.data.data
                        if (res.data.code === 200) {
                            this.listData = data.dataList
                            this.total = data.pagination.total
                        }
                    })
                    .catch(() => {
                    })
            },
            searchFaceName() {
                this.getFaceUserList()
            },
            cancelName() {
                this.showNameEditBox = false
                this.manageName = this.baseStoreData.name
            },
            editManageName() {
                if (!this.manageName.trim()) {
                    this.$message({
                        message: '请输入名称!',
                        type: 'warning'
                    })
                    return
                }
                let query = {
                    id: this.baseId,
                    isParentFace: this.isCollectParentFace ? 2 : 1,
                    name: this.manageName
                }
                this.checkDisabled = true
                updateFaceBase(query)
                    .then(res => {
                        this.checkDisabled = false
                        if (res.data.code === 200 && res.data.result) {
                            this.$message({
                                message: '修改成功!',
                                type: 'success'
                            })
                            this.baseStoreData.name = this.manageName
                            this.showNameEditBox = false
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'warning'
                            })
                        }
                    })
                    .catch(() => {
                        this.checkDisabled = false
                    })
            },
            toAddFace() {
                this.$router.push({path: 'faceManageUserAdd'})
            },
            editFace(id) {
                this.currentEditId = id
                getFaceUserManager(parseInt(id))
                    .then(res => {
                        let data = res.data.data
                        this.showUploaderBox = true
                        if (res.data.code === 200 && data && data.imageUrl) {
                            this.editForm.facePic = [
                                {
                                    fileUrl: data.imageUrl,
                                    fileName: ''
                                }
                            ]
                        } else {
                            this.editForm.facePic = []
                        }
                    })
                    .catch(() => {
                    })
            },
            shootFace(id) {
                this.currentEditId = id
                this.$refs.captureavatar.showDialog()
                getFaceUserManager(parseInt(id))
                    .then(res => {
                        let data = res.data.data
                        if (res.data.code === 200 && data && data.imageUrl) {
                            this.editForm.facePic = [
                                {
                                    fileUrl: data.imageUrl,
                                    fileName: ''
                                }
                            ]
                        } else {
                            this.editForm.facePic = []
                        }
                    })
                    .catch(() => {
                    })
            },
            inputFace(data) {
                let query = {
                    imageUrl: data[0].fileUrl,
                    userId: parseInt(this.currentEditId)
                };
                addOrUpdateFaceManager(query)
                    .then(res => {
                        if (res.data.code === 200) {
                            this.$message({
                                message: '修改成功',
                                type: 'success'
                            })
                            this.getFaceDataBase()
                            this.getFaceUserList()
                            this.showUploaderBox = false
                        } else {
                            this.$message({
                                message: res.data.msg,
                                type: 'error'
                            })
                        }
                        this.facePic = []
                    })
                    .catch(() => {
                    })
            },
            delFace(id) {
                this.$confirm('该操作将清除用户人脸数据，是否清除？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                })
                    .then(() => {
                        deleteFaceBaseUser(parseInt(id))
                            .then(res => {
                                if (res.data.code === 200) {
                                    this.$message({
                                        message: '清除成功!',
                                        type: 'success'
                                    })
                                    this.getFaceDataBase()
                                    this.getFaceUserList()
                                } else {
                                    this.$message({
                                        message: res.data.msg,
                                        type: 'warning'
                                    })
                                }
                            })
                            .catch(() => {
                            })
                    })
                    .catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        })
                    })
            },
            stateChange(val) {
                this.listQuery.userType = val

                this.getFaceUserList()
            },
            handleSizeChange(val) {
                this.listQuery.pageSize = val
                this.getFaceUserList()
            },
            handleCurrentChange(val) {
                this.listQuery.pageNo = val
                this.getFaceUserList()
            },
            // 点击删除校友人脸照片
            handleDelAlumnusFace() {
                this.$confirm('确认要删除吗？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'error',
                    lockScroll: false
                }).then(() => {
                    this.delAlumnusFace()
                })
            },
            delAlumnusFace() {
                delAlumnusFace()
                    .then(res => {
                        let _res = res.data
                        if (_res.code != 200) return Promise.reject(_res.msg)
                        else return _res.data
                    })
                    .then(data => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        })
                        this.getFaceDataBase()
                        this.getFaceUserList()
                    })
                    .catch(msg => {
                        this.$message({
                            message: msg,
                            type: 'error'
                        })
                    })
            }
        }
    }
</script>

<style scoped>
    .clearfix:after {
        content: '';
        display: block;
        font-size: 0;
        height: 0;
        clear: both;
        visibility: hidden;
    }

    .clearfix {
        zoom: 1;
    }
</style>
<style lang="scss" scoped>
.sns-btn-div {
        height: 80px;
        padding-left: 20px;
        padding-top: 20px;
    }

    .title {
        font-size: 18px;
        font-weight: bold;
        height: 30px;
        line-height: 30px;
    }

    .bs-callout {
        padding: 20px;
        margin: 20px 0;
        border: 1px solid #eee;
        border-left-width: 5px;
        border-radius: 3px;
    }

    .bs-callout-danger {
        border-left-color: #ce4844;
    }

    .info-title {
        /* height:30px; */
        line-height: 30px;
    }

    .bs-callout-warning {
        border-left-color: #aa6708;
    }
 .upload-import {
            display: inline-block;
        }
    .face_manage_wrap {
        padding: 12px;

        .header_title_wrap {
            margin-bottom: 10px;
            /*padding-bottom: 20px;*/
            /*border-bottom: 1px solid #eee;*/
            .manage_name {
                font-size: 20px;
                font-weight: 700;
                margin-right: 10px;
            }
        }

        .statistics_card_wrap {
            .statistics_card_item {
                width: 150px;
                height: 75px;
                float: left;
                text-align: center;
                margin: 10px 20px;
                background: #eee;
                overflow: hidden;
                border-radius: 5px;

                .card_item_number {
                    line-height: 30px;
                    font-size: 26px;
                    margin-top: 10px;
                    color: #333;
                }

                .card_item_desc {
                    line-height: 35px;
                    font-size: 14px;
                    color: #555;
                }
            }
        }

        .footer_wrap {
            padding: 10px;
        }
    }

    .face_init_wrap {
        text-align: center;
        padding-top: 50px;
    }

    .radio-container {
        margin-top: 6px;
    }

    .radio-item {
        line-height: 30px;
    }

    .extra-info {
        font-size: 14px;
        width: 400px;
    }

    .extra-info__line > * {
        display: inline-block;
        vertical-align: middle;
    }
</style>
