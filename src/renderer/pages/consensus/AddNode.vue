<template>
	<div class="add-node">
		<Back :backTitle="backTitle"></Back>
		<h2>雷霆节点</h2>
		<div class="div-icon add-node-top">
			<p class="subscript">
				待共识
			</p>
			<ul>
				<li class="li-bg">
					<label>节点来源：</label>NTER7
				</li>
				<li>
					<label>佣金比例：</label>15%
				</li>
				<li>
					<label>保证金：</label>20000NULS
				</li>
				<li>
					<label>参与人数：</label>
					<ProgressBar colorData="#6a84f7" widthData="80%"></ProgressBar>
				</li>
				<li>
					<label>信用值：</label>
					<ProgressBar colorData="#82bd39" widthData="30%"></ProgressBar>
				</li>
				<li>
					<label>剩余可抵押：</label>
					<ProgressBar colorData="#58a5c9" widthData="60%"></ProgressBar>
				</li>
				<li class="li-info">
					<label>节点介绍：</label>雷霆节点NULS忠实粉丝！
				</li>
			</ul>
		</div>
		<div class="add-node-bottom">
			<el-form ref="form" :model="sizeForm" size="mini" label-position="left">
				<el-form-item label="抵押保证金" class="pledge-money">
					<el-input v-model="sizeForm.name" placeholder="（可用余额：100000NULS）"></el-input>
				</el-form-item>
				</el-form-item>
				<el-form-item size="large" class="submit">
					<el-button type="primary" @click="onSubmit">确定</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script>
	import Back from './../../components/BackBar.vue'
	import ProgressBar from './../../components/ProgressBar.vue'
	export default {
		data() {
			return {
				backTitle: "委托共识",
				sizeForm: {
					name: ''
				}
			}
		},
		components: {
			Back,
			ProgressBar,
		},
		methods: {
			onSubmit() {
				console.log("123")
			}
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.add-node {
		h2 {
			font-size: 16px;
			text-align: center;
			line-height: 20px;
			margin-bottom: 28px;
		}
		.div-icon {
			height: 118px;
			width: 80%;
			margin: auto;
			border: 1px solid #658ec7;
		}
		ul {
			width: 100%;
			height: 105px;
			margin: auto;
			font-size: 12px;
			background-color: #17202e;
			padding-top: 15px;
			li {
				color: #c1c5c9;
				line-height: 22px;
				width: 45%;
				float: left;
				label {
					display: block;
					width: 75px;
					float: left;
					padding-left: 25px;
				}
				span {}
			}
			.li-info {
				width: 100%;
				text-align: left;
			}
		}
		.add-node-bottom {
			width: 80%;
			height: 115px;
			margin: auto;
			margin-top: 20px;
			border: 1px solid #658ec7;
			background-color: #17202e;
			.el-input__inner {
				width: 415px;
			}
			.el-form-item {
				width: 90%;
				margin: auto;
			}
			.pledge-money {
				margin-top: 20px;
			}
			.el-input {
				float: left;
				width: 415px;
			}
			.el-button--primary {
				margin-top: 15px;
			}
			
		}
	}
</style>