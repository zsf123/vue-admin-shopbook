<template>
	<el-scrollbar wrap-class="scrollbar-wrapper">
		<!--el-menu属性介绍：
		*  collapse是否水平折叠收起菜单，这个值根据isCollapse方法触发，也就是状态值sidebar.opened的值
		* background-color菜单的背景色
		* text-color	菜单的文字颜色
		* active-text-color	当前激活菜单的文字颜色
		* collapse-transition	是否开启折叠动画 -->
		<el-menu :default-active="$route.path" :collapse="isCollapse" :background-color="variables.menuBg" :text-color="variables.menuText"
		 :active-text-color="variables.menuActiveText" :collapse-transition="false" mode="vertical">
		 <!-- 标题 -->
			<div class="top-title">
				<i class="el-icon-setting"></i>
				<span slot="title">{{ $t('system.title') }}</span>
			</div>
			<!-- 左侧边栏子组件，向子组件传对象和路劲字符串 ，向子组件传值的变量有item,base-path-->
			<sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
		</el-menu>
	</el-scrollbar>
</template>

<script>
	import {
		mapGetters
	} from 'vuex'
	import variables from '@/styles/variables.scss'
	import SidebarItem from './SidebarItem'

	export default {
		components: {
			SidebarItem
		},
// 		created() {
// 			console.log("this.$router.options.routes : "+JSON.stringify(this.$router.options.routes))
// 		},
		computed:{
			...mapGetters([
				'sidebar'//获取侧边栏展开状态是0还是1
			]),
			routes() {
				return this.$router.options.routes
			},
			variables() {
				return variables
			},
			isCollapse() {
				return !this.sidebar.opened
			}
		}
	}
</script>
<style scoped>
	/* 顶部项目名称 */
	.top-title{
		background-color:#0099cc;
		height:50px;
		line-height:50px;
		color:#000;
		text-align:center;
		font-size:16px;
		font-wight:bold;
	}
	</style>
