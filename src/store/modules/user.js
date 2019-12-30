import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'

const state = {
  token: getToken(),
  userId: '',
  status: '',
  code: '',
  name: '',
  avatar: '',
  introduction: '',
  birday: '',
  gender: '',
  addres: '',
  mobile: '',
  roles: [],
  setting: {
    articlePlatform: []
  },
  ip: ''
}

const mutations = {
  SET_USER: (state, user) => {
    state.userId = user.id
    state.name = user.nickname
    state.avatar = user.image ? user.image : 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    state.introduction = user.nickname
    state.birday = user.birday
    state.gender = user.gender
    state.addres = user.addres
    state.mobile = user.mobile
    state.roles = user.roles
  },
  NULL_USER: (state) => {
    state.userId = ''
    state.name = ''
    state.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    state.introduction = ''
    state.birday = ''
    state.gender = ''
    state.addres = ''
    state.mobile = ''
    state.roles = []
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_CODE: (state, code) => {
    state.code = code
  },
  SET_INTRODUCTION: (state, introduction) => {
    state.introduction = introduction
  },
  SET_SETTING: (state, setting) => {
    state.setting = setting
  },
  SET_STATUS: (state, status) => {
    state.status = status
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_IP: (state, ip) => {
    state.ip = ip
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { token } = response
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit }) {
    return new Promise((resolve, reject) => {
      getInfo().then(response => {
        const { user } = response
        if (!user) {
          reject('Verification failed, please Login again.')
        }
        // roles must be a non-empty array
        if (!user.roles || user.roles.length <= 0) {
          reject('getInfo: roles must be a non-null array!')
        }
        commit('SET_USER', user)
        resolve(user)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken()
      resolve()
    })
  },

  // Dynamically modify permissions
  changeRoles({ commit, dispatch }, role) {
    return new Promise(async resolve => {
      const token = role + '-token'

      commit('SET_TOKEN', token)
      setToken(token)

      const { roles } = await dispatch('getInfo')

      resetRouter()

      // generate accessible routes map based on roles
      const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })

      // dynamically add accessible routes
      router.addRoutes(accessRoutes)

      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
