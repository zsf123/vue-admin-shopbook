<!-- 布局页面 -->
<template>
  <div :class="classObj" class="app-wrapper">
    <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside"/>
		<!-- 左侧侧边栏 -->
    <sidebar class="sidebar-container"/>
		
		<!-- 右边区域 -->
    <div class="main-container">
			<!-- 导航栏 -->
      <navbar/>
			
			<!-- 标签栏 -->
			<tags-view/>
			
			<!-- 内容显示区：点击路由时，将组件渲染到这里面的router-view标签--> 
      <app-main/>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain,TagsView} from './components'
import ResizeMixin from './mixin/ResizeHandler'

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
		TagsView
  },
  mixins: [ResizeMixin],
  computed: {//计算属性是当return后面的值改变了，sidebar值将改变
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === 'mobile'
      }
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch('CloseSideBar', { withoutAnimation: false })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  @import "src/styles/mixin.scss";
  .app-wrapper {
    @include clearfix;
    position: relative;
    height: 100%;
    width: 100%;
    &.mobile.openSidebar{
      position: fixed;
      top: 0;
    }
  }
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
</style>
