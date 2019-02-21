import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/page/login/Login"
import Index from "@/page/index/Index"
import Home from "@/page/index/components/Home"
import User from "@/page/user/Index"
import Test from "@/page/user/Test"
import store from '../store/index';


Vue.use(Router)

const router = new Router({
  routes: [
    {path: '/', redirect: '/login'},
    {
      path: '/login',
      name: 'Login',
      meta:"登陆",
      component: Login
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children:[
        {
          path:'home',
          meta:"首页",
          name:"Home",
          component:Home
        },
        {
          path:'user',
          name:"User",
          meta:"文章管理",
          component:User
        },
        {
          path:'test',
          name:"Test",
          meta:"评论管理",
          component:Test
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
 // store.dispatch('addOneTab',{text:(to.meta),name:(to.name),path:(to.path)});

  next();
})

export default router
