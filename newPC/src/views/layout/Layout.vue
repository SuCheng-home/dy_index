<template>
    <div class="app-wrapper">
        <div>
            <div class="navbar-box" v-show="isShowTop">
                <div class="school-log">
                    <img :src="schoolInfo.squareLogoUrl"/>
                </div>
                <div class="navbar-munu">
                    <ul class="nav-item-container">
                        <template v-for="navItem in navbarList">
                            <template v-if="navItem.isExternal">
                                <li
                                    v-if="!navItem.moduleKey || isShowByPermissionList(modulePermissionList[navItem.moduleKey])"
                                    class="nav-item" @click="navbarClickHandler">
                                    <a class="nav-item__link" :href="navItem.path" target="_blank">
                                        {{navItem.name}}

                                    </a>
                                </li>
                            </template>
                            <template v-else>
                                <li
                                    v-if="!navItem.moduleKey || isShowByPermissionList(modulePermissionList[navItem.moduleKey])"
                                    class="nav-item" @click="navbarClickHandler">
                                    <router-link class="nav-item__link" :to="navItem.path">
                                        {{navItem.name}}

                                    </router-link>
                                </li>
                            </template>
                        </template>


                    </ul>
                </div>
                <div class="index-my">
                    <span class="link" @click="toOldVersion()">返回旧版</span>
                    <el-dropdown class="avatar-container" trigger="click">
                        <div class="avatar-wrapper">
                            <img
                                class="user-avatar"
                                style="vertical-align: middle"
                                :src="userInfo.avatar"
                            />
                            <div
                                class="name-container"
                                style="
                  display: inline-block;
                  vertical-align: middle;
                  color: #fff;
                  font-size: 18px;
                "
                            >
                                {{ userInfo.name }}
                            </div>
                            <i class="el-icon-caret-bottom"></i>
                        </div>
                        <el-dropdown-menu class="user-dropdown" slot="dropdown">
                            <el-dropdown-item divided>
                                <div
                                    @click="jumpToPage('/main/homeSchool/personalInfoIndex')"
                                    style="display: block"
                                >个人信息
                                </div>
                            </el-dropdown-item>
                            <el-dropdown-item v-if="canSwitch" divided>
                                <span  style="display: block" @click="dialogChoseSchoolVisible=true">切换学校</span>
                            </el-dropdown-item>
                            <el-dropdown-item divided>
                                <span @click="logout" style="display: block">退出登录</span>
                            </el-dropdown-item>
                        </el-dropdown-menu>
                    </el-dropdown>
                </div>
            </div>
        </div>
        <router-view></router-view>
        <el-dialog title="选择学校" :visible.sync="dialogChoseSchoolVisible" :close-on-press-escape="false" :close-on-click-modal="false" :modal-append-to-body="false" @close="dialogChoseSchoolVisible=false">
			<div class="school-box el-table__body-wrapper" :class="{ 'school-box-center': schoolList.length < 5 }">
				<div class="school-item" :class="{ 'school-chosed': schoolId==item.id }" :key="item.id" v-for="item in schoolList" @click="schoolId=item.id">
					<div class="school-logo" :style="{ backgroundImage: 'url(' + item.squareLogoUrl + ')' }"></div>
					<div class="school-name">{{ item.name }}</div>
				</div>
				<div class="clear"></div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogChoseSchoolVisible = false">取 消</el-button>
				<el-button type="primary" @click="switchSchoollogin">进 入</el-button>
			</div>
		</el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from "vuex";
    import moduleList from "@/router/moduleList";
    import {isShowByPermissionList} from "@/utils";
    import {ability,switchSchoollist,switchSchoollogin} from '@/api/login'
    export default {
        name: "layout",
        data() {
            return {
                pcLoginType: "",
                dialogChoseSchoolVisible:false,
                navbarList: [{
                    moduleKey: 'homeSchool',
                    name: '家校互动',
                    path: '/main/homeSchool'
                }, {
                    moduleKey: 'teachingStudy',
                    name: '教学教务',
                    path: '/main/teachingStudy'
                }, {
                    moduleKey: 'schoolManage',
                    name: '校园办公',
                    path: '/main/schoolManage'
                }, {
                    moduleKey: 'generalLogistics',
                    name: '总务后勤',
                    path: '/main/generalLogistics'
                }, {
                    moduleKey: 'stuEvaluate',
                    name: '学生评价',
                    path: '/main/stuEvaluate'
                }, {
                    moduleKey: 'sysManage',
                    name: '系统管理',
                    path: '/main/sysManage'
                }],
                modulePermissionList: {},
                canSwitch:false,
                schoolList:[],
                schoolId:''
            };
        },
        computed: {
            ...mapGetters(["userInfo", "schoolInfo", "permission", "isStandalone", "token"]),
            isShowTop() {
                const hideRouteList = ['/activity/interactUserListActSignShow'];
                return hideRouteList.every(url => !location.href.includes(url)) && !this.isStandalone;
            }
        },
        created() {
            setTimeout(() => {
               ability().then(res => {
                this.canSwitch=res.data.data.canSwitch
                if(this.canSwitch){
                    this.switchSchoollist()
                }
			}).catch()
            }, 3000)
        //    
            if(!sessionStorage.getItem('pcModuleCode')) {
                this.navbarList.unshift({
                    name: '首页',
                    path: this.schoolInfo.id === 7439 || ((process.env.ENV_TAREGT !== 'production')&&(this.schoolInfo.id === 613))
                        ? '/main/homePage/danyangHome'
                        : '/main/homePage/index'
                })
            }
            if(location.href.includes('www.weixiaojia.net/app')) {
                this.navbarList.push({
                    isExternal: true,
                    name: '测试',
                    path: `https://www.weixiaojia.net/mobile/#/demo/test?token=${this.token}`
                });
            }

            this.pcLoginType = window.sessionStorage.getItem("pc_login_type");
            const modulePermissionList = {};
            this.modulePermissionList = Object.keys(moduleList.normal).forEach((key) => {
                modulePermissionList[key] = moduleList.normal[key].map(item => item.permissionPath);
            });
            this.modulePermissionList = modulePermissionList;
        },
        mounted() {
            if (sessionStorage.isFirstLoad === "1") {
                this.$nextTick(function () {
                    if (document.querySelector(".nav-item__link")) {
                        this.$router.replace(
                            document.querySelector(".nav-item__link").href.split("#")[1]
                        );
                        sessionStorage.isFirstLoad2 = "1";
                        setTimeout(() => {
                            if (document.querySelector(".side-item")) {
                                this.$router.replace(
                                    document.querySelector(".side-item").href.split("#")[1]
                                );
                                sessionStorage.isFirstLoad2 = "0";
                            }
                        }, 200);
                        sessionStorage.isFirstLoad = "0";
                    }
                });
            }
        },
        methods: {
            switchSchoollogin(){
                if(this.schoolId==this.schoolInfo.id){
                     this.$message({
                                type: 'warning',
                                message:'请选择非当前学校的学校切换'
                              });
                    return;
                }
                switchSchoollogin(this.schoolId).then(res => {
                   let data=res.data.data;
                  this.$store.dispatch('SetLoginInfo', data)
				.then(() => {
					this.dialogChoseSchoolVisible = false
					this.$router.push('/main/homePage/index')
                    window.location.reload();
				})
				.catch(() => {
					this.dialogChoseSchoolVisible = false
				})
			   }).catch()
            },
            switchSchoollist(){
                this.schoolList=[]
                switchSchoollist().then(res => {
                    // this.schoolId=res.data.data.currentSchool.id
                    let data=res.data.data.schoolList;
                    this.schoolList=data;
                    // for(let i=0;data.length;i++){
                    //     if(data[i].id!=this.schoolInfo.id){
                    //          this.schoolList.push(data[i])
                    //     }
                    // }
                    this.schoolId=this.schoolList[0].id
			   }).catch()
            },
            isShowByPermissionList,
            toOldVersion() {
                const url = `${global.command === 'production' ? 'http://www.weixiaojia.cn' : 'http://www.weixiaojia.net'}/wxcepClient/doLogin/newFormworkToOld?userToken=${this.$store.getters.token}`;
                window.open(url, '_blank');
            },
            navbarClickHandler() {
                setTimeout(() => {
                    if (document.querySelector(".side-item")) {
                        this.$router.replace(
                            document.querySelector(".side-item").href.split("#")[1]
                        );
                    }
                }, 500);
            },
            logout() {
                this.$store.dispatch("LogOut").then((res) => {
                    console.log(res)
                    console.log('LogOut')
                    location.reload(); // 为了重新实例化vue-router对象 避免bug
                });
            },
            jumpToPage(path, query = {newPcid: "1"}) {
                this.$router.push({
                    path,
                    query,
                });
            },
        },
    };
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../styles/mixin.scss";
     .school-box-center {
			display: flex;
			justify-content: center;
			flex-wrap: wrap;
		}

		.school-box {
			max-height: 450px;
            overflow: auto
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
            overflow:hidden;text-overflow:ellipsis;white-space:nowrap;
		}
    .app-wrapper {
        @include clearfix;
        position: relative;
        height: 100%;
        width: 100%;

        &.hideSidebar {
            .sidebar-wrapper {
                transform: translate(-140px, 0);

                .sidebar-container {
                    transform: translate(132px, 0);
                }

                &:hover {
                    transform: translate(0, 0);

                    .sidebar-container {
                        transform: translate(0, 0);
                    }
                }
            }
        }

        .sidebar-wrapper {
            width: 170px;
            position: absolute;
            top: 70px;
            bottom: 0;
            left: 0;
            z-index: 1;
            float: left;
            overflow-x: hidden;
            transition: all 0.28s ease-out;
            @include scrollBar;
        }

        .sidebar-container {
            transition: all 0.28s ease-out;
        }
    }

    ul {
        padding: 0;
        margin: 0;
    }

    .nav-item-container {
        border-radius: 2px;
        list-style: none;
        position: relative;
        margin: 0;
        padding-left: 0;
    }

    .nav-item {
        color: #fff;
        list-style-type: none;
        float: left;
        height: 60px;
        line-height: 60px;
        margin: 0;
        cursor: pointer;
        position: relative;
        box-sizing: border-box;
        border-bottom: 5px solid transparent;
        transition: border-color 0.3s, background-color 0.3s, color 0.3s;
        white-space: nowrap;
        font-size: 16px;

        a {
            color: #fff !important;
            padding: 0 20px;
            display: block;

            &.router-link-active {
                color: #20a0ff!important;
            }

            &:hover {
                color: #20a0ff!important;
            }
        }
    }
    .index-my .link {
        color: #fff;
        margin-right: 10px;
        margin-top: 2px;
        font-size: 14px;
    }

    .el-menu--dark .el-menu-item {
        color: #fff;
    }

    .navbar {
        height: 50px;
        line-height: 50px;
        border-radius: 0 !important;

        .hamburger-container {
            line-height: 58px;
            height: 50px;
            float: left;
            padding: 0 10px;
        }

        .errLog-container {
            display: inline-block;
            position: absolute;
            right: 150px;
        }

        .name-container {
            display: inline-block;
            vertical-align: middle;
            color: #fff;
        }

        .avatar-container {
            padding: 24px 0 0 0;
            height: 50px;
            display: inline-block;
            position: absolute;
            right: 35px;

            .avatar-wrapper {
                cursor: pointer;
                margin-top: 5px;
                position: relative;

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                }

                .el-icon-caret-bottom {
                    position: absolute;
                    right: -20px;
                    top: 25px;
                    font-size: 12px;
                }
            }
        }
    }

    .navbar-box {
        background-color: #324157;
        height: 70px;
        z-index: 1;
        min-width: 1310px;
    }

    .school-log {
        float: left;
    }

    .school-log img {
        height: 40px;
        margin-left: 10px;
        margin-top: 15px;
    }

    .navbar-munu {
        min-width: 600px;
        float: left;
        padding-top: 0px;
        padding-left: 20px;
        font-size: 18px !important;
        margin-top: 5px;
    }

    .index-my {
        float: right;
        padding-right: 10px;
    }

    .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 20px;
    }

    .avatar-wrapper {
        padding-top: 15px;
        cursor: pointer;
        color: #bfcbd9;
    }

    .navbar-munu li {
        font-size: 16px;
    }

    .navbar-box {
        min-width: 1200px;
    }
</style>
