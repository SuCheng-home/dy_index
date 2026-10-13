export default {
    path: '/system/sysManage',
    component: r => require.ensure([], () => r(require('@/views/layout/LowerLayout')), 'page'),
    children: [{
            path: '',
            redirect: 'org/index'
        },
        {
            path: 'org/index', // 用户管理
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/index')), 'page'),

        },
        {
            path: 'org/departAdd', // 部门添加
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/depart/departAdd')), 'page'),

        },
        {
            path: 'org/departEdit', // 部门修改
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/depart/departEdit')), 'page'),
        },
        {
            path: 'org/rootDepartEdit', // 根部门修改
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/depart/rootDepartEdit')), 'page'),

        },
        {
            path: 'org/teacherAddEdit', //部门修改
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/user/teacherAddEdit')), 'page'),

        },
        {
            path: 'org/teacherArchiveAddEdit', //部门修改
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/user/teacherArchiveAddEdit')), 'page'),

        },
        {
            path: 'org/teacherDetail', //老师详情
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/user/teacherDetail')), 'page'),

        },
        {
            path: 'org/classDepartAdd', // 班级添加
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/depart/classDepartAdd')), 'page'),

        },
        {
            path: 'org/classDepartEdit', // 班级修改
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/depart/classDepartEdit')), 'page'),

        },
        {
            path: 'org/classBatchAdd', // 班级添加
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/depart/classBatchAdd')), 'page'),

        },
        {
            path: 'org/gradeDepartEdit', //年级修改
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/depart/gradeDepartEdit')), 'page'),

        },
        {
            path: 'org/gradeDepartAdd', //年级修改
            component: () => import('@/views/sysSet/org/depart/gradeDepartAdd'),

        },
        {
            path: 'org/studentAddEdit', // /新增或修改学生
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/user/studentAddEdit')), 'page'),

        },
        {
            path: 'org/studentArchiveAddEdit', // /新增或修改学生
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/user/studentArchiveAddEdit')), 'page'),

        },
        {
            path: 'org/parents', // 家长列表
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/user/parents')), 'page'),

        },
        {
            path: 'org/simpleDepartAddOrUpdate', // 新增和编辑简单部门（校外校友）
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/depart/simpleDepartAddOrUpdate')), 'page'),

        },
        {
            path: 'org/studentDetail', // 新增和编辑简单部门（校外校友）
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/user/studentDetail')), 'page'),

        },
        {
            path: 'org/logList',
            component: r => require.ensure([], () => r(require('@/views/sysSet/org/logList')), 'page'),
        },
        {
            path: 'teachingClass/teachingClassIndex', // 所教课程主页面
            component: r => require.ensure([], () => r(require('@/views/teachingClass/teachingClassIndex')), 'page'),

        },
        {
            path: 'teachingClass/teachingClassAdd', // 所教课程新增页面
            component: r => require.ensure([], () => r(require('@/views/teachingClass/teachingClassAdd')), 'page'),

        },
        {
            path: 'teachingClass/teachingClassEdit', // 所教课程编辑页面
            component: r => require.ensure([], () => r(require('@/views/teachingClass/teachingClassEdit')), 'page'),

        },
        {
            path: 'teachingClass/teachingClassDetails', // 所教课程详情页面
            component: r => require.ensure([], () => r(require('@/views/teachingClass/teachingClassDetails')), 'page'),

        },
        {
            path: 'sysSet/sysSetIndex', // 系统设置首页
            component: r => require.ensure([], () => r(require('@/views/sysSet')), 'page'),
        },
        {
            path: 'sysSet/stuAskleaveSet/index', // 学生请假2设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/stuAskleaveSet/index')), 'page'),

        },
        {
            path: 'sysSet/stuAskleaveSet/askleaveGroup', // 学生请假2分组设置列表
            component: r => require.ensure([], () => r(require('@/views/sysSet/stuAskleaveSet/askleaveGroup')), 'page'),

        },
        {
            path: 'sysSet/stuAskleaveSet/askleaveGroupAddAndUpdate', // 学生请假2分组创建和编辑页面
            component: r => require.ensure([], () => r(require('@/views/sysSet/stuAskleaveSet/askleaveGroupAddAndUpdate')), 'page'),

        },
        {
            path: 'sysSet/TeacherLeave3Set/index', // 老师版本3请假设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/TeacherLeave3Set/index')), 'page'),
        },
        {
            path: 'sysSet/TeacherLeave3Set/leaveSettingRuleList', // 老师版本3请假设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/TeacherLeave3Set/leaveSettingRuleList')), 'page'),
        },
        {
            path: 'sysSet/repairSet/repairTypeListIndex', // 报修类型列表页
            component: r => require.ensure([], () => r(require('@/views/sysSet/repairSet/repairTypeListIndex')), 'page'),
        },
        {
            path: 'sysSet/repairSet/repairTypeEditIndex', // 报修类型修改页
            component: r => require.ensure([], () => r(require('@/views/sysSet/repairSet/repairTypeEditIndex')), 'page'),

        },
        {
            path: 'sysSet/repairSet/repairTypeAdd', // 报修类型新增页
            component: r => require.ensure([], () => r(require('@/views/sysSet/repairSet/repairTypeAdd')), 'page'),
        },
        {
            path: 'sysSet/repairAddressSet/repairAddressSetIndex', // 报修地点新增页
            component: r => require.ensure([], () => r(require('@/views/sysSet/repairAddressSet/repairAddressSetIndex')), 'page'),

        },
        {
            path: 'sysSet/resourceSet/resourceTypeListIndex', // 资源类型列表（资源管理首页）
            component: r => require.ensure([], () => r(require('@/views/sysSet/resourceSet/resourceTypeListIndex')), 'page'),
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
            component: r => require.ensure([], () => r(require('@/views/sysSet/resourceSet/resourceTypeAdd')), 'page'),
        },
        {
            path: 'sysSet/resourceSet/resourceTypeEdit', // 资源类型修改
            component: r => require.ensure([], () => r(require('@/views/sysSet/resourceSet/resourceTypeEdit')), 'page'),
        },
        {
            path: 'sysSet/resourceSet/resourceList', // 资源列表
            component: r => require.ensure([], () => r(require('@/views/sysSet/resourceSet/resourceList')), 'page'),
        },
        {
            path: 'sysSet/resourceSet/resourceAdd', // 资源增加
            component: r => require.ensure([], () => r(require('@/views/sysSet/resourceSet/resourceAdd')), 'page'),
        },
        {
            path: 'sysSet/resourceSet/resourceEdit', // 资源修改
            component: r => require.ensure([], () => r(require('@/views/sysSet/resourceSet/resourceEdit')), 'page'),
        },
        {
            path: 'sysSet/fireSetup/stopgangsettings', // 停伙设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/fireSetup/stopgangsettings')), 'page'),

        },
        {
            path: 'sysSet/dataReport/dataReport', // 报告推送设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/dataReport/dataReport')), 'page'),
        },
        {
            path: 'sysSet/advice/typeList', // 建议类型列表
            component: r => require.ensure([], () => r(require('@/views/sysSet/advice/adviceTypeList')), 'page'),
        },
        {
            path: 'sysSet/advice/typeAdd', // 建议类型新增
            component: r => require.ensure([], () => r(require('@/views/sysSet/advice/adviceTypeAdd')), 'page'),
        },
        {
            path: 'sysSet/examSet/index', // 成绩管理设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/examSet/index')), 'page'),
        },
        {
            path: 'sysSet/courseSet/getCourseListIndex', // 课程设置主页面
            component: r => require.ensure([], () => r(require('@/views/sysSet/courseSet/getCourseListIndex')), 'page'),
        },
        {
            path: 'sysSet/courseSet/getCourseAddEdit', // 课程设置编辑页
            component: r => require.ensure([], () => r(require('@/views/sysSet/courseSet/getCourseAddEdit')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSet/dutyListIndex', // 综合检查值班表设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSet/dutyListIndex')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSet/addDuty', // 综合检查值班表详情页面
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSet/addDuty')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSet/dutyDetail', // 综合检查值班表详情页面
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSet/dutyDetail')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSet/editDuty', // 综合检查值班表详情页面
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSet/editDuty')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSet/checkDutyList', // 检查项列表
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSet/checkDutyList')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSet/addCheckDuty', // 新增检查项
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSet/addCheckDuty')), 'page'),
        },
        {
            path: 'sysSet/compositeExamSet/editCheckDuty', // 编辑检查项
            component: r => require.ensure([], () => r(require('@/views/sysSet/compositeExamSet/editCheckDuty')), 'page'),
        },
        {
            path: 'sysSet/wtCredit/wtCreditIndex', //梧桐信用首页
            component: r => require.ensure([], () => r(require('@/views/sysSet/wtCredit/wtCreditIndex')), 'page'),
        },
        {
            path: 'sysSet/wtCredit/initialSet', //梧桐信用首页
            component: r => require.ensure([], () => r(require('@/views/sysSet/wtCredit/initialSet')), 'page'),
        },
        {
            path: 'sysSet/wtCredit/addProduct', //梧桐信用新增
            component: r => require.ensure([], () => r(require('@/views/sysSet/wtCredit/addProduct')), 'page'),
        },
        {
            path: 'sysSet/wtCredit/editProduct', //梧桐信用编辑
            component: r => require.ensure([], () => r(require('@/views/sysSet/wtCredit/editProduct')), 'page'),
        },
        {
            path: 'sysSet/schoolTimeList/schoolTimeListIndex', // 学期管理首页列表页
            component: r => require.ensure([], () => r(require('@/views/sysSet/schoolTimeList/schoolTimeListIndex')), 'page'),
        },
        {
            path: 'sysSet/schoolTimeList/schoolTimeAdd', // 学期管理新增页
            component: r => require.ensure([], () => r(require('@/views/sysSet/schoolTimeList/schoolTimeAdd')), 'page'),
        },
        {
            path: 'sysSet/schoolTimeList/schoolTimeEdit', // 学期管理编辑页
            component: r => require.ensure([], () => r(require('@/views/sysSet/schoolTimeList/schoolTimeEdit')), 'page'),
        },
        {
            path: 'sysSet/schoolTimeList/schoolTimeSet', // 学期管理设置页
            component: r => require.ensure([], () => r(require('@/views/sysSet/schoolTimeList/schoolTimeSet')), 'page'),
        },
        {
            path: 'sysSet/schoolCalendar/schoolCalendarIndex', // 校历首页列表页
            component: r => require.ensure([], () => r(require('@/views/schoolCalendar/schoolCalendarIndex')), 'page'),
        },
        {
            path: 'sysSet/schoolCalendar/schoolCalendarAdd', // 校历新增页
            component: r => require.ensure([], () => r(require('@/views/schoolCalendar/schoolCalendarAdd')), 'page'),
        },
        {
            path: 'sysSet/schoolCalendar/schoolCalendarEdit', // 校历编辑页
            component: r => require.ensure([], () => r(require('@/views/schoolCalendar/schoolCalendarEdit')), 'page'),
        },
        {
            path: 'sysSet/schoolCalendar/schoolCalendarSet', // 校历设置页
            component: r => require.ensure([], () => r(require('@/views/schoolCalendar/schoolCalendarSet')), 'page'),
        },
        {
            path: 'upanddownindex', // 上下级配置首页
            component: r => require.ensure([], () => r(require('@/views/upanddown/upanddownindex')), 'page'),
        },
        {
            path: 'upanddownadd', // 上下级配置新建
            component: r => require.ensure([], () => r(require('@/views/upanddown/upanddownadd')), 'page'),
        },
        {
            path: 'upanddownedit', // 上下级配置编辑
            component: r => require.ensure([], () => r(require('@/views/upanddown/upanddownedit')), 'page'),
        },
        {
            path: 'sysSet/readPunchClock/readPunchClockSetIndex', // 阅读打卡设置
            component: r => require.ensure([], () => r(require('@/views/sysSet/readPunchClock/readPunchClockSetIndex')), 'page'),
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
            path: 'officeManager/index', // 部门主任
            component: r => require.ensure([], () => r(require('@/views/sysSet/officeManager/index')), 'page'),

        },
        {
            path: 'officeManager/edit', // 部门主任修改
            name: 'officeManagerEdit',
            component: r => require.ensure([], () => r(require('@/views/sysSet/officeManager/edit')), 'page'),

        },
        {
            path: 'moduleManager/index', // 应用管理
            component: r => require.ensure([], () => r(require('@/views/sysSet/moduleManager/index')), 'page'),

        },
        {
            path: 'moduleManager/roleDetail', // 应用管理详情
            component: r => require.ensure([], () => r(require('@/views/sysSet/moduleManager/roleDetail')), 'page'),

        },
        {
            path: 'modulestatistics/index', // 模块使用分析
            component: r => require.ensure([], () => r(require('@/views/sysSet/modulestatistics/index')), 'page'),

        },
        {
            path: 'modulestatistics/moduleDetail', // 模块使用分析
            component: r => require.ensure([], () => r(require('@/views/sysSet/modulestatistics/moduleDetail')), 'page'),

        },
        {
            path: 'statisticsSchool/index', // 用户分析
            component: r => require.ensure([], () => r(require('@/views/sysSet/statisticsSchool/index')), 'page'),

        },
        {
            path: 'invitation/index', // 邀请函
            component: r => require.ensure([], () => r(require('@/views/sysSet/invitation/index')), 'page'),

        },
        {
            path: 'operation/index', // 日志管理
            component: r => require.ensure([], () => r(require('@/views/sysSet/operation/index')), 'page'),

        },
        {
            path: 'faceManageIndex',
            component: r => require.ensure([], () => r(require('@/views/personalInfo/faceManageIndex')), 'page'),

        },
        {
            path: 'faceManageUserAdd',
            component: r => require.ensure([], () => r(require('@/views/personalInfo/faceManageUserAdd')), 'page'),

        },
        {
            path: 'faceManageUserEdit',
            component: r => require.ensure([], () => r(require('@/views/personalInfo/faceManageUserEdit')), 'page'),

        },
        {
            path: 'schoolDictionary', // 学校字典
            component: r => require.ensure([], () => r(require('@/views/sysSet/schoolDictionary/schoolDictionaryIndex')), 'page'),
            children: [{
                    path: '/',
                    redirect: 'list'
                },
                {
                    path: 'list',
                    component: r => require.ensure([], () => r(require('@/views/sysSet/schoolDictionary/schoolDictionaryList')), 'page')
                },
                {
                    path: 'add',
                    component: r => require.ensure([], () => r(require('@/views/sysSet/schoolDictionary/schoolDictionaryAdd')), 'page')
                },
                {
                    path: 'import',
                    component: r => require.ensure([], () => r(require('@/views/sysSet/schoolDictionary/schoolDictionaryImport')), 'page')
                }
            ]
        },

    ]
};
