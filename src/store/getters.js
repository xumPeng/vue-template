//  定义全局的getters，用于获取分发各个module中state的状态
const getters = {
  // app 模块
  sidebar: state => state.app.sidebar, // 从 app 模块获取 sidebar 状态
  device: state => state.app.device, // 从 app 模块获取 device 状态

  // user 模块
  token: state => state.user.token, // 从 user 模块获取 token 状态
  name: state => state.user.name, // 从 user 模块获取 name 状态
  
  // 新增tagsView
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews
}
export default getters