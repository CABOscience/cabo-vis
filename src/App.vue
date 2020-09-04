<template>
  <div id="app">
        <SideBar />
           <div id="content" v-bind:class="{ active: isActive }">
              <LanguageSwitcher></LanguageSwitcher>
              <b-container>
              <div id="logo">
                <img alt="CABO logo" src="./assets/CABO_color.png" class="main-logo">
              </div>
              </b-container>
              <a name="search"></a><SearchBar></SearchBar>
              <a name="species-select"></a><SpeciesSelect></SpeciesSelect>
              <Loader></Loader>
              <a name="spectra"></a><LeafSpectra></LeafSpectra>
              <a name="map"></a><SpectraMap></SpectraMap>
              <a name="plants"></a><PlantsTable></PlantsTable>
          </div>
  </div>
</template>

<script>
import LanguageSwitcher from "./components/LanguageSwitcher.vue"
import Loader from "./components/Loader.vue"
import LeafSpectra from "./components/LeafSpectra.vue"
import SearchBar from "./components/SearchBar.vue"
import SpeciesSelect from "./components/SpeciesSelect.vue"
import SideBar from "./components/SideBar.vue"
import SpectraMap from "./components/SpectraMap.vue"
import PlantsTable from "./components/PlantsTable.vue"

//import * as d3 from 'd3'

export default {
  name: 'App',
  components: {
    LanguageSwitcher,
    Loader,
    LeafSpectra, 
    SearchBar,
    SpeciesSelect,
    SideBar,
    SpectraMap,
    PlantsTable,
  }, 
  data: function() {
    return {
    };
  },
  methods: {
    toggleSideBar() {
        this.$store.commit('toggle_sidebar', !this.$store.state.sidebar);
    }
  },
  computed: {
      isActive: {
          get () {
              return this.$store.state.sidebar
          }
      }
  },
  mounted: {

  }
}
</script>

<style>

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

.main-logo{
  max-width:500px;
  width:60%;
  margin:5px auto 20px;
}

.wrapper {
    display: flex;
    width: 100%;
}

#content.active {
    width: calc(100% - 250px);
    padding: 40px;
    min-height: 100vh;
    transition: all 0.3s;
    position: absolute;
    top: 0;
    right: 0;
}

#content {
    width: 100%;
}
#spectra-container, #map-container, #plants-container {
 /* border: 4px solid #dddddd;
  border-radius: 10px; 
  margin:100px 20px;*/
}

.card-body{
  padding:0px !important;
  min-height:250px;
}

.card{
  margin-bottom:50px;
} 


</style>
