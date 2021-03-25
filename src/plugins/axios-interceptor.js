import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';

Vue.use(VueAxios, axios);

Vue.axios.defaults.baseURL = "https://data.caboscience.org/api/v1/";
//Vue.axios.defaults.baseURL = "http://localhost:3001/api/v1/";
//Vue.axios.defaults.headers.common['Authorization'] = 'Bearer '+process.env.CABO_API_KEY;
Vue.axios.defaults.headers.common['Authorization'] = 'Bearer '+ process.env.VUE_APP_CABO_API_KEY;


const MAX_REQUESTS_COUNT = 50
const INTERVAL_MS = 10
let PENDING_REQUESTS = 0

// create new axios instance
const api = Vue.axios.create({})

/**
 * Axios Request Interceptor
 */
api.interceptors.request.use(function (config) {
	return new Promise((resolve, reject) => {
		let interval = setInterval(() => {
			if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
				PENDING_REQUESTS++
				clearInterval(interval)
				resolve(config)
			} 
		}, INTERVAL_MS)
	})
})

/**
 * Axios Response Interceptor
 */
api.interceptors.response.use(function (response) {
	PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
	return Promise.resolve(response)
}, function (error) {
	PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
	return Promise.reject(error)
})

export default api