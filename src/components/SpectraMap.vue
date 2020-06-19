<template>
	<div class="row" v-if="showMap" id="map-container">
    <l-map
      style="height: 400px; width: 100%"
      :zoom="zoom"
      :center="center"
      @update:zoom="zoomUpdated"
      @update:center="centerUpdated"
      @update:bounds="boundsUpdated"
      :bounds="bounds"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker
        v-for="marker in markers"
        :key="marker.fulcrum_id"
        :lat-lng="marker.geometry.coordinates"
      >
      </l-marker>
    </l-map>
	</div>
</template>

<script>
	import { L, latLngBounds} from 'leaflet';
	import { LMap, LTileLayer, LMarker } from 'vue2-leaflet';
	import { Icon } from 'leaflet';

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
		},
		data () {
			return {
			  url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			  zoom: 10,
			  center: [45.5,-73.3],
			};
		},
		computed: {
			markers: {
				get () {
					const m=this.$store.state.current_spectra.spectra_ids.filter(s => s.geometry!==null && s.geometry.coordinates[1]!==0)
					m.forEach(s => s.geometry.coordinates=[s.geometry.coordinates[1],s.geometry.coordinates[0]])
					return m
				}
			},
			bounds: {
				get() {
					return this.$store.state.current_spectra.spectra_ids.map(s => {
					 	if(s.geometry!==null && s.geometry.coordinates[1]!==0) {
					 		return [s.geometry.coordinates[0],s.geometry.coordinates[1]]
					 	}
					})
				}
			},
			showMap: {
				get() {
					return this.$store.state.showMap	
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
			this.$store.subscribe((mutation,state) => {
				switch(mutation.type) {
				case 'save_spectra':
					if(state.current_spectra.spectra.length!==0){
						this.meanLeafSpectra(state.current_spectra.spectra);
					}
				break;
				} 
			})
		}
	}
</script>

<style>
	

</style>