<template>
	<!--select-->
	<span class="bar-bg fl">
		<span class="bar" v-bind:style="{background:colorData,width: widthData}">
			<span v-bind:style="{borderColor:colorData}"></span>
		</span>
	</span>

</template>
<script>
	export default {
		props: {
			colorData: {
				type: String,
				default: "#4a5065"
			},
			widthData: {
				type: String,
				default: "0"
			}
		},
		mounted() {
            let _this = this;
		}
	}
</script>

<style lang="less">
	.bar-bg {
		width: 60px;
		height: 2px;
		display: block;
		position: relative;
		background-color: #4a5065;
		margin-top: 10px;
		.bar {
			display: block;
			position: relative;
			height: 2px;
			span {
				position: absolute;
				text-align: center;
				font-weight: bold;
				margin-top: -1px;
				height: 4px;
				margin-left: 100%;
				border-right: 1px solid #4a5065;
			}
		}
	}
</style>