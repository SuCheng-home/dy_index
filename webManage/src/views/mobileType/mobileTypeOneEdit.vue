<template>
  <div class="mobileOne-wraps">
    <div class="mobileOne-wrap">
      <div class="mobileOne-add">
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
            </div>
          </el-col>
        </el-row>
        <div class="mobileType-cont custom—scrollbar" :style="`height:${addServiceHeight-20}px`">
          <div class="header-top">
            <div class="logo clearfix">
              <img :src="schoolrLogoUrl" alt="">
              <div class="logo-title">
                <span class="name">{{schoolfullName}}</span>
              </div>
            </div>
          </div>
          <div class="bannerBox clearfix">
            <uploader pathPrefix="mobileTypeOneEdit" useSysBucket multiple v-model="bannerList" :extList="['jpeg', 'jpg', 'bmp', 'gif', 'png']" showMode="image" showResult="image" showModeText="添加轮播图(750*360)" :max="5" @maxHandler="maxHandler"></uploader>
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
              <span class="bannerAddTitle">添加轮播图<br/><span style="font-size:12px;">建议750*360</span></span>
            </el-upload> -->
          </div>
          <div class="navBox clearfix">
            <ul class="navMenuUl">
              <li class="navMenuLi" v-for="(moduleNav,index) in moduleJson" :key="index">
                {{moduleNav.name}}
              </li>
            </ul>
            <div class="navAdd" @click="showDialogNav">
              <i class="el-icon-plus avatar-uploader-icon navAddIcon"></i>
              <span class="navAddTitle">添加导航栏</span>
            </div>
          </div>
          <div class="tableModuleBox">
            <div class="tableModule">
              <div class="tablejiaBox" v-if="Object.keys(tableModuleJson).length==0" @click.stop="showDialogtable()">
                <i class="el-icon-plus avatar-uploader-icon tableJiaIcon">
                </i>
                <div class="tableTag"><span>添加主体头部模块</span></div>
              </div>
              <div class="tableContItem" v-if="Object.keys(tableModuleJson).length!==0" :rollModuleJson="tableModuleJson">
                <div class="title">{{tableModuleJson.name}}</div>
                <div class="control-btn">
                  <a href="javascript:;" class="tableDelBtn" @click.stop="delDialogtable()">
                    删除
                  </a>
                  <a href="javascript:;" class="tableUpdateBtn" @click.stop="showDialogtable()">
                    更改
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="photoModuleBox">
            <div class="tableModule photoModule">
              <div class="tablejiaBox" v-if="Object.keys(photoModuleJson).length==0" @click.stop="showDialogPhoto()">
                <i class="el-icon-plus avatar-uploader-icon tableJiaIcon">
                </i>
                <div class="tableTag"><span>添加主体图片轮播</span></div>
              </div>
              <div class="tableContItem" v-if="Object.keys(photoModuleJson).length!==0" :rollModuleJson="photoModuleJson">
                <div class="title">{{photoModuleJson.name}}</div>
                <div class="control-btn">
                  <a href="javascript:;" class="tableDelBtn" @click.stop="delDialogphoto()">
                    删除
                  </a>
                  <a href="javascript:;" class="tableUpdateBtn" @click.stop="showDialogPhoto()">
                    更改
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="bottomModuleBox">
            <div class="bottomModule">
              <div class="bottomModuleContItem" v-for="(bottomModuleItem,bottomModuleIndex) in bottomModuleJson" :key="bottomModuleIndex" v-if="bottomModuleJson&&bottomModuleJson.length!==0">
                <div class="title">{{bottomModuleItem.name}}</div>
                <div class="control-btn">
                  <a href="javascript:;" class="middleModuleDelBtn" @click.stop="delDialogphotoModule(bottomModuleItem.id)">
                    删除
                  </a>
                  <a href="javascript:;" class="middleModuleUpdateBtn" @click.stop="showDialogphotoModule(bottomModuleItem.id)">
                    更改
                  </a>
                </div>
              </div>
              <div class="middleModuleJiaBox" @click="showDialogphotoModule()">
                <i class="el-icon-plus avatar-uploader-icon middleModuleJiaIcon">
                </i>
                <span>添加底部切换模块</span>
              </div>
            </div>
          </div>
          <div class="footerBox clearfix">
            <p>访问量统计 &nbsp;联系方式&nbsp;版权&nbsp;备案号</p>
          </div>
        </div>
        <el-dialog title="导航栏添加或更换" :visible.sync="dialogNavVisible" class="dialoglinkWrap">
          <div class="dialoglinkBox clearfix">
            <div class="checkitem" v-for="(moduleItem,index) in moduleList" :key="index">
                <input class="check-select" type="checkbox" v-model="moduleItem.state" name="imgText" v-on:click="CheckItem(moduleItem)">
                <div class="checkitem-box">
                  <img class="check-img" v-if="moduleItem.logoUrl" :src="moduleItem.logoUrl">
                  <img class="check-img" v-else src="https://cdnfile-10043692.file.myqcloud.com/httpsresources/picinput.png">
                  <p class="check-title" >{{moduleItem.name}}</p>
                </div>
            </div>
          </div>
          <div slot="footer" class="dialog-footer">
              <el-button @click="dialogNavVisible=false">取 消</el-button>
              <el-button type="primary" @click="addCheckAndScore()">保 存</el-button>
          </div>
        </el-dialog>
        <el-dialog title="添加或修改主体头部模块" :visible.sync="dialogtableModule">
            <el-form :model="tableModuleObject" :rules="tableModuleObjectRules" ref="tableModuleObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="tableModuleObject.id" placeholder="请选择模块">
                      <el-option
                        v-for="moduleItem in mainModuleList"
                        :key="moduleItem.id"
                        :label="moduleItem.name"
                        :value="moduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogtableModule=false">取 消</el-button>
                <el-button type="primary" @click="addtableModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加或修改主体轮播模块" :visible.sync="dialogphotoModule">
            <el-form :model="photoModuleObject" :rules="photoModuleObjectRules" ref="photoModuleObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="photoModuleObject.id" placeholder="请选择模块">
                      <el-option
                        v-for="moduleItem in mainModuleList"
                        :key="moduleItem.id"
                        :label="moduleItem.name"
                        :value="moduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogphotoModule=false">取 消</el-button>
                <el-button type="primary" @click="addphotoModuleScore()">保 存</el-button>
            </div>
        </el-dialog>
        <el-dialog title="添加或修改底部切换模块" :visible.sync="dialogbottomModuleVisible">
            <el-form :model="bottomModuleJsonObject" :rules="bottomModuleJsonObjectRules" ref="bottomModuleJsonObject" label-width="100px">
                <el-form-item label="模块" prop="id">
                  <el-select class="selectWidth" v-model="bottomModuleJsonObject.id" placeholder="请选择模块">
                      <el-option
                        v-for="moduleItem in mainModuleList"
                        :key="moduleItem.id"
                        :label="moduleItem.name"
                        :value="moduleItem.id">
                      </el-option>
                  </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogbottomModuleVisible=false">取 消</el-button>
                <el-button type="primary" @click="addbottomModuleScore()">保 存</el-button>
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
import {getSchoolWebModuleListByWebId} from '@/api/webManage';
import {WebTemplateMbTw,getSchoolWebTemplateMbTw} from '@/api/mobileType1';
export default{
  components:{
    Uploader
  },
  data(){
    return{
      codeType:this.$route.query.codeType,
      UploadPath:global.BasePath+ 'common/addImageUp',////图片上传路径
      initJsonData:{
        shufflingTime:2
      },
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
      dialogNavVisible:false,
      moduleList:[],
      moduleJson:[],/*存放nav的数据*/
      moduleNum:[],/*计算nav的个数*/
      tableModuleJson:{},
      dialogtableModule:false,
      mainModuleList:[],//23的模块
      tableModuleObject:{
        id:''
      },
      tableModuleObjectRules:{
        id:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      photoModuleJson:{},
      dialogphotoModule:false,
      photoModuleObject:{
        id:''
      },
      photoModuleObjectRules:{
        id:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      bottomModuleJson:[],
      dialogbottomModuleVisible:false,
      bottomModuleJsonObject:{
        id:''
      },
      bottomModuleJsonObjectRules:{
        id:[
          {required: true, message: '请选择模块', trigger: 'change'}
        ]
      },
      bottomModuleNum:null
    }
  },
  created(){
    this.getSchoolWebModuleListByWebIdFunc();//模块列表（包括展示型列表型图片型）
    this.getSchoolMainModuleListFunc();//模块列表（）
  },
  mounted(){
    var This=this;
    setTimeout(function(){
      This.getSchoolWebTemplateMbTwFunc();
    },200);
  },
  mixins:[mixins],
  computed:{
    ...mapGetters([
      'schoolrLogoUrl',
      'schoolfullName',
      'templateTypeMb',
      'webId',
      'domainName'
    ])
  },
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
        path:'/main/mobileTypeOne',
        query:{
          codeType:this.codeType
        }
      })
    },
    getSchoolWebTemplateMbTwFunc(){
      getSchoolWebTemplateMbTw({
        templateType:this.codeType.toString(),
        webId:localStorage.getItem("webId")
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          if(data.data){
            let detailData=data.data;

            let detailInitJson=JSON.parse(detailData.initJson);
            this.initJsonData.shufflingTime=detailInitJson.shufflingTime;
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
            // let detailPhotoJson=JSON.parse(detailData.photoJson);
            // detailPhotoJson.forEach((item)=>{
            //   this.bannerList.push({
            //     url:item
            //   })
            // })
            this.moduleJson=JSON.parse(detailData.moduleJson);
            for(var i=0;i<this.moduleList.length;i++){
              for(var j=0;j<this.moduleJson.length;j++){
                if(this.moduleList[i].id==this.moduleJson[j].id){
                  this.moduleList[i].state=true;
                }
              }
            }

            this.tableModuleJson=JSON.parse(detailData.tableModuleJson);
            this.tableModuleObject.id=this.tableModuleJson.id;

            this.photoModuleJson=JSON.parse(detailData.photoModuleJson);
            this.photoModuleObject.id=this.photoModuleJson.id;

            this.bottomModuleJson=JSON.parse(detailData.bottomModuleJson);
          }
        }
      })
    },
    handleAddTypeOne(){
      let addflag=true;
      if(this.bannerList&&this.bannerList.length==0){
        this.$alert('请添加轮播图,轮播图不能为空!','提示',{
          type:'error',
          confirmButtonText:'确定'
        })
        return false;
      }
      if(this.moduleJson&&this.moduleJson.length==0){
        this.$alert('请添加导航栏,导航栏不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(Object.keys(this.tableModuleJson).length==0){
        this.$alert('请添加主体头部模块,主体头部模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(Object.keys(this.photoModuleJson).length==0){
        this.$alert('请添加主体轮播模块,主体轮播模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.tableModuleJson.id==this.photoModuleJson.id){
        this.$alert('主体头部模块和主体轮播模块不能相同!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      if(this.bottomModuleJson&&this.bottomModuleJson.length==0){
        this.$alert('请添加底部切换模块,底部切换模块不能为空!','提示',{
          type: 'error',
          confirmButtonText: '确定'
        })
        return false;
      }
      this.bottomModuleJson.forEach((item,index)=>{
        if(this.tableModuleJson.id==item.id){
          this.$alert('主体头部模块和底部切换模块不能相同!','提示',{
            type: 'error',
            confirmButtonText: '确定'
          })
          addflag=false;
        }else if(this.photoModuleJson.id==item.id){
          this.$alert('主体轮播模块和底部切换模块不能相同!','提示',{
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
        WebTemplateMbTw({
          initJson:JSON.stringify(this.initJsonData),
          photoJson:JSON.stringify(newBannerList),
          moduleJson:JSON.stringify(this.moduleJson),
          tableModuleJson:this.tableModuleJson,
          photoModuleJson:this.photoModuleJson,
          bottomModuleJson:JSON.stringify(this.bottomModuleJson),
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
              path:'/main/mobileTypeOne',
              query:{
                codeType:this.codeType
              }
            })
          }
        })
      }
    },
    showDialogphotoModule(id){
      this.dialogbottomModuleVisible=true;
      if(id){
        this.bottomModuleNum=id;
      }else{
        this.bottomModuleNum=null;
      }
    },
    delDialogphotoModule(id){
      this.$confirm('删除此模块网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.bottomModuleJson.forEach((item,index)=>{
          if(item.id==id){
            this.bottomModuleJson.splice(index,1);
          }
        })
      }).catch(() => {})
    },
    addbottomModuleScore(){
      //底部
      this.$refs.bottomModuleJsonObject.validate((valid)=>{
        if(valid){
          this.dialogbottomModuleVisible=false;
          this.mainModuleList.forEach((itemList)=>{
            if(this.bottomModuleJsonObject.id==itemList.id){
              let flag=true;
              let itemListId=itemList.id;
              this.bottomModuleJson.forEach((subItem)=>{
                if(itemListId==subItem.id){
                  this.$message({
                    type: 'error',
                    message: '相同模块不能重复添加！'
                  });
                  flag=false;
                }
              })
              if(flag){
                if(this.bottomModuleNum){
                  if(this.bottomModuleJson.length>3){
                    this.$message({
                      type:'error',
                      message:'最多添加3个！'
                    })
                    return false;
                  }else{
                    this.bottomModuleJson.forEach((title,titleindex)=>{
                      if(this.bottomModuleNum==title.id){
                        this.bottomModuleJson.splice(titleindex,1,{
                          id:itemList.id,
                          name:itemList.name,
                          logoUrl:itemList.logoUrl,
                          type:itemList.type
                        })
                      }
                    })
                  }
                }else{
                  if(this.bottomModuleJson.length>=3){
                    this.$message({
                      type:'error',
                      message:'最多添加3个！'
                    })
                    return false;
                  }else{
                    this.bottomModuleJson.push({
                      id:itemList.id,
                      name:itemList.name,
                      logoUrl:itemList.logoUrl,
                      type:itemList.type
                    })
                  }
                }
              }
            }
          })
        }
      })
    },
    delDialogtable(){
      this.$confirm('删除此模块网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.tableModuleJson={};
        this.tableModuleObject.id='';
      }).catch(() => {})
    },
    addphotoModuleScore(){
      //图片模块弹窗
      this.dialogphotoModule=true;
    },
    showDialogPhoto(){
      this.dialogphotoModule=true;
    },
    delDialogphoto(){
      this.$confirm('删除此模块网站上将不再展示？','提示',{type:'error'}).then(()=>{
        this.photoModuleJson={};
        this.photoModuleObject.id='';
      }).catch(() => {})
    },
    addphotoModuleScore(){
      //主体轮播模块
      this.$refs.photoModuleObject.validate((valid)=>{
        if(valid){
          this.dialogphotoModule=false;
          this.photoModuleJson={};
          this.mainModuleList.forEach((item)=>{
            if(this.photoModuleObject.id==item.id){
              this.photoModuleJson.id=item.id;
              this.photoModuleJson.name=item.name;
              this.photoModuleJson.logoUrl=item.logoUrl;
              this.photoModuleJson.type=item.type;
            }
          })
        }
      })
    },
    showDialogtable(){
      this.dialogtableModule=true;
    },
    addtableModuleScore(){
      this.$refs.tableModuleObject.validate((valid)=>{
        if(valid){
          this.dialogtableModule=false;
          this.tableModuleJson={};
          this.mainModuleList.forEach((item)=>{
            if(this.tableModuleObject.id==item.id){
              this.tableModuleJson.id=item.id;
              this.tableModuleJson.name=item.name;
              this.tableModuleJson.logoUrl=item.logoUrl;
              this.tableModuleJson.type=item.type;
            }
          })
        }
      })
    },
    addCheckAndScore(){
     //this.dialogNavVisible=false;
     //console.log("1",this.moduleNum);
      let num=0;
      this.moduleList.forEach((item,index)=>{
        if(item.state==true){
            num++
        }

      });
      if(num>8){
        this.$message({
          type:'error',
          message:'最多添加八个模块'
        })
        return ;
      // this.dialogNavVisible=false;
      }
      this.moduleJson=[];
      this.moduleNum=[];
     // console.log(this.moduleNum,this.moduleJson);
      this.moduleList.forEach((item,index)=>{
        if(item.state==true){
          this.moduleNum.push({
            id:item.id,
            name:item.name,
            logoUrl:item.logoUrl,
            columnUrl:item.columnUrl,
            type:item.type
          })
        }
      })
      this.moduleJson=this.moduleNum;
      this.dialogNavVisible=false;


      //console.log(this.moduleNum);
    //  else{
    //     this.moduleJson=this.moduleNum;
    //     this.$message({
    //       type:'error',
    //       message:'最多添加八个模块'
    //     })
    //     return false;
    //   }
    },
    CheckItem(item){
      item.state=!item.state;
    },
    getSchoolWebModuleListByWebIdFunc(){
      //nav弹窗的数据源
      getSchoolWebModuleListByWebId({
        webId:localStorage.getItem("webId"),
        type:1234
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.moduleList=data.data;
          this.moduleList.forEach((item)=>{
            item.state=false;
          })
        }
      })
    },
    getSchoolMainModuleListFunc(){
      //列表型图片型的数据源
      getSchoolWebModuleListByWebId({
        webId:localStorage.getItem("webId"),
        type:23
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.mainModuleList=data.data;
        }
      })
    },
    showDialogNav(){
      /*nav显示弹窗*/
      this.dialogNavVisible=true;
    },
    handleBannerRemove(index){
      /*轮播图删除*/
      this.bannerList.splice(index,1);
    },
    handleBeforeBanner(file){
      /*轮播图上传之前图片校验*/
      if(['image/jpg','image/jpeg','image/bmp','image/gif','image/png'].indexOf(file.type)==-1){
        this.$message.error('上传图片仅支持.jpg .jpeg .gif .png .bmp图片格式！');
        return false;
      }
      if(file.size/1024/1024>=2){
        this.$message.error('上传图片大小不能超过2MB！');
        return false;
      }
      return true;
    },
    handleBannerSuccess(res,file,fileList){
      /*轮播图上传成功*/
      let flag=true;
      if(this.bannerList&&this.bannerList.length>4){
        this.$message({
          type:'error',
          message:'轮播图最多上传5张！'
        });
        flag=false;
      }else{
        this.bannerList.push(res.data);
        flag=true;
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.mobileOne-wraps{
  background:#fff;
  border-radius: 3px;
  margin:0 10px;
  box-sizing: border-box;
  box-shadow: 0 0 5px 1px rgba(0,0,0,0.08);
}
.mobileOne-wrap{
  padding:0px 20px 20px;
  width:1200px;
  box-sizing: border-box;
  margin:0 auto;
  .menu-row{
    border-bottom: 1px solid #e7eaec;
    box-sizing: border-box;
    padding-bottom:15px;
    padding-top:15px;
    .el-button{
      margin-left: 15px;
    }
  }
  .menu-right{
    height:32px;
    line-height: 32px;
    color:#333;
    font-size:14px;
    .playTime{
      float:right;
      margin-right:20px;
    }
    .title{
      float:left;
      margin-right:10px;
    }
    .text{
      float: left;
    }
  }
  .mobileType-cont{
    width:100%;
    padding-top:10px;
    padding-bottom:20px;
    box-sizing: border-box;
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
    }
    .navMenuLi:last-child{
      margin-right: 10px;
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
  .tableModuleBox{
    margin-top:20px;
    padding:20px;
    border:1px dashed #444;
    box-sizing: border-box;
  }
  .tableModule{
    width:100%;
    height:130px;
    box-sizing: border-box;
    position: relative;
    .tablejiaBox{
      width:100%;
      height:100%;
      border: 1px solid #d0d0d0;
      box-sizing:border-box;
      background: #FBFDFF;
      position: relative;
      cursor: pointer;
      border-radius: 4px;
      overflow: hidden;
      .tableJiaIcon{
        position: absolute;
        left:50%;
        top:44%;
        margin:-20px 0 0 -20px;
        font-size: 40px;
        color: #8c939d;
      }
      .tableTag{
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
    .tablejiaBox:hover{
      border: 1px solid #409EFF;
      .tableJiaIcon{
        color: #409EFF;
      }
    }
    .tableContItem{
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
      .tableDelBtn{
        margin-right: 10px;
        font-size: 16px;
        color: #409EFF;
      }
      .tableUpdateBtn{
        font-size: 16px;
        color: #409EFF;
      }
    }
  }
  .photoModuleBox{
    margin-top:20px;
    padding:20px;
    border:1px dashed #444;
    box-sizing: border-box;
  }
  .bottomModuleBox{
    margin-top:20px;
    padding:20px;
    border:1px dashed #444;
    box-sizing: border-box;
    overflow: hidden;
    .middleModuleJiaBox{
      width: 120px;
      height: 88px;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
      border: 1px solid #d0d0d0;
      padding-top: 22px;
      //margin:0 auto;
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
    .bottomModuleContItem{
      float: left;
      width: 150px;
      height:90px;
      text-align: center;
      -webkit-box-sizing: border-box;
      box-sizing: border-box;
      text-align: center;
      border-radius: 4px;
      overflow: hidden;
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
  .selectWidth{
    width:80%;
    height:auto;
  }
  .mobileOne-detail{
    .tableContItem{
      padding-bottom:20px;
      .smallTitle{
        width:120px;
        height:50px;
        background-size:100% 100%;
        background-position: center center;
        margin:0 auto;
        border-radius:4px;
        overflow: hidden;
      }
    }
    .bottomModuleContItem{
      height:auto;
      .smallTitle{
        width:120px;
        height:50px;
        background-size:100% 100%;
        background-position: center center;
        margin:0 auto;
        border-radius:4px;
        overflow: hidden;
      }
    }
    .tableModule{
      height: auto;
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
}
</style>
<style lang="scss">
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
.href-btn{
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  border: 1px solid #dcdfe6;
  color: #fff;
  background-color: #409EFF;
  border-color: #409EFF;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: .1s;
  transition: .1s;
  font-weight: 500;
  padding: 9px 15px;
  font-size: 12px;
  border-radius: 3px;
  margin-left:15px;
  text-decoration:none;
}
.href-btn:hover{
  background: #66b1ff;
  border-color: #66b1ff;
  color: #fff;
}
</style>
<style lang="scss">
.mobileOne-wraps .moreImgText{
  font-size: 12px;
  position: absolute;
  left: 0;
  bottom: -26px;
  width: 100px;
}
</style>
