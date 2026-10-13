export default [{
    name: 'matchActivityList',
    path: 'matchActivity/matchActivityList', //
    component: r => require.ensure([], () => r(require('@/views/matchActivity/matchActivityList')), 'page'),
    meta: {
        isCached: true
    }
}, {
    path: 'matchActivity/matchActivityAddEdit', //
    component: r => require.ensure([], () => r(require('@/views/matchActivity/matchActivityAddEdit')), 'page')
}, {
    path: 'matchActivity/matchActivityDetail', //
    component: r => require.ensure([], () => r(require('@/views/matchActivity/matchActivityDetail')), 'page'),
    meta: {
        keepCached: true
    }
}, {
    path: 'matchActivity/matchActivityDetail2',
    component: r => require.ensure([], () => r(require('@/views/matchActivity/matchActivityDetail2')), 'page'),
    meta: {
        keepCached: true
    }
}, {
    path: 'matchActivity/matchActivityWorkList', //
    component: r => require.ensure([], () => r(require('@/views/matchActivity/matchActivityWorkList')), 'page')
}, {
    path: 'matchActivity/matchActivityAddEdit2',
    component: r => require.ensure([], () => r(require('@/views/matchActivity/matchActivityAddEdit2')), 'page')
}]
