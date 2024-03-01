import Vue from 'vue'
import Router from 'vue-router'

// 使用路由器插件
Vue.use(Router)

/* Layout 
  有了Layout这个组件，侧边栏或者导航栏独立于你的主题页面呈现
  不会随着你主体内容的变化而变化
*/
import Layout from '@/layout'

/*
// hidden: true // (默认 false)
当设置 true 的时候该路由不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1

redirect: 'noRedirect'
//当设置 noRedirect 的时候该路由在面包屑导航中不可被点击

alwaysShow: true
// 当一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
// 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
// 若想不管路由下面的 children 声明的个数都显示根路由
// 可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由


name: 'router-name' // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
meta: {
  roles: ['admin', 'editor'] // 设置该路由进入的权限，支持多个权限叠加
  title: 'title' // 设置该路由在侧边栏和面包屑中展示的名字
  icon: 'svg-name' // 设置该路由的图标，支持 svg-class，也支持 el-icon-x element-ui 的 icon
  noCache: true // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  breadcrumb: false //  如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)
  affix: true // 如果设置为true，它则会固定在tags-view中(默认 false)

  // 当路由设置了该属性，则会高亮相对应的侧边栏。
  // 这在某些场景非常有用，比如：一个文章的列表页路由为：/article/list
  // 点击文章进入文章详情页，这时候路由为/article/1，但想在侧边栏高亮文章列表的路由，就可以进行如下设置
  activeMenu: '/article/list'
}
*/

/*
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  // No layout
  {
    // 登录页面
    path: '/login',
    component: () => import('@/views/login/index'), // 路由懒加载
    hidden: true // 当设置 true 的时候该路由不会在侧边栏出现
  },

  {
    // 404页面
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true // 当设置 true 的时候该路由不会在侧边栏出现
  },

  // Have layout
  // 有了Layout这个组件，侧边栏或者导航栏独立于你的主题页面呈现
  // 不会随着你主体内容的变化而变化
  {
    // 主页
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    // Layout只有一个children时，会将那个子路由当做根路由显示在侧边栏--如首页
    // 这里开始对应的路由都会显示在app-main中
    children: [{
      path: 'dashboard',
      name: 'Dashboard', // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'el-icon-s-home' }
    }]
  },
  // 重定向
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path*',
        component: () => import('@/views/redirect/index')
      }
    ]
  },

  {
    path: '/upload',
    component: Layout,
    children: [
      {
        path: '',
        name: 'upload',
        component: () => import('@/views/upload/index'),
        meta: { title: '上传文件', icon: 'el-icon-upload' }
      }
    ]
  },

  {
    path: '/settings',
    component: Layout,
    children: [
      {
        path: '',
        name: 'settings',
        component: () => import('@/views/settings'),
        meta: { title: '设置归类', icon: 'el-icon-setting' }
      }
    ]
  },

  {
    path: '/table',
    component: Layout,
    children: [
      {
        path: '',
        name: 'table',
        component: () => import('@/views/table/index'),
        meta: { title: '表格数据', icon: 'el-icon-document' }
      },
      {
        path: '/table/detail/:id',
        name: 'AssessmentDetail',
        component: () => import('@/views/table/AssessmentDetail'),
        meta: { title: '详细信息', icon: 'el-icon-info' },
        hidden: true
      },
      {
        path: 'training',
        name: 'TrainingAnalysis',
        component: () => import('@/views/table/TrainingAnalysis'),
        meta: { title: '培训概况', icon: 'el-icon-s-data' },
        hidden: true // 该路由不会在侧边栏出现
      }
    ]
  },

  // {
  //   path: '/example',
  //   component: Layout,
  //   redirect: '/example/table',
  //   name: 'Example',
  //   meta: { title: '进阶数据分析', icon: 'el-icon-s-help' },
  //   // 当一个Layout路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如Example页面
  //   children: [
  //     {
  //       path: 'table',
  //       name: 'Table',
  //       component: () => import('@/views/table/index'),
  //       meta: { title: '表格', icon: 'table' }
  //     },
  //     {
  //       path: 'tree',
  //       name: 'Tree',
  //       component: () => import('@/views/tree/index'),
  //       meta: { title: '相关性分析', icon: 'tree' }
  //     }
  //   ]
  // },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

// 定义一个函数来创建新的Router实例
const createRouter = () => new Router({
  // mode: 'history'
  // history 需要服务器的支持，被注释掉代表现在使用默认的hash模式
  scrollBehavior: () => ({ y: 0 }), // 滚动条距离顶部为0
  routes: constantRoutes // 所有路由进行注册
})

// 创建Router实例
const router = createRouter()

// 详情见：https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // 重置路由
}

export default router
