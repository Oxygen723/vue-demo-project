import { createRouter, createWebHashHistory } from "vue-router";

const router = createRouter({
  history: createWebHashHistory(`/${import.meta.env.VITE_SYS_NAME}/`),
  routes: [
    {
      path: "/",
      redirect: "/nav",
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login/index.vue"),
      meta: {
        title: "登录页",
      },
    },
    {
      path: "/nav",
      name: "nav",
      component: () => import("@/views/Nav/index.vue"),
      meta: {
        title: "首页",
      },
    },
    {
      path: "/:path(.*)",
      name: "404",
      component: () => import("@/views/Error_404/index.vue"),
    },
  ],
});

// 添加路由守卫
// router.beforeEach((to, from, next) => {
//   // 如果用户访问的是登录页，直接放行
//   if (to.path === '/login') {
//     next()
//     return
//   }
//   // 如果用户访问的不是登录页，则需要判断用户是否登录
//   const token = localStorage.getItem('token')
//   if (token) {
//     next()
//   } else {
//     next('/login')
//   }
// })

export default router;
