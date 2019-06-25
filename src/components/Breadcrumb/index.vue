<template>
	<!-- 分隔符以/ -->
	<el-breadcrumb class="app-breadcrumb" separator="/">
		<!-- 每个 <transition-group> 的子节点必须有 独立的 key ，动画才能正常工作：
			* 这里<transition-group>默认渲染为<span>标签 
			* 这里进入进出的效果是breadcrumb-enter-to,breadcrumb-enter-in-->
		<transition-group name="breadcrumb">
			<!-- 路由发生变化，就有了面包屑导航数组，第一个对象为home-->
			<el-breadcrumb-item v-for="(item,index) in levelList" :key="item.path">
				<!-- redirect代表都显示在面包屑上,但是如果当前路由不重定向即设置了noredirect，那么该路劲面包屑在点击时将不会重定向
				<!-- 无重定向，显示不能点击的样式，判断每一个路劲对象，从父路劲开始 -->
				<span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{ generateTitle(item.meta.title) }}</span>
				<a v-else @click.prevent="handleLink(item)">{{ generateTitle(item.meta.title) }}</a>
			</el-breadcrumb-item>
		</transition-group>
	</el-breadcrumb>
</template>

<script>
	import pathToRegexp from 'path-to-regexp'
import { generateTitle } from '@/utils/i18n'
	export default {
		data() {
			return {
				// 网页打开默认没有面包屑导航数组
				levelList: [{
						path: '/home',
						name: 'Home',
						meta: {
							title: 'home'
						}
					}]
			}
		},
		watch: {
			// 监听路由对象，发生变化，执行面包屑方法
			$route() {
				this.getBreadcrumb()
			}
		},
		created() {
			this.getBreadcrumb()
		},
		methods: {
			generateTitle,
			getBreadcrumb() {
				// 寻找路由中有name属性的路径
				// 这里的路径是浏览器上面的
				// 当前路径path：/example  name:Example
				// 当前路径path：/example/tree name:Tree
				// list是个数组，数组里面是一个个对象
				var list = this.$route.matched;
				for (var i = 0; i < list.length; i++) {
					console.dir("当前:"+typeof list[i]+" path：" + list[i].path + "  name:" + list[i].name);
				}
				// filter是对数组自身进行循环遍历,返回具有name属性的对象，然后组成数组
				let matched = list.filter(item => item.name)
				const first = matched[0]
				// 这里代表点击某个菜单项，就会在首页后面添加面包屑导航,
				// 这里判断home是因为默认当前浏览器地址栏从/#/开始first是/#/之后的第一个对象
				if (first && first.name !== 'Home') {
					// 变成一个大数组，数组包含多个对象，第一个为首页
					matched = [{
						path: '/home',
						name: 'Home',
						meta: {
							title: 'home'
						}
					}].concat(matched)
				}
				// 过滤出含有meta,title,breadcrumb（需要在面包屑上显示的）选项的路由对象item，this.levelList对象数组
				this.levelList = matched.filter(item => item.meta && item.meta.title && item.meta.breadcrumb !== false)
			},
			pathCompile(path) {
				// To solve this problem https://github.com/PanJiaChen/vue-element-admin/issues/561
				const {
					params
				} = this.$route
				// 由当前路劲得到正则表达式的匹配规则
				console.dir("pathToRegexp.compile(path)(params): "+pathToRegexp.compile(path)(params))
				return  pathToRegexp.compile(path)(params)
			},
			handleLink(item) {
				// 如果有重定向，就将重定向的路径重新加入到$router中
				const {
					redirect,
					path
				} = item
				if (redirect) {
					this.$router.push(redirect)
					return
				}
				// 快速获取到当前路劲
				this.$router.push(this.pathCompile(path))
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.app-breadcrumb.el-breadcrumb {
		display: inline-block;
		font-size: 14px;
		line-height: 50px;
		margin-left: 10px;

		.no-redirect {
			color: #97a8be;
			cursor: text;
		}
	}
</style>
