<template>
  <div class="pcTypeTwo-wraps">
    <div class="pcTypeTwo-wrap">
      <div class="pcTypeTwo-add">
        <el-row class="menu-row">
          <el-col :span="10">
            <div>
              <el-button size="small" class="filter-item" @click="goBack()">返回
              </el-button>
              <el-button size="small" class="filter-item" type="primary" @click="handleAddTypeTwo()">保存
              </el-button>
            </div>
          </el-col>
          <el-col :span="14">
            <div class="menu-right clearfix">
              <div class="skin-box clearfix">
                <div class="title">皮肤</div>
                <div class="text skin-switch" @click="skinBoxShow=!skinBoxShow">
                  <div class="color-box skin-color1" v-if="initJsonData.infoType==1">
                    <i class="fa fa-chevron-down color-down-icon" aria-hidden="true"></i>
                  </div>
                  <div class="color-box skin-color2" v-if="initJsonData.infoType==2">
                    <i class="fa fa-chevron-down color-down-icon" aria-hidden="true"></i>
                  </div>
                </div>
                <div class="skin-show-box" v-show="skinBoxShow" v-on:click.stop="radioSkin">
                  <el-radio-group v-model="initJsonData.infoType" @change="radioChange">
                    <el-radio :label="1">
                      <span class="skin-color skin-color1"></span>
                    </el-radio>
                    <el-radio :label="2">
                      <span class="skin-color skin-color2"></span>
                    </el-radio>
                  </el-radio-group>
                </div>
              </div>
              <div class="playTime clearfix">
                <div class="title">播放切换时间</div>
                <div class="text">
                  <el-select  size="small" v-model="initJsonData.shufflingTime" placeholder="请选择模块类型">
                    <el-option
                            v-for="shufflingItem in shufflingTimeList"
                            :key="shufflingItem.value"
                            :label="shufflingItem.label"
                            :value="shufflingItem.value">
                    </el-option>
                  </el-select>
                </div>
              </div>
              <div class="default-cover clearfix">
                <div class="title">默认封面</div>
                <div class="text pcTop">
                  <uploader useSysBucket pathPrefix="pcTypeTwoEdit"
                    :multiple="true" showResult="image" showMode="moduleCover" v-model="files" showModeText="推荐1200*280" showModeNum="one" :extList="['jpeg', 'jpg', 'png', 'bmp', 'gif']">
                    </uploader>
                    <div class="mask-cover-img" v-if="files&&files.length!==0">编辑logo(推荐1200*280)</div>
                  <!-- <el-upload
                  class="cover-uploader"
                  :action="UploadPath"
                  :show-file-list="false"
                  :before-upload="handleBeforeCover"
                  :on-success="handleCoverSuccess"
                  accept=".image,.jpg,.jpeg,.image,.bmp,.image,.gif,.png">
                  <div class="defaultCoverBox" v-if="initJsonData.initPhoto">
                    <img  :style="`backgroundImage:url(${initJsonData.initPhoto})`" class="cover-img">
                    <div class="mask-cover-img">编辑logo(推荐1200*280)</div>
                  </div>
                  <i v-else class="el-icon-plus avatar-uploader-icon"> <span class="tag-lang">推荐1200*280</span></i>
                  </el-upload> -->
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="pcType-cont custom—scrollbar clearfix" :style="`height:${addServiceHeight-20}px`">
          <div class="header-top">
            <div class="logo clearfix">
              <img :src="schoolrLogoUrl" alt="">
              <div class="logo-title">
                <span class="name">{{schoolfullName}}</span>
              </div>
            </div>
            <div class="login-box">
              <img src="../../assets/pc/login_pic.png" alt="">
            </div>
          </div>
          <div class="bannerBox clearfix">
            <uploader useSysBucket pathPrefix="pcTypeTwoEdit" multiple v-model="bannerList" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image" showModeText="添加轮播图(1200*360)" :max="5" @maxHandler="maxHandler"></uploader>
            <!-- <ul class="bannerUl">
              <li class="bannerLi" :style="`backgroundImage:url(${bannerItem.url})`" v-for="(bannerItem,index) in bannerList" :key="index">
              <div class="img-del-btn" @click.stop="handleBannerRemove(index)">
                  <div class="del-box">
                      <i class="fa fa-trash-o" aria-hidden="true"></i>
                  </div>
                </div>
              </li>
            </ul>
            <el-upload
              class="bannerAdd"
              :action="UploadPath"
              :before-upload="handleBeforeBanner"
              :on-success="handleBannerSuccess"  accept=".image,.jpg,.jpeg,.image,.bmp,.image,.gif,.png">
              <i class="el-icon-plus bannerAddIcon"></i>
              <span class="bannerAddTitle">添加轮播图<br/><span style="font-size:12px;">建议1200*260</span></span>
            </el-upload> -->
          </div>
          <!-- 导航栏-->
          <div class="navBox clearfix">
            <ul class="navMenuUl">
              <li class="navMenuLi" v-for="(columnNav,index) in columnJson" :key="index">
                {{columnNav.name}}
              </li>
            </ul>
            <div class="navAdd" @click="showDialogNav">
              <i class="el-icon-plus avatar-uploader-icon navAddIcon"></i>
              <span class="navAddTitle">添加导航栏</span>
            </div>
          </div>
          <!--滚动消息列-->
          <div class="scrollNewBox clearfix">
            <div class="scrollBox">
              <div class="scrolljiaBox" v-if="Object.keys(rollModuleJson).length==0" @click.stop="showDialogScroll()">
                <i class="el-icon-plus avatar-uploader-icon scrollJiaIcon">
                </i>
                <div class="scrollTag"><span>添加滚动消息模块</span></div>
              </div>
              <div class="scrollContItem" v-if="Object.keys(rollModuleJson).length!==0" :rollModuleJson="rollModuleJson">
                <div class="title">{{rollModuleJson.name}}</div>
                <div class="control-btn">
                  <a href="javascript:;" class="scrollDelBtn" @click.stop="delDialogScroll()">
                    删除
                  </a>
                  <a href="javascript:;" class="scrollUpdateBtn" @click.stop="showDialogScroll()">
                    更改
                  </a>
                </div>
              </div>
            </div>
            <div class="searchBox">
              <img src="../../assets/pc/search_pic1.png" alt="">
            </div>
          </div>
          <!--主体3大块-->
          <div class="mainBox clearfix">
            <div class="mainBoxBasic mainBoxLeft">
              <div class="leftTopModule">
                <div class="leftTopjiaBox" v-if="Object.keys(leftModuleJson).length==0" @click.stop="showDialogleftModule()">
                  <i class="el-icon-plus avatar-uploader-icon leftTopJiaIcon">
                  </i>
                  <div class="leftTopTag"><span>添加左侧固定消息模块</span></div>
                </div>
                <div class="leftTopContItem" v-if="Object.keys(leftModuleJson).length!==0" :leftModuleJson="leftModuleJson">
                  <div class="title">{{leftModuleJson.name}}</div>
                  <div class="control-btn">
                    <a href="javascript:;" class="leftTopDelBtn" @click.stop="delDialogleftModule()">
                      删除
                    </a>
                    <a href="javascript:;" class="leftTopUpdateBtn" @click.stop="showDialogleftModule()">
                      更改
                    </a>
                  </div>
                </div>
              </div>
              <div class="MiddleModuleBox mainBoxLeftMiddle">
                <div class="middleModuleContItem" v-for="(urlLeftModuleItem,urlLeftModuleIndex) in urlLeftModuleJson" :key="urlLeftModuleIndex" v-if="urlLeftModuleJson&&urlLeftModuleJson.length!==0">
                  <div class="title">{{urlLeftModuleItem.name}}</div>
                  <div class="control-btn">
                    <a href="javascript:;" class="middleModuleDelBtn" @click.stop="delDialogUrlLeftModule(urlLeftModuleItem.id)">
                      删除
                    </a>
                    <a href="javascript:;" class="middleModuleUpdateBtn" @click.stop="showDialogUrlLeftModule2(urlLeftModuleItem.id)">
                      更改
                    </a>
                  </div>
                </div>
                <div class="middleModuleJiaBox" @click="showDialogUrlLeftModule()">
                  <i class="el-icon-plus avatar-uploader-icon middleModuleJiaIcon">
                  </i>
                  <span>添加url模块</span>
                </div>
              </div>
              <div class="leftTopModule leftMessageBox">
                <div class="leftTopjiaBox" v-if="Object.keys(leftMessageJson).length==0" @click.stop="showDialogleftMessage()">
                  <i class="el-icon-plus avatar-uploader-icon leftTopJiaIcon">
                  </i>
                  <div class="leftTopTag"><span>添加左侧消息</span></div>
                </div>
                <div class="leftTopContItem" v-if="Object.keys(leftMessageJson).length!==0" :leftMessageJson="leftMessageJson">
                  <div class="title tuMessageTitle">{{leftMessageJson.name}}</div>
                  <div class="control-btn">
                    <a href="javascript:;" class="leftTopDelBtn" @click.stop="delDialogleftMessage()">
                      删除
                    </a>
                    <a href="javascript:;" class="leftTopUpdateBtn" @click.stop="showDialogleftMessage()">
                      更改
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div class="mainBoxBasic mainBoxMiddle">
              <div class="MiddleModuleBox staticHeight">
                <div class="middleModuleContItem" v-for="(middleModuleItem,middleModuleIndex) in middleModuleJson" :key="middleModuleIndex" v-if="middleModuleJson&&middleModuleJson.length!==0">
                  <div class="title">{{middleModuleItem.name}}</div>
                  <div class="control-btn">
                    <a href="javascript:;" class="middleModuleDelBtn" @click.stop="delDialogMiddleModule(middleModuleItem.id)">
                      删除
                    </a>
                    <a href="javascript:;" class="middleModuleUpdateBtn" @click.stop="showDialogMiddleModule2(middleModuleItem.id)">
                      更改
                    </a>
                  </div>
                </div>
                <div class="middleModuleJiaBox" @click="showDialogMiddleModule()">
                  <i class="el-icon-plus avatar-uploader-icon middleModuleJiaIcon">
                  </i>
                  <span>添加主体中间模块</span>
                </div>
              </div>
            </div>
            <div class="mainBoxBasic mainBoxRight">
              <div class="MiddleModuleBox rightColumnBox staticHeight">
                <div class="middleModuleContItem" v-for="(rightColumnItem,rightColumnIndex) in rightColumnJson" :key="rightColumnIndex">
                  <div class="title">{{rightColumnItem.name}}</div>
                  <div class="control-btn">
                    <a href="javascript:;" class="middleModuleDelBtn" @click.stop="delDialogRightColumn(rightColumnItem.id)">
                      删除
                    </a>
                    <a href="javascript:;" class="middleModuleUpdateBtn" @click.stop="showDialogRightColumn2(rightColumnItem.id)">
                      更改
                    </a>
                  </div>
                </div>
                <div class="middleModuleJiaBox" @click="showDialogRightColumn()">
                  <i class="el-icon-plus avatar-uploader-icon middleModuleJiaIcon">
                  </i>
                  <span>添加栏目</span>
                </div>
              </div>
            </div>
          </div>
          <div class="picsBox clearfix">
            <div class="scrollBox">
              <div class="scrolljiaBox" v-if="Object.keys(bottomPhotoModuleJson).length==0" @click.stop="showDialogPhotoModule()">
                <i class="el-icon-plus avatar-uploader-icon scrollJiaIcon">
                </i>
                <div class="scrollTag"><span>添加图片型模块</span></div>
              </div>
              <div class="scrollContItem" v-if="Object.keys(bottomPhotoModuleJson).length!==0" :bottomPhotoModuleJson="bottomPhotoModuleJson">
                <div class="title">{{bottomPhotoModuleJson.name}}</div>
                <div class="control-btn">
                  <a href="javascript:;" class="scrollDelBtn" @click.stop="delDialogPhotoModule()">
                    删除
                  </a>
                  <a href="javascript:;" class="scrollUpdateBtn" @click.stop="showDialogPhotoModule()">
                    更改
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="footerBox clearfix">
            <p>访问量统计 &nbsp;联系方式&nbsp;版权&nbsp;备案号</p>
          </div>
        </div>
        <el-dialog title="添加或修改图片型模块" :visible.sync="dialogPhotoModuleVisible">
            <el-form :model="bottomPhotoModuleJsonObject" :rules="bottomPhotoModuleJsonObjectRules" ref="bottomPhotoModuleJsonObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="bottomPhotoModuleJsonObject.id" placeholder="请选择图片型模块">
                      <el-option
                        v-for="picModuleItem in picModuleList"
                        :key="picModuleItem.id"
                        :label="picModuleItem.name"
                        :value="picModuleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogPhotoModuleVisible=false">取 消</el-button>
                <el-button type="primary" @click="addbottomPhotoModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="导航栏添加或更换" :visible.sync="dialogNavVisible" class="dialoglinkWrap">
          <div class="dialoglinkBox clearfix">
            <div class="checkitem" v-for="(columnItem,index) in columnList" :key="index">
                <input class="check-select" type="checkbox" v-model="columnItem.state" name="imgText" v-on:click="CheckItem(columnItem)">
                <div class="checkitem-box">
                  <img class="check-img" v-if="columnItem.logoUrl" :src="columnItem.logoUrl">
                  <img class="check-img" v-else src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png">
                  <p class="check-title" >{{columnItem.name}}</p>
                </div>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogNavVisible=false">取 消</el-button>
              <el-button type="primary" @click="addCheckAndScore()">保 存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="添加或修改滚动模块" :visible.sync="dialogScrollVisible">
            <el-form :model="rollModuleObject" :rules="rollModuleObjectRules" ref="rollModuleObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="rollModuleObject.id" placeholder="请选择模块">
                      <el-option
                        v-for="moduleItem in moduleList"
                        :key="moduleItem.id"
                        :label="moduleItem.name"
                        :value="moduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogScrollVisible=false">取 消</el-button>
                <el-button type="primary" @click="addrollModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加或修改主体左侧模块" :visible.sync="dialogleftTopVisible">
            <el-form :model="leftModuleJsonObject" :rules="leftModuleJsonObjectRules" ref="leftModuleJsonObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="leftModuleJsonObject.id" placeholder="请选择模块">
                      <el-option
                        v-for="moduleItem in moduleList"
                        :key="moduleItem.id"
                        :label="moduleItem.name"
                        :value="moduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogleftTopVisible=false">取 消</el-button>
                <el-button type="primary" @click="addleftModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加主体中间模块" :visible.sync="dialogMiddleModuleVisible">
            <el-form :model="middleModuleJsonObject" :rules="middleModuleJsonObjectRules" ref="middleModuleJsonObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="middleModuleJsonObject.id" placeholder="请选择模块">
                      <el-option
                        v-for="moduleItem in moduleList"
                        :key="moduleItem.id"
                        :label="moduleItem.name"
                        :value="moduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogMiddleModuleVisible=false">取 消</el-button>
                <el-button type="primary" @click="addMiddleModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改主体中间模块" :visible.sync="dialogMiddleModuleVisible2">
            <el-form :model="middleModuleJsonObject" :rules="middleModuleJsonObjectRules" ref="middleModuleJsonObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="middleModuleJsonObject.id" placeholder="请选择模块">
                      <el-option
                        v-for="moduleItem in moduleList"
                        :key="moduleItem.id"
                        :label="moduleItem.name"
                        :value="moduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogMiddleModuleVisible2=false">取 消</el-button>
                <el-button type="primary" @click="updateMiddleModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加url模块" :visible.sync="dialogUrlLeftModuleVisible">
            <el-form :model="urlLeftModuleJsonObject" :rules="urlLeftModuleJsonObjectRules" ref="urlLeftModuleJsonObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="urlLeftModuleJsonObject.id" placeholder="请选择模块">
                      <el-option
                        v-for="urlmoduleItem in urlModuleList"
                        :key="urlmoduleItem.id"
                        :label="urlmoduleItem.name"
                        :value="urlmoduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUrlLeftModuleVisible=false">取 消</el-button>
                <el-button type="primary" @click="addUrlLeftModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改url模块" :visible.sync="dialogUrlLeftModuleVisible2">
            <el-form :model="urlLeftModuleJsonObject" :rules="urlLeftModuleJsonObjectRules" ref="urlLeftModuleJsonObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="urlLeftModuleJsonObject.id" placeholder="请选择模块">
                      <el-option
                        v-for="urlmoduleItem in urlModuleList"
                        :key="urlmoduleItem.id"
                        :label="urlmoduleItem.name"
                        :value="urlmoduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogUrlLeftModuleVisible2=false">取 消</el-button>
                <el-button type="primary" @click="updateUrlLeftModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加栏目" :visible.sync="dialogRightColumnVisible">
            <el-form :model="rightColumnJsonObject" :rules="rightColumnJsonObjectRules" ref="rightColumnJsonObject" label-width="100px">
                <el-form-item label="栏目" prop="id">
                  <el-select class="selectWidth" v-model="rightColumnJsonObject.id" placeholder="请选择栏目">
                      <el-option
                        v-for="columnItem in columnList"
                        :key="columnItem.id"
                        :label="columnItem.name"
                        :value="columnItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogRightColumnVisible=false">取 消</el-button>
                <el-button type="primary" @click="addRightColumnScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="修改栏目" :visible.sync="dialogRightColumnVisible2">
            <el-form :model="rightColumnJsonObject" :rules="rightColumnJsonObjectRules" ref="rightColumnJsonObject" label-width="100px">
                <el-form-item label="栏目" prop="id">
                  <el-select class="selectWidth" v-model="rightColumnJsonObject.id" placeholder="请选择栏目">
                      <el-option
                        v-for="columnItem in columnList"
                        :key="columnItem.id"
                        :label="columnItem.name"
                        :value="columnItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogRightColumnVisible2=false">取 消</el-button>
                <el-button type="primary" @click="updateRightColumnScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加或修改左侧消息" :visible.sync="dialogleftMessageVisible">
            <el-form :model="leftMessageJsonObject" :rules="leftMessageJsonObjectRules" ref="leftMessageJsonObject" label-width="100px">
                <el-form-item label="模块列表" prop="moduleId">
                  <el-select class="selectWidth" v-model="leftMessageJsonObject.moduleId" placeholder="请选择模块" @change="moduleChange">
                      <el-option
                        v-for="moduleItem in moduleList"
                        :key="moduleItem.id"
                        :label="moduleItem.name"
                        :value="moduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="消息列表" v-if="messageList&&messageList.length!==0">
                  <el-select class="selectWidth" v-model="leftMessageJsonObject.id" placeholder="请选择消息">
                      <el-option
                        v-for="messageItem in messageList"
                        :key="messageItem.id"
                        :label="messageItem.title"
                        :value="messageItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogleftMessageVisible=false">取 消</el-button>
                <el-button type="primary" @click="addleftMessageScore()">保 存</el-button>
            </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>
