import printApplicationSettingRoutes from '../modules/printApplication/setting'

export default {
    path: '/main/sysManage',
    component: () => import('@/views/layout/LowerLayout'),
    children: [
        ...printApplicationSettingRoutes,
        {
            path: 'org/index', // 用户管理
            component: () => import('@/views/sysSet/org/index')
        },
        {
            path: 'org/departAdd', // 部门添加
            component: () => import('@/views/sysSet/org/depart/departAdd')
        },
        {
            path: 'org/departEdit', // 部门修改
            component: () => import('@/views/sysSet/org/depart/departEdit')
        },
        {
            path: 'org/rootDepartEdit', // 根部门修改
            component: () => import('@/views/sysSet/org/depart/rootDepartEdit')
        },
        {
            path: 'org/teacherAddEdit', //部门修改
            component: () => import('@/views/sysSet/org/user/teacherAddEdit')
        },
        {
            path: 'org/teacherArchiveAddEdit', //部门修改
            component: () => import('@/views/sysSet/org/user/teacherArchiveAddEdit')
        },
        {
            path: 'org/teacherDetail', //老师详情
            component: () => import('@/views/sysSet/org/user/teacherDetail')
        },
        {
            path: 'org/classDepartAdd', // 班级添加
            component: () => import('@/views/sysSet/org/depart/classDepartAdd')
        },
        {
            path: 'org/classDepartEdit', // 班级修改
            component: () => import('@/views/sysSet/org/depart/classDepartEdit')
        },
        {
            path: 'org/classBatchAdd', // 班级添加
            component: () => import('@/views/sysSet/org/depart/classBatchAdd')
        },
        {
            path: 'org/gradeDepartEdit', //年级修改
            component: () => import('@/views/sysSet/org/depart/gradeDepartEdit')
        },
        {
            path: 'org/gradeDepartAdd', //年级修改
            component: () => import('@/views/sysSet/org/depart/gradeDepartAdd')
        },
        {
            path: 'org/studentAddEdit', // /新增或修改学生
            component: () => import('@/views/sysSet/org/user/studentAddEdit')
        },
        {
            path: 'org/studentArchiveAddEdit', // /新增或修改学生
            component: () => import('@/views/sysSet/org/user/studentArchiveAddEdit')
        },
        {
            path: 'org/parents', // 家长列表
            component: () => import('@/views/sysSet/org/user/parents')
        },
        {
            path: 'org/simpleDepartAddOrUpdate', // 新增和编辑简单部门（校外校友）
            component: () => import('@/views/sysSet/org/depart/simpleDepartAddOrUpdate')
        },
        {
            path: 'org/studentDetail', // 新增和编辑简单部门（校外校友）
            component: () => import('@/views/sysSet/org/user/studentDetail')
        },
        {
            path: 'org/syncFailList',
            component: () => import('@/views/sysSet/org/syncFailList')
        },
        {
            path: 'operation/logList',
            component: () => import('@/views/sysSet/org/logList')
        },
        {
            path: 'teachingClass/teachingClassIndex', // 所教课程主页面
            component: () => import('@/views/teachingClass/teachingClassIndex')
        },
        {
            path: 'teachingClass/teachingClassAdd', // 所教课程新增页面
            component: () => import('@/views/teachingClass/teachingClassAdd')
        },
        {
            path: 'teachingClass/teachingClassEdit', // 所教课程编辑页面
            component: () => import('@/views/teachingClass/teachingClassEdit')
        },
        {
            path: 'teachingClass/teachingClassDetails', // 所教课程详情页面
            component: () => import('@/views/teachingClass/teachingClassDetails')
        },
        {
            path: 'sysSet/sysSetIndex', // 系统设置首页
            component: () => import('@/views/sysSet')
        },
        {
            path: 'sysSet/eatSettingIndex', //就餐设置主页
            component: () => import('@/views/sysSet/eatSetting/index'),
            name: 'eatSettingIndex',
            meta: {
                isCached: true
            }
        },
        {
            path: 'sysSet/newstopgangsettings',
            component: () => import('@/views/sysSet/eatSetting/newstopgangsettings')
        },
        {
            path: 'sysSet/studentNotEatSetting', //学生不就餐设置
            component: () => import('@/views/sysSet/eatSetting/studentNotEatSetting')
        },
        {
            path: 'sysSet/teacherNotEatSetting', //老师不就餐设置
            component: () => import('@/views/sysSet/eatSetting/teacherNotEatSetting')
        },
        {
            path: 'sysSet/eatAddressSetting', //就餐地点设置
            component: () => import('@/views/sysSet/eatSetting/eatAddressSetting')
        },
        {
            path: 'sysSet/eatSettingclasslist', //就餐地点设置
            component: () => import('@/views/sysSet/eatSetting/eatSettingclasslist')
        },
        {
            path: 'sysSet/addNewEattingAddress', //就餐地点新增
            component: () => import('@/views/sysSet/eatSetting/addNewEattingAddress'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'sysSet/maintainEattingUser', //维护餐厅就餐人员
            component: () => import('@/views/sysSet/eatSetting/maintainEattingUser'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'sysSet/addEatingUser', //增加餐厅就餐人员
            component: () => import('@/views/sysSet/eatSetting/addEatingUser'),
            meta: {
                keepCached: true
            }
        },
        {
            path: 'sysSet/stuAskLeaveSet/leave3Index', // 学生请假3设置
            component: () => import('@/views/sysSet/stuAskleaveSet/stuAskLeave3')
        },
        {
            path: 'sysSet/stuAskleaveSet/index', // 学生请假2设置
            component: () => import('@/views/sysSet/stuAskleaveSet/index')
        },
        {
            path: 'sysSet/stuAskleaveSet/askleaveGroup', // 学生请假2分组设置列表
            component: () => import('@/views/sysSet/stuAskleaveSet/askleaveGroup')
        },
        {
            path: 'sysSet/stuAskleaveSet/askleaveGroupAddAndUpdate', // 学生请假2分组创建和编辑页面
            component: () => import('@/views/sysSet/stuAskleaveSet/askleaveGroupAddAndUpdate')
        },
        {
            path: 'sysSet/TeacherLeave3Set/index', // 老师版本3请假设置
            component: () => import('@/views/sysSet/TeacherLeave3Set/index')
        },
        {
            path: 'sysSet/TeacherLeave3Set/leaveSettingRuleList', // 老师版本3请假设置
            component: () => import('@/views/sysSet/TeacherLeave3Set/leaveSettingRuleList')
        },
        {
            path: 'sysSet/repairSet/reminderSettings', // 报修类型提醒设置
            component: () => import('@/views/sysSet/repairSet/reminderSettings')
        },
        {
            path: 'sysSet/repairSet/repairTypeListIndex', // 报修类型列表页
            component: () => import('@/views/sysSet/repairSet/repairTypeListIndex')
        },
        {
            path: 'sysSet/repairSet/repairTypeEditIndex', // 报修类型修改页
            component: () => import('@/views/sysSet/repairSet/repairTypeEditIndex')
        },
        {
            path: 'sysSet/repairSet/repairTypeAdd', // 报修类型新增页
            component: () => import('@/views/sysSet/repairSet/repairTypeAdd')
        },
        {
            path: 'sysSet/repairAddressSet/repairAddressSetIndex', // 报修地点新增页
            component: () => import('@/views/sysSet/repairAddressSet/repairAddressSetIndex')
        },
        {
            path: 'sysSet/resourceSet/resourceTypeListIndex', // 资源类型列表（资源管理首页）
            component: () => import('@/views/sysSet/resourceSet/resourceTypeListIndex')
        },
        {
            path: 'sysSet/resourceSet/parentResourcesadd', // 资源类型列表（资源管理首页）
            component: r => require.ensure([], () => r(require('@/views/sysSet/resourceSet/parentResourcesadd')), 'page'),
        },
        {
            path: 'sysSet/resourceSet/parentResourceslist', // 资源类型列表（资源管理首页）
            component: r => require.ensure([], () => r(require('@/views/sysSet/resourceSet/parentResourceslist')), 'page'),
        },
        {
            path: 'sysSet/resourceSet/resourceTypeAdd', // 资源类型添加
            component: () => import('@/views/sysSet/resourceSet/resourceTypeAdd')
        },
        {
            path: 'sysSet/resourceSet/resourceTypeEdit', // 资源类型修改
            component: () => import('@/views/sysSet/resourceSet/resourceTypeEdit')
        },
        {
            path: 'sysSet/resourceSet/resourceList', // 资源列表
            component: () => import('@/views/sysSet/resourceSet/resourceList')
        },
        {
            path: 'sysSet/resourceSet/resourceAdd', // 资源增加
            component: () => import('@/views/sysSet/resourceSet/resourceAdd')
        },
        {
            path: 'sysSet/resourceSet/resourceEdit', // 资源修改
            component: () => import('@/views/sysSet/resourceSet/resourceEdit')
        },
        {
            path: 'sysSet/fireSetup/stopgangsettings', // 停伙设置
            component: () => import('@/views/sysSet/fireSetup/stopgangsettings')
        },
        {
            path: 'sysSet/fireSetup/newstopgangsettings', // 停伙设置
            component: () => import('@/views/sysSet/fireSetup/newstopgangsettings')
        },
        {
            path: 'sysSet/workingMeal/deliverySettings', // 工作餐地点设置
            component: () => import('@/views/workingMeal/deliverySettings')
        },
        {
            path: 'sysSet/workingMeal/mealSettingadd', // 工作餐地点设置
            component: () => import('@/views/workingMeal/mealSettingadd')
        },
        {
            path: 'sysSet/workingMeal/mealSettingeidt', // 工作餐地点设置
            component: () => import('@/views/workingMeal/mealSettingeidt')
        },
        {
            path: 'sysSet/workingMeal/mealSettingindex', // 工作餐地点设置
            component: () => import('@/views/workingMeal/mealSettingindex')
        },
        {
            path: 'sysSet/dataReport/dataReport', // 报告推送设置
            component: () => import('@/views/sysSet/dataReport/dataReport')
        },
        {
            path: 'sysSet/Intelligencecourse/IntelligencecourseSetup', //智能排课设置
            component: () => import('@/views/Intelligencecourse/IntelligencecourseSetup')
        },
        {
            path: 'sysSet/oralArithmetic/oralArithmeticindex', //口算打卡设置
            component: () => import('@/views/sysSet/oralArithmetic/oralArithmeticindex')
        },
        {
            path: 'sysSet/advice/typeList', // 建议类型列表
            component: () => import('@/views/sysSet/advice/adviceTypeList')
        },
        {
            path: 'sysSet/advice/typeAdd', // 建议类型新增
            component: () => import('@/views/sysSet/advice/adviceTypeAdd')
        },
        {
            path: 'sysSet/examSet/index', // 成绩管理设置
            component: () => import('@/views/sysSet/examSet/index')
        },
        {
            path: 'sysSet/courseSet/getCourseListIndex', // 课程设置主页面
            component: () => import('@/views/sysSet/courseSet/getCourseListIndex')
        },
        {
            path: 'sysSet/courseSet/getCourseAddEdit', // 课程设置编辑页
            component: () => import('@/views/sysSet/courseSet/getCourseAddEdit')
        },
        {
            path: 'sysSet/compositeExamSet/dutyListIndex', // 综合检查值班表设置
            component: () => import('@/views/sysSet/compositeExamSet/dutyListIndex')
        },
        {
            path: 'sysSet/compositeExamSet/addDuty', // 综合检查值班表详情页面
            component: () => import('@/views/sysSet/compositeExamSet/addDuty')
        },
        {
            path: 'sysSet/compositeExamSet/dutySet', // 综合检查值班表设置
            component: () => import('@/views/sysSet/compositeExamSet/dutySet')
        },
        {
            path: 'sysSet/compositeExamSet/dutyDetail', // 综合检查值班表详情页面
            component: () => import('@/views/sysSet/compositeExamSet/dutyDetail')
        },
        {
            path: 'sysSet/compositeExamSet/editDuty', // 综合检查值班表详情页面
            component: () => import('@/views/sysSet/compositeExamSet/editDuty')
        },
        {
            path: 'sysSet/compositeExamSet/editDutytwo', // 综合检查值班表详情页面
            component: () => import('@/views/sysSet/compositeExamSet/editDutytwo')
        },
        {
            path: 'sysSet/compositeExamSet/checkDutyList', // 检查项列表
            component: () => import('@/views/sysSet/compositeExamSet/checkDutyList')
        },
        {
            path: 'sysSet/compositeExamSet/addCheckDuty', // 新增检查项
            component: () => import('@/views/sysSet/compositeExamSet/addCheckDuty')
        },
        {
            path: 'sysSet/compositeExamSet/inspectionItems', // 新增检查项
            component: () => import('@/views/sysSet/compositeExamSet/inspectionItems')
        },
        {
            path: 'sysSet/compositeExamSet/editCheckDuty', // 编辑检查项
            component: () => import('@/views/sysSet/compositeExamSet/editCheckDuty')
        },
        {
            path: 'sysSet/compositeExamSetTwo/compositeExamSetTwosetup', // 综合检查2
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSetTwo/compositeExamSetTwosetup')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSetTwo/campusPatrolSetupAdd', // 综合检查2
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSetTwo/campusPatrolSetupAdd')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSetTwo/campusPatrolSetupEidt', // 综合检查2
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSetTwo/campusPatrolSetupEidt')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSetTwo/campusPatrolSetupIndex', // 综合检查2
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSetTwo/campusPatrolSetupIndex')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSetTwo/campusPatrolSetupInfo', // 综合检查2
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSetTwo/campusPatrolSetupInfo')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSetTwo/campusPatrolSetupTermAdd', // 综合检查2
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSetTwo/campusPatrolSetupTermAdd')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSetTwo/campusPatrolSetupTermEidt', // 综合检查2
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSetTwo/campusPatrolSetupTermEidt')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSetTwo/campusPatrolSetupTermInfo', // 综合检查2
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSetTwo/campusPatrolSetupTermInfo')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSetTwo/campusPatrolSetupTermIndex', // 综合检查2
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSetTwo/campusPatrolSetupTermIndex')), 'page'),
        },
        {
             path: 'sysSet/dormitoryInspection/dormitoryInspectionadd', // 编辑检查项
                 component: () => import('@/views/sysSet/dormitoryInspection/dormitoryInspectionadd')
             }, {
                 path: 'sysSet/dormitoryInspection/dormitoryInspectionindex', // 编辑检查项
                 component: () => import('@/views/sysSet/dormitoryInspection/dormitoryInspectionindex')
             }, {
                 path: 'sysSet/dormitoryInspection/dormitoryInspectioninfo', // 编辑检查项
                 component: () => import('@/views/sysSet/dormitoryInspection/dormitoryInspectioninfo')
             }, {
                 path: 'sysSet/dormitoryInspection/dormitoryInspectionitem', // 编辑检查项
                 component: () => import('@/views/sysSet/dormitoryInspection/dormitoryInspectionitem')
             }, {
                 path: 'sysSet/dormitoryInspection/dormitoryInspectionitemadd', // 编辑检查项
                 component: () => import('@/views/sysSet/dormitoryInspection/dormitoryInspectionitemadd')
             }, {
                 path: 'sysSet/dormitoryInspection/dormitoryInspectioniteminfo', // 编辑检查项
                 component: () => import('@/views/sysSet/dormitoryInspection/dormitoryInspectioniteminfo')
             }, {
            path: 'sysSet/wtCredit/wtCreditIndex', //梧桐信用首页
            component: () => import('@/views/sysSet/wtCredit/wtCreditIndex')
        },
        {
            path: 'sysSet/wtCredit/initialSet', //梧桐信用首页
            component: () => import('@/views/sysSet/wtCredit/initialSet')
        },
        {
            path: 'sysSet/wtCredit/addProduct', //梧桐信用新增
            component: () => import('@/views/sysSet/wtCredit/addProduct')
        },
        {
            path: 'sysSet/wtCredit/editProduct', //梧桐信用编辑
            component: () => import('@/views/sysSet/wtCredit/editProduct')
        },
        {
            path: 'sysSet/wtCredit/autoApplySet', //自主申领设置
            component: () => import('@/views/sysSet/wtCredit/autoApplySet')
        },
        {
            path: 'sysSet/wtCredit/integralList', //积分划档
            component: () => import('@/views/sysSet/wtCredit/integralList')
        },
        {
            path: 'sysSet/wtCredit/integralAdd', //积分划档
            component: () => import('@/views/sysSet/wtCredit/integralAdd')
        },
        {
            path: 'sysSet/schoolTimeList/schoolTimeListIndex', // 学期管理首页列表页
            component: () => import('@/views/sysSet/schoolTimeList/schoolTimeListIndex')
        },
        {
            path: 'sysSet/gate/timeSetting', // 进出校时间设置
            component: () => import('@/views/gate/timeSetting')
        },
        {
            path: 'sysSet/timelineSetting', // 作息时间
            component: () => import('@/views/sysSet/timeline/timelineSetting')
        },
        {
            path: 'sysSet/schoolTimeList/schoolTimeAdd', // 学期管理新增页
            component: () => import('@/views/sysSet/schoolTimeList/schoolTimeAdd')
        },
        {
            path: 'sysSet/schoolTimeList/schoolTimeEdit', // 学期管理编辑页
            component: () => import('@/views/sysSet/schoolTimeList/schoolTimeEdit')
        },
        {
            path: 'sysSet/schoolTimeList/schoolTimeSet', // 学期管理设置页
            component: () => import('@/views/sysSet/schoolTimeList/schoolTimeSet')
        },
        {
            path: 'sysSet/schoolCalendar/schoolCalendarIndex', // 校历首页列表页
            component: () => import('@/views/schoolCalendar/schoolCalendarIndex')
        },
        {
            path: 'sysSet/schoolCalendar/schoolCalendarAdd', // 校历新增页
            component: () => import('@/views/schoolCalendar/schoolCalendarAdd')
        },
        {
            path: 'sysSet/schoolCalendar/schoolCalendarEdit', // 校历编辑页
            component: () => import('@/views/schoolCalendar/schoolCalendarEdit')
        },
        {
            path: 'sysSet/schoolCalendar/schoolCalendarSet', // 校历设置页
            component: () => import('@/views/schoolCalendar/schoolCalendarSet')
        },
        {
            path: 'sysSet/readPunchClock/readPunchClockSetIndex', // 阅读打卡设置
            component: () => import('@/views/sysSet/readPunchClock/readPunchClockSetIndex')
        },
        {
            path: 'sysSet/birthWish/setting', //
            component: () => import('@/views/birthWish/setting')
            // meta: {
            //     permissionPath: '/readClockIn/set'
            // }
        },
        {
            path: 'sysSet/photo/setting', //
            component: () => import('@/views/photo/photoSetting')
            // meta: {
            //     permissionPath: '/readClockIn/set'
            // }
        },
        {
            path: 'upanddownindex', // 上下级配置首页
            component: () => import('@/views/upanddown/upanddownindex')
        },
        {
            path: 'upanddownadd', // 上下级配置新建
            component: () => import('@/views/upanddown/upanddownadd')
        },
        {
            path: 'upanddownedit', // 上下级配置编辑
            component: () => import('@/views/upanddown/upanddownedit')
        },
        {
            path: 'officeManager/index', // 部门主任
            component: () => import('@/views/sysSet/officeManager/index')
        },
        {
            path: 'officeManager/edit', // 部门主任修改
            name: 'officeManagerEdit',
            component: () => import('@/views/sysSet/officeManager/edit')
        },
        {
            path: 'moduleManager/index', // 应用管理
            component: () => import('@/views/sysSet/moduleManager/index')
        },
        {
            path: 'moduleManager/roleDetail', // 应用管理详情
            component: () => import('@/views/sysSet/moduleManager/roleDetail')
        },
        {
            path: 'sysSet/campusFeesSetup', //校园收费
            component: () => import('@/views/campusFees/campusFeesSetup')
        },
        {
            path: 'modulestatistics/index', // 模块使用分析
            component: () => import('@/views/sysSet/modulestatistics/index')
        },
        {
            path: 'modulestatistics/moduleDetail', // 模块使用分析
            component: () => import('@/views/sysSet/modulestatistics/moduleDetail')
        },
        {
            path: 'statisticsSchool/index', // 用户分析
            component: () => import('@/views/sysSet/statisticsSchool/index')
        },
        {
            path: 'invitation/index', // 邀请函
            component: () => import('@/views/sysSet/invitation/index')
        },
        {
            path: 'operation/index', // 日志管理
            component: () => import('@/views/sysSet/operation/index')
        },
        {
            path: 'sysSet/teacherAttendance/teacherAttendanceSetIndex', // 老师考勤设置
            component: () => import('@/views/sysSet/teacherAttendance/teacherAttendanceSetIndex')
        },
        {
            path: 'sysSet/teacherAttendance/teacherAttendanceSetRuleAdd', // 规则新增
            component: () => import('@/views/sysSet/teacherAttendance/teacherAttendanceSetRuleAdd')
        },
        {
            path: 'sysSet/teacherAttendance/teacherAttendanceSetAddressList', // 考勤地点列表
            component: () => import('@/views/sysSet/teacherAttendance/teacherAttendanceSetAddressList')
        },
        {
            path: 'sysSet/teacherAttendance/teacherAttendanceSetAddressAdd', // 考勤地点新增
            component: () => import('@/views/sysSet/teacherAttendance/teacherAttendanceSetAddressAdd')
        },
        {
            path: 'sysSet/teacherAttendance/teacherAttendanceSetRemind', // 考勤提醒设置
            component: () => import('@/views/sysSet/teacherAttendance/teacherAttendanceSetRemind')
        },
        {
            path: 'sysSet/teacherAttendance/teacherAttendanceSetMemberList', // 考勤人员列表
            component: () => import('@/views/sysSet/teacherAttendance/teacherAttendanceSetMemberList')
        },
        {
            path: 'sysSet/tenEvent/tenEventSet', // 六十事设置
            component: () => import('@/views/sysSet/tenEvent/tenEventSet')
        },
        {
            path: 'sysSet/tenEvent/tenEventList', // 六十事设置列表
            component: () => import('@/views/sysSet/tenEvent/tenEventList')
        },
        {
            path: 'sysSet/ketang/ketangSetup',
            component: () => import('@/views/sysSet/ketang/ketangSetup')
        },
        {
            path: 'sysSet/ketang/ketanggrouping',
                component: () => import('@/views/sysSet/ketang/ketanggrouping')
            }, {
            path: 'sysSet/ketang/ketangAssessment',
            component: () => import('@/views/sysSet/ketang/ketangAssessment')
        }, {
            path: 'sysSet/ketang/copywritingSettings',
            component: () => import('@/views/sysSet/ketang/copywritingSettings')
        },
        {
            path: 'sysSet/ketang/ketanglist',
            component: () => import('@/views/sysSet/ketang/ketanglist')
        },
        {
            path: 'sysSet/classevaluate/classevaluateindex',
            component: () => import('@/views/sysSet/classevaluate/classevaluateindex')
        },
        {
            path: 'sysSet/classCircle/classCircleindex', //班级圈设置
            component: () => import('@/views/sysSet/classCircle/classCircleindex')
        },
        {
            path: 'sysSet/deviceManage/deviceList',
            component: () => import('@/views/sysSet/deviceManage/deviceList')
        },
        {
            path: 'sysSet/deviceManage/deviceMemberManage',
            component: () => import('@/views/sysSet/deviceManage/deviceMemberManage')
        },
        {
            path: 'sysSet/memorabiliaSet/memorabiliaSet', // 大事记设置
            component: () => import('@/views/sysSet/memorabiliaSet/memorabiliaSet')
        },
        {
            path: 'sysSet/advice/typeList', // 建议类型列表
            component: () => import('@/views/sysSet/advice/adviceTypeList')
        },
        {
            path: 'sysSet/advice/typeAdd', // 建议类型列表
            component: () => import('@/views/sysSet/advice/adviceTypeAdd')
        },
        {
            path: 'faceManageIndex',
            component: () => import('@/views/personalInfo/faceManageIndex')
        },
        {
            path: 'faceManageUserAdd',
            component: () => import('@/views/personalInfo/faceManageUserAdd')
        },
        {
            path: 'faceManageUserEdit',
            component: () => import('@/views/personalInfo/faceManageUserEdit')
        },
        {
            path: 'sysSet/deyu/DeyuList', //德育评价设置
            component: () => import('@/views/deyu/DeyuList')
        },
        {
            path: 'sysSet/deyu/copywritingSettings',
            component: () => import('@/views/sysSet/ketang/copywritingSettings')
        },
        {
            path: 'sysSet/deyu/DeyuDetail', //德育评价设置
            component: () => import('@/views/deyu/DeyuDetail')
        },
        {
            path: 'sysSet/deyu/deyuRemindersettings', //德育评价设置
            component: () => import('@/views/deyu/deyuRemindersettings')
        },
        {
            path: 'sysSet/deyu/deyuCardManagement', //德育评价设置
                component: () => import('@/views/deyu/deyuCardManagement')
            }, {
            path: 'sysSet/dockingAttendanceMachine', // 对接考勤机
            component: () => import('@/views/sysSet/teacherAttendance/dockingAttendanceMachine')
        },
        {
            path: 'sysSet/extraWork/getExtraWorkInit', // 对接考勤机
            component: () => import('@/views/sysSet/extraWork/getExtraWorkInit')
        },
        {
            path: 'schoolDictionary', // 学校字典
            component: () => import('@/views/sysSet/schoolDictionary/schoolDictionaryIndex'),
            children: [{
                    path: '/',
                    redirect: 'list'
                },
                {
                    path: 'list',
                    component: () => import('@/views/sysSet/schoolDictionary/schoolDictionaryList')
                },
                {
                    path: 'add',
                    component: () => import('@/views/sysSet/schoolDictionary/schoolDictionaryAdd')
                },
                {
                    path: 'import',
                    component: () => import('@/views/sysSet/schoolDictionary/schoolDictionaryImport')
                }
            ]
        },
        {
            path: 'sysSet/morningCheck/morningCheck', // 晨检设置
            component: () => import('@/views/sysSet/morningCheck/morningCheck')
        },
        {
            path: 'sysSet/ventilatearoom/ventilatearoomindex', // 通风打卡设置
            component: () => import('@/views/sysSet/ventilatearoom/ventilatearoomindex')
        },
        {
            path: 'sysSet/ventilatearoom/ventilatearoomadd', // 通风打卡设置
            component: () => import('@/views/sysSet/ventilatearoom/ventilatearoomadd')
        },
        {
            path: 'sysSet/ventilatearoom/ventilatearoomeidt', // 通风打卡设置
            component: () => import('@/views/sysSet/ventilatearoom/ventilatearoomeidt')
        },
        {
            path: 'sysSet/ventilatearoom/policySettingslist', // 通风打卡设置
            component: () => import('@/views/sysSet/ventilatearoom/policySettingslist')
        },
        {
            path: 'sysSet/ventilatearoom/policySettingsadd', // 通风打卡设置
            component: () => import('@/views/sysSet/ventilatearoom/policySettingsadd')
        },
        {
            path: 'sysSet/ventilatearoom/policySettingseidt', // 通风打卡设置
            component: () => import('@/views/sysSet/ventilatearoom/policySettingseidt')
        },
        {
            path: 'sysSet/ventilatearoom/ventilatearoomDictionarieslist', // 通风打卡设置
            component: () => import('@/views/sysSet/ventilatearoom/ventilatearoomDictionarieslist')
        },
        {
            path: 'sysSet/ventilatearoom/ventilatearoomDictionariesadd', // 通风打卡设置
            component: () => import('@/views/sysSet/ventilatearoom/ventilatearoomDictionariesadd')
        },
        {
            path: 'sysSet/ventilatearoom/ventilatearoomDictionarieseidt', // 通风打卡设置
            component: () => import('@/views/sysSet/ventilatearoom/ventilatearoomDictionarieseidt')
        },
        {
            path: 'sysSet/onDuty/index', // 值班和进出校设置
            component: () => import('@/views/sysSet/onDuty/onDutyIndex')
        },
        {
            path: 'sysSet/onDuty/weekSet', // 值班周列表
            component: () => import('@/views/sysSet/onDuty/onDutyWeekSet')
        },
        {
            path: 'sysSet/onDuty/weekdaySet', // 值班周列表
            component: () => import('@/views/sysSet/onDuty/onDutyWeekdaySet')
        },
        {
            path: 'sysSet/temperatureSetup/temperatureSetup', // 体温检查设置
            component: () => import('@/views/sysSet/temperatureSetup/temperatureSetup')
        },
        {
            path: 'sysSet/schedule/scheduleSetup', // 日程设置
            component: () => import('@/views/schedule/scheduleSetup')
        },
        {
            path: 'sysSet/teacherLeave4Setting',
            component: () => import('@/views/sysSet/teacherLeave4Setting/teacherLeave4Setting')
        },
        {
            path: 'sysSet/rulelist',
            component: () => import('@/views/sysSet/teacherLeave4Setting/rulelist')
        },
        {
            path: 'sysSet/ruleadd',
            component: () => import('@/views/sysSet/teacherLeave4Setting/ruleadd')
        },
        // 放学设置
        {
            path: 'sysSet/leaveTheSchool/index',
            component: () => import('@/views/leaveTheSchool/index')
        },
        {
            path: 'sysSet/guide/guideGroupList', // 护导组列表
            component: () => import('@/views/sysSet/guide/guideGroupList')
        },
        {
            path: 'sysSet/guide/guideGroupAdd', // 护导组新增
            component: () => import('@/views/sysSet/guide/guideGroupAdd')
        },
        {
            path: 'sysSet/guide/guideGroupSet', // 护导组设置
            component: () => import('@/views/sysSet/guide/guideGroupSet')
        },
        {
            path: 'sysSet/guide/guideList', // 护导岗位列表
            component: () => import('@/views/sysSet/guide/guideList')
        },
        {
            path: 'sysSet/guide/guideManagerSet', // 护导负责人设置
            component: () => import('@/views/sysSet/guide/guideManagerSet')
        },
        {
            path: 'sysSet/guide/guideManagerPostSet', // 护导负责人设置
            component: () => import('@/views/sysSet/guide/guideManagerPostSet')
        },
        {
            path: 'sysSet/guide/guideTimeSet', // 护导时间设置
            component: () => import('@/views/sysSet/guide/guideTimeSet')
        },
        // 教师荣誉设置
        {
            path: 'sysSet/teacherHonorSetting/index',
            component: () => import('@/views/sysSet/teacherHonorSetting/index')
        },
        // 教师荣誉设置 - 证书级别 - 新增/编辑页
        {
            path: 'sysSet/teacherHonorSetting/certificateLevel/form',
            component: () => import('@/views/sysSet/teacherHonorSetting/certificateLevel/form')
        },
        // 教师荣誉设置 - 证书级别 - 机构列表
        {
            path: 'sysSet/teacherHonorSetting/certificateLevel/mechanism',
            component: () => import('@/views/sysSet/teacherHonorSetting/certificateLevel/mechanism')
        },
        {
            //积累评价
            path: 'sysSet/evaluateCumulative/evaluateCumulativeone',
            component: () => import('@/views/sysSet/evaluateCumulative/evaluateCumulativeone')
        },
        {
            //积累评价
            path: 'sysSet/evaluateCumulative/evaluateCumulativeoneadd',
            component: () => import('@/views/sysSet/evaluateCumulative/evaluateCumulativeoneadd')
        },
        {
            //积累评价
            path: 'sysSet/evaluateCumulative/evaluateCumulativeoneeidt',
            component: () => import('@/views/sysSet/evaluateCumulative/evaluateCumulativeoneeidt')
        },
        {
            //积累评价
            path: 'sysSet/evaluateCumulative/evaluateCumulativetwo',
            component: () => import('@/views/sysSet/evaluateCumulative/evaluateCumulativetwo')
        },
        {
            //积累评价
            path: 'sysSet/evaluateCumulative/evaluateCumulativethree',
            component: () => import('@/views/sysSet/evaluateCumulative/evaluateCumulativethree')
        },
        {
            //积累评价
            path: 'sysSet/evaluateCumulative/evaluateCumulativethreeadd',
            component: () => import('@/views/sysSet/evaluateCumulative/evaluateCumulativethreeadd')
        },
        {
            //积累评价
            path: 'sysSet/evaluateCumulative/evaluateCumulativethreeeidt',
            component: () => import('@/views/sysSet/evaluateCumulative/evaluateCumulativethreeeidt')
        },

        {
            // 作业检查设置
            path: 'sysSet/homeworkInspection/index',
            component: () => import('@/views/sysSet/homeworkInspection/index')
        },
        {
            path: 'sysSet/studentOnDuty/studentOnDutySetting',
            component: () => import('@/views/sysSet/studentOnDuty/studentOnDutySetting')
        },
        {
            path: 'sysSet/map/mapIndex',
            component: () => import('@/views/sysSet/map/mapIndex')
        },
          {
              path: 'sysSet/fiveEducationSetup/fiveEducationSetupIndex',
                  component: () => import('@/views/sysSet/fiveEducationSetup/fiveEducationSetupIndex')
              }, {
                  path: 'sysSet/fiveEducationSetup/indicatorindex',
                  component: () => import('@/views/sysSet/fiveEducationSetup/indicatorindex')
              }, {
                  path: 'sysSet/fiveEducationSetup/indicatoradd',
                  component: () => import('@/views/sysSet/fiveEducationSetup/indicatoradd')
              }, {
                  path: 'sysSet/fiveEducationSetup/exchangeSettings',
                      component: () => import('@/views/sysSet/fiveEducationSetup/exchangeSettings')
                  }, {
                      path: 'sysSet/fiveEducationSetup/exchangeSettingsadd',
                      component: () => import('@/views/sysSet/fiveEducationSetup/exchangeSettingsadd')
                  }, {
            path: 'sysSet/teachingGroup/teachingGroupSet',
            component: () => import('@/views/sysSet/teachingGroupSet/teachingGroupSet')
        },
        {
            path: 'sysSet/teachingGroup/teachingGroupAddEdit',
            component: () => import('@/views/sysSet/teachingGroupSet/teachingGroupAddEdit')
        },
        {
            path: 'sysSet/studentAttendanceLiuhe/setting',
            component: () => import('@/views/studentAttendanceLiuhe/setting')
        },
        {
            path: 'sysSet/message/MessageTemplateSetting',
            component: () => import('@/views/message/MessageTemplateSetting')
        },
        {
            path: 'sysSet/classroomEvaluationtwo/classroomEvaluationtwosetup',
            component: () => import('@/views/classroomEvaluationtwo/classroomEvaluationtwosetup')
        },
        {
            path: 'sysSet/gate/getGateProInit',
            component: () => import('@/views/sysSet/gate/getGateProInit')
        },
        {
            path: 'sysSet/flow/flowList',
            component: () => import('@/views/flow/flowList')
        },
        {
            path: 'sysSet/flow/flowAddEdit',
            component: () => import('@/views/flow/flowAddEdit')
        },
        {
            path: 'sysSet/readingplatform/readingplatformsetup', // 模块使用分析
            component: r => require.ensure([], () => r(require('@/views/readingplatform/readingplatformsetup')), 'page')
        },
        {
            path: 'sysSet/openClass/openClassSetting',
            component: r => require.ensure([], () => r(require('@/views/openClass/openClassSetting')), 'page')
        },
        {
            path: 'sysSet/epidemicPre/epidemicPreSetting', // 智慧防疫设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/epidemicPre/epidemicPreSetting')), 'page')
        },
        {
            path: 'sysSet/campusphoneconfiguration/campusphoneconfigurationindex',
            component: r => require.ensure([], () => r(require('@/views/campusphoneconfiguration/campusphoneconfigurationindex')), 'page')
        },
        {
            path: 'sysSet/schoolbasedcurriculum/schoolbasedcurriculumsetup',
            component: () => import('@/views/schoolbasedcurriculum/schoolbasedcurriculumsetup')
        },
        {
            path: 'sysSet/qlthSettingIndex', // 青蓝同辉设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/qlthSetting')), 'page')
        },
        {
            path: 'sysSet/qlthSettingAdd', // 青蓝同辉设置-新增
            component: r => require.ensure([], () => r(require('@/views/sysSet/qlthSetting/addPage')), 'page')
        },
        {
            path: 'sysSet/qlthSettingImportPage', // 青蓝同辉设置-导入
            component: r => require.ensure([], () => r(require('@/views/sysSet/qlthSetting/importPage')), 'page')
        },
        {
            path: 'sysSet/carAttendance/index', // 车辆考勤设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/carAttendance/index')), 'page')
        },
        {
            path: 'sysSet/supplyClass/supplyClasssetup',
            component: r => require.ensure([], () => r(require('@/views/supplyClass/supplyClasssetup')), 'page')
        },
        {
            path: 'sysSet/leaveCancelTicket/leaveCancelTicketList',
            component: r => require.ensure([], () => r(require('@/views/sysSet/leaveCancelTicket/leaveCancelTicketList')), 'page')
        },
        {
            path: 'sysSet/leaveCancelTicket/leaveCancelTicketAddEdit',
            component: r => require.ensure([], () => r(require('@/views/sysSet/leaveCancelTicket/leaveCancelTicketAddEdit')), 'page')
        },
        // 志愿服务设置
        {
            path: 'sysSet/volunteerService/volunteerServiceIndex',
            component: () => import('@/views/sysSet/volunteerService/index')
        },

    ]
}
