<template>
  <b-modal :id="modal_id" :title="sampleModal.scientific_name" ok-only @hide="resetInfoModal">
  <b-tabs content-class="mt-3">
    <b-tab :title="tab1_title" active>
		{{sampleModal.site_id}} 
		<br>{{sampleModal.first_observed_by}} 
		<br>{{sampleModal.date_first_observed}} 
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
		<b-carousel-slide v-for="(value, key) in photos" :key="key" :img-src="value" class="marker-slide">
		</b-carousel-slide>
		</b-carousel>
		</b-tab>
    <b-tab :title="tab2_title">
          <b-button size="sm" @click="download_plant_spectra(sampleModal, $event.target)" class="mr-1" variant="primary">
          {{ $t('download_plant_spectra_data') }} <b-icon-arrow-down-circle v-show="!downloadMarkerPlantSpectraSpinner"></b-icon-arrow-down-circle>
	      <b-spinner
	      	small
	        variant="light"
	        v-show="downloadMarkerPlantSpectraSpinner"
	      ></b-spinner>
        </b-button>
    </b-tab>
    <b-tab :title="tab3_title" @click="update_traits(sampleModal.sample_ids)">
    	<TraitsModal></TraitsModal>
    </b-tab>
  </b-tabs>
  </b-modal>
</template>

<script>
    import TraitsModal from "./TraitsModal.vue"

	export default{
		components: {
			TraitsModal,
		},
		data () {
			return {
				slide: 0,
				sliding: null,
				photos: [],
				modalUp: false,
			};
		},
		computed: {
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
			tab3_title: {
				get() {
					return this.$i18n.t('traits')
				}
			},
			sampleModal: {
				get() {
					return this.$store.state.sampleModal
				}
			},
			modal_id: {
				get() {
					return this.$attrs.modalType;
				}
			}
		},
		methods: {
		    resetInfoModal() {
				this.sampleModal.title = ''
			    this.sampleModal.content = ''
			    this.sampleModal.marker = ''
			    this.modalUp = false
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
		    update_traits(sample_ids){
		    	this.$store.commit('download_traits', sample_ids)
		    },
		    refresh_photos(){
		    	var self = this
				let this_samp = this.$store.state.plants.filter(function(value, index){
				    	var ids=[]
				    	value.bulk_leaf_samples.map(i=>{
				    		ids.push(i.sample_id)
				    	})
						var sids = ids.join(',')
						return sids == self.sampleModal.sample_ids
					})
				this.photos=this_samp.map(function(m) {
					if(m.plant_photos!==null){
						var plant_photos=[]
						var pf=m.plant_photos.split(',')
						pf.map(p=>{
							plant_photos.push('https://data.caboscience.org/vis/photos/plants/'+p+'.jpg')
						})
						if(m.close_up_photos!==null){
							pf=m.close_up_photos.split(',')
							pf.map(p=>{
								plant_photos.push('https://data.caboscience.org/vis/photos/plants/'+p+'.jpg')
							})
						}
					}else{
						return false;
					}
					return plant_photos;
				})[0]
		    }
		},
		mounted: function() {
			var self = this
			this.$store.subscribe((mutation,state) => {
				switch(mutation.type) {
					case 'show_sample_modal':
						if(self.modalUp==false){
							this.refresh_photos()
							this.$root.$emit('bv::show::modal', self.modal_id)
							self.modalUp=true;
						}
					break;
				}
			})
		}
	}
</script>