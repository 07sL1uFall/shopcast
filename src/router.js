import Vue from 'vue'
import Router from 'vue-router'
import Login from './components/Login.vue'
import Index from './components/Index.vue'
import Users from './components/Users.vue'
import Roles from './components/Roles.vue'
import Rights from './components/Rights.vue'

Vue.use(Router)

// 重复点击路由组件会报错的解决
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}

const router = new Router({
  routes: [
    { path: '/', redirect: '/index' },
    { path: '/login', component: Login },
    {
      path: '/index',
      component: Index,
      children: [
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles }
      ]
    }
  ]
})

router.beforeEach((to, from, next) => {
// 如果token令牌存在或者走的是login路径。那么就next放行，
// 如果不是，那么就还是放你去login登录
  const token = localStorage.getItem('token')
  if (token || to.path === '/login') {
    next()
  } else {
    next('login')
  }
})
export default router
