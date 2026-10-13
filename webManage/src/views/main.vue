<template>
  <div class="main-container">
    <!--公用头部-->
    <div class="header-wrap clearfix">
      <div class="logo clearfix">
        <img :src="schoolrLogoUrl" alt/>
        <div class="logo-title">
          <span class="name">{{schoolfullName}}</span>
          <span class="fixedName">网站管理平台</span>
        </div>
      </div>
      <div class="user-box">
        <div class="avatar_container">
          <div class="avatar_wrapper clearfix">
            <img class="user_avatar" :src="userAvatar" alt/>
            <div class="avatar-title">{{name}}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="indexNav-wrap clearfix">
      <div class="welcome-name">
        <span>欢迎您，</span>
        <span class="name-text">{{name}}</span>
      </div>
      <div class="navList clearfix">
        <ul>
          <li>
            <router-link class="navLi" tag="a" to="/main/homePage">
              <img src="../assets/index/index_icon.png" alt/>
              <span class="nav-title">首页</span>
            </router-link>
          </li>
          <li>
            <router-link
              class="navLi"
              tag="a"
              to="/main/news"
              v-if="firstWebService&&firstWebService.length&&permission.indexOf('/schoolWebTwo/webManager')!==-1||firstWebService&&firstWebService.length&&permission.indexOf('/schoolWebTwo/schoolWebTwoMessage')!==-1||firstWebService&&firstWebService.length&&permission.indexOf('/schoolWebTwo/schoolWebTwoschoolMail')!==-1"
            >
              <img src="../assets/index/info_icon.png" alt/>
              <span class="nav-title">消息中心</span>
            </router-link>
          </li>
          <li>
            <router-link
              class="navLi"
              tag="a"
              to="/main/moduleType"
              v-if="firstWebService&&firstWebService.length"
            >
              <img src="../assets/index/pc_icon.png" alt/>
              <span class="nav-title">模板设置</span>
            </router-link>
          </li>
          <!-- <li>
            <router-link class="navLi" tag="a" to="/main/mobileType" v-if="firstWebService&&firstWebService.length">
            <img src="../assets/index/phone_icon.png" alt="">
            <span class="nav-title">手机版</span>
            </router-link>
          </li>-->
          <li>
            <router-link
              class="navLi"
              tag="a"
              to="/main/webManage"
              v-if="firstWebService&&firstWebService.length&&permission.indexOf('/schoolWebTwo/webManager')!==-1||firstWebService&&firstWebService.length&&permission.indexOf('/schoolWebTwo/columnManager')!==-1"
            >
              <img src="../assets/index/webservice_icon.png" alt/>
              <span class="nav-title">栏目管理</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
    <div class="main-content">
      <div class="main-wrapper custom—scrollbar" :style="`height:${contentMax}px`">
        <router-view></router-view>
      </div>
    </div>
    <el-dialog
      title="网站选择"
      :visible.sync="webSwicthVisible"
      width="60%"
      class="webMoreDialog"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div class="school-box clearfix">
        <div
          class="school-item"
          v-for="(webItem,webIndex) in SchoolWebList"
          :key="webIndex"
          :class="{'school-chosed':webSwitchIndex==webIndex}"
          @click="choseWeb(webItem,webIndex)"
        >
          <div class="school-logo" :style="`backgroundImage:url(${webItem.logoUrl})`"></div>
          <div class="school-name">{{webItem.webName}}</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureSwicth">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from "vuex";
  import {getSchoolWebSettingBySchoolId} from "@/api/webService";
  import Cookies from "js-cookie";
  import mixins from "@/mixins/windowResize";

  export default {
    data() {
      return {
        token: this.$route.query.userToken || this.$route.query.token,
        paramJson: this.$route.query.paramJson,
        navNum: 0,
        webSwicthVisible: false,
        webSwitchIndex: 0,
        SchoolWebList: [],
        setWebItem: {},
        webId: "",
      };
    },
    computed: {
      ...mapGetters([
        "schoolrLogoUrl",
        "schoolfullName",
        "userAvatar",
        "userName",
        "name",
        "firstWebService",
        "permission",
      ]),
    },
    created() {
    },
    mounted() {
      if (this.token && this.paramJson) {
        Cookies.remove("webId");
        localStorage.removeItem("webId");
        this.getSchoolWebSettingBySchoolIdFunc();
        /*
        if(this.firstWebService&&this.firstWebService.length>0){
          //读取vuex里面是否有值
          this.SchoolWebList=this.firstWebService;
          if(this.SchoolWebList){
            if(this.SchoolWebList.length==1){
              this.setWebItem=this.SchoolWebList[0];
              this.webId=this.SchoolWebList[0].id;
              this.webSwitchIndex=0;
              Cookies.set("webId",this.webId);
              if(Cookies.get("webId")){
                this.$store.dispatch('getOneWebInfo',{webId:Cookies.get("webId")});
              }
              this.$router.replace({
                path:'/main/homePage'
              })
            }else if(this.SchoolWebList.length>1){
              this.setWebItem=this.SchoolWebList[0];
              this.webId=this.SchoolWebList[0].id;
              this.webSwitchIndex=0;
              this.webSwicthVisible=true;
            }
          }
        }else if(this.firstWebService&&this.firstWebService.length==0){
          //读取vuex里面值为空
          this.SchoolWebList=[];
          if(this.SchoolWebList.length==0){
            this.$router.replace({
              path:'/main/homePage'
            })
          }
        }
       this.getSchoolWebSettingBySchoolIdFunc();*/
      }
    },
    mixins: [mixins],
    methods: {
      choseWeb(item, index) {
        this.webSwitchIndex = index;
        this.setWebItem = item;
        this.webId = item.id;
      },
      sureSwicth() {
        Cookies.set("webId", this.webId);
        if (Cookies.get("webId")) {
          this.$store.dispatch("getOneWebInfo", {webId: Cookies.get("webId")});
        }
        this.$router.replace({
          path: "/main/homePage",
        });
        this.webSwicthVisible = false;
      },

      getSchoolWebSettingBySchoolIdFunc() {
        getSchoolWebSettingBySchoolId()
          .then((res) => res.data)
          .then((data) => {
            if (data.code === 200) {
              if (data.data) {
                this.SchoolWebList = data.data;
                if (this.SchoolWebList) {
                  if (this.SchoolWebList.length == 0) {
                    this.$router.replace({
                      path: "/main/homePage",
                    });
                  } else if (this.SchoolWebList.length == 1) {
                    this.setWebItem = this.SchoolWebList[0];
                    this.webId = this.SchoolWebList[0].id;
                    this.webSwitchIndex = 0;
                    Cookies.set("webId", this.webId);
                    if (Cookies.get("webId")) {
                      this.$store.dispatch("getOneWebInfo", {
                        webId: Cookies.get("webId"),
                      });
                    }
                    this.$router.replace({
                      path: "/main/homePage",
                    });
                  } else if (this.SchoolWebList.length > 1) {
                    this.setWebItem = this.SchoolWebList[0];
                    this.webId = this.SchoolWebList[0].id;
                    this.webSwitchIndex = 0;
                    this.webSwicthVisible = true;
                  }
                }
              }
            }
          });
      },
    },
  };
