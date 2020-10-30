<template>
<b-card border-variant="primary" footer-bg-variant="dark" header-bg-variant="primary" header-text-variant="white" :header="header" class="text-center spectra-card" v-show="showPlantsTable">
<b-card-header header-bg-variant="dark" header-text-variant="light">
      	<b-button-group>
	        <b-button size="sm" @click="download_all_plant_spectra()" class="mr-1" variant="primary">
	          {{ $t('download_all_plant_spectra_data') }} <b-icon-arrow-down-circle  v-show="!downloadAllPlantSpectraSpinner"></b-icon-arrow-down-circle>
		      <b-spinner
		      	small
		        variant="light"
		        v-show="downloadAllPlantSpectraSpinner"
		      ></b-spinner>
	        </b-button>
    	</b-button-group>
</b-card-header>
        <b-card-text bg-variant="light" text-variant="gray-dark" class="graph-card">
	<div id="plants-container" class="row">
    <b-form-group label="Selection mode:" label-cols-md="4">
      <b-form-select v-model="selectMode" :options="modes" class="mb-3"></b-form-select>
    </b-form-group>
		<b-table
	      id="plants-table"
	      :items="items"
	      :per-page="perPage"
	      :current-page="currentPage"
	      small
	      selectable
	    >
      <template #cell(selected)="{ rowSelected }">
        <template v-if="rowSelected">
          <span aria-hidden="true">&check;</span>
          <span class="sr-only">Selected</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
          <span class="sr-only">Not selected</span>
        </template>
      </template>
      <template v-slot:cell(plant_photos)="row">
      	<b-button-group>
	        <b-button size="sm" @click="photo(row.item, row.index, $event.target)" class="mr-1" v-show="!!row.item.plant_photos">
	          Photos
	        </b-button>
	        <b-button size="sm" @click="row.toggleDetails" class="mr-1">
	          {{ row.detailsShowing ? $t('hide') : $t('show') }} {{ $t('details') }}
	        </b-button>
	        <b-button size="sm" @click="download_plant_spectra(row.item, row.index, $event.target)" class="mr-1" variant="primary">
	          <b-icon-arrow-down-circle  v-show="!downloadPlantSpectraSpinner(row.index)"></b-icon-arrow-down-circle>
		      <b-spinner
		      	small
		        variant="light"
		        v-show="downloadPlantSpectraSpinner(row.index)"
		      ></b-spinner>
	        </b-button>
    	</b-button-group>
      </template>

      <template #row-details="row">
        <b-card>
          <ul>
            <!-- <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li> -->
          </ul>
        </b-card>
      </template>

	    </b-table>
    <b-pagination
      v-model="currentPage"
      :total-rows="rows"
      :per-page="perPage"
      aria-controls="my-table"
    ></b-pagination>
    <!-- Info modal -->
    <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
          <b-carousel
		      id="carousel-1"
		      v-model="slide"
		      :interval="4000"
		      controls
		      indicators
		      background="#ababab"
		      img-height="800"
		      style="text-shadow: 1px 1px 2px #333;"
		      @sliding-start="onSlideStart"
		      @sliding-end="onSlideEnd"
		    >
	      <b-carousel-slide v-for="(value, key) in infoModal.img" :key="key" :img-src="value" >
	      </b-carousel-slide>
  		</b-carousel>
    </b-modal>

    <p class="mt-3">{{ $t('current_page') }}: {{ currentPage }}</p>
	</div>
</b-card-text>
	</b-card>
</template>


<script>


  export default {
    data() {
      return {
        perPage: 20,
        currentPage: 1,
        items: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        },
        slide: 0,
        sliding: null
      }
    },
    computed: {
    	rows() {
    		return this.items.length
		},
		header: {
			get() {
				return this.$i18n.t('plants')
			}
		},
    	showPlantsTable: {
			get() {
				return this.$store.state.showAll	
			}
		},
		downloadPlantSpectraSpinner() {
			return(index)=> {
				return this.$store.state.showPlantSpectraDownloadSpinner===index
			}
		},
		downloadAllPlantSpectraSpinner: {
			get() {
				return this.$store.state.showAllPlantSpectraDownloadSpinner
			}
		}
    },
    methods: {
    	photo(item, index, button) {
			this.infoModal.title = item.scientific_name;
			this.infoModal.img = item.plant_photos;
			this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    	},
	    resetInfoModal() {
			this.infoModal.title = ''
		    this.infoModal.content = ''
	    },
	    download_plant_spectra(item, index, button) {
	    	this.$store.state.showPlantSpectraDownloadSpinner=index
	    	this.$store.commit('download_plant_spectra_csv', item.sample_ids)
	    },
	    download_all_plant_spectra(){
	    	this.$store.commit('download_all_plant_spectra_csv')
	    },
		onSlideStart(slide) {
			this.sliding = true
		},
		onSlideEnd(slide) {
			this.sliding = false
		}
    },
	mounted: function() {
		this.$store.subscribe((mutation,state) => {
			switch(mutation.type) {
			case 'save_plants':
				if(state.plants.length!==0){
					this.items=state.plants.map(function(m) {
						let ro = {}
						let ids = []
				    	m.bulk_leaf_samples.map(i=>{
				    		ids.push(i.sample_id)
				    	})
						ro.sample_ids = ids.join(',')
						ro.scientific_name = m.scientific_name
						ro.site = ((m.sites.verbatim_site==null)? m.sites.site_id : m.sites.verbatim_site)
						if(m.plant_photos!==null){
							ro.plant_photos=[]
							let pf=m.plant_photos.split(',')
							pf.map(p=>{
								ro.plant_photos.push('https://data.caboscience.org/vis/photos/plants/'+p+'.jpg')
							})
							if(m.close_up_photos!==null){
								pf=m.close_up_photos.split(',')
								pf.map(p=>{
									ro.plant_photos.push('https://data.caboscience.org/vis/photos/plants/'+p+'.jpg')
								})
							}
						}else{
							ro.plant_photos = false;
						}
						return ro
					})
				}
			break;
			} 
		})
	},    
  }
</script>

<style scoped>
#plants-container{
	margin:auto;
}
</style>