<!-- 全局组件 -->
<template>
	<!-- 这里的class是个变量，有svg-icon international-icon -->
	<svg :class="svgClass" aria-hidden="true" v-on="$listeners">
		<use :xlink:href="iconName" />
		<!-- 这里的iconName是#icon-language -->
		<!-- svgClass和iconName都是方法：svgClass如果父组件传过来一个className,则class名称为svg-icon icon-XXX 
<!-- <svg>
  <symbol id="robot" viewBox="0 0 340 536">
    <path d="..." fill="#1E8F90" style="fill: var(--primary-color)" /> 
    <path d="..." fill="#1E8F90" style="fill: var(--primary-color)" /> 
    <path d="..." fill="#6A4933" style="fill: var(--tertiary-color)" /> 
    <path d="..." fill="#1E8F90" style="fill: var(--primary-color)" />
  </symbol>
</svg>
* 
* <svg width="340" height="536"> 
  <use xlink:href="#robot" id="robot-1" />
</svg>-->
	</svg>
</template>

<script>
	export default {
		name: 'SvgIcon',
		// 接收父组件传值
		props: {
			/*  
			 * 用于接收来自父组件的数据，以是简单的数组，或者使用对象作为替代，对象允许配置高级选项，
			 * 如类型检测、自定义验证和设置默认值。
			 */
			iconClass: { //图标icon名称
				type: String,
				required: true
			},
			className: { //类名名称
				type: String,
				default: ''
			}
		},
		computed: {
			iconName() {
				return `#icon-${this.iconClass}`
			},
			svgClass() {
				if (this.className) {
					//international-icon
					return 'svg-icon ' + this.className
				} else {
					return 'svg-icon'
				}
			}
		}
	}
</script>

<style scoped>
	.svg-icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}
</style>
