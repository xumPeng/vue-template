import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken, getRefreshToken, setRefreshToken, removeRefreshToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(), // access_token
    refreshToken: getRefreshToken(),  // 添加这个新的属性来存储 refresh_token
    name: ''
  }
}

const state = getDefaultState()

/**
 * Action 函数接收一个 context 对象，可以从里面解构出 commit 方法或 state 对象
 * 以及一个可选的 payload 对象
 */
const actions = {
  /* 处理用户登录的业务
    通过解构赋值先得到context对象中的commit方法方便后续Mutation使用
    如果不使用解构赋值，代码将是这样的：
    login(context, userInfo) {
      const commit = context.commit}
  }
  */
  login({ commit }, userInfo) {
    /*
    userInfo 是从组件中传递给 Vuex action 的对象，通常包含表单中的数据在 
    userInfo 对象可能是这样的：{username: "admin",password: "111111"}
    */
    // 解构出用户名与密码
    const { username, password } = userInfo
    // 创建了一个新的 Promise 对象
    return new Promise((resolve, reject) => {
      // 调用封装好的 login 函数，向后端api发送登录请求
      login({ username: username.trim(), password: password }).then(
        // 当 login 函数成功返回响应时执行then中的代码
        response => {
          // response 是从后端返回的响应数据
          // 从响应数据中提取令牌（token）
          const token = response.data.access
          const refreshToken = response.data.refresh
          // 调用 Vuex 的 commit 方法来触发一个 mutation，将获取的令牌保存到 Vuex 的状态中
          commit('SET_TOKEN', token)
          commit('SET_REFRESH_TOKEN', refreshToken)
          // 将 token 存储到 Cookies 中
          setToken(token)
          setRefreshToken(refreshToken)
          // 表示 Promise 成功完成
          resolve()
        }).catch(error => {
          //如果 login 函数在执行过程中遇到错误（如网络错误或后端服务返回错误）
          // 表示 Promise 因错误而失败
          reject(error)
        })
    })
  },

  // 得到登录用户的信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // 调用封装好的 getInfo 函数，向后端 api 发送请求
      getInfo(state.token).then(response => {
        // 从response中解构出data (response.data)
        const { data } = response

        if (!data) {
          return reject('验证失败，请重新登录！')
        }
        const { username} = data

        commit('SET_NAME', username)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // 退出登录
  logout({ commit }) {
    return new Promise((resolve, reject) => {
      // 从Cookies中获取 refreshToken
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        reject('未找到刷新令牌！');
        return;
      }
      // 调用前端定义的 API 函数发送logout请求
      logout(refreshToken).then(() => {
        // 清除 token 并重置状态
        removeToken(); // 移除 accessToken
        removeRefreshToken(); // 移除 refreshToken
        resetRouter(); // 重置路由
        commit('RESET_STATE');
        resolve();
      }).catch(error => {
        reject(error);
      })
    })
  },

  // 移除令牌
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

/**
 * Mutation 函数接收参数为固定的 state 和一个可选的 payload
 */
const mutations = {
  RESET_STATE: (state) => {
    // 清除全部的 token 并重置状态
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_REFRESH_TOKEN: (state, refreshToken) => {
    state.refreshToken = refreshToken
  }
}

export default {
  namespaced: true, // 用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  mutations,
  actions
}

