<template>
    <div class="login-container main-login" id="mainLogin">
        <el-dialog title="选择学校" :visible.sync="isShowChooseSchool" :close-on-press-escape="false"
                   :close-on-click-modal="false" :modal-append-to-body="false">
            <div class="school-box el-table__body-wrapper" :class="{ 'school-box-center': schoolList.length < 5 }">
                <div class="school-item" :class="{ 'school-chosed': item.checked }" :key="item.schoolId"
                     v-for="item in schoolList" @click="chooseSchool(item)">
                    <div class="school-logo" :style="{ backgroundImage: 'url(' + item.squareLogoUrl + ')' }"></div>
                    <div class="school-name">{{ item.name }}</div>
                </div>
                <div class="clear"></div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="isShowChooseSchool = false">取 消</el-button>
                <el-button type="primary" @click="chooseSchoolConfirm">进 入</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        wxLoginLogin,
        wxLoginChooseSchool
    } from '@/api/login'
    export default {
        name: "qrcodeLogin",
        data() {
            return {
                isShowChooseSchool: false,
                schoolList: [],
                filterText: '',
                appId: this.$route.query.appId,
                openId: this.$route.query.openId
            }
        },
        created() {
            wxLoginChooseSchool({
                appId: this.appId,
                openId: this.openId
            })
                .then(res => res.data)
                .then(data => {
                    if(data.result) {
                        data.data.forEach(item => {
                            item.checked = false;
                        });
                        if(data.data.length === 0) {
                            this.$message.error('暂无学校');
                        } else if(data.data.length === 1) {
                            this.loginFunc(data.data[0]);
                        } else {
                            this.schoolList = data.data;
                        }
                    } else {
                        this.$message.error(data.msg);
                    }

                })
        },
        methods: {
            chooseSchool(schoolItem) {
                let chosedAfterArray = [];
                this.schoolList.forEach(function(item) {
                    chosedAfterArray.push({
                        schoolId: item.schoolId,
                        name: item.name,
                        squareLogoUrl: item.squareLogoUrl,
                        checked: schoolItem.schoolId === item.schoolId
                    })
                });
                this.schoolList = chosedAfterArray;
            },
            chooseSchoolConfirm() {
                const obj = this.schoolList.find(item => item.checked);
                if(obj) {
                    this.loginFunc(obj);
                } else {
                    this.$message.error('请选择学校！');
                }
            },
            loginFunc(schoolItem) {
                wxLoginLogin({
                    appId: this.appId,
                    openId: this.openId,
                    schoolId: schoolItem.schoolId
                })
                    .then(res => res.data)
                    .then(data => {
                        if(data.result) {
                            window.location.replace(data.data);
                        } else {
                            this.$message.error(data.msg);
                        }
                    });
            }
        }
    }
</script>

<style lang="scss">
    @import '../../../src/styles/mixin.scss';
    #mainLogin {
        .tips {
            font-size: 14px;
            color: #fff;
            margin-bottom: 5px;
        }

        &.login-container {
            @include relative;
            height: 100vh;
            background-position: center center;
            background-size: cover;
            .login-form input:-webkit-autofill {
                -webkit-box-shadow: 0 0 0 1000px #fff inset !important;
                -webkit-text-fill-color: #304e72 !important;
            }
            .login-form input {
                border: 0;
                -webkit-appearance: none;
                border-radius: 0;
                padding: 12px 5px 12px 15px;
                color: #304e72;
                height: 47px;
            }
            .login-form .el-input {
                display: inline-block;
                height: 47px;
                width: 85%;
            }
            .svg-container {
                height: 40px;
                padding: 6px 5px 6px 15px;
                color: #889aa4;
            }
            .svg-container i {
                font-size: 24px;
            }

            .title {
                font-size: 26px;
                color: #eeeeee;
                margin: 0 auto 40px auto;
                text-align: center;
                font-weight: bold;
            }

            .login-form {
                width: 100%;
                padding: 35px 35px 15px 35px;
                margin: 40px auto;
            }

            .login-form .el-form-item {
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(0, 0, 0, 0.1);
                border-radius: 5px;
                color: #454545;
            }
            .login-form .white-back.el-form-item {
                border: 1px solid rgba(255, 255, 255, 0.1);
                background: #fff;
                border-radius: 5px;
                color: #454545;
            }

            .forget-pwd {
                color: #fff;
            }
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

            .login-box {
                width: 470px;
                height: 520px;
                background-color: #f6d76d;
                border-radius: 8px;
                position: absolute;
                right: 10%;
                top: 20%;
                box-shadow: 2px 2px 15px #333333;
                z-index:2000;
                .qywx-link {
                    position: absolute;
                    bottom: 29px;
                    right: 39px;
                    color: #337ab7;
                    img {
                        width: 16px;
                        vertical-align: middle;
                        display: inline-block;
                    }
                    .qywx-link__text {
                        margin: 0;
                        display: inline-block;
                        vertical-align: middle;
                    }
                }
            }

            .login-tabs {
                width: 100%;
                height: 100px;
            }

            .login-tab {
                position: relative;
                width: 50%;
                float: left;
                height: 100px;
            }

            .login-tab-link {
                position: absolute;
                bottom: 0;
                margin: 0 auto;
                left: 30%;
                font-size: 18px;
                height: 40px;
                border-bottom: 1px solid #f6d76d;
                color: #304e72;
                letter-spacing: 5px;
                font-weight: initial;
                cursor: pointer;
            }

            .login-tab-linked {
                border-bottom: 1px solid #304e72;
            }

            .login-main {
                height: 400px;
            }

            .login-main .el-button--primary {
                color: #fff;
                background-color: #304e72;
                border-color: #304e72;
                height: 40px;
                width: 350px;
            }

            .slogan-box {
                width: 666px;
                height: 175px;
                background-position: center center;
                background-size: cover;
                position: absolute;
                top: 30%;
                left: 4%;
            }

            .login-code {
                width: 100%;
                height: 100%;
                text-align: center;
                padding-top: 20px;
            }
            .wrap-footer {
                color: #fff;
                position: absolute;
                text-align: center;
                width: 100%;
                bottom: 10%;
            }
        }
    }

    // 2020-07-31 优化 1366 * 768 登录页大小
    // 2020-12-10 优化 width: 1500px 登录页大小
    @media screen and (max-width: 1500px) {
        #mainLogin {
            &.login-container {
                .slogan-box {
                    transform: scale(0.7);
                }
                .login-box {
                    transform: scale(0.7);
                    top: 0;
                }
            }
        }
    }
</style>
