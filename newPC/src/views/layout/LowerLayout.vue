<template>
    <div class="main-container">
        <div
            class="sidebar-wrapper"
            v-show="isShowSide"
            :style="isOnlySys ? 'top: 0;' : ''"
        >
            <div class="sidebar-container">
                <el-menu
                    style="border: 0"
                    mode="vertical"
                    :default-openeds="openedArray"
                    @select="onMenuSelect"
                >
                    <div v-if="navbarKeyList.indexOf(navbar) !== -1">
                        <ul class="side-item-container">
                            <template v-for="(moduleItem, moduleIndex) in moduleList[navbar]">
                                <template
                                    v-if="moduleItem.children && moduleItem.children.length !== 0"
                                >
                                    <el-submenu
                                        v-if="isShowSideitem(moduleItem)"
                                        :index="`${moduleItem.index}`"
                                        :key="`module-${moduleIndex}`"
                                    >
                                        <template slot="title">
                                            <i
                                                :class="['icon', 'side-item__icon', moduleItem.moduleIcon ? `module-icon--${moduleItem.moduleIcon}` : moduleItem.icon ? moduleItem.icon : '']"
                                            ></i>
                                            <div class="side-item__name">
                                                {{
                                                moduleItem.permissionPath && !moduleItem.fixedName
                                                ? permissionNameMapping[moduleItem.permissionPath]
                                                : moduleItem.name
                                                }}
                                            </div>
                                        </template>
                                        <template>
                                            <router-link
                                                exact
                                                @click.native="onMenuClick"
                                                v-if="isShowSideitem(subModuleItem)"
                                                :key="`module-${moduleIndex}-submodule-${subModuleIndex}`"
                                                v-for="(subModuleItem, subModuleIndex) in moduleItem.children"
                                                class="side-item side-item--sub"
                                                :to="subModuleItem.routePath"
                                            >
                                                <div class="side-item__name">
                                                    {{
                                                    subModuleItem.name
                                                    }}
                                                     <!-- {{
                                                subModuleItem.permissionPath && !subModuleItem.fixedName
                                                ? permissionNameMapping[subModuleItem.permissionPath]
                                                : subModuleItem.name
                                                }} -->
                                                </div>
                                            </router-link>
                                        </template>
                                    </el-submenu>
                                </template>
                                <template v-else>
                                    <el-menu v-if="isShowSideitem(moduleItem)">
                                        <router-link exact
                                                     @click.native="onMenuClick"
                                                     v-if="!moduleItem.isExternalLink"
                                                     class="side-item"
                                                     :to="moduleItem.routePath"
                                        >
                                            <i
                                                :class="['icon', 'side-item__icon',
                                          moduleItem.moduleIcon
                                            ? `module-icon--${moduleItem.moduleIcon}`
                                            : (moduleItem.icon || ''),
                                        ]"
                                            ></i>

                                            <div class="side-item__name">{{
                                                moduleItem.permissionPath && !moduleItem.fixedName
                                                ? permissionNameMapping[moduleItem.permissionPath]
                                                : moduleItem.name
                                                }}
                                            </div>
                                        </router-link>
                                        <div
                                            v-else
                                            @click="jumoToExternal(moduleItem.externalLinkId)"
                                            class="side-item"
                                        >
                                            <i
                                                :class="[
                                                      'icon',
                                                      'side-item__icon',
                                                      moduleItem.moduleIcon
                                                        ? `module-icon--${moduleItem.moduleIcon}`
                                                        : (moduleItem.icon || ''),
                                                ]"
                                            ></i>

                                            <div class="side-item__name">{{
                                                moduleItem.permissionPath && !moduleItem.fixedName
                                                ? permissionNameMapping[moduleItem.permissionPath]
                                                : moduleItem.name
                                                }}
                                            </div>
                                        </div>
                                    </el-menu>
                                </template>
                            </template>
                        </ul>
                    </div>
                </el-menu>
            </div>
        </div>

        <div
            class="app-main"
            :class="{ isStandaloneclass: isStandalone }"
            :style="{
                top: isShowTop ? '' : '0',
                paddingLeft: isShowSide ? '230px' : '0',
              }"
        >
            <div class="app-main-box">
                <transition name="fade" mode="out-in">
                    <keep-alive :include="cachedList">
                        <router-view></router-view>
                    </keep-alive>
                </transition>

            </div>
        </div>
    </div>
</template>

