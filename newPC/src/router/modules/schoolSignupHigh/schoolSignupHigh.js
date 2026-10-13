export default [{
    path: 'schoolSignupHigh/queryMeetingAddEdit', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/queryMeetingAddEdit')), 'queryMeetingAddEdit')
}, {
    path: 'schoolSignupHigh/queryMeetingDetail', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/queryMeetingDetail')), 'queryMeetingDetail')
}, {
    path: 'schoolSignupHigh/queryMeetingList', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/queryMeetingList')), 'queryMeetingList')
}, {
    path: 'schoolSignupHigh/queryMeetingSignList', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/queryMeetingSignList')), 'queryMeetingSignList')
}, {
    path: 'schoolSignupHigh/sendMessage', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/sendMessage')), 'sendMessage')
}, {
    path: 'schoolSignupHigh/signupBatchAddEdit', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/signupBatchAddEdit')), 'signupBatchAddEdit')
}, {
    path: 'schoolSignupHigh/signupBatchDetail', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/signupBatchDetail')), 'signupBatchDetail')
}, {
    path: 'schoolSignupHigh/signupBatchList', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/signupBatchList')), 'signupBatchList')
}, {
    path: 'schoolSignupHigh/signupStuDetail', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/signupStuDetail')), 'signupStuDetail')
}, {

    path: 'schoolSignupHigh/signupStuTalentTable', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/signupStuTalentTable')), 'signupStuTalentTable')
}, {
    path: 'schoolSignupHigh/registrationSpecialist', //
        component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/registrationSpecialist')), 'registrationSpecialist')
    }, {
        path: 'schoolSignupHigh/responsibleLeader', //
            component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/responsibleLeader')), 'responsibleLeader')
        }, {
            path: 'schoolSignupHigh/responsibleLeaderadd', //
            component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/responsibleLeaderadd')), 'responsibleLeaderadd')
        }, {
            path: 'schoolSignupHigh/enrollmentReport', //
                component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/enrollmentReport')), 'enrollmentReport'),
                meta: {
                    isCached: true
                }
            }, {
                path: 'schoolSignupHigh/enrollmentReportinfo', //
                component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/enrollmentReportinfo')), 'enrollmentReportinfo')
            }, {
                path: 'schoolSignupHigh/enrollmentReportstu', //
                component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/enrollmentReportstu')), 'enrollmentReportstu'),
                meta: {
                    isCached: true
                }
            }, {
        path: 'schoolSignupHigh/communicationRecordslist', //
            component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/communicationRecordslist')), 'communicationRecordslist')
        }, {
            path: 'schoolSignupHigh/communicationRecordsinfo', //
            component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/communicationRecordsinfo')), 'communicationRecordsinfo')
        }, {
    path: 'schoolSignupHigh/signupStuList', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/signupStuList')), 'signupStuList'),
    meta: {
        isCached: true
    }
}, {
    path: 'schoolSignupHigh/shenpione', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/shenpione')), 'shenpione'),
    meta: {
        isCached: true
    }
}, {
    path: 'schoolSignupHigh/shenpitwo', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/shenpitwo')), 'shenpitwo'),
    meta: {
        isCached: true
    }
}, {
    path: 'schoolSignupHigh/shenpithree', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/shenpithree')), 'shenpithree'),
    meta: {
        isCached: true
    }
}, {
    path: 'schoolSignupHigh/signupGroupList', //
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/signupGroupList')), 'signupGroupList')
}, {
    path: 'schoolSignupHigh/setting',
    component: r => require.ensure([], () => r(require('@/views/schoolSignupHigh/schoolSignupHighSetting')), 'signupGroupList')
},
 {
     path: 'infoSearch/infoSearchList',
     component: r => require.ensure([], () => r(require('@/views/infoSearch/infoSearchList')), 'infoSearchList')
 },
 {
     path: 'infoSearch/infoSearchAdd',
     component: r => require.ensure([], () => r(require('@/views/infoSearch/infoSearchAdd')), 'infoSearchAdd')
 },
 {
     path: 'infoSearch/infoSearchResultList',
     component: r => require.ensure([], () => r(require('@/views/infoSearch/infoSearchResultList')), 'infoSearchResultList')
 }
]
