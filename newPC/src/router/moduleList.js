export default {
    normal: {
        homeSchool: [{
                name: '通知公告',
                moduleIcon: 'tzgg',
                permissionPath: '/notice',
                index: '/main/homeSchool/notice',
                children: [{
                        name: '收通知',
                        routePath: '/main/homeSchool/notice/notieRecive',
                        permissionPath: '/notice/receive'
                    },
                    {
                        name: '发通知',
                        routePath: '/main/homeSchool/notice/noticeIndex',
                        permissionPath: '/notice/sended'
                    },
                    {
                        name: '全部通知',
                        routePath: '/main/homeSchool/notice/allNoticeList',
                        permissionPath: '/notice/allNotices'
                    },
                    {
                        name: '班级通知',
                        routePath: '/main/homeSchool/notice/classNoticeList',
                        permissionPath: '/notice/getClassReceiveNoticeList'
                    },
                    {
                        name: '发送统计',
                        routePath: '/main/homeSchool/notice/noticeCount',
                        permissionPath: '/notice/statisticSend'
                    },
                    {
                        name: '阅读率统计',
                        routePath: '/main/homeSchool/notice/noticeReadRate',
                        permissionPath: '/notice/statisticRead'
                    },
                    {
                        name: '归档数据',
                        routePath: '/main/homeSchool/notice/allNoticeListnew',
                        permissionPath: '/notice/backIndex'
                    },
                    {
                        name: '家长阅读率统计',
                        fixedName: true,
                        routePath: '/main/homeSchool/notice/parentlist',
                        permissionPath: '/notice/statisticRead'
                    },
                ]
            },
            {
                name: '心理辅导预约',
                moduleIcon: 'tzgg',
                permissionPath: '/psychological/manage',
                index: '/main/homeSchool/psychological',
                children: [{
                        name: '辅导预约',
                        routePath: '/main/homeSchool/psychological/orderList'
                    },
                    // {
                    //   name: '预约详情',
                    //   routePath: '/main/homeSchool/taoWorkStation/orderDetail',
                    //   // permissionPath: '/notice/sended',
                    // },

                    {
                        name: '安排表',
                        routePath: '/main/homeSchool/psychological/planList'
                    },
                    {
                        name: '数据统计',
                        routePath: '/main/homeSchool/psychological/statistics'
                    },
                    {
                        name: '预约时间表',
                        routePath: '/main/homeSchool/psychological/addScheduleId'
                    }
                    // {
                    //   name: '验证码管理',
                    //   routePath: '/main/homeSchool/taoWorkStation/codeManageList',
                    //   // permissionPath: '/notice/statisticSend',
                    // },
                ]
            },
            {
                name: '食谱订餐',
                moduleIcon: 'shi-pu-tong-zhi',
                permissionPath: '/mealMenu/analysis',
                index: '/main/homeSchool/recipeOrdering',
                children: [{
                        name: '订餐食谱',
                        routePath: '/main/homeSchool/recipeOrdering/orderingRecipesindex',
                        permissionPath: '/mealMenu/mealMenuManage'
                    },
                    {
                        name: '数据统计',
                        routePath: '/main/homeSchool/recipeOrdering/middlePage'
                    },
                    {
                        name: '菜品库',
                        routePath: '/main/homeSchool/recipeOrdering/foodbankindex',
                        permissionPath: '/mealMenu/mealMenuManage'
                    },
                    {
                        name: '套餐库',
                        routePath: '/main/homeSchool/recipeOrdering/packageLibraryindex',
                        permissionPath: '/mealMenu/mealMenuManage'
                    }
                ]
            },
            {
                name: '数据推送',
                moduleIcon: 'zjyx',
                permissionPath: '/dataSend/getSchoolDataSendBatchPageList',
                routePath: '/main/homeSchool/dataPush/dataPushindex'
            },
            {
                name: '校园圈',
                moduleIcon: 'bjq',
                permissionPath: '/schoolCircle/schoolCircleTopicManage',
                routePath: '/main/homeSchool/campusCircle/campusCircleindex'
            },
            {
                name: '校园圈',
                moduleIcon: 'bjq',
                permissionPath: '/schoolfellowCircle/look',
                routePath: '/main/homeSchool/schoolCircle/index'
            },
            {
                name: '晨检',
                moduleIcon: 'zjcfk',
                permissionPath: '/scancodeEquipment/getScancodeFaceRecordList',
                routePath: '/main/homeSchool/morninginspectionrobot/morninginspectionrobotindex'
            },
            {
                name: '点名统计',
                moduleIcon: 'zxwrz',
                permissionPath: '/callName/analysis',
                routePath: '/main/homeSchool/rollCall/rollCall'
            },
            {
                name: '问卷',
                index: '/main/homeSchool/questionnaire',
                permissionPath: '/voteTwo',
                moduleIcon: 'wdwj',
                children: [{
                        name: '收问卷',
                        routePath: '/main/homeSchool/questionnaire/questionnairePersonalList'
                    },
                    {
                        name: '发问卷',
                        routePath: '/main/homeSchool/questionnaire/questionnaireList'
                    },
                    {
                        name: '局问卷',
                        routePath: '/main/homeSchool/questionnaire/questionnaireListFromBoe',
                        permissionPath: '/vote/voteListCode'
                    }
                ]
            },
            {
                name: '作业管理',
                moduleIcon: 'yd',
                permissionPath: '/homework/index',
                routePath: '/main/homeSchool/homework/homeworkIndex'
            },
            {
                name: '任务管理',
                moduleIcon: 'rwgl',
                index: '/main/homeSchool/task',
                permissionPath: '/task/myTaskList',
                children: [{
                        name: '发布任务',
                        routePath: '/main/homeSchool/task/taskList'
                    },
                    {
                        name: '我的任务',
                        routePath: '/main/homeSchool/task/myTaskList'
                    }
                ]
            },
             {
                 name: '家访',
                 moduleIcon: 'wdwj',
                     index: '/main/homeSchool/homeVisit',
                      permissionPath: '/homeVisit/homeVisitBatchList',
                     children: [{
                             name: '全员家访',
                             routePath: '/main/homeSchool/homeVisit/homeVisitindex',
                         }, {
                             name: '自主家访',
                             routePath: '/main/homeSchool/homeVisit/homeVisitindextwo',
                                 permissionPath: '/homeVisit/stuHomeVisitRecordTh',
                         }
                         ]
                         },
            {
                name: 'e打卡',
                moduleIcon: 'kq',
                permissionPath: '/ecard/ecardTh',
                routePath: '/main/homeSchool/eClock/clockList'
            },
            {
                name: '家校通',
                index: '/main/homeSchool/homeschoolthrough',
                permissionPath: '/activitiesApply/manage',
                moduleIcon: 'wdwj',
                children: [{
                        name: '活动审批',
                        routePath: '/main/homeSchool/homeschoolthrough/homeschoolthroughapproveindex'
                    },
                    {
                        name: '活动统计',
                        routePath: '/main/homeSchool/homeschoolthrough/homeschoolthroughstatistics'
                    },
                    {
                        name: '实践地点设置',
                        routePath: '/main/homeSchool/homeschoolthrough/homeschoolthroughplaceindex'
                    }
                ]
            },
            {
                name: '学生请假统计',
                moduleIcon: 'xsqj',
                routePath: '/main/homeSchool/studentLeave/studentLeaveStatistics',
                permissionPath: '/stuAskleaveThree/getStuAskleaveThreeListByNum'
            },
            {
                name: '离校看板',
                routePath: '/main/homeSchool/studentLeave/schoolBoard',
                permissionPath: '/stuAskleaveThree/getStuAskleaveThreeList',
                moduleIcon: 'lxkb'
            },
            // {
            //     name: '学生考勤',
            //     moduleIcon: 'xsq',
            //     routePath: '/main/homeSchool/stuRecordSet/index',
            //     permissionPath: '/stuAttendance/totalStuAttendance'
            // },
            {
                name: '学生请假',
                moduleIcon: 'xsqj',
                routePath: '/main/homeSchool/studentLeave/studentLeaveIndex',
                permissionPath: '/stuAskleave/getStuAskleaveListByClassHead'
            },
            {
                name: '学生出勤管理',
                index: '/main/homeSchool/stuRecordSet',
                fixedName: true,
                moduleIcon: 'kq',
                permissionPath: '/stuAskleave/getStuAskleaveStatisticalList',
                children: [{
                        name: '今日出勤',
                        routePath: '/main/homeSchool/stuRecordSet/index',
                    },
                    {
                        name: '请假记录',
                        routePath: '/main/homeSchool/stuRecordSet/newindex',
                    },
                    {
                        name: '考勤记录',
                        routePath: '/main/homeSchool/stuRecordSet/detail',
                    },
                    {
                        name: '出勤统计',
                        routePath: '/main/homeSchool/stuRecordSet/sum',
                    },
                ]
            },
            {
                name: '相册',
                moduleIcon: 'xc',
                permissionPath: 'album/getAlbumList',
                index: '/main/homeSchool/photo',
                children: [{
                        name: '班级相册',
                        routePath: '/main/homeSchool/photo/photoClassList',
                        permissionPath: 'album/getAlbumList'
                    },
                    {
                        name: '校园相册',
                        routePath: '/main/homeSchool/photo/schoolAlbum',
                        permissionPath: 'album/getAlbumList'
                    },
                    {
                        name: '相册回收箱',
                        routePath: '/main/homeSchool/photo/photoTrashCan',
                        permissionPath: '/album/albumRecyPage'
                    }
                ]
            },
            {
                name: '班级圈',
                moduleIcon: 'bjq',
                permissionPath: '/classCircle/classCircleManage',
                routePath: '/main/homeSchool/classCircle/classCircleListIndex'
            },
            {
                name: '班级荣誉',
                moduleIcon: 'ry',
                routePath: '/main/homeSchool/honorManagement/classHonor/index',
                permissionPath: '/classHonor/statisticClassHonor'
            },
            {
                name: '阅读打卡统计',
                moduleIcon: 'yd',
                permissionPath: '/readClockIn/analysis',
                index: '/main/homeSchool/readPunchClock',

                children: [{
                        name: '书籍阅读统计',
                        routePath: '/main/homeSchool/readPunchClock/ReadBookIndex'
                    },
                    {
                        name: '打卡情况统计',
                        routePath: '/main/homeSchool/readPunchClock/punchClockIndex'
                    },
                    {
                        name: '阅读计划完成情况统计',
                        routePath: '/main/homeSchool/readPunchClock/weekPlanIndex'
                    }
                ]
            },
            // 运动数据统计
            {
                name: '运动数据统计',
                permissionPath: '/sportsReport/statisticByClassIdAndDate',
                routePath: '/main/homeSchool/motionDataCollection/motionDataCollection',
                moduleIcon: 'yundong'
            },

            {
                // 家校应用
                name: '常用组',
                routePath: '/main/homeSchool/group/groupManagerIndex',
                permissionPath: '/groupManager/groupManagerIndex',
                moduleIcon: 'zu'
            },
            // {//书库管理
            //     name: '书库管理',
            //     icon: 'icon-homework',
            //     permissionPath: 'homework/index',
            //     routePath: '/main/homeSchool/library/libraryindex',
            // },
            {
                name: '幼儿自主阅读',
                moduleIcon: 'yd',
                permissionPath: '/readIndepend/theacher',
                index: '/main/homeSchool/readBookSetBeiyou',
                children: [{
                        name: '学校书库',
                        permissionPath: '/readIndepend/thMamger',
                        routePath: '/main/homeSchool/readBookSetBeiyou/schoolBookList'
                    },
                    {
                        name: '批次管理',
                        routePath: '/main/homeSchool/readBookSetBeiyou/readBookList'
                    },
                    {
                        name: '阅读统计',
                        routePath: '/main/homeSchool/readBookSetBeiyou/readStatistics'
                    }
                ]
            },
            {
                name: '幼儿自主分区',
                moduleIcon: 'yd',
                permissionPath: '/autonomyZone/autonomyZoneIndex',
                index: '/main/homeSchool/devideSectionBeiyou',
                children: [{
                        name: '班级分区设置',
                        routePath: '/main/homeSchool/devideSectionBeiyou/devideSectionList'
                    },
                    {
                        name: '按分区统计',
                        permissionPath: '/autonomyZone/autonomyZoneDataByZone',
                        routePath: '/main/homeSchool/devideSectionBeiyou/devideSectionAccounting'
                    },
                    {
                        name: '按班级统计',
                        routePath: '/main/homeSchool/devideSectionBeiyou/devideSectionAllClassAccounting'
                    },
                    {
                        name: '分区时长统计',
                        routePath: '/main/homeSchool/devideSectionBeiyou/devideSectionDurationAccounting'
                    },
                    {
                        name: '幼儿分区记录',
                        routePath: '/main/homeSchool/devideSectionBeiyou/devideSectionLog'
                    }
                ]
            },
            {
                name: '阅读',
                index: '/main/homeSchool/readBook',
                permissionPath: '/languageBook/getLanguageBookList',
                moduleIcon: 'yd',
                children: [{
                        name: '书库维护',
                        routePath: '/main/homeSchool/readBook/stackRoomIndex'
                    },
                    {
                        name: '阅读任务',
                        routePath: '/main/homeSchool/readBook/readTaskIndex'
                    }
                ]
            },
            {
                name: '家校共育',
                moduleIcon: 'xin-yu-zhi-chuang',
                permissionPath: '/heartEdu/pcIndex',
                index: '/main/homeSchool/mentalEducation',
                children: [
                    {
                        permissionPath: '/heartEdu/mangerInit',
                        name: '心育科普',
                        routePath: '/main/homeSchool/mentalEducation/popularization'
                    },
                    {
                        permissionPath: '/heartEdu/darkMan',
                        name: '心育投稿',
                        routePath: '/main/homeSchool/mentalEducation/contribution'
                    },
                    {
                        name: '心育咨询',
                        routePath: '/main/homeSchool/mentalEducation/consulting'
                    }, 
                    {   
                        permissionPath: '/activity/activityListKz',
                        name: '科中育坛',
                        routePath: '/main/homeSchool/mentalEducation/kezhongyutan/kezhongyutanList'
                    },
                    {   
                        permissionPath: '/activity/activityListJzh',
                        name: '家长会',
                        routePath: '/main/homeSchool/mentalEducation/parent/parentList'
                    },

                    {   permissionPath: '/heartEdu/volunteerPcTh',
                        name: '志愿者统计',
                        routePath: '/main/homeSchool/mentalEducation/volunteer/volunteerStatistics'
                    },
                    {   permissionPath: '/heartEdu/volunteerPcTh',
                        name: '志愿推荐',
                        routePath: '/main/homeSchool/mentalEducation/volunteer/volunteerRecommendation'
                    },
                    {   permissionPath: '/activity/activityListBehMan',
                        name: '家长评价',
                        routePath: '/main/homeSchool/mentalEducation/evaluateParents/evaluateParents'
                    }
                    
                ]
            },
            {
                name: '志愿者统计',
                routePath: '/main/homeSchool/mentalEducation/volunteer/volunteerStatistics',
                moduleIcon: 'xin-yu-zhi-chuang',
                permissionPath: '/heartEdu/volunteerPcTh',
            },
            {
                name: '小主人成长发布会',
                routePath: '/main/homeSchool/childrenGrowUp/index',
                moduleIcon: 'wdwj',
                permissionPath: '/growthConference/analysis'
            },
            {
                name: '学生考勤统计',
                routePath: '/main/homeSchool/studentAttendanceLiuhe/accounting',
                moduleIcon: 'wdwj',
                permissionPath: '/stuAttendance/stuAttendanceRecordDataStatics'
            },
            {
                name: '精彩活动',
                routePath: '/main/homeSchool/matchActivity/matchActivityList',
                moduleIcon: 'wdwj',
                permissionPath: '/wonderfulActivity/activityList'
            }
        ],
        teachingStudy: [{
                name: '阅读平台',
                moduleIcon: 'yd',
                permissionPath: '/readPlat/readPlatHome',
                routePath: '/main/teachingStudy/readingplatform/readingplatformindex'
            },
            {
                name: '课程表',
                moduleIcon: 'kcb',
                permissionPath: '/classSchedule/teacherClassSchedule',
                index: '/main/teachingStudy/classScheduleCard',
                children: [{
                        routePath: '/main/teachingStudy/classScheduleCard/myclassScheduleCardindex',
                        name: '我的课表'
                    },
                    {
                        name: '课表管理',
                        routePath: '/main/teachingStudy/classScheduleCard/classScheduleCardindex',
                        permissionPath: '/classSchedule/allClassSchedule'
                    },
                    {
                        name: '全校总表',
                        routePath: '/main/teachingStudy/classScheduleCard/allclassScheduleCard',
                        permissionPath: '/classSchedule/allClassSchedule'
                    },
                    {
                        name: '教师课表',
                        routePath: '/main/teachingStudy/classScheduleCard/classScheduleCardwholetwo',
                        permissionPath: '/classSchedule/allClassSchedule'
                    },
                    {
                        name: '临时停课',
                        routePath: '/main/teachingStudy/classScheduleCard/linshiindex',
                        permissionPath: '/classSchedule/getClassScheduleStopListMan'
                    },
                    {
                        name: '课时统计',
                        routePath: '/main/teachingStudy/classScheduleCard/coursehourstatistics',
                        permissionPath: '/classSchedule/getClassScheduleTeacherStaticList'
                    }
                ]
            },
             {
                 name: '代课调课',
                     moduleIcon: 'dktk',
                     permissionPath: '/supplyClass/toSupplyAdjustClassListPage',
                     index: '/main/teachingStudy/supplyClass',
                     children: [{
                             routePath: '/main/teachingStudy/supplyClass/index',
                             name: '代课调课'
                         },
                         {
                             name: '代课调课统计',
                             routePath: '/main/teachingStudy/supplyClass/statistics'
                         },
                         {
                             name: '代课抵扣',
                             routePath: '/main/teachingStudy/supplyClass/offsetRecord'
                         },
                         {
                             name: '代课抵扣统计',
                             routePath: '/main/teachingStudy/supplyClass/offsetStatistics'
                         }
                     ]
                 }, {
                name: '智能排课',
                moduleIcon: 'pk',
                permissionPath: '/systemSchedule/manage',
                routePath: '/main/teachingStudy/Intelligencecourse/Intelligencecourseindex'
            },
            {
                name: '成绩管理',
                moduleIcon: 'cj',
                permissionPath: '/exam/examList',
                routePath: '/main/teachingStudy/exam/index'
            },
            {
                name: '记分册',
                moduleIcon: 'jfc',
                permissionPath: '/structure/scoreBook/getClassByRole',
                routePath: '/main/teachingStudy/recordbookindex'
            },
            {
                name: '教师教学绩效',
                routePath: '/main/teachingStudy/teachingPerformance/teachingPerformanceindex',
                permissionPath: '/teacherAppraise/appraise',
                moduleIcon: 'jxjx'
            },
            {
                name: '公开课',
                moduleIcon: 'gkk',
                permissionPath: '/listenClassRegister/toRegisterListPage',
                index: '/main/teachingStudy/openClass',
                children: [{
                        routePath: '/main/teachingStudy/openClass/schoolIndex',
                        name: '校内公开课'
                    },
                    {
                        name: '我的公开课',
                        routePath: '/main/teachingStudy/openClass/myIndex'
                    },
                    {
                        name: '公开课审批',
                        routePath: '/main/teachingStudy/openClass/approvalIndex',
                        permissionPath: '/pc/listenClassRegister/toRegisterExaminePage'
                    }
                ]
            },
            {
                name: '听课预约统计',
                moduleIcon: 'tkyy',
                permissionPath: '/listenClassOrder/getTeacherMonOrderNum',
                index: '/main/teachingStudy/listenClass',
                children: [{
                        routePath: '/main/teachingStudy/listenClass/statisticsIndex',
                        name: '听课统计'
                    },
                    {
                        name: '听课明细',
                        routePath: '/main/teachingStudy/listenClass/detailIndex'
                    }
                ]
            },
             {
                 name: '听课记录统计',
                     permissionPath: '/listenClassRecord/getClassRecordStatisticalList',
                     index: '/main/teachingStudy/listenClassJiLu',
                     moduleIcon: 'tkyy',
                     children: [{
                             name: '听课统计',
                             routePath: '/main/teachingStudy/listenClassJiLu/statistics'
                         },
                         {
                             name: '听课明细',
                             routePath: '/main/teachingStudy/listenClassJiLu/detail'
                         },
                         {
                             name: '被听课统计',
                             routePath: '/main/teachingStudy/listenClassJiLu/thStatistics'
                         }
                     ]
                 },
            {
                name: '代班',
                moduleIcon: 'dktk',
                permissionPath: '/substituteClass/substituteClassList',
                routePath: '/main/teachingStudy/supplyLesson/supplyLessonList'
            },
            {
                name: '英语美文',
                routePath: '/main/teachingStudy/beautifulEnglish/index',
                permissionPath: '/beautifulEnglish/seeList',
                moduleIcon: 'yymw'
            },
            {
                name: '雅行教育',
                moduleIcon: 'jiaoyu',
                index: '/main/teachingStudy/yaxing',
                permissionPath: '/gracefulEdu/set',
                children: [{
                        name: '优雅班级',
                        routePath: '/main/teachingStudy/yaxing/1/yaxingList'
                    },
                    {
                        name: '雅美教师',
                        routePath: '/main/teachingStudy/yaxing/2/yaxingList'
                    },
                    {
                        name: '雅行辅导员',
                        routePath: '/main/teachingStudy/yaxing/3/yaxingList'
                    }
                ]
            },
            {
                name: '玩转汉字统计',
                moduleIcon: 'wzhz',
                permissionPath: '/playWord/getCheckGradeCharBySchoolId',
                index: '/main/teachingStudy/chineseCharacters',
                children: [{
                        name: '识字量统计',
                        routePath: '/main/teachingStudy/chineseCharacters/chineseCharactersone'
                    },
                    {
                        name: '识字量排行',
                        routePath: '/main/teachingStudy/chineseCharacters/chineseCharacterstwo'
                    },
                    {
                        name: '年级变化曲线',
                        routePath: '/main/teachingStudy/chineseCharacters/chineseCharactersthree'
                    },
                    {
                        name: '班级变化曲线',
                        routePath: '/main/teachingStudy/chineseCharacters/chineseCharactersfive'
                    }
                ]
            },
            {
                name: '儿童研究听课',
                moduleIcon: 'er-tong-yan-jiu-ting-ke',
                permissionPath: '/studySubject/index',
                index: '/main/teachingStudy/studySubject',
                children: [{
                        name: '自主听课',
                        routePath: '/main/teachingStudy/studySubject/autonomy'
                    },
                    {
                        name: '组织听课',
                        routePath: '/main/teachingStudy/studySubject/organization'
                    }
                ]
            },
            {
                name: '教师评语',
                permissionPath: '/teacherComment/queryTeacherComment',
                moduleIcon: 'er-tong-yan-jiu-ting-ke',
                routePath: '/main/teachingStudy/teacherComment/teacherCommentIndex'
            },
            {
                name: '评教评学',
                // permissionPath: '/teacherComment/queryTeacherComment',
                moduleIcon: 'er-tong-yan-jiu-ting-ke',
                index: '/main/teachingStudy/evTea',
                permissionPath: '/evaluateTw/evaluateTwBatch',
                children: [{
                        name: '评教评学',
                        routePath: '/main/teachingStudy/evTea/evTeaList',
                        permissionPath: '/evaluateTw/evaluateTwBatch'
                    },
                    {
                        name: '模板管理',
                        routePath: '/main/teachingStudy/evTea/evTeaTempList',
                        permissionPath: '/evaluateTw/evaluateTwTemp'
                    }
                ]
            },
            {
                name: '评教评学',
                // permissionPath: '/teacherComment/queryTeacherComment',
                moduleIcon: 'er-tong-yan-jiu-ting-ke',
                index: '/main/teachingStudy/evTeaKinder',
                permissionPath: '/evaluateTw/evaluateTwBatchYoung',
                children: [{
                        name: '评教评学',
                        routePath: '/main/teachingStudy/evTeaKinder/evTeaList',
                        permissionPath: '/evaluateTw/evaluateTwBatchYoung'
                    },
                    {
                        name: '模板管理',
                        routePath: '/main/teachingStudy/evTeaKinder/evTeaTempList',
                        permissionPath: '/evaluateTw/evaluateTwTempYoung'
                    }
                ]
            },
             {
                 name: '信息查询',
                 moduleIcon: 'er-tong-yan-jiu-ting-ke',
                 permissionPath: '/infoSearch/infoSearchList',
                 routePath: '/main/teachingStudy/infoSearch/infoSearchList'
             },
            {
                name: '高中招生报名',
                moduleIcon: 'er-tong-yan-jiu-ting-ke',
                index: '/main/teachingStudy/schoolSignupHigh',
                permissionPath: '/enrollStudentInfo/enrollMainIndex',
                children: [{
                        name: '招生公告',
                        routePath: '/main/teachingStudy/schoolSignupHigh/signupBatchList',
                        permissionPath: '/enrollStudentInfo/toNoticeListPage'
                    },
                    {
                        name: '登记名单',
                        routePath: '/main/teachingStudy/schoolSignupHigh/signupStuList',
                        permissionPath: '/enrollStudentInfo/noticeEnrollStudentList'
                    },
                    {
                        name: '预审名单',
                        routePath: '/main/teachingStudy/schoolSignupHigh/shenpione',
                        permissionPath: '/enrollStudentInfo/stuInfoFirstApprovalList'
                    },
                    {
                        name: '二审名单',
                        routePath: '/main/teachingStudy/schoolSignupHigh/shenpitwo',
                        permissionPath: '/enrollStudentInfo/stuInfoSecondApprovalList'
                    },
                    {
                        name: '三审名单',
                        routePath: '/main/teachingStudy/schoolSignupHigh/shenpithree',
                        permissionPath: '/enrollStudentInfo/stuInfoThirdApprovalList'
                    },
                    {
                        name: '咨询会',
                        routePath: '/main/teachingStudy/schoolSignupHigh/queryMeetingList',
                        permissionPath: '/enrollStudentInfo/toNoticeListPage'
                    },
                    {
                        name: '名单分组',
                        routePath: '/main/teachingStudy/schoolSignupHigh/signupGroupList',
                        permissionPath: '/enrollStudentInfo/toNoticeListPage'
                    },
                    {
                        name: '发送短信',
                        routePath: '/main/teachingStudy/schoolSignupHigh/sendMessage',
                        permissionPath: '/enrollStudentInfo/toNoticeListPage'
                    },
                    {
                        name: '招生报告',
                            routePath: '/main/teachingStudy/schoolSignupHigh/enrollmentReport',
                            permissionPath: '/enrollStudentInfo/enrollStuScoreStaticsList'
                        }, {
                        name: '沟通记录',
                            routePath: '/main/teachingStudy/schoolSignupHigh/communicationRecordslist',
                            permissionPath: '/enrollStudentInfo/studentCommRecordList'
                    }, {
                          name: '招生专员设置',
                              routePath: '/main/teachingStudy/schoolSignupHigh/registrationSpecialist',
                              permissionPath: '/enrollStudentInfo/noticeSpecialistForManager'
                    }, {
                                  name: '分管领导设置',
                                      routePath: '/main/teachingStudy/schoolSignupHigh/responsibleLeader',
                                      permissionPath: '/enrollStudentInfo/noticeInchargeManage'
                    }, {
                        name: '招生设置',
                        routePath: '/main/teachingStudy/schoolSignupHigh/setting',
                        permissionPath: '/enrollStudentInfo/toFieldSetPage'
                        }
                ]
            },
            {
                name: '青蓝同辉',
                moduleIcon: 'zxxxw',
                index: '/main/teachingStudy/qlth',
                permissionPath: '/cyanBlue/manager',
                children: [{
                        name: '青蓝同辉批次管理',
                        routePath: '/main/teachingStudy/qlth/batchManage',
                        permissionPath: '/cyanBlue/toManagerBatchListPage'
                    },
                    {
                        name: '青蓝同辉(师)',
                        routePath: '/main/teachingStudy/qlth/masterIndex',
                        permissionPath: '/cyanBlue/toMasterBatchListPage'
                    },
                    {
                        name: '青蓝同辉(徒)',
                        routePath: '/main/teachingStudy/qlth/apprenticeIndex',
                        permissionPath: '/cyanBlue/toPrenticeBatchListPage'
                    },
                    {
                        name: '青蓝同辉师徒管理',
                        routePath: '/main/teachingStudy/qlth/qlthSettingIndex',
                        permissionPath: '/cyanBlue/toMasterPrenticeListPage'
                    }
                ]
            },
            // {
            //     name: '教研组活动批次管理',
            //     moduleIcon: 'er-tong-yan-jiu-ting-ke',
            //     routePath: '/main/teachingStudy/teachingGroupActivity/batchList'
            // },
        ],
        schoolManage: [{
                name: '学校新闻',
                moduleIcon: 'zxxxw',
                index: '/main/schoolManage/news',
                permissionPath: '/journalism/approvalAndList',
                children: [{
                        name: '新闻列表',
                        routePath: '/main/schoolManage/news/newsIndex',
                        permissionPath: 'journalism/index'
                    },
                    {
                        name: '新闻审批',
                        routePath: '/main/schoolManage/news/newsApprovalList',
                        permissionPath: '/journalism/journalismExamine'
                    }
                ]
            },
            {
                name: '值班管理',
                    moduleIcon: 'kq',
                    index: '/main/schoolManage/dutyArrangement',
                    permissionPath: '/structure/watch/watchTh',
                    children: [{
                            name: '值班组',
                            routePath: '/main/schoolManage/dutyArrangement/dutyArrangementlist',
                            permissionPath: '/structure/watch/watchMan'
                        },
                        {
                            name: '签到统计',
                            routePath: '/main/schoolManage/dutyArrangement/dutyArrangementstatistics',
                            permissionPath: '/structure/watch/watchManStatic'
                        }, {
                            name: '行政陪餐统计',
                            routePath: '/main/schoolManage/dutyArrangement/newdutyArrangementstatistics',
                            permissionPath: '/structure/watch/watchManStaticMeal'
                        }
                    ]
            }, 
            {
                name: '活动管理',
                moduleIcon: 'zhdgl',
                permissionPath: '/activity/activityList',
                routePath: '/main/schoolManage/activity/activityMyList'
            },
            {
                name: '法制大课堂',
                    moduleIcon: 'wdwj',
                    permissionPath: '/pushMsg/msgPc',
                    index: '/main/schoolManage/releaseTemplate',
                        children: [{
                                name: '收活动',
                                routePath: '/main/schoolManage/releaseTemplate/newreleaseTemplateindex?newmoduleCode=2026020902',
                            },
                            {
                                name: '发活动',
                                permissionPath: '/pushMsg/msgManPc',
                                routePath: '/main/schoolManage/releaseTemplate/releaseTemplateindex?newmoduleCode=2026020902',
                            },
                        ]
                }, {
                name: '班级外出',
                moduleIcon: 'zhdgl',
                permissionPath: '/structure/classOut/classOutManPc',
                index: '/main/schoolManage/classOuting',
                children: [
                        {
                            name: '外出记录',
                            routePath: '/main/schoolManage/classOuting/outingRecord' 
                        },
                        {
                            name: '按日期统计',
                            routePath: '/main/schoolManage/classOuting/outingStatistics' 
                        }
                    ]
            },
            {
                name: '会议签到',
                moduleIcon: 'zhyqd',
                permissionPath: '/meeting/meetingList',
                routePath: '/main/schoolManage/meeting/meetingList'
            },
            {
                // 日程统计
                name: '日程统计',
                moduleIcon: 'zrctj',
                permissionPath: '/calendar/calendarCount',
                routePath: '/main/schoolManage/schedule/schedulelist'
            },
            {
                name: '周工作计划',
                routePath: '/main/schoolManage/weekWorkplan/weekWorkplanindex',
                permissionPath: '/weeklyWorkplan/simple/release/list',
                moduleIcon: 'zzgzjh'
            },
            {
                name: '工作计划',
                moduleIcon: 'zgzjh',
                permissionPath: '/workPlan/listNotice',
                index: '/main/schoolManage/workPlan',
                children: [{
                        name: '工作计划通知',
                        routePath: '/main/schoolManage/workPlan/workPlanindex'
                    },
                    {
                        name: '工作计划上报',
                        routePath: '/main/schoolManage/workPlan/planReport',
                        permissionPath: '/workPlan/add'
                    },
                    {
                        name: '工作计划汇总',
                        routePath: '/main/schoolManage/workPlan/planSummary',
                        permissionPath: '/workPlan/publish'
                    }
                ]
            },
            {
                name: '工作计划通知',
                index: '/main/schoolManage/newWorkPlan',
                permissionPath: '/growthWorkPlan/workPlanNotice',
                moduleIcon: 'zzgzjh',
                children: [{
                        name: '学校',
                        routePath: '/main/schoolManage/newWorkPlan/newWorkPlanindex'
                    },
                    {
                        name: '部门',
                        routePath: '/main/schoolManage/newWorkPlan/newWorkPlanindextwo'
                    },
                    {
                        name: '个人',
                        routePath: '/main/schoolManage/newWorkPlan/newWorkPlanindexthree'
                    }
                ]
            },
            {
                name: '工作计划上报',
                index: '/main/schoolManage/workPlan2',
                permissionPath: 'gongzuojihua',
                moduleIcon: 'zgzjh',
                children: [{
                        name: '个人工作计划上报',
                        routePath: '/main/schoolManage/workPlan2/newWorkPlanpersonal',
                            permissionPath: '/growthWorkPlan/personalGrowthWorkPlan',
                    },
                    {
                        name: '部门工作计划上报',
                        routePath: '/main/schoolManage/workPlan2/newWorkPlandepartment',
                        permissionPath: '/growthWorkPlan/departGrowthWorkPlan'
                    },
                    {
                        name: '学校工作计划上报',
                        routePath: '/main/schoolManage/workPlan2/newWorkPlanschool',
                        permissionPath: '/growthWorkPlan/schoolGrowthWorkPlan'
                    }
                ]
            },
            {
                // 校务日志
                name: '校务日志',
                moduleIcon: 'zxwrz',
                permissionPath: '/schoolLog/getSchoolLogList',
                routePath: '/main/schoolManage/schoolLog/schoolLogindex'
            },
            // {
            // 	name: '教师请假4',
            // 	index: '/main/schoolManage/teacherLeave4',
            // 	moduleIcon: 'zlsqj',
            // 	permissionPath: '/thAskLeaveFour/getStatisticsList',
            // 	children: [
            // 		{
            // 			name: '请假统计',
            // 			routePath: '/main/schoolManage/teacherLeave4/leaveAccounting'
            // 		},
            // 		{
            // 			name: '请假列表',
            // 			routePath: '/main/schoolManage/teacherLeave4/leaveTable'
            // 		}
            // 	]
            // },
            {
                name: '进出校日志',
                moduleIcon: 'zxwrz',
                permissionPath: '/gate/getGateInfoList',
                routePath: '/main/schoolManage/gate/gatelist'
            },
            {
                name: '教师出勤统计',
                moduleIcon: 'zlsqj',
                permissionPath: '/attendance/attendanceUserAnalysis',
                index: '/main/schoolManage/attenAccounting',
                children: [{
                        name: '出勤统计',
                        permissionPath: '/attendance/attendanceAnalysis',
                        routePath: '/main/schoolManage/attenAccounting/accountingByDate'
                    },
                    {
                        name: '出勤统计(按人)',
                        permissionPath: '/attendance/attendanceCollect',
                        routePath: '/main/schoolManage/attenAccounting/accountingByPerson'
                    },
                    {
                        name: '教师考勤统计',
                        permissionPath: '/attendance/attendanceAnalysis',
                        routePath: '/main/schoolManage/attenAccounting/teacherAttendanceStatisticsAllTypesList'
                    },

                    {
                        name: '请假统计',
                        permissionPath: '/teacherAskleave/getTeacherAskleaveStatisticalList',
                        routePath: '/main/schoolManage/attenAccounting/teacherleave/teacherleaveindex'
                    },
                    {
                        name: '请假统计', // 4
                        permissionPath: '/thAskLeaveFour/getStatisticsList',
                        routePath: '/main/schoolManage/attenAccounting/teacherLeave4/leaveAccounting'
                    },
                    {
                        name: '请假明细',
                        permissionPath: '/teacherAskleave/getTeacherAskleaveStatisticalList',
                        routePath: '/main/schoolManage/attenAccounting/teacherleave/teacherleavelist'
                    },
                    {
                        name: '请假明细', // 4
                        permissionPath: '/thAskLeaveFour/getThAskListByTh',
                        routePath: '/main/schoolManage/attenAccounting/teacherLeave4/leaveTable'
                    },
                    {
                        name: '请假审批', // 4
                        permissionPath: '/thAskLeaveFour/getThAskListByByDealUser',
                        routePath: '/main/schoolManage/attenAccounting/teacherLeave4/newleaveTable'
                    },
                    {
                        name: '抵扣条',
                        permissionPath: '/deductionDeduction/findOverTimeDeductionDeductionByPage',
                        routePath: '/main/schoolManage/attenAccounting/overtimeDeduction/applyList'
                    },
                    {
                        name: '抵扣统计',
                        permissionPath: '/deductionDeduction/findOverTimeDeductionDeductionByPage',
                        routePath: '/main/schoolManage/attenAccounting/overtimeDeduction/statistics'
                    },
                    {
                        name: '加班统计',
                        permissionPath: '/extraWork/extraWorkCount',
                        routePath: '/main/schoolManage/attenAccounting/extraWork/extraWorklisttwo'
                    },
                    {
                        name: '外出统计',
                        permissionPath: '/outApply/manage',
                        routePath: '/main/schoolManage/attenAccounting/outApplyStatistics/outApplyList'
                    },
                ]
            },
            // {
            // 	name: '考勤统计',
            // 	moduleIcon: 'zkqtj',
            // 	permissionPath: '/attendance/attendanceAnalysis',
            // 	routePath: '/main/schoolManage/teacherAttendance/teacherAttendanceStatisticsIndex'
            // },
            {
                name: '文件批示流转',
                moduleIcon: 'zgwlz',
                permissionPath: '/documentFlow/getDocumentFlowList',
                routePath: '/main/schoolManage/documentFlow/index'
            },
            {
                name: '录制申请统计',
                moduleIcon: 'zlzsq',
                permissionPath: '/recordingapplication/statistics',
                routePath: '/main/schoolManage/recordList'
            },
            {
                name: '护导',
                moduleIcon: 'zhd',
                permissionPath: '/guide/statisticalRecordsData',
                index: '/main/schoolManage/guide',
                children: [{
                        name: '按天统计',
                        routePath: '/main/schoolManage/guide/guideStatisticsDay'
                    },
                    {
                        name: '按周统计',
                        routePath: '/main/schoolManage/guide/guideStatisticsWeek'
                    },
                    {
                        name: '按分类统计',
                        routePath: '/main/schoolManage/guide/guideStatisticsClassify'
                    },
                    {
                        name: '按老师统计',
                        routePath: '/main/schoolManage/guide/guideStatisticsTeacher'
                    }
                ]
            },
             {
                name: '校园巡查',
                moduleIcon: 'zzhjc',
                permissionPath: '/complexRecord/goComplexRecordStatisticsPage',
                index: '/main/schoolManage/compositeExamTwo',
                children: [{
                        name: '按日期统计',
                        routePath: '/main/schoolManage/compositeExamTwo/compositeExamTwoIndex',
                    },
                    {
                        name: '按责任人统计',
                        routePath: '/main/schoolManage/compositeExamTwo/personInCharge'
                    }
                ]
            },
            // {
            //     name: '校园巡查',
            //     moduleIcon: 'zzhjc',
            //     routePath: '/main/schoolManage/compositeExamTwo/compositeExamTwoIndex',
            //      permissionPath: '/complexRecord/goComplexRecordStatisticsPage',
                
            // },
            {
                name: '校园检查',
                moduleIcon: 'zxyjc',
                permissionPath: '/star/starModuleManage',
                index: '/main/schoolManage/campusInspection',
                children: [{
                        name: '检查统计',
                        routePath: '/main/schoolManage/campusInspection/campusInspectionone'
                    },
                    {
                        name: '班级统计',
                        routePath: '/main/schoolManage/campusInspection/campusInspectiontwo'
                    },
                    {
                        name: '老师统计',
                        routePath: '/main/schoolManage/campusInspection/campusInspectionThree'
                    }
                ]
            },

            {
                // 荣誉管理
                name: '荣誉管理',
                moduleIcon: 'zrygl',
                index: '/main/schoolManage/honorManagement',
                permissionPath: '/honor/management',
                children: [{
                        name: '学校荣誉统计',
                        routePath: '/main/schoolManage/honorManagement/schoolHonorStatistic/index',
                        permissionPath: '/schoolHonor2/statisticSchoolHonor'
                    },
                    {
                        name: '教师荣誉统计',
                        routePath: '/main/schoolManage/honorManagement/teacherHonorStatistic/index',
                        permissionPath: '/teacherHonor/statistics'
                    },

                    {
                        name: '媒体报道',
                        routePath: '/main/schoolManage/honorManagement/mediaCoverage/index',
                        permissionPath: '/mediaReport/add'
                    },
                    {
                        name: '学生荣誉',
                        routePath: '/main/schoolManage/honorManagement/honor/schoolTotal',
                        permissionPath: '/schoolHonor/schoolHonorStuFile'
                    },
                    {
                        name: '学生荣誉设置',
                        routePath: '/main/schoolManage/honorManagement/honourGradeSet/honourGradeList',
                        permissionPath: '/schoolHonor/schoolHonorTypeList'
                    }
                ]
            },
            {
                name: '大事记',
                moduleIcon: 'zdsj',
                permissionPath: '/bigEventNote/entrance',
                index: '/main/schoolManage/memorabilia',
                children: [{
                        name: '大事记上报',
                        permissionPath: '/bigEventNote/goBigEventNoteListPage',
                        routePath: '/main/schoolManage/memorabilia/memorabiliaList'
                    },
                    {
                        name: '大事记统计',
                        permissionPath: '/bigEventNote/goBigEventNoteManagerListPage',
                        routePath: '/main/schoolManage/memorabilia/memorabiliaStatic'
                    }
                ]
            },
            {
                name: '校友审批',
                moduleIcon: 'zjcfk',
                permissionPath: '/schoolfellow/list',
                routePath: '/main/schoolManage/schoolMate/applyList'
            },
            {
                name: '六十事',
                moduleIcon: 'zlss',
                routePath: '/main/schoolManage/tenEventStatistics/tenEventStaIndex',
                permissionPath: '/eachyear_tenthings/statisticThingsList'
            },

            {
                name: '综合检查统计', // 版本1
                moduleIcon: 'zzhjc',
                permissionPath: '/composite/toCountPage',
                index: '/main/schoolManage/compositeExam',
                children: [{
                        name: '日期统计',
                        routePath: '/main/schoolManage/compositeExam/dateAccountIndex'
                    },
                    {
                        name: '周次统计',
                        routePath: '/main/schoolManage/compositeExam/weekAccount'
                    },
                    {
                        name: '时间段统计',
                        routePath: '/main/schoolManage/compositeExam/timeAccount'
                    },
                    {
                        name: '检查项统计',
                        routePath: '/main/schoolManage/compositeExam/typeAccount'
                    },
                    {
                        name: '问题反馈记录',
                        routePath: '/main/schoolManage/compositeExam/feedbackAccount'
                    }
                ]
            },
            {
                name: '检查反馈',
                moduleIcon: 'zjcfk',
                permissionPath: '/checkFeedback/findCheckFeedbackList',
                routePath: '/main/schoolManage/checkFeedBack/feedBackList'
            },
            //  {
            //      name: '建议箱',
            //      moduleIcon: 'zjyx',
            //      permissionPath: '/advice/getAdviceList',
                //  index: '/main/schoolManage/advice',
                //  children: [{
                //          name: '全部建议',
                //          routePath: '/main/schoolManage/advice/list'
                //      },
                     // {
                     //     name: '建议处理',
                     //     routePath: '/main/schoolManage/advice/newlist'
                     // },
                     // {
                     //     name: '数据统计',
                     //     routePath: '/main/schoolManage/advice/adviceStatistics'
                     // },
            //      ]
            //  },
            {
               name: '建议箱',
               moduleIcon: 'zjyx',
               permissionPath: '/advice/getAdviceListBatch',
                index: '/main/schoolManage/advice',
                children: [{
                        name: '全部建议',
                        routePath: '/main/schoolManage/advice/list',
                         permissionPath: '/advice/getAdviceListAll',
                    },
                    {
                        name: '建议处理',
                        routePath: '/main/schoolManage/advice/newlist'
                    },
                    {
                        name: '数据统计',
                        routePath: '/main/schoolManage/advice/adviceStatistics',
                         permissionPath: '/advice/getAdviceListStatic',
                    },
                ]
            },
            {
                name: '印制管理',
                moduleIcon: 'zjyx',
                permissionPath: '/printSeniorApply/printManage',
                index: '/main/schoolManage/printApplication',
                children: [{
                        fixedName: true,
                        name: '印制申请',
                        permissionPath: '/printSeniorApply/toApplyListPage',
                        routePath: '/main/schoolManage/printApplication/printApply'
                    },
                    {
                        fixedName: true,
                        name: '耗材申请',
                        permissionPath: '/supplies/toApplyListPage',
                        routePath: '/main/schoolManage/printApplication/printApply?kind=material',
                        // menuSettingKey: 'print'
                    },
                    {
                        name: '印制审批',
                        permissionPath: '/printSeniorApply/toApproveListPage',
                        routePath: '/main/schoolManage/printApplication/printApplyReviewList'
                    },
                    {
                        fixedName: true,
                        name: '耗材审批',
                        permissionPath: '/supplies/toApproveListPage',
                        routePath: '/main/schoolManage/printApplication/printApplyReviewList?kind=material',
                        // menuSettingKey: 'print'
                    },
                    {
                        name: '文件打印',
                        permissionPath: '/printSeniorApply/toPrintListPage',
                        routePath: '/main/schoolManage/printApplication/printList'
                    },
                    {
                        fixedName: true,
                        name: '耗材发放',
                        permissionPath: '/supplies/toSupplySend',
                        routePath: '/main/schoolManage/printApplication/printList?kind=material',
                        // menuSettingKey: 'print'
                    },
                    {
                        fixedName: true,
                        name: '影印统计',
                        permissionPath: '/printSeniorApply/toUserStatisticsMan',
                        routePath: '/main/schoolManage/printApplication/printAccountingByUser?kind=file'
                    },
                    {
                        fixedName: true,
                        name: '耗材统计',
                        permissionPath: '/supplies/toStatistics',
                        routePath: '/main/schoolManage/printApplication/printAccountingByMaterial?kind=material',
                        // menuSettingKey: 'print'
                    }
                ]
            },

            {
                name: '流动红旗',
                moduleIcon: 'zhdgl',
                permissionPath: '/flowBanner/manage',
                routePath: '/main/schoolManage/flowBanner/list'
            },
            {
                name: '图书领用',
                moduleIcon: 'zhdgl',
                permissionPath: '/bookReceive/index',
                routePath: '/main/schoolManage/bookReceiveBeiyou/bookReceiveList'
            },
            {
                name: '局发文',
                moduleIcon: 'zjyx',
                permissionPath: '/bureauDocument/schoolDocumentIndex',
                index: '/main/schoolManage/distText',
                children: [{
                    name: '已收局发文',
                    moduleIcon: 'zhdgl',
                    permissionPath: '/bureauDocument/schoolBureauDocumentList',
                    routePath: '/main/schoolManage/distText/distTextList'
                }]
            },
            {
                name: '新生登记审核',
                moduleIcon: 'zjcfk',
                permissionPath: '/newRegistration/listPage',
                routePath: '/main/schoolManage/newStuReview/newStuReviewList'
            },
            {
                name: '用车管理',
                moduleIcon: 'zjcfk',
                permissionPath: '/main/schoolManage/yongcheguanli',
                routePath: '/main/schoolManage/yongcheguanli/yongcheguanliindex'
            }
        ],
        generalLogistics: [{
                name: '收费资金确认',
                permissionPath: '/fundApply/getFundChargeUser',
                routePath: '/main/generalLogistics/fundApplication/confirmationofFeefundsIndex',
                moduleIcon: 'shou-tui-fei',
            },
            {
                name: '资金支出申请',
                permissionPath: '/fundApply/getFundApplyListByApply',
                routePath: '/main/generalLogistics/fundApplication/fundApplicationindex',
                moduleIcon: 'shou-tui-fei',
            },
            {
                name: '资金支出申请复核',
                permissionPath: '/fundApply/getFundApplyListBySchBatch',
                routePath: '/main/generalLogistics/fundApplicationApproval/fundApplicationApprovalindex',
                moduleIcon: 'zxwrz',
            },
            // {
            //     name: '收费项目申请',
            //     permissionPath: '/fundApply/getFundApplyListByApply',
            //     routePath: '/main/generalLogistics/fundApplication/newfundApplicationindex',
            //     moduleIcon: 'shou-tui-fei',
            //     fixedName: true,
            // },

            // {
            //     name: '收费项目申请复核',
            //     permissionPath: '/fundApply/getFundApplyListBySchBatch',
            //     routePath: '/main/generalLogistics/fundApplication/newfundApplicationApprovalindex',
            //     moduleIcon: 'zxwrz',
            //     fixedName: true,
            // },
            {
                name: '校园电话',
                moduleIcon: 'shi-pin-yu-ding',
                permissionPath: '/schoolTelephone',
                index: '/main/generalLogistics/campustelephone',
                children: [{
                        name: '授权用户',
                        routePath: '/main/generalLogistics/campustelephone/campustelephoneone',
                        moduleIcon: 'shi-pin-yu-ding'
                    },
                    {
                        name: '话机管理',
                        routePath: '/main/generalLogistics/campustelephone/campustelephonetwo'
                    },
                    {
                        name: '命令返回',
                        routePath: '/main/generalLogistics/campustelephone/campustelephonethree'
                    },
                    {
                        name: '通话数据',
                        routePath: '/main/generalLogistics/campustelephone/campustelephonfour'
                    },
                    {
                        name: '充值数据',
                        routePath: '/main/generalLogistics/campustelephone/campustelephoneRecharge'
                    }
                ]
            },
            {
                name: '绩效管理',
                moduleIcon: 'shi-pin-yu-ding',
                permissionPath: '/performance',
                index: '/main/generalLogistics/performance',
                children: [{
                        name: '考核任务',
                        permissionPath: '/performance/manage',
                        routePath: '/main/generalLogistics/performance/testAssignment',
                        moduleIcon: 'shi-pin-yu-ding'
                    },
                    {
                        name: '绩效上报',
                        permissionPath: '/performance/assess',
                        routePath: '/main/generalLogistics/performance/performanceReport'
                    },
                    {
                        name: '绩效审核',
                        permissionPath: '/performance/audit',
                        routePath: '/main/generalLogistics/performance/performanceCheck'
                    },
                    {
                        name: '考核项设置',
                        permissionPath: '/performance/itemManage',
                        routePath: '/main/generalLogistics/performance/testSet'
                    },
                    {
                        name: '反馈留言',
                        permissionPath: '/performance/message',
                        routePath: '/main/generalLogistics/performance/feedbackMessageIndex'
                    }
                ]
            },
            {
                name: '短信管理',
                permissionPath: '/structure/smsMessage/index',
                routePath: '/main/generalLogistics/shortmessage/shortmessageindex',
                moduleIcon: 'shi-pin-yu-ding'
            },
               {
                   name: '访客预约',
                       moduleIcon: 'zxwrz',
                       permissionPath: '/structure/visit/visitstatic',
                       index: '/main/generalLogistics/visitorReservation',
                       children: [{
                               name: '预约统计',
                               routePath: '/main/generalLogistics/visitorReservation/visitorReservationindex',
                           },
                           {
                               name: '预约设置',
                               routePath: '/main/generalLogistics/visitorReservation/index',
                               permissionPath: '/structure/visit/visitMan',
                           }
                       ]
                   }, {
                name: '入校预约',
                    moduleIcon: 'zxwrz',
                    permissionPath: '/structure/socialReser/socialReserMan',
                    index: '/main/generalLogistics/admissionReservation',
                    children: [{
                            name: '预约记录',
                            routePath: '/main/generalLogistics/admissionReservation/admissionReservationlist',
                        },
                        {
                            name: '预约设置',
                            routePath: '/main/generalLogistics/admissionReservation/admissionReservationinfo'
                        }
                    ]
                }, 
            {
                name: '访客记录',
                moduleIcon: 'zxwrz',
                permissionPath: '/visitor/visitorList',
                routePath: '/main/generalLogistics/visitor/visitorList'
            },
            {
                name: '支付服务',
                permissionPath: '/orderpay/billflow',
                index: '/main/generalLogistics/newcharge',
                moduleIcon: 'shi-pin-yu-ding',
                children: [{
                        name: '支付设置',
                        permissionPath: '/schoolCharge/index',
                        routePath: '/main/generalLogistics/newcharge/newchargesetupindex'
                    },
                    {
                        name: '收款设置',
                        routePath: '/main/generalLogistics/newcharge/collectionsettings'
                    },
                    {
                        name: '交易流水',
                        permissionPath: '/orderpay/billflow/queryBillFlowList',
                        routePath: '/main/generalLogistics/newcharge/transactionFlow'
                    },
                    {
                        name: '对账单',
                        permissionPath: '/orderpay/bill/queryBillSummary',
                        routePath: '/main/generalLogistics/newcharge/accountStatement'
                    },
                    // {
                    // 	name: '绑卡统计',
                    // 	permissionPath: '/refundapply/queryPayRefundapplyList',
                    // 	routePath: '/main/generalLogistics/newcharge/cardbindingstatisticsindex'
                    // },
                    // {
                    // 	name: '批量退费',
                    // 	routePath: '/main/generalLogistics/newcharge/generationrefundindex',
                    // 	permissionPath: '/refundapply/queryPayRefundapplyList'
                    // },
                    {
                        name: '交易下发记录',
                        routePath: '/main/generalLogistics/newcharge/distributionrecord'
                    },
                    // {
                    // 	name: '清分',
                    // 	routePath: '/main/generalLogistics/newcharge/sortingindex'
                    // }
                    // {
                    //   name: "一卡通对账",
                    //   permissionPath: '/structure/oneCartoon/rechargeThird',
                    //   routePath: '/main/generalLogistics/newcharge/campusCrdReconciliation'
                    // },
                    // {
                    //   name: "消费记录",
                    //   permissionPath: '/structure/campusCard/syncConsumeRecord',
                    //   routePath: '/main/generalLogistics/newcharge/recordsofconsumption'
                    // },
                    {
                        name: "分账统计",
                        routePath: '/main/generalLogistics/newcharge/merchantstatistics'
                    }
                ]
            },
            {
                name: '批量退费',
                permissionPath: '/refundapply/queryPayRefundapplyList',
                index: '/main/generalLogistics/plnewcharge',
                moduleIcon: 'shi-pin-yu-ding',
                children: [{
                        name: '绑卡统计',
                        routePath: '/main/generalLogistics/plnewcharge/cardbindingstatisticsindex'
                    },
                    {
                        name: '批量退费',
                        routePath: '/main/generalLogistics/plnewcharge/generationrefundindex'
                    }, {
                        name: '退费明细',
                        routePath: '/main/generalLogistics/plnewcharge/plnewchargedetails'
                    }
                ]
            },
            {
                name: '积分查询',
                moduleIcon: 'zxwrz',
                permissionPath: '/abc/point/user/getABCPointUserForPage',
                routePath: '/main/generalLogistics/integralquery/integralqueryindex'
            },
            {
                name: '退费信息登记',
                moduleIcon: 'wdwj',
                permissionPath: '/refundRegister/refundRegisterDatas',
                routePath: '/main/generalLogistics/refundRegister/index'
            },
            {
                name: '退费信息登记',
                moduleIcon: 'wdwj',
                permissionPath: '/refundRegisterTwo/refundRegisterDatas',
                routePath: '/main/generalLogistics/refundRegisterTwo/index'
            },
            {
                name: '食品预订',
                permissionPath: '/pastry/manage',
                index: '/main/generalLogistics/foodReservation',
                moduleIcon: 'shi-pin-yu-ding',
                children: [{
                        name: '食品设置',
                        routePath: '/main/generalLogistics/foodReservation/foodReservationindex'
                    },
                    {
                        name: '食品订单统计',
                        permissionPath: '/pastry/orderAnalysis',
                        routePath: '/main/generalLogistics/foodReservation/foodReservationorderone'
                    }
                ]
            },
            {
                //膳食管理
                name: '膳食营养',
                permissionPath: 'dietary/querySchoolMenu',
                routePath: '/main/generalLogistics/dietaryManagement/dietaryManagementindex',
                moduleIcon: 'shan-shi-ying-yang'
            },
            {
                name: '食谱通知',
                routePath: '/main/generalLogistics/recipe/recipeIndex',
                permissionPath: 'recipe/recipeList',
                moduleIcon: 'shi-pu-tong-zhi'
            },
            {
                name: '食谱管理',
                permissionPath: '/dietMenu/dietMenuList',
                routePath: '/main/generalLogistics/recipeManage/list',
                moduleIcon: 'shi-pin-yu-ding'
            },
            {
                name: '停伙',
                permissionPath: '/fire/analysis',
                index: '/main/generalLogistics/fire',
                moduleIcon: 'ting-huo-tong-ji',
                children: [{
                        name: '停伙统计',
                        routePath: '/main/generalLogistics/fire/statisticsIndex'
                    },
                    {
                        name: '按月统计',
                        routePath: '/main/generalLogistics/fire/monthStatisticsIndex'
                    },
                    {
                        name: '停伙确认',
                        routePath: '/main/generalLogistics/fire/getFireRecordMonth?moduleType=1',
                        permissionPath: '/structure/fire/getFireRecordMonthMan',
                    },
                    {
                        name: '停伙明细',
                        routePath: '/main/generalLogistics/fire/statisticsDetail'
                    },
                    {
                        name: '缺餐统计',
                        routePath: '/main/generalLogistics/fire/lack',
                        permissionPath: '/mobile/report/reportMissAnalysis',
                    },
                    {
                        name: '加餐统计',
                        routePath: '/main/generalLogistics/fire/addition',
                        permissionPath: '/mobile/report/reportAddAnalysis',
                    },
                    {
                        name: '停伙退费',
                        routePath: '/main/generalLogistics/fire/newrestaurantRefundindex'
                    }
                ]
            },
            {
                name: '订餐调查',
                permissionPath: '/fireSurvey/manage',
                index: '/main/generalLogistics/newfire',
                moduleIcon: 'ting-huo-tong-ji',
                children: [{
                        name: '订餐登记',
                        routePath: '/main/generalLogistics/newfire/diningsurveyindex'
                    },
                    {
                        name: '订餐统计',
                        routePath: '/main/generalLogistics/newfire/bookingstatistics'
                    },
                    {
                        name: '每日报告',
                        routePath: '/main/generalLogistics/newfire/everydayindex'
                    }
                ]
            },
            {
                name: '物品领用',
                permissionPath: '/good/queryOrderByUserId',
                index: '/main/generalLogistics/itemManagement',
                moduleIcon: 'shi-pin-yu-ding',
                children: [
                     {
                         name: '物品领用',
                         permissionPath: '/good/queryOrderByUserId',
                         routePath: '/main/generalLogistics/itemManagement/newgoodsindex/newgoodslist?id=0&pId=0'
                     },
                      {
                          name: '我的领用',
                          permissionPath: '/good/queryOrderByUserId',
                          routePath: '/main/generalLogistics/itemManagement/newitemManagementStatisticsindex'
                      },
                    {
                        name: '物品管理',
                        permissionPath: '/good/getGoodTypeBySchoolId',
                        routePath: '/main/generalLogistics/itemManagement/goodsindex/goodslist?id=0&pId=0'
                    },
                   
                    {
                        name: '物品申请单',
                        permissionPath: '/good/queryOrderBySchoolId',
                        routePath: '/main/generalLogistics/itemManagement/itemManagementStatisticsindex'
                    },
                    {
                        name: '物品统计',
                        permissionPath: '/good/queryOrderBySchoolId',
                        routePath: '/main/generalLogistics/itemManagement/itemManagementStatisticssix'
                    },
                    {
                        name: '全部领用记录',
                        permissionPath: '/good/queryOrderBySchoolId',
                        routePath: '/main/generalLogistics/itemManagement/goodsCollectlistallbig'
                    }
                ]
            },
            // {
            // 	name: '物品管理',
            // 	moduleIcon: 'zyygl',
            // 	permissionPath: '/good/getGoodTypeBySchoolId',
            // 	routePath: '/main/generalLogistics/itemManagement/goodsindex'
            // },
            // {
            // 	name: '物品申请单',
            // 	moduleIcon: 'zjcfk',
            // 	permissionPath: '/good/queryOrderBySchoolId',
            // 	routePath: '/main/generalLogistics/itemManagement/itemManagementStatisticsindex'
            // },
            {
                name: '就餐停伙',
                permissionPath: '/repastManagement/statistics',
                index: '/main/generalLogistics/mealSuspend',
                moduleIcon: 'jiu-can-ting-huo-tong-ji',
                children: [{
                        name: '基础统计',
                        routePath: '/main/generalLogistics/mealSuspend/baseStatistics'
                    },
                    {
                        name: '停伙确认',
                        routePath: '/main/generalLogistics/mealSuspend/getFireRecordMonth?moduleType=2',
                        permissionPath: '/structure/fire/getFireRecordMonthMan',
                    },
                    {
                        name: '统计报表',
                        routePath: '/main/generalLogistics/mealSuspend/statisticalReport'
                    },
                    {
                        name: '就餐停伙统计',
                        routePath: '/main/generalLogistics/mealSuspend/restaurantRefundregister'
                    },

                    {
                        name: '加餐统计',
                        permissionPath: '/mobile/report/reportAddAnalysis',
                        routePath: '/main/generalLogistics/mealSuspend/addEatingStatistics'
                    },
                    {
                        name: '缺餐统计',
                        permissionPath: '/mobile/report/reportMissAnalysis',
                        routePath: '/main/generalLogistics/mealSuspend/lackEatingStatistics'
                    },
                    {
                        name: '退费',
                        routePath: '/main/generalLogistics/mealSuspend/restaurantRefundindex'
                    }
                ]
            },
            {
                name: '工餐统计',
                permissionPath: '/sarah/getSarahListBySendDate',
                index: '/main/generalLogistics/workingMeal',
                moduleIcon: 'ting-huo-tong-ji',
                children: [{
                        name: '当日汇总',
                        routePath: '/main/generalLogistics/workingMeal/workingMeallistone'
                    },
                    {
                        name: '时段统计',
                        routePath: '/main/generalLogistics/workingMeal/workingMeallisttwo'
                    }
                ]
            },
            {
                name: '报修管理',
                permissionPath: '/repair/repairListSchMan',
                index: '/main/generalLogistics/repairManage',
                moduleIcon: 'bao-xiu',
                children: [{
                        name: '报修处理',
                        permissionPath: '/repair/repairList',
                        routePath: '/main/generalLogistics/repairManage/repairIndex'
                    },
                    {
                        name: '报修统计',
                        permissionPath: '/repair/repairListAll',
                        routePath: '/main/generalLogistics/repairManage/repairAccountingIndex'
                    },
                ]
            },
            {
                name: '资源预约',
                permissionPath: 'resource/resourceOrderList',
                index: '/main/generalLogistics/resourceOrder',
                moduleIcon: 'zi-yuan-yu-yue',
                children: [{
                        name: '当日预约',
                        permissionPath: 'resource/resourceOrderList',
                        routePath: '/main/generalLogistics/resourceOrder/resourceOrderIndex'
                    },
                    {
                        name: '我的预约',
                        permissionPath: 'resource/resourceOrderList',
                        routePath: '/main/generalLogistics/resourceOrder/resourceOrderMyOrder'
                    },
                    {
                        name: '资源审核',
                        moduleIcon: 'zi-yuan-yu-yue',
                        permissionPath: 'resource/resourceExamineList',
                        routePath: '/main/generalLogistics/resourceOrder/resourceExamineIndex'
                    },
                    {
                        name: '资源预约统计',
                        moduleIcon: 'zi-yuan-yu-yue',
                        routePath: '/main/generalLogistics/resourceOrder/resourceOrderSummary',
                        permissionPath: '/resource/resourceOrderStaticsData'
                    },
                    {
                        name: '家长预约统计',
                        moduleIcon: 'zi-yuan-yu-yue',
                        routePath: '/main/generalLogistics/resourceOrder/parentResourceStatistics',
                        permissionPath: '/parentResource/getParentResourceListStatic'
                    },

                ]
            },
            {
                name: '寻物招领',
                permissionPath: 'lostDeclare/lostDeclareBySchoolId',
                index: '/main/generalLogistics/lostPropertyDeclaration',
                moduleIcon: 'shi-wu-zhao-ling',
                children: [{
                        name: '失物申报',
                        routePath: '/main/generalLogistics/lostPropertyDeclaration/lostPropertyDeclarationIndexV2'
                    },
                    {
                        name: '寻物招领启事',
                        routePath: '/main/generalLogistics/lostPropertyDeclaration/lostPropertyDeclarationSearchNoticeV2'
                    }
                ]
            },
            {
                //工资管理
                name: '工资管理',
                permissionPath: '/payroll/queryPayrollBatch',
                routePath: '/main/generalLogistics/wages/wagesindex',
                moduleIcon: 'gong-zi-guan-li'
            },
            {
                name: '收退费',
                permissionPath: '/chargeNotice/queryChargeNoticeList',
                index: '/main/generalLogistics/campusFees',
                moduleIcon: 'shou-tui-fei',
                children: [{
                        name: '学生收费',
                        routePath: '/main/generalLogistics/campusFees/campusFeesindex'
                    },
                    {
                        name: '老师收费',
                        routePath: '/main/generalLogistics/campusFees/thcampusFeesindex'
                    },
                    {
                        name: '非税账单',
                        permissionPath: '/njFinace/batchFee/list',
                        routePath: '/main/generalLogistics/campusFees/nonTaxRefundIndex'
                    }
                ]
            },
            {
                name: '福利发放',
                permissionPath: '/thWelfare/getThWelfareList',
                routePath: '/main/generalLogistics/benifits/benifitsList',
                moduleIcon: 'fu-li-fa-fang'
            },
            {
                name: '采购申请',
                routePath: '/main/generalLogistics/purchasing/purchasingList',
                moduleIcon: 'cai-gou-shen-qing',
                permissionPath: '/procure/getProcureListByDateScope'
            },
            {
                name: '宿舍管理',
                permissionPath: '/dormManage/dormManageModules',
                routePath: '/main/generalLogistics/dormitory/entranceIndex',
                moduleIcon: 'su-she-guan-li'
            },
            {
                // 校园卡
                name: '校园卡管理',
                moduleIcon: 'zxyk',
                permissionPath: '/campusCard/cardManage',
                index: '/main/generalLogistics/campusCrd',
                children: [{
                        name: '学生卡',
                        routePath: '/main/generalLogistics/campusCrd/campusCrdindexone',
                        permissionPath: '/campusCard/goCampusCardListPage'
                    },
                    {
                        name: '老师卡',
                        routePath: '/main/generalLogistics/campusCrd/campusCrdindextwo',
                        permissionPath: '/campusCard/isManager'
                    },
                    {
                        name: '班级卡',
                        routePath: '/main/generalLogistics/campusCrd/campusCrdindexthree',
                        permissionPath: '/campusCard/isManager'
                    }
                ]
            }
        ],
        stuEvaluate: [{
                name: '课堂评价分析',
                moduleIcon: 'zyhfx',
                permissionPath: '/schoolBehEval/classBehEvalStuScore',
                index: '/main/stuEvaluate/classroomEvaluationtwo',
                children: [{
                        name: '课堂评价学期统计',
                        permissionPath: '/schoolBehEval/classBehEvalStuScoreH',
                        routePath: '/main/stuEvaluate/classroomEvaluationtwo/classroomEvaluationtwoone'
                    },
                    {
                        name: '课堂评价统计',
                        permissionPath: '/schoolBehEval/classBehEvalStuScoreH',
                        routePath: '/main/stuEvaluate/classroomEvaluationtwo/classroomEvaluationtwotwo'
                    },
                    {
                        name: '课堂评价统计(单)',
                        permissionPath: '/schoolBehEval/classBehEvalCurrStuScore',
                        routePath: '/main/stuEvaluate/classroomEvaluationtwo/classroomEvaluationtwothree'
                    },
                    {
                        name: '课堂评价老师统计',
                        permissionPath: '/schoolBehEval/classBehEvalCurrStuScore',
                        routePath: '/main/stuEvaluate/classroomEvaluationtwo/classroomEvaluationtwofour'
                    }
                ]
            },
            {
                name: '小组评价统计',
                    moduleIcon: 'xiaozu',
                    permissionPath: '/schoolBehavior/getSchoolBehaviorGroupListStatic',
                    index: '/main/stuEvaluate/ketanggroup',
                    children: [{
                             name: '小组积分统计',
                                 routePath: '/main/stuEvaluate/ketanggroup/ketanggroupfour'
                             }, {
                                 name: '小组积分按天',
                                 routePath: '/main/stuEvaluate/ketanggroup/ketanggroupthree'
                             }, {
                             name: '小组积分按节',
                                 routePath: '/main/stuEvaluate/ketanggroup/ketanggrouptwo'
                             }, {
                                 name: '积分记录按节',
                                 routePath: '/main/stuEvaluate/ketanggroup/ketanggroupone'
                             }
                    ]
                }, {
                 name: '货币发行',
                     moduleIcon: 'shou-tui-fei',
                     permissionPath: '/peanutBeh/setPanutGrantInit',
                     index: '/main/stuEvaluate/peanut',
                     children: [{
                             name: '老师配额',
                             routePath: '/main/stuEvaluate/peanut/peanutindex'
                         },
                         {
                             name: '老师发放记录',
                             routePath: '/main/stuEvaluate/peanut/peanutth'
                         },
                         {
                             name: '学生发放记录',
                             routePath: '/main/stuEvaluate/peanut/peanutstu'
                         }
                     ]
                 }, {
                name: '综合实践评价',
                moduleIcon: 'zyhfx',
                permissionPath: '/practiceActivity/index',
                index: '/main/stuEvaluate/comprehensivepractice',
                children: [{
                        name: '实践主题活动',
                        permissionPath: '/practiceActivity/practiceActivityManage',
                        routePath: '/main/stuEvaluate/comprehensivepractice/comprehensivepracticeindex'
                    },
                    {
                        name: '我的主题活动',
                        permissionPath: '/practiceActivity/myPracticeActivityList',
                        routePath: '/main/stuEvaluate/comprehensivepractice/thcomprehensivepracticeindex'
                    }
                ]
            },
            {
                name: '班级评价统计',
                moduleIcon: 'bjpj',
                permissionPath: '/classRatingRecord/listByCheckDateStr',
                index: '/main/stuEvaluate/classroomEvaluation',
                children: [{
                        name: '日期统计',
                        routePath: '/main/stuEvaluate/classroomEvaluation/classroomEvaluationclassindex'
                    },
                    {
                        name: '时段统计',
                        routePath: '/main/stuEvaluate/classroomEvaluation/classroomEvaluationclasstimeinterval'
                    }
                ]
            },
            {
                name: '成长档案',
                moduleIcon: 'zxwrz',
                permissionPath: '/growthArchives/index',
                index: '/main/stuEvaluate/growthArchives',
                children: [{
                        name: '校内',
                        routePath: '/main/stuEvaluate/growthArchives/growthArchivesindexone'
                    },
                    {
                        name: '家长',
                        routePath: '/main/stuEvaluate/growthArchives/growthArchivesindextwo'
                    }
                ]
            },
            {
                name: '德育评价',
                moduleIcon: 'deyu',
                permissionPath: '/schoolConduct/classStuDimensionStatics',
                index: '/main/stuEvaluate/deyu',
                    children: [{
                        name: '按学生统计',
                        routePath: '/main/stuEvaluate/deyu/deyuSummaryTable'
                    }, {
                        name: '按评分项',
                        routePath: '/main/stuEvaluate/deyu/deyuAccountingByDimension'
                    }, {
                        name: '按老师统计',
                        routePath: '/main/stuEvaluate/deyu/newdeyuSummaryTable'
                    }]
            },
            {
                name: '体质健康',
                moduleIcon: 'tzjk',
                permissionPath: '/schoolFitnessTest/fitnessTestList',
                index: '/main/stuEvaluate/physicalHealth',
                children: [{
                        name: '数据汇总',
                        routePath: '/main/stuEvaluate/physicalHealth/fitnessList'
                    },
                    {
                        name: '批量导入',
                        routePath: '/main/stuEvaluate/physicalHealth/batchImport'
                    },
                    {
                        name: '按项录入',
                        routePath: '/main/stuEvaluate/physicalHealth/itemEnter'
                    },
                    {
                        name: '按学生录入',
                        routePath: '/main/stuEvaluate/physicalHealth/studentEnter'
                    }
                ]
            },
            {
                name: '课堂评价统计',
                moduleIcon: 'ktpj',
                permissionPath: '/schoolBehavior/classroomBehaviorManage',
                index: '/main/stuEvaluate/classroomEvaluate',
                children: [{
                        name: '学生统计（评价项）',
                        routePath: '/main/stuEvaluate/classroomEvaluate/classroomEvaluationStudent'
                    },
                    {
                        name: '学生统计（学科）',
                        routePath: '/main/stuEvaluate/classroomEvaluate/classroomEvaluationStudenttwo'
                    },
                    {
                        name: '老师统计',
                        permissionPath: '/schoolBehEval/teacherBehaviorStuScore',
                        routePath: '/main/stuEvaluate/classroomEvaluate/classroomEvaluationTeacher'
                    },
                    {
                        name: '考勤统计',
                        permissionPath: '/schoolBehavior/getSchoolBehaviorStuCallAttanceList',
                        routePath: '/main/stuEvaluate/classroomEvaluate/checkWorkAttendanceStatistics'
                    },
                ]
            },

            {
                name: '三星小雅士',
                moduleIcon: 'jiaoyu',
                permissionPath: '/gracefulEdu/set',
                routePath: '/main/stuEvaluate/yaxing/threeStarsGentleman/index'
            },
            {
                name: '累积式评价',
                moduleIcon: 'ljszwpj',
                permissionPath: '/leijishipingjiaPC',
                index: '/main/stuEvaluate/evaluateCumulative',
                children: [{
                        name: '助力记录',
                        routePath: '/main/stuEvaluate/evaluateCumulative/evaluateCumulativeindex',
                        permissionPath: '/cumulAssess/cumulAssessPointRecord'
                    },
                    {
                        name: '数据统计',
                        routePath: '/main/stuEvaluate/evaluateCumulative/evaluateCumulativeStatisticsone',
                        permissionPath: '/cumulAssess/cumulAssessDataAnalysis'
                    }
                ]
            },
            {
                name: '积分成长计划统计',
                moduleIcon: 'wtxy',
                permissionPath: '/creditPoint/analysis',
                index: '/main/stuEvaluate/wtManager',
                children: [{
                        name: '助力记录',
                        routePath: '/main/stuEvaluate/wtManager/wtPointRank'
                    },
                    {
                        name: '自主申领单',
                        routePath: '/main/stuEvaluate/wtManager/wtAutoApply'
                    },
                    {
                        name: '数据统计',
                        routePath: '/main/stuEvaluate/wtManager/wtExchange'
                    }
                ]
            },
            {
                name: '积分银行',
                moduleIcon: 'pk',
                permissionPath: '/integralBank/integralBankIndex',
                index: '/main/stuEvaluate/integralBank',
                children: [{
                        routePath: '/main/stuEvaluate/integralBank/pointQueryList',
                        name: '积分查询'
                    },
                    {
                        routePath: '/main/stuEvaluate/integralBank/pointMallList',
                        name: '积分商城'
                    },
                    {
                        routePath: '/main/stuEvaluate/integralBank/exchangeRecord',
                        name: '兑换记录'
                    },
                    {
                        routePath: '/main/stuEvaluate/integralBank/operationRecord',
                        name: '操作记录'
                    }
                ]
            },
            {
                name: '学生评优',
                moduleIcon: 'wtxy',
                index: '/main/stuEvaluate/studentAwarding',
                permissionPath: '/stuBeh/stuBehTh',
                children: [{
                        name: '活动管理',
                        routePath: '/main/stuEvaluate/studentAwarding/activityList',
                        permissionPath: '/stuBeh/stuBehActivityList'
                    },
                    {
                        name: '班主任审批材料',
                        routePath: '/main/stuEvaluate/studentAwarding/managerActivityList',
                        permissionPath: '/stuBeh/stuBehClassHead'
                    },
                    {
                        name: '任课老师评比',
                        routePath: '/main/stuEvaluate/studentAwarding/teacherActivityList',
                        permissionPath: '/stuBeh/stuBehThCurr'
                    },
                    {
                        name: '班级学生考评',
                        routePath: '/main/stuEvaluate/studentAwarding/studentActivityList',
                        permissionPath: '/stuBeh/stuBehClassHeadBeh'
                    }
                ]
            },
            {
                name: '勋章兑换',
                moduleIcon: 'jiaoyu',
                permissionPath: '/medalExchange/manage',
                routePath: '/main/stuEvaluate/medalExchange/medalExchangeList'
            },
            {
                name: '五星娃综合评价',
                moduleIcon: 'jiaoyu',
                permissionPath: '/schoolConduct/getSchoolConductStarBabyMan',
                routePath: '/main/stuEvaluate/fiveStarKid/fiveStarKidList'
            },
            {
                name: '慧思堂',
                moduleIcon: 'zyhfx',
                permissionPath: '/schoolBehavior/hshBehaviorMan',
                routePath: '',
                index: '/main/stuEvaluate/hshBehaviorMan',
                children: [
                    {
                        name: '个人画像',
                        routePath: '/main/stuEvaluate/hshBehaviorMan/personalPortrait'
                    },
                    {
                        name: '小组画像',
                        routePath: '/main/stuEvaluate/hshBehaviorMan/groupPortrait'
                    },
                    {
                        name: '学校看板',
                        routePath: '/main/stuEvaluate/hshBehaviorMan/schoolBoard'
                    },
                    {
                        name: '课堂回顾',
                        routePath: '/main/stuEvaluate/hshBehaviorMan/classReview'
                    }
                ]
            }
        ],
        sysManage: [{
                // 系统管理
                name: '用户管理',
                routePath: '/main/sysManage/org/index',
                permissionPath: '/depart/index',
                moduleIcon: 'zyhgl'
            },
            {
                name: '所教课程',
                routePath: '/main/sysManage/teachingClass/teachingClassIndex',
                permissionPath: '/teachingClass/index',
                moduleIcon: 'zsjkc'
            },
            {
                name: '部门主任',
                routePath: '/main/sysManage/officeManager/index',
                permissionPath: '/depart/manager',
                moduleIcon: 'zbmzr'
            },
            {
                name: '上下级配置',
                routePath: '/main/sysManage/upanddownindex',
                permissionPath: '/sys/userRelation',
                moduleIcon: 'zsxj'
            },
            {
                name: '学校字典',
                routePath: '/main/sysManage/schoolDictionary',
                permissionPath: '/schoolDic/schoolDicManage',
                moduleIcon: 'zxxzd'
            },
            {
                name: '系统设置',
                routePath: '/main/sysManage/sysSet/sysSetIndex',
                permissionPath: '/sysOthers',
                moduleIcon: 'zxtsz'
            },
            {
                name: '应用管理',
                routePath: '/main/sysManage/moduleManager/index',
                permissionPath: '/moduleManager',
                moduleIcon: 'zyygl'
            },
            {
                name: '模块使用分析',
                routePath: '/main/sysManage/modulestatistics/index',
                permissionPath: '/modulestatistics/statisticsTotalListPage',
                moduleIcon: 'zmksyfx'
            },
            {
                name: '用户分析',
                routePath: '/main/sysManage/statisticsSchool/index',
                permissionPath: '/statisticsSchool/index',
                moduleIcon: 'zyhfx'
            },
            {
                name: '邀请函',
                routePath: '/main/sysManage/invitation/index',
                permissionPath: '/invitation/index',
                moduleIcon: 'zyqh'
            },
            {
                name: '设备管理', //本来就没权限
                routePath: '/main/sysManage/sysSet/deviceManage/deviceList',
                permissionPath: '/deviceManage/deviceList',
                moduleIcon: 'zsbgl'
            },

            {
                name: '人脸库管理',
                routePath: '/main/sysManage/faceManageIndex',
                permissionPath: '/faceBaseManager/index',
                moduleIcon: 'zrlkgl'
            },
            {
                permissionPath: '/operation/index',
                name: '日志管理', //本来就没权限
                routePath: '/main/sysManage/operation/index',
                moduleIcon: 'zrzgl'
            }
        ]
    },
    system: {
        sysManage: [{
                // 系统管理
                name: '用户管理',
                routePath: '/system/sysManage/org/index',
                permissionPath: '/depart/index',
                moduleIcon: 'zyhgl'
            },
            // {
            //   name: '档案操作日志',
            //   icon: 'icon-depart',
            //   permissionPath: '/depart/index',
            //   routePath: '/main/sysManage/org/logList'
            // },
            {
                name: '所教课程',
                routePath: '/system/sysManage/teachingClass/teachingClassIndex',
                permissionPath: '/teachingClass/index',
                moduleIcon: 'zsjkc'
            },
            {
                name: '部门主任',
                routePath: '/system/sysManage/officeManager/index',
                permissionPath: '/depart/manager',
                moduleIcon: 'zbmzr'
            },
            {
                name: '上下级配置',
                routePath: '/system/sysManage/upanddownindex',
                permissionPath: '/sys/userRelation',
                moduleIcon: 'zsxj'
            },
            {
                name: '学校字典',
                routePath: '/system/sysManage/schoolDictionary',
                permissionPath: '/schoolDic/schoolDicManage',
                moduleIcon: 'zxxzd'
            },
            // {
            //     name: '系统设置',
            //     routePath: '/system/sysManage/sysSet/sysSetIndex',
            //     permissionPath: '/sysOthers',
            //     icon: 'icon-sysSet'
            // },
            {
                name: '应用管理',
                routePath: '/system/sysManage/moduleManager/index',
                permissionPath: '/moduleManager',
                moduleIcon: 'zyygl'
            },
            // {
            //     name: '模块使用分析',
            //     routePath: '/system/sysManage/modulestatistics/index',
            //     permissionPath: '/modulestatistics/statisticsTotalListPage',
            //     icon: 'icon-usage-analysis'
            // },
            {
                name: '用户分析',
                routePath: '/system/sysManage/statisticsSchool/index',
                permissionPath: '/statisticsSchool/index',
                moduleIcon: 'zyhfx'
            },
            {
                name: '邀请函',
                routePath: '/system/sysManage/invitation/index',
                permissionPath: '/invitation/index',
                moduleIcon: 'zyqh'
            },
            {
                name: '日志管理',
                moduleIcon: 'zrzgl',
                permissionPath: '/operation/index',
                index: '/main/sysManage/operation',
                children: [{
                        name: '操作日志',
                        routePath: '/main/sysManage/operation/index'
                    },
                    {
                        name: '档案日志',
                        routePath: '/main/sysManage/operation/logList'
                    }
                ]
            },
            {
                name: '人脸库管理',
                routePath: '/system/sysManage/faceManageIndex',
                permissionPath: '/faceBaseManager/index',
                moduleIcon: 'zrlkgl'
            }
        ]
    }
}
