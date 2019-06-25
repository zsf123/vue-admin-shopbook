import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: 'noredirect'           if `redirect:'noredirect'` will no redirect in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if false, the item will hidden in breadcrumb(default is true)
  }
**
*/
export const constantRouterMap = [

	// 这下面的路径匹配，都是从上到下依次匹配的，找到第一个为准
	{
		path: '/login',
		component: () => import('@/views/login/index'),
		hidden: true //不在左侧侧边栏显示
	},
	{
		path: '/404',
		component: () => import('@/views/404'),
		hidden: true
	},
	// 首页
	{
		path: '/',
		component: Layout, //这里渲染app.vue中的router-view
		redirect: '/home', //设置这个代表在面包屑导航时，可以点击该路径导航回来，如果没有代表在面包屑上不能导航
		hidden: false,
		children: [{
			path: 'home',
			name: 'Home',
			component: () => import('@/views/dashboard/index'), //这里渲染Layout组件中的router-view
			meta: {
				title: 'home'
			}
		}]
	},
	{
		path: '/systemSetting',
		component: Layout, //父组件
		redirect: 'noredirect',
		/*  name必须设置，因为它是保持<keep-alive>，
		 *  <keep-alive>是Vue的内置组件，能在组件切换过程中将状态保留在内存中，
		 *  防止重复渲染DOM
		 *  <keep-alive>缓存的页面
			<router-view v-if="$route.meta.keepAlive"></router-view>
			</keep-alive>
			<router-view v-if="!$route.meta.keepAlive"></router-view>不缓存的页面
			meta: { keepAlive: true },//当前的.vue文件需要缓存
		 */
		name: 'SystemSetting',
		meta: {
			// auth:true,代表需要判断登录状态
			title: 'systemSetting', //将会显示在面包屑上
			/*  这里图标的名称在icon->svg文件夹里（这个文件夹的svg文件名称都是自定义的，
			 *  图标的svg代码是在iconfont上面加入购物车，下载素材下载下来的）
			 */
			icon: 'system'
		},
		children: [{
				path: 'userManagement', //子路劲
				name: 'UserManagement',
				//组件懒加载，这里的组件将来会渲染到layout里面的router-view里面
				component: () => import('@/views/system/user/index'),
				//meta: { title: '用户管理', icon: 'tree' }icon是图标
				meta: {
					title: 'userManagement' //将会显示在面包屑上
				}
			},
			{
				path: 'roleManagement',
				name: 'RoleManagement',
				component: () => import('@/views/system/role/index'),
				meta: {
					title: 'roleManagement'
				}
			},
			{
				path: 'permissionManagement',
				name: 'PermissionManagement',
				component: () => import('@/views/system/user/index'),
				meta: {
					title: 'permissionManagement'
				}
			}
		]
	},
	// 个人信息
	{
		path: '/user',
		component: Layout,
		/*  name必须设置，因为它是保持<keep-alive>，
		 *  <keep-alive>是Vue的内置组件，能在组件切换过程中将状态保留在内存中，
		 *  防止重复渲染DOM
		 */
		hidden: true,
		name: 'User',
		meta: {
			title: 'personalInfo',
			icon: 'system',
		},
		children: [{
			path: 'userinfo', //子路劲
			name: 'UserInfo',
			component: () => import('@/views/system/user/userinfo'),
		}],
	},
	// 商品管理
	{
		path: '/commodityManagement',
		component: Layout,
		redirect: 'noredirect',
		name: 'CommodityManagement',
		meta: {
			title: 'commodityManagement',
			icon: 'commodity'
		},
		children: [{
				path: 'booksManagement',
				name: 'BooksManagement',
				component: () => import('@/views/commodityManagement/books/index'),
				meta: {
					title: 'booksManagement'
				},
			},
			{
				path: 'clothesManagement',
				name: 'ClothesManagement',
				component: () => import('@/views/commodityManagement/clothes/index'),
				meta: {
					title: 'clothesManagement'
				}
			}
		]
	},
	// 数据统计
	{
		path: '/dataStatistics',
		component: Layout,
		redirect: '/datainfo',
		name: 'DataStatistics',
		hidden: false,
		children: [{
			path: 'datainfo',
			name: 'DataInfo',
			component: () => import('@/views/dataStatistics/index'),
			meta: {
				title: 'dataStatistics',
				icon: 'data-statistics'
			}
		}]
	},
	{
		path: '*',
		redirect: '/404',
		hidden: true
	}
]

export default new Router({
	// mode: 'history', //后端支持可开
	scrollBehavior: () => ({
		y: 0
	}),
	routes: constantRouterMap
})
