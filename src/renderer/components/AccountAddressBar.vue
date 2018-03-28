<template>
	<div class="account-address">
		<el-select v-model="accountAddressValue" placeholder="请选择账户地址" @change="accountAddressChecked">
			<el-option v-for="item in accountAddress" :key="item.address" :label="item.address" :value="item.address">
			</el-option>
		</el-select>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				accountAddress: [],
                accountAddressValue: localStorage.getItem('newAccountAddress'),
			}
		},
        mounted() {
            let _this = this;
            this.getAccountList("/account/list");
        },
        methods: {
            //获取账户地址列表
            getAccountList(url) {
                this.$fetch(url)
                    .then((response) => {
                        if(response.success){
                            this.accountAddress = response.data;
						}else {
                            console.log("获取账户列表失败！")
						}
                    });
            },
            //选择账户地址
            accountAddressChecked(accountAddress) {
                this.$emit("chenckAccountAddress",accountAddress);
                localStorage.setItem('newAccountAddress',accountAddress);
            },
		}
	}
</script>

<style lang="less">
	.account-address {
		height: 50px;
		margin: 20px auto 0px;
		width: 440px;
		label {
			font-size: 14px;
			margin-right: 15px;
		}
		.el-input--suffix .el-input__inner {
			width: 415px;
		}
		.el-select .el-input .el-select__caret {
			font-size: 14px;
		}
	}
</style>