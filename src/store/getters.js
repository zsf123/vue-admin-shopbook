// 获取state中的属性值
const getters = {
	// es6的箭头函数如果箭头后面没有{}则默认有一个return,如果有{}则必须写return
	sidebar: state => state.app.sidebar,
	device: state => state.app.device,
	language: state => state.app.language, //获得语言标识
	token: state => state.user.token,
	avatar: state => state.user.avatar,
	user: state => state.user,
	roles: state => state.user.roles,
	visitedViews: state => state.tagsView.visitedViews,
	cachedViews: state => state.tagsView.cachedViews
}
export default getters
