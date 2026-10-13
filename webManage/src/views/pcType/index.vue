<template>
  <div class="pcType-wraps custom—scrollbar" :style="`height:${columnMax-40}px`">
    <div class="pcType-wrap">
      <div class="pcType-module">
        <div class="header">
          <div class="title">pc模板选择</div>
        </div>
        <div class="pc-main clearfix">
          <div class="pcItem" v-for="(pcTypeItem,index) in pcTypeData" :key="pcTypeItem.code" @mouseover.stop="maskShow(pcTypeItem)" @mouseout.stop="maskHide(pcTypeItem)">
            <div class="mask-use-box">
              <img class="pcItem-img" :src="pcTypeItem.value" alt="">
              <div class="top_right_mask" v-if="templateTypePc==pcTypeItem.code">使用中</div>
            </div>
            <transition name="pcTypeShow">
            <div v-if="pcTypeItem.isShow">
              <div class="pcItem-mask" v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1"></div>
              <div class="pcItem-cont" @click.stop="justTo(index,pcTypeItem.code)" v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1">
                <a class="left-btn" href="javascript:;" @click.stop="showDialog(pcTypeItem.value)">
                  <i class="fa fa-search" aria-hidden="true"></i>
                  <span>预览</span>
                </a>
                <a class="right-btn" v-if="permission.indexOf('/schoolWebTwo/customer')!==-1" href="javascript:;" @click.stop="usePcType(index,pcTypeItem.code)" >
                  <i class="fa fa-file-text-o" aria-hidden="true"></i>
                  <span>使用</span>
                </a>
              </div>
            </div>
            </transition>
          </div>
        </div>
        <div class="header">
          <div class="title">手机模板选择</div>
        </div>
        <div class="mobile-main clearfix">
          <div class="pcItem" v-for="(mobileTypeItem,mobileIndex) in mobileTypeData" :key="mobileTypeItem.code" @mouseover.stop="maskShow(mobileTypeItem)" @mouseout.stop="maskHide(mobileTypeItem)">
            <div class="mask-use-box">
              <img class="pcItem-img" :src="mobileTypeItem.value" alt="">
              <div class="top_right_mask" v-if="templateTypeMb==mobileTypeItem.code">使用中</div>
            </div>
            <transition name="pcTypeShow">
            <div v-if="mobileTypeItem.isShow">
              <div class="pcItem-mask" v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1"></div>
              <div class="pcItem-cont" @click.stop="justToMobile(mobileIndex,mobileTypeItem.code)" v-if="permission.indexOf('/schoolWebTwo/webManager')!==-1">
                <a class="left-btn" href="javascript:;" @click.stop="showDialog(mobileTypeItem.value)">
                  <i class="fa fa-search" aria-hidden="true"></i>
                  <span>预览</span>
                </a>
                <a class="right-btn" v-if="permission.indexOf('/schoolWebTwo/customer')!==-1" href="javascript:;" @click.stop="useMobileType(mobileIndex,mobileTypeItem.code)" >
                  <i class="fa fa-file-text-o" aria-hidden="true"></i>
                  <span>使用</span>
                </a>
              </div>
            </div>
            </transition>
          </div>
        </div>
      </div>
      <previewer-dialog ref="previewer"  :src="picSrc"></previewer-dialog>
    </div>
  </div>
</template>

