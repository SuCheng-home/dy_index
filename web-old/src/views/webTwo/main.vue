<template>
  <div id="main">
    <!--header-->
    <div class="header-container headerTwo">
      <div class="header">
        <router-link
          tag="div"
          class="logo"
          to="/webTwo/main/index"
        >
          <img
            :src="logoUrl"
            alt
          />
        </router-link>
        <div class="login-wrap">
          <span class="icon icon-hint"></span>
          <span
            class="icon icon-qrcode"
            @mouseover="boxShow()"
            @mouseout="boxHide()"
          ></span>
          <div class="form-box">
            <el-form
              autocomplete="on"
              :model="loginForm"
              :rules="loginRules"
              ref="loginForm"
              class="card-box login-form"
            >
              <el-form-item
                prop="account"
                class="input input--username"
              >
                <label
                  for="j_username"
                  class="icon input__icon"
                ></label>
                <el-input
                  id="j_username"
                  name="account"
                  type="text"
                  v-model="loginForm.account"
                  autocomplete="on"
                  placeholder="手机号"
                ></el-input>
              </el-form-item>
              <el-form-item
                prop="password"
                class="input input--password"
              >
                <label
                  for="j_password"
                  class="icon input__icon"
                ></label>
                <el-input
                  id="j_password"
                  name="password"
                  type="password"
                  v-model="loginForm.password"
                  autocomplete="on"
                  placeholder="密码"
                  @keyup.enter.native="handleLogin"
                ></el-input>
              </el-form-item>
              <el-form-item class="login-btn-box">
                <el-button
                  type="primary"
                  class="login-btn"
                  :loading="loading"
                  @click.native.prevent="handleLogin()"
                >登录</el-button>
              </el-form-item>
            </el-form>
          </div>
          <!--二维码弹窗-->
          <div
            class="qrcode-outer-container"
              @mouseover="boxShow()"
            @mouseout="boxHide()"
            v-show="erweiBox"
          >
            <span class="qrcode-arrow"></span>
            <div
              id="qrcode-container"
              class="qrcode-container"
            >
              <div
                class="wrp_code login-code"
                id="login-code"
              >
                <img
                  class="qrcode lightBorder"
                  src="https://open.weixin.qq.com/connect/qrcode/021s62Qvq6EzRlq8"
                />
              </div>
              <div class="info">
                <p>请使用微信扫描二维码登录</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--轮播-->
    <div class="lunbo-container">
      <div
        class="lunbo-box"
        v-if="photoJsonTwo.length>0"
      >
        <el-carousel
          :interval="shufflingTimeTwo*1000"
          arrow="hover"
          trigger="click"
          height="260px"
        >
          <el-carousel-item
            v-for="(item,index) in photoJsonTwo"
            :key="index"
          >
            <div
              class="photo-item"
              :style="{backgroundImage:`url(${item})`}"
            ></div>
          </el-carousel-item>
        </el-carousel>
      </div>
    </div>
    <!--nav-->
    <div class="nav-container">
      <div class="addmaskhoverleft"></div>
      <div class="addmaskhover"></div>
      <div class="menu-info">
        <div class="nemu-box">
          <div
            class="fa fa-chevron-left left-btn"
            @click="leftSlider()"
          ></div>
          <div
            class="fa fa-chevron-right right-btn"
            @click="rightSlider()"
          ></div>
          <ul class="menuBar clearfix">
            <template v-for="(navItem,index) in columnListTwo">
              <router-link
                class="menu"
                v-if="index==0"
                tag="li"
                to="/webTwo/main/index"
              >
                <a
                  class="menuItem"
                  href="javascript:;"
                >学校首页</a>
              </router-link>
              <!--栏目类型为2-->
              <li
                class="menu"
                v-if="navItem.type===2||navItem.type===3"
                @click.stop="jumpTo('/webTwo/main/column',navItem)"
                @mouseover.stop="mouseoverShow(navItem)"
                @mouseout.stop="mouseoutHide(navItem)"
                :key="index"
              >
                <a
                  class="menuItem"
                  href="javascript:;"
                >{{navItem.name}}</a>
                <span class="line-tag"></span>
                <ul
                  class="ulSubMenu"
                  v-show="navItem.navShow &&navItem.moduleList!==''"
                >
                  <template v-for="(subNav,subIndex) in navItem.moduleList">
                    <li
                      class="liSubMenu"
                      v-if="subNav.type===1"
                      @click.stop="subjumpTo('/webTwo/main/column/newdetail',navItem,subNav)"
                      :key="subIndex"
                    >
                      <a
                        class="aSubMenu"
                        href="javascript:;"
                      >{{subNav.name}}</a>
                    </li>
                    <li
                      class="liSubMenu"
                      v-if="subNav.type===2"
                      @click.stop="subjumpTo('/webTwo/main/column/newlist',navItem,subNav)"
                      :key="subIndex"
                    >
                      <a
                        class="aSubMenu"
                        href="javascript:;"
                      >{{subNav.name}}</a>
                    </li>
                    <li
                      class="liSubMenu"
                      v-if="subNav.type===3"
                      @click.stop="subjumpTo('/webTwo/main/column/piclist',navItem,subNav)"
                      :key="subIndex"
                    >
                      <a
                        class="aSubMenu"
                        href="javascript:;"
                      >{{subNav.name}}</a>
                    </li>
                    <li
                      class="liSubMenu"
                      v-if="subNav.type===4"
                      :key="subIndex"
                    >
                      <a
                        class="aSubMenu"
                        :href="subNav.columnUrl"
                        target="_blank"
                      >{{subNav.name}}</a>
                    </li>
                  </template>
                </ul>
              </li>
              <!--栏目类型为1-->
              <li
                class="menu"
                v-if="navItem.type===1"
                @click="jumpTo('/webTwo/main/detail',navItem)"
              >
                <a
                  class="menuItem"
                  href="javascript:;"
                >{{navItem.name}}</a>
                <span class="line-tag"></span>
              </li>
              <!--栏目类型为3-->
              <!-- <li class="menu" v-if="navItem.type===3" @click="jumpTo('/webTwo/main/column',navItem)">
                <a class="menuItem" href="javascript:;">{{navItem.name}}</a>
              </li>-->
              <!--栏目类型为4-->
              <li
                class="menu"
                v-if="navItem.type===4"
              >
                <a
                  class="menuItem"
                  :href="navItem.columnUrl"
                  target="_blank"
                >{{navItem.name}}</a>
                <span class="line-tag"></span>
              </li>
            </template>
          </ul>
        </div>
      </div>
    </div>
    <div class="view-content">
     <keep-alive>
                <router-view v-if="$route.meta.isCached"></router-view>
            </keep-alive>
        <router-view v-if="!$route.meta.isCached"></router-view>
    </div>
    <!--回到顶部-->
    <div
      class="goTop"
      @click="goTop"
    >
      <div class="defaultA">
        <i
          class="fa fa-angle-up"
          aria-hidden="true"
        ></i>
      </div>
      <div class="hoverA">
        <span>回到顶部</span>
      </div>
    </div>
    <!--底部-->
    <div class="footer-container">
      <div class="footer-wrap">
        <p>
          <span>今日访问量：{{accessNumberList.dateNumber}}</span>|
          <span>本月访问量：{{accessNumberList.monthNumber}}</span>|
          <span>总访问量：{{accessNumberList.totalNumber}}</span>
        </p>
        <p>
          <span>{{address}}</span>|
          <a
            href="http://beian.miit.gov.cn"
            target="_blank"
          >{{recodation}}</a>
            <a
            :href="institution"
            target="_blank"
            v-show="isInstitute==2"
          ><img style="cursor:pointer;height: 40px;" src="https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/wangzhanurl.png"/></a>
        </p>
        <p>
          <span v-if="postRecodation">
            <a
              :href="`http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=${recordcode}`"
              target="_blank"
            >
              <img
                class="police-ico"
                src="https://cdnfile-10043692.file.myqcloud.com/web/images/police_ico.png"
                alt
              />
              {{postRecodation}}
            </a>|
          </span>
          <span
            v-html="copyRight"
            style="margin-left:0px"
          ></span><span v-if="oldDomainName">|
            <a
              :href="oldDomainName"
              target="_blank"
            >原网站</a>
          </span>
        </p>
      </div>
    </div>
    <!--选择学校-->
    <el-dialog
      title="选择学校"
      :visible.sync="dialogChoseSchoolVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="dialogChoseSchoolClose"
    >
      <div
        class="school-box el-table__body-wrapper"
        :class="{ 'school-box-center': schoolList.length<5}"
      >
        <div
          class="school-item"
          :class="{ 'school-chosed': item.checked}"
          :key="item.id"
          v-for="item in schoolList"
          @click="chosedSchool(item)"
        >
          <div
            class="school-logo"
            :style="{backgroundImage:'url('+item.squareLogoUrl+')'}"
          ></div>
          <div class="school-name">{{item.name}}</div>
        </div>
        <div class="clear"></div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <div style="float:left;">
          <el-input
            v-if="schoolSourceList.length>10"
            placeholder="学校名称"
            v-model="filterText"
            icon="search"
          ></el-input>
        </div>
        <el-button @click="dialogChoseSchoolVisible = false">取 消</el-button>
        <el-button
          type="primary"
          :loading="choseSchoolloading"
          @click="loginForChosedSchooldFunc()"
        >进 入</el-button>
      </div>
    </el-dialog>
    <!--首次登陆-->
    <el-dialog
      title="首次登录需修改密码"
      :visible.sync="dialogResetPwdVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="dialogResetPwdClose"
    >
      <div class="change-passbox">
        <el-form
          :model="rulePwdForm"
          status-icon
          :rules="pwdRules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="当前密码"
            prop="currentPwd"
          >
            <el-input
              type="password"
              v-model="rulePwdForm.currentPwd"
              auto-complete="off"
              placeholder="当前密码"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="新密码"
            prop="pass"
          >
            <el-input
              type="password"
              v-model="rulePwdForm.pass"
              auto-complete="off"
              placeholder="6~20位字母、数字、特殊字符(!@#$%)任意两种以上的组合"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="checkPass"
          >
            <el-input
              type="password"
              v-model="rulePwdForm.checkPass"
              auto-complete="off"
              placeholder="确认密码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogResetPwdVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="resetPass()"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!--微信第一次登录-->
    <el-dialog
      title="您是第一次使用微信登录，请验证您的微信账号"
      size="tiny"
      :visible.sync="dialogBindWxVisible"
      :close-on-press-escape="false"
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      @close="dialogChoseSchoolClose"
    >
      <div class="change-passbox">
        <el-form
          :model="wxLoginForm"
          status-icon
          :rules="wxLoginFormRule"
          ref="wxLoginFormRuleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item
            label="手机号码"
            prop="mobile"
          >
            <el-input
              type="text"
              v-model="wxLoginForm.mobile"
              auto-complete="off"
              placeholder="当前您的手机号码"
            >
              <el-button
                type="danger"
                slot="append"
                :disabled="codeFlag"
                @click="getCodeFunc()"
              >{{codeBtnTxt}}</el-button>
            </el-input>
          </el-form-item>
          <el-form-item
            label="验证码"
            prop="code"
          >
            <el-input
              type="text"
              v-model="wxLoginForm.code"
              auto-complete="off"
              placeholder="您手机上收到的验证码"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogBindWxVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="bindWx()"
        >确 定</el-button>
      </span>
    </el-dialog>
    <!---->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { encrypt } from "@/utils/index";
