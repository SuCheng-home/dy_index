export default [{
    path: 'teachingGroupActivity/batchAddEdit', //
    component: r => require.ensure([], () => r(require('@/views/teachingGroupActivity/batchAddEdit')), 'page')
}, {
    path: 'teachingGroupActivity/batchList', //
    component: r => require.ensure([], () => r(require('@/views/teachingGroupActivity/batchList')), 'page')
}, {
    path: 'teachingGroupActivity/batchDetail', //
    component: r => require.ensure([], () => r(require('@/views/teachingGroupActivity/batchDetail')), 'page')
}, {
    path: 'teachingGroupActivity/planAccounting', //
    component: r => require.ensure([], () => r(require('@/views/teachingGroupActivity/planAccounting')), 'page')
}, {
    path: 'teachingGroupActivity/summaryAccounting', //
    component: r => require.ensure([], () => r(require('@/views/teachingGroupActivity/summaryAccounting')), 'page')
}, {
    path: 'teachingGroupActivity/courseGroupAccounting', //
    component: r => require.ensure([], () => r(require('@/views/teachingGroupActivity/courseGroupAccounting')), 'page')
}, {
    path: 'teachingGroupActivity/courseGroupDetail', //
    component: r => require.ensure([], () => r(require('@/views/teachingGroupActivity/courseGroupDetail')), 'page')
}, {
    path: 'teachingGroupActivity/juanliangAccounting', //
    component: r => require.ensure([], () => r(require('@/views/teachingGroupActivity/juanliangAccounting')), 'page')
}]
