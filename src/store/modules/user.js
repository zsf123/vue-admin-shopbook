import { login, logout,getInfo} from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    user: null,
    avatar: '',
    roles: []
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_USER: (state, user) => {
      state.user = user
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    // 全局登录，这里的userInfo是用户输入的登录数据
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
			// 异步调用登录api
      return new Promise((resolve, reject) => {
				// 调用登录api
        login(username, userInfo.password).then(response => {
					// 这里后台返回的数据全都放在data里面
          const data = response.data
					console.log("登录用户为 : "+data.user.id)
					// commint('SET_NAME',data.username);
					// 登录成功，将获得的Token保存到cookie中的token中
          setToken(data.token)
					console.log("登录客户端的token : "+data.token)
					// 触发mutation中的方法（更改token初始值）
          commit('SET_TOKEN', data.token)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
				// 根据全局状态里的token拉取用户信息
				console.log("全局状态的token : "+state.token)
        getInfo(state.token).then(response => {
          const data = response.data
          if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          }
          commit('SET_USER', data.user)
          commit('SET_AVATAR', data.user.avatar_url)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then((res) => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          removeToken()
          resolve(res)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
