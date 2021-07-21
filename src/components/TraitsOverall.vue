<template>
      <b-card v-if="showOverallTraits" border-variant="primary" footer-bg-variant="dark" header-bg-variant="primary" header-text-variant="white" :header="header" class="text-center spectra-card">
        <b-card-text bg-variant="light" text-variant="gray-dark" class="graph-card">
    <div class="app-body row overall-traits" >
  <b-tabs pills card vertical v-model="active_trait" >
	<template v-if="showOverallTraits" v-for="(this_cat, name_cat, index_cat) in traits_cat" >
		<b-tab :title="$t(name_cat)"  class="test" v-bind:disabled="has_traits_cat(name_cat)">
			<b-card-text>
				<TraitsOverallTab :key="name_cat" :traitCat="name_cat" :index_cat="index_cat" :has_traits="this_cat"></TraitsOverallTab>
			</b-card-text>
		</b-tab>
	</template>
  	</b-tabs>
    </div>
  </b-card-text>
  </b-card>
</template>


<script>

import TraitsOverallTab from "./TraitsOverallTab.vue"
import _ from 'lodash';

export default {
	components:{
		TraitsOverallTab
	},
    data() {
      return {
      	traits_cat_:['leaf_area_and_water_samples','icp_leaf_element_concentrations','c_n_leaf_concentrations','carbon_fractions_bags','pigments_extracts'],
      	traits_cat:{
      		'leaf_area_and_water_samples':{},
      		'icp_leaf_element_concentrations':{},
      		'c_n_leaf_concentrations':{},
          'carbon_fractions_bags':{},
          'pigments_extracts':{},
      	},
      	active_trait:0,
       }
    },
    computed: {
    	sample_id () {
    		return this.$attrs.sampleId
    	},
      header () {
        return this.$i18n.t('traits');
      },
      showOverallTraits:{
        get(){
          return this.$store.state.showOverallTraits && this.$store.state.showAll;
        }
      }
    },
    methods: {
    	has_traits_cat(cat){
    		/*if(Object.keys(this.has_traits[cat]).length === 0 ){
    			return {'disabled':'disabled'}
    		}else{
    			return {}
    		}*/
        return Object.keys(this.traits_cat[cat]).length === 0
    	},
      has_traits_arr(cat){
        return this.has_traits[cat]
      },
      download_plant_traits(sample_id) {
        this.$store.commit('download_plant_traits_csv', sample_id)
      },
      traits_colors(index){
        return this.$store.state.basic_colors[index]
      }
    },
    mounted: function() {
        this.$store.subscribe((mutation,state) => {
        var self = this
            switch(mutation.type) {
            case 'save_all_traits':
              _.mapValues(state.all_current_traits, sample => {
              	_.mapKeys(sample,(value, key) => {
                    if(!isNaN(value)){
                      self.traits_cat[state.traits_table[key]][key]=true
                    }
                	})
              })
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


.traits li:nth-child(1) a.active{
  background-color:#008bae;
  color:white;
} 

.traits li:nth-child(2) a.active{
  background-color:#65318c;
  color:white;
} 

.traits li:nth-child(3) a.active{
  background-color:#8bc442;
  color:white;
} 

.traits li:nth-child(4) a.active{
  background-color:#e7262b;
  color:white;
} 

.traits li:nth-child(1) a{
  color:#008bae;
} 

.traits li:nth-child(5) a.active{
  background-color:#f59121;
  color:white;
} 

.tabs{
  margin-top: 30px;
  margin-left: 30px !important;
}

a.disabled{
  display:none;
}

</style>