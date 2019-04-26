import axios from 'axios'
import { openService } from '@/utils/server'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 5000 // request timeout
})

openService(service)

export default service
