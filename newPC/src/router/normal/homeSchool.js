import readBookSetBeiyouRoutes from '../modules/readBookSetBeiyou/readBookSetBeiyou'
import devideSectionBeiyouRoutes from '../modules/devideSectionBeiyou/devideSectionBeiyou'
import matchActivtity from '../modules/matchActivtity/matchActivtity'
import eClockRoutes from '../modules/eClock/eClock'

export default {
    path: '/main/homeSchool/',
    component: () => import('@/views/layout/LowerLayout'),
    children: [
        ...readBookSetBeiyouRoutes,
        ...devideSectionBeiyouRoutes,
        ...matchActivtity,
        ...eClockRoutes,
        {
            path: 'psychological/orderList',
            component: () => import('@/views/psychological/orderList') // 预约列表
        },
        {
            path: 'psychological/orderDetail',
            component: () => import('@/views/psychological/orderDetail') // 预约详情
        },
        {
            path: 'psychological/planList',
            component: () => import('@/views/psychological/planList') // 安排表
        },
        {
            path: 'psychological/addScheduleId',
            component: () => import('@/views/psychological/addScheduleId') // 添加时间表
        },
        {
            path: 'psychological/statistics',
            component: () => import('@/views/psychological/statistics') // 数据统计
        },
        {
            path: 'psychological/codeManageList',
            component: () => import('@/views/psychological/codeManageList') // 验证码管理
        },
        {
            path: 'psychological/addAdvice',
            component: () => import('@/views/psychological/addAdvice') // 添加预约
        },
        {
            path: 'personalInfoIndex',
            component: () => import('@/views/personalInfo/personalInfoIndex')
        },
        {
            path: 'personalInfoEdit',
            component: () => import('@/views/personalInfo/personalInfoEdit')
        },
        {
            path: 'faceManageUserEdit',
            component: () => import('@/views/personalInfo/faceManageUserEdit')
        },
        {
            path: 'backbone',
            component: () => import('@/views/personalInfo/backbone')
        },
        {
            path: 'listenClass/statistics', // 听课统计
            component: () => import('@/views/leaderSee/listenClassStatistics')
        },
        {
            path: 'listenClass/detail', // 听课详情
            component: () => import('@/views/leaderSee/listenClassDetail')
        },
        {
            path: 'listenClass/thStatistics', // 被听课统计
            component: () => import('@/views/leaderSee/listenClassTeacherStatistics')
        },
         {
            path: 'photo/photoClassList',
            component: () => import('@/views/photo/photoClassList')
        },
        {
            path: 'photo/photoTrashCan',
            component: () => import('@/views/photo/photoTrashCan')
        },
        {
            path: 'photo/photoList',
            component: () => import('@/views/photo/photoList')
        },
        {
            path: 'photo/schoolAlbum',
            component: () => import('@/views/photo/schoolAlbum')
        },
        {
            path: 'classcardManagement/module/moduleList',
            component: () => import('@/views/classcardManagement/modules/moduleList')
        },
        {
            path: 'classcardManagement/module/moduleAddEdit',
            component: () => import('@/views/classcardManagement/modules/moduleAddEdit')
        },
        {
            path: 'classcardManagement/template/templateList',
            component: () => import('@/views/classcardManagement/template/templateList')
        },
        {
            path: 'classcardManagement/template/templateCustomSetting',
            component: () => import('@/views/classcardManagement/template/templateCustomSetting')
        },
        {
            path: 'classcardManagement/template/templateCustomSettingVertical',
            component: () => import('@/views/classcardManagement/template/templateCustomSettingVertical')
        },
        {
            path: 'classcardManagement/template/templateDataboardCustomSetting',
            component: () => import('@/views/classcardManagement/template/templateDataboardCustomSetting')
        },
        {
            path: 'notice/noticeIndex',
            component: () => import('@/views/notice/noticeIndex') //  发通知主页
        },
        {
            path: 'notice/noticeAdd',
            component: () => import('@/views/notice/noticeAdd') //  添加通知
        },
        {
            path: 'notice/noticeDetail',
            component: () => import('@/views/notice/noticeDetail') //  通知详情
        },
        {
            path: 'notice/noticeReadList',
            component: () => import('@/views/notice/noticeReadList') //  通知已读未读列表
        },
        {
            path: 'notice/readSignCountlist',
            component: () => import('@/views/notice/readSignCountlist'), //  通知已读未读列表
        },
        {
            path: 'notice/putasealon',
            component: () => import('@/views/notice/putasealon'), //  通知已读未读列表
        },
        {
            path: 'notice/batchprinting',
            component: () => import('@/views/notice/batchprinting') //  通知已读未读列表
        },
        {
            path: 'notice/noticeReply',
            component: () => import('@/views/notice/noticeReply') //  通知回复列表
        },
        {
            path: 'notice/repeatreminder',
            component: () => import('@/views/notice/repeatreminder') //  通知回复列表
        },
        {
            path: 'notice/notieRecive',
            component: () => import('@/views/notice/notieRecive'), //  收通知主页
            meta: {
                permissionPath: '/notice/receive'
            }
        },
        {
            path: 'notice/allNoticeList',
            component: () => import('@/views/notice/allNoticeList') //  所有通知
        },
        {
            path: 'notice/allNoticeListnew',
            component: () => import('@/views/notice/allNoticeListnew') //  所有通知
        },
        {
            path: 'notice/parentlist',
            component: () => import('@/views/notice/parentlist') //  所有通知
        },
        {
            path: 'notice/classNoticeList',
            component: () => import('@/views/notice/classNoticeList') //  所有通知
        },
        {
            path: 'notice/noticeCount',
            component: () => import('@/views/notice/noticeCount') //  发送统计
        },
        {
            path: 'notice/noticeReadRate',
            component: () => import('@/views/notice/noticeReadRate') //  通知阅读率
        },
        {
            path: 'notice/noticeUserRead',
            component: () => import('@/views/notice/noticeUserRead') //  查询用户的未读及已读通知列表
        },
        /*
        {
            path: 'recipe/recipeIndex',
            component: () => import('@/views/recipe/recipeIndex'), // 食谱通知

        },
        {
            path: 'recipe/recipeAdd',
            component: () => import('@/views/recipe/recipeAdd'), //  新建食谱通知

        },
        {
            path: 'recipe/recipeDetail',
            component: () => import('@/views/recipe/recipeDetail'), // 食谱通知

        },*/
        /*
        {
            path: 'dietMenu/dietMenuIndex', //  食谱管理
            component: () => import('@/views/dietMenu/dietMenuIndex'),

        },*/
        {
            path: 'group/groupManagerIndex', //  常用组维护首页
            component: () => import('@/views/group/groupManagerIndex')
        },
        {
            path: 'group/groupManagerAdd', //  常用组维护新建
            component: () => import('@/views/group/groupManagerAdd')
        },
        {
            path: 'homework/homeworkIndex',
            component: () => import('@/views/homeworkManage/homeworkIndex') // 作业管理主页
        },
        {
            path: 'homework/addOrEditHomework',
            component: () => import('@/views/homeworkManage/addOrEditHomework') // 作业管理编辑和新建
        },
        {
            path: 'homework/homeworkDetail',
            component: () => import('@/views/homeworkManage/homeworkDetail') // 作业管理详情
        },
        {
            path: 'homework/homeworkManageFinishList',
            component: () => import('@/views/homeworkManage/homeworkManageFinishList') // 作业完成情况列表
        },
        {
            path: 'homework/homeworkManageFinishDetail',
            component: () => import('@/views/homeworkManage/homeworkManageFinishDetail') // 作业完成详情
        },
        {
            path: 'homework/homeworkManageReplyList',
            component: () => import('@/views/homeworkManage/homeworkManageReplyList') // 回复和阅读列表
        },
        {
            path: 'homework/homeworkClassList',
            component: () => import('@/views/homeworkManage/homeworkClassList') // 作业列表
        },
        {
            path: 'homework/homeworkStatis',
            component: () => import('@/views/homeworkManage/homeworkStatis') // 作业统计列表
        },
        {
            path: 'homework/homeworkNumList',
            component: () => import('@/views/homeworkManage/homeworkNumList') // 作业统计老师作业列表
        },
        {
            path: 'homework/homeworkStatisDetail',
            component: () => import('@/views/homeworkManage/homeworkStatisDetail') // 作业统计老师作业列表详情
        },
        {
            path: 'questionnaire/questionnaireList',
            component: () => import('@/views/questionnaire/questionnaireList') // 问卷列表
        },
        {
            path: 'questionnaire/questionnaireListFromBoe',
            component: () => import('@/views/questionnaire/questionnaireListFromBoe') // 区段问卷列表
        },
        {
            path: 'questionnaire/questionnaireDetail',
            component: () => import('@/views/questionnaire/questionnaireDetail') // 问卷详情
        },
        {
            path: 'questionnaire/questionnaireAdd',
            component: () => import('@/views/questionnaire/questionnaireAdd') // 问卷新增
        },
        {
            path: 'questionnaire/questionnaireEdit',
            component: () => import('@/views/questionnaire/questionnaireEdit') // 问卷编辑
        },
        {
            path: 'questionnaire/questionnaireCopy',
            component: () => import('@/views/questionnaire/questionnaireCopy') // 问卷复制
        },
        {
            path: 'questionnaire/questionnaireResult',
            component: () => import('@/views/questionnaire/questionnaireResult') // 问卷结果
        },
        {
            path: 'questionnaire/questionnaireUserlist',
            component: () => import('@/views/questionnaire/questionnaireUserList') // 用户问卷
        },
        {
            path: 'questionnaire/questionnaireUserListByQuestion',
            component: () => import('@/views/questionnaire/questionnaireUserListByQuestion') // 单题用户
        },
        {
            path: 'questionnaire/questionnaireAnswerResult',
            component: () => import('@/views/questionnaire/questionnaireAnswerResult') // 简答题结果
        },
        {
            path: 'questionnaire/questionnaireUserDetail',
            component: () => import('@/views/questionnaire/questionnaireUserDetail') // 答卷详情
        },
        {
            path: 'questionnaire/questionnairePersonalList',
            component: () => import('@/views/questionnaire/questionnairePersonalList'), // 用户问卷列表
        },
        {
            path: 'questionnaire/questionnaireUserPersonalDetail',
            component: () => import('@/views/questionnaire/questionnaireUserPersonalDetail')
        },
        {
            path: 'questionnaire/questionnaire',
            component: () => import('@/views/questionnaire/questionnaire')
        },
        {
            path: 'questionnaire/questionnaireAccounting',
            component: () => import('@/views/questionnaire/questionnaireAccounting')
        },
        {
            path: 'task/taskList',
            component: () => import('@/views/task/taskList')
        }, //发布任务列表
        {
            path: 'task/myTaskList',
            component: () => import('@/views/task/myTaskList')
        }, //我的任务列表
        {
            path: 'task/taskAdd',
            component: () => import('@/views/task/taskAdd') //新增任务
        },
        {
            path: 'task/taskEdit',
            component: () => import('@/views/task/taskEdit') //编辑任务
        },
        {
            path: 'task/taskDetail',
            component: () => import('@/views/task/taskDetail') //任务详情
        },
        {
            path: 'task/getTeaFinishCount',
            component: () => import('@/views/task/getTeaFinishCount') //任务详情
        },
        {
            path: 'task/getTeaUnfinishCount',
            component: () => import('@/views/task/getTeaUnfinishCount') //任务详情
        },
        {
            path: 'task/getStuFinishCount',
            component: () => import('@/views/task/getStuFinishCount') //任务详情
        },
        {
            path: 'task/getStuUnfinishCount',
            component: () => import('@/views/task/getStuUnfinishCount') //任务详情
        },
        {
            path: 'task/myTaskDetail',
            component: () => import('@/views/task/myTaskDetail') //我的任务详情
        },
        {
            path: 'task/uploadTask',
            component: () => import('@/views/task/uploadTask') //上传任务
        },

        {
            path: 'studentLeave/studentLeaveIndex', // 学生请假
            component: () => import('@/views/studentLeave/studentLeaveIndex'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'studentLeave/studentLeaveAdd', // 新增学生请假
            component: () => import('@/views/studentLeave/studentLeaveAdd')
        },
        {
            path: 'studentLeave/studentLeaveDetail', // 学生请假详情
            component: () => import('@/views/studentLeave/studentLeaveDetail')
        },

        {
            //书库首页
            path: 'library/libraryindex',
            component: () => import('@/views/library/libraryindex')
        },
        {
            //书库新增
            path: 'library/libraryadd',
            component: () => import('@/views/library/libraryadd')
        },
        {
            //书库编辑
            path: 'library/libraryedit',
            component: () => import('@/views/library/libraryedit')
        },
        {
            //书库详情
            path: 'library/librarydetails',
            component: () => import('@/views/library/librarydetails')
        },
        {
            //书库审批
            path: 'library/libraryToexamine',
            component: () => import('@/views/library/libraryToexamine')
        },
        {
            // 福利列表
            path: 'benifits/benifitsList',
            component: () => import('@/views/benifits/benifitsList')
        },
        {
            // 福利新增 修改
            path: 'benifits/benifitsAddEdit',
            component: () => import('@/views/benifits/benifitsAddEdit')
        },
        {
            // 福利详情
            path: 'benifits/benifitsDetail',
            component: () => import('@/views/benifits/benifitsDetail')
        },
        {
            // 福利已读未读
            path: 'benifits/benifitsReceiveAccounting',
            component: () => import('@/views/benifits/benifitsReceiveAccounting')
        },
        {
            // 福利已读未读
            path: 'benifits/benifitsReadOrNotAccounting',
            component: () => import('@/views/benifits/benifitsReadOrNotAccounting')
        },
        {
            path: 'cardManage/deviceSetting',
            component: () => import('@/views/cardManage/deviceSetting')
        },
        {
            path: 'campusFees/campusFeesindex', //校园收费首页
            component: () => import('@/views/campusFees/campusFeesindex')
        },
        {
            path: 'campusFees/campusFeesdetails', //校园收费详情
            component: () => import('@/views/campusFees/campusFeesdetails')
        },
        {
            path: 'campusFees/campusFeesReject', //校园收费驳回历史
            component: () => import('@/views/campusFees/campusFeesReject')
        },
        {
            path: 'campusFees/campusFeesqingfenlist', //校园收费驳回历史
            component: () => import('@/views/campusFees/campusFeesqingfenlist')
        },
        {
            path: 'campusFees/campusFeesadd', //校园收费新建
            component: () => import('@/views/campusFees/campusFeesadd')
        },
        {
            path: 'campusFees/campusFeesedit', //编辑
            component: () => import('@/views/campusFees/campusFeesedit')
        },
        {
            path: 'campusFees/campusFeesclasslist', //各班缴费
            component: () => import('@/views/campusFees/campusFeesclasslist')
        },
        {
            path: 'campusFees/thcampusFeesindex', //老师收费
            component: () => import('@/views/campusFees/thcampusFeesindex')
        },
        {
            path: 'campusFees/thcampusFeesadd', //老师收费新增
            component: () => import('@/views/campusFees/thcampusFeesadd')
        },
        {
            path: 'campusFees/thcampusFeesedit', //老师收费编辑
            component: () => import('@/views/campusFees/thcampusFeesedit')
        },
        {
            path: 'campusFees/thcampusFeesdetails', //老师收费详情
            component: () => import('@/views/campusFees/thcampusFeesdetails')
        },
        {
            path: 'campusFees/refunddetails', //退费详情
            component: () => import('@/views/campusFees/refunddetails')
        },
        {
            path: 'stuAttendanceRecord', // 学生考勤
            component: () => import('@/views/leaderSee/stuAttendanceRecord')
        },
        {
            path: 'stuRecordSet/index', // 学生考勤统计
            component: () => import('@/views/stuRecordSet/stuAttendanceRecordIndex')
        },
        {
            path: 'stuRecordSet/detail', // 学生考勤统计
            component: () => import('@/views/stuRecordSet/stuAttendanceRecordDetail')
        },
        {
            path: 'stuRecordSet/newindex', // 学生考勤统计
            component: () => import('@/views/stuRecordSet/newindex')
        },
        {
            path: 'stuRecordSet/newdetail', // 学生考勤统计
            component: () => import('@/views/stuRecordSet/newdetail')
        },
        {
            path: 'stuRecordSet/sum', // 学生考勤统计
            component: () => import('@/views/stuRecordSet/stuAttendanceRecordSum')
        },
        {
            path: 'dietaryManagement/dietaryManagementindex', //膳食管理
            component: () => import('@/views/dietaryManagement/dietaryManagementindex')
        },
        {
            path: 'dietaryManagement/dietaryManagementadd', //膳食管理
            component: () => import('@/views/dietaryManagement/dietaryManagementadd')
        },
        {
            path: 'dietaryManagement/dietaryManagementcopyadd', //膳食管理
            component: () => import('@/views/dietaryManagement/dietaryManagementcopyadd')
        },
        {
            path: 'dietaryManagement/dietaryManagementeidt', //膳食管理
            component: () => import('@/views/dietaryManagement/dietaryManagementeidt')
        },
        {
            path: 'dietaryManagement/dietaryManagementdetails', //膳食管理
            component: () => import('@/views/dietaryManagement/dietaryManagementdetails')
        },
        {
            path: 'dietaryManagement/dietaryManagementexpertindex', //膳食管理
            component: () => import('@/views/dietaryManagement/dietaryManagementexpertindex')
        },
        {
            path: 'dietaryManagement/dietaryManagementexpertdetails', //膳食管理
            component: () => import('@/views/dietaryManagement/dietaryManagementexpertdetails')
        },
        {
            path: 'dietaryManagement/dietaryManagementApproval', //膳食管理
            component: () => import('@/views/dietaryManagement/dietaryManagementApproval')
        },
        {
            path: 'dietaryManagement/foodbankindex', //膳食管理
            component: () => import('@/views/dietaryManagement/foodbankindex')
        },
        {
            path: 'dietaryManagement/foodbankdetails', //膳食管理
            component: () => import('@/views/dietaryManagement/foodbankdetails')
        },
        {
            path: 'dietaryManagement/dietaryManagementcopy', //膳食管理
            component: () => import('@/views/dietaryManagement/dietaryManagementcopy')
        },
        {
            path: 'dietaryManagement/schoolfoodbankindex', //膳食管理
            component: () => import('@/views/dietaryManagement/schoolfoodbankindex')
        },
        {
            path: 'dietaryManagement/schoolfoodbankadd', //膳食管理
            component: () => import('@/views/dietaryManagement/schoolfoodbankadd')
        },
        {
            path: 'dietaryManagement/schoolfoodbankeidt', //膳食管理
            component: () => import('@/views/dietaryManagement/schoolfoodbankeidt')
        },
        {
            path: 'dietaryManagement/schoolfoodbankdetails', //膳食管理
            component: () => import('@/views/dietaryManagement/schoolfoodbankdetails')
        },
        {
            path: 'studentLeave/studentLeaveStatistics', // 学生请假统计
            component: () => import('@/views/studentLeave/studentLeaveStatistics')
        },
        {
            path: 'studentLeave/studentLeaveInfo', // 学生请假详情
            component: () => import('@/views/studentLeave/studentLeaveInfo')
        },
        {
            path: 'studentLeave/schoolBoard', // 学生请假离校看板
            component: () => import('@/views/studentLeave/studentLeaveSchoolBoard')
        },
        // 运动数据统计
        {
            path: 'motionDataCollection/motionDataCollection',
            component: () => import('@/views/motionDataCollection/motionDataCollection')
        },
        //设备库
        {
            path: 'equipmentLibrary/equipmentLibraryindex',
            component: () => import('@/views/equipmentLibrary/equipmentLibraryindex')
        },

        {
            path: 'readBook/stackRoomIndex', // 书库维护
            component: () => import('@/views/readBook/stackRoomIndex')
        },
        {
            path: 'readBook/stackRoomBookIntro', // 书籍介绍
            component: () => import('@/views/readBook/stackRoomBookIntro')
        },
        {
            path: 'readBook/homeworkdesign', // 书籍介绍
            component: () => import('@/views/readBook/homeworkdesign')
        },
        {
            path: 'readBook/homeworkdesignadd', // 书籍介绍
            component: () => import('@/views/readBook/homeworkdesignadd')
        },
        {
            path: 'readBook/homeworkdesigninfo', // 书籍介绍
            component: () => import('@/views/readBook/homeworkdesigninfo')
        },
        {
            path: 'readBook/stuhomework', // 书籍介绍
            component: () => import('@/views/readBook/stuhomework')
        },
        {
            path: 'readBook/stuhomeworkadd', // 书籍介绍
            component: () => import('@/views/readBook/stuhomeworkadd')
        },
        {
            path: 'readBook/stuhomeworkinfo', // 书籍介绍
            component: () => import('@/views/readBook/stuhomeworkinfo')
        },
        {
            path: 'readBook/stackRoomReactionList', // 读后感
            component: () => import('@/views/readBook/stackRoomReactionList')
        },
        {
            path: 'readBook/stackRoomReactionAdd', // 读后感新增
            component: () => import('@/views/readBook/stackRoomReactionAdd')
        },
        {
            path: 'readBook/readTaskIndex', // 阅读任务
            component: () => import('@/views/readBook/readTaskIndex')
        },
        {
            path: 'readBook/readTaskAdd', // 阅读任务新增
            component: () => import('@/views/readBook/readTaskAdd')
        },
        {
            path: 'readBook/readTaskInfo', // 阅读任务详情
            component: () => import('@/views/readBook/readTaskInfo')
        },
        {
            path: 'readBook/readTaskRecords', // 阅读任务打卡记录
            component: () => import('@/views/readBook/readTaskRecords')
        },

        {
            path: 'classCircle/classCircleListIndex',
            component: () => import('@/views/classCircle/classCircleListIndex') // 班级圈列表页面,
        },
        {
            path: 'classCircle/classCircleDetails',
            component: () => import('@/views/classCircle/classCircleDetails') // 班级圈详情页面
        },
        {
            path: 'classCircle/classCircleSend',
            component: () => import('@/views/classCircle/classCircleSend') // 班级圈发帖页面
        },
        {
            path: 'classCircle/classlistone',
            component: () => import('@/views/classCircle/classlistone') // 班级圈统计页面
        },
        {
            path: 'classCircle/classlisttwo',
            component: () => import('@/views/classCircle/classlisttwo') // 班级圈统计页面
        },
        {
            path: 'classCircle/classlistthree',
            component: () => import('@/views/classCircle/classlistthree') // 班级圈统计页面
        },
        {
            // 荣誉管理 - 班级荣誉
            path: 'honorManagement/classHonor/index',
            component: () => import('@/views/teachingStudy/honorManagement/classHonor/index')
        },

        {
            path: 'readPunchClock/weekPlanIndex', // 阅读打卡计划完成情况
            component: () => import('@/views/readPunchClock/readPunchClockStatisticsWeekPlan')
        },
        {
            path: 'readPunchClock/punchClockIndex', // 阅读打卡打卡情况统计
            component: () => import('@/views/readPunchClock/readPunchClockStatisticsCardCondition')
        },
        {
            path: 'readPunchClock/ReadBookIndex', // 阅读打卡学生已读书籍
            component: () => import('@/views/readPunchClock/readPunchClockStatisticsReadBook')
        },
        {
            path: 'readPunchClock/classWeekPlan', // 阅读打卡周计划完成情况
            component: () => import('@/views/readPunchClock/readPunchClockClassWeekPlan')
        },
        {
            path: 'readPunchClock/studentWeekPlan', // 阅读打卡个人计划完成情况
            component: () => import('@/views/readPunchClock/readPunchClockStuReadCondition')
        },
        {
            path: 'readPunchClock/studentCardCondition', // 阅读打卡班级打卡情况
            component: () => import('@/views/readPunchClock/readPunchClockClassCardCondition')
        },
        // 家校共育 start
        {
            path: 'mentalEducation/popularization',
            component: () => import('@/views/homeSchool/mentalEducation/popularization')
        },
        {
            path: 'mentalEducation/consulting',
            component: () => import('@/views/homeSchool/mentalEducation/consulting')
        },
        {
            path: 'mentalEducation/contribution',
            component: () => import('@/views/homeSchool/mentalEducation/contribution')
        },
        {
            // 心育投稿 - 详情
            path: 'mentalEducation/contribution/detail',
            component: () => import('@/views/homeSchool/mentalEducation/contribution/detail')
        },
        {
            // 心育科普 - 详情
            path: 'mentalEducation/publicity/detail',
            component: () => import('@/views/homeSchool/mentalEducation/popularization/detail')
        },
        {
            // 心育科普 - 新增 / 编辑
            path: 'mentalEducation/publicity/form',
            component: () => import('@/views/homeSchool/mentalEducation/popularization/form')
        },
        {
            // 心育科普 - 已读列表
            path: 'mentalEducation/publicity/read',
            component: () => import('@/views/homeSchool/mentalEducation/popularization/read')
        },
        {
            // 心育科普 - 评论列表
            path: 'mentalEducation/publicity/comment',
            component: () => import('@/views/homeSchool/mentalEducation/popularization/comment')
        },
        {
            // 心育科普 - 点赞列表
            path: 'mentalEducation/publicity/raise',
            component: () => import('@/views/homeSchool/mentalEducation/popularization/raise')
        },
        {
            // 心育科普 - 已读未读列表
            path: 'mentalEducation/publicity/view',
            component: () => import('@/views/homeSchool/mentalEducation/popularization/view')
        },
        {
            // 心育咨询 - 分类设置
            path: 'mentalEducation/consulting/typeSettings/index',
            component: () => import('@/views/homeSchool/mentalEducation/consulting/typeSettings/index')
        },
        {
            // 心育咨询 - 分类设置 - 添加分类
            path: 'mentalEducation/consulting/typeSettings/form',
            component: () => import('@/views/homeSchool/mentalEducation/consulting/typeSettings/form')
        },
        {
            // 心育咨询 - 其他设置
            path: 'mentalEducation/consulting/otherSettings/form',
            component: () => import('@/views/homeSchool/mentalEducation/consulting/otherSettings/form')
        },
        {
            // 心育咨询 - 数据统计
            path: 'mentalEducation/consulting/dataStatistics/index',
            component: () => import('@/views/homeSchool/mentalEducation/consulting/dataStatistics/index')
        },
        {
            // 心育咨询 - 家长通讯录
            path: 'mentalEducation/consulting/addressBook/index',
            component: () => import('@/views/homeSchool/mentalEducation/consulting/addressBook/index')
        },
        {
            // 心育咨询 - 详情
            path: 'mentalEducation/consulting/detail/index',
            component: () => import('@/views/homeSchool/mentalEducation/consulting/detail/index')
        },
        {
            // 心育咨询 - 详情 - 回复
            path: 'mentalEducation/consulting/detail/reply',
            component: () => import('@/views/homeSchool/mentalEducation/consulting/detail/reply')
        },
        {
            // 志愿者统计  
            path: 'mentalEducation/volunteer/volunteerStatistics',
            component: () => import('@/views/homeSchool/mentalEducation/volunteer/volunteerStatistics')
        }, 
        {
            // 志愿者明细
            path: 'mentalEducation/volunteer/volunteerList',
            component: () => import('@/views/homeSchool/mentalEducation/volunteer/volunteerList')
        }, 
        {
            // 志愿者详情
            path: 'mentalEducation/volunteer/volunteerListDetail',
            component: () => import('@/views/homeSchool/mentalEducation/volunteer/volunteerListDetail')
        }, 
        {
            // 志愿推荐
            path: 'mentalEducation/volunteer/volunteerRecommendation',
            component: () => import('@/views/homeSchool/mentalEducation/volunteer/volunteerRecommendation')
        },
        {
            // 志愿推荐详情
            path: 'mentalEducation/volunteer/volunteerRecommendationDetail',
            component: () => import('@/views/homeSchool/mentalEducation/volunteer/volunteerRecommendationDetail')
        },
        // 科中育坛
        {
            // 科中育坛列表页  
            path: 'mentalEducation/kezhongyutan/kezhongyutanList',
            component: () => import('@/views/homeSchool/mentalEducation/kezhongyutan/kezhongyutanList')
        },
        {
            // 科中育坛新增
            path: 'mentalEducation/kezhongyutan/kezhongyutanActivityAdd',
            component: () => import('@/views/homeSchool/mentalEducation/kezhongyutan/kezhongyutanActivityAdd')
        },
        {
            // 科中育坛修改
            path: 'mentalEducation/kezhongyutan/kezhongyutanActivityEdit',
            component: () => import('@/views/homeSchool/mentalEducation/kezhongyutan/kezhongyutanActivityEdit')
        },
        {
            // 科中育坛详情
            path: 'mentalEducation/kezhongyutan/kezhongyutanActivityDetail',
            component: () => import('@/views/homeSchool/mentalEducation/kezhongyutan/kezhongyutanActivityDetail')
        },
        {
            // 科中育坛 - 签到详情
            path: 'mentalEducation/kezhongyutan/kezhongSignUserList',
            component: () => import('@/views/homeSchool/mentalEducation/kezhongyutan/kezhongSignUserList')
        },
         
         // 家长会
        {
            // 家长会列表页  
            path: 'mentalEducation/parent/parentList',
            component: () => import('@/views/homeSchool/mentalEducation/parent/parentList')
        },
        {
            // 家长会新增页
            path: 'mentalEducation/parent/parentActivityAdd',
            component: () => import('@/views/homeSchool/mentalEducation/parent/parentActivityAdd')
        },
        {
            // 家长会详情页
            path: 'mentalEducation/parent/parentActivityDetail',
            component: () => import('@/views/homeSchool/mentalEducation/parent/parentActivityDetail')
        },
          {
            // 家长会编辑页
            path: 'mentalEducation/parent/parentActivityEdit',
            component: () => import('@/views/homeSchool/mentalEducation/parent/parentActivityEdit')
        },
        {
            // 家长会 - 签到详情
            path: 'mentalEducation/parent/parentSignUserList',
            component: () => import('@/views/homeSchool/mentalEducation/parent/parentSignUserList')
        },
        // 家长评价
        {
            path: 'mentalEducation/evaluateParents/evaluateParents',
            component: () => import('@/views/homeSchool/mentalEducation/evaluateParents/evaluateParents')
        },
        {
            path: 'mentalEducation/evaluateParents/evaluateParentsDetail',
            component: () => import('@/views/homeSchool/mentalEducation/evaluateParents/evaluateParentsDetail')
        },
        // 家校共育 end
        {
            path: 'recipeOrdering/foodbankindex', //食谱订餐
            component: () => import('@/views/dietaryManagement/foodbankindex')
        },
        {
            path: 'recipeOrdering/foodbankdetails', //食谱订餐
            component: () => import('@/views/dietaryManagement/foodbankdetails')
        },
        {
            path: 'recipeOrdering/schoolfoodbankindex', //食谱订餐
            component: () => import('@/views/dietaryManagement/schoolfoodbankindex')
        },
        {
            path: 'recipeOrdering/schoolfoodbankadd', //食谱订餐
            component: () => import('@/views/dietaryManagement/schoolfoodbankadd')
        },
        {
            path: 'recipeOrdering/schoolfoodbankeidt', //食谱订餐
            component: () => import('@/views/dietaryManagement/schoolfoodbankeidt')
        },
        {
            path: 'recipeOrdering/schoolfoodbankdetails', //食谱订餐
            component: () => import('@/views/dietaryManagement/schoolfoodbankdetails')
        },
        {
            path: 'recipeOrdering/packageLibraryindex', //食谱订餐
            component: () => import('@/views/recipeOrdering/packageLibraryindex')
        },
        {
            path: 'recipeOrdering/packageLibraryadd', //食谱订餐
            component: () => import('@/views/recipeOrdering/packageLibraryadd')
        },
        {
            path: 'recipeOrdering/packageLibraryeidt', //食谱订餐
            component: () => import('@/views/recipeOrdering/packageLibraryeidt')
        },
        {
            path: 'recipeOrdering/orderingRecipesadd', //食谱订餐
            component: () => import('@/views/recipeOrdering/orderingRecipesadd')
        },
        {
            path: 'recipeOrdering/orderingRecipesclone', //食谱订餐
            component: () => import('@/views/recipeOrdering/orderingRecipesclone')
        },
        {
            path: 'recipeOrdering/orderingRecipesdetails', //食谱订餐
            component: () => import('@/views/recipeOrdering/orderingRecipesdetails')
        },
        {
            path: 'recipeOrdering/orderingRecipesindex', //食谱订餐
            component: () => import('@/views/recipeOrdering/orderingRecipesindex')
        },
        {
            path: 'recipeOrdering/orderingRecipeslistone', //食谱订餐
            component: () => import('@/views/recipeOrdering/orderingRecipeslistone')
        },
        {
            path: 'recipeOrdering/orderingRecipeslisttwo', //食谱订餐
            component: () => import('@/views/recipeOrdering/orderingRecipeslisttwo')
        },
        {
            path: 'recipeOrdering/orderingRecipeslistthree', //食谱订餐
            component: () => import('@/views/recipeOrdering/orderingRecipeslistthree')
        },
        {
            path: 'recipeOrdering/orderingRecipeseidt', //食谱订餐
            component: () => import('@/views/recipeOrdering/orderingRecipeseidt')
        },
        {
            path: 'recipeOrdering/statisticsone', //食谱订餐
            component: () => import('@/views/recipeOrdering/statisticsone')
        },
        {
            path: 'recipeOrdering/statisticstwo', //食谱订餐
            component: () => import('@/views/recipeOrdering/statisticstwo')
        },
        {
            path: 'recipeOrdering/statisticsthree', //食谱订餐
            component: () => import('@/views/recipeOrdering/statisticsthree')
        },
        {
            path: 'recipeOrdering/statisticsfour', //食谱订餐
            component: () => import('@/views/recipeOrdering/statisticsfour')
        },
        {
            path: 'recipeOrdering/statisticsfive', //食谱订餐
            component: () => import('@/views/recipeOrdering/statisticsfive')
        },
        {
            path: 'recipeOrdering/statistics', //食谱订餐
            component: () => import('@/views/recipeOrdering/statistics')
        },
        {
            path: 'recipeOrdering/middlePage', //食谱订餐
            component: () => import('@/views/recipeOrdering/middlePage')
        },
        {
            path: 'homeVisit/homeVisitindex', //家访
            component: () => import('@/views/homeVisit/homeVisitindex')
        },
         {
             path: 'homeVisit/homeVisitindextwo', //家访
                 component: () => import('@/views/homeVisit/homeVisitindextwo')
             }, {
                 path: 'homeVisit/homeVisitindextwoadd', //家访
                 component: () => import('@/views/homeVisit/homeVisitindextwoadd')
             }, {
                 path: 'homeVisit/homeVisitindextwoinfo', //家访
                 component: () => import('@/views/homeVisit/homeVisitindextwoinfo')
             }, {
                 path: 'homeVisit/homeVisitindextwoup', //家访
                 component: () => import('@/views/homeVisit/homeVisitindextwoup')
             }, {
            path: 'homeVisit/homeVisitadd', //家访
            component: () => import('@/views/homeVisit/homeVisitadd')
        },
        {
            path: 'homeVisit/homeVisiteidt', //家访
            component: () => import('@/views/homeVisit/homeVisiteidt')
        },
        {
            path: 'homeVisit/homeVisitdetails', //家访
            component: () => import('@/views/homeVisit/homeVisitdetails')
        },
        {
            path: 'homeVisit/speedofprogresslist', //家访
            component: () => import('@/views/homeVisit/speedofprogresslist')
        },
        {
            path: 'homeVisit/pretunelist', //家访
            component: () => import('@/views/homeVisit/pretunelist')
        },
        {
            path: 'homeVisit/entrytimelist', //家访
            component: () => import('@/views/homeVisit/entrytimelist')
        },
        {
            path: 'homeVisit/detailedrecordlist', //家访
            component: () => import('@/views/homeVisit/detailedrecordlist')
        },
        {
            path: 'homeVisit/homeVisitrecordlist', //家访
            component: () => import('@/views/homeVisit/homeVisitrecordlist')
        },
        {
            path: 'homeVisit/homeVisitViewdetails', //家访
            component: () => import('@/views/homeVisit/homeVisitViewdetails')
        },
        {
            path: 'homeVisit/homeVisitViewdetailsdetails', //家访
            component: () => import('@/views/homeVisit/homeVisitViewdetailsdetails')
        },
        {
            path: 'homeVisit/homeVisitViewdetailseidt', //家访
            component: () => import('@/views/homeVisit/homeVisitViewdetailseidt')
        },
        {
            path: 'campusCircle/campusCircleindex', //校园圈
            component: () => import('@/views/campusCircle/campusCircleindex')
        },
        {
            path: 'campusCircle/campusCircle', //校园圈
            component: () => import('@/views/campusCircle/campusCircle')
        },
        {
            path: 'campusCircle/campusCircleadd', //校园圈
            component: () => import('@/views/campusCircle/campusCircleadd')
        },
        {
            path: 'campusCircle/campusCircleeidt', //校园圈
            component: () => import('@/views/campusCircle/campusCircleeidt')
        },
        {
            path: 'campusCircle/campusCircledetails', //校园圈
            component: () => import('@/views/campusCircle/campusCircledetails')
        },
        {
            path: 'campusCircle/campusCircletype', //校园圈
            component: () => import('@/views/campusCircle/campusCircletype')
        },
        {
            path: 'campusCircle/campusCircleteacher', //校园圈
            component: () => import('@/views/campusCircle/campusCircleteacher')
        },
        {
            path: 'campusCircle/campusCircleteacheradd', //校园圈
            component: () => import('@/views/campusCircle/campusCircleteacheradd')
        },
        {
            path: 'campusCircle/campusCircleteachereidt', //校园圈
            component: () => import('@/views/campusCircle/campusCircleteachereidt')
        },
        {
            path: 'campusCircle/campusCircleteacherdetails', //校园圈
            component: () => import('@/views/campusCircle/campusCircleteacherdetails')
        },
        {
            path: 'campusCircle/campusCirclelistone', //校园圈
            component: () => import('@/views/campusCircle/campusCirclelistone')
        },
        {
            path: 'campusCircle/campusCirclelisttwo', //校园圈
            component: () => import('@/views/campusCircle/campusCirclelisttwo')
        },
        {
            path: 'campusCircle/campusCircleImport', //校园圈
            component: () => import('@/views/campusCircle/campusCircleImport')
        },
        {
            path: 'schoolCircle/index', //校园圈主页（版本2）
            component: () => import('@/views/schoolCircle/index'),
            name: 'schoolCircleIndex',
            meta: {
                isCached: true
            }
        },
        {
            path: 'schoolCircle/schoolCircleAdd', //校园圈主页（版本2）
            component: () => import('@/views/schoolCircle/schoolCircleAdd'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'schoolCircle/schoolCircleStatistics', //校园圈主页（版本2）
            component: () => import('@/views/schoolCircle/schoolCircleStatistics'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'schoolCircle/schoolCircleDetail', //校园圈主页（版本2）
            component: () => import('@/views/schoolCircle/schoolCircleDetail'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'schoolCircle/allSchoolCircleStatistics', //校园圈主页（版本2）
            component: () => import('@/views/schoolCircle/allSchoolCircleStatistics')
        },
        {
            path: 'schoolCircle/schoolCircleTypeAdd', //校园圈主页（版本2）
            component: () => import('@/views/schoolCircle/schoolCircleTypeAdd')
        },
        {
            path: 'schoolCircle/schoolCircleInvitation', //校园圈主页（版本2）
            component: () => import('@/views/schoolCircle/schoolCircleInvitation'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'childrenGrowUp/index', // 小主人成长发布会
            component: () => import('@/views/childrenGrowUp/childrenGrowUpIndex')
        },
        {
            path: 'childrenGrowUp/infoList', // 小主人成长发布会
            component: () => import('@/views/childrenGrowUp/childrenGrowUpInfoList')
        },
        {
            path: 'childrenGrowUp/info', // 小主人成长发布会
            component: () => import('@/views/childrenGrowUp/childrenGrowUpInfo')
        },
        {
            path: 'studentAttendanceLiuhe/accounting',
            component: () => import('@/views/studentAttendanceLiuhe/accounting')
        },
        {
            path: 'rollCall/rollCall',
            component: () => import('@/views/rollCall/rollCall')
        },
        {
            path: 'homeschoolthrough/homeschoolthroughapprovedetails',
            component: () => import('@/views/homeschoolthrough/homeschoolthroughapprovedetails')
        },
        {
            path: 'homeschoolthrough/homeschoolthroughapproveindex',
            component: () => import('@/views/homeschoolthrough/homeschoolthroughapproveindex')
        },
        {
            path: 'homeschoolthrough/homeschoolthroughplaceadd',
            component: () => import('@/views/homeschoolthrough/homeschoolthroughplaceadd')
        },
        {
            path: 'homeschoolthrough/homeschoolthroughplaceeidt',
            component: () => import('@/views/homeschoolthrough/homeschoolthroughplaceeidt')
        },
        {
            path: 'homeschoolthrough/homeschoolthroughplaceindex',
            component: () => import('@/views/homeschoolthrough/homeschoolthroughplaceindex')
        },
        {
            path: 'homeschoolthrough/homeschoolthroughstatistics',
            component: () => import('@/views/homeschoolthrough/homeschoolthroughstatistics')
        },
        {
            path: 'morninginspectionrobot/morninginspectionrobotindex',
            component: () => import('@/views/morninginspectionrobot/morninginspectionrobotindex')
        },
        {
            path: 'morninginspectionrobot/morninginspectionrobotdetails',
            component: () => import('@/views/morninginspectionrobot/morninginspectionrobotdetails')
        },
        {
            path: 'dataPush/dataPushindex',
            component: () => import('@/views/dataPush/dataPushindex')
        },
        {
            path: 'dataPush/dataPushadd',
            component: () => import('@/views/dataPush/dataPushadd')
        },
        {
            path: 'dataPush/dataPusheidt',
            component: () => import('@/views/dataPush/dataPusheidt')
        },
        {
            path: 'dataPush/dataPushinfo',
            component: () => import('@/views/dataPush/dataPushinfo')
        }

    ]
}
