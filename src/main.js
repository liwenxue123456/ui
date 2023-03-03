// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
import TimeTemplate from "./views/TimeTemplate";
import TimesLot from "./views/TimesLot";
import Login from "./views/Login";
import Scheduling from "./views/Scheduling";
import Dept from "./views/Dept";
Vue.component("Dept",Dept)
Vue.component("Login",Login)
Vue.use(VueAxios, axios)
Vue.config.productionTip = false
Vue.use(ElementUI);
Vue.component("TimeTemplate",TimeTemplate)
Vue.component("TimesLot",TimesLot)
Vue.component("Scheduling",Scheduling)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
