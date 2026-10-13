import teachingGroupActivityRoutes from '../modules/teachingGroupActivity/teachingGroupActivity';
import schoolSignupHighRoutes from '../modules/schoolSignupHigh/schoolSignupHigh';

export default {
    path: '/main/teachingStudy',
    component: () => import('@/views/layout/LowerLayout'),
    children: [
        ...teachingGroupActivityRoutes,
        ...schoolSignupHighRoutes,
        {
            path: 'listenClass/statisticsIndex', // 听课预约统计
            component: () => import('@/views/listenClass/listenClassStatisticsIndex')
        },
        {
            path: 'listenClass/detailIndex', // 听课预约明细统计
            component: () => import('@/views/listenClass/listenClassDetailIndex')
        },
        {
            path: 'supplyClass/index', // 代课调课首页
            component: () => import('@/views/supplyClass/supplyClassIndex')
        },
        {
            path: 'supplyClass/addReplace', // 代课新增
            component: () => import('@/views/supplyClass/supplyClassAddReplace')
        },
        {
            path: 'supplyClass/addChange', // 调课新增
            component: () => import('@/views/supplyClass/supplyClassAddChange')
        },
        {
            path: 'supplyClass/statistics', // 代课调课统计
            component: () => import('@/views/supplyClass/supplyClassStatistics')
        },
        {
            path: 'supplyClass/offsetStatistics', // 抵扣统计
            component: () => import('@/views/supplyClass/supplyClassOffsetStatistics')
        },
        {
            path: 'supplyClass/offsetRecord', // 抵扣记录
            component: () => import('@/views/supplyClass/supplyClassOffsetRecord')
        },
        {
            path: 'supplyClass/check', // 代课调课审批
            component: () => import('@/views/supplyClass/supplyClassCheck')
        },
        {
            path: 'supplyClass/checkSupply', // 代课调课审批
            component: () => import('@/views/supplyClass/supplyClassCheckSupply')
        },
        {
            path: 'supplyClass/otheradd', // 代课调课审批
            component: () => import('@/views/supplyClass/otheradd')
        },
        {
            path: 'supplyClass/otherlist', // 代课调课审批
            component: () => import('@/views/supplyClass/otherlist')
        },
        {
            path: 'supplyLesson/supplyLessonAccounting', // 代课调课审批
            component: () => import('@/views/supplyLesson/supplyLessonAccounting')
        },
        {
            path: 'supplyLesson/supplyLessonList', // 代课调课审批
            component: () => import('@/views/supplyLesson/supplyLessonList')
        },
        {
            path: 'supplyLesson/supplyLessonAddEdit', // 代课调课审批
            component: () => import('@/views/supplyLesson/supplyLessonAddEdit')
        },
        {
            path: 'supplyLesson/supplyLessonDetailAccounting',
            component: () => import('@/views/supplyLesson/supplyLessonDetailAccounting')
        },
        {
            path: 'classScheduleCard/classScheduleCardindex',
            component: () => import('@/views/classScheduleCard/classScheduleCardindex'), // 课程表
        },
        {
            path: 'classScheduleCard/myclassScheduleCardindex',
            component: () => import('@/views/classScheduleCard/myclassScheduleCardindex'), // 课程表
        },
        {
            path: 'classScheduleCard/allclassScheduleCard',
            component: () => import('@/views/classScheduleCard/allclassScheduleCard'), // 课程表
        },
        {
            path: 'classScheduleCard/classScheduleCardadd',
            component: () => import('@/views/classScheduleCard/classScheduleCardadd'), // 课程表
        },
        {
            path: 'classScheduleCard/classScheduleCardeidt',
            component: () => import('@/views/classScheduleCard/classScheduleCardeidt'), // 课程表
        },
        {
            path: 'classScheduleCard/classScheduleCardsetup',
            component: () => import('@/views/classScheduleCard/classScheduleCardsetup'), // 课程表
        },
        {
            path: 'classScheduleCard/classScheduleCardwholeone',
            component: () => import('@/views/classScheduleCard/classScheduleCardwholeone'), // 课程表
        },
        {
            path: 'classScheduleCard/classScheduleCardwholetwo',
            component: () => import('@/views/classScheduleCard/classScheduleCardwholetwo'), // 课程表
        },
        {
            path: 'classScheduleCard/linshiindex',
            component: () => import('@/views/classScheduleCard/linshiindex'), // 课程表
        },
        {
            path: 'classScheduleCard/linshiadd',
            component: () => import('@/views/classScheduleCard/linshiadd'), // 课程表
        },
        {
            path: 'classScheduleCard/linshilist',
            component: () => import('@/views/classScheduleCard/linshilist'), // 课程表
        },
        {
            path: 'classScheduleCard/classScheduleCardwholeonedetails',
            component: () => import('@/views/classScheduleCard/classScheduleCardwholeonedetails'), // 课程表
        },
        {
            path: 'classScheduleCard/classScheduleCardwholedetails',
            component: () => import('@/views/classScheduleCard/classScheduleCardwholedetails'), // 课程表
        },
        {
            path: 'classScheduleCard/classScheduleCardwholetwodetails',
            component: () => import('@/views/classScheduleCard/classScheduleCardwholetwodetails'), // 课程表
        },
        {
            path: 'classScheduleCard/classScheduleCardwholetwodetails',
            component: () => import('@/views/classScheduleCard/classScheduleCardwholetwodetails'), // 课程表
        },
        {
            path: 'classScheduleCard/coursehourstatistics',
            component: () => import('@/views/classScheduleCard/coursehourstatistics'), // 课程表
        },
        {
            path: 'Intelligencecourse/Intelligencecourseindex',
            component: () => import('@/views/Intelligencecourse/Intelligencecourseindex'), // 智能排课首页
        },
        {
            path: 'Intelligencecourse/Intelligencecourseadd',
            component: () => import('@/views/Intelligencecourse/Intelligencecourseadd'), // 智能排课新增
        },
        {
            path: 'Intelligencecourse/Intelligencecoursedownload',
            component: () => import('@/views/Intelligencecourse/Intelligencecoursedownload'), // 智能排课下载客户端
        },
        {
            path: 'exam/index', // 考试管理主页面
            component: () => import('@/views/exam/index'),

        },
        {
            path: 'exam/examScoreMaintain', // 考试成绩录入
            component: () => import('@/views/exam/examScoreMaintain'),

        },
        {
            path: 'exam/examScoreAnalysis', // 考试成绩分析
            component: () => import('@/views/exam/examScoreAnalysis'),

        },
        {
            path: 'exam/examScoreCollect', // 成绩汇总
            component: () => import('@/views/exam/examScoreCollect'),

        },
        {
            path: 'exam/examScorePresentation', // 成绩报告
            component: () => import('@/views/exam/examScorePresentation')

        },
        {
            path: 'exam/loadStuScoreAnalysisBySchoolTimeIdAndCurrId', // 获取单个学生成绩分析图
            component: () => import('@/views/exam/loadStuScoreAnalysisBySchoolTimeIdAndCurrId'),

        }, {
            path: 'exam/studentDetails', // 获取单个学生学期平均成绩
            component: () => import('@/views/exam/studentDetails'),

        },
        {
            path: 'exam/teacherEvaluation', // 评语
            component: () => import('@/views/exam/teacherEvaluation'),

        },
        {
            path: 'chineseCharacters/chineseCharactersone', //汉字识读系统首页
            component: () => import('@/views/chineseCharacters/chineseCharactersone')
        },
        {
            path: 'chineseCharacters/chineseCharacterstwo', //汉字识读系统
            component: () => import('@/views/chineseCharacters/chineseCharacterstwo')
        },
        {
            path: 'chineseCharacters/chineseCharactersthree', //汉字识读系统
            component: () => import('@/views/chineseCharacters/chineseCharactersthree')
        },
        {
            path: 'chineseCharacters/chineseCharactersfive', //汉字识读系统
            component: () => import('@/views/chineseCharacters/chineseCharactersfive')
        },

        //记分册
        {
            path: 'recordbookindex', //首页
            name: 'recordbookindex',
            component: () => import('@/views/recordbook/recordbookindex')
        },
        {
            path: 'recordbookclassdetails', //班级
            name: 'recordbookclassdetails',
            component: () => import('@/views/recordbook/recordbookclassdetails')
        },
        {
            path: 'recordbookclassdetailsdetails', //班级详情
            name: 'recordbookclassdetailsdetails',
            component: () => import('@/views/recordbook/recordbookclassdetailsdetails')
        },
        {
            path: 'recordbookRecord', //班级录分
            name: 'recordbookRecord',
            component: () => import('@/views/recordbook/recordbookRecord')
        },
        {
            path: 'recordbookRecorddetails', //班级录分详情
            name: 'recordbookRecorddetails',
            component: () => import('@/views/recordbook/recordbookRecorddetails')
        },
        {
            path: 'questiontypesetting', //设置
            name: 'questiontypesetting',
            component: () => import('@/views/recordbook/questiontypesetting')
        },
        {
            path: 'questiontypesettingadd', //设置
            name: 'questiontypesettingadd',
            component: () => import('@/views/recordbook/questiontypesettingadd')
        },
        {
            path: 'questiontypesettingeidt', //设置
            name: 'questiontypesettingeidt',
            component: () => import('@/views/recordbook/questiontypesettingeidt')
        },
        {
            path: 'questiontypesettingSetupone', //设置
            name: 'questiontypesettingSetupone',
            component: () => import('@/views/recordbook/questiontypesettingSetupone')
        },
        {
            path: 'questiontypesettingSetuponeadd', //设置
            name: 'questiontypesettingSetuponeadd',
            component: () => import('@/views/recordbook/questiontypesettingSetuponeadd')
        },
        {
            path: 'questiontypesettingSetuponeeidt', //设置
            name: 'questiontypesettingSetuponeeidt',
            component: () => import('@/views/recordbook/questiontypesettingSetuponeeidt')
        },
        {
            path: 'questiontypesettingSetuptwo', //设置
            name: 'questiontypesettingSetuptwo',
            component: () => import('@/views/recordbook/questiontypesettingSetuptwo')
        },
        {
            path: 'questiontypesettingSetuptwoadd', //设置
            name: 'questiontypesettingSetuptwoadd',
            component: () => import('@/views/recordbook/questiontypesettingSetuptwoadd')
        },
        {
            path: 'questiontypesettingSetuptwoeidt', //设置
            name: 'questiontypesettingSetuptwoeidt',
            component: () => import('@/views/recordbook/questiontypesettingSetuptwoeidt')
        },
        {
            path: 'openClass/schoolIndex', // 学校公开课
            component: () => import('@/views/openClass/openClassSchoolIndex')
        },
        {
            path: 'openClass/myIndex', // 我的公开课
            component: () => import('@/views/openClass/openClassMyIndex')
        },
        {
            path: 'openClass/approvalIndex', // 审批公开课
            component: () => import('@/views/openClass/openClassApprovalIndex')
        },
        {
            path: 'openClass/add', // 公开课新增
            component: () => import('@/views/openClass/openClassAdd')
        },
        {
            path: 'openClass/info', // 公开课详情
            component: () => import('@/views/openClass/openClassInfo')
        },
        {
            path: 'openClass/signList', // 公开课签到列表
            component: () => import('@/views/openClass/openClassSignList')
        },
        {
            path: 'openClass/myAdd', // 我的新增
            component: () => import('@/views/openClass/openClassMyAdd')
        },
        {
            path: 'openClass/approvalInfo', // 审批页详情
            component: () => import('@/views/openClass/openClassApprovalInfo')
        },
        {
            path: 'openClass/certificateView', // 审批页详情
            component: () => import('@/views/openClass/certificateView')
        },


        {
            path: 'teachingPerformance/teachingPerformanceindex', //教师教学绩效
            component: () =>
                import('@/views/teachingPerformance/teachingPerformanceindex')
        },
        {
            path: 'teachingPerformance/teachingPerformanceadd', //教师教学绩效
            component: () =>
                import('@/views/teachingPerformance/teachingPerformanceadd')
        },
        {
            path: 'teachingPerformance/teachingPerformancedetails', //教师教学绩效
            component: () =>
                import('@/views/teachingPerformance/teachingPerformancedetails')
        },
        {
            path: 'teachingPerformance/teachingPerformancelistone', //教师教学绩效
            component: () =>
                import('@/views/teachingPerformance/teachingPerformancelistone')
        },
        {
            path: 'teachingPerformance/teachingPerformancelisttwo', //教师教学绩效
            component: () =>
                import('@/views/teachingPerformance/teachingPerformancelisttwo')
        },
        {
            path: 'teachingPerformance/teachingPerformanceyearlist', //教师教学绩效
            component: () => import('@/views/teachingPerformance/teachingPerformanceyearlist')
        },
        {
            path: 'beautifulEnglish/index', // 英语美文
            component: () => import('@/views/beautifulEnglish/beautifulEnglishIndex')
        },
        {
            path: 'beautifulEnglish/add', // 英语美文新增
            component: () => import('@/views/beautifulEnglish/beautifulEnglishAdd')
        },
        {
            path: 'beautifulEnglish/info', // 英语美文详情
            component: () => import('@/views/beautifulEnglish/beautifulEnglishInfo')
        },
        {
            path: 'yaxing/:type/yaxingList',
            component: () => import('@/views/yaxing/yaxingList')
        },
        {
            path: 'yaxing/:type/yaxingAddEdit',
            component: () => import('@/views/yaxing/yaxingAddEdit')
        },
        {
            path: 'yaxing/:type/yaxingDetail',
            component: () => import('@/views/yaxing/yaxingDetail')
        },
        // 儿童研究听课 start
        { // 儿童研究听课 - 入口页
            path: 'studySubject/index',
            component: () => import('@/views/teachingStudy/studySubject/index')
        },
        { // 儿童研究听课 - 入口页
            path: 'studySubject/organization',
            component: () => import('@/views/teachingStudy/studySubject/organization')
        },
        { // 儿童研究听课 - 入口页
            path: 'studySubject/autonomy',
            component: () => import('@/views/teachingStudy/studySubject/autonomy')
        },
        { // 儿童研究听课 - 组织听课 - 新增 / 编辑
            path: 'studySubject/organization/form',
            component: () => import('@/views/teachingStudy/studySubject/organization/form')
        },
        { // 儿童研究听课 - 组织听课 - 信息详情
            path: 'studySubject/organization/detail/index',
            component: () => import('@/views/teachingStudy/studySubject/organization/detail/index')
        },
        { // 儿童研究听课 - 组织听课 - 评价详情
            path: 'studySubject/organization/detail/evaluate/detail',
            component: () => import('@/views/teachingStudy/studySubject/organization/detail/evaluate/detail')
        },
        { // 儿童研究听课 - 自主听课 - 听课明细
            path: 'studySubject/autonomy/detail',
            component: () => import('@/views/teachingStudy/studySubject/autonomy/detail')
        },
        // 儿童研究听课 end
        {
            path: 'teacherComment/teacherCommentIndex',
            component: () => import('@/views/teacherComment/teacherCommentIndex') //教师评语
        },

        {
            path: 'evTeaKinder/evTeaList',
            component: () => import('@/views/evTeaKinder/evTeaList')
        },
        {
            path: 'evTeaKinder/evTeaAddEdit',
            component: () => import('@/views/evTeaKinder/evTeaAddEdit')
        },
        {
            path: 'evTeaKinder/evTeaDetail',
            component: () => import('@/views/evTeaKinder/evTeaDetail')
        },
        {
            path: 'evTeaKinder/evTeaTempAddEdit',
            component: () => import('@/views/evTeaKinder/evTeaTempAddEdit')
        },
        {
            path: 'evTeaKinder/evTeaTempList',
            component: () => import('@/views/evTeaKinder/evTeaTempList')
        }, {
            path: 'evTeaKinder/evTeaTempDetail',
            component: () => import('@/views/evTeaKinder/evTeaTempDetail')
        },
        {
            path: 'evTeaKinder/evTeaAccounting',
            component: () => import('@/views/evTeaKinder/evTeaAccounting')
        },
        {
            path: 'evTeaKinder/evTeaProg',
            component: () => import('@/views/evTeaKinder/evTeaProg')
        },
        {
            path: 'evTeaKinder/evTeaProgDetail',
            component: () => import('@/views/evTeaKinder/evTeaProgDetail')
        },
        {
            path: 'evTeaKinder/evTeaProgDetailResult',
            component: () => import('@/views/evTeaKinder/evTeaProgDetailResult')
        },
        {
            path: 'evTea/evTeaList',
            component: () => import('@/views/evTea/evTeaList')
        }, {
             path: 'evTea/numstatistics',
                 component: () => import('@/views/evTea/numstatistics')
             }, {
                 path: 'evTea/numstatisticsinfo',
                 component: () => import('@/views/evTea/numstatisticsinfo')
             }, {
            path: 'evTea/evTeaAddEdit',
            component: () => import('@/views/evTea/evTeaAddEdit')
        },
        {
            path: 'evTea/evTeaDetail',
            component: () => import('@/views/evTea/evTeaDetail')
        },
        {
            path: 'evTea/evTeaTempAddEdit',
            component: () => import('@/views/evTea/evTeaTempAddEdit')
        },
        {
            path: 'evTea/evTeaTempList',
            component: () => import('@/views/evTea/evTeaTempList')
        }, {
            path: 'evTea/evTeaTempDetail',
            component: () => import('@/views/evTea/evTeaTempDetail')
        },
        {
            path: 'evTea/evTeaTempDetailinfo',
            component: () => import('@/views/evTea/evTeaTempDetailinfo')
        },
        {
            path: 'evTea/newevTeaTempDetailinfo',
            component: () => import('@/views/evTea/newevTeaTempDetailinfo')
        },
        {
            path: 'evTea/evTeaAccounting',
            component: () => import('@/views/evTea/evTeaAccounting')
        },
        {
            path: 'evTea/evTeaAccountingByOpt',
            component: () => import('@/views/evTea/evTeaAccountingByOpt')
        },
        {
            path: 'evTea/evTeaAccountingByQues',
            component: () => import('@/views/evTea/evTeaAccountingByQues')
        },
        {
            path: 'evTea/evTeaAccountingByOptDetail',
            component: () => import('@/views/evTea/evTeaAccountingByOptDetail')
        },
        {
            path: 'evTea/evTeaAccountingByQuesDetail',
            component: () => import('@/views/evTea/evTeaAccountingByQuesDetail')
        },
        {
            path: 'evTea/evTeaProg',
            component: () => import('@/views/evTea/evTeaProg')
        },
        {
            path: 'evTea/evTeaProgDetail',
            component: () => import('@/views/evTea/evTeaProgDetail')
        },
        {
            path: 'evTea/evTeaProgDetailResult',
            component: () => import('@/views/evTea/evTeaProgDetailResult')
        },
        {
            path: 'readingplatform/readingplatformindex',
            component: () => import('@/views/readingplatform/readingplatformindex')
        },
        {
            path: 'readingplatform/readingplatformbasicsettings',
            component: () => import('@/views/readingplatform/readingplatformbasicsettings')
        },
        {
            path: 'readingplatform/readingplatformstateimg',
            component: () => import('@/views/readingplatform/readingplatformstateimg')
        },
        {
            path: 'readingplatform/readingplatformadministrationindex',
            component: () => import('@/views/readingplatform/readingplatformadministrationindex')
        },
        {
            path: 'readingplatform/readingplatformadministrationadd',
            component: () => import('@/views/readingplatform/readingplatformadministrationadd')
        },
        {
            path: 'readingplatform/readingplatformadministrationeidt',
            component: () => import('@/views/readingplatform/readingplatformadministrationeidt')
        },
        {
            path: 'readingplatform/readingplatformgradeindex',
            component: () => import('@/views/readingplatform/readingplatformgradeindex')
        },
        {
            path: 'readingplatform/readingplatformgradeadd',
            component: () => import('@/views/readingplatform/readingplatformgradeadd')
        },
        {
            path: 'readingplatform/readingplatformgradeeidt',
            component: () => import('@/views/readingplatform/readingplatformgradeeidt')
        },
        {
            path: 'readingplatform/readingplatformmapindex',
            component: () => import('@/views/readingplatform/readingplatformmapindex')
        },
        {
            path: 'readingplatform/readingplatformmapeidt',
            component: () => import('@/views/readingplatform/readingplatformmapeidt')
        },
        {
            path: 'readingplatform/readingplatformmapadd',
            component: () => import('@/views/readingplatform/readingplatformmapadd')
        },
        {
            path: 'readingplatform/readingplatformbookmanagementindex',
            component: () => import('@/views/readingplatform/readingplatformbookmanagementindex')
        },
        {
            path: 'readingplatform/readingplatformbookmanagementerimg',
            component: () => import('@/views/readingplatform/readingplatformbookmanagementerimg')
        },
        {
            path: 'readingplatform/readingplatformbookmanagementeidt',
            component: () => import('@/views/readingplatform/readingplatformbookmanagementeidt')
        },
        {
            path: 'readingplatform/readingplatformbookmanagementdetails',
            component: () => import('@/views/readingplatform/readingplatformbookmanagementdetails')
        },
        {
            path: 'readingplatform/readingplatformsubjectadd',
            component: () => import('@/views/readingplatform/readingplatformsubjectadd')
        },
        {
            path: 'readingplatform/readingplatformsubjectdetails',
            component: () => import('@/views/readingplatform/readingplatformsubjectdetails')
        },
        {
            path: 'readingplatform/readingplatformsubjecteidt',
            component: () => import('@/views/readingplatform/readingplatformsubjecteidt')
        },
        {
            path: 'readingplatform/readingplatformsubjectlist',
            component: () => import('@/views/readingplatform/readingplatformsubjectlist')
        },
        {
            path: 'qlth/batchManage', //青蓝同辉批次管理
            name: 'batchManage',
            component: () => import('@/views/qlth/batchManage'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'qlth/batchAdd', //青蓝同辉批次增加
            component: () => import('@/views/qlth/batchAdd'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'qlth/batchDetail', //青蓝同辉批次详情
            component: () => import('@/views/qlth/batchDetail'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'qlth/masterIndex', //青蓝同辉(师)
            component: () => import('@/views/qlth/masterIndex')
        },
        {
            path: 'qlth/masterDetail', //青蓝同辉(师)详情
            component: () => import('@/views/qlth/masterDetail')
        },
        {
            path: 'qlth/apprenticeIndex', //青蓝同辉(徒)
            component: () => import('@/views/qlth/apprenticeIndex')
        },
        {
            path: 'qlth/apprenticeDetail', //青蓝同辉(徒)详情
            component: () => import('@/views/qlth/apprenticeDetail')
        },
        {
            path: 'qlth/qlthSettingIndex', // 青蓝同辉设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/qlthSetting')), 'page'),
            name: 'qlthSettingIndex',
            meta: {
                isCached: true
            }
        },
        {
            path: 'qlth/qlthSettingAdd', // 青蓝同辉设置-新增
            component: r => require.ensure([], () => r(require('@/views/sysSet/qlthSetting/addPage')), 'page'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'qlth/qlthSettingImportPage', // 青蓝同辉设置-新增
            component: r => require.ensure([], () => r(require('@/views/sysSet/qlthSetting/importPage')), 'page'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'qlth/masterBatchDetail', // 青蓝同辉设置-新增
            component: r => require.ensure([], () => r(require('@/views/sysSet/qlthSetting/masterBatchDetail')), 'page'),
            meta: {
                keepCached: true
            }
        },
           {
               path: 'listenClassJiLu/statistics', // 听课统计
               component: () => import('@/views/leaderSee/listenClassStatistics'),
           }, {
               path: 'listenClassJiLu/detail', // 听课详情
               component: () => import('@/views/leaderSee/listenClassDetail'),
           }, {
               path: 'listenClassJiLu/listenClassDetailTeacher', // 听课详情
               component: () => import('@/views/leaderSee/listenClassDetailTeacher'),
           }, {
               path: 'listenClassJiLu/thStatistics', // 被听课统计
               component: () => import('@/views/leaderSee/listenClassTeacherStatistics'),
           },
    ]
}
