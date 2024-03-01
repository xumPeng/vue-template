<template>
  <!-- 以div包裹导航栏标签 -->
  <div class="navbar">
    <!-- 公共的 合并导航栏组件 -->
    <!-- 父组件使用computed计算属性 sidebar.opened 来控制 Hamburger 组件开启或合并的状态 -->
    <!-- 通过自定义属性的方式向子组件传递数据 isActive -->
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- 调用 toggleSideBar 方法来开启或关闭导航栏 -->

    <!-- 公共的 面包屑 封装组件 -->
    <breadcrumb class="breadcrumb-container" />

    <!-- 右侧菜单 -->
    <div class="right-menu">
      <!-- trigger	属性触发click下拉的行为 -->
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <img :src="require('@/assets/avatar.png')" class="user-avatar">
          <i class="el-icon-caret-bottom" />
        </div>
        <!-- 通过组件slot来设置下拉触发的元素，并通过具名slot为dropdown 来设置下拉式菜单
        默认情况下，即不写slot属性，下拉只要hover即可，无需点击也会显示下拉菜单 -->
        <el-dropdown-menu slot="dropdown" class="user-dropdown">

          <!-- router-link 组件是 Vue Router 提供的，它会被渲染成一个 <a> 标签 -->
          <router-link to="/"> <!-- to 属性指定链接的目标路由为主页，但是路由器分发会被redirect到/dashboard -->
            <el-dropdown-item align="center">
              主页
            </el-dropdown-item>
          </router-link>
          <!-- divided	表示在页面中显示分割线 -->
          <!-- native 修饰符表示监听的是原生 DOM 事件 -->
          <el-dropdown-item divided @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'

export default {
  name: 'Navbar',
  // 注册该组件内部可以使用的子组件
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    // 使用 mapGetters 将 Vuex store 中的 getters 映射为计算属性
    ...mapGetters([
      'sidebar', // 映射 app 模块中的 侧边栏 状态
    ])
  },
  methods: {
    // 当点击时hamburger组件，触发 Vuex 中的 action 来切换侧边栏状态
    // 调用 Vuex store 中的 app 模块(modules)下的 toggleSideBar 的 Action判断
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar') // Vuex 的格式为 'moduleName/actionName'
    },
    // 当点击时下拉菜单的 Log Out 选项，触发 Vuex 中的 action 来退出登录
    async logout() {
      // 调用 Vuex store 中的 user 模块(modules)下的 logout 的 Action
      await this.$store.dispatch('user/logout')  // Vuex 的格式为 'moduleName/actionName'
      // 使用 Vue Router 来改变当前路由，编程式导航到另一个路由
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, .08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
