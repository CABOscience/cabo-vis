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
	    	<TraitDensity :key="name" :trait_val="this_trait" :index_cat="index_cat"></TraitDensity>
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
        index_cat(){
            return this.$attrs.index_cat
        },
    	sample_id () {
    		return this.$attrs.sampleId
    	},
    },
    methods: {
        shorten (val) {
            if(val!=null){
                val=val.toString()
                if(val.indexOf('.') > 1){
                    return val.substring(0,val.indexOf('.')+3)
                }else{
                    return val.substring(0,6)
                }
            }
            return null
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
                    this.traits = _.pick(state.current_traits['leaf_area_and_water_samples'][0],["leaf_mass_per_area_g_m2", "leaf_dry_matter_content_mg_g","equivalent_water_thickness_cm", "leaf_relative_water_content_perc"])
                }else if(this.$attrs.traitCat == 'icp_leaf_element_concentrations' & typeof state.current_traits['leaf_chemistry_samples'] !== "undefined"){
                    this.traits =_.pick(state.current_traits["leaf_chemistry_samples"][0]["icp_leaf_element_concentrations"][0],["al_mg_g","ca_mg_g","cu_mg_g","fe_mg_g","k_mg_g","mg_mg_g","mn_mg_g","na_mg_g","ni_mg_g","p_mg_g","zn_mg_g"])
                }else if(this.$attrs.traitCat == 'c_n_leaf_concentrations' & typeof state.current_traits["leaf_chemistry_samples"] !== "undefined"){
                    this.traits =_.pick(state.current_traits["leaf_chemistry_samples"][0]["c_n_leaf_concentrations"][0],["c_perc","n_perc"])
                }else if(this.$attrs.traitCat == 'carbon_fractions_bags' & typeof state.current_traits["leaf_chemistry_samples"] !== "undefined"){
                    var i=0;
                    var ind=0
                    if(state.current_traits["leaf_chemistry_samples"][0]["carbon_fractions_bags"].length>1){
                        _state.current_traits["leaf_chemistry_samples"][0]["carbon_fractions_bags"].forEach(t => {
                            var newd = new Date(t.carbon_fractions[0].date_started)
                            if(i==0){
                                var d = newd
                            }
                            if(i>0 && newd>d){
                                ind = i
                                d = newd
                            }
                            i++
                        })
                    }
                    this.traits =_.pick(state.current_traits["leaf_chemistry_samples"][0]["carbon_fractions_bags"][ind],["soluble_perc","cellulose_perc","hemicellulose_perc","lignin_perc","soluble_perc","recalcitrants_perc"])
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