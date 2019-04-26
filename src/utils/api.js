import axios from 'axios'
import { openService } from '@/utils/server'

// create an axios instance
const service = axios.create({
  baseURL: 'http://localhost:9091/api', // api 的 base_url
  withCredentials: true, // 跨域请求时发送 cookies
  timeout: 5000 // request timeout
})

openService(service)

export default service