import socialSign from "./index/socialsignin";
import {
  getAccessNumber,
  login,
  loginForChosedSchoold,
  modifyPassword,
  getWXInitData,
  loginForWX,
  loginWx,
  getCode,
  wxBind,
} from "@/api/firstPage";
export default {
  name: "App",
  components: {
    socialSign,
  },
  data() {
    var validateNewPass = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码！"));
      }
      if (value == this.rulePwdForm.currentPwd) {
        callback(new Error("新旧密码不能相同！"));
      }
      let g = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!@#$%]+$)[\da-zA-Z!@#$%]{6,20}$/;
      if (!g.test(value)) {
        callback(new Error("密码的格式不正确！"));
      } else {
        callback();
      }
    };
    var validateNewPass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码！"));
      } else if (value !== this.rulePwdForm.pass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    var validateNowPass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码！"));
      }
      if (value != this.loginForm.password) {
        callback(new Error("当前密码不正确！"));
      } else {
        callback();
      }
    };
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机不能为空！"));
      }
      let g = /^0?1[3|4|5|7|8|9][0-9]\d{8}$/;
      if (!g.test(value)) {
        callback(new Error("手机号码格式不正确！"));
      } else {
        callback();
      }
    };
    var checkCode = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("验证码不能为空！"));
      } else {
        callback();
      }
    };
    return {
      accessNumberList: {
        dateNumber: "",
        monthNumber: "",
        totalNumber: "",
      },
      erweiBox: false,
      loginForm: {
        account: "",
        password: "",
      },
      loginRules: {
        account: [
          { required: true, message: "用户名不能为空！", trigger: "blur" },
        ],
        password: [
          { required: true, message: "密码不能为空！", trigger: "blur" },
        ],
      },
      wxcode: "", //微信登录的code
      wxToken: "", //微信token
      schoolSourceList: [], //学校集合源数据，保留检索的所有学校
      schoolList: [], //筛选后的数据，用于绑定
      dialogChoseSchoolVisible: false, //控制显示选择学校的弹出层
      dialogResetPwdVisible: false, //控制显示设置首次密码的弹出层
      dialogBindWxVisible: false,
      filterText: "" /*学校过多时搜索*/,
      choseSchoolloading: false, //选择学校加载
      loading: false, //登录按钮加载
      userId: "", //当前的userId，如果是需要首次修改密码时，需要userId参数
      rulePwdForm: {
        currentPwd: "",
        pass: "",
        checkPass: "",
      },
      pwdRules: {
        currentPwd: [{ validator: validateNowPass, trigger: "blur" }],
        pass: [{ validator: validateNewPass, trigger: "blur" }],
        checkPass: [{ validator: validateNewPass2, trigger: "blur" }],
      },
      wxLoginForm: {
        mobile: "",
        code: "",
      },
      wxLoginFormRule: {
        mobile: [{ validator: checkMobile, trigger: "blur" }],
        code: [{ validator: checkCode, trigger: "blur" }],
      },
      codeFlag: false,
      timeMax: 60, //获取验证码计时
      codeBtnTxt: "获取验证码",
      timer: null, //计时器
      webNetWork: "",
      clickIndex: 0,
      onlyUrlColumn: [],
      recordcode: "",
    };
  },
  created() {
    this.wxcode = this.$route.query.code;
    if (this.wxcode) {
      //如果是微信登录
      loginForWX(this.wxcode, "WXLOGINWEB_" + this.id)
        .then((res) => {
          let data = res.data;
          if (data.code == 1060) {
            //是不是首次绑定微信帐号
            this.dialogBindWxVisible = true;
            this.wxToken =
              data.data.loginWxToken == null ? "" : data.data.loginWxToken;
          } else {
            this.loginPackge(data);
          }
        })
        .catch();
    }
  },
  mounted() {
    if (this.postRecodation) {
      this.recordcode = Number(this.postRecodation.match(/[0-9]\d{1,}/g));
    }
    if (window.location.href) {
      this.webNetWork = window.location.href;
    }
    getWXInitData()
      .then((res) => {
        let data = res.data.data;
        new WxLogin({
          id: "login-code",
          appid: data.appid,
          scope: "snsapi_login",
          redirect_uri: data.redirect_url,
          state: "WXLOGINWEB2_" + this.id,
          style: "black",
          href:
            "https://cdnfile-10043692.file.myqcloud.com/admin/css/web_wx_login.css",
        });
      })
      .catch();
    this.loadAllData();
    /**/
    var This = this;
    setTimeout(function () {
      var maxNum = This.columnListTwo.length + 1;
      var menuBar = document.querySelector(".menuBar");
      var menuLi = menuBar.querySelectorAll(".menu");
      var maxWidth = menuLi[0].offsetWidth * maxNum;
      var boxWidth = menuBar.offsetWidth;
      document.querySelector(".menuBar").style.width = maxWidth + "px";
      if (maxWidth - boxWidth > 0) {
        document.querySelector(".right-btn").style.display = "block";
      }
    }, 100);

    this.onlyUrlColumn = [];
    let columnListTwoData = this.columnListTwo;
    columnListTwoData
      .filter(
        (item) =>
          item.moduleList && item.moduleList.every((item) => item.type === 4)
      )
      .forEach((item) => {
        this.onlyUrlColumn.push(item.id);
      });
    this.onlyUrlColumn = this.onlyUrlColumn.toString();
  },
  watch: {
    filterText(val) {
      //过滤学校
      if (val == "") {
        //如果数据为空的话，则显示所有
        this.schoolList = this.schoolSourceList;
      } else {
        this.schoolList = this.schoolSourceList.filter(function (item) {
          return item.name.indexOf(val) >= 0;
        });
      }
    },
  },
  computed: {
    ...mapGetters([
      "photoJsonTwo",
      "shufflingTimeTwo",
      "address", //通讯地址
      "copyRight",
      "description",
      "domainName",
      "id",
      "keyWord",
      "logoUrl",
      "oldDomainName",
      "recodation", //备案号
      "postRecodation", //公安备案号
      "isInstitute",
      "institution",
      "schoolId",
      "webName",
      //列表数据
      "columnListTwo",
    ]),
  },
  methods: {
    goTop() {
      var currentScroll =
        document.documentElement.scrollTop || document.body.scrollTop;
      if (currentScroll > 0) {
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    },
    leftSlider() {
      let maxNum = this.columnListTwo.length + 1;
      let oneWidth = document
        .querySelector(".menuBar")
        .querySelectorAll(".menu")[0].offsetWidth;
      document.querySelector(".right-btn").style.display = "block";
      if (this.clickIndex <= 1) {
        this.clickIndex = 1;
        document.querySelector(".left-btn").style.display = "none";
      }
      this.clickIndex--;
      document.querySelector(".menuBar").style.marginLeft =
        -this.clickIndex * oneWidth + "px";
    },
    rightSlider() {
      let maxNum = this.columnListTwo.length + 1;
      let oneWidth = document
        .querySelector(".menuBar")
        .querySelectorAll(".menu")[0].offsetWidth;
      this.clickIndex++;
      document.querySelector(".left-btn").style.display = "block";
      if (this.clickIndex >= maxNum - 10) {
        this.clickIndex = maxNum - 10;
        document.querySelector(".right-btn").style.display = "none";
      }
      document.querySelector(".menuBar").style.marginLeft =
        -this.clickIndex * oneWidth + "px";
    },
    handleLogin() {
      /*账号登录*/
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          this.wxToken = ""; //将wxtoken置为空，防止触发微信扫码逻辑
          login({
            account: this.loginForm.account,
            password: encrypt(this.loginForm.password),
          })
            .then((res) => {
              let data = res.data;
              this.loginPackge(data);
            })
            .catch((err) => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },
    loginPackge(data) {
      //登录处理
      if (data.code == 1055) {
        //如果存在多学校
        //选择学校
        this.wxToken =
          data.data.loginWxToken == null ? "" : data.data.loginWxToken;
        this.schoolSourceList = this.packageShoolList(data.data.loginSchoolIds);
        this.schoolList = this.schoolSourceList;
        this.dialogChoseSchoolVisible = true;
      } else {
        //如果是一个学校
        if (data.code == 1052) {
          //如果是首次密码登录
          //重置密码
          this.dialogResetPwdVisible = true;
        }
        if (data.code == 200) {
          //如果是登录成功
          this.loginSuccess(data.data);
        }
      }
      this.userId = data.data.loginUserId;
    },
    loginForChosedSchooldFunc() {
      this.choseSchoolloading = true;
      /*多学校登录*/
      let choedSchool = this.schoolList.filter(function (item) {
        return item.checked == true;
      });
      if (choedSchool.length > 0) {
        if (this.wxToken == "") {
          //如果是帐号登录
          loginForChosedSchoold({
            account: this.loginForm.account,
            password: encrypt(this.loginForm.password),
            schoolId: choedSchool[0].id,
          })
            .then((res) => {
              let data = res.data;
              if (data.code == 1052) {
                //如果首次密码登录
                //重置密码
                this.dialogResetPwdVisible = true;
                this.userId = data.data.loginUserId;
              }
              if (data.code == 200) {
                //如果是登录成功
                this.loginSuccess(data.data);
              }
            })
            .catch();
        } else {
          //如果是微信扫码
          loginWx(choedSchool[0].id, this.wxToken)
            .then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.loginSuccess(data.data);
              } else {
                this.$message({
                  message: data.msg,
                  type: "error",
                });
              }
            })
            .catch();
        }
      }
    },
    loginSuccess(data) {
      const token = data.token;
      this.loading = false;
      this.dialogChoseSchoolVisible = false;
      window.location.href =window.location.href ='https://www.zhxiaoyuan.cn/app/#/main/homePage/index?token='+token
    },
    bindWx() {
      this.$refs.wxLoginFormRuleForm.validate((valid) => {
        if (valid) {
          wxBind(
            this.wxLoginForm.code.trim(),
            this.wxLoginForm.mobile.trim(),
            this.wxToken
          )
            .then((res) => {
              let data = res.data;

              if (data.code == 200 || data.code == 1055) {
                this.loginPackge(data);
              } else {
                this.$message({
                  message: data.msg,
                  type: "error",
                });
              }
            })
            .catch();
        }
      });
    },
    getCodeFunc() {
      this.$refs.wxLoginFormRuleForm.validateField("mobile", (valid) => {
        if (valid == "") {
          this.codeFlag = true;
          this.setTimeBtn();
          getCode(this.wxLoginForm.mobile.trim())
            .then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.$message({
                  message: "验证码已发送成功，请在微信上查看！",
                  type: "success",
                });
              } else {
                this.$message({
                  message: data.msg,
                  type: "error",
                });
              }
            })
            .catch();
        }
      });
    },
    setTimeBtn() {
      let _this = this;
      this.timer = setInterval(function () {
        _this.timeMax--;
        if (_this.timeMax == 0) {
          _this.codeFlag = false;
          _this.timeMax = 60;
          _this.codeBtnTxt = "获取验证码";
          window.clearInterval(_this.timer);
        } else {
          _this.codeBtnTxt = "重新获取(" + _this.timeMax + ")";
        }
      }, 1000);
    },
    resetPass() {
      /*重置密码*/
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          modifyPassword(
            encrypt(this.rulePwdForm.pass),
            encrypt(this.rulePwdForm.currentPwd),
            this.userId
          )
            .then((res) => {
              let data = res.data;
              if (data.code == 200) {
                this.$message({
                  message: "修改成功,请重新登录！",
                  type: "success",
                  duration: 3000,
                  onClose: function () {
                    location.reload();
                  },
                });
              } else {
                this.$message({
                  message: data.msg,
                  type: "error",
                });
              }
            })
            .catch((err) => {});
        }
      });
    },
    packageShoolList(data) {
      //处理返回的多学校数据，主要添加checked属性，用于标记是否被选中
      let schoolArray = new Array();
      if (data) {
        for (let i = 0; i < data.length; i++) {
          if (i == 0) {
            schoolArray.push({
              id: data[i].id,
              name: data[i].name,
              squareLogoUrl: data[i].squareLogoUrl,
              checked: true,
            });
          } else {
            schoolArray.push({
              id: data[i].id,
              name: data[i].name,
              squareLogoUrl: data[i].squareLogoUrl,
              checked: false,
            });
          }
        }
      }
      return schoolArray;
    },
    chosedSchool(checkedData) {
      let chosedAfterArray = new Array();
      this.schoolList.forEach(function (item) {
        if (checkedData.id == item.id) {
          chosedAfterArray.push({
            id: item.id,
            name: item.name,
            squareLogoUrl: item.squareLogoUrl,
            checked: true,
          });
        } else {
          chosedAfterArray.push({
            id: item.id,
            name: item.name,
            squareLogoUrl: item.squareLogoUrl,
            checked: false,
          });
        }
      });
      this.schoolList = chosedAfterArray;
    },
    dialogResetPwdClose() {
      this.choseSchoolloading = false;
    },
    dialogChoseSchoolClose() {
      this.loading = false;
    },
    boxShow() {
      this.erweiBox = true;
    },
    boxHide() {
      this.erweiBox = false;
    },
    /*type=2*/
    jumpTo(url, data) {
      if (data.navShow == true) {
        data.navShow = false;
      }
      if (this.onlyUrlColumn.indexOf(data.id) !== -1) {
      } else {
        this.$router.push({
          path: url,
          query: { id: data.id, firstColumn: data.firstColumn },
        });
      }
    },
    /*二级栏目跳转*/
    subjumpTo(url, parquery, query) {
      if (parquery.navShow == true) {
        parquery.navShow = false;
      }
      this.$router.push({
        path: url,
        query: {
          parentid: parquery.id,
          id: query.id,
          secondColumn: query.secondColumn,
          type: query.type,
        },
      });
    },
    /*控制显示隐藏*/
    mouseoverShow(item) {
      if (item.navShow == false) {
        item.navShow = true;
      }
      //item.navShow=!item.navShow
    },
    mouseoutHide(item) {
      if (item.navShow == true) {
        item.navShow = false;
      }
    },
    /*------汇总-------*/
    loadAllData() {
      /*导航栏*/

      /*查询访问量*/
      this.getAccessNumberFunc();
    },
    /*查询访问量*/
    getAccessNumberFunc() {
      getAccessNumber({
        webId: this.id,
      }).then((res) => {
        this.accessNumberList = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import "../../styles/mixin.scss";
#main {
  width: 100%;
  min-width: 1200px;
  min-height: 100%;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #fff;
  padding-bottom: 146px;
  position: relative;
}
/**/
.goTop {
  position: fixed;
  right: 20px;
  z-index: 99;
  width: auto;
  bottom: 10%;
  width: 42px;
  height: 42px;
  transition: 0.3s linear;
  overflow: hidden;
  & > div {
    width: 42px;
    height: 42px;
    text-align: center;
    background: rgba(0, 0, 0, 0.2);
    position: relative;
    cursor: pointer;
    i {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 30px;
      height: 30px;
      margin: -15px 0 0 -15px;
      font-size: 30px;
      //color:#006442;
      cursor: pointer;
    }
  }
  .hoverA {
    display: none;
    //background:#006442;
    color: #fff;
    span {
      display: block;
      width: 40px;
    }
  }
}
.goTop:hover {
  transition: 0.3s linear;
  .defaultA {
    display: none;
  }
  .hoverA {
    display: block;
  }
}
/*header*/
.header-container {
  width: 1200px;
  min-width: 1200px;
  height: 54px;
  position: relative;
  z-index: 12;
  background: #fff;
  margin: 0 auto;
  .header {
    width: 100%;
    height: 54px;
    padding: 0 20px;
    box-sizing: border-box;
    position: relative;
    background-repeat: no-repeat;
    background-position: right top;
    position: relative;
    @include clearfix;
    .logo {
      float: left;
      max-width: 440px;
      height: 54px;
      overflow: hidden;
      padding: 2px 0;
      box-sizing: border-box;
      cursor: pointer;
      position: relative;
      & > img {
        display: block;
        max-width: 100%;
        height: 54px;
      }
    }
    .login-wrap {
      float: right;
      padding-top: 4px;
      @include clearfix;
      position: relative;
      & > span,
      & > div {
        display: inline-block;
      }
      .icon-hint {
        float: left;
        // background: url(https://cdnfile-10043692.file.myqcloud.com/web/images/login_green.png) center center no-repeat;
        background-size: 100% 90%;
        width: 50px;
        height: 42px;
        margin-top: 2px;
      }
      .icon-qrcode {
        float: left;
        cursor: pointer;
        background: url(https://cdnfile-10043692.file.myqcloud.com/web/images/template2/ewm-icon.jpg)
          center center no-repeat;
        background-size: 100% 100%;
        width: 40px;
        height: 40px;
        margin: 3px 10px 0;
      }
      .form-box {
        height: 43px;
        box-sizing: border-box;
        .el-form-item__error {
          padding-top: 0;
        }
      }
      .input {
        float: left;
        border: 1px solid #d8d8d8;
        border-radius: 5px;
        padding: 2px 6px 0;
        height: 36px;
        margin-top: 3px;
        line-height: 34px;
        box-sizing: border-box;
        margin-right: 10px;
        position: relative;
        @include clearfix;
        margin-bottom: 0;
      }
      .input__icon {
        display: block;
        float: left;
        width: 30px;
        height: 30px;
      }
      .input--username .input__icon {
        background: url(https://cdnfile-10043692.file.myqcloud.com/web/images/user.png)
          center center no-repeat;
        background-size: 76% 76%;
      }
      .input--password .input__icon {
        background: url(https://cdnfile-10043692.file.myqcloud.com/web/images/password.png)
          center center no-repeat;
        background-size: 72% 70%;
      }
      .input .el-input {
        float: left;
        width: 130px;
        height: 30px;
      }
      .input .el-input__inner {
        display: block;
        width: 130px;
        height: 30px;
        font-size: 14px;
        outline: none;
      }
      .input .el-input__inner {
        border: 0;
      }
      .login-btn-box {
        float: left;
        height: 36px;
        line-height: 36px;
      }
      .el-form-item__content {
        line-height: 36px;
      }
      .login-btn {
        height: 34px;
        line-height: 34px;
        color: #fff;
        //background-color: #128B64;
        border: 0;
        padding: 0 10px;
        border-radius: 5px;
        width: auto;
        text-align: center;
        cursor: pointer;
        margin-top: 2px;
      }
    }
  }
}
/*二维码弹出的图片*/
.qrcode-outer-container {
  //background-color:#128B64;
  position: absolute;
  width: 200px;
  top: 50px;
  height: 226px;
  left: -28px;
  padding: 10px 10px;
  z-index: 20;
}
.qrcode-arrow {
  position: absolute;
  width: 30px;
  height: 20px;
  //border-bottom: 20px solid #128B64;
  border-left: 20px solid transparent;
  border-right: 20px solid transparent;
  top: -17px;
  left: 89px;
}
.qrcode-container {
  width: 100%;
  height: 100%;
  .wrp_code {
    width: 180px;
    height: 180px;
    overflow: hidden;
    img {
      display: block;
      width: 100%;
      height: 100%;
    }
  }
  .info {
    width: 100%;
    height: 30px;
    line-height: 30px;
    text-align: center;
    color: #fff;
  }
}
/*轮播*/
.lunbo-container {
  width: 100%;
  min-width: 1200px;
  height: 260px;
  position: relative;
}
.lunbo-box {
  width: 1200px;
  height: 260px;
  margin: 0 auto;
  position: relative;
  .el-carousel {
    width: 100%;
  }
  .photo-item {
    width: 100%;
    height: 260px;
    overflow: hidden;
    position: relative;
    background: no-repeat center center;
    background-size: 100% 100%;
    & > img {
      max-width: 100%;
      width: 100%;
      height: 100%;
      display: block;
    }
    .title {
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 36px;
      line-height: 36px;
      text-indent: 1em;
      color: #fff;
      //background:url("../../assets/images/index/bar_bg.png");
    }
  }
}
/*nav*/
.nav-container {
  //width:100%;
  width: 1200px;
  min-width: 1200px;
  height: 45px;
  position: relative;
  z-index: 10;
  //border-bottom:4px solid #f97e07;
  box-sizing: border-box;
  margin: 0 auto;
  //background:url("https://cdnfile-10043692.file.myqcloud.com/web/images/template2/nav_bg.png") repeat-x;
  .addmaskhoverleft {
    position: absolute;
    left: 50%;
    width: 3000px;
    margin-left: -3600px;
    height: 41px;
    //background:url("https://cdnfile-10043692.file.myqcloud.com/web/images/template2/nav_bg.png") repeat-x;
    background: #fff;
    z-index: 2;
  }
  .addmaskhover {
    position: absolute;
    left: 50%;
    width: 3000px;
    margin-left: 600px;
    height: 41px;
    //background:url("https://cdnfile-10043692.file.myqcloud.com/web/images/template2/nav_bg.png") repeat-x;
    background: #fff;
    z-index: 2;
  }
  .menu-info {
    width: 1200px;
    height: 41px;
    margin: 0 auto;
    position: relative;
    box-sizing: border-box;
    .nemu-box {
      width: 1200px;
      height: 41px;
    }
  }
}
.menu-info .left-btn {
  position: absolute;
  left: -31px;
  top: 12px;
  z-index: 3;
  display: none;
  font-size: 17px;
  margin-left: 16px;
  cursor: pointer;
  //color:#91b590;
}
.menu-info .right-btn {
  position: absolute;
  right: -14px;
  top: 12px;
  z-index: 3;
  display: none;
  font-size: 17px;
  margin-left: 16px;
  cursor: pointer;
  //color:#91b590;
}
.menuBar {
  width: auto;
  height: 41px;
  @include clearfix;
  .menu {
    float: left;
    width: 120px;
    height: 41px;
    line-height: 41px;
    position: relative;
    text-align: center;
    & > a {
      display: block;
      width: 100%;
      height: 100%;
      // color:#91b590;
      font-size: 15px;
      font-weight: bold;
    }
    & > .line-tag {
      display: block;
      position: absolute;
      left: 0px;
      top: 10px;
      width: 2px;
      height: 22px;
      // background:#91b590;
    }

    .ulSubMenu {
      position: absolute;
      top: 41px;
      left: 0;
      width: 120px;
      z-index: 10;
      //background:url("../assets/images/index/submenu_bg.png");
      // background:#4c8586;
      .liSubMenu {
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: left;
        box-sizing: border-box;
        & > a {
          display: block;
          height: 40px;
          line-height: 40px;
          width: 100%;
          padding-left: 10px;
          box-sizing: border-box;
          //border-bottom: 1px solid #CCCCCC;
          color: #f3f1e3;
          font-size: 13px;
        }
        & > a:hover {
          //background:#155f60;
          //color:#f97e07;
        }
      }
    }
    & > a:hover,
    & > a.hover {
      //color:#f97e07;
    }
  }
}
/**/
.view-content {
  width: 100%;
  min-height: 300px;
}
/*footer*/
.footer-container {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 100%;
  min-width: 1200px;
  height: 146px;
  box-sizing: border-box;
  // background-color: #808080;
  // background:url(https://cdnfile-10043692.file.myqcloud.com/web/images/template2/footer-bg.png) repeat-x;
  color: white;
  .footer-wrap {
    width: 1200px;
    height: 146px;
    padding: 18px 0 0;
    font-size: 14px;
    margin: 0 auto;
    box-sizing: border-box;
    text-align: center;
    & > p {
      line-height: 26px;
      padding-top: 10px;
      & > span {
        margin-left: 10px;
        margin-right: 10px;
      }
      & a {
        margin-left: 10px;
        margin-right: 10px;
        color: #fff;
      }
      & a:hover {
        text-decoration: underline;
      }
      .police-ico {
        display: inline-block;
        width: 20px;
        height: 20px;
        margin-right: 6px;
        margin-top: -3px;
      }
    }
  }
}
/*选择学校*/
.school-box-center {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}
.school-box {
  max-height: 450px;
}
.school-item {
  width: 140px;
  height: 140px;
  float: left;
  text-align: center;
  cursor: pointer;
  margin-left: 10px;
  margin-bottom: 10px;
  border-radius: 4px;
  border: 2px solid #fff;
}
.school-logo {
  width: 100px;
  height: 100px;
  margin: 4px auto;
  background-position: center center;
  background-size: cover;
}
.clear {
  clear: both;
}
.school-chosed {
  border: 2px solid #20a0ff;
}
.school-name {
  height: 30px;
  line-height: 30px;
}
.el-icon-close {
  font-size: 24px;
  font-weight: bold;
  color: #bfcbd9;
}
</style>
<style lang="scss">
.lunbo-container .el-carousel__indicators {
  position: absolute;
  list-style: none;
  bottom: 10px;
  right: 0;
  margin: 0;
  width: 100%;
  text-align: right;
  padding-right: 24px;
  z-index: 4;
  text-align: center;
  box-sizing: border-box;
  display: none;
}
.lunbo-container .el-carousel__arrow {
  width: 50px;
  height: 50px;
}
.lunbo-container .el-carousel__arrow--left {
  left: 40px;
}
.lunbo-container .el-carousel__arrow--right {
  right: 40px;
}
.lunbo-container .el-carousel__arrow i {
  font-size: 20px;
}
.headerTwo .el-input__inner {
  display: block;
  width: 130px;
  height: 30px;
  font-size: 14px;
  outline: none;
}
.headerTwo {
  .form-box {
    .el-form-item__error {
      padding-top: 0;
    }
  }
}
</style>