export default [{
    path: 'printApplication/printApply', //
    component: r => require.ensure([], () => r(require('@/views/printApplication/printApply/printApply')), 'page')
}, {
    path: 'printApplication/printApplyAddEdit', //
    component: r => require.ensure([], () => r(require('@/views/printApplication/printApply/printApplyAddEdit')), 'page')
}, {
    path: 'printApplication/printApplyDetail', //
    component: r => require.ensure([], () => r(require('@/views/printApplication/printApply/printApplyDetail')), 'page')
}, {
    path: 'printApplication/printList', //
    component: r => require.ensure([], () => r(require('@/views/printApplication/printApply/printList')), 'page')
}, {
    path: 'printApplication/printAccountingByPaper', //
    component: r => require.ensure([], () => r(require('@/views/printApplication/accounting/printAccountingByPaper')), 'page')
}, {
    path: 'printApplication/printAccountingByUser', //
    component: r => require.ensure([], () => r(require('@/views/printApplication/accounting/printAccountingByUser')), 'page')
}, {
    path: 'printApplication/printAccountingByUsage', //
    component: r => require.ensure([], () => r(require('@/views/printApplication/accounting/printAccountingByUsage')), 'page')
}, {
    path: 'printApplication/printAccountingByPaperDetail', //
    component: r => require.ensure([], () => r(require('@/views/printApplication/accounting/printAccountingByPaperDetail')), 'page')
}, {
    path: 'printApplication/printAccountingByMaterial', //
    component: r => require.ensure([], () => r(require('@/views/printApplication/accounting/printAccountingByMaterial')), 'page')
}, {
    path: 'printApplication/printAccountingApplyRecord',
    component: r => require.ensure([], () => r(require('@/views/printApplication/accounting/printAccountingApplyRecord')), 'page')
}, {
    path: 'printApplication/printApplyReviewList',
    component: r => require.ensure([], () => r(require('@/views/printApplication/review/printApplyReviewList')), 'page')
}]
