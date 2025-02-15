import { createRouter, createWebHashHistory, createWebHistory, createMemoryHistory } from "vue-router";
import { useRouterStore } from '@/store/routerOptions';

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
      {  // 测试页
        path: 'test',
        name: 'test',
        children: [
          {  // 测试页 -》 测试表格页
            path: 'table',
            name: 'test-table',
            component: () => import(/* webpackChunkName: "test-table" */'@/components/test/TableData.vue'),
          },
          // {  // 测试页 -》 测试表格页
          //   path: 'table1',
          //   name: 'test-table1',
          //   component: () => import(/* webpackChunkName: "test-table" */'@/components/test/table.vue'),
          // },
        ],
      },
    ],
    redirect: '/manage/test/table', // 默认重定向到 /manage/test/table 
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  // history: createWebHistory(process.env.BASE_URL),  // 使用 history 模式
  // history: createMemoryHistory(process.env.BASE_URL),  // 使用 memory 模式
  routes,
})

// 路由守卫 -》 快速跳转到首页next  
router.beforeEach((to, from, next) => {
  const loadingStore = useRouterStore();
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
  const loadingStore = useRouterStore();
  loadingStore.setLoading(false);
});

export default router;
