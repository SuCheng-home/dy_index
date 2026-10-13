import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import app from "./modules/app";
import permission from './modules/permission';
import webBasic from './modules/webBasic';
Vue.use(Vuex);

const store = new Vuex.Store({
  modules:{
    app,
    permission,
    webBasic
  },
  getters
})

export default store;