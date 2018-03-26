<template>
	<div class="add-node">
		<Back :backTitle="backTitle"></Back>
		<h2>{{this.agentAddressInfo.agentName}}</h2>
		<div class="div-icon1 node-page-top">
			<p class="subscript">
				{{this.agentAddressInfo.status == 2 ? "正在共识" : "等待共识"}}
			</p>
			<ul>
				<li class="li-bg overflow">
					<label>节点来源：</label>{{this.agentAddressInfo.agentAddress}}
				</li>
				<li>
					<label>佣金比例：</label>{{this.agentAddressInfo.commissionRate}}%
				</li>
				<li>
					<!--<label>保证金：</label>{{this.nodeData.owndeposit.value * 0.00000001}} NULS-->
					<label>保证金：</label>{{20000}} NULS
				</li>
				<li>
					<label>参与人数：</label>
					<ProgressBar colorData="#6a84f7" :widthData="this.agentAddressInfo.memberCount"></ProgressBar>
				</li>
				<li>
					<label>信用值：</label>
					<ProgressBar colorData="#82bd39" :widthData="this.agentAddressInfo.creditRatio"></ProgressBar>
				</li>
				<li>
					<label>剩余可抵押：</label>
					<!-- <ProgressBar colorData="#58a5c9" :widthData="this.nodeData.totalDeposit.value"></ProgressBar>-->
					<ProgressBar colorData="#58a5c9" widthData="5%"></ProgressBar>
				</li>
				<li class="li-info overflow">
					<label>节点介绍：</label>{{this.agentAddressInfo.introduction}}
				</li>
			</ul>
		</div>
		<div class="add-node-bottom">
			<el-form ref="addNodeForm" :model="addNodeForm" :rules="addNodeRules" size="mini" label-position="left">
				<el-form-item label="抵押保证金" class="pledge-money" prop="nodeNo">
					<el-input v-model="addNodeForm.nodeNo" :placeholder=this.placeholder></el-input>
				</el-form-item>
				<div class="procedure">手续费<span>0.01 NULS</span></div>
				<el-form-item size="large" class="submit">
					<el-button type="primary" @click="onSubmit('addNodeForm')">确定</el-button>
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
            var checkNodeNo = (rule, value, callback) => {
                if (!value) {
                    callback(new Error('请输入委托保证金额！'));
                }
                setTimeout(() => {
                    var re = /^\d+(?=\.{0,1}\d+$|$)/;
                    if (!re.exec(value)) {
                        callback(new Error('请输入正确的委托保证金额为数字值！'));
                    } else if (value > this.usable - 0.01) {
                        callback(new Error('委托保证金额不能大于可用余额！'));
                    } else {
                        callback();
                    }
                }, 100);
            };
			return {
				backTitle: "委托共识",
                agentAddress:this.$route.params.agentAddress,
                agentAddressInfo:[],
                addNodeForm: {
                    nodeNo: ''
				},
                addNodeRules: {
                    nodeNo: [
                        {validator: checkNodeNo, trigger: 'blur'}
                    ],
                },
                usable: 0,
                placeholder:"",

			}
		},
		components: {
			Back,
			ProgressBar,
		},
        mounted() {
            let _this = this;
            this.getAgentAddressInfo("/consensus/agent/list/", {"address": this.agentAddress, "pageSize": "1"});
            this.getBalanceAddress('/account/balance/' + localStorage.getItem('newAccountAddress'));
        },
		methods: {
            //根据agentAddress获取共识节点列表信息
            getAgentAddressInfo(url, params) {
                this.$fetch(url, params)
                    .then((response) => {
                        if (response.success) {
                            if (response.data.list[0].creditRatio != 0) {
                                if (response.data.list[0].creditRatio > 0) {
                                    response.data.list[0].creditRatio = ((((response.data.list[0].creditRatio + 1) / 2)) * 100).toFixed() + '%';
                                } else {
                                    response.data.list[0].creditRatio = response.data.list[0].creditRatio * 100;
                                }
                            } else {
                                response.data.list[0].creditRatio = "50%";
                            }
                            response.data.list[0].memberCount = (response.data.list[0].memberCount / 10).toFixed() + '%';
                            response.data.list[0].totalDeposit.value = (response.data.list[0].totalDeposit.value / 50000000000000).toFixed() + '%';
                            this.agentAddressInfo = response.data.list[0];
                        }
                    });
            },
            //根据账户地址获取账户余额
            getBalanceAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.placeholder = "（可用余额："+response.data.usable * 0.000000001+"NULS）" ;
                            this.usable = response.data.usable * 0.000000001;
                        }
                    });
            },
			//提交追加
			onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$prompt(this.$t('message.passWordTitle'), '', {
                            confirmButtonText: this.$t('message.confirmButtonText'),
                            cancelButtonText: this.$t('message.cancelButtonText'),
                            inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                            inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                            inputType: 'password'
                        }).then(({value}) => {
                            var param = '{"address":"' + localStorage.getItem('newAccountAddress') + '","agentAddress":"' + this.agentAddress + '","deposit":"' + this.addNodeForm.nodeNo * 100000000 + '","password":"' + value + '"}';
                            console.log(param)
                            this.$post('/consensus/deposit/', param)
                                .then((response) => {
                                    if (response.success) {
                                        this.$message({
                                            message: '恭喜您！申请参与共识成功！',
                                            type: 'success'
                                        });
                                         this.$router.push({
                                             name: '/myNode',
                                             params:{"agentAddress":this.agentAddress},
                                         })
                                    } else {
                                        this.$message({
                                            message: '对不起！' + response.msg,
                                            type: 'warning',
                                        });
                                    }
                                })
                        })
                    } else {
                        return false;
                    }
                });
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
			height: 145px;
			margin: 20px auto 0px;
			border: 1px solid #658ec7;
			background-color: #17202e;
			.el-input__inner {
				width: 415px;
			}
			.el-form-item {
				width: 90%;
				margin: auto;
				.el-form-item__content{
				 margin-bottom: 15px;
				}
				.el-form-item__label{
					color: #C1C5C9;
					font-size: 12px;
				}
				.el-form-item__error{
					margin-left: 70px;
				}
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