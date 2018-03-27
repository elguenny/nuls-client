<template>
	<div class="node-info">
		<Back :backTitle="backTitle"></Back>
		<h2>{{this.myNodeInfo.agentName}}</h2>
		<ul>
			<li>
				<label>出块地址</label><span>{{this.myNodeInfo.packingAddress}}</span>
			</li>
			<li>
				<label>状态</label><span>{{this.myNodeInfo.status == 2 ? "正在共识":"等待共识"}}</span>
			</li>
			<li>
				<label>累计收益</label><span>{{this.myNodeInfo.reward*0.00000001 }} NULS</span>
			</li>
			<li>
				<label>保证金</label><span>{{this.myNodeInfo.totalDeposit*0.00000001}}</span>
			</li>
			<li>
				<label>代理佣金比例</label><span>{{this.myNodeInfo.commissionRate}} %</span>
			</li>
			<li>
				<label>信用值</label><span>{{this.myNodeInfo.creditRatio}}</span>
			</li>
			<li>
				<label>参与人数</label><span>{{this.myNodeInfo.memberCount}}</span>
			</li>
			<li>
				<label>总抵押金额</label><span class="cursor-p text-d" title="点击查看详情" @click="toallPledge">{{(this.myNodeInfo.totalDeposit*0.00000001).toFixed(8)}}</span>
			</li>
			<li class="overflow">
				<label>节点介绍</label><span>{{this.myNodeInfo.introduction}}！</span>
			</li>
		</ul>
		<el-button @click="closedNode" type="button" class="bottom-btn">关闭节点</el-button>
	</div>
</template>

<script>
	import Back from './../../components/BackBar.vue'

	export default {
		data() {
			return {
				backTitle: "共识首页",
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
                            this.myNodeInfo = response.data;
                            console.log((this.myNodeInfo.totalDeposit*0.00000001).toFixed(8));
						}
                    });
			},
			//关闭我创建的节点信息
			closedNode() {
                this.$confirm('确定关闭节点么?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$prompt(this.$t('message.passWordTitle'), '', {
                        confirmButtonText: this.$t('message.confirmButtonText'),
                        cancelButtonText: this.$t('message.cancelButtonText'),
                        inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                        inputErrorMessage: this.$t('message.walletPassWordEmpty'),
                        inputType: 'password'
                    }).then(({value}) => {
                        var param = {"address": localStorage.getItem("newAccountAddress"), "password": value};
                        this.$post('/consensus/agent/stop', param)
                            .then((response) => {
								if(response.success){
                                    this.$message({
                                        type: 'success',
                                        message: '恭喜您、你已经申请了关闭节点！'
                                    });
                                    this.$router.push({
                                        name: '/consensus',
										params:{"activeName":"first"}
                                    })
								}else {
                                    this.$message({
                                        type: 'waring',
                                        message: '对不起！关闭节点申请失败！'+response.msg
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