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
	</div>
</b-card-text>
</b-card>
</template>

<script>
	import { L, latLngBounds } from 'leaflet';
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
				satellite: 'https://mt0.google.com/vt/lyrs=y&hl=en&x={x}&y={y}&z={z}',
				zoom: 10,
				center: [45.5,-73.3],
				slide: 0,
				sliding: null,
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
					var s={}
					s=this.$store.state.plants.filter(s => typeof s !== 'undefined' && s.geometry!==null && s.geometry.coordinates[1]!==0)
					s.forEach(m => {
						m.site = ((m.sites.verbatim_site==null)? m.sites.site_id : m.sites.verbatim_site)
						m.geometry.coordinates=[m.geometry.coordinates[1],m.geometry.coordinates[0]]
						let ids = []
				    	m.bulk_leaf_samples.map(i=>{
				    		ids.push(i.sample_id)
				    	})
						m.sample_ids = ids.join(',')
					})
						return s
				}
			},
			bounds: {
				get() {
					return this.$store.state.plants.map(s => {
					 	if(typeof s !=='undefined' && s.geometry!==null && s.geometry.coordinates[1]!==0) {
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
		},
		methods: {
	    	markerModal(marker, target) {
				this.$store.commit('show_sample_modal',marker);
				this.this_sample = marker;
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