<template>
  <b-modal v-if="sampleModal" :id="modal_id" :title="sampleModal.scientific_name" ok-only @hide="resetInfoModal" size="lg">
  <b-form-select variant="primary" class="m-6" 
  		v-model="selected_sample"
        :options="sampleModal.bulk_leaf_samples"
      	value-field="sample_id"
      	text-field="date_sampled"
    	>
  </b-form-select>
  <b-tabs content-class="mt-3" v-model="tabs">
    <b-tab :title="tab1_title" class="photos-tab" active>
		{{sampleModal.site_id}}
		<br>ID : {{ sampleModal.fulcrum_id}}
		<span v-if="sampleModal.tag_id">
		<br>
		{{ $t("tag") }} : {{ sampleModal.tag_id}}
		</span>
		<br>{{sampleModal.first_observed_by}} 
		<br>{{ $t("first_observed") }} : {{sampleModal.date_first_observed}} 
		<b-carousel
		  id="carousel-1"
		  v-model="slide"
		  :interval="3000"
		  controls
		  indicators
		  background="#ababab"
		  img-height="300px"
		  style="text-shadow: 1px 1px 2px #333;"
		  @sliding-start="onSlideStart"
		  @sliding-end="onSlideEnd"
		>
		<b-carousel-slide v-for="(value, key) in photos" :key="key" :img-src="value" img-height="800px" class="marker-slide">
		</b-carousel-slide>
		</b-carousel>
	</b-tab>
    	<b-tab :title="tab2_title" @click="get_sample_spectra(selected_sample)">
          <b-button size="sm" @click="download_plant_spectra(sampleModal, $event.target)" class="mr-1" variant="primary">
          {{ $t('download_plant_spectra_data') }} <b-icon-arrow-down-circle v-show="!downloadMarkerPlantSpectraSpinner"></b-icon-arrow-down-circle>
	      <b-spinner
	      	small
	        variant="light"
	        v-show="downloadMarkerPlantSpectraSpinner"
	      ></b-spinner>
        </b-button>
		<LeafSampleSpectra :which="ids"></LeafSampleSpectra>
    </b-tab>
    <b-tab :title="tab3_title" @click="update_traits(selected_sample)">
    	<TraitsModal :sampleId="selected_sample"></TraitsModal>
    </b-tab>
  </b-tabs>
  </b-modal>
</template>

<script>
    import TraitsModal from "./TraitsModal.vue"
    import LeafSpectra from "./LeafSpectra.vue"
    import LeafSampleSpectra from "./LeafSampleSpectra"
	import * as d3 from 'd3'

	export default{
		components: {
			TraitsModal,
			LeafSpectra,
			LeafSampleSpectra
		},
		data () {
			return {
				slide: 0,
				sliding: null,
				photos: [],
				modalUp: false,
				tabs: 0,
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
			},
			ids: {
				get() {
					return 'sample'+this.selected_sample
				}
			},
			selected_sample: {
				get() {
					if(typeof this.$store.state.sampleModal.bulk_leaf_samples[0] !== "undefined"){
						return this.$store.state.sampleModal.bulk_leaf_samples[0].sample_id
					}else{
						return false;
					}
				},
				set(value){
					this.$store.state.selected_sample = value
					this.$store.state.showSampleSpectra = false
					if(this.tabs === 1){
						this.get_sample_spectra(value)
					}else if(this.tabs === 2){
						this.update_traits(value)
					}
				}
			}
		},
		methods: {
		    resetInfoModal() {
				this.sampleModal.title = ''
			    this.sampleModal.content = ''
			    this.sampleModal.marker = ''
			    this.modalUp = false
			    this.$store.state.current_traits={}
			    this.$bvModal.hide(this.modal_id)
			    d3.selectAll(".sample-spectra-graph > *").remove()
			    this.box=""
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
		    update_traits(sample_id){
		    	var self=this
		        let which=['leaf_area_and_water_samples','icp_leaf_element_concentrations','pigments_extracts']
		        which.forEach(function(w){
		        	var wh={}
		        	wh.cat=w
			        wh.sample_id=sample_id
			    	self.$store.commit('download_traits', wh)
		        })
		    },
		    refresh_photos(){
		    	var self = this
				/*let this_samp = this.$store.state.plants.filter(function(value, index){
					if(typeof value !== 'undefined'){
						var ids=[]
				    	value.bulk_leaf_samples.map(i=>{
				    		ids.push(i.sample_id)
				    	})
						var sids = ids.join(',')
						return sids == self.sampleModal.sample_ids
					}
				})*/
				/*this.photos=this.sampleModal.map(function(m) {*/
					if(this.sampleModal.plant_photos!==null){
						var plant_photos=[]
						var pf=this.sampleModal.plant_photos.split(',')
						pf.map(p=>{
							plant_photos.push('https://data.caboscience.org/photos/plants/'+p+'.jpg')
						})
						if(this.sampleModal.close_up_photos!==null){
							pf=this.sampleModal.close_up_photos.split(',')
							pf.map(p=>{
								plant_photos.push('https://data.caboscience.org/photos/plants/'+p+'.jpg')
							})
						}
					}
					this.photos = plant_photos;
				/*})[0]*/
		    },
		    get_sample_spectra(selected_sample){
			    d3.selectAll(".sample-spectra-graph > *").remove()
		    	this.$store.commit('show_sample_spectra', selected_sample)
		    }
		},
		mounted: function() {
			var self = this
			this.$store.subscribe((mutation,state) => {
				switch(mutation.type) {
					case 'show_sample_modal':
						if(self.modalUp==false){
							this.refresh_photos()
							this.$bvModal.show(self.modal_id)
							//this.$root.$emit('bv::show::modal', self.modal_id)
							//self.modalUp=true;
						}
					break;
				}
			})
		}
	}
</script>

<style>

.photos-tab{
	max-width:600px;
	margin:auto !important;
}

.marker-slide{
	max-width:600px;
}
</style>