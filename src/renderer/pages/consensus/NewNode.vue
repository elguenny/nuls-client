<template>
	<div class="new-node">
		<Back :backTitle="backTitle"></Back>
		<h2>自建节点共识</h2>
		<div class="new-node-form">
			<el-form ref="form" :model="sizeForm" label-width="80px" size="mini" label-position="top">
				<el-form-item label="共识账户：">
					<el-select v-model="value" class="select-account">
						<el-option v-for="item in accountAddress" :key="item.value" :label="item.label" :value="item.value">
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="出块地址：">
					<el-input v-model="sizeForm.name"></el-input>
				</el-form-item>
				<el-form-item label="节点名称：">
					<el-input v-model="sizeForm.name"></el-input>
				</el-form-item>
				<el-form-item label="保证金：" class="form-left">
					<el-input v-model="sizeForm.name"></el-input>
				</el-form-item>
				<el-form-item label="代理佣金比例：" class="form-left">
					<el-input v-model="sizeForm.name"></el-input>
				</el-form-item>
				<el-form-item label="节点介绍：" class="cb">
					<el-input v-model="sizeForm.name" type="textarea" :rows="2"></el-input>
				</el-form-item>
				<el-form-item label="手续费：0.01NULS">

				</el-form-item>
				<el-form-item size="large" class="submit">
					<el-button type="primary" @click="onSubmit">立即创建</el-button>
				</el-form-item>
			</el-form>
		</div>

	</div>
</template>

<script>
	import Back from './../../components/BackBar.vue'

	export default {
		data() {
			return {
				backTitle: "共识首页",
				accountAddress: [{
					value: '选项1',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
					value: '选项2',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
					value: '选项3',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}],
				value: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter9）',
				sizeForm: {
					name: ''
				}
			}
		},
		components: {
			Back,
		},
		methods: {
			onSubmit() {
				console.log('submit!');
			},
			toAddress() {
				this.$router.push({
					path: '/wallet/users/userInfo'
				})
			}
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.new-node {
		h2 {
			font-size: 16px;
			text-align: center;
			line-height: 20px;
			margin-bottom: 5px;
		}
		.new-node-form {
			width: 60%;
			margin: auto;
			.form-left {
				width: 50%;
				float: left;
				.el-input__inner {
					width: 175px;
				}
			}
			.el-input__inner {
				width: 410px;
			}
			.el-textarea__inner {
				width: 410px;
			}
			.el-input--suffix {
				width: 100%;
			}
			.el-input__suffix {
				margin-top: 0px;
			}
			.el-select .el-input .el-select__caret {
				font-size: 14px;
			}
			.el-form-item--mini .el-form-item__content,
			.el-form-item--mini .el-form-item__label {
				line-height: 6px;
			}
			.el-form-item--mini {
				margin-bottom: 10px;
			}
			
		}
	}
</style>