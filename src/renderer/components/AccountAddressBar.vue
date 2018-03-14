<template>
	<div class="account-address">
		<label v-show="accountAddressOk">{{$t("message.indexAccountAddress")}}</label>
		<el-select v-model="value">
			<el-option v-for="item in accountAddress" :key="item.value" :label="item.label" :value="item.value">
			</el-option>
		</el-select>
	</div>
</template>

<script>
	export default {
		data() {
			return {
                accountAddressOk:true,
				accountAddress: [],
				value: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter9）',
			}
		},
        mounted() {
            let _this = this;
            this.getaccountAddress("/account/list");
        },
        methods: {
            //获取账户地址列表
            getaccountAddress(api) {
                this.$fetch(api)
                    .then((response) => {
                        this.accountAddress = response.data;
                    });
            }
		}
	}
</script>

<style lang="less">
	.account-address {
		height: 50px;
		margin: auto;
		width: 68%;
		margin-top: 20px;
		label {
			font-size: 14px;
			margin-right: 15px;
		}
		.el-input--suffix .el-input__inner {
			width: 410px;
		}
		.el-input__suffix {
			margin-top: 1%;
		}
		.el-select .el-input .el-select__caret {
			font-size: 14px;
		}
	}
</style>