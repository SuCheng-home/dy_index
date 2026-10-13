import { login, logout, getInfo } from '@/api/login';
import Cookies from 'js-cookie';

const user = {
    state: {
        orgFilterParams: null,
        organizationalStructure:null

    },

    mutations: {
        SET_ORG_FILTER_PARAMS: (state, data) => {
            state.orgFilterParams = data;
        },
        SET_ORG_ANIZATIONALSTRUCTURE: (state, data) => {
            state.organizationalStructure = data;
        }
    },
    actions: {
        SetOrgFilterParams({ commit }, data) { //设置组织架构过滤参数，用于记录组织架构各种操作状态
            return new Promise((resolve, reject) => {
                commit('SET_ORG_FILTER_PARAMS', data);
            });
        },
        SETORGANIZATIONALSTRUCTURE({ commit }, data) { //区组织架构
            return new Promise((resolve, reject) => {
                commit('SET_ORG_ANIZATIONALSTRUCTURE', data);
            });
        },
    }
};

export default user;
