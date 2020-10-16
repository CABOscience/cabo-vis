// store/index.js
 
import Vue from "vue";
import Vuex from "vuex";
import {i18n} from '../plugins/i18n';
import fs from 'fs';

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		search_box: {
			search_value: '',
			announce: '',
			geomFilter: '',
			startDate: '',
			endDate: '',
			projects: '',
		},
		current_spectra: {
			spectra_ids: [],
			spectra: [],
			which: 'reflectance',
			reBox: true,
			showRange: "true",
		},
		plants_sample_ids : [],
		plants : [],
		species_options: [],
		species_selected: [],
		sidebar: false,
		showAll: false,
		showLoader: false,
		showSpectra: false,
		showSpectraGraph: false,
		showSpectraDownloadSpinner: false,
		showPlantSpectraDownloadSpinner: false,
		showAllPlantSpectraDownloadSpinner: false,
		showMarkerPlantSpectraDownloadSpinner: false,
	},
	getters: {},
	mutations: {
		save_search_spectra_ids(state, spectra_ids) {
			state.current_spectra.spectra_ids = spectra_ids;
			let tt=0
			if(state.species_options.length !== 0) {
				state.species_options=state.species_options.filter(function(value, index, self){
					return state.species_selected.indexOf(value.scientific_name) !== -1;
				})
			}
			state.species_options=state.species_options.concat(spectra_ids.map(t => {
				return t.scientific_name
			}).filter(function(value, index, self) {
				return self.indexOf(value) === index && state.species_selected.indexOf(value)=== -1 ;				
			}).map(function(t){
				let o = {}
				o.scientific_name=t
				o.key=tt++
				return o
			}))

			if(spectra_ids.length!=0){
				state.species_selected=state.species_options.map(t => {
					return t.scientific_name
				})
				this.dispatch('getManySpectraMeanTaxa');
				this.dispatch('getManyPlants');
			}else{
				this.dispatch('clearSpectra');
				state.showAll = false
				state.showLoader=false
				state.showSpectra=false
			}
			state.search_box.announce = spectra_ids.length + i18n.t('_plants_found')
		},
		save_spectra(state, spectra) {
			state.showLoader=false;
			state.showAll=true;
			state.sidebar=true;
			state.showSpectra=true
			state.showSpectraGraph=false
			if(spectra!=false){
				state.current_spectra.spectra=spectra;
			}
		},
		save_plants(state, plants) {
			state.plants=plants;
		},
		species_select(state) {
			if(state.showLoader!=true){
				this.dispatch('saveSpectra');
			}
		},
		save_search(state) {
			state.showLoader=true
			this.dispatch('clearSpectra');
			this.dispatch('searchTaxa');
		},
		reflectance_transmittance(state, which) {
			state.current_spectra.which = which;
			//this.dispatch('saveSpectra',state.current_spectra.spectra, false);
		},
		species_selected(state, which) {
			state.species_selected = which;
			//this.dispatch('saveSpectra',state.current_spectra.spectra, false);
		},
		clear_spectra(state){
			/*state.current_spectra.spectra_ids=[];
			state.current_spectra.spectra=[];*/
		},
		plot_spectra(){
		},
		toggle_sidebar(state, search){
			state.sidebar=!state.sidebar;
		},
		download_taxa_mean_csv(state){
			state.showSpectraDownloadSpinner=true
			this.dispatch('downloadTaxaMeanCSV')
		}, 
		download_plant_spectra_csv(state, record_id){
			this.dispatch('downloadPlantSpectraCSV',record_id)
		},
		download_all_plant_spectra_csv(state){
			state.showAllPlantSpectraDownloadSpinner=true
			this.dispatch('downloadAllPlantSpectraCSV')
		}
	},
	actions: {
		searchTaxa (context) {
			context.commit('clear_spectra');
			if((context.state.search_box.search_value !== '' && context.state.search_box.search_value !== ' ') | context.state.search_box.geomFilter !=='' | context.state.search_box.projects!=='' | context.state.search_box.startDate!==''){
				Vue.axios.post('leaf_spectra/search/taxa', {
						taxa: context.state.search_box.search_value,
						start_date: context.state.search_box.startDate,
						end_date: context.state.search_box.endDate,
						geometry: context.state.search_box.geomFilter,
						projects: context.state.search_box.projects,
					}
				).then(result => {
					if(result.data.length === 0){
						context.commit('save_search_spectra_ids', []);
					}else{
						context.commit('save_search_spectra_ids', result.data);
					}
				}).catch(error => {
					throw new Error(`API ${error}`);
				});
			}else{
				context.commit('save_search_spectra_ids', []);
				this.dispatch('clearSpectraData');
			}
		},
		clearSpectra (context){
			context.commit('clear_spectra');
			//context.commit('save_spectra',[], false)
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
				//context.commit('save_spectra',[], false)
			});
		},
		getManySpectraMeanTaxa (context) {
			const gets = context.state.species_selected.map(sp => Vue.axios.get('leaf_spectra_mean/search/',{
				params: {
					species: sp
				}
			}).catch(function(error){console.log(error);}));
			Vue.axios.all(gets).then(responses => {
				//const resp=responses.map(m => m.data[0])
				context.commit('save_spectra',responses);
			})
		},
		saveSpectra(context){
			context.commit('save_spectra',false)
		},
		clearSpectraData(context){
			context.state.current_spectra.spectra_ids=[]
			context.state.current_spectra.spectra=[]
		},
		downloadTaxaMeanCSV(context){
			Vue.axios.post('leaf_spectra/csv/', {
			    taxa: context.state.species_selected,
			    type: 'mean',
			}).then(response => {
				const d = Date.now();
				this.dispatch('processCSVResponse',{response:response,filename:'cabo_mean_spectra_by_species_'+d+'.csv'})
				context.state.showSpectraDownloadSpinner=false
			}).catch(error => {
				console.log(error)
			});
		},
		downloadPlantSpectraCSV(context, sample_ids){
			Vue.axios.post('leaf_spectra/csv/', {
			    ids: sample_ids,
			    type: 'raw',
			}).then(response => {
				const d = Date.now();
				this.dispatch('processCSVResponse',{response:response,filename:'cabo_plant_spectra_'+d+'.csv'})
				context.state.showPlantSpectraDownloadSpinner=false
				context.state.showMarkerPlantSpectraDownloadSpinner=false
			}).catch(error => {
				console.log(error)
			});
		},
		downloadAllPlantSpectraCSV(context){
			let ids=[]
			context.state.current_spectra.spectra_ids.map(s=>{
				ids.push(s.sample_id)
			})
			ids=ids.join(",");
			Vue.axios.post('leaf_spectra/csv/', {
			    ids: ids,
			    type: 'raw',
			}).then(response => {
				const d = Date.now();
				this.dispatch('processCSVResponse',{response:response,filename:'cabo_all_plant_spectra_'+d+'.csv'})
				context.state.showAllPlantSpectraDownloadSpinner=false
			}).catch(error => {
				console.log(error)
			});
		},
		processCSVResponse(context,data){
			const url = window.URL.createObjectURL(new Blob([data.response.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', data.filename);
			document.body.appendChild(link);
			link.click();
		}
	}
});
