<template>
	<b-container>
  <b-card no-body class="tab-group" v-show="showSearch">
    <b-tabs card >
      <b-tab :title="search_by_species" active  >
<b-input-group size="lg" class="search-group">
  <!-- b-form-input type="search" class="search-bar" placeholder="Enter species name" v-model="searchValue"></b-form-input -->
	<b-input-group-prepend class="search-prepend">
	<autocomplete
	  :search="search_api"
	  class="search-bar"
	  :placeholder="placeholder" 
      :aria-label="placeholder"
      :get-result-value="getResultValue"
      :debounceTime="500"
      @submit="handleSelection"
      ref="autocomplete"
	 >
	</autocomplete>
	</b-input-group-prepend >
	<b-input-group-append >
	 <b-button  variant="primary" class="clear-button btn btn-danger" v-on:click="clear" v-if="searchNotEmpty">x</b-button>
	</b-input-group-append>
	<b-input-group-append class="w-15">
	 <b-button  variant="primary" class="search-button btn btn-primary" v-on:click="search">{{ $t('search') }}</b-button>
	</b-input-group-append>
	<b-input-group-append  class="announce-group">
	  <div class="search-announce" v-html="announce"></div>
	  </b-input-group-append>
	</b-input-group>
      </b-tab>
		<template v-slot:tabs-end>
	      	<b-nav-item href="#" role="presentation" @click="dateModal">{{ $t("filter_by") }} : {{ $t("date") }}</b-nav-item>
	      	<b-nav-item href="#" role="presentation" @click="geographyModal">{{ $t("geography") }}</b-nav-item>
	      	<b-nav-item href="#" role="presentation" @click="projectModal">{{ $t("project") }}</b-nav-item>
      	</template>
    </b-tabs>
  </b-card>
    <b-modal id="date-filter" :title="select_a_date" ok-only @hide="dateModalHidden">
  		<div>
		    <label for="start-date-input">{{ $t("start_date") }}</label>
    		<b-input-group class="mb-3">
		      <b-form-input
		        id="start-date-input"
		        v-model="startDate"
		        type="text"
		        placeholder="YYYY-MM-DD"
		        autocomplete="off"
		      ></b-form-input>
		      <b-input-group-append>
		        <b-form-datepicker
		          v-model="startDate"
		          button-only
		          right
		          locale="en-US"
		          aria-controls="example-input"
		        ></b-form-datepicker>
		      </b-input-group-append>
		    </b-input-group>
		</div>
  		<div>
  			<label for="end-date-input">{{ $t("end_date") }}</label>
    		<b-input-group class="mb-3">
		      <b-form-input
		        id="end-date-input"
		        v-model="endDate"
		        type="text"
		        placeholder="YYYY-MM-DD"
		        autocomplete="off"
		      ></b-form-input>
		      <b-input-group-append>
		        <b-form-datepicker
		          v-model="endDate"
		          button-only
		          right
		          locale="en-US"
		          aria-controls="example-input"
		        ></b-form-datepicker>
		      </b-input-group-append>
		    </b-input-group>
		</div>
  		<div><b-button variant="danger" @click="resetDates">Reset filter</b-button></div>
    </b-modal>
    <b-modal id="geography-filter" class="test-modal" :title="geo_filter_title" ok-only @shown="geoModalShown" @hide="geoModalHidden">
	    <b-container style="width: 100%; height:100%; max-width:2000px">
	    <l-map
	      style="width: 100%; height:100%"
	      :zoom="zoom"
	      :center="center"
	      @update:zoom="zoomUpdated"
	      @update:center="centerUpdated"
	      ref="map"
	    >
 		<l-tile-layer :url="satellite"></l-tile-layer>
		</l-map>
	</b-container>
    </b-modal>

</b-container>
</template>

<script>
//import _ from 'lodash'
//import Autocomplete from 'vuejs-auto-complete'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'
import L from 'leaflet';
import Vue from 'vue';
import { LMap, LTileLayer } from 'vue2-leaflet';
import LDrawToolbar from 'vue2-leaflet-draw-toolbar';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen';


