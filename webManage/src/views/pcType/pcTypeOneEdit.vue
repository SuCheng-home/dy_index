<template>
  <div class="pcTypeOne-wraps">
    <div class="pcTypeOne-wrap">
      <div class="pcTypeOne-add">
        <el-row class="menu-row">
          <el-col :span="10">
            <div>
              <el-button size="small" class="filter-item" @click="goBack()">返回
              </el-button>
              <el-button size="small" class="filter-item" type="primary" @click="handleAddTypeOne()">保存
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
                  <div class="color-box skin-color3" v-if="initJsonData.infoType==3">
                    <i class="fa fa-chevron-down color-down-icon" aria-hidden="true"></i>
                  </div>
                  <div class="color-box skin-color4" v-if="initJsonData.infoType==4">
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
                    <el-radio :label="3">
                      <span class="skin-color skin-color3"></span>
                    </el-radio>
                    <el-radio :label="4">
                      <span class="skin-color skin-color4"></span>
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
                  <uploader useSysBucket pathPrefix="pcTypeOneEdit"
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
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload> -->
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="pcType-cont custom—scrollbar" :style="`height:${addServiceHeight-20}px`">
          <div class="header-top">
            <div class="logo clearfix">
              <img :src="schoolrLogoUrl" alt="">
              <div class="logo-title">
                <span class="name">{{schoolfullName}}</span>
              </div>
            </div>
              
            <div class="login-box">    
              <div class="windowType">
                <el-radio v-model="initJsonData.windowType" :label="1">登录</el-radio>
                 <el-radio v-model="initJsonData.windowType" :label="2">搜索</el-radio> 
                </div>          
              <img v-if="initJsonData.windowType&&(initJsonData.windowType==2)" src="../../assets/pc/search_pic1.png" style="float: right;" alt="">
              <img v-else src="../../assets/pc/login_pic_detail.png" alt="">
            </div>
          </div>
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
          <div class="bannerBox clearfix">
            <uploader useSysBucket pathPrefix="pcTypeOneEdit" multiple v-model="bannerList" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image" showModeText="添加轮播图(1200*360)" :max="5" @maxHandler="maxHandler"></uploader>
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
              <span class="bannerAddTitle">添加轮播图<br/><span style="font-size:12px;">建议1200*360</span></span>
            </el-upload> -->
          </div>
          <div class="mainContBox clearfix">
            <div class="mainSectionRow clearfix">
              <div class="mainSection clearfix" v-for="(moduleJsonItem,moduleJsonIndex) in moduleJson" :key="moduleJsonIndex">
                <div class="mainCont">
                  <div class="mainContItem" v-for="(moduleListJsonItem,moduleListJsonIndex) in moduleJsonItem.moduleListJson" :key="moduleListJsonIndex">
                    <div class="title">{{moduleListJsonItem.name}}</div>
                    <div class="control-btn">
                      <a href="javascript:;" class="mainDelBtn" @click.stop="delSmallModule(moduleJsonIndex,moduleListJsonIndex,moduleListJsonItem.id)">
                        删除
                      </a>
                      <a href="javascript:;" class="mainUpdateBtn" @click.stop="showDialogModule2(moduleJsonIndex,moduleListJsonIndex,moduleListJsonItem.id)">
                        更改
                      </a>
                    </div>
                  </div>
                  <div class="mainContItem">
                    <div class="mainjiaBox">
                      <i class="el-icon-plus avatar-uploader-icon mainjiaIcon" @click.stop="showDialogModule(moduleJsonIndex)"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mainControl clearfix">
              <div class="mainAdd" @click="moduleRowAdd">
                <i class="el-icon-plus avatar-uploader-icon mainAddIcon"></i>
                <span class="mainAddTitle">添加一行</span>
              </div>
              <div class="mainAdd" @click="moduleRowDel">
                <i class="el-icon-minus avatar-uploader-icon mainAddIcon"></i>
                <span class="mainAddTitle">删除一行</span>
              </div>
            </div>
          </div>
          <div  class="footerBox clearfix"> 
            <el-radio v-model="urlModuleType" :label="1">按链接配置</el-radio>
            <el-radio v-model="urlModuleType" :label="2">按栏目配置</el-radio>            
          </div>
          <div class="linkBox clearfix" v-if="urlModuleType==1">
            <ul class="linkBoxUl">
              <li class="linkBoxLi" v-for="(urlModuleItem,index) in urlModuleJson" :key="index">
                <img class="link-img" v-if="urlModuleItem.logoUrl" :src="urlModuleItem.logoUrl" alt="">
                <img class="link-img" v-else src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png">
                <p class="link-title">{{urlModuleItem.name}}</p>
              </li>
            </ul>
            <div class="linkAdd" @click="showDialoglink">
              <i class="el-icon-plus avatar-uploader-icon linkAddIcon"></i>
              <span class="linkAddTitle">添加url</span>
            </div>
          </div>
           <div class="linkBox clearfix" v-if="urlModuleType==2">
            <ul class="linkBoxUl">
              <li class="linkBoxLi" v-for="(urlModuleItem,index) in newurlModuleJson" :key="index">
                <img class="link-img" v-if="urlModuleItem.logoUrl" :src="urlModuleItem.logoUrl" alt="">
                <img class="link-img" v-else src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png">
                <p class="link-title">{{urlModuleItem.name}}</p>
              </li>
            </ul>
            <div class="linkAdd" @click="newshowDialoglink">
              <i class="el-icon-plus avatar-uploader-icon linkAddIcon"></i>
              <span class="linkAddTitle">添加url</span>
            </div>
          </div>
          <div class="footerBox clearfix">
            <p>访问量统计 &nbsp;联系方式&nbsp;版权&nbsp;备案号</p>
          </div>
        </div>
        <el-dialog title="添加" :visible.sync="dialogLinkVisible" class="dialoglinkWrap">
            <div class="dialoglinkBox clearfix">
              <div class="checkitem" v-for="(dialogUrlItem,index) in urlList" :key="index">
                  <input class="check-select" type="checkbox" v-model="dialogUrlItem.state" name="imgText" v-on:click="CheckItem(dialogUrlItem)">
                  <div class="checkitem-box">
                    <img class="check-img" v-if="dialogUrlItem.logoUrl" :src="dialogUrlItem.logoUrl">
                    <img class="check-img" v-else src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png">
                    <p class="check-title" >{{dialogUrlItem.name}}</p>
                  </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogLinkVisible=false">取 消</el-button>
                <el-button type="primary" @click="addLinkScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加" :visible.sync="newdialogLinkVisible" class="dialoglinkWrap">
            <div class="dialoglinkBox clearfix">
              <div class="checkitem" v-for="(dialogUrlItem,index) in newurlList" :key="index">
                  <input class="check-select" type="checkbox" v-model="dialogUrlItem.state" name="imgText" v-on:click="CheckItem(dialogUrlItem)">
                  <div class="checkitem-box">
                    <img class="check-img" v-if="dialogUrlItem.logoUrl" :src="dialogUrlItem.logoUrl">
                    <img class="check-img" v-else src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png">
                    <p class="check-title" >{{dialogUrlItem.name}}</p>
                  </div>
              </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="newdialogLinkVisible=false">取 消</el-button>
                <el-button type="primary" @click="newaddLinkScore()">保 存</el-button>
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
        <el-dialog title="添加" :visible.sync="dialogMainVisible">
            <el-form :model="moduleListObj" :rules="moduleListObjRules" ref="moduleListObj" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="moduleListObj.id" placeholder="请选择模块">
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
                <el-button @click="dialogMainVisible=false">取 消</el-button>
                <el-button type="primary" @click="addModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="更换" :visible.sync="dialogMainVisible2">
            <el-form :model="moduleListObj" :rules="moduleListObjRules" ref="moduleListObj" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="moduleListObj.id" placeholder="请选择模块">
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
                <el-button @click="dialogMainVisible2=false">取 消</el-button>
                <el-button type="primary" @click="updateModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import {mapGetters} from 'vuex';
