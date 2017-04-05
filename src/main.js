// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App';
import apply from './components/apply/apply.vue';
import look from './components/look/look.vue';

Vue.use(ElementUI);
Vue.use(VueRouter);

Vue.config.productionTip = false;

let routes = [
  {path: '/', component: look},
  {path: '/apply', component: apply}
];

let router = new VueRouter({
  routes: routes,
  linkActiveClass: 'active'
});


/* eslint-disable no-new */
let apps = new Vue({
  el: '#app',
  router: router,
  template: '<App/>',
  components: { App }
});
