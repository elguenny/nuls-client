<template>
	<div class="node-info">
		<Back :backTitle="backTitle"></Back>
		<h2>{{this.myNodeInfo.agentName}}</h2>
		<ul>
			<li>
				<label>出块地址</label><span>{{this.myNodeInfo.agentAddress}}</span>
			</li>
			<li>
				<label>状态</label><span>{{this.myNodeInfo.status == 2 ? "正在共识":"等待共识"}}</span>
			</li>
			<li>
				<label>累计收益</label><span>{{this.myNodeInfo.reward.value*0.00000001 }} NULS</span>
			</li>
			<li>
				<label>保证金</label><span>{{this.myNodeInfo.totalDeposit.value*0.00000001}}</span>
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
				<label>总抵押金额</label><span class="cursor-p text-d" title="点击查看详情" @click="toallPledge">{{this.myNodeInfo.owndeposit.value*0.00000001}}</span>
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
            this.getMyNodeInfo("/consensus/agent/address/"+localStorage.getItem("2CVxEw3XJXwc2H5Ue7FYn82XDEJ2Wbm"));
		},
		methods: {
		    //获取我创建的节点信息
            getMyNodeInfo(url){
                this.$fetch(url)
                    .then((response) => {
                        if(response.success){
                            console.log(response)
                            this.myNodeInfo = response.data.list[0];
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
                        console.log(value);
                        this.$message({
                            type: 'success',
                            message: '恭喜您、你已经申请了关闭节点！'
                        });
                        //关闭我的节点方法不通，模拟数据
                        this.$router.push({
                            name: '/consensus'
                        })
                    })
                }).catch(() => {

                });
				console.log(localStorage.getItem("newAccountAddress"));

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