import Vue from 'vue'
import Router from 'vue-router'
import TimeTemplate from "../views/TimeTemplate";
import TimesLot from "../views/TimesLot";
import Login from "../views/Login";
import Scheduling from "../views/Scheduling";
import Dept from "../views/Dept";
Vue.use(Router)
export default new Router({
  routes: [
    {
      path:'/',
      name: '/Login',
      component: Login
    },
    {
      path: '/TimeTemplate',
      name: 'TimeTemplate',
      component: TimeTemplate
    }, {
      path: '/TimesLot',
      name: 'TimesLot',
      component: TimesLot
    },
    {
      path: '/Scheduling',
      name: 'Scheduling',
      component: Scheduling
    },
    {
      path: '/Dept',
      name: 'Dept',
      component: Dept
    },

  ]
})
