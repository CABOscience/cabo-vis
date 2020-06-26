<template>
	<b-container>
	<div id="plants-container" class="row" v-show="showPlantsTable">
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
          {{ row.detailsShowing ? 'Hide' : 'Show' }} Details
        </b-button>
      </template>

      <template v-slot:row-details="row">
        <b-card>
          <ul>
            <li v-for="(value, key) in row.item" :key="key">{{ key }}: {{ value }}</li>
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

    <p class="mt-3">Current Page: {{ currentPage }}</p>
	</div>
	</b-container>
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
						ro.plant_photos = 'https://data.caboscience.org/vis/photos/plants/'+m.plant_photos+'.jpg';
						return ro
					})
				}
			break;
			} 
		})
	},    
  }
</script>