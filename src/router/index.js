import { createRouter, createWebHashHistory } from "vue-router";
import { useLoadingStore } from '@/store/routerLoading';

const routes = [
  {     // 首页
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */'@/views/Home/Home.vue'),
  }, {  // 座位数据页
    path: '/seatData',
    name: 'seatData',
    component: () => import(/* webpackChunkName: "seatData" */'@/views/SeatData/SeatData.vue'),
  }, {  // 管理页
    path: '/manage',
    name: 'manage',
    component: () => import(/* webpackChunkName: "manage" */'@/views/Manager/Manage.vue'),
    children: [
      {  // 测试表格页
        path: 'test',
        name: 'test',
        component: () => import(/* webpackChunkName: "test" */'@/components/test/TableData.vue'),
      },
    ],
    redirect: '/manage/test',
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
})

// 路由守卫 -》 快速跳转到首页next  
router.beforeEach((to, from, next) => {
  const loadingStore = useLoadingStore();
  loadingStore.setLoading(true);

  // 移除重定向到首页的逻辑
  //   if (from.name === null || from.name === undefined) {
  //     return to.path === '/'
  //   } else {
  //     return true;
  //   }
  next();
});

router.afterEach((to, from) => {
  console.log(to, from);
  const loadingStore = useLoadingStore();
  loadingStore.setLoading(false);
});

export default router;