export default {
	name: "search",
	components: {
		Autocomplete,
		LDrawToolbar,
		LMap,
		LTileLayer,
	},
	data: function() {
		return {
			searchValue : '',
			searchNotEmpty : false,
			startDate: '',
			endDate: '',
			projects: '',
			osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			satellite: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
			zoom: 10,
			center: [45.5,-73.3],
			drawnItems: '',
		}
	},

	computed: {
		announce: {
			get () {
				return this.$store.state.search_box.announce
			}
		},
		placeholder () {
			return this.$i18n.t('enter_species_name')
		},
		select_a_date () {
			return this.$i18n.t('select_the_date_range')
		},
		search_by_species () {
			return this.$i18n.t('search_by_species')
		},
		geo_filter_title () {
			return this.$i18n.t('geo_filter_title')
		},
		authHeaders () {
		    return {
		      'Authorization': 'Bearer '+process.env.VUE_APP_CABO_API
		    }
		},
		showSearch (){
			return !this.$store.state.showPassword
		},
	},
	methods: {
		search: function(){
			this.$store.state.search_box.search_value = this.searchValue;
			this.$store.state.search_box.projects = this.projects;
			this.$store.commit('save_search');
			this.searchNotEmpty=true
		},
		clear: function(){
			this.searchValue=''
			//this.$store.commit('save_search', "")
			this.searchNotEmpty=false
			this.$store.state.showSpectra = false
			this.$store.state.showLoader = false
			this.$store.state.showAll = false
			this.$refs.autocomplete.value = ''
			this.$store.state.species_selected = []
			this.$store.state.search_box.geomFilter=''
			this.$store.state.search_box.dateFilter=''
			this.$store.state.search_box.projectFilter=''
			this.$store.state.species_options=[]
			this.$store.state.search_box.announce=''
			this.drawnItems=''
		},
	    getResultValue(result) {
	      return result.name
	    },
	    search_api (input) {
	    	this.searchValue=input
	    	if (input.length < 1) { return [] }
			return this.axios.get('vascan/autocomplete',{
				params: {
					q: input
				}
			}).then(result => {
				return result.data
			})
	    },
	    handleSelection(result) {
	      this.searchValue=result.sci_name;
	    },
    	dateModal(marker, target) {
			this.$root.$emit('bv::show::modal', 'date-filter')
    	},
    	geographyModal(marker, target) {
			this.$root.$emit('bv::show::modal', 'geography-filter')
    	},
    	projectModal(marker, target) {
			this.$root.$emit('bv::show::modal', 'project-filter')
    	},
    	resetDates(){
    		this.startDate='';
    		this.endDate='';
    	},
		zoomUpdated (zoom) {
		  this.zoom = zoom;
		},
		centerUpdated (center) {
		  this.center = center;
		},
	    geoModalShown() {
			const map=this.$refs.map.mapObject;
			// FeatureGroup is to store editable layers
			if(this.drawnItems===''){
				var drawnItems = new L.FeatureGroup();
			}else{
				var drawnItems = this.drawnItems;
			}
			map.addLayer(drawnItems);
			var drawControl = new L.Control.Draw({
				draw: {
					marker: false,
					circle: false,
					polyline: false,
					circlemarker: false,
		            polygon: {
		                allowIntersection: false,
		                showArea: true
		            },
		            rectangle: {
		            	showArea: true	
		            }
				},
				edit: {
				     featureGroup: drawnItems
				},
				position: "topright"
			});
			var drawControlEditOnly = new L.Control.Draw({
			    edit: {
			        featureGroup: drawnItems
			    },
			    draw: false,
				position: "topright"
			});

			map.addControl(drawControl);
		    map.on(L.Draw.Event.CREATED, function (event) {
		        var layer = event.layer;
		        drawnItems.addLayer(layer);
		    });

			map.on(L.Draw.Event.CREATED, function (e) {
			    drawnItems.addLayer(e.layer);
			    drawControl.remove(map);
			    drawControlEditOnly.addTo(map)
			});
			map.on(L.Draw.Event.DELETED, function(e) {
			   if (drawnItems.getLayers().length === 0){
			        drawControlEditOnly.remove(map);
			        drawControl.addTo(map);
			    };
			});

		    this.drawnItems=drawnItems;
			map.invalidateSize(); 
	    },
	    dateModalHidden() {
			this.$store.state.search_box.startDate = this.startDate;
			this.$store.state.search_box.endDate = this.endDate;
	    },
	    geoModalHidden() {
			this.$store.state.search_box.geomFilter = JSON.stringify(this.drawnItems.toGeoJSON().features[0].geometry);
	    },
	},
	created: function () {
		
	},
}
</script>
<style>
.search-box{
	/*max-width:40%;
	margin:auto;*/
}

.search-prepend{
	width:100%;
}

.search-bar{
	/*max-width:500px;*/
	width:100%;
	/*width:400px;
	height:2.5em;
	margin:auto;
	display:block;
	border:2px solid #aaaaaa;
	border-radius: 5px;
	float:left;*/
}

.search-button{
	/*float:left;*/
}

.search-group{
	flex-wrap: nowrap !important;
	max-width:700px;
	margin:auto;
	width:90%;
}

.tab-group{
	max-width:700px;
	margin:auto;
	width:90%;
	border:0px !important;
}

.tab-group .card-header {
	border:0px;
	background:rgba(0,0,0,0);
}

.announce-group{
	white-space: nowrap;
}
.search-announce{
	margin:auto;
	display:block;
	max-width: 150px;
	line-height: 2.5em;
	margin-left: 20px;
	white-space: nowrap;
}

.autocomplete-result-list{
	z-index:100 !important;
}
.autocomplete-result{
	float:left;
	display:block;
	line-height:1em;
	width:100%;
	text-align:left;
}

#geography-filter .modal-dialog {
    max-width: 100%;
    margin: 0;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100vh;
    display: flex;
    position: fixed;
    z-index: 100000;
}

.leaflet-draw-draw-polyline,.leaflet-draw-draw-marker,.leaflet-draw-draw-circle,.leaflet-draw-draw-circlemarker{
	/*display:none !important;*/
}
</style>
