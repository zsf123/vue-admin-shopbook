import router from './router'
import store from './store'
import NProgress from 'nprogress' // 是页面跳转是出现在浏览器顶部的进度条
import 'nprogress/nprogress.css' // 进度条样式
import {
	Message
} from 'element-ui'
import {
	getToken
} from '@/utils/auth' //从cookie中获取token信息

NProgress.configure({
	showSpinner: false
}) 

const whiteList = ['/login'] // 不重定向白名单

// 每次路由跳转前都要执行
router.beforeEach((to, from, next) => {
	// 显示进度条
	NProgress.start()
	// 从cookie中获得token,如果存在
	if (getToken()) {
		// 登录了,跳转到'/login'
		if (to.path === '/login') {
			next({
				path: '/'
			})
			NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually手动 handle it
		} else {
			// 登录了，跳转到其他页面，判断当前用户的角色
			if (store.getters.roles.length === 0) {
				// 用户第一次登录，需要拉取用户信息（包含角色的用户信息）
				store.dispatch('GetInfo').then(res => { 
					next()
				}).catch((err) => {
					store.dispatch('FedLogOut').then(() => {
						Message.error(err || 'Verification failed, please login again')
						next({
							path: '/'
						})
					})
				})
			} else {
				// 用户登录且有角色，代表已经拉取过用户信息了，不需要重复拉取
				next()
			}
		}
	} else {
		// 未登录
		// to.path位于数组中第几个位置，如果不等于-1匹配到了，跳转到登录页（未登录状态下）
		if (whiteList.indexOf(to.path) !== -1) {
			// 未登录，跳转到'/login'
			next()
		} else {
			// 未登录,想要跳转到其他页面如'/index'
			// 重定向到登录页
			next(`/login?redirect=${to.path}`)
			NProgress.done()
		}
	}
})

// 每次路由跳转后都要执行
router.afterEach(() => {
	NProgress.done() // 结束进度条
})
