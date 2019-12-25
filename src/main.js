import Vue from 'vue'
import VueRouter from "vue-router";
import VueMaterial from 'vue-material'


import App from './App.vue'
import router from './router'


Vue.config.productionTip = false

Vue.use(VueRouter);
Vue.use(VueMaterial);

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
