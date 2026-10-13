export default [{
    path: 'honorManagement/honourGradeSet/honourGradeList',
    component: () => import('@/views/honourGradeSet/honourGradeList')
}, {
    path: 'honorManagement/honourGradeSet/addHonourGrade',
    component: () => import('@/views/honourGradeSet/addHonourGrade')
}, {
    path: 'honorManagement/honourGradeSet/editHonourGrade',
    component: () => import('@/views/honourGradeSet/editHonourGrade')
}, {
    path: 'honorManagement/honourGradeSet/organList',
    component: () => import('@/views/honourGradeSet/organList')
},
    {
        path: 'honorManagement/honourGradeSet/honourTypeList',
        component: () => import('@/views/honourGradeSet/honourTypeList')
    },
    {
        path: 'honorManagement/honourGradeSet/honourLevelList',
        component: () => import('@/views/honourGradeSet/honourLevelList')
    },
    {
        path: 'honorManagement/honourGradeSet/honourNameList',
        component: () => import('@/views/honourGradeSet/honourNameList')
    },
    {
        path: 'honorManagement/honourGradeSet/honourNameAddEdit',
        component: () => import('@/views/honourGradeSet/honourNameAddEdit')
    },{
        path: 'honorManagement/honourGradeSet/honourNameDetail',
        component: () => import('@/views/honourGradeSet/honourNameDetail')
    },]
