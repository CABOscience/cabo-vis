<template>
<div class="search-box">
<b-input-group>
  <b-form-input type="search" class="search-bar" placeholder="Enter species name" v-model="searchValue"></b-form-input>
<b-input-group-append>
 <b-button  variant="primary" class="search-button btn btn-primary" v-on:click="search">Search</b-button>
</b-input-group-append>
<b-input-group-append>
  <div class="search-announce" v-html="announce"></div>
  </b-input-group-append>
</b-input-group>

</div>
</template>

<script>
//import _ from 'lodash'

export default {
	name: "search",
	data: function() {
		return {
			searchValue : '',
		}
	},
	computed: {
		announce: {
			get () {
				return this.$store.state.search_box.announce
			}
		},
	},
	methods: {
		search: function(){
			this.$store.commit('save_search', this.searchValue);
		},
	},
	created: function () {
		//this.debouncedGetAnswer = 
	},
}
</script>
<style scoped>
.search-box{
	max-width:40%;
	margin:auto;
}
.search-bar{
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

.search-announce{
	margin:auto;
	display:block;
	max-width: 150px;
	line-height: 2.5em;
	margin-left: 20px;
}
</style>
