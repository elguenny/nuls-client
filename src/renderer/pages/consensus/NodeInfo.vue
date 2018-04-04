<template>
	<div class="node-info">
		<Back :backTitle="this.$t('message.consensusManagement')"></Back>
		<h2>{{this.myNodeInfo.agentName}}</h2>
		<ul>
			<li>
				<label>{{$t('message.c16')}}</label><span>{{this.myNodeInfo.packingAddress}}</span>
			</li>
			<li>
				<label>{{$t('message.state')}}</label><span>{{this.myNodeInfo.status}}</span>
			</li>
			<li>
				<label>{{$t('message.c7')}}</label><span>{{this.myNodeInfo.reward*0.00000001 }} NULS</span>
			</li>
			<li>
				<label>{{$t('message.c25')}}</label><span>{{this.myNodeInfo.owndeposit*0.00000001}}</span>
			</li>
			<li>
				<label>{{$t('message.c17')}}</label><span>{{this.myNodeInfo.commissionRate}} %</span>
			</li>
			<li>
				<label>{{$t('message.c18')}}</label><span>{{this.myNodeInfo.creditRatio}}</span>
			</li>
			<li>
				<label>{{$t('message.c19')}}</label><span>{{this.myNodeInfo.memberCount}}</span>
			</li>
			<li>
				<label>{{$t('message.c1')}}</label><span class="cursor-p text-d" @click="toallPledge">{{(this.myNodeInfo.totalDeposit*0.00000001).toFixed(8)}}</span>
			</li>
			<li class="overflow">
				<label>{{$t('message.c27')}}</label><span>{{this.myNodeInfo.introduction}}！</span>
			</li>
		</ul>
		<el-button @click="closedNode" type="button" class="bottom-btn">{{$t('message.c62')}}</el-button>
	</div>
</template>

<script>
	import Back from './../../components/BackBar.vue'

	export default {
		data() {
			return {
				myNodeInfo:[],
			}
		},
		components: {
			Back,
		},
        mounted() {
            let _this = this;
            this.getMyNodeInfo("/consensus/agent/"+localStorage.getItem("newAccountAddress"));
		},
		methods: {
		    //获取我创建的节点信息
            getMyNodeInfo(url){
                this.$fetch(url)
                    .then((response) => {
                        console.log(response)
                        if(response.success){
                            response.data.status = this.switchStatus(response.data.status);
                            this.myNodeInfo = response.data;
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
			//关闭我创建的节点信息
			closedNode() {
                this.$confirm(this.$t('message.c98')+this.myNodeInfo.agentName+this.$t('message.c99'), this.$t('message.c86'), {
                    confirmButtonText: this.$t('message.confirmButtonText'),
                    cancelButtonText: this.$t('message.cancelButtonText'),
                    type: 'warning'
                }).then(() => {
                    this.$prompt(this.$t('message.passWordTitle'), '', {
                        confirmButtonText: this.$t('message.confirmButtonText'),
                        cancelButtonText: this.$t('message.cancelButtonText'),
                       /* inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                        inputErrorMessage: this.$t('message.walletPassWordEmpty'),*/
                        inputType: 'password'
                    }).then(({value}) => {
                        var param = {"address": localStorage.getItem("newAccountAddress"), "password": value};
                        this.$post('/consensus/agent/stop', param)
                            .then((response) => {
								if(response.success){
                                    this.$message({
                                        type: 'success',
                                        message: this.$t('message.passWordSuccess')
                                    });
                                    this.$router.push({
                                        name: '/consensus',
										params:{"activeName":"first"}
                                    })
								}else {
                                    this.$message({
                                        type: 'waring',
                                        message: this.$t('message.passWordFailed')+response.msg
                                    });
								}
							});
                    })
                }).catch(() => {

                });

			},
            //查看我创建节点的抵押明细
            toallPledge() {
                this.$router.push({
                    name: '/allPledge',
                    params:{"agentName":this.myNodeInfo.agentName}
                })
            }
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.node-info {
		h2 {
			font-size: 16px;
			text-align: center;
			line-height: 20px;
			margin-bottom: 5px;
		}
		ul {
			width: 80%;
			height: 100%;
			margin: auto;
			margin-top: 18px;
			font-size: 12px;
			font-family: "微软雅黑";
			li {
				color: #c1c5c9;
				line-height: 34px;
				border-bottom: 1px solid #1c2738;
				label {
					display: block;
					width: 18%;
					float: left;
					padding-left: 3%;
				}
				span {}
			}
		}
	}
</style>