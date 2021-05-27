<template>
<b-card border-variant="primary" footer-bg-variant="dark" header-bg-variant="primary" header-text-variant="white" :header="header" class="text-center spectra-card" v-show="showPlantsTable" fluid>
<b-card-header header-bg-variant="dark" header-text-variant="light">
      	<b-container>
      	<b-button-group>
      		<b-button size="sm" variant="light" disabled v-show="!rowsSelected">{{ $t('click_to_select_spectra') }}</b-button>
      		<b-button size="sm" variant="primary" @click="selectAllRows" v-show="!selectAll">{{ $t("select_all_plants") }}</b-button>
			<b-button size="sm" variant="danger" @click="clearSelected" v-show="rowsSelected">{{ $t("clear_selected") }}</b-button>
	        <b-button size="sm" @click="download_selected_plant_spectra()" class="mr-1" variant="primary" v-show="rowsSelected">
	          {{ $t('download_selected_spectra') }} <b-icon-arrow-down-circle  v-show="!downloadSelectedPlantSpectraSpinner"></b-icon-arrow-down-circle>
		      <b-spinner
		      	small
		        variant="light"
		        v-show="downloadSelectedPlantSpectraSpinner"
		      ></b-spinner>
	        </b-button>
    	</b-button-group>
    	</b-container>
</b-card-header>
        <b-card-text bg-variant="light" text-variant="gray-dark" class="graph-card">
		<b-table
	      id="plants-table"
	      :items="items"
	      small
	      sticky-header="600px"
	      ref="selectableTable"
	      selectable
	      :select-mode="selectMode"
	      @row-selected="onRowSelected"
	      head-variant="dark"
	      no-gutters
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
	        <b-button size="sm" @click="photo(row.item, row.index, $event.target)" class="mr-1">
	          {{ $t('details') }}
	        </b-button>
	        <b-button size="sm" @click="row.toggleDetails" class="mr-1" v-show='false'>
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

	    </b-table>
    <!-- Info modal -->
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
        sliding: null,
        selectMode: 'multi',
        rowsSelected: false,
        selectAll: false,
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
				return this.$store.state.showAll && this.$store.state.number_of_plants>0;	
			}
		},
		downloadPlantSpectraSpinner() {
			return(index)=> {
				return this.$store.state.showPlantSpectraDownloadSpinner===index
			}
		},
		downloadSelectedPlantSpectraSpinner: {
			get() {
				return this.$store.state.showSelectedPlantSpectraDownloadSpinner
			}
		},
		selected: {
			get() {
				return this.$store.state.selected_spectra_ids
			}
		}
    },
    methods: {
    	photo(item, index, button) {
			this.infoModal = item;
			//this.$root.$emit('bv::show::modal', this.infoModal.id, button)
			this.$store.commit('show_sample_modal',item);
    	},
	    resetInfoModal() {
			this.infoModal.title = ''
		    this.infoModal.content = ''
	    },
	    download_plant_spectra(item, index, button) {
	    	this.$store.state.showPlantSpectraDownloadSpinner=index
	    	this.$store.commit('download_plant_spectra_csv', item.sample_ids)
	    },
	    download_selected_plant_spectra(){
	    	this.$store.commit('download_selected_plant_spectra_csv')
	    },
		onSlideStart(slide) {
			this.sliding = true
		},
		onSlideEnd(slide) {
			this.sliding = false
		},
		onRowSelected(items) {
			if(items.length!==0){
				this.rowsSelected=true
			}else{
				this.rowsSelected=false
			}
			if(items.length===this.rows){
				this.selectAll=true
			}else{
				this.selectAll=false
			}
			this.$store.state.current_spectra.selected_spectra_ids = items
		},
		selectAllRows() {
			this.$refs.selectableTable.selectAllRows()
			this.rowsSelected=true
		},
		clearSelected() {
			this.$refs.selectableTable.clearSelected()
			this.rowsSelected=false
		},
    },
	mounted: function() {
		this.$store.subscribe((mutation,state) => {
			switch(mutation.type) {
			case 'save_plants':
				if(state.plants.length!==0){
					this.items=state.plants.map(function(m) {
						let ro = {}
						if(typeof m !== 'undefined'){
							let ids = []
					    	m.bulk_leaf_samples.map(i=>{
					    		ids.push(i.sample_id)
					    	})
							ro.sample_ids = ids.join(',')
							ro.scientific_name = m.scientific_name
							ro.site = ((m.sites.verbatim_site==null)? m.sites.site_id : m.sites.verbatim_site)
							ro.plant_photos=''
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
	width:100%;
}
</style>