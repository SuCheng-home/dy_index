import Cookies from 'js-cookie';

const app = {
    state: {
        theme: 'default',
        recipePage: {//食谱通知
            recipePageNo: 1,
            recipePageSize: 20,
            searchTitle: ''
        },
        clockPage: {//食谱通知
            recipePageNo: 1,
            recipePageSize: 20,
            startDate: '',
            endDate: ''
        },
        homework: {//作业管理
            pageNo: 1,
            pageSize: 20,
            searchTitle: '',
            readListPageNo: 1,
            readListPageSize: 20,
        },
        pcType: ''
    },
    mutations: {
        RECIPE_PAGE_CHANGE: (state, type) => {//食谱通知
            state.recipePage.recipePageNo = type.pageNo;
            state.recipePage.recipePageSize = type.pageSize;
        },
        CLOCK_PAGE_CHANGE: (state, type) => {//打卡
            state.clockPage.clockPageNo = type.pageNo;
            state.clockPage.clockPageSize = type.pageSize;
            state.clockPage.startDate = type.startDate;
            state.clockPage.endDate = type.endDate;
        },
        HOMEWORK_PAGE_CHANGE: (state, type) => {//作业管理
            state.homework.pageNo = type.pageNo;
            state.homework.pageSize = type.pageSize;
        },
        HOMEWORK_READLISTPAGE_CHANGE: (state, type) => {//作业管理已读列表
            state.homework.readListPageNo = type.readListPageNo;
            state.homework.readListPageSize = type.readListPageSize;
        },
        SET_PC_TYPE: (state, pcType) => {
            state.pcType = pcType;
        }
    },
    actions: {
    }
};

export default app;
