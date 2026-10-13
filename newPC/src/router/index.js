import Vue from 'vue'
import Router from 'vue-router'

/* layout */
import Layout from '../views/layout/Layout'

/* login */
import prepage from '../views/login/prepage'

import pcLogin from '../views/login'
import abcLogin from '../views/login/abcLogin'
import eduLogin from '../views/login/eduLogin'
import qrcodeLogin from '../views/login/qrcodeLogin';
import databoardindex from '../views/databoard/databoardindex'
import databoardgrade from '../views/databoard/databoardgrade'
import databoardalss from '../views/databoard/databoardalss'
import databoardstu from '../views/databoard/databoardstu'
import visitorDashboardindex from '../views/visitor/visitorDashboardindex'
import leaveBoardindex from '../views/leaveBoard/leaveBoardindex'
import studentAccessindex from '../views/studentAccess/studentAccessindex'

/* error page */
const Err404 = () => import('@/views/error/404')
const Err401 = () => import('@/views/error/401')

// normal
import homePageRoutes from './normal/homePage'
import homeSchoolRoutes from './normal/homeSchool'
import teachingStudyRoutes from './normal/teachingStudy'
import schoolManageRoutes from './normal/schoolManage'
import stuEvaluateRoutes from './normal/stuEvaluate'
// // 总务后勤
import generalLogistics from './normal/generalLogistics'
import sysManageRoutes from './normal/sysManage'
// 系统管理
import systemSysManageRoutes from './system/sysManage'

import classroomEvaluationApp from './misc/classroomEvaluationApp'

Vue.use(Router)

export const constantRouterMap = [{
        path: '*',
        redirect: '/404'
    },
    {
        path: '/',
        component: prepage
    },
    {
        path: '/prepage',
        component: prepage
    },
    {
        path: '/login',
        component: pcLogin
    },
    {
        path: '/pcLogin',
        component: pcLogin
    },
    {
        path: '/abcLogin',
        component: abcLogin
    },
    {
        path: '/eduLogin',
        component: eduLogin
    },
    {
        path: '/qrcodeLogin',
        component: qrcodeLogin
    },
    {
        path: '/databoardindex',
        component: databoardindex
    },
    {
        path: '/databoardgrade',
        component: databoardgrade
    },
    {
        path: '/databoardalss',
        component: databoardalss
    },
    {
        path: '/databoardstu',
        component: databoardstu
    }, 
    {
        path: '/leaveBoardindex',
        component: leaveBoardindex
    },
    {
        path: '/studentAccessindex',
        component: studentAccessindex
    },
    {
        path: '/visitorDashboardindex',
            component: visitorDashboardindex
        }, {
        path: '/404',
        component: Err404
    },
    {
        path: '/401',
        component: Err401
    },
    {
        path: '/moduleManager/index', // 应用管理
        component: () => import('@/views/sysSet/moduleManager/index')
    },
    {
        path: '/moduleManager/roleDetail', // 应用管理详情
        component: () => import('@/views/sysSet/moduleManager/roleDetail')
    },
    {
        path: '/addRefunRegister', // 退费登记2--添加表单页
        component: () => import('@/views/refundRegisterTwo/addRefunRegister')
    },
    {
        path: '/refunRegisterLogin', // 退费登记2--登录
        component: () => import('@/views/refundRegisterTwo/refunRegisterLogin')
    },
    {
        path: '/signupStuTalentTable', // 高中招生报名 -- 特长生表格
        component: () => import('@/views/schoolSignupHigh/signupStuTalentTable'),
        props: {
            hideReturn: true
        }
    },
    {
        path: '/myUserInfo',
        component: Layout,
        name: '首页',
        children: [{
            path: 'myUserInfo',
            component: () => import('@/views/sysSet/org/user/myUserInfo')
        }]
    },
    {
        path: '/main',
        component: Layout,
        name: 'main',
        children: [
            ...homePageRoutes,
            homeSchoolRoutes,
            teachingStudyRoutes,
            schoolManageRoutes,
            stuEvaluateRoutes,
            generalLogistics,
            sysManageRoutes
        ]
    },
    {
        path: '/system',
        name: 'system',
        component: () => import('@/views/layout/systemLayout'),
        children: [{
            path: '',
            redirect: 'sysManage'
        },
            systemSysManageRoutes
        ]
    },
    ...classroomEvaluationApp,
    {
        path: '/attendanceStatistics',
        redirect: '/attendanceStatistics/schoolAttendanceTotal'
    }, //建邺区考勤汇总统计
    {
        path: '/attendanceStatistics/schoolAttendanceTotal',
        component: () => import('@/views/attendanceStatistics/schoolAttendanceTotal')
    },
    {
        path: '/attendanceStatistics/schoolAttendanceDetail',
        component: () => import('@/views/attendanceStatistics/schoolAttendanceDetail')
    },
    {
        path: '/attendanceStatistics/teacherAttendanceTotal',
        component: () => import('@/views/attendanceStatistics/teacherAttendanceTotal')
    },
    {
        path: '/campusCard',
        redirect: '/campusCard/campusCardLogin'
    },
    {
        path: '/campusCard/campusCardLogin',
        name: 'campusCardLogin',
        component: () => import('@/views/campusCard/campusCardLogin')
    },
    {
        path: '/campusCard/campusList',
        name: 'campusList',
        component: () => import('@/views/campusCard/campusList')
    },
    {
        path: '/readBookBeiyouDisplay',
        component: () => import('@/views/readBookBeiyou/readBookBeiyouDisplay'),
        name: '自主阅读大屏'
    }, {
        path: '/agent/agentIndex',
        component: () => import('@/views/agent/agentIndex')
    },
]

export default new Router({
    scrollBehavior: () => ({
        y: 0
    }),
    routes: constantRouterMap
})
