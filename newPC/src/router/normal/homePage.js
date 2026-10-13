export default [
    // 首页 start
    {
        path: '/main/homePage/index',
        component: () => import('@/views/homePage/index'),
    },
    {
        path: '/main/homePage/danyangHome', // 省丹中首页
        component: () => import('@/views/homePage/danyang/index'),
    },
    // 首页 end
    // 工作提醒 start
    {
        path: '/main/homePage/workReminder/index',
        component: () => import('@/views/homePage/aside/middle/workReminder/index'),
    }
    // 工作提醒 end
]