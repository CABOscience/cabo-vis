// store/index.js
 
import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import VueAxios from 'vue-axios';
import qs from 'qs';

Vue.use(Vuex);
Vue.use(VueAxios, axios);

Vue.axios.defaults.baseURL = "https://data.caboscience.org/api/v1/";
//Vue.axios.defaults.baseURL = "http://localhost:3001/api/v1/";
//Vue.axios.defaults.headers.common['Authorization'] = 'Bearer '+process.env.CABO_API_KEY;
Vue.axios.defaults.headers.common['Authorization'] = 'Bearer 2e9f97ef84b1069a1885c20d982a5c751b192492378a8a3e7db38c3f1024d76a';

export default new Vuex.Store({
	state: {
		search_box: {
			search_value: '',
			announce: '',
		},
		current_spectra: {
			spectra_ids: [],
			spectra: [],
		},
		sidebar: true,
	},
	getters: {},
	mutations: {
		save_search_spectra_ids(state, spectra_ids) {
			state.current_spectra.spectra_ids = spectra_ids;
			this.dispatch('getManySpectraMean');
			state.search_box.announce = spectra_ids.length + ' plants founds.'
		},
		save_spectra(state, spectra) {
			state.sidebar=false;
			state.current_spectra.spectra=spectra;
		},
		save_search(state, search) {
			state.search_box.search_value = search;
			this.dispatch('searchTaxa');
		},
		clear_spectra(state){
			state.current_spectra.spectra_ids=[];
			state.current_spectra.spectra=[];
		},
		plot_spectra(){
		},
		toggle_sidebar(state, search){
			state.sidebar=!state.sidebar;
		}
	},
	actions: {
		searchTaxa (context) {
			context.commit('clear_spectra');
			Vue.axios.get('leaf_spectra/search/taxa', {
				params: {
					taxa: context.state.search_box.search_value
				}}
			).then(result => {
				context.commit('save_search_spectra_ids', result.data);
			}).catch(error => {
				throw new Error(`API ${error}`);
			});
		},
		clearTaxa (context){
			context.commit('clear_spectra');
		},
		getOneSpectra (context) {
			Vue.axios.get('leaf_spectra/reflectance/'+context.state.current_spectra.spectra_ids[0].fulcrum_id).then(result => {
				context.commit('save_spectra', result.data);
			}).catch(error => {
				context.state.current_spectra.spectra_ids.shift(); //There are no spectra associated with last id
				context.commit('save_search_spectra_ids', context.state.current_spectra.spectra_ids);
				console.log(error)
			});
		},
		getManySpectra (context) {
			const gets = context.state.current_spectra.spectra_ids.map(sp => Vue.axios.get('leaf_spectra/reflectance/'+sp.fulcrum_id).catch(function(error){console.log(error);}));
			Vue.axios.all(gets).then(responses => {
				context.commit('save_spectra',responses);
			})
		},
		getManySpectraMean (context) {
			const ids = context.state.current_spectra.spectra_ids.map(sp => "'"+sp.fulcrum_id+"'");
			Vue.axios.get('/leaf_spectra_mean/search/', {
			  params: {
			    ids: ids,
			    type: 'reflectance'
			  },
			  paramsSerializer: params => {
			    return qs.stringify(params, {arrayFormat: 'brackets'})
			  }
			}).then(result => {
				context.commit('save_spectra',result.data);
			})
		}

	}
});
