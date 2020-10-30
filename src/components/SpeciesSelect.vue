<template>
  <b-container id="which-select" v-if="show">
  <b-alert show variant="warning">{{ $t('only_five_species_shown') }}</b-alert>
    <b-form-group>
  	<b-form-checkbox-group id="checkbox-group" v-model="selected_sp" name="selected_sp" buttons>
		<b-form-checkbox
        v-for="(option, index) in species_options"
        :key="option.scientific_name"
        :value="option.scientific_name"
        :class="variant(index)"
    	>
        {{ option.scientific_name }}
		<b-badge variant="secondary">{{ option.count }}</b-badge>
      </b-form-checkbox>
	</b-form-checkbox-group>
    </b-form-group>
 </b-container>
</template>


<script>
	export default{
	    data() {
			return {
				count_sp: 0,
				test: 'test',
				selected_sp:[],
			}
	    },
		computed: {
			show: {
				get() {
					return this.$store.state.showAll	
				}
			},
			species_options: {
				get() {
					return this.$store.state.species_options
				}
			},
			species_selected: {
				get(){
					return this.selected_sp
				},
			},
			species_color:{
				get() {
					return "c";
				}
			},
		},
		methods: {
			variant(index){
				return "btn-"+index
			},
		},
		mounted: function() {
			this.$store.subscribe((mutation,state) => {
				switch(mutation.type) {
				case 'save_search_spectra_ids':
					this.selected_sp=state.species_selected
				break;
				} 
			})
		},
		watch: {
		    species_selected(which) {
		    	this.$store.state.species_selected=which
				this.$store.state.current_spectra.reBox = true
		        this.$store.commit('species_select')
		    }
		}
	}
</script>

<style>

#checkbox-group .btn{
	padding:10px;
	margin:10px;
	color:white;
	border-radius:4px;
	border:3px solid;
}

#checkbox-group .btn-0, #checkbox-group .btn-0.focus{
	background-color:white;
	color:#444444;
	border-color:#008bae;
}

#checkbox-group .btn-0.active{
	background-color:#008bae !important;
	color:white;
}

#checkbox-group .btn-0:hover{
	background-color:#008baedd !important;
	color:white;
}

#checkbox-group .btn-1, #checkbox-group .btn-1.focus{
	background-color:white;
	color:#444444;
	border-color:#65318c;
}

#checkbox-group .btn-1.active{
	background-color:#65318c !important;
	color:white;
}

#checkbox-group .btn-1:hover{
	background-color:#65318cdd !important;
	color:white;
}

#checkbox-group .btn-2, #checkbox-group .btn-2.focus{
	background-color:white;
	color:#444444;
	border-color:#8bc442;
}

#checkbox-group .btn-2.active, #checkbox-group .btn-2:hover{
	background-color:#8bc442 !important;
	color:white;
}

#checkbox-group .btn-2:hover{
	background-color:#8bc442dd !important;
	color:white;
}

#checkbox-group .btn-3, #checkbox-group .btn-3.focus{
	background-color:white;
	color:#444444;
	border-color:#e7262b;
}

#checkbox-group .btn-3.active{
	background-color:#e7262b !important;
	color:white;
}

#checkbox-group .btn-3:hover{
	background-color:#e7262bdd !important;
	color:white;
}

#checkbox-group .btn-4, #checkbox-group .btn-4.focus{
	background-color:white;
	color:#444444;
	border-color:#f59121;
}

#checkbox-group .btn-4.active{
	background-color:#f59121 !important;
	color:white;
}


#checkbox-group .btn-4:hover{
	background-color:#f59121dd !important;
	color:white;
}


#checkbox-group .btn-5, #checkbox-group .btn-5.focus{
	background-color:white;
	color:#444444;
	border-color:#b92587;
}

#checkbox-group .btn-5.active{
	background-color:#b92587 !important;
	color:white;
}

#checkbox-group .btn-5:hover{
	background-color:#b92587dd !important;
	color:white;
}

#checkbox-group .btn-6, #checkbox-group .btn-6.focus{
	background-color:white;
	color:#444444;
	border-color:#278e45;
}

#checkbox-group .btn-6.active{
	background-color:#278e45 !important;
	color:white;
}

#checkbox-group .btn-6:hover{
	background-color:#278e45dd !important;
	color:white;
}


#checkbox-group .btn-7, #checkbox-group .btn-7.focus{
	background-color:white;
	color:#444444;
	border-color:#0756a1;
}

#checkbox-group .btn-7.active{
	background-color:#0756a1 !important;
	color:white;
}

#checkbox-group .btn-7:hover{
	background-color:#0756a1dd !important;
	color:white;
}


</style>
