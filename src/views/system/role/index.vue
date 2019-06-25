<template>
	<div>
		<el-table :data="list" style="width: 100%" row-key="id" v-loading="loadingflag" element-loading-text="loading"
		 element-loading-spinner="el-icon-loading" element-loading-background="rgba(f,f,f,0.8)" border fit
		 highlight-current-row>
			<el-table-column :label="$t('table.roleName')" align="center" width="180" prop="name">
			</el-table-column>
			<el-table-column :label="$t('table.roleDescription')" align="center" width="180" prop="description">
			</el-table-column>
			<el-table-column :label="$t('table.status')" align="center" width="160">
				<template slot-scope="scope">
					<el-tag v-if="scope.row.enabled==1">{{$t('table.enabled')}}</el-tag>
					<el-tag v-if="scope.row.enabled==0" type="info">{{$t('table.disabled')}}</el-tag>
				</template>
			</el-table-column>
			<el-table-column :label="$t('table.addDate')" align="center" width="180" prop="add_date" :formatter="common.formatDate">
			</el-table-column>
			<el-table-column :label="$t('table.updateDate')" align="center" width="180" prop="update_date" :formatter="common.formatDate">
			</el-table-column>
			<el-table-column :label="$t('table.operate')" align="center" width="300">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
					<el-button type="primary" size="mini" @click="handleMenu(scope.row)">{{$t('table.permission')}}</el-button>
					<el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" v-if="scope.row.name!='ADMIN'">{{$t('table.delete')}}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页组件 -->
		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"
		 style="float:right;" />
		 
		<!-- 编辑对话框 -->
		<el-dialog :title="$t('table.edit')" :visible.sync="dialogFormVisible">
			<!-- rules表单验证规则 model表单对象  label-position	表单域标签的位置，如果值为 left 或者 right 时，则需要设置 label-width -->
			<el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
				<!-- 这里的prop是表单model中的temp中的字段 表单域中显示的是prop字段-->
				<el-form-item :label="$t('table.role')" prop="name">
					<el-input v-model="temp.name" />
					<!-- <el-select v-model="name" placeholder="name">
						<el-option v-for="item in rolenameList" :key="item" :label="item" :value="item">
						</el-option>
					</el-select> -->
				</el-form-item>
				<el-form-item  :label="$t('table.roleDescription')" prop="description">
					<el-input v-model="temp.description" />
				</el-form-item>
				<el-form-item :label="$t('table.status')" prop="enabled">
					<el-switch v-model="temp.enabled">
					</el-switch>
				</el-form-item>
				<el-form-item :label="$t('table.remark')" prop="remark">
					<el-input v-model="temp.remark" :autosize="{ minRows: 2, maxRows: 4}" type="textarea" placeholder="Please input" />
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="submitForm">{{$t('table.save')}}</el-button>
				<el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import {
		selectAllRole,
		selectUserRole,
		updateRoleDelflag
	} from '@/api/role.js' //根据需要导入查询方法，{}里面是各个方法名
	import {
		formatDate
	} from '@/utils'//格式化日期
	
	import Pagination from '@/components/Pagination' //引入自定义分页插件
	export default {
		components: {
			Pagination
		},//引入分页组件
		data() {
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
				list: null, //查询到的角色列表
				
				// 编辑框要显示的角色信息列表
				temp: {
					id: undefined,
					name: '',
					description: '',
					enabled: '',
					add_date: '',
					update_date: '',
					remark: ''
				},
				// 编辑对话框是否显示
				dialogFormVisible: false
			}
		},
		created() {
			// 页面一打开就查询所有角色信息显示
			this.getList()
		},
		methods: {
			getList() {
				let that = this;
				that.loadingflag = true; //显示加载状态
				// 查询所有角色信息
				selectAllRole(that.listQuery).then((response) => {
					var data = response.data.role;
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
				// 复制row的值到temp中还有{}中
				this.temp = Object.assign({}, row)
				this.dialogStatus = 'edit'
				this.dialogFormVisible = true
				this.$nextTick(() => {
					this.$refs['dataForm'].clearValidate()
				})
			},
			// 根据id删除角色
			handleDelete(id) {
				let that = this;
				this.$confirm('确定要删除该角色信息吗?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// 删除角色操作，首先判断该角色是否关联了用户，关联情况下无法删除，先解除关联关系（到用户信息表中解除关联关系），再假删除角色
					// 判断是否关联用户
					selectUserRole(id).then((res) => {
						var count = res.data.count; //关联关系的个数
						if (count != 0) {
							this.$message({
								type: 'warning',
								message: '该角色关联了用户，无法删除，请先去解除关联关系'
							});
						} else if (count == 0) {
							//该角色未关联用户， 修改角色删除标志
							updateRoleDelflag(id).then((res) => {
								if (res.data.code == 200) {
									this.$message({
										type: 'success',
										message: '删除成功'
									});
									// 更新角色列表
									that.getList()
								}
							})
						}
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
		}
	}
</script>

<style>
</style>
