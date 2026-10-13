<template>
    <div class="home-page-main-normal-entry">
        <div class="title">常用入口</div>
        <ul class="entry-wrapper">
            <li @click="linkfun(entry.encryptModuleId, entry.text, entry.link || entry.innerLink)" class="item" :key="idx"
                v-for="(entry, idx) in entryList"
                v-show="isShowByPermission(entry.permission) || (entry.roleConstantId && specialPermission(entry.roleConstantId))">
                <img :src="entry.iconPath" alt=""/>
                <span>{{
                        entry.permission && !entry.fixedName
                                                ? permissionNameMapping[entry.permission]
                                                : entry.text
                    }}</span>
                <a v-if="entry.link" :href="entry.link" target="_blank"></a>
                <span v-else-if="entry.innerLink" @click="jumpToPage(entry.innerLink)"></span>
            </li>
        </ul>
        <el-dialog title="提示" :visible.sync="isShowExternalDialog" width="360px">
            <div>
                <div>是否进入【{{ externalModuleItemname }}】</div>
                <div class="comment-btn-container">
                    <el-button type="primary" size="small" plain @click="isShowExternalDialog = false">取消</el-button>
                    <span @click="isShowExternalDialog = false">
						<a :href="externalUrl" target="_blank">
							<el-button type="primary" size="small">确定</el-button>
						</a>
					</span>
                </div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    import Cookies from 'js-cookie'

    /* utils */
    import {isShowByPermission, isShowByPermissionList} from '@/utils'

    /* components */

    /* api */
    import {
        getTeacherDevelopSignKey,
        listIntegrateModule,
        gotoIntegrateModule,
        getCovidAbcfyLoginaccess
    } from '@/api/homePage/main/normalEntry/index'
    import {possessRole} from '@/api/common/common'
    // 正式/测试环境地址
    // 教师发展
    let jiaoShiFaZhan = global.command === 'production' ? 'http://teacher.weixiaojia.cn/wxcepTeacher' : 'http://teacher.weixiaojia.net/wxcepTeacher'

    // 资产管理
    let ziChanGuanLi = global.command === 'production' ? 'http://www.zhxiaoyuan.cn/assetManagement' : 'http://www.weixiaojia.net/assetManagement'

    // 通用
    let prefix = global.command === 'production' ? 'https://www.zhxiaoyuan.cn' : 'http://www.weixiaojia.net'
    const jbxez = global.command === 'production' ? 'http://jbxez.zhxiaoyuan.cn/#/main/affairs/moduleList' : 'http://testjbxez.zhxiaoyuan.cn/#/main/affairs/moduleList'

    if (window.location.href.indexOf('127.0.0.1') !== -1) {
        prefix = 'http://127.0.0.1'
        ziChanGuanLi = 'http://127.0.0.1/assetManagement'
    }

    export default {
        name: 'homePageMainNormalEntry',
        mixins: [],
        components: {},
        computed: {
            ...mapGetters(['schoolInfo', 'permissionNameMapping']),
            //针对 江苏特需平台老师，班主任身份进行的权限判断
            specialPermission() {
                return function (val) {
                    if (val) {
                        possessRole(val).then(res => {
                            return res.data.data.result
                        })
                    } else {
                        return false
                    }
                }
            }
        },
        filters: {},
        data() {
            return {
                // 入口列表
                entryList: [],
                externalUrl: '',
                isShowExternalDialog: false,
                externalModuleItemname: ''
            }
        },

        created() {
            this.entryList = [
               
                {
                text: '班级管理',
                iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/ban-ji-guan-li.png',
                link: `${prefix}/classConstruction/#/main/selectClass?token=${Cookies.get('Admin-Token')}`,
                permission: '/classroom/classConst'
            },
                {
                    text: '成绩分析系统',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/cheng-ji-fen-xi.png',
                    link: `${prefix}/achievement/#/main/homePage?token=${Cookies.get('Admin-Token')}`,
                    permission: '/examPlatform/system'
                },
                {
                    text: '课堂评价数据看板',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/ktpjsjkb.png',
                    link: `${prefix}/app/#/databoardindex?token=${Cookies.get('Admin-Token')}`,
                    permission: '/schoolBehEval/getSchoolBehManger'
                },
                {
                    text: '班牌管理系统',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/ban-pai-guan-li.png',
                    link: `${prefix}/classcardManagement/#/main/homepage?token=${Cookies.get('Admin-Token')}`,
                    permission: '/classcardManage/toIndexPage'
                },
                {
                    text: '疫情防控系统',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/yi-qing-fang-kong.png',
                    link: `${prefix}/diseasePlatform/#/main/homepage?token=${Cookies.get('Admin-Token')}`,
                    permission: '/disReportTh/thIndex'
                },
                {
                    text: '资产管理系统',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/zi-chan-guan-li.png',
                    link: `${ziChanGuanLi}/#/main/assetStorageManage/fixedAssetList?token=${Cookies.get('Admin-Token')}`,
                    permission: '/assetManage/index'
                },
                {
                    text: '网站管理',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/wang-zhan-guan-li.png',
                    link: `${prefix}/webManage/#/main?paramJson=%7B%7D&token=${Cookies.get('Admin-Token')}`,
                    permission: '/schoolWebTwo/schoolWebTwoHome'
                },
                {
                    text: '校本选课系统',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/xiao-ben-xuan-ke.png',
                    // link: `${prefix}/electiveCourse/#/main/homePage?token=${Cookies.get('Admin-Token')}`,
                    link: `${prefix}/afterClassService/#/main/association?token=${Cookies.get('Admin-Token')}&ismylink=66`,
                    permission: '/electiveCourse/newCourseplatformManage'
                },
                {
                    text: '学生综合素质评价',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/xue-sheng-zong-he-su-zhi-ping-jia.png',
                    link: `${prefix}/generalAssessment/#/main?token=${Cookies.get('Admin-Token')}`,
                    permission: '/stuComprehensive/evaluation'
                },
                {
                    text: '教师发展',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/jiao-shi-fa-zhan.png',
                    link: `${jiaoShiFaZhan}/login/singleSignOn`,
                    permission: '/teacherDevelop/wxcepTeacher',
                    needSignKey: true
                },
                {
                    text: '招生报名系统',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/zhao-sheng-bao-ming.png',
                    link: `${prefix}/schoolSignup/#/main/primary/notice/noticeList?token=${Cookies.get('Admin-Token')}`,
                    permission: '/staterunEnrolSystem/enrolPlatform'
                },
                {
                    text: '体质健康监测平台',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/ti-zhi-jian-kang.png',
                    link: `${prefix}/physicalHealth/#/sysManage/testIndex?token=${Cookies.get('Admin-Token')}`,
                    permission: '/physicalHealth/school/index'
                },
                {
                    text: '放学路队系统',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/ti-zhi-jian-kang.png',
                    link: `${prefix}/leaveSchool/#/main/chit/classChit?token=${Cookies.get('Admin-Token')}`,
                    permission: '/elasticSchool/mangerIndex'
                },	
                {
                    text: '领导看板',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/ling-dao-kan-ban.png',
                    link: `${prefix}/leaderSeeBoard/#/leaderSeeIndex?token=${Cookies.get('Admin-Token')}`,
                    permission: 'leaderSee/moduleList'
                },
                {
                    text: '开放平台',
                    iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/kfpt.png',
                    link: `${prefix}/#/moduleManager/index?token=${Cookies.get('Admin-Token')}`,
                    permission: '/homePage/open'
                },
                {
                    text: '一卡通平台',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/yikatong.png',
                    link: `${prefix}/onecardsolution/#/homePageIndex?token=${Cookies.get('Admin-Token')}`,
                    permission: '/onecartoon/wy'
                },
                {
                    text: '课后服务综合管理平台',
                    iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/afterclassservice/kehoufuwu.png',
                    link: `${prefix}/afterClassService/#/main/homepage?token=${Cookies.get('Admin-Token')}`,
                    permission: '/afterClass/system'
                },
                {
                    text: '幼儿成长档案',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/growthfootprint.png',
                    link: `${prefix}/growthfootprint/#/homePageIndex?token=${Cookies.get('Admin-Token')}`,
                    permission: '/growthPortfolioSy/index'
                },
                {
                    text: `${this.schoolInfo && this.schoolInfo.orgAreaName && this.schoolInfo.orgAreaName.split(' ')[2] ? this.schoolInfo.orgAreaName.split(' ')[2] : ''}作业数智管理`,
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/homework-manage.png',
                    link: `${prefix}/digitalIntelligence/#/main/modules?token=${Cookies.get('Admin-Token')}`,
                    permission: '/homeworkDuration/index'
                },
                {
                    text: '资源管理平台',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/zi-chan-guan-li.png',
                    link: `${prefix}/resourcesManage/#/main/homePage/index?token=${Cookies.get('Admin-Token')}`,
                    permission: '/autonomicStudy/resourcePlatform'
                },
                {
                    text: '江北新e站',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/jbxyz.png',
                    link: `${jbxez}?token=${Cookies.get('Admin-Token')}`,
                    permission: '/throughTrain/throughTrain'
                },
                {
                    text: '招生报名',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/zhao-sheng-bao-ming.png',
                    link: `${prefix}/schoolSignup/#/main/kindergarten/notice/noticeList?token=${Cookies.get('Admin-Token')}`,
                    permission: '/voteTwo/Recruit'
                },
                {
                    text: '绘四迹',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/platform/art_gallery/art_round_logo.png',
                    link: `${prefix}/artGallery/#/main/index?token=${Cookies.get('Admin-Token')}`,
                    permission: '/artgallery/artgalleryIndex'
                },
                {
                    text: '怡小豆爱学习平台',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/homePage/entry/yxd.png',
                    link: `${prefix}/informalLearning/#/main/index?token=${Cookies.get('Admin-Token')}`,
                    permission: '/likeStudy/likeStudyIndex'
                },
                {
                    text: '智慧防疫',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/systemSetup/zhfy.png',
                    permission: '/covidAbcfy/loginaccess'
                },
                {
                    text: '公众号管理',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/official_account_manage.png',
                    link: `${prefix}/officialAccountManagement/#/main/homepage?token=${Cookies.get('Admin-Token')}`,
                    permission: '/wxsmpClient/install/index'
                },
                {
                    text: '网络招生报名平台',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/misc/teenpalace_logo2.png',
                    link: `${prefix}/teenPalace/#/main/homepage?token=${Cookies.get('Admin-Token')}`,
                    permission: '/outsideTrain/system'
                },
                {
                    text: '江苏省特需教育学生信息发展平台',
                    iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/specialEducationPlat/江苏省特需教育学生信息发展平台入口.png',
                    link: `${prefix}/specialEducationPlatform/#/main?token=${Cookies.get('Admin-Token')}`,
                    permission: '/specialEdu/system'
                },
                {
                    text: '江苏省特需教育学生信息发展平台',
                    iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/specialEducationPlat/江苏省特需教育学生信息发展平台入口.png',
                    link: `${prefix}/specialEducationPlatform/#/main?token=${Cookies.get('Admin-Token')}`,
                    permission: '/specialSchool/system',
                    roleConstantId: 2022100803
                }, {
                    text: '课后服务',
                    iconPath: 'https://cdnfile-10043692.file.myqcloud.com/admin/images/specialEducationPlat/jyq.png ',
                    link: `${prefix}/eduCircle/#/eduCircle/homePage?token=${Cookies.get('Admin-Token')}`,
                    permission: '/eduCircle/eduCircleTh'
                }, {
                text: '和小美',
                iconPath: 'https://sysfile-1251008840.picsh.myqcloud.com/wyms/2025/1760325769971/1760325769971095592.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251013`,
                permission: '/homePage/hexiaomei'
            }, {
                text: 'AI助手',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/activity/znthxm.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20250929`,
                permission: '/homePage/AIzhushou'
            },{
                text: '科小助',
                iconPath: 'https://sysfile-1251008840.picsh.myqcloud.com/wyms/2025/1760441553730/1760441553730067278.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251015`,
                permission: '/homePage/kexiaozhu'
            },{
                text: '一一',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/activity/znthxm.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251112`,
                permission: '/homePage/qixiaozhushou'
            },{
                text: '学习伙伴小导',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/aisxxd.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251118`,
                permission: '/homePage/shuxuezhushou'
            },{
                text: '学习助手小思',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/aisxxs.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251120`,
                permission: '/homePage/shuxuexiaosi'
            },{
                text: '出题助手小思',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/ weiyan/aictzs.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251124`,
                permission: '/homePage/chutixiaosi'
            },{
                text: '小鹤',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/newxiaohe.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251204`,
                permission: '/homePage/xiaohe'
            },
            {
                text: '爱探险的小读者',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/zhuanjia.jpg',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20260315`,
                permission: '/homePage/adventureReader'
            },
            {
                text: '探险专家团',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/zhuanjia.jpg',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20260315`,
                permission: '/20260315'
            },
            {
                text: '小水滴',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/xiaoshuidi.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251221`,
                permission: '/homePage/xiaoshuidi'
            },
            {
                text: '小e',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/xiaoe.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251222`,
                permission: '/homePage/xiaoe'
            },
            {
                text: 'YOU AI',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/youai.jpg',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20251230`,
                permission: '/homePage/youai'
            },
            {
                text: '九思',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/jgznt.jpg',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20260119`,
                permission: '/homePage/jiugao'
            },
             {
                text: '九高招生小助手',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/jgzsxzs.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20260120`,
                permission: '/homePage/jiugaozhaosheng'
            },
            {
                text: '北小星学伴（数学）',
                iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/activity/znthxm.png',
                link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20260402`,
                permission: '/homePage/beixiaoxueban'
            },
             {
            text: '北小星学伴（语文）',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/yuwen.jpg',
            link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20260409`,
            permission: '/homePage/xuebyw/teacher'
            },
             {
            text: '北小星学伴（英语）',
            iconPath: 'https://cdnfile-10043692.cos.ap-shanghai.myqcloud.com/admin/images/AIagent/newyingyu.png',
            link: `${prefix}/#/agent/agentIndex?token=${Cookies.get('Admin-Token')}&code=20260414`,
            permission: '/homePage/xuebanEnglish/teacher'
            }
            ]
            this.getTeacherDevelopSignKey()
            this.listIntegrateModule()

        },
        methods: {
            jumpToPage(path, query = {}) {
                this.$router.push({
                    path,
                    query
                })
            },
            linkfun(id, name, link) {
                if (!link) {
                    if (name === '智慧防疫') {
                        getCovidAbcfyLoginaccess().then(({data}) => {
                            if (data.code === 200) {
                                this.externalModuleItemname = name
                                this.externalUrl = data.data.redirect
                                this.isShowExternalDialog = true
                            } else {
                                this.$message({
                                    message: data.msg,
                                    type: 'warning'
                                })
                            }
                        })
                        return
                    }
                    this.externalModuleItemname = name
                    gotoIntegrateModule({id, sourceType: 1})
                        .then(res => {
                            let data = res.data
                            // window.open(data.data, '_blank');
                            this.isShowExternalDialog = true
                            this.externalUrl = data.data
                        })
                        .then(data => {
                            return data
                        })
                }
            },
            isShowByPermissionList,
            isShowByPermission,
            getTeacherDevelopSignKey() {
                getTeacherDevelopSignKey()
                    .then(res => {
                        let _res = res.data
                        if (_res.code != 200) return Promise.reject(_res.msg)
                        else return _res.data
                    })
                    .then(data => {
                        let needSignKey = this.entryList.find(item => item.needSignKey)
                        needSignKey.link += `?signKey=${data}`
                    })
                    .catch(msg => {
                        this.$message({
                            message: msg,
                            type: 'error'
                        })
                    })
            },
            listIntegrateModule() {
                listIntegrateModule()
                    .then(res => {
                        let _res = res.data
                        if (_res.code != 200) return Promise.reject(_res.msg)
                        else return _res.data
                    })
                    .then(data => {
                        if (Array.isArray(data)) {
                            let temp = data.map(item => this.gotoIntegrateModule(item.encryptModuleId))
                            let p = Promise.all(temp)
                                .then(res => {
                                    data.forEach((item, idx) => {
                                        this.entryList.push({
                                            text: item.moduleOtherName || item.moduleName,
                                            iconPath: item.moduleLogo,
                                            link: false,
                                            encryptModuleId: data[idx].encryptModuleId
                                        })
                                    })
                                })
                                .catch(e => e)
                        }
                    })
                    .catch(msg => {
                        this.$message({
                            message: msg,
                            type: 'error'
                        })
                    })
            },
            gotoIntegrateModule(id) {
                return gotoIntegrateModule({
                    id,
                    sourceType: 1
                })
                    .then(res => {
                        let _res = res.data
                        if (_res.code != 200) return Promise.reject(_res.msg)
                        else return _res.data
                    })
                    .then(data => {
                        return data
                    })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .comment-btn-container {
        padding-top: 20px;
        text-align: right;
    }

    .comment-input-container {
        margin-bottom: 10px;
    }

    .home-page-main-normal-entry {
        padding: 0 56px;
        min-height: calc(100vh - 70px - 10px - 8px - 123px - 45px - 286px - 45px - 8px - 10px);

        .title {
            font-family: SourceHanSansCN-Medium;
            font-size: 16px;
            font-weight: bold;
            color: #2888ea;
            padding: 10px 15px;
            background-color: #f2f6fa;
        }

        .entry-wrapper {
            min-height: 175px;
            padding: 30px 10px 0;
            display: flex;
            flex-wrap: wrap;

            .item {
                cursor: pointer;
                position: relative;
                margin-right: 30px;
                margin-bottom: 30px;
                width: 80px;
                text-align: center;

                a {
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    left: 0;
                }

                img {
                    width: 75px;
                    height: 75px;
                    border-radius: 50%;
                    transition: box-shadow 0.3s linear;
                }

                span {
                    font-family: MicrosoftYahei;
                    font-size: 12px;
                    color: #606266;
                    transition: color 0.3s linear;
                }

                &:hover {
                    img {
                        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.4);
                    }

                    span {
                        color: #409eff;
                    }
                }
            }
        }
    }
</style>