<script>
    import {mapGetters, mapMutations} from 'vuex';
    import moduleList from "@/router/moduleList";
    import {isShowByPermission} from "@/utils";
    import {
        getBySchoolIdInit,
    } from '@/api/printApplication';

    export default {
        name: "LowerLayout",
        data: function () {
            return {
                isShowSidebar: true,
                navbarKeyList: [],
                navbar: "",
                openedArray: [],
                moduleList,
                isOnlySys: false,
                menuSetting: {
                    print: false
                },
                cachedList: []
            };
        },
        beforeRouteUpdate(to, from, next) {
            if(from.meta.isCached && !this.cachedList.includes(from.name)) {
                this.cachedList.push(from.name);
            }
            if(!this.cachedList.includes(to.name) && !to.meta.keepCached) {
                this.cachedList.splice(0, this.cachedList.length);
            }
            console.log('this.cachedList',this.cachedList)
            this.$nextTick(() => {
                next();
            })
        },
        computed: {
            ...mapGetters([
                "level2NameMapping",
                "permission",
                "permissionNameMapping",
                "token",
                "isStandalone",
            ]),
            isShowSide() {
                const hideRouteList = ['/activity/interactUserListActSignShow', '/meeting/meetingSignUp', '/activity/interactUserList'];
                return hideRouteList.every(url => !location.href.includes(url)) && (!this.isStandalone || this.isShowSidebar);
            },
            isShowTop() {
                const hideRouteList = ['/activity/interactUserListActSignShow', '/meeting/meetingSignUp', '/activity/interactUserList'];
                return hideRouteList.every(url => !location.href.includes(url)) && (!this.isOnlySys && !this.isStandalone);
            }
        },
        watch: {
            $route: function (newValue) {
                if (newValue.meta.permissionPath) {
                    if (!isShowByPermission(newValue.meta.permissionPath)) {
                        this.$router.replace("/401");
                    }
                }
                if (window.sessionStorage.getItem("pc_login_type")) {
                    this.moduleList = moduleList[window.sessionStorage.getItem("pc_login_type")];
                    this.navbarKeyList = Object.keys(moduleList[window.sessionStorage.getItem("pc_login_type")]);
                } else {
                    this.moduleList = moduleList.normal;
                    this.navbarKeyList = Object.keys(moduleList.normal);
                }
                this.navbar = this.$route.path.match(/^\/.*?\/(.*?)($|\/)/)[1];
                const hashArray = newValue.path.split("/");
                const openedArraySegment = [];
                for (let i = 0; i < 4; i++) {
                    openedArraySegment.push(hashArray[i]);
                }
                this.openedArray = [openedArraySegment.join("/")];
                this.getMenuSetting();
            },
        },
        created() {
            if (window.sessionStorage.getItem("pc_login_type")) {
                this.moduleList = moduleList[window.sessionStorage.getItem("pc_login_type")];
                this.navbarKeyList = Object.keys(moduleList[window.sessionStorage.getItem("pc_login_type")]);
            } else {
                this.moduleList = moduleList.normal;
                this.navbarKeyList = Object.keys(moduleList.normal);
            }
            this.navbar = this.$route.path.match(/^\/.*?\/(.*?)($|\/)/)[1];
            if (window.sessionStorage.getItem("pc_login_type") === "system") {
                this.isOnlySys = true;
            } else {
                this.isShowSidebar = false;
            }
            this.checkOnlyRepair();
        },
        mounted() {
            const hashArray = this.$route.path.split("/");
            const openedArraySegment = [];
            for (let i = 0; i < 4; i++) {
                openedArraySegment.push(hashArray[i]);
            }
            this.openedArray = [openedArraySegment.join("/")];
            this.getMenuSetting();
        },
        methods: {
            isShowByPermission,
            ...mapMutations(['RESET_SCHOOLYEAR']),
            onMenuClick() {
                this.RESET_SCHOOLYEAR();
            },
            isShowSideitem: function (moduleItem) {
                let isShow = !moduleItem.permissionPath || isShowByPermission(moduleItem.permissionPath);
                isShow &= !moduleItem.menuSettingKey || !!this.menuSetting[moduleItem.menuSettingKey];
                if (isShow && moduleItem.children) {
                    isShow = moduleItem.children.some((subModule) => {
                        return isShowByPermission(subModule.permissionPath) && (!subModule.menuSettingKey || !!this.menuSetting[subModule.menuSettingKey]);
                    });
                }

                return isShow;
            },

            getMenuSetting() {
                if (isShowByPermission('/printSeniorApply/toApplyListPage')) {
                    getBySchoolIdInit()
                        .then(res => res.data)
                        .then(data => {
                            const pageData = data.data;
                            this.menuSetting.print = pageData.consumableApply == 1;
                        });
                }
            },
            jumoToExternal(externalLinkId) {
                const linkMap = {
                    schoolSignup: `${
                        global.command === "production"
                            ? "http://www.zhxiaoyuan.cn/schoolSignup/"
                            : "http://www.weixiaojia.net/schoolSignup/"
                        }#/main/kindergarten/notice/noticeList`
                };
                let linkUrl =
                    linkMap[externalLinkId] + `?paramJson=%7B%7D&token=${this.token}`;
                window.open(linkUrl);
            },
            jumpToPage(path, query) {
                if (query === null || query === undefined) {
                    query = {};
                }
                this.$router.push({
                    path,
                    query,
                });
            },
            checkOnlyRepair() {
                const modulePermissionList = {};
                modulePermissionList['generalLogistics'] = moduleList.normal['generalLogistics'].map(item => item.permissionPath);

                let isOnlyRepair = isShowByPermission('/repair/repairList');
                const pathList = modulePermissionList.generalLogistics.filter(path => path !== '/repair/repairList');
                isOnlyRepair = isOnlyRepair && pathList.every(path => !isShowByPermission(path));
                if (isOnlyRepair) {
                    if (this.moduleList.generalLogistics.findIndex(item => item.name === '报修统计') == -1) {
                        this.moduleList.generalLogistics.push({
                            moduleIcon: "bao-xiu",
                            name: '报修统计',
                            fixedName: true,
                            routePath: '/main/generalLogistics/repairManage/repairAccountingIndex',
                        });
                        this.moduleList.generalLogistics.push({
                            moduleIcon: "bao-xiu",
                            name: '报修设置',
                            fixedName: true,
                            index: '/main/generalLogistics/repairManage',
                            children: [
                                {
                                    name: '报修类型设置',
                                    routePath: '/main/generalLogistics/repairManage/repairSet/repairTypeListIndex?noback=1'
                                },
                                {
                                    name: '报修地点设置',
                                    routePath: '/main/generalLogistics/repairManage/repairAddressSet/repairAddressSetIndex?noback=1'
                                }
                            ]
                        });
                    }
                }


            }
        },
    };
