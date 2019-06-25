<!-- 侧边栏每一项 -->
<template>
	<!-- item是路由对象route route.hidden==false代表显示 -->
	<div v-if="!item.hidden" class="menu-wrapper">
		<!-- 没有子菜单的
		*  hasOneShowingChild判断路由是否需要在侧边栏显示-->
		<template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
			<!-- 向子组件传值 -->
			<app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
				<!-- 这里之后插入到插槽slot中 -->
				<el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
					<!-- 显示图标和内容 -->
					<item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="generateTitle(onlyOneChild.meta.title)" />
				</el-menu-item>
			</app-link>
		</template>

		<!-- 有子菜单的 -->
		<el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
			<!-- 显示图标 -->
			<template slot="title">
				<item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="generateTitle(item.meta.title)" />
			</template>
			<!-- 递归调用自身 -->
			 <sidebar-item
			   v-for="child in item.children"
			   :key="child.path"
			   :is-nest="true"
			   :item="child"
			   :base-path="resolvePath(child.path)"
			   class="nest-menu"
			 />
		</el-submenu>
	</div>
</template>

<script>
	import path from 'path'
	import {
		isExternal
	} from '@/utils/validate'
	import Item from './Item'
	import AppLink from './Link'
	import {
		generateTitle
	} from '@/utils/i18n' //路由国际化
	export default {
		name: 'SidebarItem',
		components: {
			Item,
			AppLink
		},
		// 接收父组件传值
		props: {
			// 接收父组件路由对象
			item: {
				type: Object,
				required: true
			},
			isNest: {
				type: Boolean,
				default: false
			},
			// 接收父组件路由path字符串
			basePath: {
				type: String,
				default: ''
			}
		},
		data() {
			this.onlyOneChild = null
			return {}
		},
		methods: {
			// hasOneShowingChild(item.children,item)一个父路由的子路由,这里初始化为空数组
			hasOneShowingChild(children = [], parent) {
				console.log("children : " + JSON.stringify(children)) //item.children:[{"path":"dashboard","meta":{"title":"dashboard"}}]
				//返回一个会显示在左侧栏的数组
				const showingChildren = children.filter(item => {
					console.log("item : " + JSON.stringify(item)); //item:{"path":"dashboard","meta":{"title":"dashboard"}}
					// 不在左边显示的路由，显示赋值为false代表不显示
					if (item.hidden) {
						return false
					} else {
						// 如果仅仅只有一个孩子显示
						this.onlyOneChild = item
						return true
					}
				})
				console.log("showingChildren: " + JSON.stringify(showingChildren))

				// 如果仅仅只有一个孩子路由显示，就显示孩子路由
				if (showingChildren.length === 1) {
					return true
				}
				// 如果仅仅只有一个父路由，就显示父
				if (showingChildren.length === 0) {
					this.onlyOneChild = {
						...parent,
						path: '',
						noShowingChildren: true
					}
					return true
				}
				return false
			},
			// 传入route中的children中的path
			resolvePath(routePath) {
				if (isExternal(routePath)) { //判断是否是外链
					return routePath
				}
				// path.resolve 方法会把一个路径或路径片段的序列解析为一个绝对路径
				// path.resolve([…paths])里的每个参数都类似在当前目录执行一个cd操作，从左到右执行，返回的是最后的当前目录
				// 这里如果不是外链，就将父组件传过来的path和孩子的path组成绝对路劲
				return path.resolve(this.basePath, routePath)
			},
			generateTitle
		}
	}
</script>
