import Vue from 'vue'
import App from './App.vue'
import { registerApp } from './common/observer';

Vue.config.productionTip = false

const APP = new Vue({
  render: h => h(App),
});
registerApp(APP);
APP.$mount('#app')
