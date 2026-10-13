export default {
    path: '/main/generalLogistics/',
    component: () => import('@/views/layout/LowerLayout'),
    children: [
        //绩效管理
        {
            path: 'performance/testAssignment', //  绩效管理
            component: () => import('@/views/performance/testAssignment')
        },
         {
             path: 'visitorReservation/index',
                 component: () => import('@/views/sysSet/visitorReservation/index')
             }, {
                 path: 'visitorReservation/visitorReservationindex',
                 component: () => import('@/views/visitorReservation/visitorReservationindex')
             }, {
                 path: 'visitorReservation/visitorReservationinfo',
                 component: () => import('@/views/visitorReservation/visitorReservationinfo')
             }, {
            path: 'performance/performanceEditRecord', // 绩效修改记录
            component: () => import('@/views/performance/performanceEditRecord')
        },
        {
            path: 'performance/editPerformance', //  修改绩效
            component: () => import('@/views/performance/editPerformance')
        },
        {
            path: 'performance/editRecord', //  绩效修改记录
            component: () => import('@/views/performance/editRecord')
        },
        {
            path: 'performance/newTask', //  新建任务
            component: () => import('@/views/performance/newTask')
        },
        {
            path: 'performance/testDetail', //  查看详情
            component: () => import('@/views/performance/testDetail')
        },
        {
            path: 'performance/reportList', //  绩效列表
            component: () => import('@/views/performance/reportList')
        },
        {
            path: 'performance/performanceReport', //  绩效上报
            component: () => import('@/views/performance/performanceReport')
        },
        {
            path: 'performance/reportSet', //  上报设置
            component: () => import('@/views/performance/reportSet')
        },
        {
            path: 'performance/reportSetAgain', //  上报设置
            component: () => import('@/views/performance/reportSetAgain')
        },
        {
            path: 'performance/writePerformance', //  填报绩效
            component: () => import('@/views/performance/writePerformance')
        },
        {
            path: 'performance/performanceCheck', //  绩效审核
            component: () => import('@/views/performance/performanceCheck')
        },
        {
            path: 'performance/check', //  绩效审核
            component: () => import('@/views/performance/check')
        },
        {
            path: 'performance/checkList', //  考核项设置
            component: () => import('@/views/performance/checkList')
        },
        {
            path: 'performance/checkListTwo', //  考核项设置
            component: () => import('@/views/performance/checkListTwo')
        },
        {
            path: 'performance/testSet', //  考核项设置
            component: () => import('@/views/performance/testSet')
        },
        {
            path: 'performance/editTask', //  修改考核任务
            component: () => import('@/views/performance/editTask')
        },
        {
            path: 'performance/taskDetail', //  考核任务详情
            component: () => import('@/views/performance/taskDetail')
        },
        {
            path: 'performance/itemList', //  考核任务详情
            component: () => import('@/views/performance/itemList')
        },
        {
            path: 'performance/itemAdd', //  考核任务详情
            component: () => import('@/views/performance/itemAdd')
        },
        {
            path: 'performance/feedbackMessageIndex', //  考核任务详情
            component: () => import('@/views/performance/feedbackMessageIndex')
        },
        // 食谱管理 start
        {
            path: 'dietMenu/dietMenuIndex', //  食谱管理
            component: () => import('@/views/dietMenu/dietMenuIndex')
        },
        // 食谱管理 end
        // 膳食管理 start
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
        // 膳食管理 end
        // 食谱通知 start
        {
            path: 'recipe/recipeIndex',
            component: () => import('@/views/recipe/recipeIndex')
        },
        {
            path: 'recipe/recipeAdd',
            component: () => import('@/views/recipe/recipeAdd')
        },
        {
            path: 'recipe/recipeDetail',
            component: () => import('@/views/recipe/recipeDetail')
        },
        // 食谱通知 end

        // 报修 start
        {
            path: 'repairManage/repairIndex',
            component: () => import('@/views/repairManage/repairIndex'), //处理列表页
            meta: {
                permissionPath: '/repair/repairList'
            }
        },
        {
            path: 'repairManage/updateDealRepair', // 处理列表页跳转详情
            component: () => import('@/views/repairManage/updateDealRepair')
        },
        {
            path: 'repairManage/repairAccountingIndex',
            component: () => import('@/views/repairManage/repairAccountingIndex')
        },
        {
            path: 'repairManage/repairAccountingDetail',
            component: () => import('@/views/repairManage/repairAccountingDetail')
        },
        {
            path: 'repairManage/repairSet/repairTypeListIndex', // 报修类型列表页
            component: r => require.ensure([], () => r(require('@/views/sysSet/repairSet/repairTypeListIndex')), 'page')
        },
        {
            path: 'repairManage/repairSet/repairTypeEditIndex', // 报修类型修改页
            component: r => require.ensure([], () => r(require('@/views/sysSet/repairSet/repairTypeEditIndex')), 'page')
        },
        {
            path: 'repairManage/repairSet/reminderSettings', // 报修类型修改页
            component: r => require.ensure([], () => r(require('@/views/sysSet/repairSet/reminderSettings')), 'page')
        },
        {
            path: 'repairManage/repairSet/repairTypeAdd', // 报修类型新增页
            component: r => require.ensure([], () => r(require('@/views/sysSet/repairSet/repairTypeAdd')), 'page')
        },
        {
            path: 'repairManage/repairAddressSet/repairAddressSetIndex', // 报修地点新增页
            component: r => require.ensure([], () => r(require('@/views/sysSet/repairAddressSet/repairAddressSetIndex')), 'page')
        },
        // 报修 end
        // 资源预约 start
        {
            path: 'resourceOrder/resourceOrderIndex', // 资源预约 预约列表页
            component: () => import('@/views/resourceOrder/resourceOrderIndex')
        },
        {
            path: 'resourceOrder/resourceOrderMyOrder', // 资源预约 我的预约
            component: () => import('@/views/resourceOrder/resourceOrderMyOrder')
        },
        {
            path: 'resourceOrder/resourceOrderAdd', // 资源预约 预约页
            component: () => import('@/views/resourceOrder/resourceOrderAdd')
        },
        {
            path: 'resourceOrder/resourceOrderTodayDetail', // 资源预约 当日明细
            component: () => import('@/views/resourceOrder/resourceOrderTodayDetail')
        },
        {
            path: 'resourceOrder/resourceOrderDetail', // 资源预约 详情
            component: () => import('@/views/resourceOrder/resourceOrderDetail')
        },
        {
            path: 'resourceOrder/resourceExamineIndex', // 资源审批 列表
            component: () => import('@/views/resourceExamine/resourceExamineIndex')
        },
        {
            path: 'resourceOrder/resourceOrderSummary', //校友审批详情
            component: () => import('@/views/resourceOrder/resourceOrderSummary')
        },
        {
            path: 'resourceOrder/parentResourceStatistics', //校友审批详情
            component: () => import('@/views/resourceOrder/parentResourceStatistics')
        },
        {
            path: 'resourceExamine/resourceExamineDetail', // 资源审批 详情
            component: () => import('@/views/resourceExamine/resourceExamineDetail')
        },
        {
            path: 'resourceExamine/resourceExamineApproval', // 资源审批 具体审批页
            component: () => import('@/views/resourceExamine/resourceExamineApproval')
        },

        // 资源预约 end
        // 寻物招领 start
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationIndexV2',
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationIndexV2'),
            meta: {
                permissionPath: 'lostDeclare/lostDeclareBySchoolId'
            }
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationSearchNoticeV2',
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationSearchNoticeV2')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationExamine',
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationExamine')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationIndex', // 失物申报招领首页
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationIndex')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationDetails', // 寻物招领招领详情
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationDetails')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationAdd', // 创建寻物启事
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationAdd')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationList', // 失物申报招领启示列表
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationList')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationListReply', // 失物申报招领回复列表
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationListReply')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationDeclareDetails', // 申报详情
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationDeclareDetails')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationCollarAdd', // 创建招领
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationCollarAdd')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationCollarEdit', // 编辑寻物启事
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationCollarEdit')
        },
        {
            path: 'lostPropertyDeclaration/lostPropertyDeclarationCollarEditRecruit', // 编辑招领启事
            component: () => import('@/views/lostPropertyDeclaration/lostPropertyDeclarationCollarEditRecruit')
        },
        // 寻物招领 end
        // 工资管理 start
        {
            path: 'wages/wagesindex', //工资管理
            component: () => import('@/views/wages/wagesindex')
        },
        {
            path: 'wages/wagesImport', //工资管理
            component: () => import('@/views/wages/wagesImport')
        },
        {
            path: 'wages/wagestypeindex', //工资管理
            component: () => import('@/views/wages/wagestypeindex')
        },
        {
            path: 'wages/wagestypeadd', //工资管理
            component: () => import('@/views/wages/wagestypeadd')
        },
        {
            path: 'wages/wagestypeeidt', //工资管理
            component: () => import('@/views/wages/wagestypeeidt')
        },
        {
            path: 'wages/wagestypedetails', //工资管理
            component: () => import('@/views/wages/wagestypedetails')
        },
        {
            path: 'wages/wagesSupplement', //工资管理
            component: () => import('@/views/wages/wagesSupplement')
        },
        {
            path: 'wages/wageslistone', //工资管理
            component: () => import('@/views/wages/wageslistone')
        },
        {
            path: 'wages/wageslistoneadd', //工资管理
            component: () => import('@/views/wages/wageslistoneadd')
        },
        {
            path: 'wages/wageslistoneeidt', //工资管理
            component: () => import('@/views/wages/wageslistoneeidt')
        },
        {
            path: 'wages/wageslistonedetails', //工资管理
            component: () => import('@/views/wages/wageslistonedetails')
        },
        {
            path: 'wages/wageslisttwo', //工资管理
            component: () => import('@/views/wages/wageslisttwo')
        },
        {
            path: 'wages/wageslisttwoadd', //工资管理
            component: () => import('@/views/wages/wageslisttwoadd')
        },
        {
            path: 'wages/wageslisttwoeidt', //工资管理
            component: () => import('@/views/wages/wageslisttwoeidt')
        },
        {
            path: 'wages/wageslisttwodetails', //工资管理
            component: () => import('@/views/wages/wageslisttwodetails')
        },
        // 工资管理 end
        // 收退费 start
        {
            path: 'campusFees/campusFeesindex', //校园收费首页
            component: () => import('@/views/campusFees/campusFeesindex'),
            meta: {
                isCached: true
            }
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
            component: () => import('@/views/campusFees/thcampusFeesindex'),
            meta: {
                isCached: true
            }
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
            path: 'campusFees/nonTaxRefundAdd',
            component: () => import('@/views/campusFees/nonTaxRefundAdd')
        },
        {
            path: 'campusFees/nonTaxRefundIndex',
            component: () => import('@/views/campusFees/nonTaxRefundIndex')
        },
        {
            path: 'campusFees/nonTaxRefundList',
            component: () => import('@/views/campusFees/nonTaxRefundList')
        },
        {
            path: 'campusFees/nonTaxRefundListeidt',
            component: () => import('@/views/campusFees/nonTaxRefundListeidt')
        },
        {
            path: 'campusFees/campusFeesqingfenlist', //老师收费详情
            component: () => import('@/views/campusFees/campusFeesqingfenlist')
        },
        {
            path: 'campusFees/refunddetails', //退费详情
            component: () => import('@/views/campusFees/refunddetails')
        },
        // 收退费 end
        // 福利发放 start
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
        // 福利发放 end
        // 采购申请 start
        {
            path: 'purchasing/purchasingList',
            component: () => import('@/views/purchasing/purchasingList'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'purchasing/purchasingDetail',
            component: () => import('@/views/purchasing/purchasingDetail')
        },
        // 采购申请 end
        // 宿舍管理 start
        {
            path: 'dormitory/entranceIndex', // 宿舍管理入口页
            component: () => import('@/views/dormitoryManagement/dormitoryEntranceIndex')
        },
        {
            path: 'dormitory/manage', // 宿舍管理
            component: () => import('@/views/dormitoryManagement/dormitoryManageIndex'),
            children: [{
                    path: '',
                    redirect: 'building'
                },
                {
                    path: 'building', // 宿舍列表
                    component: () => import('@/views/dormitoryManagement/dormitoryManageBuilding')
                },
                {
                    path: 'buildingAdd', // 宿舍楼新增
                    component: () => import('@/views/dormitoryManagement/dormitoryManageBuildingAdd')
                },
                {
                    path: 'roomAdd', // 宿舍新增
                    component: () => import('@/views/dormitoryManagement/dormitoryManageRoomAdd')
                },
                {
                    path: 'roomInfo', // 宿舍信息
                    component: () => import('@/views/dormitoryManagement/dormitoryManageRoomInfo')
                }
            ]
        },
        {
            path: 'cardManage/deviceSetting',
            component: () => import('@/views/cardManage/deviceSetting')
        },
        {
            path: 'dormitory/entryExitRecords', // 进出记录
            component: () => import('@/views/dormitoryManagement/dormitoryEntryExitRecords')
        },
        {
            path: 'dormitory/checkInStatistics', // 入住统计
            component: () => import('@/views/dormitoryManagement/dormitoryCheckInStatistics')
        },
        {
            path: 'dormitory/checkInRoomInfo', // 入住统计详情
            component: () => import('@/views/dormitoryManagement/dormitoryCheckInRoomInfo')
        },
        {
            path: 'dormitory/retirementWarning', // 归寝预警
            component: () => import('@/views/dormitoryManagement/dormitoryRetirementWarning')
        },
        {
            path: 'dormitory/statisticByWeekOrMonth', // 归寝预警
            component: () => import('@/views/dormitoryManagement/statisticByWeekOrMonth')
        },
        // 宿舍管理 end

        {
            path: 'fire/statisticsDetail', // 停伙统计
            component: () => import('@/views/fire/statisticsDetail')
        },
        {
            path: 'fire/statisticsIndex', // 停伙统计
            component: () => import('@/views/fire/statisticsIndex')
        },
        {
            path: 'fire/monthStatisticsIndex', // 停伙统计
            component: () => import('@/views/fire/monthStatisticsIndex')
        },
        {
            path: 'fire/getFireRecordMonth', // 停伙统计
            component: () => import('@/views/fire/getFireRecordMonth')
        },
        {
            path: 'fire/lack', // 缺餐统计
            component: () => import('@/views/fire/lack')
        },
        {
            path: 'fire/addition', // 加餐统计
            component: () => import('@/views/fire/addition')
        },
        {
            path: 'fire/stopDietForStu', // 加餐统计
            component: () => import('@/views/fire/stopDietForStu')
        },
        {
            path: 'fire/stopDietForTh', // 加餐统计
            component: () => import('@/views/fire/stopDietForTh')
        },
        {
            //停伙退费
            path: 'mealSuspend/restaurantRefundindex',
            component: () => import('@/views/mealSuspend/restaurantRefundindex')
        },
        {
            //停伙退费
            path: 'mealSuspend/restaurantRefunddetails',
            component: () => import('@/views/mealSuspend/restaurantRefunddetails')
        },
        {
            //停伙退费
            path: 'mealSuspend/restaurantRefundadd',
            component: () => import('@/views/mealSuspend/restaurantRefundadd')
        },
        {
            //停伙退费
            path: 'mealSuspend/restaurantRefundNextstep',
            component: () => import('@/views/mealSuspend/restaurantRefundNextstep')
        },
        {
            //就餐停伙登记
            path: 'mealSuspend/restaurantRefundregister',
            component: () => import('@/views/mealSuspend/restaurantRefundregister')
        },
        {
            //就餐停伙统计
            path: 'mealSuspend/restaurantRefundEat',
            component: () => import('@/views/mealSuspend/restaurantRefundEat')
        },
        {
            //就餐停伙收费
            path: 'mealSuspend/restaurantRefundcharget',
            component: () => import('@/views/mealSuspend/restaurantRefundcharget')
        },
        {
            //就餐停伙  基础统计
            path: 'mealSuspend/baseStatistics',
            component: () => import('@/views/mealSuspend/baseStatistics')
        },
        {
            path: 'mealSuspend/getFireRecordMonth', // 停伙统计
            component: () => import('@/views/fire/getFireRecordMonth')
        },
        {
            //就餐停伙 统计报表
            path: 'mealSuspend/statisticalReport',
            component: () => import('@/views/mealSuspend/statisticalReport')
        },
        {
            path: 'newfire/diningsurveyindex',
            component: () => import('@/views/diningsurvey/diningsurveyindex')
        },
        {
            path: 'newfire/diningsurveyadd',
            component: () => import('@/views/diningsurvey/diningsurveyadd')
        },
        {
            path: 'newfire/diningsurveyinfo',
            component: () => import('@/views/diningsurvey/diningsurveyinfo')
        },
        {
            path: 'newfire/diningsurveyinfotwo',
            component: () => import('@/views/diningsurvey/diningsurveyinfotwo')
        },
        {
            path: 'newfire/diningsurveyeidt',
            component: () => import('@/views/diningsurvey/diningsurveyeidt')
        },
        {
            path: 'newfire/bookingstatistics',
            component: () => import('@/views/diningsurvey/bookingstatistics')
        },
        {
            path: 'newfire/bookingstatisticsadd',
            component: () => import('@/views/diningsurvey/bookingstatisticsadd')
        },
        {
            path: 'newfire/bookingstatisticsinfo',
            component: () => import('@/views/diningsurvey/bookingstatisticsinfo')
        },
        {
            path: 'newfire/bookingstatisticsinfotwo',
            component: () => import('@/views/diningsurvey/bookingstatisticsinfotwo')
        },
        {
            path: 'newfire/bookingstatisticsinfoclass',
            component: () => import('@/views/diningsurvey/bookingstatisticsinfoclass')
        },
        {
            path: 'newfire/diningsurveyaddpeople',
            component: () => import('@/views/diningsurvey/diningsurveyaddpeople')
        },
        {
            path: 'newfire/everydayindex',
            component: () => import('@/views/diningsurvey/everydayindex'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'newfire/everydayinfo',
            component: () => import('@/views/diningsurvey/everydayinfo')
        },
        {
            path: 'newfire/everydayinfotwo',
            component: () => import('@/views/diningsurvey/everydayinfotwo')
        },
        // {
        // 	//就餐停伙统计
        // 	path: 'mealSuspend/mealCeasefireStatistics',
        // 	component: () => import('@/views/mealSuspend/mealCeasefireStatistics')
        // },
        {
            //加餐统计
            path: 'mealSuspend/addEatingStatistics',
            component: () => import('@/views/mealSuspend/addEatingStatistics')
        },
        {
            //缺餐统计
            path: 'mealSuspend/lackEatingStatistics',
            component: () => import('@/views/mealSuspend/lackEatingStatistics')
        },
        {
            //个人停伙统计次数
            path: 'mealSuspend/personalMealsuspend',
            component: () => import('@/views/mealSuspend/personalMealsuspend')
        },

        {
            path: 'foodReservation/foodReservationindex', //食品预订
            component: () => import('@/views/foodReservation/foodReservationindex')
        },
        {
            path: 'foodReservation/foodReservationclassification', //食品预订
            component: () => import('@/views/foodReservation/foodReservationclassification')
        },
        {
            path: 'foodReservation/foodReservationclassificationadd', //食品预订
            component: () => import('@/views/foodReservation/foodReservationclassificationadd')
        },
        {
            path: 'foodReservation/foodReservationclassificationeidt', //食品预订
            component: () => import('@/views/foodReservation/foodReservationclassificationeidt')
        },
        {
            path: 'foodReservation/foodReservationlibraryindex', //食品预订
            component: () => import('@/views/foodReservation/foodReservationlibraryindex')
        },
        {
            path: 'foodReservation/foodReservationlibraryadd', //食品预订
            component: () => import('@/views/foodReservation/foodReservationlibraryadd')
        },
        {
            path: 'foodReservation/foodReservationlibraryeidt', //食品预订
            component: () => import('@/views/foodReservation/foodReservationlibraryeidt')
        },
        {
            path: 'foodReservation/foodReservationrelease', //食品预订
            component: () => import('@/views/foodReservation/foodReservationrelease')
        },
        {
            path: 'foodReservation/foodReservationorderone', //食品预订
            component: () => import('@/views/foodReservation/foodReservationorderone')
        },
        {
            path: 'foodReservation/foodReservationordertwo', //食品预订
            component: () => import('@/views/foodReservation/foodReservationordertwo')
        },
        {
            path: 'foodReservation/foodReservationorderthree', //食品预订
            component: () => import('@/views/foodReservation/foodReservationorderthree')
        },
        {
            path: 'foodReservation/foodReservationorderfour', //食品预订
            component: () => import('@/views/foodReservation/foodReservationorderfour')
        },
        {
            path: 'foodReservation/foodReservationorderpersonal', //食品预订
            component: () => import('@/views/foodReservation/foodReservationorderpersonal')
        },
        {
            path: 'foodReservation/foodReservationorderdetails', //食品预订
            component: () => import('@/views/foodReservation/foodReservationorderdetails')
        }, 
        {
            path: 'itemManagement/newitemManagementStatisticsindex', //物品管理
            component: () => import('@/views/itemManagement/newitemManagementStatisticsindex')
        },
        {
            path: 'itemManagement/itemManagementStatisticsindex', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticsindex'),
            meta: {
                permissionPath: '/good/queryOrderBySchoolId'
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticsfour', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticsfour'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticsfive', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticsfive'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticsone', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticsone'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticssix', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticssix'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticssixone', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticssixone'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticssixtwo', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticssixtwo'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticssixthree', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticssixthree'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticssixfour', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticssixfour'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/goodsCollectlistallbig', //列表
            component: () => import('@/views/itemManagement/goodsCollectlistallbig')
        },
        {
            path: 'itemManagement/itemManagementStatisticsthree', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticsthree'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticstwo', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticstwo'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'itemManagement/itemManagementStatisticsdepartment', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticsdepartment')
        },
        {
            path: 'itemManagement/itemManagementStatisticsreturn', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticsreturn')
        },
        {
            path: 'itemManagement/itemManagementStatisticsreturninfo', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticsreturninfo')
        },
        {
            path: 'itemManagement/itemManagementStatisticsteacher', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticsteacher')
        },
        {
            path: 'itemManagement/itemManagementStatisticslist', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticslist')
        },
        {
            path: 'itemManagement/itemManagementStatisticslistlist', //物品管理
            component: () => import('@/views/itemManagement/itemManagementStatisticslistlist')
        },
         {
             path: 'itemManagement/newgoodsindex', // 宿舍管理
             component: () => import('@/views/itemManagement/newgoodsindex'),
             children: [{
                     path: '',
                     redirect: 'newgoodslist'
                 },
                 {
                     path: 'newgoodslist', //列表
                     component: () => import('@/views/itemManagement/newgoodslist')
                 },
             ]
         },
        {
            path: 'itemManagement/goodsindex', // 宿舍管理
            component: () => import('@/views/itemManagement/goodsindex'),
            children: [{
                    path: '',
                    redirect: 'goodslist'
                },
                {
                    path: 'goodslist', //列表
                    component: () => import('@/views/itemManagement/goodslist')
                },
                {
                    path: 'goodsCollectlist', //列表
                    component: () => import('@/views/itemManagement/goodsCollectlist')
                },
                {
                    path: 'goodsCollectlistall', //列表
                    component: () => import('@/views/itemManagement/goodsCollectlistall')
                },
                {
                    path: 'goodsWarehousinglist', //列表
                    component: () => import('@/views/itemManagement/goodsWarehousinglist')
                },
                {
                    path: 'goodstypeadd', //列表
                    component: () => import('@/views/itemManagement/goodstypeadd')
                },
                {
                    path: 'goodstypeeidt', //列表
                    component: () => import('@/views/itemManagement/goodstypeeidt')
                },
                {
                    path: 'goodsadd', //列表
                    component: () => import('@/views/itemManagement/goodsadd')
                },
                {
                    path: 'goodseidt', //列表
                    component: () => import('@/views/itemManagement/goodseidt')
                }
            ]
        },
        {
            path: 'workingMeal/workingMeallistone', //工餐统计
            component: () => import('@/views/workingMeal/workingMeallistone')
        },
        {
            path: 'workingMeal/workingMeallisttwo', //工餐统计
            component: () => import('@/views/workingMeal/workingMeallisttwo')
        },
        {
            path: 'recipeManage/list', // 食谱管理
            component: () => import('@/views/recipeManage/recipeManageList'),
            meta: {
                permissionPath: '/dietMenu/dietMenuList'
            }
        },
        {
            path: 'recipeManage/add', // 食谱管理
            component: () => import('@/views/recipeManage/recipeAdd')
        },
        {
            path: 'recipeManage/info', // 食谱管理
            component: () => import('@/views/recipeManage/recipeInfo')
        },
        {
            path: 'recipeManage/platformList', // 食谱管理
            component: () => import('@/views/recipeManage/dishesPlatformList')
        },
        {
            path: 'recipeManage/schoolList', // 食谱管理
            component: () => import('@/views/recipeManage/dishesSchoolList')
        },
        {
            path: 'fire/newrestaurantRefundindex', //停伙退费
            component: () => import('@/views/nwerestaurantRefund/newrestaurantRefundindex')
        },
        {
            path: 'fire/newrestaurantRefunddetails', //停伙退费
            component: () => import('@/views/nwerestaurantRefund/newrestaurantRefunddetails')
        },
        {
            path: 'fire/newrestaurantRefundadd', //停伙退费
            component: () => import('@/views/nwerestaurantRefund/newrestaurantRefundadd')
        },
        {
            path: 'newcharge/transactionFlow',
            component: () => import('@/views/newcharge/transactionFlow')
        },
        {
            path: 'newcharge/distributionrecord',
            component: () => import('@/views/newcharge/distributionrecord')
        },
        {
            path: 'newcharge/sortingindex',
            component: () => import('@/views/newcharge/sortingindex')
        },
        {
            path: 'newcharge/sortinglist',
            component: () => import('@/views/newcharge/sortinglist')
        },
        {
            path: 'newcharge/accountStatement',
            component: () => import('@/views/newcharge/accountStatement')
        },
        {
            path: 'newcharge/accountStatementlist',
            component: () => import('@/views/newcharge/accountStatementlist')
        },
        {
            path: 'newcharge/newchargechargedetails',
            component: () => import('@/views/newcharge/newchargechargedetails')
        },
        {
            path: 'newcharge/campusCrdReconciliation',
            component: () => import('@/views/campusCrd/campusCrdReconciliation')
        },
        {
            path: 'newcharge/merchantstatistics',
            component: () => import('@/views/newcharge/merchantstatistics')
        },
        {
            path: 'newcharge/merchantstatisticslist',
            component: () => import('@/views/newcharge/merchantstatisticslist')
        },
        {
            path: 'newcharge/recordsofconsumption',
            component: () => import('@/views/newcharge/recordsofconsumption'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'plnewcharge/cardbindingstatisticsindex',
            component: () => import('@/views/cardbindingstatistics/cardbindingstatisticsindex'),
            meta: {
                isCached: true
            }
        },
        {
            path: 'shortmessage/shortmessagefail',
            component: () => import('@/views/shortmessage/shortmessagefail')
        },
        {
            path: 'shortmessage/shortmessageindex',
            component: () => import('@/views/shortmessage/shortmessageindex')
        },
        {
            path: 'shortmessage/shortmessageTemplate',
            component: () => import('@/views/shortmessage/shortmessageTemplate')
        },
        {
            path: 'shortmessage/createTemplate',
            component: () => import('@/views/shortmessage/createTemplate')
        },
        {
            path: 'shortmessage/shortmessagedetailedlist',
            component: () => import('@/views/shortmessage/shortmessagedetailedlist')
        },
        {
            path: 'shortmessage/shortmessageRechargerecordlist',
            component: () => import('@/views/shortmessage/shortmessageRechargerecordlist')
        },
        {
            path: 'shortmessage/shortmessageMasslistdetails',
            component: () => import('@/views/shortmessage/shortmessageMasslistdetails')
        },
        {
            path: 'shortmessage/shortmessageMasslist',
            component: () => import('@/views/shortmessage/shortmessageMasslist')
        },
        {
            path: 'shortmessage/shortmessageMassadd',
            component: () => import('@/views/shortmessage/shortmessageMassadd')
        },
        {
            path: 'shortmessage/shortmessageCorporateremittance',
            component: () => import('@/views/shortmessage/shortmessageCorporateremittance')
        },
        {
            path: 'shortmessage/onlinerecharge',
            component: () => import('@/views/shortmessage/onlinerecharge')
        },
        {
            path: 'shortmessage/shortmessagegroup',
            component: () => import('@/views/shortmessage/shortmessagegroup')
        },
        {
            path: 'shortmessage/shortmessagegroupadd',
            component: () => import('@/views/shortmessage/shortmessagegroupadd')
        },
        {
            path: 'shortmessage/shortmessagegroupinfo',
            component: () => import('@/views/shortmessage/shortmessagegroupinfo')
        },
        
        {
            path: 'visitor/visitorList', //访客记录
            component: () => import('@/views/visitor/visitorList')
        },
        {
            path: 'visitor/visitordetails', //访客记录
            component: () => import('@/views/visitor/visitordetails')
        },
        {
            path: 'refundRegister/index',
            component: () => import('@/views/refundRegister/refundRegisterIndex')
        },
        {
            path: 'refundRegisterTwo/index', // 退费登记2--表格统计页
            component: () => import('@/views/refundRegisterTwo/refundRegisterIndex')
        },
        {
            path: 'refundRegisterTwo/addRefunRegister', // 退费登记2--添加表单页
            component: () => import('@/views/refundRegisterTwo/addRefunRegister')
        },
        {
            path: 'refundRegisterTwo/refunRegisterLogin', // 退费登记2--登录
            component: () => import('@/views/refundRegisterTwo/refunRegisterLogin')
        },
        {
            path: 'campusCrd/campusCrdindexone', //学生卡
            component: () => import('@/views/campusCrd/campusCrdindexone')
        },
        {
            path: 'campusCrd/sourceSettings', //学生卡
            component: () => import('@/views/campusCrd/sourceSettings')
        },
        {
            path: 'campusCrd/campusCrdindextwo', //老师卡
            component: () => import('@/views/campusCrd/campusCrdindextwo')
        },
        {
            path: 'campusCrd/campusCrdindexthree', //班级卡
            component: () => import('@/views/campusCrd/campusCrdindexthree')
        },
        {
            path: 'campusCrd/lukaku', //卡库
            component: () => import('@/views/campusCrd/lukaku')
        },
        {
            path: 'campusCrd/tiedCard', //卡库
            component: () => import('@/views/campusCrd/tiedCard')
        },
        {
            path: 'campusCrd/campusCrdindexonedetails', //详情
            component: () => import('@/views/campusCrd/campusCrdindexonedetails')
        },
        {
            path: 'campusCrd/campusCrdindextwodetails', //详情
            component: () => import('@/views/campusCrd/campusCrdindextwodetails')
        },
        {
            path: 'campusCrd/campusCrdindexthreedetails', //详情
            component: () => import('@/views/campusCrd/campusCrdindexthreedetails')
        },
        {
            path: 'campusCrd/deviceSetting', //设置
            component: () => import('@/views/campusCrd/deviceSetting')
        },
        {
            path: 'campusCrd/thermometerGun', //体温枪
            component: () => import('@/views/campusCrd/thermometerGun')
        },
        {
            path: 'campusCrd/Importone', //导入
            component: () => import('@/views/campusCrd/Importone')
        },
        {
            path: 'campusCrd/Importtwo', //导入
            component: () => import('@/views/campusCrd/Importtwo')
        },
        {
            path: 'campusCrd/campusCrdindexfour',
            component: () => import('@/views/campusCrd/campusCrdindexfour')
        },
        {
            path: 'campusCrd/campusCrdindexfive',
            component: () => import('@/views/campusCrd/campusCrdindexfive')
        },
        {
            path: 'campusCrd/campusCrdindexsix',
            component: () => import('@/views/campusCrd/campusCrdindexsix')
        },
        {
            path: 'campusCrd/campusCrdReconciliation',
            component: () => import('@/views/campusCrd/campusCrdReconciliation')
        },
        {
            path: 'plnewcharge/generationrefundindex',
            component: () => import('@/views/generationrefund/generationrefundindex')
        },
        {
            path: 'plnewcharge/plnewchargedetails',
                component: () => import('@/views/generationrefund/plnewchargedetails')
            }, {
            path: 'plnewcharge/generationrefunddetails',
            component: () => import('@/views/generationrefund/generationrefunddetails')
        },
        {
            path: 'plnewcharge/generationrefundadd',
            component: () => import('@/views/generationrefund/generationrefundadd')
        },
        {
            path: 'plnewcharge/generationreAccountStatement',
            component: () => import('@/views/generationrefund/generationreAccountStatement')
        },
        {
            path: 'plnewcharge/generationreAccountStatementlist',
            component: () => import('@/views/generationrefund/generationreAccountStatementlist')
        },
        {
            path: 'plnewcharge/generationrefundlist',
            component: () => import('@/views/generationrefund/generationrefundlist')
        },
        {
            path: 'newcharge/newchargesetupindex',
            component: () => import('@/views/newcharge/newchargesetupindex')
        },
        {
            path: 'newcharge/collectionsettings',
            component: () => import('@/views/newcharge/collectionsettings')
        },
        {
            path: 'newcharge/newchargesetuptype',
            component: () => import('@/views/newcharge/newchargesetuptype')
        },
        {
            path: 'newcharge/newchargesetupaddjh',
            component: () => import('@/views/newcharge/newchargesetupaddjh')
        },
        {
            path: 'newcharge/newchargesetupaddwx',
            component: () => import('@/views/newcharge/newchargesetupaddwx')
        },
        {
            path: 'newcharge/newchargesetupaddgh',
            component: () => import('@/views/newcharge/newchargesetupaddgh')
        },
        {
            path: 'newcharge/newchargesetupaddjr',
            component: () => import('@/views/newcharge/newchargesetupaddjr')
        },
        {
            path: 'newcharge/newchargesetupaddnh',
            component: () => import('@/views/newcharge/newchargesetupaddnh')
        },
        {
            path: 'newcharge/newchargenhlister',
            component: () => import('@/views/newcharge/newchargenhlister')
        },
         {
             path: 'newcharge/newchargeghlist',
             component: () => import('@/views/newcharge/newchargeghlist')
         },
        {
            path: 'newcharge/newchargesetupaddnher',
            component: () => import('@/views/newcharge/newchargesetupaddnher')
        },
        {
            path: 'newcharge/newchargesetupeidtjh',
            component: () => import('@/views/newcharge/newchargesetupeidtjh')
        },
        {
            path: 'newcharge/newchargesetupeidtwx',
            component: () => import('@/views/newcharge/newchargesetupeidtwx')
        },
        {
            path: 'newcharge/newchargesetupeidtgh',
            component: () => import('@/views/newcharge/newchargesetupeidtgh')
        },
        {
            path: 'newcharge/newchargesetupeidtnh',
            component: () => import('@/views/newcharge/newchargesetupeidtnh')
        },
        {
            path: 'newcharge/newchargesetupeidtjr',
            component: () => import('@/views/newcharge/newchargesetupeidtjr')
        },
        {
            path: 'newcharge/newchargenhlist',
            component: () => import('@/views/newcharge/newchargenhlist')
        },
        {
            path: 'newcharge/newchargechargedetails',
            component: () => import('@/views/newcharge/newchargechargedetails')
        },
        {
            path: 'integralquery/integralqueryindex',
            component: () => import('@/views/integralquery/integralqueryindex')
        },
        {
            path: 'integralquery/integralquerylist',
            component: () => import('@/views/integralquery/integralquerylist')
        },
        {
            path: 'campusFees/newrefundlist',
            component: () => import('@/views/campusFees/newrefundlist')
        },
         {
             path: 'campusFees/printReceipts',
                 component: () => import('@/views/campusFees/printReceipts')
             }, {
            path: 'campusFees/newrefundadd',
            component: () => import('@/views/campusFees/newrefundadd')
        },
        {
            path: 'campusFees/newReissueadd',
            component: () => import('@/views/campusFees/newReissueadd')
        },
        {
            path: 'campusFees/newrefunddetails',
            component: () => import('@/views/campusFees/newrefunddetails')
        },
        {
            path: 'campustelephone/campustelephoneone',
            component: () => import('@/views/campustelephone/campustelephoneone')
        },
        {
            path: 'campustelephone/campustelephoneadd',
            component: () => import('@/views/campustelephone/campustelephoneadd')
        },
        {
            path: 'campustelephone/campustelephoneeidt',
            component: () => import('@/views/campustelephone/campustelephoneeidt')
        },
        {
            path: 'campustelephone/campustelephonethree',
            component: () => import('@/views/campustelephone/campustelephonethree')
        },
        {
            path: 'campustelephone/campustelephonetwo',
            component: () => import('@/views/campustelephone/campustelephonetwo')
        },
        {
            path: 'campustelephone/campustelephonfour',
            component: () => import('@/views/campustelephone/campustelephonfour')
        },
        {
            path: 'campustelephone/campustelephoneRecharge',
            component: () => import('@/views/campustelephone/campustelephoneRecharge')
        },
        {
            path: 'fundApplication/fundApplicationindex',
            component: () => import('@/views/fundApplication/fundApplicationindex')
        },
        {
            path: 'fundApplication/confirmationofFeefundsAdd',
            component: () => import('@/views/fundApplication/confirmationofFeefundsAdd')
        },
        {
            path: 'fundApplication/confirmationofFeefundsIndex',
            component: () => import('@/views/fundApplication/confirmationofFeefundsIndex')
        },
        {
            path: 'fundApplication/confirmationofFeefundsInfo',
            component: () => import('@/views/fundApplication/confirmationofFeefundsInfo')
        },
        {
            path: 'fundApplication/confirmationofFeefundsEidt',
            component: () => import('@/views/fundApplication/confirmationofFeefundsEidt')
        },
        {
            path: 'fundApplication/fundApplicationadd',
            component: () => import('@/views/fundApplication/fundApplicationadd')
        },
        {
            path: 'fundApplicationApproval/fundApplicationApprovalindex',
            component: () => import('@/views/fundApplication/fundApplicationApprovalindex')
        },
        {
            path: 'fundApplicationApproval/fundApplicationApprovalinfo',
            component: () => import('@/views/fundApplication/fundApplicationApprovalinfo')
        },
        {
            path: 'fundApplication/fundApplicationeidt',
            component: () => import('@/views/fundApplication/fundApplicationeidt')
        },
        {
            path: 'fundApplication/fundApplicationinfo',
            component: () => import('@/views/fundApplication/fundApplicationinfo')
        },
        {
            path: 'fundApplication/newfundApplicationindex',
            component: () => import('@/views/fundApplication/newfundApplicationindex')
        },
        {
            path: 'fundApplication/newfundApplicationadd',
            component: () => import('@/views/fundApplication/newfundApplicationadd')
        },
        {
            path: 'fundApplication/newfundApplicationApprovalindex',
            component: () => import('@/views/fundApplication/newfundApplicationApprovalindex')
        },
        {
            path: 'fundApplication/newfundApplicationApprovalinfo',
            component: () => import('@/views/fundApplication/newfundApplicationApprovalinfo')
        },
        {
            path: 'fundApplication/newfundApplicationeidt',
            component: () => import('@/views/fundApplication/newfundApplicationeidt')
        },
        {
            path: 'fundApplication/newfundApplicationinfo',
            component: () => import('@/views/fundApplication/newfundApplicationinfo')
        },
        {
            path: 'fundApplication/twofundApplicationindex',
            component: () => import('@/views/fundApplication/twofundApplicationindex')
        },
        {
            path: 'fundApplication/twofundApplicationadd',
            component: () => import('@/views/fundApplication/twofundApplicationadd')
        },
        {
            path: 'fundApplicationApproval/twofundApplicationApprovalindex',
            component: () => import('@/views/fundApplication/twofundApplicationApprovalindex')
        },
        {
            path: 'fundApplicationApproval/twofundApplicationApprovalinfo',
            component: () => import('@/views/fundApplication/twofundApplicationApprovalinfo')
        },
        {
            path: 'fundApplication/twofundApplicationeidt',
            component: () => import('@/views/fundApplication/twofundApplicationeidt')
        },
        {
            path: 'fundApplication/twofundApplicationinfo',
            component: () => import('@/views/fundApplication/twofundApplicationinfo')
        },
         {
             path: 'admissionReservation/admissionReservationinfo',
             component: () => import('@/views/admissionReservation/admissionReservationinfo')
         }, {
             path: 'admissionReservation/admissionReservationlist',
             component: () => import('@/views/admissionReservation/admissionReservationlist')
         }, {
             path: 'admissionReservation/admissionReservationlistinfo',
             component: () => import('@/views/admissionReservation/admissionReservationlistinfo')
         }, {
             path: 'admissionReservation/admissionReservationup',
             component: () => import('@/views/admissionReservation/admissionReservationup')
         },
    ]
}
