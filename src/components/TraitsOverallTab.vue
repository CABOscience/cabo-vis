<template>
    <div class="app-body row traits">
        <b-container fluid>
        <b-row >
        <template v-for="(this_trait, name, index) in traits">
            <b-col lg="6">
        	<b-container>
	  <b-row>
	    <b-col col lg="6" class="trait-name"><p v-html="$t(name)"></p></b-col>
	  </b-row>
	  <b-row>
	    <b-col cols="8">
	    	<TraitDensity :key="key_name(name)" :trait_val="this_trait" :index_cat="index_cat"></TraitDensity>
	    </b-col>
	  </b-row>
	</b-container>
</b-col>
</template>
</b-row>
</b-container>
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
        all_traits_selection:[]
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
        has_traits (t) {
            return this.$attrs.has_traits[t];
        },
        traits(){
            return this.$attrs.has_traits;
        }
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
        has_trait(trait) {
            return trait !==0 && trait !== ''
        },
        _trait_selection(t) { //Values for this trait based on selection
            return _.mapValues(this.all_traits_selection, c =>{
                return _.pickBy(c, (v,k) => {
                    return k==t || k=='scientific_name'
                })
            })
        },
        key_name(key){
            return "overall-"+key
        }
    },
    mounted: function() {
        var self = this
        this.$store.subscribe((mutation,state) => {
            switch(mutation.type) {
            case 'save_all_traits':
                self.all_traits_selection=state.all_current_traits
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