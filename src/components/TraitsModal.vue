
<!-- b-table
	      id="traits-table"
	      :items="traits"
	      small
	      stacked
	      sticky-header="600px"
	      ref="selectableTable"
	      head-variant="dark"
	      no-gutters
	    >

</b-table -->
<template>
    <div class="app-body row">
		<h4>{{$t('Dry matter and water')}}</h4>
        <template v-for="(this_trait, name, index) in traits">
        	<b-container>
			  <b-row>
			    <b-col cols="8" class="trait-name"><p v-html="$t(name)"></p></b-col>
			    <b-col class="trait-value">{{ shorten(this_trait) }}</b-col>
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
      }
    },
    computed: {
    	traits () {
    		return  _.pick(this.$store.state.current_traits[0], ["leaf_mass_per_area_g_m2", "leaf_relative_water_content_perc", "leaf_dry_matter_content_mg_g","equivalent_water_thickness_cm"]);
	   	}
    },
    methods: {
    	shorten (val) {
    		if(val.indexOf('.')>1){
    			return val.substring(0,val.indexOf('.')+3)
	    	}else{
	    		return val.substring(0,6)
	    	}
    	}
    }
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

 h4{
	margin: auto;
	padding: 2px 0px 10px;
	font-size: 18px;
	font-weight: bold;
	color: #006e70;
 }
</style>