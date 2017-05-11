// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App';
import projectApply from './components/projectApply/projectApply.vue';
import projectJoin from './components/projectJoin/projectJoin.vue';
import checkJoin from './components/checkJoin/checkJoin.vue';
import gthesiseApply from './components/gthesiseApply/gthesiseApply.vue';
import sthesiseApply from './components/sthesiseApply/sthesiseApply.vue';
import patentApply from './components/patentApply/patentApply.vue';
import assetApply from './components/assetApply/assetApply.vue';
import renderApply from './components/renderApply/renderApply.vue';

Vue.use(ElementUI);
Vue.use(VueRouter);

Vue.config.productionTip = false;

let routes = [
  {path: '/', component: projectJoin},
  {path: '/projectApply', component: projectApply},
  {path: '/checkJoin', component: checkJoin},
  {path: '/gthesiseApply', component: gthesiseApply},
  {path: '/sthesiseApply', component: sthesiseApply},
  {path: '/patentApply', component: patentApply},
  {path: '/assetApply', component: assetApply},
  {path: '/renderApply', component: renderApply}
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
