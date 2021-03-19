<template>
    <div class="app-body row traits">
	<b-tabs pills card vertical nav-wrapper-class="w-20" v-model="active_trait">
	<template v-for="(this_cat, name_cat, index_cat) in traitsCat">
		<b-tab :title="$t(this_cat)" @click="download_these_traits(this_cat)" v-bind="has_trait(this_cat)" >
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
      	traitsCat:['leaf_area_and_water_samples','icp_leaf_element_concentrations','c_n_leaf_concentrations'],
      	has_traits:{
      		'leaf_area_and_water_samples':false,
      		'icp_leaf_element_concentrations':false,
      		'c_n_leaf_concentrations':false,
      	},
      	active_trait:0,
      }
    },
    computed: {
    	sample_id () {
    		return this.$attrs.sampleId
    	},
    },
    methods: {
    	download_these_traits(cat){
	       /* let which={}
	        which.cat=cat
	        which.sample_id=this.sample_id
	    	this.$store.commit('download_traits', which)*/
    	},
    	has_trait(cat){
    		var self=this
    		if(this.has_traits[cat]==false){
    			return {'disabled':'disabled'}
    		}else{
    			return {}
    		}
    	}
    },
    mounted: function() {
        this.$store.subscribe((mutation,state) => {
            switch(mutation.type) {
            case 'save_traits':
            	var self = this
            	_.mapKeys(state.current_traits,function(value, key){
            		if(key=="leaf_area_and_water_samples"){
            			self.has_traits[key] = (value.length!=0)
            		}else if(key=='leaf_chemistry_samples'){
            			self.has_traits['icp_leaf_element_concentrations'] = (typeof value[0]['icp_leaf_element_concentrations']!=='undefined' && value[0]['icp_leaf_element_concentrations'].length!==0)
            			self.has_traits['c_n_leaf_concentrations'] = (typeof value[0]['c_n_leaf_concentrations']!=='undefined' && value[0]['c_n_leaf_concentrations'][0].length!==0)
            		}
            	})
            	self.active_trait=_.values(self.has_traits).length-_.values(self.has_traits).indexOf(true)
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

 .no_traits{
 	display:none !important;
 }
</style>