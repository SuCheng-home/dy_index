<template>
  <div class="campusCardLogin">
    <div class="logo-header">
        <img src="https://cdnfile-10043692.file.myqcloud.com/admin/images/campusCardLogin/wxcep-logo.png" />
        <span>校园卡</span>
    </div>
    <div class="login-form">
      <h1>用户登录</h1>
      <div class="login-input-container">
        <label class="icon icon--username" for="username"></label>
        <input v-model.trim="username" type="text"  placeholder="请输入孩子姓名" id="username" />
      </div>
      <div class="login-input-container">
        <label class="icon icon--username" for="phone"></label>
        <input v-model.trim="phone" type="text"  placeholder="请输入家长手机号" id="phone" />
      </div>
      <div class="two-btn-control">
        <div class="pass-input-container">
          <label class="icon icon--password" for="password"></label>
          <input v-model.trim="password" type="password" @keyup.enter="loginFunc"  placeholder="请输入微信收到的验证码" id="password" />
        </div>
        <input type="button" class="send-btn" id="sendCode" @click="sendCode" :disabled="codeDisabled" :class="{'send-btn-disabled':codeDisabled}" :value="codeMsg" >
      </div>
      <button class="login-form-submit" @click="loginFunc">登&nbsp;&nbsp;录</button>
    </div>
  </div>
