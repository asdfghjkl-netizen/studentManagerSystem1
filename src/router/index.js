import { createRouter, createWebHashHistory } from "vue-router";

const routes = [
  {     // 首页
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */'@/views/Home/Home.vue')
  }, {  // 管理页
    path: '/manage',
    name: 'manage',
    component: () => import(/* webpackChunkName: "manage" */'@/views/Manager/Manage.vue')
  }, {  // 座位数据页
    path: '/seatData',
    name: 'seatData',
    component: () => import(/* webpackChunkName: "seatData" */'@/views/SeatData/SeatData.vue')
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
