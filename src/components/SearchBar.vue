<template>
<div>
  <input type="search" class="search-bar" placeholder="Enter species name" v-model="searchValue" />
  <button class="search-button" v-on:click="search">Search</button>
  <div class="search-announce" v-html="announce"></div>
</div>
</template>

<script>
//import _ from 'lodash'

export default {
	name: "search",
	data: function() {
		return {
			searchValue : '', 
			announce: ''
		}
	},
	computed: {
		announce: {
			get () {
				return this.$store.state.search_announce
			}
		}
	},
	mounted: {
	},
	methods: {
		search: function(){
			this.$store.commit('save_search', this.searchValue);
		}
	},
	created: function () {
		//this.debouncedGetAnswer = 
	},

}
</script>
<style scoped>
.search-bar{
	width:500px;
	height:2.5em;
	margin:auto;
	display:block;
	border:2px solid #aaaaaa;
	border-radius: 5px;
	float:left;
}

.search-button{
	float:left;
}
</style>