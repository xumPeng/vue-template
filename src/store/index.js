import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import settings from './modules/settings'
import user from './modules/user'
import table from './modules/table'
import tagsView from './modules/tagsView' // 新增tagsView

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app, // 将 app 模块加入 Vuex store
    settings, // 将 settings 模块加入 Vuex store
    user, // 将 user 模块加入 Vuex store
    table, // 将 table 模块加入 Vuex store
    tagsView // 新增tagsView
  },
  getters // 加入全局 getters
})

export default store
