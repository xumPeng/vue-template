import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration 不显示旋转器

const whiteList = ['/login'] // 定义一个白名单数组（whiteList），其中的路由不需要重定向

/* 全局前置守卫，会在路由改变之前被调用
  首先启动进度条，然后设置页面标题为目标路由的 meta.title 属性（定义在router.index下面的属性中）
  接着，代码检查用户是否已经登录，这是通过检查是否存在 token 来实现的
*/
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()

  // 如果用户已经登录（即 hasToken 为真）
  if (hasToken) {
    // 检查目标路由是否为登录页。如果是，那么会重定向到首页
    if (to.path === '/login') {
      // 会重定向到首页，并结束进度条
      next({ path: '/' })
      NProgress.done()
    } else {
      // 如果已经登录且目标路由非登录页，检查是否已经获取了用户信息
      const hasGetUserInfo = store.getters.name
      if (hasGetUserInfo) {
        // 如果已经获取了用户信息，那么直接进入目标路由
        next()
      } else {
        // 尝试获取用户信息
        try {
          // 获取用户信息
          await store.dispatch('user/getInfo')

          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          // 重定向到登录页面
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* 如果用户没有登录 即hasToken 为假 */
    // 查目标路由是否在白名单中
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // 重定向到登录页
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

// 全局后置守卫，会在路由改变之后被调用
router.afterEach(() => {
  // 结束进度条
  NProgress.done()
})
