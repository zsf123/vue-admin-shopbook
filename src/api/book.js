import request from '@/utils/request'
// 导出查询用户相关的路径api方法


// 查询所有用户信息
export function selectAllBook(query) {
	return request({
		url: '/selectAllBook',
		method: 'get',
		params: query //带分页的查询条件?
	})
}