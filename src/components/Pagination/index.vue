<template>
	<!-- 
	* 属性
	* background	是否为分页按钮添加背景色	boolean
	* page-size	每页显示条目个数，支持 .sync 修饰符（双向绑定修饰符，将子组件状态的改变，同步到父组件中，实现双向数据绑定）	number 默认10个 
	* layout	组件布局，子组件名用逗号分隔
	*  page-sizes	每页显示个数选择器的选项设置：这里设置为limit的值，默认为20
	* total	总条目数
	* current-page当前页默认是第一页，点击设置当前页，将向父组件传值
	* 方法
	* size-change	pageSize 改变时会触发
	* current-change	currentPage 改变时会触发
	* -->
  <div :class="{'hidden':hidden}" class="pagination-container">
    <el-pagination
      :background="background"
      :current-page.sync="currentPage"
      :page-size.sync="pageSize"
      :layout="layout"
      :page-sizes="pageSizes"
      :total="total"
      v-bind="$attrs"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script>
import { scrollTo } from '@/utils/scrollTo'

export default {
  name: 'Pagination',
	// 接收父组件传值，单向数据绑定仅仅接收父组件传值
  props: {
    total: {
      required: true,
      type: Number
    },
		// 当前页
    page: {
      type: Number,
      default: 1
    },
		// 每页记录数
    limit: {
      type: Number,
      default: 5
    },
    pageSizes: {
      type: Array,
      default() {
        return [5, 10, 15, 20]
      }
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    },
    background: {
      type: Boolean,
      default: true
    },
    autoScroll: {
      type: Boolean,
      default: true
    },
    hidden: {
      type: Boolean,
      default: false
    }
  },
	// 计算属性是根据返回值的改变，才改变属性值
  computed: {
		// 当前页
    currentPage: {
      get() {
        return this.page//page改变（通过父组件改变）了，当前页就改变了
      },
      set(val) {
        this.$emit('update:page', val)
      }
    },
		// 每页记录数
    pageSize: {//子组件属性就改变
      get() {
        return this.limit//每页记录数发生改变
      },
      set(val) {
        this.$emit('update:limit', val)
      }
    }
  },
  methods: {
		// pageSize 每页记录数改变时会触发
    handleSizeChange(val) {
			// vm.$emit( event, arg )
			console.log(`每页${val}条`)
			// 触发父组件查询方法
      this.$emit('pagination', { page: this.currentPage, limit: val })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    },
		// 	currentPage 当前页改变时会触发
    handleCurrentChange(val) {
			console.log(`当前页: ${val}`)
      this.$emit('pagination', { page: val, limit: this.pageSize })
      if (this.autoScroll) {
        scrollTo(0, 800)
      }
    }
  }
}
</script>

<style scoped>
.pagination-container {
  background: #fff;
  padding: 32px 16px;
}
.pagination-container.hidden {
  display: none;
}
</style>
