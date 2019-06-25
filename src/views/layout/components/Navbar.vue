<template>
	<div class="navbar">
		<!-- 汉堡菜单，点击展开和关闭：toggle-click传方法toggleSideBar给子组件，传样式is-active的状态sidebar.opened给子组件
		* 这里的两个值获取的是全局状态里的值 
		* 因为v-bind（简写：)绑定的是标签属性，如果自定义则是向子组件传值
		*汉堡菜单初始状态值is-active，点击事件toggle-click改变侧边栏状态值
		* is-active是hanburger组件的属性，带：是因为它要绑定变量
		* -->
		<hamburger :toggle-click="toggleSideBar" :is-active="sidebar.opened" class="hamburger-container" />

		<!-- 面包屑导航-->
		<breadcrumb />

		<!-- 顶部右边菜单 -->
		<div class="right-menu">

			<!-- 如果设备不是一个移动设备的话：国际化 ：导入了一个下拉选择中英文菜单:-->
			<!-- <template v-if="device!=='mobile'"> -->
			<lang-select class="hover-effect" />
			<!-- </template> -->

			<!-- 点击el-dropdown里面的内容，el-dropdown-menu里面的内容就会打开 -->
			<el-dropdown class="avatar-container" @command="handleCommand" trigger="click">
				<!-- 用户头像 -->
				<div class="avatar-wrapper">
					<!-- v-on：绑定变量 -->
					<span style="font-size:16px;">{{user.user.nickname}}</span>
					<img :src="avatar" alt="图片" class="user-avatar">
					<i class="el-icon-caret-bottom" />
				</div>


				<el-dropdown-menu slot="dropdown" class="user-dropdown">
					<router-link to="/">
						<el-dropdown-item>
							   {{ $t('navbar.dashboard') }}
						</el-dropdown-item>
					</router-link>
					<router-link to="/user/userinfo">
						<el-dropdown-item>
							   {{ $t('navbar.personalInfo') }}
						</el-dropdown-item>
					</router-link>
					<el-dropdown-item divided command="logout">
						 {{ $t('navbar.logOut') }}
					</el-dropdown-item>
				</el-dropdown-menu>
			</el-dropdown>
		</div>
	</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex' //管理全局状态
	import Hamburger from '@/components/Hamburger' //汉堡包组件
	import Breadcrumb from '@/components/Breadcrumb' //面包屑组件
	import LangSelect from '@/components/LangSelect' //导入语言选择组件，这里有两种语言，中文和英文
	export default {
		components: {
			Breadcrumb,
			Hamburger,
			LangSelect
		},
		computed: {
			// 可以直接使用全局变量
			//这里的...是超引用，ES6的语法，意思是state里有多少属性值我可以在这里放多少属性值
			...mapGetters([
				'sidebar',
				'avatar',
				'device',
				'user'
			])
		},
		methods: {
			/* dispatch：含有异步操作，例如向后台提交数据，写法： this.$store.dispatch('action方法名',值)
				commit：同步操作，写法：this.$store.commit('mutations方法名',值) */
			toggleSideBar() {
				// 调用全局方法改变侧边栏状态值
				this.$store.dispatch('ToggleSideBar')
			},
			// 处理个人信息和退出
			handleCommand(e) {
				let that = this;
				if (e == 'logout') {
					this.$confirm('是否退出此账号?', '提示', {
							confirmButtonText: '确定',
							cancelButtonText: '取消',
							type: 'warning'
						})
						.then(() => {
							this.$store.dispatch('LogOut').then((res) => {
								// location.reload() // 为了重新实例化vue-router对象 避免bug
								// 登录成功，修改 url，完成跳转
								console.log("退出登录响应结果：" + res)
								this.$router.push({
									path: '/login'
								})
							})
						})
						.catch(() => {});
				}
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.navbar {
		height: 50px;
		line-height: 50px;
		box-shadow: 0 1px 3px 0 rgba(0, 0, 0, .12), 0 0 3px 0 rgba(0, 0, 0, .04);

		.hamburger-container {
			line-height: 58px;
			height: 50px;
			float: left;
			padding: 0 10px;
		}

		.right-menu {
			float: right;
			height: 100%;
			line-height: 50px;

			&:focus {
				outline: none;
			}


		}

		// 国际化
		.hover-effect {
			display: inline-block;
			position: absolute;
			right: 180px;
			font-size: 40px; //可以设置图标的大小
			cursor: pointer;
			transition: background .3s;
		}

		.hover-effect:hover {
			background: rgba(0, 0, 0, .025)
		}

		.avatar-container {
			//头像和下拉菜单容器
			height: 50px;
			display: inline-block;
			position: absolute;
			// top:-8px;
			right: 35px;
			&:hover {
				background: rgba(0, 0, 0, .025)
			}

			.avatar-wrapper {
				//包含头像和下拉图标
				cursor: pointer;
				margin-top: 5px;
				 padding-bottom:35px;

				.user-avatar {
					//头像大小
					width: 40px;
					height: 40px;
					border-radius: 10px;
				}

// 				.el-icon-caret-bottom {
// 					//下拉图标：绝对定位
// 					position: absolute;
// 					right: -20px;
// 					top: 25px;
// 					font-size: 12px;
// 				}
			}
		}
	}
</style>
