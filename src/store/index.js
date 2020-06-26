// store/index.js
 
import Vue from "vue";
import Vuex from "vuex";
import axios from 'axios';
import VueAxios from 'vue-axios';
//import qs from 'qs';

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
			showLoader: false,
		},
		current_spectra: {
			spectra_ids: [],
			spectra: [],
		},
		plants_sample_ids : [],
		plants : [],
		sidebar: true,
		showAll: false,
		showSpectra: false,
	},
	getters: {},
	mutations: {
		save_search_spectra_ids(state, spectra_ids) {
			state.current_spectra.spectra_ids = spectra_ids;
			if(spectra_ids.length!=0){
				this.dispatch('getManySpectraMean');
				this.dispatch('getManyPlants');
			}else{
				this.dispatch('clearSpectra');
				state.showAll = false;
			}
			state.search_box.announce = spectra_ids.length + ' plants founds.'
		},
		save_spectra(state, spectra) {
			state.search_box.showLoader=false;
			state.showAll = true;
			state.sidebar=false;
			state.current_spectra.spectra=spectra;
		},
		save_plants(state, plants) {
			state.plants=plants;
		},
		save_search(state, search) {
			state.search_box.showLoader= true;
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
		clearSpectra (context){
			context.commit('clear_spectra');
			context.commit('save_spectra',[])
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
				resp=responses.map(m => { return m.data })
				context.commit('save_spectra',resp);
			})
		},
		getManyPlants (context) {
			const gets = context.state.current_spectra.spectra_ids.map(sp => Vue.axios.get('plants_samples',{
				params: {
					sample_id: sp.sample_id
				}
			}).catch(function(error){console.log(error);}));
			Vue.axios.all(gets).then(responses => {
				const resp=responses.map(m => m.data[0])
				context.commit('save_plants',resp);
			})
		},
		getManySpectraMean (context) {
			const ids = context.state.current_spectra.spectra_ids.map(sp => "'"+sp.fulcrum_id+"'");
			Vue.axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
			Vue.axios.post('/leaf_spectra_mean/search/', {
			  //params: {
			    ids: ids,
			    type: 'reflectance',
			  //},
			  //paramsSerializer: params => {
			  //  return qs.stringify(params, {arrayFormat: 'brackets'})
			  //}
			}).then(result => {
				context.commit('save_spectra',result.data);
			}).catch(error => {
				context.commit('save_spectra',[])
			});
		}

	}
});
