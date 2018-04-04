<template>
	<div class="add-node">
		<Back :backTitle="this.$t('message.consensusManagement')"></Back>
		<h2>{{this.agentAddressInfo.agentName}}</h2>
		<div class="div-icon1 node-page-top">
			<p class="subscript">
				{{this.agentAddressInfo.status}}
			</p>
			<ul>
				<li class="li-bg overflow">
					<label>{{$t('message.c16')}}：</label>{{this.agentAddressInfo.agentAddress}}
				</li>
				<li>
					<label>{{$t('message.c17')}}：</label>{{this.agentAddressInfo.commissionRate}}%
				</li>
				<li>
					<label>{{$t('message.c25')}}：</label>{{(this.agentAddressInfo.owndeposit*0.00000001).toFixed(8)}} NULS
				</li>
				<li>
					<label>{{$t('message.c19')}}：</label>
					<ProgressBar colorData="#6a84f7" :widthData="this.agentAddressInfo.memberCount"></ProgressBar>
					<span>&nbsp;{{this.agentAddressInfo.memberCounts}}</span>
				</li>
				<li>
					<label>{{$t('message.c18')}}：</label>
					<ProgressBar colorData="#82bd39" :widthData="this.agentAddressInfo.creditRatio"></ProgressBar>
					<span>&nbsp;{{this.agentAddressInfo.creditRatios}}</span>
				</li>
				<li>
					<label>{{$t('message.c47')}}：</label>
					<ProgressBar colorData="#58a5c9" :widthData="this.agentAddressInfo.totalDeposit"></ProgressBar>
					<span>&nbsp;{{this.agentAddressInfo.totalDeposits}}</span>
				</li>
				<li class="li-info overflow">
					<label>{{$t('message.c27')}}：</label>{{this.agentAddressInfo.introduction}}
				</li>
			</ul>
		</div>
		<div class="add-node-bottom">
			<el-form ref="addNodeForm" :model="addNodeForm" :rules="addNodeRules" size="mini" label-position="left">
				<el-form-item :label="$t('message.c51')" class="pledge-money" prop="nodeNo">
					<el-input v-model="addNodeForm.nodeNo" :placeholder=this.placeholder></el-input>
				</el-form-item>
				<div class="procedure">{{$t('message.miningFee1')}}<span>0.01 NULS</span></div>
				<el-form-item size="large" class="submit">
					<el-button type="primary" @click="onSubmit('addNodeForm')">{{$t('message.confirmButtonText')}}</el-button>
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
                    callback(new Error(this.$t('message.c52')));
                }
                setTimeout(() => {
                    var re = /^\d+(?=\.{0,1}\d+$|$)/;
                    if (!re.exec(value)) {
                        callback(new Error(this.$t('message.c53')));
                    } else if (value > this.usable - 0.01) {
                        callback(new Error(this.$t('message.c54')));
                    } else {
                        callback();
                    }
                }, 100);
            };
			return {
                agentAddress:this.$route.params.agentAddress,
                agentId:this.$route.params.agentId,
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
            this.getAgentAddressInfo("/consensus/agent/"+this.agentAddress);
            this.getBalanceAddress('/account/balance/' + localStorage.getItem('newAccountAddress'));
        },
		methods: {
            //根据agentAddress获取共识节点信息
            getAgentAddressInfo(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            response.data.creditRatios = response.data.creditRatio;
                            if (response.data.creditRatio != 0) {
                                if (response.data.creditRatio > 0) {
                                    response.data.creditRatio = ((((response.data.creditRatio + 1) / 2)) * 100).toFixed(2) + '%';
                                } else {
                                    response.data.creditRatio = response.data.creditRatio * 10;
                                }
                            } else {
                                response.data.creditRatio = "50%";
                            }
                            response.data.status = this.switchStatus(response.data.status);
                            response.data.memberCounts = response.data.memberCount +"/1000";
                            response.data.memberCount = (response.data.memberCount / 10).toFixed(2) + '%';
                            response.data.totalDeposits = response.data.totalDeposit*0.00000001 +"/500000";
                            response.data.totalDeposit = ((response.data.totalDeposit*0.00000001) / 5000).toFixed(2) + '%';
                            this.agentAddressInfo = response.data;
                        }
                    });
            },
            //查询共识状态
            switchStatus(status) {
                switch (status) {
                    case 0:
                        return this.$t("message.c13");
                        break;
                    case 1:
                        return this.$t("message.c14");
                        break;
                    case 2:
                        return this.$t("message.c15");
                        break;
                }
            },
            //根据账户地址获取账户余额
            getBalanceAddress(url) {
                this.$fetch(url)
                    .then((response) => {
                        if (response.success) {
                            this.placeholder = "（"+ this.$t('message.currentBalance')+response.data.usable * 0.000000001+"NULS）" ;
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
                           /* inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                            inputErrorMessage: this.$t('message.walletPassWordEmpty'),*/
                            inputType: 'password'
                        }).then(({value}) => {
                            var param = '{"address":"' + localStorage.getItem('newAccountAddress') + '","agentId":"' + this.agentId + '","deposit":"' + this.addNodeForm.nodeNo * 100000000 + '","password":"' + value + '"}';
                            this.$post('/consensus/deposit/', param)
                                .then((response) => {
                                    console.log(param);
                                    console.log(response);
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