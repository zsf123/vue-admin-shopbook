<template>
	<div>
	<!-- rules表单验证规则 model表单对象  label-position	表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width -->
		<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
			<!--label标签文本  -->
			<el-form-item label="姓名" prop="username">
				<el-input v-model="user.user.username" />
			</el-form-item>
			<el-form-item label="年龄" prop="age">
				<el-input v-model="user.user.age" />
			</el-form-item>
			<el-form-item label="性别" prop="sex">
				<el-input v-model="user.user.sex" />
			</el-form-item>
			<el-form-item label="昵称" prop="nickname">
				<el-input v-model="user.user.nickname" />
			</el-form-item>
			<el-form-item label="手机号" prop="phone">
				<el-input v-model="user.user.phone" />
			</el-form-item>
			<el-form-item label="邮箱" prop="email">
				<el-input v-model="user.user.email" />
			</el-form-item>
				<el-form-item label="qq" prop="qq">
				<el-input v-model="user.user.qq" placeholder="user.user.qq"/>
			</el-form-item>
			<el-form-item label="头像" prop="qq">
				<img :src="avatar" alt="图片" class="user-avatar" />
			</el-form-item>
			<el-form-item label="是否启用" prop="status">
				<el-switch v-model="user.user.status==1?true:false" >
				</el-switch>
			</el-form-item>
			<!-- <el-form-item label="备注" prop="remark">
				<el-input v-model="user.user.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
			</el-form-item> -->
		</el-form>
		<div slot="footer" class="dialog-footer">
			<el-button type="primary">修改</el-button>
			<el-button type="primary" >保存</el-button>
		</div>
		</div>
</template>

<script>
	import {
		mapGetters
	} from 'vuex' //管理全局状态
	export default {
		data() {
			return {
				list: null,
				// 点击编辑页面显示信息
				temp: {
					id: undefined,
					username: '',
					age: '',
					phone: '',
					nickname: '',
					remark: '',
					title: '',
					status: '1'
				},
				// 对话框是否显示
				dialogFormVisible: false,
				// 对话框处于什么状态：如edit,publish
				dialogStatus: '',
			}},
		
		computed: {
			// 可以直接使用全局变量
			//这里的...是超引用，ES6的语法，意思是state里有多少属性值我可以在这里放多少属性值
			...mapGetters([
				'sidebar',
				'avatar',
				'device',
				'user'
			])
		}
		}
</script>

<style>
	.user-avatar {
	/* 	//头像大小 */
		width: 80px;
		height: 80px;
		border-radius: 10px;
	}
</style>
