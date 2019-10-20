import Vue from 'vue'
import App from './App.vue'
import router from './router'
import Element from 'element-ui'
import axios from 'axios'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)
Vue.config.productionTip = false

Vue.prototype.$axios = axios
// 配置全局基准地址
axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  // 想在请求头中带上token, config是请求相关的信息
  // 让每次请求在真正发送前, 都带上 token
  config.headers.Authorization = localStorage.getItem('token')
  return config
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error)
})

// 添加响应拦截器, 在响应被 .then 或者 .catch 处理之前处理
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  // console.log(response)
  response = response.data
  // 在响应拦截器中, 直接判断status是否是401, 如果是401, 说明无效的token (伪造的, 过期的)
  // 此时应该将其拦截到登陆
  if (response.meta.status === 401) {
    // 拦截到登陆
    // this.$router.push
    response.meta.msg = '尊敬的用户, 您的登陆状态已过期, 请重新登陆'
    localStorage.removeItem('token')
    router.push('/login')
  }
  return response
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error)
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
