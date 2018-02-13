<template>
	<div class="transfer">
		<div class="back" @click="back"><i class="el-icon-arrow-left"></i>钱包管理</div>
		<div class="transfer-info">
			<h2>转账</h2>
			<el-form ref="form" :model="transferForm" label-width="100px" label-position="top">
				<el-form-item label="转账资产:" class="out-name">
					<el-button type="text" v-model="transferForm.outName">转账资产：NULS(可用余额:1,000,11.236)</el-button>
				</el-form-item>
				<el-form-item label="账户地址:" class="out-address">
					<el-select v-model="transferForm.outAddress" placeholder="请选择账户地址">
						<el-option label="NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter1）" value="1"></el-option>
						<el-option label="NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter2）" value="2"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="转账地址:" class="join-address">
					<el-input type="text" v-model="transferForm.joinAddress"></el-input>
					<i @click="toAddress"></i>
				</el-form-item>
				<el-form-item label="转账金额:">
					<el-input type="text" v-model="transferForm.joinNo"></el-input>
				</el-form-item>
				<el-form-item label="手续费:" class="service-no">
					<el-button type="text" v-model="transferForm.serviceNo">0.01NULS</el-button>
				</el-form-item>
				<el-form-item label="备注:" class="remark">
					<el-input type="textarea" v-model="transferForm.remark"></el-input>
				</el-form-item>
				<el-form-item class="transfer-submit">
					<el-button type="primary" @click="transferSubmit">确认转账</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>

</template>

<script>
	export default {
		data() {
			return {
				transferForm: {
					outName: '',
					outAddress: '',
					joinAddress: '',
					joinNo: '',
					serviceNo: '',
					remark: ''
				}
			}
		},
		components: {

		},
		methods: {
			back() {
				this.$router.go(-1);
			},
			transferSubmit() {
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
	#top-bg() {
		display: block;
		width: 2rem;
		height: 2rem;
		background-repeat: no-repeat;
		background-image: url(../../assets/images/top-icon.png);
		background-size: 200px;
	}
	
	.transfer {
		width: 90%;
		margin: auto;
		.back {
			width: 100%;
			height: 3rem;
			line-height: 3rem;
			font-size: 1rem;
		}
		.transfer-info {
			width: 80%;
			margin: auto;
			.out-name,
			.service-no {
				label {
					float: left;
					padding-right: 0.5rem;
				}
			}
			.out-address {
				.el-select {
					width: 100%;
				}
			}
			.join-address {
				i {
					#top-bg;
					position: relative;
					z-index: 1025;
					float: right;
					margin-top: -43px;
					margin-right: 10px;
					background-position: -3px -70px;
				}
			}
			.remark {
				.el-textarea__inner {
					background-color: #17202e;
				}
			}
			.transfer-submit {
				text-align: center;
				button {
					width: 30%;
				}
			}
			h2 {
				text-align: center;
				line-height: 3rem;
			}
			input[type="text"],
			input[type="password"],
			select {
				background: #17202e;
			}
		}
		.el-select-dropdown {
			background-color: #17202e;
		}
		.el-select-dropdown__item.hover,
		.el-select-dropdown__item:hover {
			background-color: #17202e;
		}
	}
</style>