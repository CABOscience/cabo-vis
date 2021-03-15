<template>
    <div class="app-body row traits">
        <template v-for="(this_trait, name, index) in traits">
	<b-container v-if="has_trait(this_trait)">
	  <b-row>
	    <b-col col lg="7" class="trait-name"><p v-html="$t(name)"></p></b-col>
	    <b-col col lg="2" class="trait-value">{{ shorten(this_trait) }}</b-col>
	  </b-row>
	  <b-row>
	    <b-col cols="8">
	    	<TraitDensity :key="name" :traitVal="this_trait"></TraitDensity>
	    </b-col>
	  </b-row>
	</b-container>
</template>
</div>
</template>
<script>

import TraitDensity from "./TraitDensity.vue"
import _ from 'lodash';

export default {
	components:{
		TraitDensity,
	},
    data() {
      return {
        traits:[]
      }
    },
    computed: {
    	trait_cat () {
    		return this.$attrs.traitCat
    	},
    	sample_id () {
    		return this.$attrs.sampleId
    	},
    },
    methods: {
        shorten (val) {
            val=val.toString()
            if(val.indexOf('.') > 1){
                return val.substring(0,val.indexOf('.')+3)
            }else{
                return val.substring(0,6)
            }
        },
        has_trait(trait){
            return trait !==0 && trait !== ''
        }
    },
    mounted: function() {
        this.$store.subscribe((mutation,state) => {
            switch(mutation.type) {
            case 'save_traits':
                if(this.$attrs.traitCat == 'leaf_area_and_water_samples' & typeof state.current_traits[this.$attrs.traitCat] !== "undefined"){
                    this.traits = _.pick(state.current_traits[this.$attrs.traitCat][0],["leaf_mass_per_area_g_m2", "leaf_dry_matter_content_mg_g","equivalent_water_thickness_cm", "leaf_relative_water_content_perc"])
                }else if(this.$attrs.traitCat == 'leaf_chemistry_samples' & typeof state.current_traits[this.$attrs.traitCat] !== "undefined"){
                    this.traits =_.pick(state.current_traits[this.$attrs.traitCat][0].icp_leaf_element_concentrations[0],["al_mg_g","ca_mg_g","cu_mg_g","fe_mg_g","k_mg_g","mg_mg_g","mn_mg_g","na_mg_g","ni_mg_g","p_mg_g","zn_mg_g"])
                }
            break;
            } 
        })
    },
}
</script>

<style>

 .trait-name{
 	font-size:1em;
 	font-weight:bold;
 }

 .trait-value{
 	font-size:1em;
 }

 .traits{
 	margin-right:auto !important;
 	margin-left:auto !important;
 }

 h4{
	margin: auto;
	padding: 2px 0px 10px;
	font-size: 18px;
	font-weight: bold;
	color: #006e70;
 }
</style>