export default [{
    path: 'sysSet/printApplication/setting', // 根部门修改
    component: () => import('@/views/printApplication/setting/printApplicationSetting')
}, {
    path: 'sysSet/printApplication/typeSetting', // 根部门修改
    component: () => import('@/views/printApplication/setting/printTypeSetting')
}, {
    path: 'sysSet/printApplication/initSetting', // 根部门修改
    component: () => import('@/views/printApplication/setting/printInitSetting')
},{
    path: 'sysSet/office/officeindex',
    component: r => require.ensure([], () => r(require('@/views/printApplication/office/officeindex')), 'page')
},
{
    path: 'sysSet/office/officeadd',
    component: r => require.ensure([], () => r(require('@/views/printApplication/office/officeadd')), 'page')
},
]
