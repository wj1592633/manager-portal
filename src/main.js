// The Vue build version to load with the `import` command
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import iView from 'iview';
import 'iview/dist/styles/iview.css';
import animate from 'animate.css'
import store from "./store/index"

Vue.config.productionTip = false
Vue.use(iView)
Vue.prototype.$axios = axios

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
