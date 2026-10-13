import Vue from 'vue';
import Vuex from 'vuex';
import app from './modules/app';
import detail from './modules/detail';
import homePage from './modules/homePage';
import homePageTwo from './modules/homePageTwo';
import getters from './getters';

Vue.use(Vuex);

const store =new Vuex.Store({
	modules:{
		app,
		homePage,
		homePageTwo,
		detail
	},
	getters
});

export default store;