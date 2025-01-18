import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */'@/views/Home/Home.vue')
  }, {
    path: '/manage',
    name: 'manage',
    component: () => import(/* webpackChunkName: "manage" */'@/views/Manager/Manage.vue')
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

// 路由守卫 -》 快速跳转到首页next
router.beforeEach((to, from) => {
  if (from.name === null || from.name === undefined) {
    return to.path === '/'
  } else {
    return true;
  }
})

export default router;