<script>
import mixins from '@/mixins/windowResize';
import Uploader from '@/components/Uploader/WebUploader';
import {getSchooWebColumnListByWebId,getSchoolWebModuleListByWebId,getModuleMessageListByModuleId} from '@/api/webManage';
import {addAndUpdateSchoolWebTemplatePcTw,getSchoolWebTemplatePcTw} from '@/api/webType2';
import {mapGetters} from 'vuex';
export default {
  components:{
    Uploader
  },
  data(){
    return{
      UploadPath:global.BasePath+ 'common/addImageUp',////图片上传路径
      initJsonData:{//设置Json
        infoType:3,
        initPhoto:'',
        shufflingTime:2
      },
      codeType:this.$route.query.codeType,
      columnJson:[],//栏目
      rollModuleJson:{},//滚动
      leftModuleJson:{},//主体左侧固定模块
      middleModuleJson:[],//主体中间
      urlLeftModuleJson:[],//左侧url模块
      rightColumnJson:[],//	右侧一级栏目列表
      leftMessageJson:{},//左侧消息
      bottomPhotoModuleJson:{},//底部图片展示型模块
      skinBoxShow:false,//控制皮肤
      dialogNavVisible:false,//控制nav导航栏弹窗
      dialogScrollVisible:false,//控制滚动模块弹窗
      shufflingTimeList:[
        {
          value:2,
          label:'2秒'
        },{
          value:3,
          label:'3秒'
        },{
          value:4,
          label:'4秒'
        },{
          value:5,
          label:'5秒'
        },{
          value:6,
          label:'6秒'
        },{
          value:7,
          label:'7秒'
        },{
          value:8,
          label:'8秒'
        },{
          value:9,
          label:'9秒'
        },{
          value:10,
          label:'10秒'
        }
      ],
      bannerList:[],
      columnList:[],
      moduleList:[],
      messageList:[],
      urlModuleList:[],
      picModuleList:[],
      rollModuleObject:{
        id:''
      },
      rollModuleObjectRules:{
        id:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      dialogleftTopVisible:false,
      leftModuleJsonObject:{
        id:''
      },
      leftModuleJsonObjectRules:{
        id:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      dialogMiddleModuleVisible:false,
      dialogMiddleModuleVisible2:false,
      middleModuleJsonObject:{
        id:''
      },
      middleModuleJsonObjectRules:{
        id:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      middleModuleNum:null,
      dialogUrlLeftModuleVisible:false,
      dialogUrlLeftModuleVisible2:false,
      urlLeftModuleJsonObject:{
        id:''
      },
      urlLeftModuleJsonObjectRules:{
        id:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      urlLeftModuleNum:null,
      dialogRightColumnVisible:false,
      dialogRightColumnVisible2:false,
      rightColumnJsonObject:{
        id:''
      },
      rightColumnJsonObjectRules:{
        id:[
          {required: true, message: '请选择栏目', trigger: 'change'}
        ]
      },
      rightColumnNum:null,
      leftMessageJsonObject:{
        moduleId:'',
        id:''
      },
      leftMessageJsonObjectRules:{
        moduleId:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      dialogleftMessageVisible:false,
      bottomPhotoModuleJsonObject:{
        id:''
      },
      bottomPhotoModuleJsonObjectRules:{
        id:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      dialogPhotoModuleVisible:false,
      pcTypeDetailList:{},
      detailInitJson:{},
      detailPhotoJson:[],
      detailColumnJson:[],
      detailRollModuleJson:{},
      detailLeftModuleJson:{},
      detailUrlLeftModuleJson:[],
      detailLeftMessageJson:{},
      files:[]
    }
  },
  created(){
    this.getSchooWebColumnListByWebIdFunc();//栏目列表
    this.getSchoolWebModuleListByWebIdFunc();//模块列表
    this.getSchoolWebUrlModuleListByWebIdFunc();//url模块列表
    this.getSchoolWebPicModuleListByWebIdFunc();//图片模块列表
  },
  mounted(){
    var This=this;
    setTimeout(function(){
      This.getSchoolWebTemplatePcTwFunc();//根据模块类型及webId查询pc模板信息
    },200);
  },
  computed:{
    ...mapGetters([
      'schoolrLogoUrl',
      'schoolfullName',
      'webId'
    ])
  },
  mixins:[mixins],
  methods:{
    maxHandler(maxLength){
      //做轮播图片不超过5张控制
      if(maxLength){
        this.$message({
          type: 'error',
          message: `轮播图最多上传${maxLength}张！`
        });
      }
    },
    //处理图片名
    fileNameUse(file){
      return file.indexOf('?') !== -1 ?file.slice(0, file.indexOf('?')) : file;
    },
    goBack(){
      this.$router.push({
        path:'/main/pcTypeTwo',
        query:{
          codeType:this.codeType
        }
      })
    },
    getSchoolWebTemplatePcTwFunc(){
      getSchoolWebTemplatePcTw({
        webId:localStorage.getItem("webId"),
        templateType:this.codeType.toString()
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          if(data.data){
            let detailData=data.data;
            this.pcTypeDetailList=detailData;
            let detailInitJson=JSON.parse(detailData.initJson);
            this.initJsonData.infoType=detailInitJson.infoType;
            this.initJsonData.shufflingTime=detailInitJson.shufflingTime;
            // this.initJsonData.initPhoto=detailInitJson.initPhoto;
            if(detailInitJson.initPhoto){
              let fileName=this.fileNameUse(detailInitJson.initPhoto).replace(/.+\//, "");
              this.files.push({
                fileName:fileName,
                fileUrl:detailInitJson.initPhoto
              })
            }
            this.bannerList=[];
            if(data.data.photoJson&&data.data.photoJson.length!==0){
              let photoJsonListBox=JSON.parse(data.data.photoJson);
              for(var i=0;i<photoJsonListBox.length;i++){
                let fileName=this.fileNameUse(photoJsonListBox[i]).replace(/.+\//, "");
                //console.log("11",fileName);
                this.bannerList.push({
                  fileName:fileName,
                  fileUrl:photoJsonListBox[i]
                })

              }
            }
            // this.bannerList=[];
            // let photoJsonListBox=JSON.parse(detailData.photoJson);
            // photoJsonListBox.forEach((item)=>{
            //   this.bannerList.push({
            //     url:item
            //   })
            // });
            this.columnJson=JSON.parse(detailData.columnJson);
            for(var i=0;i<this.columnList.length;i++){
              for(var j=0;j<this.columnJson.length;j++){
                if(this.columnList[i].id==this.columnJson[j].id){
                  this.columnList[i].state=true;
                }
              }
            }
            this.rollModuleJson=JSON.parse(detailData.rollModuleJson);
            this.rollModuleObject.id=this.rollModuleJson.id;
            this.leftModuleJson=JSON.parse(detailData.leftModuleJson);
            this.leftModuleJsonObject.id=this.leftModuleJson.id;
            this.urlLeftModuleJson=JSON.parse(detailData.urlLeftModuleJson);
            this.leftMessageJson=JSON.parse(detailData.leftMessageJson);
            this.middleModuleJson=JSON.parse(detailData.middleModuleJson);
            this.rightColumnJson=JSON.parse(detailData.rightColumnJson);
            this.bottomPhotoModuleJson=JSON.parse(detailData.bottomPhotoModuleJson);
          }else{
            this.pcTypeDetailList=data.data;
          }
        }
      })
    },
    delDialogPhotoModule(){
      this.$confirm('删除模块网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.bottomPhotoModuleJson={};
         this.bottomPhotoModuleJsonObject.id='';
      }).catch(() => {})
    },
    addbottomPhotoModuleScore(){
      this.$refs.bottomPhotoModuleJsonObject.validate((valid)=>{
        if(valid){
          this.dialogPhotoModuleVisible=false;
          this.bottomPhotoModuleJson={};
          this.moduleList.forEach((itemList)=>{
            if(this.bottomPhotoModuleJsonObject.id==itemList.id){
              this.bottomPhotoModuleJson.id=itemList.id;
              this.bottomPhotoModuleJson.name=itemList.name;
              this.bottomPhotoModuleJson.logoUrl=itemList.logoUrl;
              this.bottomPhotoModuleJson.type=itemList.type;
            }
          })
        }
      })
    },
    showDialogPhotoModule(){
      this.dialogPhotoModuleVisible=true;
    },
    delDialogleftMessage(){
      this.$confirm('删除左侧消息网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.leftMessageJson={};
        this.leftModuleJsonObject.id='';
      }).catch(() => {})
    },
    moduleChange(val){
      this.getModuleMessageListByModuleIdFunc(val);
    },
    getModuleMessageListByModuleIdFunc(val){
      //val就是模块的id
      getModuleMessageListByModuleId({
        moduleId:val
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.messageList=data.data;
          if(data.data&&data.data.length!==0){
            this.leftMessageJsonObject.id=this.messageList[0].id;
          }else{
            this.leftMessageJsonObject.id='';
            this.leftMessageJsonObject.moduleId='';
          }
        }
      })
    },
    addleftMessageScore(){
      this.$refs.leftMessageJsonObject.validate((valid)=>{
        if(valid){
          this.dialogleftMessageVisible=false;
          this.leftMessageJson={};
          this.messageList.forEach((itemList)=>{
            if(this.leftMessageJsonObject.id==itemList.id){
              this.leftMessageJson.id=itemList.id;
              this.leftMessageJson.name=itemList.title;
              this.leftMessageJson.content=itemList.content;
            }
          })
        }
      });
    },
    updateRightColumnScore(){
       //主体右侧栏目
      this.$refs.rightColumnJsonObject.validate((valid)=>{
        if(valid){
          this.dialogRightColumnVisible2=false;
          this.columnList.forEach((itemList)=>{
            if(this.rightColumnJsonObject.id==itemList.id){
              let flag=true;
              let itemListId=itemList.id;
              this.rightColumnJson.forEach((subItem)=>{
                if(itemListId==subItem.id){
                  this.$message({
                    type: 'error',
                    message: '相同栏目不能重复添加！'
                  });
                  flag=false;
                }
              })
              if(flag){
                if(this.rightColumnJson.length>3){
                  this.$message({
                    type: 'error',
                    message: '最多添加3个！'
                  });
                }else{
                  this.rightColumnJson.forEach((title,titleindex)=>{
                    if(this.rightColumnNum==title.id){
                      this.rightColumnJson.splice(titleindex,1,{
                        id:itemList.id,
                        name:itemList.name,
                        logoUrl:itemList.logoUrl,
                        type:itemList.type,
                        columnUrl:itemList.columnUrl
                      })
                    }
                  })
                }
              }
            }
          })
        }
      })
    },
    delDialogRightColumn(id){
      //右侧栏目删除
      this.$confirm('删除右侧栏目网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.rightColumnJson.forEach((item,index)=>{
          if(item.id==id){
            this.rightColumnJson.splice(index,1);
          }
        })
      }).catch(() => {})
    },
    addRightColumnScore(){
       //主体右侧栏目
      this.$refs.rightColumnJsonObject.validate((valid)=>{
        if(valid){
          this.dialogRightColumnVisible=false;
          this.columnList.forEach((itemList)=>{
            if(this.rightColumnJsonObject.id==itemList.id){
              let flag=true;
              let itemListId=itemList.id;
              this.rightColumnJson.forEach((subItem)=>{
                if(itemListId==subItem.id){
                  this.$message({
                    type: 'error',
                    message: '相同栏目不能重复添加！'
                  });
                  flag=false;
                }
              })
              if(flag){
                if(this.rightColumnJson.length>=3){
                  this.$message({
                    type: 'error',
                    message: '最多添加3个！'
                  });
                }else{
                  this.rightColumnJson.push({
                    id:itemList.id,
                    name:itemList.name,
                    logoUrl:itemList.logoUrl,
                    type:itemList.type,
                    columnUrl:itemList.columnUrl
                  })
                }
              }
            }
          })
        }
      })
    },
    updateUrlLeftModuleScore(){
      //主体左侧url模块
      this.$refs.urlLeftModuleJsonObject.validate((valid)=>{
        if(valid){
          this.dialogUrlLeftModuleVisible2=false;
          this.urlModuleList.forEach((itemList)=>{
            if(this.urlLeftModuleJsonObject.id==itemList.id){
              let flag=true;
              let itemListId=itemList.id;
              this.urlLeftModuleJson.forEach((subItem)=>{
                if(itemListId==subItem.id){
                  this.$message({
                    type: 'error',
                    message: '相同url模块不能重复添加！'
                  });
                  flag=false;
                }
              })
              if(flag){
                if(this.urlLeftModuleJson.length>5){
                  this.$message({
                    type: 'error',
                    message: '最多添加5个！'
                  });
                }else{
                  this.urlLeftModuleJson.forEach((title,titleindex)=>{
                    if(this.urlLeftModuleNum==title.id){
                      this.urlLeftModuleJson.splice(titleindex,1,{
                        id:itemList.id,
                        name:itemList.name,
                        columnUrl:itemList.columnUrl,
                        logoUrl:itemList.logoUrl
                      })
                    }
                  })
                }
              }
            }
          })
        }
      })
    },
    delDialogUrlLeftModule(id){
      //左侧url模块删除
      this.$confirm('删除url模块网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.urlLeftModuleJson.forEach((item,index)=>{
          if(item.id==id){
            this.urlLeftModuleJson.splice(index,1);
          }
        })
      }).catch(() => {})
    },
    addUrlLeftModuleScore(){
      //主体左侧url模块
      this.$refs.urlLeftModuleJsonObject.validate((valid)=>{
        if(valid){
          this.dialogUrlLeftModuleVisible=false;
          this.urlModuleList.forEach((itemList)=>{
            if(this.urlLeftModuleJsonObject.id==itemList.id){
              let flag=true;
              let itemListId=itemList.id;
              this.urlLeftModuleJson.forEach((subItem)=>{
                if(itemListId==subItem.id){
                  this.$message({
                    type: 'error',
                    message: '相同url模块不能重复添加！'
                  });
                  flag=false;
                }
              })
              if(flag){
                if(this.urlLeftModuleJson.length>=5){
                  this.$message({
                    type: 'error',
                    message: '最多添加5个！'
                  });
                }else{
                  this.urlLeftModuleJson.push({
                    id:itemList.id,
                    name:itemList.name,
                    columnUrl:itemList.columnUrl,
                    logoUrl:itemList.logoUrl
                  })
                }
              }
            }
          })
        }
      })
    },
    showDialogleftMessage(){
      this.dialogleftMessageVisible=true;
    },
    showDialogUrlLeftModule(){
      this.dialogUrlLeftModuleVisible=true;
    },
    showDialogRightColumn(){
      this.dialogRightColumnVisible=true;
    },
    showDialogRightColumn2(id){
      //右侧栏目更改
      this.dialogRightColumnVisible2=true;
      this.rightColumnNum=id;
    },
    showDialogUrlLeftModule2(id){
      //url修改弹窗
      this.dialogUrlLeftModuleVisible2=true;
      this.urlLeftModuleNum=id;
    },
    delDialogMiddleModule(id){
      //主体中间删除
      this.$confirm('删除主体中间模块网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.middleModuleJson.forEach((item,index)=>{
          if(item.id==id){
            this.middleModuleJson.splice(index,1);
          }
        })
      }).catch(() => {})
    },
    addMiddleModuleScore(){
       //主体左侧
      this.$refs.middleModuleJsonObject.validate((valid)=>{
        if(valid){
          this.dialogMiddleModuleVisible=false;
          this.moduleList.forEach((itemList)=>{
            if(this.middleModuleJsonObject.id==itemList.id){
             // console.log("ddfdsf",itemList);
              let flag=true;
              let itemListId=itemList.id;
              this.middleModuleJson.forEach((subItem)=>{
                if(itemListId==subItem.id){
                  this.$message({
                    type: 'error',
                    message: '相同模块不能重复添加！'
                  });
                  flag=false;
                }
              })
              if(flag){
                if(this.middleModuleJson.length>=2){
                  this.$message({
                    type: 'error',
                    message: '最多添加2个！'
                  });
                }else{
                  this.middleModuleJson.push({
                    id:itemList.id,
                    name:itemList.name,
                    logoUrl:itemList.logoUrl,
                    type:itemList.type
                  })
                }
              }
            }
          })
        }
      })
    },
    updateMiddleModuleScore(){
      this.$refs.middleModuleJsonObject.validate((valid)=>{
        if(valid){
          this.dialogMiddleModuleVisible2=false;
          this.moduleList.forEach((itemList)=>{
            if(this.middleModuleJsonObject.id==itemList.id){
              let flag=true;
              let itemListId=itemList.id;
              this.middleModuleJson.forEach((subItem)=>{
                if(itemListId==subItem.id){
                  this.$message({
                    type: 'error',
                    message: '相同模块不能重复添加！'
                  });
                  flag=false;
                }
              })
              if(flag){
                if(this.middleModuleJson.length>2){
                  this.$message({
                    type: 'error',
                    message: '最多添加2个！'
                  });
                }else{
                  this.middleModuleJson.forEach((title,titleindex)=>{
                    if(this.middleModuleNum==title.id){
                      this.middleModuleJson.splice(titleindex,1,{
                        id:itemList.id,
                        name:itemList.name,
                        logoUrl:itemList.logoUrl,
                        type:itemList.type
                      })
                    }
                  })
                }
              }
            }
          })
        }
      })
    },
    showDialogMiddleModule(){
      this.dialogMiddleModuleVisible=true;
    },
    showDialogMiddleModule2(id){
      this.dialogMiddleModuleVisible2=true;
      this.middleModuleNum=id;
    },
    delDialogScroll(){
      this.$confirm('删除滚动消息模块网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.rollModuleJson={};
        this.rollModuleObject.id='';
      }).catch(() => {})
    },
    delDialogleftModule(){
      this.$confirm('删除左侧固定消息模块网站上将不再展示？','提示',{type:'error'}).then(()=>{
         this.leftModuleJson={};
          this.leftModuleJsonObject.id='';
      }).catch(() => {})
      //主体左侧删除
    },
    showDialogScroll(){
      this.dialogScrollVisible=true;
    },
    showDialogleftModule(){
      this.dialogleftTopVisible=true;
    },
    addrollModuleScore(){
      this.$refs.rollModuleObject.validate((valid)=>{
        if(valid){
          this.dialogScrollVisible=false;
          this.rollModuleJson={};
          this.moduleList.forEach((itemList)=>{
            if(this.rollModuleObject.id==itemList.id){
              this.rollModuleJson.id=itemList.id;
              this.rollModuleJson.name=itemList.name;
              this.rollModuleJson.logoUrl=itemList.logoUrl;
              this.rollModuleJson.type=itemList.type;
            }
          })
        }
      })
    },
    addleftModuleScore(){
      //主体左侧
      this.$refs.leftModuleJsonObject.validate((valid)=>{
        if(valid){
          this.dialogleftTopVisible=false;
          this.leftModuleJson={};
          this.moduleList.forEach((itemList)=>{
            if(this.leftModuleJsonObject.id==itemList.id){
              this.leftModuleJson.id=itemList.id;
              this.leftModuleJson.name=itemList.name;
              this.leftModuleJson.logoUrl=itemList.logoUrl;
              this.leftModuleJson.type=itemList.type;
            }
          })
        }
      })
    },
    addCheckAndScore(){
      this.dialogNavVisible=false;
      this.columnJson=[];
      this.columnList.forEach((item)=>{
        if(item.state==true){
          this.columnJson.push({
            id:item.id,
            name:item.name,
            logoUrl:item.logoUrl,
            columnUrl:item.columnUrl,
            type:item.type
          })
        }
      })
    },
    showDialogNav(){
      //nav弹窗的显示隐藏
      this.dialogNavVisible=true;
    },
    CheckItem(item){
      item.state=!item.state;
    },
    handleAddTypeTwo(){
      //保存
      let addflag = true;
      if(this.files&&this.files.length==0){
        this.$alert('请上传默认封面,默认封面不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.bannerList&&this.bannerList.length==0){
        this.$alert('请添加轮播图,轮播图不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.columnJson&&this.columnJson.length==0){
        this.$alert('请添加导航栏,导航栏不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(Object.keys(this.rollModuleJson).length==0){
        this.$alert('请添加滚动消息模块,滚动消息模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(Object.keys(this.rollModuleJson).length==0){
        this.$alert('请添加滚动消息模块,滚动消息模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(Object.keys(this.leftModuleJson).length==0){
        this.$alert('请添加左侧固定消息模块,左侧固定消息模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.rollModuleJson.id===this.leftModuleJson.id){
        this.$alert('滚动消息模块和左侧固定消息模块不能相同!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.urlLeftModuleJson&&this.urlLeftModuleJson.length==0){
        this.$alert('请添加url模块,url模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(Object.keys(this.leftMessageJson).length==0){
        this.$alert('请添加左侧消息,左侧消息不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.middleModuleJson&&this.middleModuleJson.length==0){
        this.$alert('请添加主体中间模块,主体中间模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.rightColumnJson&&this.rightColumnJson.length==0){
        this.$alert('请添加栏目,栏目不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(Object.keys(this.bottomPhotoModuleJson).length==0){
        this.$alert('请添加图片型模块,图片型模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.rollModuleJson.id===this.bottomPhotoModuleJson.id){
        this.$alert('滚动消息模块和底部图片型模块不能相同!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.leftModuleJson.id===this.bottomPhotoModuleJson.id){
        this.$alert('左侧固定消息模块和底部图片型模块不能相同!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      this.middleModuleJson.forEach((item,index)=>{
        if(this.rollModuleJson.id==item.id){
          this.$alert('滚动消息模块和主体中间模块不能相同!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          addflag=false;
        }else if(this.leftModuleJson.id==item.id){
          this.$alert('左侧固定消息模块和主体中间模块不能相同!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          addflag=false;
        }else if(this.bottomPhotoModuleJson.id==item.id){
          this.$alert('底部图片型模块和主体中间模块不能相同!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          addflag=false;
        }
      })
      if(addflag){
        let newBannerList=[];
        this.bannerList.forEach((item)=>{
          newBannerList.push(item.fileUrl);
        });
        this.initJsonData.initPhoto=this.files.map(item=>item.fileUrl).toString();
        addAndUpdateSchoolWebTemplatePcTw({
          initJson:JSON.stringify(this.initJsonData),
          photoJson:JSON.stringify(newBannerList),
          columnJson:JSON.stringify(this.columnJson),
          rollModuleJson:JSON.stringify(this.rollModuleJson),
          leftModuleJson:JSON.stringify(this.leftModuleJson),
          urlLeftModuleJson:JSON.stringify(this.urlLeftModuleJson),
          leftMessageJson:JSON.stringify(this.leftMessageJson),
          middleModuleJson:JSON.stringify(this.middleModuleJson),
          rightColumnJson:JSON.stringify(this.rightColumnJson),
          bottomPhotoModuleJson:JSON.stringify(this.bottomPhotoModuleJson),
          webId:localStorage.getItem("webId"),
          templateType:this.codeType.toString()
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
                type: 'success',
                message: '保存模版成功!'
            });
            this.$router.push({
              path:'/main/pcTypeTwo',
              query:{
                codeType:this.codeType
              }
            })
          }
        })
      }
    },
    handleBannerRemove(index){
      this.bannerList.splice(index,1);
    },
    handleBannerSuccess(res,file,fileList){
      let flag=true;
      if(this.bannerList&&this.bannerList.length>4){
        this.$message({
          type: 'error',
          message: '轮播图最多上传5张！'
        });
        flag=false;
      }else{
        this.bannerList.push(res.data);
        flag=true;
      }
    },
    handleCoverSuccess(res){
      this.initJsonData.initPhoto=res.data.url;
    },
    handleBeforeBanner(file){
      if (['image/jpeg', 'image/bmp', 'image/gif', 'image/png'].indexOf(file.type) === -1) {
          this.$message.error('上传图片仅支持.jpg .jpeg .gif .png .bmp图片格式！');
          return false;
      }
      if (file.size / 1024 / 1024 >= 2) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return false;
      }
      return true;
    },
    handleBeforeCover(file){
      if (['image/jpeg', 'image/bmp', 'image/gif', 'image/png'].indexOf(file.type) === -1) {
          this.$message.error('上传图片仅支持.jpg .jpeg .gif .png .bmp图片格式！');
          return false;
      }
      if (file.size / 1024 / 1024 >= 2) {
          this.$message.error('上传图片大小不能超过 2MB!');
          return false;
      }
      return true;
    },
    radioChange(val){
      this.initJsonData.infoType=val;
    },
    radioSkin(event){
      if(event.target.getAttribute("role")){
        let role=event.target.getAttribute("role");
        if(role.indexOf("radiogroup")!==-1){
          this.skinBoxShow=false;
        }
      }
    },
    getSchooWebColumnListByWebIdFunc(){
      //栏目列表
      getSchooWebColumnListByWebId({
        webId:localStorage.getItem("webId")
      }).then(res=>res.data)
      .then(data=>{
        this.columnList=data.data;
        this.columnList.forEach((item)=>{
          item.state=false
        })
      })
    },
    getSchoolWebModuleListByWebIdFunc(){
      //模块列表
      getSchoolWebModuleListByWebId({
        webId:localStorage.getItem("webId"),
        type:23
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.moduleList=data.data;
        }
      })
    },
    getSchoolWebUrlModuleListByWebIdFunc(){
      //url模块列表
      getSchoolWebModuleListByWebId({
        webId:localStorage.getItem("webId"),
        type:4
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.urlModuleList=data.data;
        }
      })
    },
    getSchoolWebPicModuleListByWebIdFunc(){
      //图片型模块列表
      getSchoolWebModuleListByWebId({
        webId:localStorage.getItem("webId"),
        type:3
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.picModuleList=data.data;
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.pcTypeTwo-wraps{
  background:#fff;
  border-radius:3px;
  margin:0 10px;
  box-sizing:border-box;
  box-shadow: 0 0 5px 1px rgba(0,0,0,0.08);
}
.pcTypeTwo-wrap{
  padding:0px 20px 0px;
  width:1200px;
  box-sizing: border-box;
  margin:0 auto;
  .pcTypeTwo-add{
    width:100%;
  }
  .menu-row{
    padding-top:15px;
    padding-bottom:15px;
    box-sizing: border-box;
    border-bottom:1px solid #e7eaec;
    .el-button{
      margin-left:15px;
    }
    .menu-right{
      height:32px;
      line-height:32px;
      color:#333;
      font-size:14px;
      .title{
        float:left;
        margin-right:10px;
      }
      .text{
        float:left;
        overflow: hidden;
      }
      .skin-box{
        float:left;
        width:auto;
        height:32px;
        position: relative;
        margin-right:20px;
        .skin-show-box{
          position: absolute;
          top:38px;
          z-index:10;
          padding:10px;
          width:103px;
          height: auto;
          box-sizing: content-box;
          background-color:#fff;
          border:1px solid #ebeef5;
          border-radius:4px;
          box-shadow:0 2px 12px 0 rgba(0,0,0,.1);
          cursor: pointer;
          .el-radio{
            text-align: left;
            margin-bottom:10px;
            .skin-color{
              display: inline-block;
              width:22px;
              height:12px;
              border-radius: 4px;
              vertical-align: middle;
              margin-top:-2px;
            }
          }
          .el-radio+.el-radio{
            margin-left:0;
          }
          .el-radio:last-child{
            margin-bottom:0;
          }
          .el-radio:nth-child(odd){
            margin-right:10px;
          }
        }
      }
      .skin-switch{
        display: inline-block;
        width:32px;
        height:32px;
        padding:3px;
        font-size: 0;
        border:1px solid #e6e6e6;
        border-radius:4px;
        box-sizing: border-box;
        position: relative;
        cursor: pointer;
        .color-box{
          width:100%;
          height:100%;
          text-align: center;
          background:#428BCB;
          position: relative;
          .color-down-icon{
            font-size:12px;
            color:#fff;
          }
        }
      }
      .playTime{
        float: left;
        margin-right:20px;
      }
      .default-cover{
        float: left;
        margin-right:20px;
        position: relative;
        .tag-lang{
          display: inline-block;
          margin-left:4px;
          font-size:10px;
          padding-top:1px;
          vertical-align: top;
          color:#8c939d;
        }
        .defaultCoverBox{
          width:128px;
          height:32px;
          overflow: hidden;
          position: relative;
        }
        .cover-uploader .avatar-uploader-icon{
          font-size: 18px;
          color: #8c939d;
          width: 128px;
          height: 32px;
          line-height:30px;
          text-align: center;
          border: 1px solid #d0d0d0;
          box-sizing: border-box;
          cursor: pointer;
          position: relative;
          border-radius:4px;
          overflow: hidden;
        }
        .cover-uploader .avatar-uploader-icon:before{
          content: "\E62B";
          left:10px;
        }
        .cover-uploader .avatar-uploader-icon:hover{
          border: 1px solid #409EFF;
        }
        .cover-img{
          display: block;
          width:128px;
          height:32px;
          border-radius:4px;
          overflow: hidden;
          background-size: 100% 100%;
        }
        .mask-cover-img{
          position: absolute;
          left: 0;
          bottom: 0;
          color: white;
          line-height: 25px;
          font-size: 12px;
          position: absolute;
          width:100%;
          // height: 16px;
          line-height: 16px;
          background-color: rgba(0,0,0,.5);
          text-align: center;
          transition: all .5s;
          transform: translate(0,100%);
        }
        .defaultCoverBox:hover .mask-cover-img{
          transform: translate(0,0);
        }
      }
      .pcTop{
        width:128px;
        height:32px;
        position: relative;
        .mask-cover-img{
          position: absolute;
          left: 0;
          bottom: 0;
          color: white;
          line-height: 25px;
          font-size: 12px;
          position: absolute;
          width:100%;
          // height: 16px;
          line-height: 16px;
          background-color: rgba(0,0,0,.5);
          text-align: center;
          transition: all .5s;
          transform: translate(0,100%);
        }
      }
      .pcTop:hover .mask-cover-img{
        transform: translate(0,0);
      }
    }
  }
  .pcType-cont{
    width:100%;
    padding-top:10px;
    padding-bottom:20px;
    box-sizing:border-box;
  }
  .header-top{
    width:100%;
    height:82px;
    padding:10px 15px;
    box-sizing:border-box;
    .logo{
      float:left;
      width:auto;
      max-width:48%;
      height:62px;
      overflow: hidden;
      img{
        float:left;
        display:block;
        width:62px;
        height:62px;
        border-radius: 50%;
        overflow:hidden;
        margin-right:15px;
        border:1px solid #333;
        box-sizing: border-box;
        background:#fff;
      }
      .logo-title{
        float:left;
        height:60px;
        line-height:60px;
        color:#333;
        font-size:18px;
        font-weight: bold;
      }
    }
    .login-box{
      float:right;
      width:577px;
      height:62px;
    }
  }
  .bannerBox{
    margin-top:20px;
    padding:20px;
    border:1px dashed #444;
    box-sizing: border-box;
    .bannerLi{
      height: 150px;
      width: 150px;
      background-position: center center;
      background-size: cover;
      display: block;
      float: left;
      margin-right: 10px;
      position: relative;
      overflow: hidden;
      .img-del-btn{
        position: absolute;
        right:0;
        top:100%;
        width:100%;
        height:100%;
        z-index:2;
        background:rgba(0,0,0,0.5);
        line-height: 0;
        cursor: pointer;
        opacity: 0;
        transition: 0.3s linear;
        .del-box{
          position: absolute;
          left:50%;
          top:50%;
          width:30px;
          height:30px;
          text-align: center;
          line-height:30px;
          margin:-15px 0 0 -15px;
          border-radius: 50%;
          overflow: hidden;
        }
        i{
          font-size:20px;
          color:#fff;
        }
      }
    }
    .bannerLi:hover .img-del-btn{
      opacity: 1;
      top:0;
    }
    .bannerAdd{
      float:left;
      width:150px;
      height:150px;
      padding-top:46px;
      box-sizing:border-box;
      line-height:1;
      border:1px solid  #d0d0d0;
      background-color: #fbfdff;
      border-radius: 6px;
      box-sizing: border-box;
      cursor: pointer;
      text-align: center;
      .bannerAddIcon{
        font-size:40px;
        color:#8c939d;
      }
      .bannerAddTitle{
        font-size:14px;
        color:#8c939d;
        display: block;
        margin-top:10px;
      }
    }
    .bannerAdd:hover{
      border:1px solid  #409EFF;
    }
    .bannerAdd:hover .bannerAddIcon{
      color:#409EFF;
    }
    .bannerAdd:hover .bannerAddTitle{
      color:#409EFF;
    }
  }
  .navBox{
    margin-top:20px;
    padding:20px;
    border:1px dashed #444;
    box-sizing: border-box;
    .navMenuLi{
      float: left;
      width: 109px;
      height: 46px;
      line-height: 46px;
      position: relative;
      text-align: center;
      border:1px solid #444;
      position: relative;
      overflow:hidden;
      list-style-type: none;
      .img-del-btn{
        position: absolute;
        right:0;
        top:100%;
        width:100%;
        height:100%;
        z-index:2;
        background:rgba(0,0,0,0.5);
        line-height: 0;
        cursor: pointer;
        transition: 0.3s linear;
        visibility: hidden;
        .del-box{
          position: absolute;
          left:50%;
          top:50%;
          width:30px;
          height:30px;
          text-align: center;
          line-height:30px;
          margin:-15px 0 0 -15px;
          background:#f56c6c;
          border-radius: 50%;
          overflow: hidden;
        }
        i{
          font-size:20px;
          color:#fff;
        }
      }
    }
    .navMenuLi:last-child{
      margin-right: 10px;
    }
    .navMenuLi:hover .img-del-btn{
      top:0;
      visibility:visible;
    }
    .navAdd{
      float:left;
      width: 109px;
      height: 46px;
      line-height: 46px;
      position: relative;
      text-align: center;
      border:1px solid  #d0d0d0;
      background-color: #fbfdff;
      cursor:pointer;
      color:#8c939d;
      border-radius: 4px;
      overflow: hidden;
      .navAddIcon{
        font-size:14px;
        color:#8c939d;
      }
      .navAddTitle{
        font-size:14px;
        color:#8c939d;
      }
    }
    .navAdd:hover{
      border:1px solid  #409EFF;
    }
    .navAdd:hover .navAddIcon{
      color:#409EFF;
    }
    .navAdd:hover .navAddTitle{
      color:#409EFF;
    }
  }
  .dialoglinkBox{
    .check-select{
      position: absolute;
      top: 0;
      right: 9px;
      width: 16px;
      height: 16px;
      cursor: pointer;
      z-index: 10;
    }
    .checkitem{
      width: 100px;
      float: left;
      position: relative;
      margin-right: 10px;
      .checkitem-box{
        width: 100px;
        padding: 10px 0;
        float: left;
        text-align: center;
        position: relative;
        .check-img{
          width: 66px;
          height: 66px;
          display: block;
          border-radius: 6px;
          margin: 0 auto;
        }
        .check-title{
          display: inline-block;
          width:100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .link-title{
          font-size: 14px;
          color: #333;
          line-height: 26px;
          margin-bottom: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

      }
    }
  }
  .scrollNewBox{
    margin-top:20px;
    padding:20px;
    border:1px dashed #444;
    box-sizing: border-box;

    .searchBox{
      float:right;
      width:340px;
      padding:35px 39px 0 0;
    }
  }
  .scrollBox{
    float: left;
    width: 60%;
    height: 130px;
    // background: #FBFDFF;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    margin-right: 40px;
    position: relative;
    .scrolljiaBox{
      width:100%;
      height:100%;
      border: 1px solid #d0d0d0;
      box-sizing:border-box;
      background: #FBFDFF;
      position: relative;
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;
      .scrollJiaIcon{
        position: absolute;
        left:50%;
        top:44%;
        margin:-20px 0 0 -20px;
        font-size: 40px;
        color: #8c939d;
      }
      .scrollTag{
        position: absolute;
        left:0;
        top:60%;
        width:100%;
        text-align: center;
        &>span{
          font-size: 14px;
          color: #8c939d;
        }
      }
    }
    .scrolljiaBox:hover{
      border: 1px solid #409EFF;
      .scrollJiaIcon{
        color: #409EFF;
      }
    }
    .scrollContItem{
      width:100%;
      height:100%;
      padding-top:20px;
      border: 1px solid #d0d0d0;
      box-sizing: border-box;
      background: #FBFDFF;
      text-align: center;
      border-radius: 4px;
      overflow: hidden;
      .title{
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
        padding-top: 14px;
      }
      .scrollDelBtn{
        margin-right: 10px;
        font-size: 16px;
        color: #409EFF;
      }
      .scrollUpdateBtn{
        font-size: 16px;
        color: #409EFF;
      }
    }
  }
  .mainBox{
    margin-top:20px;
    padding:20px;
    border:1px dashed #444;
    box-sizing: border-box;
  }
  .mainBoxBasic{
    width:32%;
    float:left;
    .leftTopModule{
      width:100%;
      height: 130px;
     // background: #FBFDFF;
      box-sizing: border-box;
      position: relative;
      .leftTopjiaBox{
        width:100%;
        height:100%;
        border: 1px solid #d0d0d0;
        box-sizing:border-box;
        background: #FBFDFF;
        border-radius: 4px;
        overflow: hidden;
        position: relative;
        cursor: pointer;
        .leftTopJiaIcon{
          position: absolute;
          left:50%;
          top:44%;
          margin:-20px 0 0 -20px;
          font-size: 40px;
          color: #8c939d;
        }
        .leftTopTag{
          position: absolute;
          left:0;
          top:60%;
          width:100%;
          text-align: center;
          &>span{
            font-size: 14px;
            color: #8c939d;
          }
        }
      }
      .leftTopjiaBox:hover{
        border: 1px solid #409EFF;
        .leftTopJiaIcon{
          color: #409EFF;
        }
      }
      .leftTopContItem{
        width:100%;
        height:100%;
        padding-top:20px;
        border: 1px solid #d0d0d0;
        box-sizing: border-box;
        text-align: center;
        border-radius: 4px;
        overflow: hidden;
        background: #FBFDFF;
        .title{
          font-size: 18px;
          font-weight: bold;
          margin-bottom: 20px;
          padding-top: 14px;
        }
        .leftTopDelBtn{
          margin-right: 10px;
          font-size: 16px;
          color: #409EFF;
        }
        .leftTopUpdateBtn{
          font-size: 16px;
          color: #409EFF;
        }
      }
    }
  }
  .mainBoxLeft{
    margin-right:2%;
  }
  .mainBoxMiddle{
    margin-right:2%;
  }
  .MiddleModuleBox{
    width: 100%;
    padding:20px;
    border: 1px solid #d0d0d0;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
    background: #FBFDFF;
    .middleModuleJiaBox{
      width: 120px;
      height: 88px;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
      border: 1px solid #d0d0d0;
      padding-top: 22px;
      margin:0 auto;
      border-radius: 4px;
      overflow: hidden;
      cursor: pointer;
      background: #FBFDFF;
      .middleModuleJiaIcon{
        font-size: 30px;
        color: #8c939d;
        display: block;
        vertical-align: middle;

        margin-bottom:10px;
      }
      &>span{
        font-size: 14px;
        color: #8c939d;
      }
    }
    .middleModuleJiaBox:hover{
      border: 1px solid #409EFF;
      .middleModuleJiaIcon{
        color: #409EFF;
      }
    }
    .middleModuleContItem{
      width: 150px;
      height:90px;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
      margin:0 auto;
      border-radius: 4px;
      overflow: hidden;
      margin-bottom:20px;
      .title{
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 20px;
        padding-top: 14px;
      }
      .middleModuleDelBtn{
        margin-right: 10px;
        font-size: 16px;
        color: #409EFF;
      }
      .middleModuleUpdateBtn{
        font-size: 16px;
        color: #409EFF;
      }
    }
  }
  .mainBoxLeftMiddle{
    margin-top:20px;
    .middleModuleContItem{
      float:left;
      margin:0;
    }
    .middleModuleJiaBox{
      float: left;
      margin:0 0 0 15px;
    }
  }
  .leftMessageBox{
    margin-top:20px;
    .tuMessageTitle{
      width:100%;
      padding:0 10px;
      box-sizing: border-box;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
  .picsBox{
    margin-top:20px;
    padding:20px;
    border:1px dashed #444;
    box-sizing: border-box;
    .scrollBox{
      width:100%;
    }
  }
  .footerBox{
    text-align: center;
    padding:20px;
  }
  .detailShuffBox{
    float: left;
    -webkit-appearance: none;
    background-color: #fff;
    background-image: none;
    border-radius: 4px;
    border: 1px solid #dcdfe6;
    color: #606266;
    display: inline-block;
    font-size: inherit;
    height: 32px;
    line-height: 32px;
    outline: 0;
    padding: 0 15px;
    box-sizing: border-box;
    -webkit-transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    transition: border-color .2s cubic-bezier(.645,.045,.355,1);
    width:215px;
  }
  .pcTypeTwo-detail{
    .middleModuleContItem{
      height:auto;
    }
    .smallTitle{
      width:80%;
      height:50px;
      background-size:100% 100%;
      background-position: center center;
      margin:0 auto;
      border-radius:4px;
      overflow: hidden;
    }
  }
  .staticHeight{
    min-height:430px;
  }
  .selectWidth{
    width:80%;
    height:auto;
  }

}
</style>
<style lang="scss" scoped>
.skin-color1{
  background: #1E766C !important;
}
.skin-color2{
  background: #27447A !important;
}
.bannerAdd .el-upload-list--text{
  display:none !important;
}
.bannerAdd .el-upload--text{
  display:block;
  width:100%;
  height:100%;
}
.dialoglinkWrap .el-dialog__body{
  padding:20px 20px;
  border-top:1px solid #e5e5e5;
  height:400px;
  overflow-x:hidden;
  overflow-y:auto;
}
</style>
<style lang="scss">
.pcTop {
  .img-upload-btn{
    height:32px;
    padding:10px ;
    width:128px;
    box-sizing:border-box;
  }
    .upload-file-item {
        width: 128px !important;
         height: 32px !important;
         border-radius:4px;
         overflow:hidden;
        img {
    width: 128px !important;
         height: 32px !important;
         margin:0 !important;
        }
        .file-name {
            display: none;
        }
    }

}
.pcTypeTwo-wraps .moreImgText{
  font-size: 12px;
  position: absolute;
  left: 0;
  bottom: -26px;
  width: 100px;
}
</style>
