import Vue from 'vue'
import VueRouter from "vue-router";
import VueMaterial from 'vue-material'

import SmartBanner from 'smart-app-banner'
import 'smart-app-banner/dist/smart-app-banner.css'

import App from './App.vue'
import router from './router'


Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(VueMaterial);

new Vue({
  router,
  render: h => h(App),
  created(){
    new SmartBanner({
      daysHidden: 15,   // days to hide banner after close button is clicked (defaults to 15)
      daysReminder: 90, // days to hide banner after "VIEW" button is clicked (defaults to 90)
      title: 'VRKnock',
      author: 'inventivetalent',
      button: 'VIEW',
      store: {
        android: 'On Google Play',
      },
      price: {
        ios: 'FREE',
        android: 'FREE',
        windows: 'FREE'
      },
      icon: 'https://vrknock.app/img/web_hi_res_512.png'
    });
  }
}).$mount('#app')