</template>
<script>
import {card,validate} from '@/api/campusCard';
export default{
  data(){
    return{
      username:'',
      phone:'',
      password:'',
      userError:false,
      countdown:60,
      timer:null,
      codeMsg:'获取验证码',
      codeDisabled:false,//获取验证码的
      schoolId:this.$route.query.s,
      authToken:'',
      loginData:{}
    }
  },
  mounted(){
  },
  methods:{
    loginFunc(){
      if(this.username===''){
        this.$message.error('孩子姓名不为空!');
        return false;
      }
      if(this.phone===''){
        this.$message.error('手机号码不能为空!');
        return false;
      }
      if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone)){
        this.$message.error('手机号格式不正确!');
        return false;
      }
      if(this.password===''){
        this.$message.error('验证码不能为空!');
        return false;
      }
      //掉借口成功的时候回调一个函数
      validate({  
        authToken:this.authToken,
        mobile:this.phone,
        msgCode:this.password
      }).then(res=>{
        let data=res.data;
        if(data.code===200){
          this.loginData=data.data;
          clearInterval(this.timer);
          localStorage.setItem('s',this.schoolId);
          this.$router.replace({
            name:'campusList',
            params:this.loginData
          })
        }else{
          this.$message.error(data.msg);
        }
      })
    },
    sendCode(){
        if(this.username===''){
          this.$message.error('孩子姓名不为空!');
          return false;
        }
        if(this.phone===''){
          this.$message.error('手机号码不能为空!');
          return false;
        }
        if(!/^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/.test(this.phone)){
          this.$message.error('手机号格式不正确!');
          return false;
        }
        this.setTime();
        card({
          mobile:this.phone,
          schoolId:this.schoolId,
          stuName:this.username
        }).then(res=>{
          let data=res.data;
          if(data.code===200){
            this.authToken=data.data.authToken;
          }else{
            this.$message.error(data.msg);
          }
        })
        
        this.timer=setInterval(()=>{
          this.setTime();
        },1000);
    },
    setTime(){
      if(this.countdown>0 &&this.countdown<=60){
        this.countdown--;
        if(this.countdown!==0){
          this.codeDisabled=true;
          this.codeMsg="重新发送("+this.countdown+")";
        }else{
          clearInterval(this.timer);
          this.codeMsg="获取验证码";
          this.codeDisabled=false;
          this.countdown=60;
          this.timer=null;
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import "../../../src/styles/mixin.scss";
.campusCardLogin{
  position:absolute;
  left:0;
  right:0;
  top:0;
  bottom:0;
  width:100%;
  height:100%;
  background:url("https://cdnfile-10043692.file.myqcloud.com/admin/images/login-bg.jpg") left center no-repeat;
}

.logo-header{
  position: absolute;
  left:10%;
  top:10%;
  z-index:1;
  &>img{
    width:54px;
    height:54px;
    overflow: hidden;
    vertical-align: middle;
    display: inline-block;
  }
  &>span{
    margin-left: 16px;
    font-size: 30px;
    color: #fff;
    letter-spacing: 6px;
    vertical-align: middle;
    display: inline-block;
  }
}
.login-form{
  position: absolute;
  right: 16%;
  box-sizing: border-box;
  height: 386px;
  width: 420px;
  background: #B4E4F8;
  top: 46%;
  transform: translateY(-60%);
  border-radius: 10px;
  padding: 20px 30px;
  h1{
    font-size:24px;
    color:#0798b5;
    font-weight: 100;
    margin:0;
  }
  .login-input-container {
    border-radius: 10px;
    background-color: #fff;
    height: 50px;
    line-height: 50px;
    box-sizing: border-box;
    padding: 0 10px;
    margin: 30px 0;
    position: relative;
    input {
      box-sizing: border-box;
      padding: 5px;
      font-size: 16px;
      height: 80%;
      margin-left: 2%;
      width: 86%;
      vertical-align: middle;
      display: inline-block;  
      &::-webkit-input-placeholder {
          color: #aaa;
      }
      &::-moz-placeholder{   /* Mozilla Firefox 19+ */
          color: #aaa;
      }
      &::-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
          color: #aaa;
      }
      &::-ms-input-placeholder{  /* Internet Explorer 10-11 */
          color: #aaa;
      }
    }
    
    input {
        border: 0;
        outline: none;
    }
    .icon{
      width: 28px;
      height: 28px;  
      vertical-align: middle;
      display: inline-block; 
    }
    .icon--username {
      background: url("https://cdnfile-10043692.file.myqcloud.com/admin/images/campusCardLogin/username-icon.png") center center  no-repeat;
      background-size:28px 28px;
    }
  }
  .two-btn-control{
    width:360px;
    height: 50px;
    line-height: 50px;
    margin: 30px 0;
    position: relative;
    @include clearfix;
  }
  .pass-input-container{
    width:252px;
    float:left;
    background-color: #fff;
    height: 50px;
    line-height: 50px;
    padding: 0 10px;
    border-radius: 10px;
    input {
      box-sizing: border-box;
      padding: 5px;
      font-size: 16px;
      height: 80%;
      margin-left: 2%;
      width: 80%;
      vertical-align: middle;
      display: inline-block;  
      &::-webkit-input-placeholder {
          color: #aaa;
      }
      &::-moz-placeholder{   /* Mozilla Firefox 19+ */
          color: #aaa;
      }
      &::-moz-placeholder{    /* Mozilla Firefox 4 to 18 */
          color: #aaa;
      }
      &::-ms-input-placeholder{  /* Internet Explorer 10-11 */
          color: #aaa;
      }
    }
    
    input {
        border: 0;
        outline: none;
    }
    .icon{
      width: 28px;
      height: 28px;  
      vertical-align: middle;
      display: inline-block; 
    }
    .icon--password {
      background:url("https://cdnfile-10043692.file.myqcloud.com/admin/images/campusCardLogin/password-icon.png") center center no-repeat;
      background-size:28px 28px;
    }
  }
  .send-btn{
    display: block;
    float:right;
    width:100px;
    height:50px;
    line-height: 50px;
    border-radius: 10px;
    background:#fff;
    border:0;
    font-size:12px;
    color:#000;
    outline: none;
    cursor: pointer;
  }
  .send-btn-disabled{
    background:#ccc;
    color:#fff;
  }
  .login-form-submit {
    cursor: pointer;
    display: block;
    background-color: #0796B4;
    width: 92%;
    border: 0;
    height: 44px;
    line-height: 44px;
    color: #fff;
    font-size: 22px;
    border-radius: 10px;
    text-align: center;
    margin: 30px auto;
    outline: none;
  }
} 
.school-box{
  width:100%;
  @include clearfix;
}
.school-item{
  float:left;
  width:140px;
  height:140px;
  padding-top:10px;
  box-sizing: border-box;
  overflow: hidden;
  text-align: center;
  .school-logo{
    width:100px;
    height:100px;
    overflow: hidden;
    border-radius: 50%;
    border: 3px solid #aaa;
    margin:0 auto;
    img{
      display: block;
      width:100%;
      max-width: 100%;
    }
  }
  .school-name{
    height: 30px;
    line-height: 30px;
    font-size:14px;
  }
  

}
.school-chosed{
  border: 2px solid #20a0ff;
}
</style>
