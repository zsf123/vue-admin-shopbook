<template>
	<div>
		<!-- prop（类型string）对应list中每个对象列内容的字段名，也可以使用 property 属性 -->
		<!-- <el-table-column  label="姓名" align="center" width="120"> -->
		<!-- 这里的scope相当于data数组的每一行数据，重命名了 
				* 包裹在slot-scope中的内容是之后插槽填充的内容
				* v-loading-->
		<el-table :data="list" style="width: 100%" row-key="id" v-loading="loadingflag" element-loading-text="loading"
		 element-loading-spinner="el-icon-loading" element-loading-background="rgba(f,f,f,0.8)" border fit
		 highlight-current-row>
			<el-table-column :label="$t('table.avatar')" align="center" width="80">
				<template slot-scope="scope">
					<img :src="scope.row.avatar_url" alt="图片" style="width:50px;height:50px;">
				</template>
			</el-table-column>
			<el-table-column :label="$t('table.userName')" align="center" width="80" prop="username">
			</el-table-column>
			<el-table-column :label="$t('table.age')" align="center" width="50" prop="age">
			</el-table-column>
			<el-table-column :label="$t('table.sex')" align="center" width="50" prop="sex">
			</el-table-column>
			<el-table-column :label="$t('table.nickName')" align="center" width="80" prop="nickname">
			</el-table-column>
			<el-table-column :label="$t('table.phone')" align="center" width="110" prop="phone">
			</el-table-column>
			<el-table-column :label="$t('table.email')" align="center" width="160" prop="email">
			</el-table-column>
			<el-table-column :label="$t('table.qq')" align="center" width="100" prop="qq">
			</el-table-column>
			<el-table-column :label="$t('table.status')" align="center" width="90">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.status==1">{{$t('table.enabled')}}</el-tag>
					<el-tag v-if="scope.row.status==0" type="info">{{$t('table.disabled')}}</el-tag>
					<!-- <el-button type="primary" v-if="scope.row.status==1" size="mini" plain>已启用</el-button>
					<el-button type="info" v-if="scope.row.status==0" size="mini" plain>未启用</el-button> -->
				</template>
			</el-table-column>
			<el-table-column :label="$t('table.createDate')" align="center" width="160" prop="create_date" :formatter="common.formatDate">
			</el-table-column>
			<el-table-column :label="$t('table.updateDate')" align="center" width="160" prop="update_date" :formatter="common.formatDate">
				<!-- <template slot-scope="scope">
					<span>{{ scope.row.update_date | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
				</template> -->
			</el-table-column>
			<el-table-column :label="$t('table.operate')" align="center" width="180">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>

					<el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" v-if="scope.row.username!='admin'">{{$t('table.delete')}}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- //分页
		* current-page	当前页数，支持 .sync 修饰符
		* page-sizes	每页显示个数选择器的选项设置
		* page-size	 每页显示条目个数，支持 .sync 修饰符 
		* layout	组件布局，子组件名用逗号分隔-->
		<!-- <el-pagination style="margin: 20px 0;float: right;" @current-change="pageCurrentChange" :current-page="currentPage"
		 :page-sizes="[5,10,15,20]" :page-size="5" layout="total, sizes, prev, pager, next, jumper" :total="count">
		</el-pagination> -->
		<!-- 使用自己封装的分页 @pagination接收子组件pagination事件
		* page的改变代表当前页改变了，limit代表每页记录数的改变
		* 这里的查询方法还要自己查询-->
		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"
		 style="float:right;" />



		<!-- 编辑对话框 -->
		<el-dialog :title="$t('table.edit')" :visible.sync="dialogFormVisible">
			<!-- rules表单验证规则 model表单对象  label-position	表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width 
			* 这里的temp值通过点击编辑时等待参数传递过来-->
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="80px" style="width: 400px; margin-left:30px;">
				<!--label标签文本  -->
				<el-form-item :label="$t('table.userName')" v-focus="true" prop="username">
					<el-input v-model="temp.username" />
				</el-form-item>
				<el-form-item :label="$t('table.age')" prop="age" required>
					<el-input v-model="temp.age" />
				</el-form-item>
				<el-form-item :label="$t('table.sex')" prop="sex">
					<!-- v-modal绑定的值等于label的值代表选中 -->
					<el-radio v-model="temp.sex" label="男">{{$t('table.male')}}</el-radio>
					<el-radio v-model="temp.sex" label="女">{{$t('table.female')}}</el-radio>
				</el-form-item>
				<el-form-item :label="$t('table.nickName')" prop="nickname" required>
					<el-input v-model="temp.nickname" />
				</el-form-item>
				<el-form-item :label="$t('table.phone')" prop="phone" required>
					<el-input v-model="temp.phone" />
				</el-form-item>
				<el-form-item :label="$t('table.email')" prop="email" required>
					<el-input v-model="temp.email" />
				</el-form-item>
				<el-form-item :label="$t('table.qq')" prop="qq" required>
					<el-input v-model="temp.qq" />
				</el-form-item>
				<el-form-item :label="$t('table.status')" prop="status">
					<el-switch v-model="temp.status">
					</el-switch>
				</el-form-item>
				<el-form-item :label="$t('table.avatar')" prop="avatar_url">
					<!--上传头像之前要进行判断图片格式和大小  
					* show-file-list	是否显示已上传文件列表
					* on-preview	点击文件列表中已上传的文件时的钩子
					* on-remove	文件列表移除文件时的钩子
					* on-success	文件上传成功时的钩子
					* on-change	文件状态改变时的钩子，
					* 添加文件、上传成功和上传失败时都会被调用
					* on-exceed	文件超出个数限制时的钩子
					* limit	最大允许上传个数
					* before-upload	上传文件之前的钩子，
					* 参数为上传的文件，若返回 false 或者返回 Promise 且被 reject，则停止上传。
					* file-list	上传的文件列表, 例如: [{name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg'}]-->
					<el-upload class="avatar-uploader" action="/uploadFile/file" list-type="picture-card" :auto-upload="false"
					 :show-file-list="true" :before-upload="beforeAvatarUpload" :on-preview="handleImgList" :on-remove="handleRemove"
					 :on-change="handleChange" :file-list="imgList" :on-success="handleAvatarSuccess" :on-exceed="handleExceed" :limit=1>
						<i class="el-icon-plus avatar-uploader-icon"></i>
					</el-upload>
					<el-dialog :visible.sync="dialogVisible">
						<img width="100%" :src="dialogImageUrl" alt="大图">
					</el-dialog>
				</el-form-item>
				<el-form-item :label="$t('table.role')" prop="roles">
					<el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">{{$t('table.selectAll')}}</el-checkbox>
					<el-checkbox-group v-model="checkedRoles" @change="handleCheckedRolesChange">
						<!-- roleList是循环显示的总列表 -->
						<el-checkbox v-for="role in roleList" :label="role" :key="role">{{role}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item :label="$t('table.remark')" prop="remark">
					<el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
				</el-form-item>
			</el-form>
			<!-- @click.stop 阻止事件冒泡
			* @click.prevent 阻止事件的默认行为 -->
			<div slot="footer" class="dialog-footer">
				<!-- 点击编辑的时候当前的temp就变成了当前的编辑框的值
				* v-bind指令用于设置HTML属性：v-bind:href  缩写为 :href
					v-on 指令用于绑定HTML事件 ：v-on:click 缩写为 @click -->
				<el-button type="primary" @click="submitForm">{{$t('table.save')}}</el-button>
				<el-button @click="resetDataformStatus('temp')">{{$t('table.cancel')}}</el-button>
			</div>
		</el-dialog>
	</div>

</template>

<script>
	import {
		selectAllUser,
		updateUserDelflag,
		saveUserinfo
	} from '@/api/user.js' //根据需要导入查询方法，{}里面是各个方法名
	import {
		selectAllRole,
		selectRoleByUserId
	} from '@/api/role.js'
	import {
		parseTime,
		formatDate
	} from '@/utils' //对日期进行格式化
	import Pagination from '@/components/Pagination' //引入自定义分页插件

	// arr to obj ,such as { CN : "China", US : "USA" }
	export default {
		components: {
			Pagination
		},//引入分页组件
		data() {
			// 编写校验规则的方法
			// 校验手机号
			var checkPhone = (rule, value, callback) => {
				// 手机号为11位，且为数字，且为固定的开头
				const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/
				if (!value) {
					return callback(new Error('手机号不能为空'))
				}
				setTimeout(() => {
					// Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
					// 所以我就在前面加了一个+实现隐式转换
					if (!Number.isInteger(+value)) {
						callback(new Error('请输入数字值'))
					} else {
						if (phoneReg.test(value)) {
							callback()
						} else {
							callback(new Error('手机号格式不正确'))
						}
					}
				}, 100)
			};
			var checkEmail = (rule, value, callback) => {
				const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
				if (!value) {
					return callback(new Error('邮箱不能为空'))
				}
				setTimeout(() => {
					if (mailReg.test(value)) {
						callback()
					} else {
						callback(new Error('请输入正确的邮箱格式'))
					}
				}, 100)
			};
			// 校验年龄
			var checkage = (rule, value, callback) => {
				if (!value) {
					return callback(new Error('年龄不能为空'))
				}
				setTimeout(() => {
					// Number.isInteger是es6验证数字是否为整数的方法,但是我实际用的时候输入的数字总是识别成字符串
					// 所以我就在前面加了一个+实现隐式转换
					if (!Number.isInteger(+value)) {
						callback(new Error('请输入数字值'))
					} else {
						callback()
					}
				}, 100)
			};
			return {
				//表格开始所处加载状态是否显示
				loadingflag: false,  
				
				// 分页
				total: 0, //总数
				currentPage: 1,
				listQuery: {
					page: 1,
					limit: 5
				},//查询条件,这里的值会根据之后手动操作分页表而改变
				
				list: null, //打开页面显示的用户列表
				// 点击编辑页面显示信息
				temp: {
					id: undefined,
					username: '',
					age: '',
					phone: '',
					email: '',
					qq: '',
					nickname: '',
					remark: '',
					status: true,
					avatar_url: '',
					checkedRoles:[]//选中的角色列表
				},

				// 编辑对话框是否显示
				dialogFormVisible: false,

				// 对话框处于什么状态：如edit,publish
				dialogStatus: '',
				dialogVisible: false,
				img_url: "", //提交头像
				dialogImageUrl: '', //大图片
				// 显示的图片格式列表，这里只显示一个,将每个avatar_url赋值给url
				imgList: [{
					url: ''
				}],

				// 编辑表单项校验规则
				rules: {
					username: [{
							required: true,
							message: '请输入用户名',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 8,
							message: '长度在 1 到 8 个字符',
							trigger: 'blur'
						}
					],
					age: [{
							required: true,
							message: '年龄不能为空',
							trigger: 'blur'
						},
						{
							validator: checkage,
							trigger: 'blur'
						}
					],
					phone: [{
							required: true,
							message: '手机号不能为空',
							trigger: 'blur'
						},
						{
							validator: checkPhone,
							trigger: 'blur',
						}
					],
					email: [{
							required: true,
							message: '请输入邮箱地址',
							trigger: 'blur'
						},
						{
							validator: checkEmail,
							trigger: 'blur'
						}
					],
					nickname: [{
							required: true,
							message: '请输入昵称',
							trigger: 'blur'
						},
						{
							min: 1,
							max: 8,
							message: '长度在 1 到 8 个字符',
							trigger: 'blur'
						}
					],

				},
				
				// 角色
				checkAll: false, //一开始全选按钮未全选
				roleList: [], //角色列表
				checkedRoles: [], //默认选中的角色列表
				isIndeterminate: true //indeterminate不确定的
			}
		},
		created() {
			// 页面一打开就查询所有用户信息显示
			this.getList()
		},
		methods: {
			getList() {
				let that = this;
				that.loadingflag = true; //显示加载状态
				// 查询所有用户信息
				console.log("that.listQuery: " + JSON.stringify(that.listQuery))
				selectAllUser(that.listQuery).then((response) => {
					var data = response.data.user;
					that.list = data;
					that.total = response.data.totalcount;
					// 关闭加载状态，模拟请求时间
					setTimeout(() => {
						that.loadingflag = false
					}, 1.5 * 1000)
				}).catch(error => {
					console.log(error)
				})
			},
			// 处理编辑
			handleUpdate(row) {
				let that = this;
				// 复制row的值到temp中还有{}中
				this.temp = Object.assign({}, row)
				// 处理是否启用开关
				if (this.temp.status == 1) {
					this.temp.status = true;
				} else if (this.temp.status == 0) {
					this.temp.status = false;
				}
				// 处理图片显示
				this.imgList[0].url = this.temp.avatar_url;
				console.log("每次点击都执行" + this.imgList[0].url);
				this.dialogStatus = 'edit';
				this.dialogFormVisible = true;

				// 查询出所有角色列表
				selectAllRole().then((res) => {
					var roles = res.data.role;
					that.roleList = [];
					for (var i = 0; i < roles.length; i++) {
						that.roleList.push(roles[i].description);
					}
				})
				// 查询出当前点击编辑的用户的角色
				selectRoleByUserId(row.id).then((res) => {
					var roleList = res.data.roles;
					that.temp.checkedRoles=that.checkedRoles = [];
					for (var i = 0; i < roleList.length; i++) {
						that.checkedRoles.push(roleList[i].description);
					}
					that.temp.checkedRoles=that.checkedRoles;
				})
				this.$nextTick(() => { //DOM更新是异步的
					this.$refs['dataForm'].clearValidate();
				})
			},
			// 点击取消编辑按钮
			resetDataformStatus(name) {
				this.$nextTick(() => { //DOM更新是异步的
					this.$refs[name].resetFields();
				});
				this.dialogFormVisible = false;
			},
			// 根据id删除用户
			handleDelete(id) {
				this.$confirm('确定要删除该用户信息吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 删除操作
					updateUserDelflag(id).then((response) => {
						console.log(response);
						var res = response.data;
						if (res.code == 200) {
							this.$message({
								type: 'success',
								message: '删除成功!'
							});
							// 更新页面
							this.getList();
						} else if (res.code == 500) {
							this.$message.error('服务器错误!');
						}
					})
				}).catch(() => {
					this.$refs['dataForm'].resetFields();
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			// 对上传图片的限制
			beforeAvatarUpload(file) {
				const isJPG = file.type === 'image/jpeg';
				const isLt2M = file.size / 1024 / 1024 < 2;

				if (!isJPG) {
					this.$message.error('上传头像图片只能是 JPG 格式!');
				}
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
				}
				return isJPG && isLt2M;
			},
			// 文件上传成功时调用的方法
			handleAvatarSuccess(res, file) {
				this.temp.avatar_url = file.raw;
				this.imgList[0].url = this.temp.avatar_url;
				this.$message({
					type: 'success',
					message: '上传成功!'
				});
			},
			//选择图片
			handleChange(file, fileList) {
				console.log(file.raw)
				this.imgList[0].url = file.raw
			},
			//移除图片
			handleRemove(file, fileList) {
				this.imgList[0].url = ''
			},
			//点击图片列表，查看大图片
			handleImgList(file) {
				console.log("大图片为：" + file.url);
				this.dialogImageUrl = file.url;
				this.dialogVisible = true;
			},
			//超出图片个数限制时调用的方法
			handleExceed(files, fileList) {
				this.$message({
					message: "只能上传一个头像",
					type: 'warning'
				});
			},
			// 提交表单，保存修改的数据
			submitForm() {
				// 每次获取的temp都是编辑哪一个用户对象的信息
				/*保存修改的数据this.imgList[0].url是file对象 lastModified: 1559977782942
					lastModifiedDate: Sat Jun 08 2019 15:09:42 GMT+0800 (中国标准时间) {}
					name: "7.jpg"
					size: 16904
					type: "image/jpeg"
					uid: 1560270171323
					webkitRelativePath: "" 
					* */
				if (this.imgList[0].url.name!=undefined) {
					this.temp.avatar_url = "http://localhost:3000/public/images/" + this.imgList[0].url.name; //将新提交的图片地址存入当前对象中
				}
				// 保存选中的角色
				this.temp.checkedRoles=this.checkedRoles;
				saveUserinfo(JSON.stringify(this.temp)).then(res => {
					var data = res.data;
					if (data.code == 200) {
						// 保存成功后跳转到用户列表页
						setTimeout(() => {
							this.dialogFormVisible = false;
							this.getList()
						}, 1500)

						this.$message({
							message: data.msg,
							type: 'success'
						});
					}
				})
			},
			// 角色的全选,点击全选
			handleCheckAllChange(val) {
				 //这里的val代表点击全选按钮的true或false
				 //如果点击了全选就将默认所有角色选中，如果点击了非全选就将默认角色设置为空
				this.checkedRoles = (val ? this.roleList : []);
				this.temp.checkedRoles=this.checkedRoles;
				this.isIndeterminate = false;
			},
			// 子复选框状态点击决定全选复选框的状态
			handleCheckedRolesChange(value) {
				let checkedCount = value.length; //这里的value值代表选中角色连带之前默认的选中的值
				this.checkAll = checkedCount === this.roleList.length; //如果选中的这个复选框选中，则选中的个数等于全部的复选框个数，那么全选按钮选中
				this.isIndeterminate = checkedCount > 0 && checkedCount < this.roleList.length;
			}
		}
	}
</script>

<style>
	.avatar-uploader .el-upload {
		border: 1px dashed #d9d9d9;
		border-radius: 6px;
		cursor: pointer;
		position: relative;
		overflow: hidden;
	}

	.avatar-uploader .el-upload:hover {
		border-color: #409EFF;
	}

	.avatar-uploader-icon {
		font-size: 28px;
		color: #8c939d;
		width: 80px;
		height: 80px;
		line-height: 80px;
		text-align: center;
	}

	.avatar {
		width: 80px;
		height: 80px;
		display: block;
	}
</style>
