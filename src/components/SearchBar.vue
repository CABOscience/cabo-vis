<template>
<div>
  <input type="search" class="search-bar" placeholder="Enter species name" v-model="searchValue" />
  <button class="search-button" v-on:click="search">Search</button>
</div>
</template>

<script>
//import _ from 'lodash'

export default {
	name: "search",
	data: function() {
		return {
			searchValue : ''
		}
	},
	computed: {
		/*search: {
			get () {
				return this.$store.state.search_box.search_value
			},
			set (value) {
				if(value!==''){
					this.$store.commit('save_search', value)
				}
			}	
		}*/
	},
	/*watch: {
		search: function () {
			var self=this
			_.debounce(function() {
				self.$store.commit('save_search', self.search);
			}, 1000)();
		},
	},*/
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
}
</style>