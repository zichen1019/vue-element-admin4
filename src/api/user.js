import api from '@/utils/api'

export function login(data) {
  return api({
    url: '/user/info',
    method: 'post',
    data
  })
}

export function getInfo() {
  return api({
    url: '/user/getinfo',
    method: 'get'
  })
}

export function logout() {
  return api({
    url: '/user/logout',
    method: 'post'
  })
}
