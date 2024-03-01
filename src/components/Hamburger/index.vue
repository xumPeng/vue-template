<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <!-- SVG 图标，用于显示汉堡菜单 -->
    <!-- isActive 是从父组件 Navbar.vue 接收到的 Boolean 通过css完成旋转 -->
    <svg
      :class="{'is-active':isActive}"
      class="hamburger"
      viewBox="0 0 1024 1024"
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
    >
      <!-- SVG path 定义图标的形状 -->
      <path d="M408 442h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8zm-8 204c0 4.4 3.6 8 8 8h480c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8H408c-4.4 0-8 3.6-8 8v56zm504-486H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zm0 632H120c-4.4 0-8 3.6-8 8v56c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM142.4 642.1L298.7 519a8.84 8.84 0 0 0 0-13.9L142.4 381.9c-5.8-4.6-14.4-.5-14.4 6.9v246.3a8.9 8.9 0 0 0 14.4 7z" />
    </svg>
  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  //  将 layout文件夹中的Navbar.vue中 属性 sidebar.opened 的值传递给 Hamburger 组件的 isActive prop
  //  Hamburger 组件可以根据侧边栏的状态调整其样式为旋转180度
  //  props多用于父组件向子组件传递数据
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    // 通知父组件用户点击了汉堡菜单图标
    toggleClick() {
      // Hamburger 组件使用 this.$emit('toggleClick') 向其父组件发出一个 toggleClick 事件
      this.$emit('toggleClick') 
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 20px;
  height: 20px;
}

.hamburger.is-active {
  /* 旋转180度 */
  transform: rotate(180deg);
}
</style>
