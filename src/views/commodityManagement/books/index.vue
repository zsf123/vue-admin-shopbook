<template>
	<div>
		<el-table :data="list" style="width: 100%" row-key="id" v-loading="loadingflag" element-loading-text="loading"
		 element-loading-spinner="el-icon-loading" element-loading-background="rgba(f,f,f,0.8)" border fit
		 highlight-current-row>
		 <el-table-column label="id" align="center" width="40" prop="id">
		 </el-table-column>
			<el-table-column :label="$t('book.avatar')" align="center" width="80">
				<template slot-scope="scope">
					<img :src="scope.row.imageurl" alt="图片" style="width:50px;height:50px;">
				</template>
			</el-table-column>
			<el-table-column :label="$t('book.barcode')" align="center" width="100" prop="barcode">
			</el-table-column>
			<el-table-column :label="$t('book.bookname')" align="center" width="180" prop="bookname">
			</el-table-column>
			<el-table-column :label="$t('book.author')" align="center" width="90" prop="author">
			</el-table-column>
			<el-table-column :label="$t('book.libraryArea')" align="center" width="100" prop="library_area">
			</el-table-column>
			<!-- <el-table-column label="书籍流通类型" align="center" width="80" prop="book_language">
			</el-table-column> -->
			<el-table-column label="ISBN" align="center" width="150" prop="ISBN">
			</el-table-column>
			<!-- <el-table-column label="出版社" align="center" width="150" prop="publisher">
			</el-table-column> -->
			<el-table-column :label="$t('book.callNum')" align="center" width="100" prop="call_num">
			</el-table-column>
			<el-table-column :label="$t('book.price')" align="center" width="80" prop="price">
			</el-table-column>
			<el-table-column :label="$t('table.operate')" align="center" width="180">
				<template slot-scope="scope">
					<el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('table.edit')}}</el-button>
					<el-button type="danger" size="mini" @click="handleDelete(scope.row.id)" v-if="scope.row.name!='ADMIN'">{{$t('table.delete')}}</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页组件 -->
		<pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList"
		 style="float:right;" />
	</div>
</template>

<script>
	import {
		selectAllBook
	} from '@/api/book.js' //根据需要导入查询方法，{}里面是各个方法名
	import Pagination from '@/components/Pagination' //引入自定义分页插件
	export default {
		components: {
			Pagination
		}, //引入分页组件
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
				}, //查询条件,这里的值会根据之后手动操作分页表而改变
				list: null, //查询到的角色列表
			}
		},
		created() {
			this.getList()
		},
		methods: {
			getList() {
				let that = this;
				that.loadingflag = true; //显示加载状态
				// 查询所有角色信息
				selectAllBook(that.listQuery).then((response) => {
					var data = response.data.book;
					that.list = data;
					that.total = response.data.totalcount;
					// 关闭加载状态，模拟请求时间
					setTimeout(() => {
						that.loadingflag = false
					}, 1.5 * 1000)
				}).catch(error => {
					console.log(error)
				})
			}
		},
	}
</script>

<style>
</style>
