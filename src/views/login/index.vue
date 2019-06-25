<template>
	<div class="login-container">
		<!-- 通过设置 label-position 属性可以改变表单域标签的位置 
		* 只需要通过 rules 属性传入约定的验证规则
		* ref="loginForm"相当于id的引用,通过this.$refs.loginForm
		* -->
		<el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">

			<h3 class="title">vue-admin-shopbook</h3>
			<el-form-item prop="username">
				<!-- 靠左 -->
				<span class="svg-container">
					<svg-icon icon-class="user" />
				</span>
				<!-- auto-complete显示之前输入过的值 -->
				<el-input v-model="loginForm.username" name="username" type="text" auto-complete="on" placeholder="username" />
			</el-form-item>
			<el-form-item prop="password">
				<!-- 靠左 -->
				<span class="svg-container">
					<svg-icon icon-class="password" />
				</span>
				<!-- @是v-on的简写 
				* native是封装组件键盘事件必须要加的，如果单独在input上面则不需要加native-->
				<el-input :type="pwdType" v-model="loginForm.password" name="password" auto-complete="on" placeholder="password"
				 @keyup.enter.native="handleLogin" />
				<span class="show-pwd" @click="showPwd">
					<!-- 这里引入了全局组件svg-icon,引入了eye和eye-open的svg -->
					<svg-icon :icon-class="pwdType === 'password' ? 'eye' : 'eye-open'" />
				</span>
			</el-form-item>
			<el-form-item>
				<!--loading加载状态标识  prevent预防默认事件 -->
				<el-button :loading="loading" type="primary" style="width:100%;" @click.native.prevent="handleLogin">
					Sign in
				</el-button>
			</el-form-item>
			<div class="tips">
				<span style="margin-right:20px;">username: admin</span>
				<span> password: admin</span>
			</div>
		</el-form>
	</div>
</template>

<script>
	import {
		isvalidUsername
	} from '@/utils/validate'

	export default {
		name: 'Login',
		data() {
			const validateUsername = (rule, value, callback) => {
				if (!isvalidUsername(value)) {
					callback(new Error('请输入正确的用户名'))
				} else {
					callback()
				}
			}
			const validatePass = (rule, value, callback) => {
				if (value.length < 5) {
					callback(new Error('密码不能小于5位'))
				} else {
					callback()
				}
			}
			return {
				loginForm: {
					username: 'admin',
					password: 'admin'
				},
				// 登录规则
				loginRules: {
					username: [{
						required: true,
						trigger: 'blur',
						validator: validateUsername //自定义校验规则
					}],
					password: [{
						required: true,
						trigger: 'blur',
						validator: validatePass
					}]
				},
				loading: false, //按钮是否处于加载状态
				pwdType: 'password',
				// 为之后判断当前登录页是否是重定向而来的
				redirect: undefined
			}
		},
		watch: {
				/* 
				 * 监听路由，路由发生改变执行方法
				 * $route是一个跳转的路由对象，每一个路由都会有一个$route对象，是一个局部的对象,对象包含name,path,params,query属性，$route.matched 数组，包含当前匹配的
				 * 路径中所包含的所有片段所对应的配置参数对象
				 * $route.router 路由规则所属的路由器（以及其所属的组件）。
				 * $router对象是全局路由的实例
				* 字符串
				*	  this.$router.push('home')
				* 对象
				*	  this.$router.push({ path: 'home' })
				* 命名的路由
				*	  this.$router.push({ name: 'user', params: { userId: 123 }})
				 *带查询参数，变成 /register?plan=123
				*	  this.$router.push({ path: 'register', query: { plan: '123' }})
				*push方法其实和<router-link :to="...">是等同的。
				*注意：push方法的跳转会向 history 栈添加一个新的记录，当我们点击浏览器的返回按钮时可以看到之前的页面。
			    *  replace
					push方法会向 history 栈添加一个新的记录，而replace方法是替换当前的页面，
					不会向 history 栈添加一个新的记录
					一般使用replace来做404页面
					this.$router.replace('/')
					* */
			$route: {
				handler: function(route) {
					console.log("路由对象有哪些属性：" + route.path);
					//布尔值
					this.redirect = route.query && route.query.redirect
					console.log("this.redirect:" + this.redirect);
				},
				immediate: true
			}
		},
		methods: {
			// 改变密码显示
			showPwd() {
				if (this.pwdType === 'password') {
					this.pwdType = ''
				} else {
					this.pwdType = 'password'
				}
			},
			// 登录按钮，点击方法
			handleLogin() {
				this.$refs.loginForm.validate(valid => {
					if (valid) {
						// 将按钮变成加载中状态
						this.loading = true
						// 触发全局登录方法：用户登录要在服务端存储用户登录信息和token值，同时返回给客户端
						// 客户端将登录用户的token和用户信息存到全局里
						this.$store.dispatch('Login', this.loginForm).then(() => {
							this.loading = false
							// 登录成功，修改 url，完成跳转
							// 走这个路由前还会拉去用户信息，通过permission.js设置的
							this.$router.push({
								path: this.redirect||'/'
							})
						}).catch(() => {
							this.loading = false
						})
					} else {
						console.log('error submit!!')
						return false
					}
				})
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss">
	$bg:#2d3a4b;
	$light_gray:#eee;

	/* reset element-ui css */
	.login-container {
		.el-input {
			display: inline-block;
			height: 47px;
			width: 85%;

			input {
				background: transparent;
				border: 0px;
				-webkit-appearance: none;
				border-radius: 0px;
				padding: 12px 5px 12px 15px;
				color: $light_gray;
				height: 47px;

				&:-webkit-autofill {
					-webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
					-webkit-text-fill-color: #fff !important;
				}
			}
		}

		.el-form-item {
			border: 1px solid rgba(255, 255, 255, 0.1);
			background: rgba(0, 0, 0, 0.1);
			border-radius: 5px;
			color: #454545;
		}
	}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
	$bg:#2d3a4b;
	$dark_gray:#889aa4;
	$light_gray:#eee;

	.login-container {
		position: fixed;
		height: 100%;
		width: 100%;
		background-color: $bg;

		.login-form {
			position: absolute;
			left: 0;
			right: 0;
			width: 520px;
			max-width: 100%;
			padding: 35px 35px 15px 35px;
			margin: 120px auto;
		}

		.tips {
			font-size: 14px;
			color: #fff;
			margin-bottom: 10px;

			span {
				&:first-of-type {
					margin-right: 16px;
				}
			}
		}

		.svg-container {
			padding: 6px 5px 6px 15px;
			color: $dark_gray;
			vertical-align: middle;
			width: 30px;
			display: inline-block;
		}

		.title {
			font-size: 26px;
			font-weight: 400;
			color: $light_gray;
			margin: 0px auto 40px auto;
			text-align: center;
			font-weight: bold;
		}

		.show-pwd {
			position: absolute;
			right: 10px;
			top: 7px;
			font-size: 16px;
			color: $dark_gray;
			cursor: pointer;
			user-select: none;
		}
	}
</style>
