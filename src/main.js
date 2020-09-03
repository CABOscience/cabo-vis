import Vue from 'vue'
import store from "./store"
import { BootstrapVue, IconsPlugin, PaginationPlugin, TablePlugin} from 'bootstrap-vue'
import App from './App.vue'
//import 'bootstrap/dist/css/bootstrap.css'
import './custom.scss'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import VueAxios from 'vue-axios';

//import qs from 'qs';

Vue.config.productionTip = false
// Install BootstrapVue
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)
Vue.use(PaginationPlugin)
Vue.use(TablePlugin)

Vue.use(VueAxios, axios);

Vue.axios.defaults.baseURL = "https://data.caboscience.org/api/v1/";
//Vue.axios.defaults.baseURL = "http://localhost:3001/api/v1/";
//Vue.axios.defaults.headers.common['Authorization'] = 'Bearer '+process.env.CABO_API_KEY;
Vue.axios.defaults.headers.common['Authorization'] = 'Bearer 2e9f97ef84b1069a1885c20d982a5c751b192492378a8a3e7db38c3f1024d76a';

new Vue({
	store,
	render: h => h(App),
}).$mount('#app')

