<template>
  <div id="app">
      <div class="wrapper">
        <SideBar />
           <div id="content" v-bind:class="{ active: isActive }">
              <nav class="navbar navbar-expand-lg navbar-light bg-light" style="display:none">
                  <div class="container">
                      <button type="button" id="sidebarCollapse" class="btn btn-info" v-on:click="toggleSideBar">
                          <i class="fas fa-align-left"></i>
                          <span>Toggle Sidebar</span>
                      </button>
                  </div>
              </nav>
            <img alt="CABO logo" src="./assets/CABO_color.png" class="main-logo">
            <SearchBar />
            <LeafSpectra></LeafSpectra>
          </div>
        </div>
    </div>
  </div>
</template>

<script>
import LeafSpectra from "./components/LeafSpectra.vue"
import SearchBar from "./components/SearchBar.vue"
import SideBar from "./components/SideBar.vue"
//import * as d3 from 'd3'

export default {
  name: 'App',
  components: {
    LeafSpectra, 
    SearchBar,
    SideBar,
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
  max-width:35%;
  margin:auto;
}
.wrapper {
    display: flex;
    width: 100%;
}


#content {
    width: calc(100% - 250px);
    padding: 40px;
    min-height: 100vh;
    transition: all 0.3s;
    position: absolute;
    top: 0;
    right: 0;
}

#content.active {
    width: 100%;
}

@media (max-width: 768px) {
    #sidebar {
        margin-left: -250px;
    }
    #sidebar.active {
        margin-left: 0;
    }
    #content {
        width: 100%;
    }
    #content.active {
        width: calc(100% - 250px);
    }
    #sidebarCollapse span {
        display: none;
    }
}
</style>
