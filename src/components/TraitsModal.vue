<template>
    <div class="app-body row traits">
	<b-tabs pills card vertical nav-wrapper-class="w-20">
	<template v-for="(this_cat, name_cat, index_cat) in traitsCat">
		<b-tab :title="$t(this_cat)" @click="download_these_traits(this_cat)" :class="has_traits(this_cat)">
			<b-card-text>
				<TraitsCatTab :key="this_cat" :traitCat="this_cat" :sampleId="sample_id"></TraitsCatTab>
			</b-card-text>
		</b-tab>
	</template>
  	</b-tabs>
    </div>
</template>


<script>

import TraitsCatTab from "./TraitsCatTab.vue"
import _ from 'lodash';

export default {
	components:{
		TraitsCatTab
	},
    data() {
      return {
      	traitsCat:['leaf_area_and_water_samples','leaf_chemistry_samples']
      }
    },
    computed: {
    	sample_id () {
    		return this.$attrs.sampleId
    	},
    },
    methods: {
    	download_these_traits(cat){
	        let which={}
	        which.cat=cat
	        which.sample_id=this.sample_id
	    	this.$store.commit('download_traits', which)
    	},
		has_traits(cat) {
			if(typeof this.$store.state.current_traits[cat] !== "undefined"){
				if(cat =='leaf_area_and_water_samples'){
					if(this.$store.state.current_traits[cat].length!==0){
						return "has_traits"
					}
				}else if(cat =='leaf_chemistry_samples'){
					if(this.$store.state.current_traits[cat].icp_leaf_element_concentrations.length!==0){
						return "has_traits"
					}
				}
			}
			return "no_traits"
		}
    },
    mounted: function() {

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