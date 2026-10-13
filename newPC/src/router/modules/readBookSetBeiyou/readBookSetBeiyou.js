export default [
    {
        path: 'readBookSetBeiyou/readBookList', // 阅读设置列表
        component: () => import('@/views/readBookSetBeiyou/list')
    },
    {
        path: 'readBookSetBeiyou/listadd', // 阅读设置列表
        component: () => import('@/views/readBookSetBeiyou/listadd')
    },


    {
        path: 'readBookSetBeiyou/readWay', // 阅读方式设置
        component: () => import('@/views/readBookSetBeiyou/readWay')
    },
    {
        path: 'readBookSetBeiyou/cancelPassword', // 阅读方式设置
        component: () => import('@/views/readBookSetBeiyou/cancelPassword')
    },
    {
        path: 'readBookSetBeiyou/readStatistics', // 阅读统计
        component: () => import('@/views/readBookSetBeiyou/readStatistics')
    },
    {
        path: 'readBookSetBeiyou/staticCountDetail', // 阅读统计总计详情
        component: () => import('@/views/readBookSetBeiyou/staticCountDetail')
    },
    {
        path: 'readBookSetBeiyou/staticCountDetailtwo', // 阅读统计总计详情
        component: () => import('@/views/readBookSetBeiyou/staticCountDetailtwo')
    },
    {
        path: 'readBookSetBeiyou/schoolBookList',
        component: () => import('@/views/readBookSetBeiyou/schoolBookList')
    },
    {
        path: 'readBookSetBeiyou/schoolBookAdd', // 阅读设置列表
        component: () => import('@/views/readBookSetBeiyou/schoolBookAdd')
    },
    {
        path: 'readBookSetBeiyou/schoolBookeidt', // 阅读设置列表
        component: () => import('@/views/readBookSetBeiyou/schoolBookeidt')
    },
    {
        path: 'readBookSetBeiyou/schoolBookinfo', // 阅读设置列表
        component: () => import('@/views/readBookSetBeiyou/schoolBookinfo')
    },
    {
        path: 'readBookSetBeiyou/bookAccounting', //
        component: () => import('@/views/readBookSetBeiyou/bookAccounting')
    },
    {
        path: 'readBookSetBeiyou/bookAccountingtwo', //
        component: () => import('@/views/readBookSetBeiyou/bookAccountingtwo')
    },
    {
        path: 'readBookSetBeiyou/staticStudentDetail', // 阅读统计学生详情
        component: () => import('@/views/readBookSetBeiyou/staticStudentDetail')
    },
]
