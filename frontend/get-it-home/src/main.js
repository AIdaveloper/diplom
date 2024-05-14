import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap"

axios.defaults.baseURL = process.env.VUE_APP_API_URL
axios.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem('token')}`
// axios.interceptors.request.use(function (config) {
//   config.headers['authorization'] = process.env.VUE_APP_API_KEY;
//   return config;
// });



createApp(App).use(store).use().use(router).mount('#app')
