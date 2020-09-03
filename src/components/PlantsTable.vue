<template>
<b-card border-variant="primary" footer-bg-variant="dark" header-bg-variant="primary" header-text-variant="white" :header="header" class="text-center spectra-card" v-show="showPlantsTable">
        <b-card-text bg-variant="light" text-variant="gray-dark" class="graph-card">
	<div id="plants-container" class="row">
		<b-table
	      id="plants-table"
	      :items="items"
	      :per-page="perPage"
	      :current-page="currentPage"
	      small
	    >
	    	
      <template v-slot:cell(plant_photos)="row">
        <b-button size="sm" @click="info(row.item, row.index, $event.target)" class="mr-1">
          Photo
        </b-button>
        <b-button size="sm" @click="row.toggleDetails">
          {{ row.detailsShowing ? $('hide') : $t('show') }} {{ $t('details') }}
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ $t(key) }}: {{ $t(value) }}</li>
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
      <b-img fluid :src="infoModal.img"></b-img>
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
        perPage: 10,
        currentPage: 1,
        items: [],
        infoModal: {
          id: 'info-modal',
          title: '',
          content: ''
        }
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
		}
    },
    methods: {
    	info(item, index, button) {
			this.infoModal.title = item.scientific_name;
			this.infoModal.img = item.plant_photos;
			this.$root.$emit('bv::show::modal', this.infoModal.id, button)
    	},
	    resetInfoModal() {
			this.infoModal.title = ''
		    this.infoModal.content = ''
	    },
    },
	mounted: function() {
		this.$store.subscribe((mutation,state) => {
			switch(mutation.type) {
			case 'save_plants':
				if(state.plants.length!==0){
					this.items=state.plants.map(function(m) {
						let ro = {}
						ro.scientific_name = m.scientific_name
						ro.site_id = m.site_id
						if(m.plant_photos!==null){
							if(m.plant_photos.indexOf(',')!==-1){
								ro.plant_photos = 'https://data.caboscience.org/vis/photos/plants/'+m.plant_photos.substr(0,m.plant_photos.indexOf(','))+'.jpg';
							}else{
								ro.plant_photos = 'https://data.caboscience.org/vis/photos/plants/'+m.plant_photos+'.jpg';
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