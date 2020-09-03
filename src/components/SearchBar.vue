<template>
<div class="search-box">
<b-input-group size="lg" class="search-group">
  <!-- b-form-input type="search" class="search-bar" placeholder="Enter species name" v-model="searchValue"></b-form-input -->
	<b-input-group-append>
	<autocomplete
	  :search="search_api"
	  class="search-bar"
	  :placeholder="placeholder" 
      :aria-label="placeholder"
      :get-result-value="getResultValue"
      :debounceTime="500"
      @submit="handleSelection"
      ref="autocomplete"
	 >
	</autocomplete>
</b-input-group-append>
<b-input-group-append>
 <b-button  variant="primary" class="clear-button btn btn-danger" v-on:click="clear" v-if="searchNotEmpty">x</b-button>
</b-input-group-append>
<b-input-group-append>
 <b-button  variant="primary" class="search-button btn btn-primary" v-on:click="search">{{ $t('search') }}</b-button>
</b-input-group-append>
<b-input-group-append  class="announce-group">
  <div class="search-announce" v-html="announce"></div>
  </b-input-group-append>
</b-input-group>

</div>
</template>

<script>
//import _ from 'lodash'
//import Autocomplete from 'vuejs-auto-complete'
import Autocomplete from '@trevoreyre/autocomplete-vue'
import '@trevoreyre/autocomplete-vue/dist/style.css'

export default {
	name: "search",
	components: {
		Autocomplete,
	},
	data: function() {
		return {
			searchValue : '',
			searchNotEmpty : false,
		}
	},

	computed: {
		announce: {
			get () {
				return this.$store.state.search_box.announce
			}
		},
		placeholder: {
			get () {
				return this.$i18n.t('enter_species_name')
			}
		},
		authHeaders () {
		    return {
		      'Authorization': 'Bearer 2e9f97ef84b1069a1885c20d982a5c751b192492378a8a3e7db38c3f1024d76a'
		    }
		},
	},
	methods: {
		search: function(){
			this.$store.commit('save_search', this.searchValue);
			this.searchNotEmpty=true
		},
		clear: function(){
			this.searchValue=''
			this.$store.commit('save_search', "");
			this.searchNotEmpty=false
			this.$store.commit('showLoader', false);
			this.$store.state.showSpectra = false;
			this.$refs.autocomplete.value = ''

		},
	    getResultValue(result) {
	      return result.name
	    },
	    search_api (input) {
	    	this.searchValue=input
	    	if (input.length < 1) { return [] }
			return this.axios.get('vascan/autocomplete',{
				params: {
					q: input
				}
			}).then(result => {
				return result.data
			})
	    },
	    handleSelection(result) {
	      this.searchValue=result.name
	    },
	},
	created: function () {
		//this.debouncedGetAnswer = 
	},
}
</script>
<style>
.search-box{
	max-width:40%;
	margin:auto;
}
.search-bar{
	width:400px;
	/*width:400px;
	height:2.5em;
	margin:auto;
	display:block;
	border:2px solid #aaaaaa;
	border-radius: 5px;
	float:left;*/
}

.search-button{
	/*float:left;*/
}

.search-group{
	flex-wrap: nowrap !important;
}

.announce-group{
	white-space: nowrap;
}
.search-announce{
	margin:auto;
	display:block;
	max-width: 150px;
	line-height: 2.5em;
	margin-left: 20px;
	white-space: nowrap;
}

.autocomplete-result-list{
	z-index:100 !important;
}
.autocomplete-result{
	float:left;
	display:block;
	line-height:1em;
	width:100%;
	text-align:left;
}
</style>
