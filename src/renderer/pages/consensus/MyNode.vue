<template>
	<div class="my-node">
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
		<div class="my-node-bottom">
			<div class="my-node-list">
				我的抵押明细 <!--<span class="text-d cursor-p fr" @click="allOut">全部退出</span>-->
				<span class="text-d cursor-p fr" @click="addNode">追加</span>
			</div>
			<el-table :data="myMortgageData" style="width: 100%">
				<el-table-column prop="amount" label="抵押保证金" min-width="20" align='center'>
				</el-table-column>
				<el-table-column prop="status" label="状态" min-width="10" align='center'>
				</el-table-column>
				<el-table-column prop="depositTime" label="加入时间" min-width="25" align='center'>
				</el-table-column>
				<el-table-column label="操作" min-width="25" align='center'>
					<template slot-scope="scope">
						<el-button @click="outNode(scope.row)" type="text" size="small">退出</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination layout="prev, pager, next" :page-size="3"  :total=this.total @current-change="myMortgageSize" class="cb"></el-pagination>
		</div>
	</div>
</template>

<script>
	import Back from './../../components/BackBar.vue'
	import ProgressBar from './../../components/ProgressBar.vue'
    import moment from 'moment';
	export default {
		data() {
			return {
				backTitle: "委托共识",
				address:'',
                agentAddress:this.$route.params.agentAddress,
                agentAddressInfo:[],
                myMortgageData: [],
                total:0,
			}
		},
		components: {
			Back,
			ProgressBar,
		},
        mounted() {
            let _this = this;
            this.getAgentAddressInfo("/consensus/agent/list/", {"address": this.agentAddress, "pageSize": "1"});
            this.getAddressList("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'),{"pageSize": "3"});
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
			//根据address获取我的抵押list
			getAddressList(url,params){
                this.$fetch(url,params)
                    .then((response) => {
                        if (response.success) {
                            //console.log(response)
                            this.total = response.data.total;
                            for (var i = 0; i < response.data.list.length; i++) {
                                response.data.list[i].amount = response.data.list[i].amount *0.00000001;
                                response.data.list[i].depositTime = moment(response.data.list[i].depositTime).format('YYYY-MM-DD hh:mm:ss');
                                response.data.list[i].status = response.data.list[i].status !=2 ?"等待共识":"正在共识";
                            }
                            this.myMortgageData = response.data.list;
                        }
                    });
			},
			//分页功能
            myMortgageSize(events) {
                this.getAddressList("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'), {
                    "pageNumber": events,
                    "pageSize": "3"
                });
            },
			//全部退出
			/*allOut(){
				console.log('全部退出');
			},*/
			//追加共识
			addNode(){
				this.$router.push({
					path: '/consensus/myNode/addNode'
				});
			},
			//退出共识
			outNode(row) {
				this.$confirm('确定退出雷霆节点？(抵押保证金 '+row.amount+' NULS)', '退出节点', {
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
                        console.log(row);
                        var param = {"address": row.address, "password": value,"txHash": row.txHash};
                        console.log(param);
                       this.$post('/consensus/withdraw/', param)
                            .then((response) => {
                                this.$message({
                                    type: 'success',
                                    message: '恭喜您，退出节点申请成功!'
                                });
                                this.myMortgageSize();
                                //console.log(response);
                               /* if (response.success) {
                                    this.$message({
                                        type: 'success',
                                        message: '删除成功!'
                                    });

                                }else {
                                    this.$message({
                                        type: 'waring',
                                        message: '对不起，退出节点失败!'+response.msg
                                    });
								}*/
                            })

					});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			}

		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.my-node {
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
			li.number,
			.el-icon {
				width: auto;
				float: none;
				background-color: #17202e;
			}
		}
		.el-pager {
			width: auto;
			height: auto;
			padding: 0px;
			background-color: #17202e;
		}
		.my-node-bottom {
			width: 80%;
			height: 200px;
			margin: auto;
			margin-top: 20px;
			border: 1px solid #658ec7;
			background-color: #17202e;
			.my-node-list {
				text-align: center;
				font-size: 14px;
				line-height: 25px;
				color: #c1c5c9;
				span {
					margin-right: 30px;
				}
			}
			.el-table tr {
				/*background-color: #17202e;
				border-bottom: 1px solid #00FFFF;*/
			}
			.el-pagination {
				margin-top: 0px;
				padding: 0px;
			}
			.el-pagination button.disabled {
				background-color: #17202e;
			}
			.btn-next,
			.btn-prev {
				background: center center no-repeat #17202e;
			}
		}
	}
</style>