import Vue from 'vue'
import Router from 'vue-router'
import Login from "@/page/login/Login"
import Lock from "@/page/lock/locking-page"
import Index from "@/page/index/Index"
import Home from "@/page/index/components/Home"
import User from "@/page/user/Index"
import NoticeManager from "@/page/notice/NoticeManager"
import NoticeShow from "@/page/notice/NoticeShow"
import RoleManager from "@/page/role/RoleManager"
import Api from "@/page/api/Api"
import Monitor from "@/page/monitor/Monitor"
import Menu from "@/page/menu/MenuManager"
import DeptManager from "@/page/dept/DeptManager"
import DictManager from "@/page/dict/DictManager"
import LoginLog from "@/page/log/LoginLog"
import BusinessLog from "@/page/log/BusinessLog"
import PersonInfo from "@/page/person/PersonInfo"
import PersonDetails from "@/page/person/PersonDetails"
import Security from "@/page/person/Security"

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
      path: '/lock',
      name: 'Lock',
      meta:"锁屏",
      component: Lock
    },
    {
      path: '/index',
      name: 'Index',
      component: Index,
      children:[
        {
          path:'home',
          //meta:"首页",
          name:"Home",
          meta:{title:'首页',keepAlive:false},
          component:Home
        },
        {
          path:'mgr', //对应数据库menu表的url
          name:"User",//首页左边的MenuItem是根据tips来找对应的路由名字，所有这里的name得对应数据库的tips。
          meta:{title:'用户管理',keepAlive:true},
          component:User
        },
        {
          path:'notice',
          name:"NoticeManager",
          meta:{title:'通知管理',keepAlive:false},
          // meta:"通知管理",
          component:NoticeManager
        },
        {
          path:'notice/show',
          name:"NoticeShow",
          meta:{title:'通知',keepAlive:false},
          component:NoticeShow
        },
        {
          path:'dept',
          name:"Dept",
          meta:{title:'部门管理',keepAlive:true},
          // meta:"通知管理",
          component:DeptManager
        },
        {
          path:'role',
          name:"Role",
          meta:{title:'角色管理',keepAlive:true},
          // meta:"通知管理",
          component:RoleManager
        },
        {
          path:'menu',
          name:"Menu",
          meta:{title:'菜单管理',keepAlive:true},
          component:Menu
        },
        {
          path:'api',
          name:"Api",
          meta:{title:'接口文档',keepAlive:true},
          component:Api
        },
        {
          path:'monitor',
          name:"Monitor",
          meta:{title:'监控管理',keepAlive:false},
          component:Monitor
        },
        {
          path:'log',
          name:"BLog",
          meta:{title:'业务日志',keepAlive:false},
          component:BusinessLog
        },
        {
          path:'loginLog',
          name:"LLog",
          meta:{title:'登陆日志',keepAlive:false},
          component:LoginLog
        },
        {
          path:'dict',
          name:"Dict",
          meta:{title:'字典管理',keepAlive:true},
          component:DictManager
        },
        {
          path:'person',
          name:"PersonInfo",
          meta:{title:'基本资料',keepAlive:true},
          component:PersonInfo,
          children:[
            {
              path:'details',
              name:"PersonDetails",
              meta:{title:'个人信息',keepAlive:true},
              component:PersonDetails
            },
            {
              path:'security',
              name:"Security",
              meta:{title:'安全设置',keepAlive:true},
              component:Security
            },
          ]
        }
      ]
    }
  ]
});

router.beforeEach((to, from, next) => {
 // store.dispatch('addOneTab',{text:(to.meta),name:(to.name),path:(to.path)});
  var lock = sessionStorage.getItem("lock");
  if (lock){
    if (lock === "lock" && to.path != "/lock"){
    router.replace({name:'Lock'})
      //next('/lock');
    }else {
      next();
    }
  }else {
    next();
  }
})

export default router
