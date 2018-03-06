<template>
	<div class="users-log">
		<Back :backTitle="backTitle"></Back>
		<h2>日志</h2>
		<div class="users-log-info">
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
			<p>/*Table structure for table `TbsLoginLog` */ DROP TABLE IF EXIS</p>
		</div>
		<div class="users-log-bottom">
			<label>9856日志条目</label><span class="cursor-p fr">复制到剪切板</span><span class="cursor-p fr">另存为</span>
		</div>
	</div>
</template>

<script>
	import Back from '@/components/BackBar.vue';
	export default {
		data() {
			return {
				backTitle: "设置",
			}
		},
		components: {
			Back,
		}
	}
</script>
<style lang="less">
	@import url("../../assets/css/style.less");
	.users-log {
		h2 {
			font-size: 16px;
			text-align: center;
			line-height: 20px;
			margin-bottom: 28px;
		}
		.users-log-info {
			width: 80%;
			max-height: 325px;
			margin: auto;
			overflow: auto;
			border: 1px solid #24426c;
			background-color: #17202e;
			padding: 5px 0 0 5px;
			p {
				font-size: 12px;
				color: #C1C5C9;
				line-height: 18px;
			}
		}
		.users-log-bottom {
			width: 80%;
			height: 80px;
			margin: auto;
			margin-top: 10px;
			line-height: 25px;
			font-size: 12px;
			color: #C1C5C9;
			label {}
			span {
				border: 1px solid #24426c;
				padding: 0px 5px 0 5px;
				margin-left: 15px;
			}
		}
		.users-log-info::-webkit-scrollbar {
			width: 2px;
			height: 5px;
		}
		.users-log-info::-webkit-scrollbar-button {
			background-color: #263449;
		}
		.users-log-info::-webkit-scrollbar-track {
			background: #263449;
		}
		.users-log-info::-webkit-scrollbar-thumb {
			background: #658ec7;
			border-radius: 2px;
		}
	}
</style>