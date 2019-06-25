import request from '@/utils/request'
// 导出查询用户相关的路径api方法


// 查询所有用户信息
export function selectAllRole(query) {
	return request({
		url: '/selectAllRole',
		method: 'get',
		params: query //带分页的查询条件?
	})
}

// 根据角色id查询用户角色中间表
export function selectUserRole(id) {
	return request({
		url: '/selectUserRole/id/' + id,
		method: 'get'
	})
}

//该角色未关联用户， 修改角色删除标志
export function updateRoleDelflag(id) {
	return request({
		url: '/updateRoleDelflag/id/' + id,
		method: 'post'
	})
}


// 查询出当前点击用户的角色
export function selectRoleByUserId(id) {
	return request({
		url: '/selectRoleByUserId/id/' + id,
		method: 'get'
	})
}
