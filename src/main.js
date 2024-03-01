import Vue from 'vue'

import 'normalize.css/normalize.css' // 导入Normalize.css，用于确保不同浏览器的默认样式一致性

import ElementUI from 'element-ui' // 导入ElementUI
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // // 导入全局样式文件

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // 导入项目中定义的图标
import '@/permission' // 导入权限控制逻辑

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// 仅在生产环境下执行的代码
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// 关闭生产环境下给出的提示
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