</script>

<style lang="scss" scoped>
  .main-container {
    width: 100%;
    height: auto;
    min-width: 1200px;
  }

  .header-wrap {
    box-sizing: border-box;
    position: fixed;
    top: 0;
    width: 100%;
    min-width: 1320px;
    height: 50px;
    color: #fff;
    z-index: 990;
    line-height: 40px;
    background: #324157;
    padding: 5px 0;

    .logo {
      box-sizing: border-box;
      padding-left: 60px;
      float: left;
      cursor: pointer;

      img {
        box-sizing: border-box;
        display: inline-block;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        vertical-align: middle;
      }

      .logo-title {
        display: inline-block;
        vertical-align: middle;
        font-size: 20px;
      }
    }

    .user-box {
      float: right;
      padding-right: 20px;

      .avatar_wrapper {
        padding-right: 26.5px;

        .user_avatar {
          box-sizing: border-box;
          vertical-align: middle;
          display: inline-block;
          width: 40px;
          height: 40px;
          border: 2px #fff solid;
          border-radius: 50%;
        }

        .avatar-title {
          vertical-align: middle;
          display: inline-block;
          font-size: 14px;
        }

        .avatar-i {
          display: block;
          float: left;
          font-size: 18px;
          margin-top: 14px;
        }
      }
    }
  }

  .indexNav-wrap {
    box-sizing: border-box;
    background: #fff;
    border-bottom: 1px #cdcdcd solid;
    position: fixed;
    top: 50px;
    height: 90px;
    padding: 5px 20px;
    width: 100%;
    z-index: 91;
    min-width: 1320px;
    font-family: AdobeHeitiStd-Regular;

    .welcome-name {
      box-sizing: border-box;
      font-weight: 700;
      float: left;
      line-height: 70px;
      font-size: 0;
      color: #676a6c;
      padding-left: 40px;

      span {
        font-size: 25px;

        &.name-text {
          color: #409eff;
        }
      }
    }

    .navList {
      float: right;

      ul {
        list-style-type: none;
        padding: 0;
        margin: 0;
        overflow: hidden;

        li {
          box-sizing: border-box;
          float: left;
          padding: 0 15px;
          position: relative;
          cursor: pointer;
          color: #444;
        }

        .navLi {
          text-decoration: none;

          img {
            box-sizing: border-box;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin: 0 auto;
            display: block;
          }

          .nav-title {
            font-weight: 700;
            display: block;
            text-align: center;
            line-height: 28px;
            font-size: 14px;
            color: #676a6c;
            font-family: MicrosoftYaHei;
          }
        }

        .navLi:hover,
        .navLi.router-link-active {
          .nav-title {
            color: #4db3ff;
          }
        }
      }
    }
  }

  .school-box {
    max-height: 450px;

    .school-item {
      width: 200px;
      height: 120px;
      float: left;
      text-align: center;
      cursor: pointer;
      margin-left: 10px;
      margin-bottom: 10px;
      border-radius: 4px;
      border: 2px solid #fff;

      .school-logo {
        width: 200px;
        height: 80px;
        margin: 4px auto;
        background-position: 50%;
        background-size: 100% 80%;
        background-repeat: no-repeat;
      }

      .school-name {
        height: 30px;
        width: 100%;
        white-space: nowrap;
        line-height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .school-chosed {
      border: 2px solid #20a0ff;
    }
  }
</style>
<style>
  .main-content {
    box-sizing: border-box;
    width: 100%;
    padding-top: 160px; /*167*/
    box-sizing: border-box;
    overflow: hidden;
  }

  .main-wrapper {
    width: 100%;
    min-height: 100%;
    overflow: hidden;
    /* background: #fff; */
    margin: 0 auto;
  }

  .webMoreDialog {
    background: rgba(0, 0, 0, 0.55);
  }
</style>
