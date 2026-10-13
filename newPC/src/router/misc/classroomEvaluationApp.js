export default [
  {
    path: '/classroomEvaluationApp/login', //
    component: () => import('@/views/classroomEvaluationApp/classroomEvaluationAppLogin')
  },
  {
    path: '/classroomEvaluationApp/attendance', //
    component: () => import('@/views/classroomEvaluationApp/attendance')
  },
  {
    path: '/classroomEvaluationApp/classList', //
    component: () => import('@/views/classroomEvaluationApp/classList')
  },
  {
    path: '/classroomEvaluationApp/groupEvaluate', //
    component: () => import('@/views/classroomEvaluationApp/groupEvaluate')
  },
  {
    path: '/classroomEvaluationApp/scoreItemEvaluate', //
    component: () => import('@/views/classroomEvaluationApp/scoreItemEvaluate')
  },
  {
    path: '/classroomEvaluationApp/studentEvaluate', //
    component: () => import('@/views/classroomEvaluationApp/studentEvaluate')
  },
  {
    path: '/classroomEvaluationApp/studentNoEvaluate', //
    component: () => import('@/views/classroomEvaluationApp/studentNoEvaluate')
  },
  {
    path: '/classroomEvaluationApp/summary', //
    component: () => import('@/views/classroomEvaluationApp/summary')
  },
  {
    path: '/classroomEvaluationApp/afterStudentNoEvaluate', //
    component: () => import('@/views/classroomEvaluationApp/afterStudentNoEvaluate')
  },
  {
    path: '/classroomEvaluationApp/afterScoreItemEvaluate', //
    component: () => import('@/views/classroomEvaluationApp/afterScoreItemEvaluate')
  }
]