import Uploader from '@/components/Uploader/WebUploader';
import {getSchooWebColumnListByWebId,getSchoolWebModuleListByWebId,getSchoolWebColumnAndMessageUrlListByWebId} from '@/api/webManage';
import {addAndUpdateSchoolWebTemplatePc,getSchoolWebTemplatePc} from '@/api/webType1';
export default{
  components:{
    Uploader
  },
  data(){
    return{
      UploadPath:global.BasePath+ 'common/addImageUp',////图片上传路径
      initJsonData:{//设置Json
        infoType:3,
        initPhoto:'',
        shufflingTime:2,
        windowType:1
      },      
      columnJson:[],
      skinBoxShow:false,//控制皮肤
      dialogNavVisible:false,//控制nav导航栏弹窗
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
      columnList:[],
      bannerList:[],
      moduleJson:[],//6大块模块
      moduleListJson:[],
      moduleListObj:{
        id:''
      },
      moduleListObjRules:{
        id:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      dialogMainVisible:false,//控制模块新增弹窗
      dialogMainVisible2:false,//修改弹窗
      moduleList:[],
      moduleRowList:[],
      i:null,
      moduleJsonNum:null,
      moduleListJsonNum:null,
      dialogLinkVisible:false,
      urlList:[],
      urlModuleJson:[],//url的容器
      codeType:this.$route.query.codeType,
      pcTypeDetailList:{},
      files:[],
      urlModuleType:1,
      newurlModuleJson:[],
      newdialogLinkVisible:false,
      newurlList:[]
    }
  },
  created(){
    this.getSchooWebColumnListByWebIdFunc();//栏目列表
    this.getSchoolWebModuleListByWebIdFunc();//模块列表
    this.getSchoolWebColumnAndMessageUrlListByWebIdFunc();//url列表
  },
  mounted(){
    //模板详情
    var This=this;
    setTimeout(function(){
      This.getSchoolWebTemplatePcFunc();//根据模块类型及webId查询pc模板信息
    },200);
  },
  computed:{
    ...mapGetters([
      'schoolrLogoUrl',
      'schoolfullName',
      'userAvatar',
      'userName',
    ])
  },
  updated(){

  },
  mixins:[mixins],
  methods:{
    // handleBannerSuccess(res, file, fileList){
    //   let flag=true;
    //   if(this.bannerList&&this.bannerList.length>4){
    //     this.$message({
    //       type: 'error',
    //       message: '轮播图最多上传5张！'
    //     });
    //     flag=false;
    //   }else{
    //     this.bannerList.push(res.data);
    //     flag=true;
    //   }

    // },
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
    getSchoolWebTemplatePcFunc(){
      getSchoolWebTemplatePc({
        webId:localStorage.getItem("webId"),
        templateType:this.codeType.toString()
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.pcTypeDetailList=data.data;
          this.urlModuleType=(data.data.urlModuleType==2?2:1)
          let detailInitJson=JSON.parse(data.data.initJson);
          this.initJsonData.infoType=detailInitJson.infoType;
          this.initJsonData.windowType=detailInitJson.windowType?detailInitJson.windowType:1;
          this.initJsonData.shufflingTime=detailInitJson.shufflingTime;
          if(detailInitJson.initPhoto){
            let fileName=this.fileNameUse(detailInitJson.initPhoto).replace(/.+\//, "");
            this.files.push({
              fileName:fileName,
              fileUrl:detailInitJson.initPhoto
            })
          }
          //this.initJsonData.initPhoto=detailInitJson.initPhoto;
          this.columnJson=JSON.parse(data.data.columnJson);
          for(var i=0;i<this.columnList.length;i++){
            for(var j=0;j<this.columnJson.length;j++){
              if(this.columnList[i].id==this.columnJson[j].id){
                this.columnList[i].state=true;
              }
            }
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
          this.moduleJson=JSON.parse(data.data.moduleJson);
          this.urlModuleJson=JSON.parse(data.data.urlModuleJson);
          this.newurlModuleJson=JSON.parse(data.data.urlModule2Json);
          for(var a=0;a<this.urlList.length;a++){
            for(var b=0;b<this.urlModuleJson.length;b++){
              if(this.urlList[a].id==this.urlModuleJson[b].id){
                this.urlList[a].state=true;
              }
            }
          }
           getSchoolWebModuleListByWebId({
        webId:localStorage.getItem("webId"),
        type:23
      }).then(res=>res.data)
      .then(data=>{
        this.newurlList=data.data;        
        this.newurlList.forEach((item)=>{
          item.state=false
        })
         for(var a=0;a<this.newurlList.length;a++){
            for(var b=0;b<this.newurlModuleJson.length;b++){
              if(this.newurlList[a].id==this.newurlModuleJson[b].id){
                this.newurlList[a].state=true;
              }
            }
          }
      })
          
        }
      })
    },
    goBack(){
      this.$router.push({
        path:'/main/pcTypeOne',
        query:{
          codeType:this.codeType
        }
      })
    },
    handleAddTypeOne(){
      //保存
      let addflag = true;
      if(this.files&&this.files.length==0){
        this.$alert('请上传默认封面,默认封面不能为空!','提示',{
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
      if(this.bannerList&&this.bannerList.length==0){
        this.$alert('请添加轮播图,轮播图不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.moduleJson&&this.moduleJson.length==0){
        this.$alert('请添加主体模块,最少添加一行!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }

      if(addflag){
        /*处理模块的数据*/
        let newBannerList=[];
        this.bannerList.forEach((item)=>{
          newBannerList.push(item.fileUrl);
        });
        this.initJsonData.initPhoto=this.files.map(item=>item.fileUrl).toString();
        addAndUpdateSchoolWebTemplatePc({
          initJson:this.initJsonData,
          columnJson:JSON.stringify(this.columnJson),
          photoJson:JSON.stringify(newBannerList),
          templateType:this.codeType.toString(),
          moduleJson:JSON.stringify(this.moduleJson),
          urlModuleJson:JSON.stringify(this.urlModuleType==1?this.urlModuleJson:[]),
          urlModule2Json:JSON.stringify(this.urlModuleType==2?this.newurlModuleJson:[]),
          webId:localStorage.getItem("webId"),
          urlModuleType:this.urlModuleType
        }).then(res=>res.data)
        .then(data=>{
          if(data.code===200){
            this.$message({
                type: 'success',
                message: '保存模版成功!'
            });
            this.$router.push({
              path:'/main/pcTypeOne',
              query:{
                codeType:this.codeType
              }
            })
          }
        })
      }
    },
    addLinkScore(){
      this.dialogLinkVisible=false;
      this.urlModuleJson=[];
      this.urlList.forEach((item)=>{
        if(item.state==true){
          this.urlModuleJson.push({
            columnUrl:item.url,
            id:item.id,
            logoUrl:item.logoUrl,
            name:item.name,
            type:item.type
          })
        }
      })
    },
     newaddLinkScore(){
      this.newdialogLinkVisible=false;
      this.newurlModuleJson=[];
      this.newurlList.forEach((item)=>{
        if(item.state==true){
          this.newurlModuleJson.push({
            id:item.id,
            logoUrl:item.logoUrl,
            name:item.name,
            type:item.type
          })
        }
      })
    },
    CheckItem(item){
      item.state=!item.state;
    },
    showDialoglink(){
      this.dialogLinkVisible=true;
    },
    newshowDialoglink(){
      this.newdialogLinkVisible=true;
    },
    moduleRowDel(){
      //删除一行
      if(this.moduleJson&&this.moduleJson.length!==0){
        this.$confirm('删除此行网站上将不再展示？','提示',{type:'error'}).then(()=>{
          this.i=this.moduleJson.length/3;
          if(this.i>0){
            this.i=this.i-1;
            let flagdel=true;
            if(this.i<0){
              this.$message({
                type: 'error',
                message: '已经删到底了！'
              });
              this.i=null;
              flagdel=false;
            }else{
              for(var j=0;j<3;j++){
                this.moduleJson.pop({
                  orderNum:j,
                  moduleListJson:[]
                })
              }
              flagdel=true;
            }
          }
        }).catch(() => {});
      }
    },
    moduleRowAdd(){
      //增加一行
      this.i=this.moduleJson.length/3;
      if(this.i<6){
        this.i=this.i+1;
        if(this.i&&this.i!==null){
          let flag=true;
          if(this.i>6){
            this.$message({
              type: 'error',
              message: '最多添加6行！'
            });
            flag=false;
          }else{
            for(var j=(this.i-1)*3;j<3*(this.i);j++){
              this.moduleJson.push({
                orderNum:j,
                moduleListJson:[]
              })
            }
            flag=true;
          }
        }
      }
    },
    showDialogModule(moduleJsonIndex){
      this.dialogMainVisible=true;
      this.moduleJsonNum=moduleJsonIndex;
    },
    showDialogModule2(moduleJsonIndex,moduleListJsonIndex,moduleListJsonId){
      this.dialogMainVisible2=true;
      this.moduleJsonNum=moduleJsonIndex;
      this.moduleListObj.id=moduleListJsonId;
      this.moduleListJsonNum=moduleListJsonIndex;
    },
    handleBannerRemove(index){
      this.bannerList.splice(index,1);
    },

    delNav(delId){
      this.columnJson.forEach((item,index)=>{
        let flagJson=true;
        if(item.id==delId){
          this.columnJson.splice(index,1);
          flagJson=false;
        }else{
          flagJson=true;
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
    getSchoolWebColumnAndMessageUrlListByWebIdFunc(){
      getSchoolWebColumnAndMessageUrlListByWebId({
        webId:localStorage.getItem("webId")
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.urlList=JSON.parse(data.data);
          this.urlList.forEach((item)=>{
            item.state=false
          })
        }
      })
    },
    addModuleScore(){
      //保存
      this.$refs.moduleListObj.validate((valid)=>{
        if(valid){
          this.dialogMainVisible=false;


          this.moduleList.forEach((itemList)=>{
            if(this.moduleListObj.id==itemList.id){
              //this.moduleJsonIndex
              let flag=true;
              let itemListId=itemList.id;
              this.moduleJson.forEach((item)=>{
                item.moduleListJson.forEach((subItem)=>{
                  if(itemListId==subItem.id){
                    this.$message({
                      type: 'error',
                      message: '相同模块不能重复添加！'
                    });
                    flag=false;
                  }
                })
              })
              if(flag){
                this.moduleJson.forEach((titem)=>{
                  if(this.moduleJsonNum==titem.orderNum&&titem.orderNum==0){
                    if(titem.moduleListJson.length>=1){
                      this.$message({
                        type: 'error',
                        message: '由于此块在页面上会做特殊展示，最多添加1个！'
                      });
                    }else{
                      titem.moduleListJson.push({
                        id:itemList.id,
                        logoUrl:itemList.logoUrl,
                        name:itemList.name,
                        type:itemList.type
                      })
                    }
                  }else{
                    if(this.moduleJsonNum==titem.orderNum&&titem.orderNum!==0){
                      if(titem.moduleListJson.length>=3){
                        this.$message({
                          type: 'error',
                          message: '最多添加3个！'
                        });
                      }else{
                        titem.moduleListJson.push({
                          id:itemList.id,
                          logoUrl:itemList.logoUrl,
                          name:itemList.name,
                          type:itemList.type
                        })
                      }
                    }
                  }
                })
              }
            }
          })
        }else{
          return false;
        }
      })
    },
    updateModuleScore(){
      this.$refs.moduleListObj.validate((valid)=>{
        if(valid){
          this.dialogMainVisible2=false;
          this.moduleList.forEach((itemList)=>{
            if(this.moduleListObj.id==itemList.id){
              //this.moduleJsonIndex
              let flag=true;
              let itemListId=itemList.id;
              this.moduleJson.forEach((item)=>{
                item.moduleListJson.forEach((subItem)=>{
                  if(itemListId==subItem.id){
                    this.$message({
                      type: 'error',
                      message: '相同模块不能重复添加！'
                    });
                    flag=false;
                  }
                })
              })
              if(flag){
                this.moduleJson.forEach((titem)=>{
                  if(this.moduleJsonNum==titem.orderNum){
                    if(titem.moduleListJson.length>3){
                      this.$message({
                        type: 'error',
                        message: '最多添加3个！'
                      });
                    }else{
                      titem.moduleListJson.forEach((lastitem,lastindex)=>{
                        if(this.moduleListJsonNum==lastindex){
                          titem.moduleListJson.splice(lastindex,1,{
                            id:itemList.id,
                            logoUrl:itemList.logoUrl,
                            name:itemList.name,
                            type:itemList.type
                          })
                        }
                      })
                    }
                  }
                })
              }
            }
          })
        }else{
          return false;
        }
      })
    },
    delSmallModule(moduleJsonIndex,moduleListJsonIndex,moduleListJsonId){
      //删除
      this.$confirm('删除模块网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.moduleJson.forEach((item)=>{
          if(moduleJsonIndex==item.orderNum){
            item.moduleListJson.forEach((subItem,subindex)=>{
              if(moduleListJsonIndex==subindex){
                item.moduleListJson.splice(subindex,1);
              }
            })
          }
        })
      }).catch(() => {})
    },
    showDialogNav(){
      //nav弹窗的显示隐藏
      this.dialogNavVisible=true;
    },
    handleCoverSuccess(res){
      this.initJsonData.initPhoto=res.data.url;
    },
    radioSkin(event){
      if(event.target.getAttribute("role")){
        let role=event.target.getAttribute("role");
        if(role.indexOf("radiogroup")!==-1){
          this.skinBoxShow=false;
        }
      }
    },
    radioChange(val){
      this.initJsonData.infoType=val;
    }
  }
}
</script>

<style lang="scss" scoped>
.pcTypeOne-wraps{
  background:#fff;
  border-radius: 3px;
  margin:0 10px;
  box-sizing: border-box;
  box-shadow: 0 0 5px 1px rgba(0,0,0,0.08);
}
.pcTypeOne-wrap{
  padding:0px 20px 20px;
  width:1200px;
  box-sizing: border-box;
  margin:0 auto;
  .pcTypeOne-add{
    width:100%;
  }
  .pcType-cont{
    width:100%;
    padding-top:10px;
    padding-bottom:20px;
    box-sizing: border-box;
  }
  .menu-row{
    border-bottom: 1px solid #e7eaec;
    box-sizing: border-box;
    padding-bottom:15px;
    padding-top:15px;
    .el-button{
      margin-left: 15px;
    }
    .menu-right{
      height:32px;
      line-height: 32px;
      color:#333;
      font-size:14px;
      .title{
        float:left;
        margin-right:10px;
      }
      .text{
        float: left;
        overflow:hidden;
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
          z-index: 10;
          padding: 10px;
          width:103px;
          height:auto;
          box-sizing: content-box;
          background-color: #fff;
          border: 1px solid #ebeef5;
          border-radius: 4px;
          box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
          cursor: pointer;
          .el-radio{
            text-align: left;
            margin-bottom:10px;
            .skin-color{
              display: inline-block;
              width: 22px;
              height: 12px;
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
        box-sizing: border-box;
        height: 32px;
        width: 32px;
        padding: 3px;
        border: 1px solid #e6e6e6;
        border-radius: 4px;
        font-size: 0;
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
        float:left;
        margin-right:20px;
      }
      .default-cover{
        float:left;
        margin-right:20px;
        .defaultCoverBox{
          width:128px;
          height:32px;
          overflow: hidden;
          position: relative;
        }
        .cover-uploader .avatar-uploader-icon{
          font-size: 16px;
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
          background-color: rgba(0,0,0,.5);
          line-height: 16px;
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
      position: relative;
      .windowType{
        position: absolute;
        top:-17px;
        left:0;
      }
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
  .mainContBox{
    padding:0px 20px 20px;
    border:1px dashed #444;
    box-sizing: border-box;
    margin-top:20px;
    .mainSectionRow{
      width:100%;
    }
    .mainSection{
      float:left;
      width:340px;
      height:240px;
      background:#FBFDFF;
      border:1px solid  #d0d0d0;
      box-sizing: border-box;
      margin-right:40px;
      margin-top:20px;
      position: relative;
      border-radius:4px;
      overflow: hidden;
      .mainCont{
        width:340px;
        height:240px;
        text-align: center;
        box-sizing: border-box;
        .mainContItem{
          float:left;
          width:50%;
          height:120px;
          padding:10px;
          padding-top:20px;
          box-sizing: border-box;
          position: relative;
          .title{
            font-size:18px;
            font-weight: bold;
            margin-bottom:30px;
            padding-top:14px;
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
          .mainDelBtn{
            margin-right:10px;
            font-size:16px;
            color:#409EFF;
          }
          .mainUpdateBtn{
            font-size:16px;
            color:#409EFF;
          }
          .mainDelBtn:hover{
            top:1px;
          }
        }
        .mainjiaBox{
          width:60%;
          height:90px;
          text-align: center;
          box-sizing: border-box;
          text-align: center;
          border:1px solid #d0d0d0;
          padding-top:22px;
          margin:0 0 0 20%;
          border-radius:4px;
          overflow: hidden;
          .mainjiaIcon{
            font-size:40px;
            color:#8c939d;
            display: inline-block;
            vertical-align: middle;
            cursor: pointer;
          }
          .mainjiaIcon:hover{
            color:#409EFF;
          }
        }
        .mainjiaBox:hover{
          border:1px solid  #409EFF;
        }
        .mainjiaBox:hover .mainjiaIcon{
          color:#409EFF;
        }
      }
    }
    .mainSection:nth-child(3n){
      margin-right:0;
    }
    .mainControl{
      margin-top:20px;
      .mainAdd{
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
        margin-right:15px;
        .mainAddIcon{
          font-size:14px;
          color:#8c939d;
        }
        .mainAddTitle{
          font-size:14px;
          color:#8c939d;
        }
      }
      .mainAdd:hover{
        border:1px solid  #409EFF;
      }
      .mainAdd:hover .mainAddIcon{
        color:#409EFF;
      }
      .mainAdd:hover .mainAddTitle{
        color:#409EFF;
      }
    }
  }
  .linkBox{
    padding:20px 20px 20px;
    border:1px dashed #444;
    box-sizing: border-box;
    margin-top:20px;
    .linkBoxLi{
      width: 134px;
      margin:0 10px 20px 0;
      float: left;
      text-align: center;
      position: relative;
      box-sizing: border-box;
      list-style-type: none;
      .link-img{
        display:block;
        width:100px;
        height:100px;
        margin:0 auto;
        border-radius:4px;
        overflow: hidden;
        border:1px solid #d0d0d0;
      }
      .link-title{
        width:100%;
        color:#333;
        font-size: 14px;
        white-space: nowrap;
        overflow: hidden;
        margin:0;
        text-overflow: ellipsis;
        margin-top:10px;
      }
    }
  }
  .linkAdd{
    float:left;
    width: 100px;
    height: 100px;
    position: relative;
    text-align: center;
    border:1px solid  #d0d0d0;
    background-color: #fbfdff;
    cursor:pointer;
    color:#8c939d;
    border-radius: 4px;
    overflow: hidden;
    padding-top:20px;
    margin-left:17px;
    box-sizing: border-box;
    .linkAddIcon{
      font-size:36px;
      color:#8c939d;
    }
    .linkAddTitle{
      margin-top:6px;
      display:block;
      font-size:14px;
      color:#8c939d;
    }
  }
  .linkAdd:hover{
    border:1px solid  #409EFF;
  }
  .linkAdd:hover .linkAddIcon{
    color:#409EFF;
  }
  .linkAdd:hover .linkAddTitle{
    color:#409EFF;
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
  .mainContItemBorder{
    width:148px !important;
    border:1px solid #ccc;
    margin:10px 10px 0px 10px;
    padding:0 !important;
    height:106px !important;
    .title{
      margin-bottom:10px !important;
    }
  }
  .selectWidth{
    width:80%;
    height:auto;
  }
}
</style>
<style lang="scss" scoped>
.skin-color1{
  background: #E60012 !important;
}
.skin-color2{
  background: #006442 !important;
}
.skin-color3{
  background: #428BCB !important;
}
.skin-color4{
  background: #661B18 !important;
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
.pcTypeOne-wraps .moreImgText{
  font-size: 12px;
  position: absolute;
  left: 0;
  bottom: -26px;
  width: 100px;
}
</style>