<script>
import mixins from '@/mixins/windowResize';
import PreviewerDialog from '@/components/ImagePreviewer/PreviewerDialogOne.vue';
import {mapGetters} from 'vuex';
import {findDicsByCode} from '@/api/webType1';
import {updateSchoolWebSettingInit} from '@/api/otherMessage';
export default{
  components:{
    PreviewerDialog
  },
  data(){
    return{
      pcTypeData:[],
      codeType1:'',
      codeType2:'',
      picSrc:'',
      showRightMask:false,
      mobileTypeData:[],
      mobileCodeType1:'',
      mobilePicSrc:'',
      showMobileMask:false
    }
  },
  created(){
  },
  computed:{
    ...mapGetters([
        'webId',
        'webName',
        'templateTypePc',
        'templateTypeMb',
        'permission'
    ])
  },
  mounted(){
    this.findDicsByCodeFunc();
    this.findMobileCodeFunc();
    localStorage.setItem('webId',this.webId);
  },
  mixins:[mixins],
  methods:{
    
    justTo(index,code){
      if(index==0){
        this.$router.push({
          path:'/main/pcTypeOne',
          query:{
            codeType:code
          }
        })
      }else if(index==1){
        this.$router.push({
          path:'/main/pcTypeTwo',
          query:{
            codeType:code
          }
        })
      }
    },
    justToMobile(index,code){
      if(index==0){
        this.$router.push({
          path:'/main/mobileTypeOne',
          query:{
            codeType:code
          }
        })
      }
    },
    usePcType(index,code){
      //使用
      updateSchoolWebSettingInit({
        id:localStorage.getItem("webId"),
        batchUserJson:'',
        isBatch:1,
        isToModule:null,
        moduleJson:'',
        templateTypeMb:'',
        templateTypePc:code
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.$message({
              type: 'success',
              message: '设置模板成功!'
          });
          this.showRightMask=true;
          this.$store.dispatch('getOneWebInfo',{webId:localStorage.getItem('webId')}).then((res)=>{
            if(index==0){
              this.$router.push({
                path:'/main/pcTypeOne',
                query:{
                  codeType:code
                }
              })
            }else if(index==1){
              this.$router.push({
                path:'/main/pcTypeTwo',
                query:{
                  codeType:code
                }
              })
            }
          })
          
        }
      })
    },
    useMobileType(index,code){
      //使用
      updateSchoolWebSettingInit({
        id:localStorage.getItem("webId"),
        batchUserJson:'',
        isBatch:1,
        isToModule:null,
        moduleJson:'',
        templateTypeMb:code,
        templateTypePc:''
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          this.$message({
              type: 'success',
              message: '设置模板成功!'
          });
          this.showMobileMask=true;
          this.$store.dispatch('getOneWebInfo',{webId:localStorage.getItem('webId')});
          if(index==0){
            this.$router.push({
              path:'/main/mobileTypeOne',
              query:{
                codeType:code
              }
            })
          }
        }
      })
    },
    showDialog(src){
      this.picSrc=src;
      this.$refs.previewer.show();
    },
    maskShow(item){
      item.isShow=true;
    },
    maskHide(item){
      item.isShow=false;
    },
    findDicsByCodeFunc(){
      findDicsByCode({
        dicCode:"webTemplatePc"
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          data.data.forEach(function(item){
            item.isShow=false;
          })
          this.pcTypeData=data.data;
          this.codeType1=this.pcTypeData[0].code;
          this.codeType2=this.pcTypeData[1].code;
        }
      })
    },
    findMobileCodeFunc(){
      findDicsByCode({
        dicCode:"webTemplateMb"
      }).then(res=>res.data)
      .then(data=>{
        if(data.code===200){
          data.data.forEach(function(item){
            item.isShow=false;
          })
          this.mobileTypeData=data.data;
          this.mobileCodeType1=this.mobileTypeData[0].code;
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.pcType-wraps{
  background:#fff;
  border-radius: 3px;
  margin:0 10px;
  box-sizing: border-box;
  box-shadow: 0 0 5px 1px rgba(0,0,0,0.08);
  overflow-y:auto;
  overflow-x: hidden;
}
.pcType-wrap{
  width:1200px;
  box-sizing: border-box;
  padding:20px;
  position: relative;
  overflow:hidden;
  margin:0 auto;
  .header{
    padding-top:10px;
    .title{
      font-size:16px;
      color:#000;
      font-weight: bold;
    }
  }
  .pc-main{
    padding-top:20px;
    .pcItem{
      float: left;
      width: 367px;
      height: 240px;
      outline: 0;
      padding:14px 6px 0 6px;
      box-sizing: border-box;
      position: relative;
      background: url(../../assets/pc/pc_bg.png) no-repeat;
      margin-right:27px;
      margin-bottom: 27px;
      overflow: hidden;
      cursor: pointer;
      .mask-use-box{
        width:100%;
        height:215px;
        overflow: hidden;
        position: relative;
      }
      .pcItem-img{
        display: block;
        width:100%;
        height:215px;
        overflow: hidden;
      }
      .top_right_mask{
        position: absolute;
        top: 13px;
        right: -25px;
        width: 100px;
        height: 26px;
        line-height: 26px;
        text-align: center;
        font-size: 14px;
        color: #fff;
        background: #409EFF;
        -webkit-transform: rotate(45deg);
        transform: rotate(45deg);
        z-index:3;
      }
      .pcItem-mask{
        position: absolute;
        left:6px;
        top:14px;
        width:355px;
        height:215px;
        background: #000;
        opacity: 0.6;
        z-index:4;
      }
      .pcItem-cont{
        position: absolute;
        left:6px;
        top:14px;
        width:355px;
        padding-top:83px;
        height:215px;
        z-index:5;
        box-sizing: border-box;
        text-align: center;
        .left-btn{
          display:inline-block;
          width: 87px;
          height: 48px;
          line-height: 48px;
          color: #fff;
          text-align: center;
          background-color: #5874d8;
          font-size: 14px;
          text-decoration: none;
          overflow: hidden;
          border-radius: 2px;
        }
        .right-btn{
          display: inline-block;
          width: 87px;
          height: 48px;
          z-index:6;
          line-height: 48px;
          color: #fff;
          text-align: center;
          background-color: #5874d8;
          font-size: 14px;
          text-decoration: none;
          overflow: hidden;
          border-radius: 2px;
          margin-left: 26px;
        }
      }
    }
    .pcItem:nth-child(3n){
      margin-right:0;
    }
    .pcTypeShow-enter-active, .pcTypeShow-leave-active {
      transition: opacity .6s;
      transition: 0.3s ease-in-out;
    }
    .pcTypeShow-enter, .pcTypeShow-leave-to {
      opacity: 0;
    }
    
  }

}
.mobile-main{
  padding-top:20px;
  .pcItem{
    float: left;
    display: block;
    width: 217px;
    height: 450px;
    outline: 0;
    margin-right: 85px;
    margin-bottom: 48px;
    padding: 44px 8px 50px 9px;
    position: relative;
    background: url(../../assets/pc/mobile_bg.png) no-repeat;
    box-sizing: border-box;
    // width: 367px;
    // height: 240px;
    // outline: 0;
    // padding:14px 6px 0 6px;
    // box-sizing: border-box;
    // position: relative;
    // background: url(../../assets/pc/pc_bg.png) no-repeat;
    // margin-right:27px;
    // margin-bottom: 27px;
    // overflow: hidden;
    cursor: pointer;
    .mask-use-box{
      width:100%;
      height:100%;
      overflow: hidden;
      position: relative;
    }
    .pcItem-img{
      display: block;
      width:100%;
      height:100%;
      //background-position: center top;
      overflow: hidden;
    }
    .top_right_mask{
      position: absolute;
      top: 13px;
      right: -25px;
      width: 100px;
      height: 26px;
      line-height: 26px;
      text-align: center;
      font-size: 14px;
      color: #fff;
      background: #409EFF;
      -webkit-transform: rotate(45deg);
      transform: rotate(45deg);
      z-index:3;
    }
    .pcItem-mask{
      position: absolute;
      left: 9px;
      top: 44px;
      width: 200px;
      height: 356px;
      background: #000;
      opacity: 0.6;
      z-index: 4;
    }
    .pcItem-cont{
      position: absolute;
      left: 9px;
      top: 97px;
      width: 200px;
      height: 356px;
      z-index:5;
      padding-top:80px;
      box-sizing: border-box;
      text-align: center;
      .left-btn{
        display:inline-block;
        width: 70px;
        height: 48px;
        line-height: 48px;
        color: #fff;
        text-align: center;
        background-color: #5874d8;
        font-size: 14px;
        text-decoration: none;
        overflow: hidden;
        border-radius: 2px;
      }
      .right-btn{
        display: inline-block;
        width: 70px;
        height: 48px;
        z-index:6;
        line-height: 48px;
        color: #fff;
        text-align: center;
        background-color: #5874d8;
        font-size: 14px;
        text-decoration: none;
        overflow: hidden;
        border-radius: 2px;
        margin-left: 10px;
      }
    }
  }
  .pcItem:nth-child(3n){
    margin-right:0;
  }
  .pcTypeShow-enter-active, .pcTypeShow-leave-active {
    transition: opacity .6s;
    transition: 0.3s ease-in-out;
  }
  .pcTypeShow-enter, .pcTypeShow-leave-to {
    opacity: 0;
  }
  
}
</style>
<style lang="scss">
.pcItem .images{
  width:355px;
  height:214px;
  display:block;
}

</style>
