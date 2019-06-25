<!-- 中英文切换 -->
<template>
	<!-- 点击切换语言的下拉框的选项时，触发command方法 -->
	<el-dropdown trigger="click" class="international" @command="handleSetLanguage">
		<div>
			<!-- svg-icon是全局组件，这里的icon-class中的language是图标标识，不是变量,直接在Svg文件夹中保存在 -->
			<svg-icon icon-class="language" class-name="international-icon" />
			<i class="el-icon-caret-bottom" />
		</div>
		<el-dropdown-menu slot="dropdown">
			<!-- :disabled="language==='zh'"代表当前语言状态等于这个的时候就不可点击  -->
			<el-dropdown-item :disabled="language==='zh'" command="zh">
				{{$t('system.chinese')}}
			</el-dropdown-item>
			<el-dropdown-item :disabled="language==='en'" command="en">
				{{$t('system.english')}}
			</el-dropdown-item>
		</el-dropdown-menu>
	</el-dropdown>
</template>

<script>
	export default {
		computed: {
			language() {
				return this.$store.getters.language //获得当前的语言（cookie中有就从cookie中获得）,没有就是中文
			}
		},
		methods: {
			// 点击下拉选项时，触发方法，这里的参数是每个下拉项的command值
			handleSetLanguage(lang) {
				// this.$i18n有两个属性：locale（en,zh),messages
				this.$i18n.locale = lang //两个值zh,en
				// 触发设置语言操作，将当前语言改为lang,同时将lang存入cookie中
				this.$store.dispatch('setLanguage', lang)
				this.$message({
					message: '切换成功',
					type: 'success'
				})
			}
		}
	}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
	.el-icon-caret-bottom {
		font-size: 14px;
	}
</style>
