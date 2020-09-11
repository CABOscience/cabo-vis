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
	      	>
			<l-popup>
				<h2>{{marker.scientific_name}}</h2>
				<br>{{marker.site_id}} 
				<br>{{marker.first_observed_by}} 
				<br>{{marker.date_first_observed}} 
				<img :src="marker.close_up_photos" class="popup_photo">
			</l-popup>
      		</l-marker>
      	</l-marker-cluster>
    </l-map>

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
					const m=this.$store.state.plants.filter(s => s.geometry!==null && s.geometry.coordinates[1]!==0)
					m.forEach(s => {
						s.geometry.coordinates=[s.geometry.coordinates[1],s.geometry.coordinates[0]]
						if(s.close_up_photos!==null){
							if(s.close_up_photos.indexOf(',')!==-1){
								s.close_up_photos = 'https://data.caboscience.org/vis/photos/plants/'+s.close_up_photos.substr(0,s.close_up_photos.indexOf(','))+'.jpg';
							}else{
								s.close_up_photos = 'https://data.caboscience.org/vis/photos/plants/'+s.close_up_photos+'.jpg';
							}
							}else{
								s.close_up_photos = false;
							}
						})
					return m
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
			}
		},
		methods: {
			zoomUpdated (zoom) {
			  this.zoom = zoom;
			},
			centerUpdated (center) {
			  this.center = center;
			},
			boundsUpdated (bounds) {
			  this.bounds = bounds;
			}
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
.popup_photo{
	max-width:250px;
}
</style>