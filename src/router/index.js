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
      }, {
        path: 'system',
        name: 'System',
        component: () => import(/* webpackChunkName: "system" */'@/views/Manager/Main/systemSetting.vue'),
      }
    ],
    redirect: '/manage/test/table', // 默认重定向到 /manage/test/table 
  }, {  // 创建班级页
    path: '/createClass',
    name: 'createClass',
    component: () => import(/* webpackChunkName: "createClass" */'@/views/Home/createClass.vue'),
  }, {  // 用户管理登录页
    path: '/login',
    name: 'Login',
    component: () => import(/* webpackChunkName: "login" */'@/views/Manager/login.vue'),
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),  // 使用 hash 模式
  // history: createWebHistory(process.env.BASE_URL),  // 使用 history 模式
  // history: createMemoryHistory(process.env.BASE_URL),  // 使用 memory 模式
  // // 如果开发环境，使用 hash 模式，否则使用 history 模式
  // history: process.env.NODE_ENV === 'production'
  //   ? createWebHistory(process.env.BASE_URL)
  //   : createWebHashHistory(process.env.BASE_URL),
  routes,
})

// 路由守卫 -》 快速跳转到首页next  
router.beforeEach((to, from, next) => {
  const loadingStore = useRouterStore();
  loadingStore.setLoading(true);

  // 判断是否已登录（以 token 为例）
  const isLoggedIn = !!window.sessionStorage.getItem('token');

  // 如果访问 /manage 及其子路由，且未登录，跳转到 /login
  if (to.path.startsWith('/manage') && !isLoggedIn && to.path !== '/login') {
    return next('/login');
  }

  // 移除重定向到首页的逻辑
  //   if (from.name === null || from.name === undefined) {
  //     return to.path === '/'
  //   } else {
  //     return true;
  //   }
  next();
});

router.afterEach((to, from) => {
  // console.log("to", to, "from", from);
  const loadingStore = useRouterStore();
  loadingStore.toRoute = to;
  loadingStore.fromRoute = from;
  loadingStore.setLoading(false);
});

export default router;
