import request from '@/utils/request'
// 导出查询用户相关的路径api方法


// 查询所有用户信息
export function selectAllUser(query) {
	return request({
		url: '/selectAllUser',
		method: 'get',
		params:query//带分页的查询条件?
	})
}

// 根据id删除用户
export function updateUserDelflag(id) {
	return request({
		url: '/updateUserDelflag/id/' + id,
		method: 'post'
	})
}

// 保存用户数据
export function saveUserinfo(user) {
	return request({
		method: 'post',
		url: '/saveUserinfo/',
		data: {
			user: user
		}
	})
}