</script>
<style scoped>
    ::-webkit-scrollbar {
        width: 6px;
        background-color: rgba(255, 255, 255, 0.1);
    }

    ::-webkit-scrollbar-thumb {
        background-color: #999;
    }

    ::-webkit-scrollbar-track {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .el-table td,
    .el-table th {
        padding: 8px 0;
    }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
    @import "../../styles/mixin.scss";
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
            width: 220px;
            border-right: solid 1px #e6e6e6;
            position: absolute;
            background: #fff;
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

        .app-main {
            width: 100%;
            position: absolute;
            top: 70px;
            bottom: 0;
            left: 0;
            float: left;
            overflow-x: hidden;
            padding: 10px;
            padding-left: 230px;
            background: #f1f1f1;
            @include scrollBar;
        }

        .isStandaloneclass {
            padding: 0px;
            padding-left: 230px;
            background: #fff;
        }

        .app-main-box {
            background: #fff;
            min-height: 100%;
        }

        .app-main-box > div {
            min-height: 100%;
            box-sizing: border-box;
        }
    }

    ul {
        padding: 0;
    }

    .el-menu {
        min-height: 100%;
    }

    .wscn-icon {
        margin-right: 10px;
    }

    .hideSidebar .menu-indent {
        display: block;
        text-indent: 10px;
    }

    .side-item {
        display: block;
        height: 47px;
        line-height: 47px;
        font-size: 14px;
        color: #48576a;
        padding: 0 20px;
        cursor: pointer;
        position: relative;
        transition: border-color 0.3s, background-color 0.3s, color 0.3s;
        box-sizing: border-box;
        white-space: nowrap;


        &:hover {
            background-color: #d1dbe5;
        }
    }

    .side-item__name,
    .side-item__icon {
        display: inline-block;
        vertical-align: middle;
    }

    .side-item--sub {
        padding-left: 40px;
    }

    .router-link-active {
        color: #20a0ff;
         background-color: #ecf8ff;
    }

    @include generateModuleIconStyles(
                (
                    tzgg,
                    wdwj,
                    rwgl,
                    xsqj,
                    kq,
                    xc,
                    bjq,
                    ry,
                    yd,
                    yundong,
                    zu,
                    kcb,
                    cj,
                    pk,
                    jfc,
                    jxjx,
                    gkk,
                    dktk,
                    tkyy,
                    yymw,
                    jiaoyu,
                    wzhz,
                    bjpj,
                    deyu,
                    tzjk,
                    ktpj,
                    ljszwpj,
                    wtxy,
                    lxkb,
                    "shi-pin-yu-ding",
                    "shan-shi-ying-yang",
                    "shi-pu-tong-zhi",
                    "ting-huo-tong-ji",
                    "jiu-can-ting-huo-tong-ji",
                    "bao-xiu",
                    "xiaozu",
                    "fiveKid",
                    "zi-yuan-yu-yue",
                    "shi-wu-zhao-ling",
                    "gong-zi-guan-li",
                    "shou-tui-fei",
                    "fu-li-fa-fang",
                    "cai-gou-shen-qing",
                    "su-she-guan-li",
                    "xin-yu-zhi-chuang",
                    "er-tong-yan-jiu-ting-ke",
                    zxxxw,
                    zhdgl,
                    zhyqd,
                    zrctj,
                    zzgzjh,
                    zgzjh,
                    zxwrz,
                    zlsqj,
                    zkqtj,
                    zjbsq,
                    zjbdk,
                    zwcsq,
                    zgwlz,
                    zlzsq,
                    zrygl,
                    zdsj,
                    zlss,
                    zldkb,
                    zzhjc,
                    zjcfk,
                    zjyx,
                    zxyjc,
                    zhd,
                    zrzgl,
                    zrlkgl,
                    zxyk,
                    zsbgl,
                    zyqh,
                    zmksyfx,
                    zyygl,
                    zxtsz,
                    zxxzd,
                    zsxj,
                    zbmzr,
                    zsjkc,
                    zyhgl,
                    zyhfx
                )
    );
</style>
