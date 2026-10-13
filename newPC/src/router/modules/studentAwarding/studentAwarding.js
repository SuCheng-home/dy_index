export default [
    {
        path: 'studentAwarding/activityList', // 阅读设置列表
        component: () => import('@/views/studentAwarding/activityList'),
        name: 'studentAwardingActivityList',
        meta: {
            isCached: true
        }
    },

    {
        path: 'studentAwarding/activityAddEdit', // 阅读方式设置
        component: () => import('@/views/studentAwarding/activityAddEdit'),
        name: 'studentAwardingActivityAddEdit',
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/activityDetail', // 阅读方式设置
        component: () => import('@/views/studentAwarding/activityDetail'),
        name: 'studentAwardingActivityDetail',
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/activityClassList', // 阅读统计
        component: () => import('@/views/studentAwarding/activityClassList'),
        name: 'studentAwardingActivityClassList',
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/activityClassStudentList', // 阅读统计总计详情
        component: () => import('@/views/studentAwarding/activityClassStudentList'),
        name: 'studentAwardingActivityClassStudentList',
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/activitySchoolStudentList',
        component: () => import('@/views/studentAwarding/activitySchoolStudentList'),
        name: 'studentAwardingActivitySchoolStudentList',
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/studentDetail',
        component: () => import('@/views/studentAwarding/studentDetail'),
        name: 'studentAwardingStudentDetail',
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/managerActivityList', //
        component: () => import('@/views/studentAwarding/managerActivityList'),
        name: 'studentAwardingManagerActivityList',
        meta: {
            isCached: true
        }
    },
    {
        path: 'studentAwarding/managerStudentList',
        component: () => import('@/views/studentAwarding/managerStudentList'),
        name: 'studentAwardingManagerStudentList',
        meta: {
            isCached: true,
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/studentActivityList', //
        component: () => import('@/views/studentAwarding/studentActivityList'),
        name: 'studentAwardingStudentActivityList',
        meta: {
            isCached: true
        }
    },
    {
        path: 'studentAwarding/teacherActivityList', //
        name: 'studentAwardingTeacherActivityList',
        component: () => import('@/views/studentAwarding/teacherActivityList'),
        meta: {
            isCached: true,
        }
    },
    {
        path: 'studentAwarding/teacherClassList',
        name: 'studentAwardingTeacherClassList',
        component: () => import('@/views/studentAwarding/teacherClassList'),
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/teacherShowList',
        name: 'studentAwardingTeacherShowList',
        component: () => import('@/views/studentAwarding/teacherShowList'),
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/teacherRollList',
        name: 'studentAwardingTeacherRollList',
        component: () => import('@/views/studentAwarding/teacherRollList'),
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/studentShowList',
        name: 'studentAwardingStudentShowList',
        component: () => import('@/views/studentAwarding/studentShowList'),
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/studentRollList',
        name: 'studentAwardingStudentRollList',
        component: () => import('@/views/studentAwarding/studentRollList'),
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/schoolReviewerSetting',
        name: 'studentAwardingSchoolReviewerSetting',
        component: () => import('@/views/studentAwarding/schoolReviewerSetting'),
        meta: {
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/activityListAll',
        name: 'studentAwardingActivityListAll',
        component: () => import('@/views/studentAwarding/activityListAll'),
        meta: {
            isCached: true,
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/activityAllStudentListSchool',
        name: 'studentAwardingActivityAllStudentListSchool',
        component: () => import('@/views/studentAwarding/activityAllStudentListSchool'),
        meta: {
            isCached: true,
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/activityAllStudentList',
        name: 'studentAwardingActivityAllStudentList',
        component: () => import('@/views/studentAwarding/activityAllStudentList'),
        meta: {
            isCached: true,
            keepCached: true
        }
    },
    {
        path: 'studentAwarding/studentDetailExport',
        name: 'studentAwardingStudentDetailExport',
        component: () => import('@/views/studentAwarding/studentDetailExport'),
        meta: {
            keepCached: true
        }
    }
]
