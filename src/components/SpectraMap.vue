<template>
      <b-card v-if="showMap" border-variant="primary" footer-bg-variant="dark" header-bg-variant="primary" header-text-variant="white" :header="header" class="text-center spectra-card">
        <b-card-text bg-variant="light" text-variant="gray-dark" class="graph-card">
        	<div class="row"  id="map-container">
    <l-map
      style="height: 600px; width: 100%; position:relative"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      :bounds="bounds"
    >
      <l-tile-layer :url="satellite"></l-tile-layer>
     	<l-marker-cluster>
	    	<l-marker
	       	v-for="marker in markers"
	        :key="marker.id"
	        :lat-lng="marker.geometry.coordinates"
	        @click="markerModal(marker,$event.target)"
	      	>
      		</l-marker>
      	</l-marker-cluster>
    </l-map>
    <b-modal :id="infoModal.id" :title="infoModal.marker.scientific_name" ok-only @hide="resetInfoModal">
  <b-tabs content-class="mt-3">
    <b-tab :title="tab1_title" active>
		<br>{{infoModal.marker.site_id}} 
		<br>{{infoModal.marker.first_observed_by}} 
		<br>{{infoModal.marker.date_first_observed}} 
		<b-carousel
		  id="carousel-1"
		  v-model="slide"
		  :interval="4000"
		  controls
		  indicators
		  background="#ababab"
		  img-height="700"
		  style="text-shadow: 1px 1px 2px #333;"
		  @sliding-start="onSlideStart"
		  @sliding-end="onSlideEnd"
		>
		<b-carousel-slide v-for="(value, key) in infoModal.marker.photos" :key="key" :img-src="value" class="marker-slide">
		</b-carousel-slide>
		</b-carousel>
		</b-tab>
    <b-tab :title="tab2_title">
          <b-button size="sm" @click="download_plant_spectra(infoModal.marker, $event.target)" class="mr-1" variant="primary">
          {{ $t('download_plant_spectra_data') }} <b-icon-arrow-down-circle  v-show="!downloadMarkerPlantSpectraSpinner"></b-icon-arrow-down-circle>
	      <b-spinner
	      	small
	        variant="light"
	        v-show="downloadMarkerPlantSpectraSpinner"
	      ></b-spinner>
        </b-button>
    </b-tab>
  </b-tabs>
    </b-modal>
	</div>
</b-card-text>
</b-card>
</template>

<script>
	import { L, latLngBounds} from 'leaflet';
	import { LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';
	import { Icon } from 'leaflet';
	import Vue2LeafletMarkerCluster from 'vue2-leaflet-markercluster'

	delete Icon.Default.prototype._getIconUrl;
	Icon.Default.mergeOptions({
	  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
	  iconUrl: require('leaflet/dist/images/marker-icon.png'),
	  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
	});

	export default{
		components: {
			LMap,
			LTileLayer,
			LMarker,
			LPopup,
			'l-marker-cluster': Vue2LeafletMarkerCluster,
		},
		data () {
			return {
				osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
				satellite: 'http://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
				zoom: 10,
				center: [45.5,-73.3],
				infoModal: {
					id:'marker-modal',
					title: '',
					content: '',
					marker: {},
				},
				slide: 0,
				sliding: null
			};
		},
		computed: {
			header: {
				get () {
					return this.$i18n.t('sites');
				}
			},
			markers: {
				get () {
					const s=this.$store.state.plants.filter(s => s.geometry!==null && s.geometry.coordinates[1]!==0)
					s.forEach(m => {
						m.geometry.coordinates=[m.geometry.coordinates[1],m.geometry.coordinates[0]]
						let ids = []
				    	m.bulk_leaf_samples.map(i=>{
				    		ids.push(i.sample_id)
				    	})
						m.sample_ids = ids.join(',')
						m.photos=[]
						if(m.plant_photos!==null){
							let pf=m.plant_photos.split(',')
							pf.map(p=>{
								m.photos.push('https://data.caboscience.org/vis/photos/plants/'+p+'.jpg')
							})
						}
						if(m.close_up_photos!==null){
							let cpf=m.close_up_photos.split(',')
							cpf.map(p=>{
								m.photos.push('https://data.caboscience.org/vis/photos/plants/'+p+'.jpg')
							})
						}
					})
					return s
				}
			},
			bounds: {
				get() {
					return this.$store.state.plants.map(s => {
					 	if(s.geometry!==null && s.geometry.coordinates[1]!==0) {
					 		return [s.geometry.coordinates[0],s.geometry.coordinates[1]]
					 	}
					})
				},
				set(){
				}
			},
			showMap: {
				get() {
					return this.$store.state.showAll	
				}
			},
			downloadMarkerPlantSpectraSpinner: {
				get() {
					return this.$store.state.showMarkerPlantSpectraDownloadSpinner	
				}
			},
			tab1_title: {
				get() {
					return this.$i18n.t('info_sheet')
				}
			},
			tab2_title: {
				get() {
					return this.$i18n.t('spectra')
				}
			},
		},
		methods: {
	    	markerModal(marker, target) {
				this.infoModal.marker=marker
				this.$root.$emit('bv::show::modal', this.infoModal.id, marker)
	    	},
		    resetInfoModal() {
				this.infoModal.title = ''
			    this.infoModal.content = ''
			    this.infoModal.marker = ''
		    },
			zoomUpdated (zoom) {
			  this.zoom = zoom;
			},
			centerUpdated (center) {
			  this.center = center;
			},
			boundsUpdated (bounds) {
			  this.bounds = bounds;
			},
			onSlideStart(slide) {
				this.sliding = true
			},
			onSlideEnd(slide) {
				this.sliding = false
			},
		    download_plant_spectra(marker, button) {
				this.$store.state.showMarkerPlantSpectraDownloadSpinner=true
		    	this.$store.commit('download_plant_spectra_csv', marker.sample_ids)
		    },
		},
		mounted: function() {
		}
	}
</script>

<style>
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
#map-container{
	margin:0px;
}
.marker-slide{
	/*height:600px;*/
}
</style>