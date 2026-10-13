import studentAwarding from '../modules/studentAwarding/studentAwarding';

export default {
    path: '/main/stuEvaluate',
    component: () => import('@/views/layout/LowerLayout'),
    children: [
        ...studentAwarding,
        {
            path: 'classroomEvaluation/classroomEvaluationclassindex',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationclassindex')
        }, {
            path: 'classroomEvaluation/classroomEvaluationclasstimeinterval',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationclasstimeinterval')
        }, {
            path: 'classroomEvaluation/classroomEvaluationclasslist',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationclasslist')
        }, {
            path: 'classroomEvaluation/classroomEvaluationclasslistdetails',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationclasslistdetails')
        },
        {
            path: 'classroomEvaluation/checkWorkAttendanceStatistics',
            component: () => import('@/views/classroomEvaluation/checkWorkAttendanceStatistics')
        },
        {
            path: 'classroomEvaluate/checkWorkAttendanceStatistics',
            component: () => import('@/views/classroomEvaluation/checkWorkAttendanceStatistics')
        },


        { //德育评价
            path: 'deyu/deyuSummaryTable',
            name: 'deyuSummaryTable',
            component: () => import('@/views/deyu/deyuSummaryTable')
        }, { //德育评价
            path: 'deyu/deyuSummaryTabletwo',
            name: 'deyuSummaryTabletwo',
            component: () => import('@/views/deyu/deyuSummaryTabletwo')
        }, { //德育评价
            path: 'deyu/newdeyuSummaryTable',
            name: 'newdeyuSummaryTable',
            component: () => import('@/views/deyu/newdeyuSummaryTable')
        }, {
            path: 'deyu/deyuAccountingByDimension',
            name: 'deyuAccountingByDimension',
            component: () => import('@/views/deyu/deyuAccountingByDimension')
        }, {
            path: 'deyu/deyuAccountingPersonal',
            name: 'deyuAccountingPersonal',
            component: () => import('@/views/deyu/deyuAccountingPersonal')
        }, {
            path: 'deyu/deyuAccountingPersonalDetail',
            name: 'deyuAccountingPersonalDetail',
            component: () => import('@/views/deyu/deyuAccountingPersonalDetail')
        },

        {
            path: 'physicalHealth/fitnessList', //体质健康
            name: 'fitnessList',
            component: () => import('@/views/physicalHeadlth/fitnessList')
        },
        {
            path: 'physicalHealth/fitnessDetail',
            name: 'fitnessDetail',
            component: () => import('@/views/physicalHeadlth/fitnessDetail')
        },
        {
            path: 'physicalHealth/batchImport',
            name: 'batchImport',
            component: () => import('@/views/physicalHeadlth/batchImport')
        },
        {
            path: 'physicalHealth/itemEnter',
            name: 'itemEnter',
            component: () => import('@/views/physicalHeadlth/itemEnter')
        },
        {
            path: 'physicalHealth/addItem',
            name: 'addItem',
            component: () => import('@/views/physicalHeadlth/addItem')
        },
        {
            path: 'physicalHealth/studentEnter',
            name: 'studentEnter',
            component: () => import('@/views/physicalHeadlth/studentEnter')
        },
        {
            path: 'physicalHealth/studentList',
            name: 'studentList',
            component: () => import('@/views/physicalHeadlth/studentList')
        },
        {
            path: 'physicalHealth/studentDetail',
            name: 'studentDetail',
            component: () => import('@/views/physicalHeadlth/studentDetail')
        },
        {
            path: 'classroomEvaluation/classroomEvaluationStudent', //课堂评价
            alias: 'classroomEvaluate/classroomEvaluationStudent',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationStudent')
        },
        {
            path: 'classroomEvaluation/InitialScore', //课堂评价
            alias: 'classroomEvaluate/InitialScore',
            component: () => import('@/views/classroomEvaluation/InitialScore')
        },
        {
            path: 'classroomEvaluation/classroomEvaluationStudenttwo', //课堂评价
            alias: 'classroomEvaluate/classroomEvaluationStudenttwo',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationStudenttwo')
        },
        {
            path: 'classroomEvaluation/classroomEvaluationStatisticalchart',
            alias: 'classroomEvaluate/classroomEvaluationStatisticalchart',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationStatisticalchart')
        },
        {
            path: 'classroomEvaluation/classroomEvaluationTeacher',
            alias: 'classroomEvaluate/classroomEvaluationTeacher',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationTeacher')
        },
        {
            path: 'classroomEvaluation/classroomEvaluationdetails',
            alias: 'classroomEvaluate/classroomEvaluationdetails',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationdetails')
        },
        {
            path: 'classroomEvaluation/classroomEvaluationImport',
            alias: 'classroomEvaluate/classroomEvaluationImport',
            component: () => import('@/views/classroomEvaluation/classroomEvaluationImport')
        },
        { // 三星小雅士 - 活动列表页
            path: 'yaxing/threeStarsGentleman/index',
            component: () => import('@/views/homeSchool/yaxing/threeStarsGentleman/index')
        },
        { // 三星小雅士 - 新增 / 编辑活动页
            path: 'yaxing/threeStarsGentleman/form',
            component: () => import('@/views/homeSchool/yaxing/threeStarsGentleman/form')
        },
        { // 三星小雅士 - 活动详情页
            path: 'yaxing/threeStarsGentleman/detail/index',
            component: () => import('@/views/homeSchool/yaxing/threeStarsGentleman/detail/index')
        },
        { // 三星小雅士 - 活动详情页 - 三星小雅士列表页
            path: 'yaxing/threeStarsGentleman/detail/nameList/index',
            component: () => import('@/views/homeSchool/yaxing/threeStarsGentleman/detail/nameList/index')
        },
        { // 三星小雅士 - 活动详情页 - 三星小雅士列表页 - 维护宣传信息
            path: 'yaxing/threeStarsGentleman/detail/nameList/propaganda/form',
            component: () => import('@/views/homeSchool/yaxing/threeStarsGentleman/detail/nameList/propaganda/form')
        },
        { // 三星小雅士 - 分类页
            path: 'yaxing/threeStarsGentleman/starTypeSettings/index',
            component: () => import('@/views/homeSchool/yaxing/threeStarsGentleman/starTypeSettings/index')
        },
        { // 三星小雅士 - 评比星维护页
            path: 'yaxing/threeStarsGentleman/starTypeSettings/starSettings/index',
            component: () => import('@/views/homeSchool/yaxing/threeStarsGentleman/starTypeSettings/starSettings/index')
        },
        { // 三星小雅士 - 数据统计页
            path: 'yaxing/threeStarsGentleman/dataStatistics/index',
            component: () => import('@/views/homeSchool/yaxing/threeStarsGentleman/dataStatistics/index')
        },
        { // 三星小雅士 - 数据统计 - 按评价星统计 - 人员列表
            path: 'yaxing/threeStarsGentleman/dataStatistics/byStar/studentList/index',
            component: () => import('@/views/homeSchool/yaxing/threeStarsGentleman/dataStatistics/byStar/studentList/index')
        },

        {
            path: 'evaluateCumulative/evaluateCumulativeindex',
            component: () => import('@/views/evaluateCumulative/evaluateCumulativeindex')
        },
        {
            path: 'evaluateCumulative/evaluateCumulativedetails',
            component: () => import('@/views/evaluateCumulative/evaluateCumulativedetails')
        },
        {
            path: 'evaluateCumulative/evaluateCumulativelist',
            component: () => import('@/views/evaluateCumulative/evaluateCumulativelist')
        },
        {
            path: 'evaluateCumulative/evaluateCumulativeStatisticsone',
            component: () => import('@/views/evaluateCumulative/evaluateCumulativeStatisticsone')
        },
        {
            path: 'evaluateCumulative/evaluateCumulativeStatisticstwo',
            component: () => import('@/views/evaluateCumulative/evaluateCumulativeStatisticstwo')
        },
        {
            path: 'wtManager/wtPointRank', // 梧桐信用积分排名统计
            component: () => import('@/views/wtManager/wtPointRank')
        },
        {
            path: 'wtManager/wtAutoApply', // 自主申领单
            component: () => import('@/views/wtManager/wtAutoApply')
        },
        {
            path: 'wtManager/wtExchange', // 梧桐信用物品兑换统计
            component: () => import('@/views/wtManager/wtExchange')
        },
        {
            path: 'wtManager/wtDetail', // 梧桐信用物品兑换详情,
            name: 'wtDetail',
            component: () => import('@/views/wtManager/wtDetail')
        },
        {
            path: 'classroomEvaluationtwo/classroomEvaluationtwoone',
            component: () => import('@/views/classroomEvaluationtwo/classroomEvaluationtwoone') //课堂评价2
        },
        {
            path: 'classroomEvaluationtwo/classroomEvaluationtwotwo',
            component: () => import('@/views/classroomEvaluationtwo/classroomEvaluationtwotwo') //课堂评价2
        },
        {
            path: 'classroomEvaluationtwo/classroomEvaluationtwotwodetails',
            component: () => import('@/views/classroomEvaluationtwo/classroomEvaluationtwotwodetails') //课堂评价2
        },
        {
            path: 'classroomEvaluationtwo/classroomEvaluationtwothree',
            component: () => import('@/views/classroomEvaluationtwo/classroomEvaluationtwothree') //课堂评价2
        },
        {
            path: 'classroomEvaluationtwo/classroomEvaluationtwofour',
            component: () => import('@/views/classroomEvaluationtwo/classroomEvaluationtwofour') //课堂评价2
        },
         {
             path: 'ketanggroup/ketanggroupone',
                 component: () => import('@/views/ketanggroup/ketanggroupone')
             }, {
                 path: 'ketanggroup/ketanggrouptwo',
                 component: () => import('@/views/ketanggroup/ketanggrouptwo')
             }, {
                 path: 'ketanggroup/ketanggroupthree',
                 component: () => import('@/views/ketanggroup/ketanggroupthree')
             }, {
                 path: 'ketanggroup/ketanggroupfour',
                 component: () => import('@/views/ketanggroup/ketanggroupfour')
             }, {
                 path: 'ketanggroup/ketanggroupfourinfo',
                 component: () => import('@/views/ketanggroup/ketanggroupfourinfo')
             }, {
            path: 'integralBank/pointQueryList',
            component: () => import('@/views/integralBank/pointQueryList') // 积分查询
        },
        {
            path: 'integralBank/pointClassList',
            component: () => import('@/views/integralBank/pointClassList') // 积分查询
        },
        {
            path: 'integralBank/pointStuInfo',
            component: () => import('@/views/integralBank/pointStuInfo') // 积分查询
        },
        {
            path: 'integralBank/pointMallList',
            component: () => import('@/views/integralBank/pointMallList') // 积分商城
        },
        {
            path: 'integralBank/goodsInputRecord',
            component: () => import('@/views/integralBank/goodsInputRecord') // 入库记录
        },
        {
            path: 'integralBank/exchangeRecord',
            component: () => import('@/views/integralBank/exchangeRecord') // 兑换记录
        },
        {
            path: 'integralBank/goodsInfo',
            component: () => import('@/views/integralBank/goodsInfo') // 商品详情
        },
        {
            path: 'integralBank/operationRecord',
            component: () => import('@/views/integralBank/operationRecord') // 商品详情
        },
        {
            path: 'comprehensivepractice/comprehensivepracticeindex',
            component: () => import('@/views/comprehensivepractice/comprehensivepracticeindex')
        },
        {
            path: 'comprehensivepractice/starExchangeSet',
            component: () => import('@/views/comprehensivepractice/starExchangeSet')
        },
        {
            path: 'comprehensivepractice/activityAddTwo',
            component: () => import('@/views/comprehensivepractice/activityAddTwo')
        },
        {
            path: 'comprehensivepractice/activityAddTree',
            component: () => import('@/views/comprehensivepractice/activityAddTree')
        },
        {
            path: 'comprehensivepractice/comprehensivepracticeadd',
            component: () => import('@/views/comprehensivepractice/comprehensivepracticeadd')
        },
        {
            path: 'comprehensivepractice/comprehensivepracticedetails',
            component: () => import('@/views/comprehensivepractice/comprehensivepracticedetails')
        },
        {
            path: 'comprehensivepractice/comprehensivepracticeStatistics',
            component: () => import('@/views/comprehensivepractice/comprehensivepracticeStatistics')
        },
        {
            path: 'comprehensivepractice/comprehensivepracticeeidt',
            component: () => import('@/views/comprehensivepractice/comprehensivepracticeeidt')
        },
        {
            path: 'comprehensivepractice/evaluationsetting',
            component: () => import('@/views/comprehensivepractice/evaluationsetting')
        },
        {
            path: 'comprehensivepractice/groupingsettings',
            component: () => import('@/views/comprehensivepractice/groupingsettings')
        },
        {
            path: 'comprehensivepractice/groupingsettingseidt',
            component: () => import('@/views/comprehensivepractice/groupingsettingseidt')
        },
        {
            path: 'comprehensivepractice/groupingsettingsadd',
            component: () => import('@/views/comprehensivepractice/groupingsettingsadd')
        },
        {
            path: 'comprehensivepractice/comprehensivepracticeStatisticsdetails',
            component: () => import('@/views/comprehensivepractice/comprehensivepracticeStatisticsdetails'),
            children: [{
                    path: '',
                    redirect: 'comprehensivepracticeStatisticsdetailsone'
                },
                {
                    path: 'comprehensivepracticeStatisticsdetailsone',
                    component: () => import('@/views/comprehensivepractice/comprehensivepracticeStatisticsdetailsone')
                },
                {
                    path: 'comprehensivepracticeStatisticsdetailstwo',
                    component: () => import('@/views/comprehensivepractice/comprehensivepracticeStatisticsdetailstwo')
                },
                {
                    path: 'comprehensivepracticeStatisticsdetailsthree',
                    component: () => import('@/views/comprehensivepractice/comprehensivepracticeStatisticsdetailsthree')
                },
                {
                    path: 'comprehensivepracticeStatisticsdetailsfour',
                    component: () => import('@/views/comprehensivepractice/comprehensivepracticeStatisticsdetailsfour')
                }
            ]
        },
        {
            path: 'comprehensivepractice/thcomprehensivepracticeindex',
            component: () => import('@/views/comprehensivepractice/thcomprehensivepracticeindex')
        },
        {
            path: 'comprehensivepractice/thcomprehensivepracticeadd',
            component: () => import('@/views/comprehensivepractice/thcomprehensivepracticeadd')
        },
        {
            path: 'comprehensivepractice/thcomprehensivepracticedetails',
            component: () => import('@/views/comprehensivepractice/thcomprehensivepracticedetails'),
            children: [{
                    path: '',
                    redirect: 'thcomprehensivepracticeone'
                },
                {
                    path: 'thcomprehensivepracticeone',
                    component: () => import('@/views/comprehensivepractice/thcomprehensivepracticeone')
                },
                {
                    path: 'thcomprehensivepracticetwo',
                    component: () => import('@/views/comprehensivepractice/thcomprehensivepracticetwo')
                },
                {
                    path: 'thcomprehensivepracticethree',
                    component: () => import('@/views/comprehensivepractice/thcomprehensivepracticethree')
                },
                {
                    path: 'thcomprehensivepracticefour',
                    component: () => import('@/views/comprehensivepractice/thcomprehensivepracticefour')
                },
                {
                    path: 'thcomprehensivepracticetwoadd',
                    component: () => import('@/views/comprehensivepractice/thcomprehensivepracticetwoadd')
                },
                {
                    path: 'thcomprehensivepracticetwoeidt',
                    component: () => import('@/views/comprehensivepractice/thcomprehensivepracticetwoeidt')
                }
            ]
        },
        {
            path: 'growthArchives/growthArchivesindexone',
            component: () =>
                import('@/views/growthArchives/growthArchivesindexone')
        },
        {
            path: 'growthArchives/growthArchivesindextwo',
            component: () =>
                import('@/views/growthArchives/growthArchivesindextwo')
        },
        {
            path: 'growthArchives/growthArchivesindextwodetails',
            component: () =>
                import('@/views/growthArchives/growthArchivesindextwodetails')
        },
        {
            path: 'growthArchives/growthArchivesSetup',
            component: () =>
                import('@/views/growthArchives/growthArchivesSetup')
        },
        {
            path: 'growthArchives/growthArchivesdetails',
            component: () =>
                import('@/views/growthArchives/growthArchivesdetails')
        },
        {
            path: 'growthArchives/growthArchivesclassliststu',
            component: () =>
                import('@/views/growthArchives/growthArchivesclassliststu')
        },
        {
            path: 'growthArchives/growthArchivesReportdetails',
            component: () =>
                import('@/views/growthArchives/growthArchivesReportdetails')
        },
        {
            path: 'growthArchives/growthArchivesLeavingamessage',
            component: () =>
                import('@/views/growthArchives/growthArchivesLeavingamessage')
        },
        {
            path: 'medalExchange/medalExchangeAccounting',
            component: () => import('@/views/medalExchange/medalExchangeAccounting')
        },
        {
            path: 'medalExchange/medalExchangeList',
            component: () => import('@/views/medalExchange/medalExchangeList')
        }, {
            path: 'peanut/peanutindex',
            component: () => import('@/views/peanut/peanutindex')
        }, {
            path: 'peanut/peanutadd',
            component: () => import('@/views/peanut/peanutadd')
        }, {
            path: 'peanut/peanutstu',
            component: () => import('@/views/peanut/peanutstu')
        }, {
            path: 'peanut/peanutth',
            component: () => import('@/views/peanut/peanutth')
        }, {
            path: 'peanut/peanutthinfo',
            component: () => import('@/views/peanut/peanutthinfo')
         },
        //  五星娃综合评价
        {
            path: 'fiveStarKid/fiveStarKidList',
            component: () => import('@/views/fiveStarKid/fiveStarKidList')
        },
        {
            path: 'fiveStarKid/fiveStarKidDetails',
            component: () => import('@/views/fiveStarKid/fiveStarKidDetails')
        },
        // 慧思堂画像
        {
            path: 'hshBehaviorMan/personalPortrait',
            component: () => import('@/views/hshBehaviorMan/personalPortrait')
        },
        {
            path: 'hshBehaviorMan/personalPortraitDetail',
            component: () => import('@/views/hshBehaviorMan/personalPortraitDetail')
        },
        {
            path: 'hshBehaviorMan/groupPortrait',
            component: () => import('@/views/hshBehaviorMan/groupPortrait')
        },
        {
            path: 'hshBehaviorMan/groupPortraitDetail',
            component: () => import('@/views/hshBehaviorMan/groupPortraitDetail')
        },
        {
            path: 'hshBehaviorMan/schoolBoard',
            component: () => import('@/views/hshBehaviorMan/schoolBoard')
        },
        {
            path: 'hshBehaviorMan/classReview',
            component: () => import('@/views/hshBehaviorMan/classReview')
        },
        {
            path: 'hshBehaviorMan/classReviewDetail',
            component: () => import('@/views/hshBehaviorMan/classReviewDetail')
        },
        // 慧思堂画像
        
    ]
}
