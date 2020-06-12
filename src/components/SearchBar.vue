<template>
<div class="search-box">
  <input type="search" class="search-bar" placeholder="Enter species name" v-model="searchValue" />
  <button class="search-button btn btn-primary" v-on:click="search">Search</button>
  <div class="search-announce" v-html="announce"></div>
  <div v-if="showLoader" class="loader">
<svg class="loader" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin: auto; display: block;" width="200px" height="200px" viewBox="0 0 100 10">
<circle cx="18" cy="63.8778" r="4" fill="#f5542e">
  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="0s" repeatCount="indefinite"></animate>
</circle><circle cx="27" cy="65.8997" r="4" fill="#f2c327">
  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.125s" repeatCount="indefinite"></animate>
</circle><circle cx="36" cy="60.9779" r="4" fill="#008b6e">
  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.25s" repeatCount="indefinite"></animate>
</circle><circle cx="45" cy="46.9951" r="4" fill="#00aede">
  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.375s" repeatCount="indefinite"></animate>
</circle><circle cx="54" cy="36.1222" r="4" fill="#f5542e">
  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.5s" repeatCount="indefinite"></animate>
</circle><circle cx="63" cy="34.1003" r="4" fill="#f2c327">
  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.625s" repeatCount="indefinite"></animate>
</circle><circle cx="72" cy="39.0221" r="4" fill="#008b6e">
  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.75s" repeatCount="indefinite"></animate>
</circle><circle cx="81" cy="53.0049" r="4" fill="#00aede">
  <animate attributeName="cy" values="34;66;34" times="0;0.5;1" dur="1s" calcMode="spline" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" begin="-0.875s" repeatCount="indefinite"></animate>
</circle>
</svg>
</div>
</div>
</template>

</div>

</template>

<script>
//import _ from 'lodash'

export default {
	name: "search",
	data: function() {
		return {
			searchValue : '',
			showLoader: false,
		}
	},
	computed: {
		announce: {
			get () {
				return this.$store.state.search_box.announce
			}
		}
	},
	methods: {
		search: function(){
			this.showLoader=true;
			this.$store.commit('save_search', this.searchValue);
		},
		toggleLoader: function(){
			this.showLoader=!this.showLoader;
		}
	},
	created: function () {
		//this.debouncedGetAnswer = 
	},
        mounted: function() {
                this.$store.subscribe((mutation,state) => {
                        switch(mutation.type) {
                        case 'save_spectra':
                                this.toggleLoader();
                        break;
                        }
                })
        },
}
</script>
<style scoped>
.search-box{
	max-width:35%;
	margin:auto;
}
.search-bar{
	width:400px;
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

.search-announce{
	margin:auto;
	display:block;
	max-width: 150px;
	float: left;
	line-height: 2.5em;
	margin-left: 20px;
}
.loader{
	display:block;
	overflow:visible;
	margin:auto;
}
</style>
