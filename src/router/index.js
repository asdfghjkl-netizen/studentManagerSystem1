import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */'@/views/Home.vue')
  }, {
    path: '/manage',
    name: 'manage',
    component: () => import(/* webpackChunkName: "manage" */'@/views/Manage.vue')
  }, {
    path: '/',
    redirect: '/',
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

export default router;
