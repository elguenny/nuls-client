<template>
	<div class="my-node">
		<Back :backTitle="backTitle"></Back>
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
		<div class="my-node-bottom">
			<div class="my-node-list">
				{{$t('message.c56')}}
				<span class="text-d cursor-p fr" @click="addNode">{{$t('message.c57')}}</span>
			</div>
			<el-table :data="myMortgageData" style="width: 100%">
				<el-table-column prop="amount" :label="$t('message.c51')" min-width="20" align='center'>
				</el-table-column>
				<el-table-column prop="status" :label="$t('message.state')" min-width="10" align='center'>
				</el-table-column>
				<el-table-column prop="depositTime" :label="$t('message.c49')" min-width="25" align='center'>
				</el-table-column>
				<el-table-column :label="$t('message.operation')" min-width="25" align='center'>
					<template slot-scope="scope">
						<el-button @click="outNode(scope.row)" type="text" size="small">{{$t('message.c58')}}</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination layout="prev, pager, next" :page-size="3"  :total=this.total v-show="totalOK = this.total > 3 ? true:false" @current-change="myMortgageSize" class="cb"></el-pagination>
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
				backTitle: this.$t('message.consensusManagement'),
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
            this.getAgentAddressInfo("/consensus/agent/"+this.agentAddress);
            this.getAddressList("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'),{"pageSize": "3"});
        },
		methods: {
            //根据agentAddress获取共识节点列表信息
            getAgentAddressInfo(url, params) {
                this.$fetch(url, params)
                    .then((response) => {
                        if (response.success) {
                            response.data.creditRatios = response.data.creditRatio;
                            if (response.data.creditRatio != 0) {
                                if (response.data.creditRatio > 0) {
                                    response.data.creditRatio = ((((response.data.creditRatio + 1) / 2)) * 100).toFixed() + '%';
                                } else {
                                    response.data.creditRatio = response.data.creditRatio * 100;
                                }
                            } else {
                                response.data.creditRatio = "50%";
                            }
                            response.data.status = this.switchStatus(response.data.status);
                            response.data.memberCounts = response.data.memberCount +"/1000";
                            response.data.memberCount = (response.data.memberCount / 10).toFixed(2) + '%';
                            response.data.totalDeposits = response.data.totalDeposit*0.00000001 +"/500000";
                            response.data.totalDeposit = (response.data.totalDeposit / 500000000000).toFixed(2) + '%';
                            this.agentAddressInfo = response.data;
                        }
                    });
            },
			//根据address获取我的抵押list
			getAddressList(url,params){
                this.$fetch(url,params)
                    .then((response) => {
                        if (response.success) {
                            console.log(response)
                            this.total = response.data.total;
                            for (var i = 0; i < response.data.list.length; i++) {
                                response.data.list[i].amount = response.data.list[i].amount *0.00000001;
                                response.data.list[i].depositTime = moment(response.data.list[i].depositTime).format('YYYY-MM-DD hh:mm:ss');
                                response.data.list[i].status = this.switchStatus(response.data.list[i].status);
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
			//全部退出
			/*allOut(){
				console.log('全部退出');
			},*/
			//追加共识
			addNode(){
				this.$router.push({
					name: '/addNode',
                    params: {agentAddress: this.agentAddressInfo.agentAddress,agentId: this.agentAddressInfo.agentId},
				});
			},
			//退出共识
			outNode(row) {
				this.$confirm(this.$t('message.c60')+row.agentName+'？( '+this.$t('message.c51')+row.amount+' NULS)', this.$t('message.c61'), {
					confirmButtonText: this.$t("message.confirmButtonText"),
					cancelButtonText: this.$t("message.cancelButtonText"),
					type: 'warning'
				}).then(() => {
                    this.$prompt(this.$t('message.passWordTitle'), '', {
                        confirmButtonText: this.$t('message.confirmButtonText'),
                        cancelButtonText: this.$t('message.cancelButtonText'),
                       /* inputPattern: /(?!^((\d+)|([a-zA-Z]+)|([~!@#\$%\^&\*\(\)]+))$)^[a-zA-Z0-9~!@#\$%\^&\*\(\)]{9,21}$/,
                        inputErrorMessage: this.$t('message.walletPassWordEmpty'),*/
                        inputType: 'password'
                    }).then(({value}) => {
                        var param = {"address": row.address, "password": value,"txHash": row.txHash};
                       this.$post('/consensus/withdraw/', param)
                            .then((response) => {
                                //console.log(param)
								//console.log(response);
                                if(response.success){
                                    this.$message({
                                        type: 'success',
                                        message: this.$t("message.passWordSuccess")
                                    });
                                    this.getAddressList("/consensus/deposit/address/" + localStorage.getItem('newAccountAddress'),{"pageSize": "3"});
								}
                            })
					});

				}).catch(() => {
					this.$message({
						type: 'info',
						message: this.$t("message.c59")
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