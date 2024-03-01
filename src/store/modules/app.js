import Cookies from 'js-cookie'

const state = {
  sidebar: {
    opened: Cookies.get('sidebarStatus') ? !!+Cookies.get('sidebarStatus') : true, // 控制侧边栏是否打开，初始值根据浏览器的 Cookies 来设置
    withoutAnimation: false // 设置动画效果为开启
  },
  device: 'desktop' // 控制侧边栏的响应式，初始值为desktop 表示桌面端
}

const mutations = {
  // 切换侧边栏的开关状态
  TOGGLE_SIDEBAR: state => {
    // 侧边栏的开关状态取反,可以反复实现打开和关闭的切换
    state.sidebar.opened = !state.sidebar.opened
    state.sidebar.withoutAnimation = false
    if (state.sidebar.opened) {
      // 如果侧边栏是打开状态，那么设置浏览器的 Cookies为 true
      Cookies.set('sidebarStatus', 1)
    } else {
      // 如果侧边栏是关闭状态，那么设置浏览器的 Cookies为 false
      Cookies.set('sidebarStatus', 0)
    }
  },
  // 关闭侧边栏
  CLOSE_SIDEBAR: (state, withoutAnimation) => {
    Cookies.set('sidebarStatus', 0)
    state.sidebar.opened = false
    state.sidebar.withoutAnimation = withoutAnimation
  },
  // 切换设备类型
  TOGGLE_DEVICE: (state, device) => {
    state.device = device
  }
}

const actions = {
  // 得到Navbar.vue 视图dispatch过来的上下文 context 中的 commit 方法
  toggleSideBar({ commit }) {
    commit('TOGGLE_SIDEBAR')
  },
  closeSideBar({ commit }, { withoutAnimation }) {
    commit('CLOSE_SIDEBAR', withoutAnimation)
  },
  toggleDevice({ commit }, device) {
    commit('TOGGLE_DEVICE', device)
  }
}

export default {
  namespaced: true, // 用于在全局引用此文件里的方法时标识这一个的文件名
  state,
  mutations,
  actions
}
