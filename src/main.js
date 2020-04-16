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

Vue.filter("YMDFilter",(date)=>{
  if(date){
    var date1 = new Date(date)
    var year = date1.getFullYear();
    var month = date1.getMonth();
    var day = date1.getDay();
    return year+"-"+month+"-"+day;
  }
  return "";
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
