<template>
  <div id="app">
    <img alt="CABO logo" src="./assets/CABO_color.png" class="main-logo">
    <SearchBar />
    <LeafSpectra></LeafSpectra>
  </div>
</template>

<script>
import LeafSpectra from "./components/LeafSpectra.vue"
import SearchBar from "./components/SearchBar.vue"
//import * as d3 from 'd3'

export default {
  name: 'App',
  components: {
    LeafSpectra, 
    SearchBar
  }, 
  data: function() {
    return {
    };
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.main-logo{
  max-width:35%;
  margin:auto;
}
</style>
