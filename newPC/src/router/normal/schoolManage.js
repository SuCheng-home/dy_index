import printApplicationRoutes from '../modules/printApplication/printApplication'
import bookReceiveRoutes from '../modules/bookReceiveBeiyou/bookReceiveBeiyou'
import honourGradeSet from '../modules/honourGradeSet/honourGradeSet'
import distText from '../modules/distText/distText'

export default {
    path: '/main/schoolManage',
    component: () => import('@/views/layout/LowerLayout'),
    children: [
        ...printApplicationRoutes,
        ...bookReceiveRoutes,
        ...honourGradeSet,
        ...distText,
        {
            path: 'attenAccounting/extraWork/extraWorklistone', // 加班统计
            component: () => import('@/views/extraWork/extraWorklistone')
        },
        {
            path: 'attenAccounting/extraWork/extraWorklisttwo', // 加班统计
            component: () => import('@/views/extraWork/extraWorklisttwo')
        },
        {
            path: 'attenAccounting/extraWork/extraWorklistthree', // 加班统计
            component: () => import('@/views/extraWork/extraWorklistthree')
        },
        {
            path: 'extraWork/extraWorklistone', // 加班统计
            component: () => import('@/views/extraWork/extraWorklistone')
        },
        {
            path: 'extraWork/extraWorklisttwo', // 加班统计
            component: () => import('@/views/extraWork/extraWorklisttwo')
        },
        {
            path: 'extraWork/extraWorklistthree', // 加班统计
            component: () => import('@/views/extraWork/extraWorklistthree')
        },
        {
            path: 'attenAccounting/overtimeDeduction/applyList', // 加班条
            component: () => import('@/views/overtimeDeduction/overtimeDeductionApplyList')
        },
        {
            path: 'attenAccounting/overtimeDeduction/applyAdd', // 加班条添加
            component: () => import('@/views/overtimeDeduction/overtimeDeductionApplyAdd')
        },
        {
            path: 'attenAccounting/overtimeDeduction/record', // 加班抵扣记录
            component: () => import('@/views/overtimeDeduction/overtimeDeductionRecord')
        },
        {
            path: 'attenAccounting/overtimeDeduction/statistics', // 抵扣统计
            component: () => import('@/views/overtimeDeduction/overtimeDeductionStatistics')
        },
        {
            path: 'attenAccounting/overtimeDeduction/leaveCancelTicketPeriodDist',
            component: () => import('@/views/overtimeDeduction/leaveCancelTicketPeriodDist')
        },
        {
            path: 'overtimeDeduction/applyList', // 加班条
            component: () => import('@/views/overtimeDeduction/overtimeDeductionApplyList')
        },
        {
            path: 'overtimeDeduction/applyAdd', // 加班条添加
            component: () => import('@/views/overtimeDeduction/overtimeDeductionApplyAdd')
        },
        {
            path: 'overtimeDeduction/record', // 加班抵扣记录
            component: () => import('@/views/overtimeDeduction/overtimeDeductionRecord')
        },
        {
            path: 'overtimeDeduction/statistics', // 抵扣统计
            component: () => import('@/views/overtimeDeduction/overtimeDeductionStatistics')
        },
        {
            path: 'overtimeDeduction/leaveCancelTicketPeriodDist',
            component: () => import('@/views/overtimeDeduction/leaveCancelTicketPeriodDist')
        },
        {
            path: 'documentFlow/index', // 文件流转
            component: () => import('@/views/documentFlow/documentFlowIndex'),
            meta: {
                permissionPath: '/documentFlow/getDocumentFlowList'
            }
        },
        {
            path: 'documentFlow/info', // 文件流转详情
            component: () => import('@/views/documentFlow/documentFlowInfo')
        },
        {
            path: 'documentFlow/add', // 文件流转新增编辑
            component: () => import('@/views/documentFlow/documentFlowAdd')
        },
        {
            path: 'documentFlow/eidt', // 文件流转新增编辑
            component: () => import('@/views/documentFlow/documentFloweidt')
        },
          {
              path: 'documentFlow/documentFlowup', // 文件流转新增编辑
                  component: () => import('@/views/documentFlow/documentFlowup')
              }, {
            path: 'documentFlow/stepIndex', // 文件流转新增编辑
            component: () => import('@/views/documentFlow/documentFlowStepIndex')
        },
        {
            // 荣誉管理 - 学校荣誉
            path: 'honorManagement/schoolHonorStatistic/index',
            component: () => import('@/views/teachingStudy/honorManagement/schoolHonorStatistic/index')
        },
        {
            // 荣誉管理 - 学校荣誉
            path: 'honorManagement/schoolHonorStatistic/schoolHonorStatisticadd',
            component: () => import('@/views/teachingStudy/honorManagement/schoolHonorStatistic/schoolHonorStatisticadd')
        },
        {
            // 荣誉管理 - 教师荣誉
            path: 'honorManagement/teacherHonorStatistic/index',
            component: () => import('@/views/teachingStudy/honorManagement/teacherHonorStatistic/index'),
            meta: {
                permissionPath: '/teacherHonor/statistics'
            }
        },
        {
            // 荣誉管理 - 教师荣誉 - 详情
            path: 'honorManagement/teacherHonorStatistic/detail',
            component: () => import('@/views/teachingStudy/honorManagement/teacherHonorStatistic/detail')
        },

        {
            // 荣誉管理 - 学生荣誉
            path: 'honorManagement/honor/schoolTotal',
            name: 'schoolTotal',
            component: () => import('@/views/honour/schoolTotal'),
            meta: {
                permissionPath: '/schoolHonor/schoolHonorStuFile'
            }
        },
        {
            path: 'honorManagement/honor/schoolTotalDetail',
            name: 'schoolTotalDetail',
            component: () => import('@/views/honour/schoolTotalDetail')
        },
        {
            path: 'honorManagement/honor/classTotalDetail',
            name: 'classTotalDetail',
            component: () => import('@/views/honour/classTotalDetail')
        },
        {
            path: 'honorManagement/honor/classTotalDetailSec',
            name: 'classTotalDetailSec',
            component: () => import('@/views/honour/classTotalDetailSec')
        },
        {
            path: 'honorManagement/honor/classHonorList',
            name: 'classHonorList',
            component: () => import('@/views/honour/classHonorList')
        },
        {
            path: 'honorManagement/honor/schoolTotalTypeDetail',
            name: 'schoolTotalTypeDetail',
            component: () => import('@/views/honour/schoolTotalTypeDetail')
        },
        {
            path: 'honorManagement/honor/classTotalTypeDetail',
            name: 'classTotalTypeDetail',
            component: () => import('@/views/honour/classTotalTypeDetail')
        },
        {
            path: 'honorManagement/honor/studentList',
            name: 'studentList',
            component: () => import('@/views/honour/studentList')
        },
        {
            path: 'honorManagement/honor/studentDetail',
            name: 'studentDetail',
            component: () => import('@/views/honour/studentDetail')
        },
        {
            path: 'honorManagement/honor/classStatistics',
            name: 'classStatistics',
            component: () => import('@/views/honour/classStatistics')
        },
        {
            path: 'honorManagement/honor/gradeStatistics',
            name: 'gradeStatistics',
            component: () => import('@/views/honour/gradeStatistics')
        },
        {
            // 荣誉管理 - 媒体报道
            path: 'honorManagement/mediaCoverage/index',
            component: () => import('@/views/teachingStudy/honorManagement/mediaCoverage/index')
        },
        {
            // 荣誉管理 - 媒体报道 - 新增/编辑
            path: 'honorManagement/mediaCoverage/form',
            component: () => import('@/views/teachingStudy/honorManagement/mediaCoverage/form')
        },
        {
            // 荣誉管理 - 媒体报道 - 详情
            path: 'honorManagement/mediaCoverage/detail',
            component: () => import('@/views/teachingStudy/honorManagement/mediaCoverage/detail')
        },
        {
            path: 'tenEventStatistics/tenEventStaIndex', // 六十事明细
            component: () => import('@/views/tenEventStatistics/index')
        },
        {
            path: 'tenEventStatistics/tenEventStaDetail', // 六十事详情
            component: () => import('@/views/tenEventStatistics/detail')
        },

        {
            path: 'notice/noticeFromBoe',
            component: () => import('@/views/notice/noticeFromBoe') //
        },
        {
            path: 'notice/noticeDetailBoe',
            component: () => import('@/views/notice/noticeDetailBoe') //
        },
        {
            path: 'notice/noticeReplyBoe',
            component: () => import('@/views/notice/noticeReplyBoe') //
        },
        {
            path: 'news/newsIndex', // 新闻列表页
            component: () => import('@/views/news/newsIndex')
        },
        {
            path: 'news/newsAdd', // 新闻新增页
            component: () => import('@/views/news/newsAdd')
        },
        {
            path: 'news/newsDetail', // 新闻详情页
            component: () => import('@/views/news/newsDetail')
        },
        {
            path: 'news/newsEdit', // 新闻编辑页
            component: () => import('@/views/news/newsEdit')
        },
        {
            path: 'news/newsReleaseEdit', //
            component: () => import('@/views/news/newsReleaseEdit')
        },
        {
            path: 'news/commonList', // 新闻评论列表
            component: () => import('@/views/news/commonList')
        },
        {
            path: 'news/newsRebut', // 驳回详情
            component: () => import('@/views/news/newsRebut')
        },
        {
            path: 'news/newsApprovalList', // 新闻审批列表页
            component: () => import('@/views/news/newsApprovalList')
        },
        {
            path: 'news/newsApprovalDetail', // 新闻审批详情页
            component: () => import('@/views/news/newsApprovalDetail')
        },
        {
            path: 'news/newsApprovalEdit', // 新闻审批编辑页
            component: () => import('@/views/news/newsApprovalEdit')
        },
        {
            path: 'news/newsApprovalPubEdit', // 新闻审批发布之后编辑页
            component: () => import('@/views/news/newsApprovalPubEdit')
        },
        {
            path: 'recordList', // 录制申请统计
            component: () => import('@/views/record/recordList')
        },
        {
            path: 'recordDetail',
            component: () => import('@/views/record/recordDetail')
        },
        {
            path: 'attenAccounting/teacherAttendanceStatisticsIndex',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsIndex') // 教师考勤统计首页
        },

        {
            path: 'attenAccounting/teacherAttendanceStatisticsTodayList',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsTodayList') // 教师考勤统计当天统计列表
        },
        {
            path: 'attenAccounting/teacherAttendanceStatisticsList',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsList') // 教师考勤统计列表(时间段)
        },
        {
            path: 'attenAccounting/teacherAttendanceStatisticsRangeList',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsRangeList') // 教师考勤单个类型统计列表(时间段)
        },
        {
            path: 'attenAccounting/teacherAttendanceStatisticsAllTypesList',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsAllTypesList')
        },
        {
            path: 'teacherAttendance/teacherAttendanceStatisticsIndex',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsIndex') // 教师考勤统计首页
        },

        {
            path: 'teacherAttendance/teacherAttendanceStatisticsTodayList',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsTodayList') // 教师考勤统计当天统计列表
        },
        {
            path: 'teacherAttendance/teacherAttendanceStatisticsList',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsList') // 教师考勤统计列表(时间段)
        },
        {
            path: 'teacherAttendance/teacherAttendanceStatisticsRangeList',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsRangeList') // 教师考勤单个类型统计列表(时间段)
        },
        {
            path: 'teacherAttendance/teacherAttendanceStatisticsAllTypesList',
            component: () => import('@/views/teacherAttendance/teacherAttendanceStatisticsAllTypesList') // 教师考勤所有类型统计列表(时间段)
        },

        {
            path: 'leaderSee/leaderSeeIndex', // 领导看板
            component: () => import('@/views/leaderSee/leaderSeeIndex')
        },
       {
            path: 'activity/activityMyList', // 活动管理列表
            component: () => import('@/views/activity/activityMyList')
        },
        {
            path: 'activity/activityAdd', // 活动管理新增
            component: () => import('@/views/activity/activityAdd')
        },
        {
            path: 'activity/activityEdit', // 活动管理编辑
            component: () => import('@/views/activity/activityEdit')
        },
        {
            path: 'activity/activityDetail', // 活动管理详情
            component: () => import('@/views/activity/activityDetail')
        },
        {
            path: 'activity/outSignUserList', // 签到详情
            component: () => import('@/views/activity/outSignUserList')
        },
        {
            path: 'activity/interactUserList', // 互动上墙
            component: () => import('@/views/activity/interactUserList')
        },
        {
            path: 'activity/interactUserListActSignShow', // 签到上墙
            component: () => import('@/views/activity/activitySignShow')
        },
        {
            path: 'activity/signUserList', // 签到详情
            component: () => import('@/views/activity/signUserList')
        },
        {
            path: 'activity/applyUserList', // 报名详情
            component: () => import('@/views/activity/applyUserList')
        },
        {
            path: 'activity/toOptionUserListPage', // 活动调查
            component: () => import('@/views/activity/toOptionUserListPage')
        },
        {
            path: 'activity/unattendedpersonnel', // 活动调查
            component: () => import('@/views/activity/unattendedpersonnel')
        },
        {
            path: 'activity/activityMaterialList', // 资料管理
            component: () => import('@/views/activity/activityMaterialList')
        },
        {
            path: 'meeting/meetingList', // 会议签到
            component: () => import('@/views/meeting/meetingList')
        },
        {
            path: 'meeting/meetingAdd', // 新增会议
            component: () => import('@/views/meeting/meetingAdd')
        },
        {
            path: 'meeting/meetingEdit', // 编辑会议
            component: () => import('@/views/meeting/meetingEdit')
        },
        {
            path: 'meeting/meetingDetail', // 会议详情
            component: () => import('@/views/meeting/meetingDetail')
        },
        {
            path: 'meeting/meetingUser', //签到人员
            component: () => import('@/views/meeting/meetingUser')
        },
        {
            path: 'meeting/meetingNoUser', //未签到人员
            component: () => import('@/views/meeting/meetingNoUser')
        },
        {
            path: 'meeting/meetingSignUp', //签到上墙
            component: () => import('@/views/meeting/meetingSignUp')
        },
        {
            path: 'youngTeacherDevelopment/entranceIndex', //青年教师发展
            component: () => import('@/views/youngTeacherDevelopment/entranceIndex')
        },
        {
            path: 'youngTeacherDevelopment/assessmentItemSet', //考核项设置
            component: () => import('@/views/youngTeacherDevelopment/assessmentItemSet')
        },
        {
            path: 'youngTeacherDevelopment/addAndSubtractSet', //加减分项设置
            component: () => import('@/views/youngTeacherDevelopment/addAndSubtractSet')
        },
        {
            path: 'youngTeacherDevelopment/evaluateCheckList', //评价检查统计列表
            component: () => import('@/views/youngTeacherDevelopment/evaluateCheckList')
        },
        {
            path: 'youngTeacherDevelopment/evaluateCheckStatistics', //评价检查学生统计
            component: () => import('@/views/youngTeacherDevelopment/evaluateCheckStatistics')
        },
        {
            path: 'youngTeacherDevelopment/evaluateCheckDetail', //评价检查学生统计详情
            component: () => import('@/views/youngTeacherDevelopment/evaluateCheckDetail')
        },
        {
            path: 'compositeExam/dateAccountIndex', // 日期统计
            component: () => import('@/views/compositeExam/dateAccountIndex')
        },
        //pc加手机打分
        {
            path: 'compositeExam/generalCheckNList', // 综合检查值班表
            component: () => import('@/views/compositeExam/generalCheckNList')
        },
        {
            path: 'compositeExam/generalCheckN', // 综合检查列表
            component: () => import('@/views/compositeExam/generalCheckN')
        },
        {
            path: 'compositeExam/generalStarAdd', // 综合检查列表打星
            component: () => import('@/views/compositeExam/generalStarAdd')
        },
        {
            path: 'compositeExam/generalScoreAdd', // 综合检查列表打分
            component: () => import('@/views/compositeExam/generalScoreAdd')
        },
        //pc加手机打分
        {
            path: 'compositeExam/weekAccount', // 周次统计
            component: () => import('@/views/compositeExam/weekAccount')
        },
        {
            path: 'compositeExam/timeAccount', // 时间段统计
            component: () => import('@/views/compositeExam/timeAccount')
        },
        {
            path: 'compositeExam/typeAccount', // 检查项统计
            component: () => import('@/views/compositeExam/typeAccount')
        },
        {
            path: 'compositeExam/feedbackAccount', // 问题反馈记录    @date: 2020 - 12 - 04 @description: 新增"问题反馈记录"
            component: () => import('@/views/compositeExam/feedbackAccount')
        },
        {
            path: 'compositeExamTwo/compositeExamTwoIndex',
            component: () => import('@/views/compositeExamTwo/compositeExamTwoIndex')
        },
        {
            path: 'compositeExamTwo/personInCharge',
            component: () => import('@/views/compositeExamTwo/personInCharge')//责任人
        },
        {
            path: 'compositeExamTwo/personInChargeInfo',
            component: () => import('@/views/compositeExamTwo/personInChargeInfo')//责任人详情
        },
        {
            path: 'compositeExamTwo/compositeExamTwoInfo',
            component: () => import('@/views/compositeExamTwo/compositeExamTwoInfo')
        },
        {
            path: 'compositeExamTwo/compositeExamTwoNo',
            component: () => import('@/views/compositeExamTwo/compositeExamTwoNo')
        },
        {
            path: 'compositeExamTwo/compositeExamTwoYes',
            component: () => import('@/views/compositeExamTwo/compositeExamTwoYes')
        },
        {
            path: 'memorabilia/memorabiliaList', // 大事记列表-上报员
            component: () => import('@/views/memorabilia/memorabiliaList')
        },
        {
            path: 'memorabilia/addMemorabilia', // 大事记列表-上报员新增
            component: () => import('@/views/memorabilia/addMemorabilia')
        },
        {
            path: 'memorabilia/editMemorabilia', // 大事记列表-上报员编辑
            component: () => import('@/views/memorabilia/editMemorabilia')
        },
        {
            path: 'memorabilia/memorabiliaListExport', // 大事记列表-导出
            component: () => import('@/views/memorabilia/memorabiliaListExport')
        },
        {
            path: 'memorabilia/memorabiliaStatic', // 大事记列表-统计员
            component: () => import('@/views/memorabilia/memorabiliaStatic')
        },
        {
            path: 'memorabilia/memorabiliaStaticExport', // 大事记列表-导出
            component: () => import('@/views/memorabilia/memorabiliaStaticExport')
        },
        {
            path: 'memorabilia/editMemorabiliaStatic', // 大事记列表-统计员编辑
            component: () => import('@/views/memorabilia/editMemorabiliaStatic')
        },
        {
            path: 'memorabilia/detail', // 大事记 - 详情页
            component: () => import('@/views/memorabilia/detail')
        },
        {
            path: 'workPlan/workPlanindex', // 工作计划首页
            component: () => import('@/views/workPlan/workPlanindex')
        },
        {
            path: 'workPlan/planReport', // 工作计划上报
            component: () => import('@/views/workPlan/planReport')
        },
        {
            path: 'workPlan/planSummary', // 工作计划汇总
            component: () => import('@/views/workPlan/planSummary')
        },
        {
            path: 'workPlan/planAdd', //新建
            component: () => import('@/views/workPlan/planAdd')
        },
        {
            path: 'workPlan/planedit', //编辑
            component: () => import('@/views/workPlan/planedit')
        },
        {
            path: 'workPlan/plandetails', //详情
            component: () => import('@/views/workPlan/plandetails')
        },
        {
            path: 'workPlan/bigplandetails', //详情
            component: () => import('@/views/workPlan/bigplandetails')
        },
        {
            path: 'campusInspection/campusInspectionone', //校园检查
            component: () => import('@/views/campusInspection/campusInspectionone')
        },
        {
            path: 'campusInspection/campusInspectiontwo', //校园检查班级
            component: () => import('@/views/campusInspection/campusInspectiontwo')
        },
        {
            path: 'campusInspection/campusInspectionThree', //校园检查老师
            component: () => import('@/views/campusInspection/campusInspectionThree')
        },
        {
            path: 'checkFeedBack/feedBackList', //检查反馈列表
            component: () => import('@/views/checkFeedBack/feedBackList')
        },
        {
            path: 'checkFeedBack/addFeedBack', //新增检查反馈
            component: () => import('@/views/checkFeedBack/addFeedBack')
        },
        {
            path: 'checkFeedBack/feedBackDetail', //检查详情
            component: () => import('@/views/checkFeedBack/feedBackDetail')
        },
        {
            path: 'checkFeedBack/feedBackStatic', //数据统计
            component: () => import('@/views/checkFeedBack/feedBackStatic')
        },
        {
            path: 'checkFeedBack/feedBackOneList', //检查反馈列表
            component: () => import('@/views/checkFeedBack/feedBackOneList')
        },
        {
            path: 'attenAccounting/outApplyStatistics/outApplyList', //外出申请统计列表
            component: () => import('@/views/outApplyStatistics/outApplyList')
        },
        {
            path: 'attenAccounting/outApplyStatistics/outApplyAdd', //外出申请审批设置
            component: () => import('@/views/outApplyStatistics/outApplyAdd')
        },
        {
            path: 'attenAccounting/outApplyStatistics/outApplyDetail', //外出申请统计详情
            component: () => import('@/views/outApplyStatistics/outApplyDetail')
        },
        {
            path: 'outApplyStatistics/outApplyList', //外出申请统计列表
            component: () => import('@/views/outApplyStatistics/outApplyList')
        },
        {
            path: 'outApplyStatistics/outApplyAdd', //外出申请审批设置
            component: () => import('@/views/outApplyStatistics/outApplyAdd')
        },
        {
            path: 'outApplyStatistics/outApplyDetail', //外出申请统计详情
            component: () => import('@/views/outApplyStatistics/outApplyDetail')
        },
        {
            //校务日志
            path: 'schoolLog/schoolLogindex',
            component: () => import('@/views/schoolLog/schoolLogindex')
        },
        {
            //校务日志
            path: 'schoolLog/schoolLogadd',
            component: () => import('@/views/schoolLog/schoolLogadd')
        },
        {
            //校务日志
            path: 'schoolLog/schoolLogeidt',
            component: () => import('@/views/schoolLog/schoolLogeidt')
        },
        {
            //校务日志
            path: 'schoolLog/schoolLogdetailsone',
            component: () => import('@/views/schoolLog/schoolLogdetailsone')
        },
        {
            //校务日志
            path: 'schoolLog/schoolLogdetailstwo',
            component: () => import('@/views/schoolLog/schoolLogdetailstwo')
        },
        {
            //校务日志
            path: 'schoolLog/schoolLogdetailsthree',
            component: () => import('@/views/schoolLog/schoolLogdetailsthree')
        },
        {
            //校务日志
            path: 'schoolLog/schoolLogSetup',
            component: () => import('@/views/schoolLog/schoolLogSetup')
        },
        {
            //校务日志
            path: 'schoolLog/schoolLogReadlist',
            component: () => import('@/views/schoolLog/schoolLogReadlist')
        },
        {
            //校务日志
            path: 'schoolLog/schoolLogUnreadlist',
            component: () => import('@/views/schoolLog/schoolLogUnreadlist')
        },
        {
            path: 'advice/list', // 建议列表
            component: () => import('@/views/advice/adviceList')
        }, 
        {
            path: 'advice/newlist', // 建议列表
            component: () => import('@/views/advice/newadviceList')
        },
        {
            path: 'advice/info', // 建议信息
            component: () => import('@/views/advice/adviceInfo')
        },
        {
            path: 'advice/adviceStatistics', // 建议信息
            component: () => import('@/views/advice/adviceStatistics')
        },
        {
            path: 'diseaseReport/schoolIndex', // 疫情上报
            component: () => import('@/views/diseaseReport/diseaseReportSchoolIndex')
        },
        {
            path: 'diseaseReport/schoolReceipt', // 疫情上报回执单
            component: () => import('@/views/diseaseReport/diseaseReportSchoolReceipt')
        },
        {
            path: 'diseaseReport/schoolReport', // 疫情上报回执单
            component: () => import('@/views/diseaseReport/diseaseReportSchoolReport')
        },
        {
            path: 'diseaseReport/schoolListTh', // 疫情上报教师详情
            component: () => import('@/views/diseaseReport/diseaseReportSchoolListTh')
        },
        {
            path: 'diseaseReport/schoolListStu', // 疫情上报学生详情
            component: () => import('@/views/diseaseReport/diseaseReportSchoolListStu')
        },
        {
            path: 'diseaseReport/schoolFlowList', // 疫情上报流动人员情况汇总表
            component: () => import('@/views/diseaseReport/diseaseReportSchoolFlowList')
        },
        {
            path: 'diseaseReport/schoolFlowInfoList', // 疫情上报流动人员防疫信息登记表
            component: () => import('@/views/diseaseReport/diseaseReportSchoolFlowInfoList')
        },
        {
            path: 'diseaseReport/schoolOutList', // 疫情上报去国外人员
            component: () => import('@/views/diseaseReport/diseaseReportSchoolOutList')
        },
        {
            path: 'diseaseReport/schoolStuNotReport', // 疫情上报学生未上报
            component: () => import('@/views/diseaseReport/diseaseReportSchoolStuNotReport')
        },
        {
            path: 'diseaseReport/schoolRiskMemberList', // 疫情上报风险人员统计
            component: () => import('@/views/diseaseReport/diseaseReportSchoolRiskMemberList')
        },
        {
            path: 'diseaseReport/schoolRiskMemberInfo', // 疫情上报风险人员详情
            component: () => import('@/views/diseaseReport/diseaseReportSchoolRiskMemberInfo')
        },
        {
            path: 'onDuty/index', // 值班及进出校统计校端首页
            component: () => import('@/views/onDuty/onDutySchoolIndex')
        },
        {
            path: 'healthCheck/healthCheckStatic', // 体温检查
            component: () => import('@/views/healthCheck/healthCheckStatic')
        },
        {
            path: 'healthNewCheck/healthTotalList', // 晨午检统计
            component: () => import('@/views/healthNewCheck/healthTotalList')
        },
        {
            path: 'healthNewCheck/healthTeaTotalList', // 教职工统计
            component: () => import('@/views/healthNewCheck/healthTeaTotalList')
        },
        {
            path: 'healthNewCheck/healthStuTotalList', // 学生统计
            component: () => import('@/views/healthNewCheck/healthStuTotalList')
        },
        {
            path: 'ventilatearoom/ventilatearoomlist', //疫情统计
            component: () => import('@/views/ventilatearoom/ventilatearoomlist')
        },
        {
            path: 'ventilatearoom/ventilatearoomdetails', //疫情统计详情
            component: () => import('@/views/ventilatearoom/ventilatearoomdetails')
        },
        {
            path: 'schedule/schedulelist', //日程
            component: () => import('@/views/schedule/schedulelist'),
            meta: {
                permissionPath: '/calendar/calendarCount'
            }
        },
        {
            path: 'attenAccounting/teacherleave/teacherleaveindex', //老师请假统计
            name: 'teacherleaveindex',
            component: () => import('@/views/teacherleave/teacherleaveindex'),
            meta: {
                // isCached: true,
                permissionPath: '/teacherAskleave/getTeacherAskleaveStatisticalList'
            }
        },
        {
            path: 'attenAccounting/teacherleave/teacherleavelist', //老师请假统计
            name: 'teacherleavelist',
            component: () => import('@/views/teacherleave/teacherleavelist'),
            meta: {
                keepCached: true,
                isCached: true
            }
        }, 
        {
            path: 'attenAccounting/teacherleave/teacherleavedetails', //老师请假统计
            name: 'teacherleavedetails',
            component: () => import('@/views/teacherleave/teacherleavedetails'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'attenAccounting/teacherleave/daiLeaveAdd', 
            name: 'daiLeaveAdd',
            component: () => import('@/views/teacherleave/daiLeaveAdd')
        },
        {
            path: 'attenAccounting/teacherLeave4/leaveAccounting',
            component: () => import('@/views/teacherLeave4/leaveAccounting')
        }, 
        {
            path: 'attenAccounting/teacherLeave4/leaveTable',
            component: () => import('@/views/teacherLeave4/leaveTable'),
            name: 'leaveTable',
            meta: {
                isCached: true
            }
        },
         {
             path: 'attenAccounting/teacherLeave4/newleaveTable',
             component: () => import('@/views/teacherLeave4/newleaveTable'),
             name: 'newleaveTable',
             meta: {
                 isCached: true
             }
         },
        {
            path: 'attenAccounting/teacherLeave4/leaveDetail',
            component: () => import('@/views/teacherLeave4/leaveDetail'),
            name: 'leaveDetail',
            meta: {
                keepCached: true
            }
        },
         {
            path: 'attenAccounting/teacherLeave4/classScheduling',
            component: () => import('@/views/teacherLeave4/classScheduling'),
            name: 'classScheduling',
            meta: {
                keepCached: true
            }
        },
        {
            path: 'attenAccounting/teacherLeave4/createLeave',
            component: () => import('@/views/teacherLeave4/createLeave')
        },
        {
            path: 'attenAccounting/teacherLeave4/updateLeave',
            component: () => import('@/views/teacherLeave4/createLeave')
        },
        {
            path: 'attenAccounting/teacherLeave4/supplyLessonAddEdit',
            props: { isEdit: true },
            component: () => import('@/views/supplyLesson/supplyLessonAddEdit')
        },
        {
            path: 'teacherleave/teacherleaveindex', //老师请假统计
            component: () => import('@/views/teacherleave/teacherleaveindex'),
            meta: {
                permissionPath: '/teacherAskleave/getTeacherAskleaveStatisticalList'
            }
        },
        {
            path: 'teacherleave/teacherleavelist', //老师请假统计
            component: () => import('@/views/teacherleave/teacherleavelist')
        },
        {
            path: 'teacherleave/teacherleavedetails', //老师请假统计
            component: () => import('@/views/teacherleave/teacherleavedetails')
        },
        {
            path: 'teacherLeave4/leaveAccounting',
            component: () => import('@/views/teacherLeave4/leaveAccounting')
        },
        {
            path: 'teacherLeave4/leaveTable',
            component: () => import('@/views/teacherLeave4/leaveTable')
        },
        {
            path: 'teacherLeave4/leaveDetail',
            component: () => import('@/views/teacherLeave4/leaveDetail')
        },
        {
            path: 'guide/guideStatisticsDay',
            component: () => import('@/views/guide/guideStatisticsDay')
        },
        {
            path: 'guide/guideStatisticsWeek',
            component: () => import('@/views/guide/guideStatisticsWeek')
        },
        {
            path: 'guide/guideStatisticsClassify',
            component: () => import('@/views/guide/guideStatisticsClassify')
        },
        {
            path: 'guide/guideStatisticsTeacher',
            component: () => import('@/views/guide/guideStatisticsTeacher')
        },
        {
            path: 'guide/guideStatisticsGuideInfo',
            component: () => import('@/views/guide/guideStatisticsGuideInfo')
        },

        {
            path: 'newWorkPlan/newWorkPlandepartment', //工作计划
            alias: 'workPlan2/newWorkPlandepartment',
            component: () => import('@/views/newWorkPlan/newWorkPlandepartment')
        },
        {
            path: 'newWorkPlan/newWorkPlandepartmentadd', //工作计划
            alias: 'workPlan2/newWorkPlandepartmentadd',

            component: () => import('@/views/newWorkPlan/newWorkPlandepartmentadd')
        },
        {
            path: 'newWorkPlan/newWorkPlanindex', //工作计划
            alias: 'workPlan2/newWorkPlanindex',
            component: () => import('@/views/newWorkPlan/newWorkPlanindex'),
            meta: {
                permissionPath: '/growthWorkPlan/workPlanNotice'
            }
        },
        {
            path: 'newWorkPlan/newWorkPlanindextwo', //工作计划
            alias: 'workPlan2/newWorkPlanindextwo',

            component: () => import('@/views/newWorkPlan/newWorkPlanindextwo')
        },
        {
            path: 'newWorkPlan/newWorkPlanindexthree', //工作计划
            alias: 'workPlan2/newWorkPlanindexthree',

            component: () => import('@/views/newWorkPlan/newWorkPlanindexthree')
        },
        {
            path: 'newWorkPlan/newWorkPlanpersonal', //工作计划
            alias: 'workPlan2/newWorkPlanpersonal',
            component: () => import('@/views/newWorkPlan/newWorkPlanpersonal')
        },
        {
            path: 'newWorkPlan/newWorkPlanpersonaladd', //工作计划
            alias: 'workPlan2/newWorkPlanpersonaladd',
            component: () => import('@/views/newWorkPlan/newWorkPlanpersonaladd')
        },
        {
            path: 'newWorkPlan/newWorkPlanschool', //工作计划
            alias: 'workPlan2/newWorkPlanschool',
            component: () => import('@/views/newWorkPlan/newWorkPlanschool')
        },
        {
            path: 'newWorkPlan/newWorkPlanschooladd', //工作计划
            alias: 'workPlan2/newWorkPlanschooladd',
            component: () => import('@/views/newWorkPlan/newWorkPlanschooladd')
        },
         {
             path: 'newWorkPlan/newWorkPlanschooladdinfo', //工作计划
                 alias: 'workPlan2/newWorkPlanschooladdinfo',
                 component: () => import('@/views/newWorkPlan/newWorkPlanschooladdinfo')
             }, {
            path: 'newWorkPlan/newWorkPlanindexPrinting', //工作计划
            alias: 'workPlan2/newWorkPlanindexPrinting',
            component: () => import('@/views/newWorkPlan/newWorkPlanindexPrinting')
        },
        {
            path: 'newWorkPlan/newWorkPlanindextwoPrinting', //工作计划
            alias: 'workPlan2/newWorkPlanindextwoPrinting',
            component: () => import('@/views/newWorkPlan/newWorkPlanindextwoPrinting')
        },
        {
            path: 'weekWorkplan/weekWorkplanindex', //周工作计划
            component: () => import('@/views/weekWorkplan/weekWorkplanindex'),
            meta: {
                permissionPath: '/weeklyWorkplan/simple/release/list'
            }
        },
        {
            path: 'weekWorkplan/weekWorkplansetup', //周工作计划
            component: () => import('@/views/weekWorkplan/weekWorkplansetup')
        },
        {
            path: 'weekWorkplan/weekWorkplanadd', //周工作计划
            component: () => import('@/views/weekWorkplan/weekWorkplanadd')
        },
        {
            path: 'schoolMate/applyList', //校友审批
            component: () => import('@/views/schoolMate/schoolMateApplyList'),
                meta: {
                    keepCached: true,
                        isCached: true
                }
        },
        {
            path: 'schoolMate/applySet', //校友审批设置
            component: () => import('@/views/schoolMate/schoolMateApplySet')
        },
        {
            path: 'schoolMate/applyInfo', //校友审批详情
            component: () => import('@/views/schoolMate/schoolMateApplyInfo')
        },
        {
            path: 'flowBanner/list', //校友审批详情
            component: () => import('@/views/flowBanner/flowBannerList')
        },
        {
            path: 'flowBanner/setList', //校友审批详情
            component: () => import('@/views/flowBanner/flowBannerSetList')
        },
        {
            path: 'flowBanner/typeAdd', //校友审批详情
            component: () => import('@/views/flowBanner/flowBannerTypeAdd')
        },

        {
            path: 'newStuReview/newStuReviewList',
            component: r => require.ensure([], () => r(require('@/views/newStuReview/newStuReviewList')), 'newStuReviewList')
        },
        {
            path: 'attenAccounting/accountingByDate',
            component: r => require.ensure([], () => r(require('@/views/attenAccounting/accountingByDate')), 'accountingByDate')
        },
        {
            path: 'attenAccounting/abnormal',
            component: r => require.ensure([], () => r(require('@/views/attenAccounting/abnormal')), 'abnormal')
        },
         {
             path: 'attenAccounting/abnormallist',
             component: r => require.ensure([], () => r(require('@/views/attenAccounting/abnormallist')), 'abnormallist')
         },
        {
            path: 'attenAccounting/accountingByDateinfo',
            component: r => require.ensure([], () => r(require('@/views/attenAccounting/accountingByDateinfo')), 'accountingByDateinfo')
        },
        {
            path: 'attenAccounting/accountingByMonth',
            component: r => require.ensure([], () => r(require('@/views/attenAccounting/accountingByMonth')), 'accountingByMonth')
        },
        {
            path: 'attenAccounting/accountingByPerson',
            component: r => require.ensure([], () => r(require('@/views/attenAccounting/accountingByPerson')), 'accountingByPerson')
        },
        {
            path: 'attenAccounting/accountingByPersoninfo',
                component: r => require.ensure([], () => r(require('@/views/attenAccounting/accountingByPersoninfo')), 'accountingByPersoninfo')
            }, {
            path: 'yongcheguanli/yongcheguanliindex', //校友审批详情
            component: () => import('@/views/yongcheguanli/yongcheguanliindex')
        },
        {
            path: 'releaseTemplate/releaseTemplateindex',
                component: () => import('@/views/releaseTemplate/releaseTemplateindex')
            }, {
                path: 'releaseTemplate/newreleaseTemplateinfo',
                    component: () => import('@/views/releaseTemplate/newreleaseTemplateinfo')
                }, {
                    path: 'releaseTemplate/newreleaseTemplateindex',
                    component: () => import('@/views/releaseTemplate/newreleaseTemplateindex')
                }, {
                path: 'releaseTemplate/releaseTemplateadd',
                component: () => import('@/views/releaseTemplate/releaseTemplateadd')
            }, {
                path: 'releaseTemplate/releaseTemplateinfo',
                component: () => import('@/views/releaseTemplate/releaseTemplateinfo')
            }, {
                path: 'releaseTemplate/releaseTemplatereply',
                component: () => import('@/views/releaseTemplate/releaseTemplatereply')
            }, {
            path: 'dutyArrangement/dutyArrangementlist',
            component: () => import('@/views/dutyArrangement/dutyArrangementlist')
        },

        {
            path: 'dutyArrangement/dutyArrangementstatistics',
                component: () => import('@/views/dutyArrangement/dutyArrangementstatistics')
            }, {
                path: 'dutyArrangement/newdutyArrangementstatistics',
                component: () => import('@/views/dutyArrangement/newdutyArrangementstatistics')
            }, {
            path: 'dutyArrangement/dutyArrangementinfo',
            component: () => import('@/views/dutyArrangement/dutyArrangementinfo')
        }, {
            path: 'dutyArrangement/dutyArrangementadd',
            component: () => import('@/views/dutyArrangement/dutyArrangementadd')
        }, {
            path: 'dutyArrangement/arrangeadd',
            component: () => import('@/views/dutyArrangement/arrangeadd')
        }, {
            path: 'dutyArrangement/arrangelist',
            component: () => import('@/views/dutyArrangement/arrangelist')
        }, {
            path: 'dutyArrangement/arrangelistweek',
            component: () => import('@/views/dutyArrangement/arrangelistweek')
        },
        // 班级外出
        {
            path: 'classOuting/outingRecord',
            component: () => import('@/views/classOuting/outingRecord')
        },
        // 详情
        {
            path: 'classOuting/outingRecordInfo',
            component: () => import('@/views/classOuting/outingRecordInfo')
        },
        // 统计
        {
            path: 'classOuting/outingStatistics',
            component: () => import('@/views/classOuting/outingStatistics')
        },
        {
            path: 'gate/gatelist', // 进出校
            component: () => import('@/views/gate/gatelist')
        },
    ]
}
