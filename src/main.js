import Vue from 'vue'
import store from "./store"
import { BootstrapVue, IconsPlugin, PaginationPlugin, TablePlugin} from 'bootstrap-vue'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'leaflet/dist/leaflet.css';

Vue.config.productionTip = false
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(PaginationPlugin)
Vue.use(TablePlugin)

new Vue({
	store,
	render: h => h(App),
}).$mount('#app')

