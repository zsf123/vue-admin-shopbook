import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
   baseURL: '/api/', //请求基地址
  // baseURL:process.env.BASE_API,
  timeout: 500000 // 超时时间
})


// 请求拦截器：发送请求之前做些什么
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error) 
    Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => response,

  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
