
<template>
  <!-- 这里的to接收的是父路劲加子路劲
	* 这里的组件不是外链就变成路由router-view -->
  <component v-bind="linkProps(to)">
		<!-- 插槽，等待父组件中的内容插入，现在占位 -->
    <slot/>
  </component>
</template>

<script>
import { isExternal } from '@/utils/validate'

export default {
  props: {
		// 接收父组件传值path路劲
    to: {
      type: String,
      required: true
    }
  },
  methods: {
    linkProps(url) {
			// 判断路径是否是外链，返回超链接组件
      if (isExternal(url)) {
        return {
          is: 'a',
          href: url,
          target: '_blank',
          rel: 'noopener'
        }
      }
			// 如果路劲不是外链，返回路由组件
      return {
        is: 'router-link',
        to: url
      }
    }
  }
}
</script>
