<template>
	<div class="consensus-index">
		<AccountAddressBar></AccountAddressBar>
		<div class="consensus-center">
			<h2>
				<label>总抵押金额（全网）：</label>20,000,000NULS,<label>总共识数：</label>264<label>年化收益：</label>0.25%
			</h2>
			<ul>
				<li class="li-bg">
					<label>我的总体情况：</label>
				</li>
				<li class="li-bg">
					<label>累计收益：</label>188NULS
				</li>
				<li>
					<label>创建节点：</label>0个 (<span title="点击创建节点" @click="toNewNode">创建</span>)
				</li>
				<li>
					<label>委托节点：</label>4个 (<span title="点击委托节点" @click="toAgencyNode">委托</span>)
				</li>
				<li>
					<label>抵押总数：</label><span title="点击查看抵押详情" @click="toPledgeInfo">20，000NULS</span>
				</li>
				<li>
					<label>可用余额：</label>256，222NULS
				</li>
			</ul>
		</div>
		<div class="consensus-bottom">
			<template>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="全部共识" name="first">

						<div class="div-icon fl">
							<p class="subscript">
								共识中
							</p>
							<h3>雷霆节点</h3>
							<ul>
								<li><label>我的抵押：</label>40，000NULS</li>
								<li><label>累计收益：</label>120NULS</li>
								<li class="participants">
									<label class="fl">参与人数：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="pawn-amount cb">
									<label class="fl">抵押金额：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="cb"><label>佣金比例：</label>15%</li>
								<li class="credit-values" @mouseover="toggleShow(0)" @mouseout="toggleShow(0)">
									<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
							</ul>
							<div class="credit-valuesDiv" v-show="creditValuesShow0">
								<h2>
									<label class="fl">能力系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h2>
								<p class="cb">根据近100轮出块数量计算</p>
								<h4>
									<label class="fl">责任系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h4>
								<p class="cb">根据近100轮违规情况和出块正确性计算</p>
							</div>
						</div>

						<div class="div-icon fl">
							<p class="subscript">
								共识中
							</p>
							<h3>雷霆节点</h3>
							<ul>
								<li><label>我的抵押：</label>40，000NULS</li>
								<li><label>累计收益：</label>120NULS</li>
								<li class="participants">
									<label class="fl">参与人数：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="pawn-amount cb">
									<label class="fl">抵押金额：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="cb"><label>佣金比例：</label>15%</li>
								<li class="credit-values" @mouseover="toggleShow(1)" @mouseout="toggleShow(1)">
									<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
							</ul>
							<div class="credit-valuesDiv" v-show="creditValuesShow1">
								<h2>
									<label class="fl">能力系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h2>
								<p class="cb">根据近100轮出块数量计算</p>
								<h4>
									<label class="fl">责任系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h4>
								<p class="cb">根据近100轮违规情况和出块正确性计算</p>
							</div>
						</div>

						<div class="div-icon fl div-icon-last">
							<p class="subscript stay">
								待共识
							</p>
							<h3>雷霆节点</h3>
							<ul>
								<li><label>我的抵押：</label>40，000NULS</li>
								<li><label>累计收益：</label>120NULS</li>
								<li class="participants">
									<label class="fl">参与人数：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="pawn-amount cb">
									<label class="fl">抵押金额：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="cb"><label>佣金比例：</label>15%</li>
								<li class="credit-values" @mouseover="toggleShow(2)" @mouseout="toggleShow(2)">
									<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
							</ul>
							<div class="credit-valuesDiv" v-show="creditValuesShow2">
								<h2>
									<label class="fl">能力系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h2>
								<p class="cb">根据近100轮出块数量计算</p>
								<h4>
									<label class="fl">责任系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h4>
								<p class="cb">根据近100轮违规情况和出块正确性计算</p>
							</div>
						</div>

						<el-pagination layout="prev, pager, next" :total="1000" class="cb"></el-pagination>
					</el-tab-pane>
					<el-tab-pane label="我的共识" name="second">
						<div class="div-icon fl" @click="toMyNode">
							<p class="subscript">
								共识中
							</p>
							<h3>雷霆节点</h3>
							<ul>
								<li><label>我的抵押：</label>40，000NULS</li>
								<li><label>累计收益：</label>120NULS</li>
								<li class="participants">
									<label class="fl">参与人数：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="pawn-amount cb">
									<label class="fl">抵押金额：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="cb"><label>佣金比例：</label>15%</li>
								<li class="credit-values" @mouseover="toggleShow(0)" @mouseout="toggleShow(0)">
									<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
							</ul>
							<div class="credit-valuesDiv" v-show="creditValuesShow0">
								<h2>
									<label class="fl">能力系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h2>
								<p class="cb">根据近100轮出块数量计算</p>
								<h4>
									<label class="fl">责任系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h4>
								<p class="cb">根据近100轮违规情况和出块正确性计算</p>
							</div>
						</div>

						<div class="div-icon fl">
							<p class="subscript stay">
								待共识
							</p>
							<h3>雷霆节点</h3>
							<ul>
								<li><label>我的抵押：</label>40，000NULS</li>
								<li><label>累计收益：</label>120NULS</li>
								<li class="participants">
									<label class="fl">参与人数：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="pawn-amount cb">
									<label class="fl">抵押金额：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="cb"><label>佣金比例：</label>15%</li>
								<li class="credit-values" @mouseover="toggleShow(1)" @mouseout="toggleShow(1)">
									<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
							</ul>
							<div class="credit-valuesDiv" v-show="creditValuesShow1">
								<h2>
									<label class="fl">能力系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h2>
								<p class="cb">根据近100轮出块数量计算</p>
								<h4>
									<label class="fl">责任系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h4>
								<p class="cb">根据近100轮违规情况和出块正确性计算</p>
							</div>
						</div>

						<div class="div-icon fl div-icon-last">
							<p class="subscript stay">
								待共识
							</p>
							<h3>雷霆节点</h3>
							<ul>
								<li><label>我的抵押：</label>40，000NULS</li>
								<li><label>累计收益：</label>120NULS</li>
								<li class="participants">
									<label class="fl">参与人数：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="pawn-amount cb">
									<label class="fl">抵押金额：</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
								<li class="cb"><label>佣金比例：</label>15%</li>
								<li class="credit-values" @mouseover="toggleShow(2)" @mouseout="toggleShow(2)">
									<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
									</span>
									</span>
								</li>
							</ul>
							<div class="credit-valuesDiv" v-show="creditValuesShow2">
								<h2>
									<label class="fl">能力系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h2>
								<p class="cb">根据近100轮出块数量计算</p>
								<h4>
									<label class="fl">责任系数&nbsp;</label> 
									<span class="bar-bg fl">
										<span class="bar">
											<span></span>
										</span>
									</span>
								</h4>
								<p class="cb">根据近100轮违规情况和出块正确性计算</p>
							</div>
						</div>

						<el-pagination layout="prev, pager, next" :total="1000" class="cb"></el-pagination>

						<div class="noData" v-show="isData">
							<i class="el-icon-plus"></i>
						</div>

					</el-tab-pane>
				</el-tabs>
			</template>
		</div>
	</div>
</template>

<script>
	import AccountAddressBar from './../../components/AccountAddressBar.vue'
	export default {
		data() {
			return {
				accountAddress: [{
					value: '选项1',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
					value: '选项2',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
					value: '选项3',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}],
				value: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter9）',
				activeName: 'first',
				creditValuesShow0: false,
				creditValuesShow1: false,
				creditValuesShow2: false,
				isData: false,
			}
		},
		components: {
			AccountAddressBar,
		},
		methods: {
			toNewNode() {
				this.$router.push({
					path: '/consensus/newNode'
				});
			},
			toPledgeInfo() {
				this.$router.push({
					path: '/consensus/pledgeInfo'
				});
			},
			toAgencyNode(){
				this.$router.push({
					path: '/consensus/agencyNode'
				});
			},
			toMyNode(){
				this.$router.push({
					path: '/consensus/myNode'
				});
			},
			toggleShow(e) {
				this.creditValuesShow0 = !this.creditValuesShow0;
			},
			handleClick(tab, event) {
				console.log(tab, event);
			}
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style");
	.consensus-index {
		
		.consensus-center {
			width: 640px;
			height: 106px;
			margin: auto;
			border: 1px solid #658ec7;
			text-align: center;
			font-family: "微软雅黑";
			h2 {
				font-size: 14px;
				font-weight: 590;
				line-height: 36px;
				label {}
			}
			ul {
				width: 100%;
				li {
					width: 35%;
					height: 20px;
					padding-left: 15%;
					text-align: left;
					float: left;
					font-size: 12px;
					color: #C1C5C9;
					label {}
					span {
						text-decoration: underline;
						cursor: pointer;
					}
				}
				li.li-bg {
					background-color: #222d3f;
				}
			}
		}
		.consensus-bottom {
			width: 80%;
			margin: auto;
			margin-top: 5px;
			h3 {
				text-align: center;
				font-size: 14px;
				line-height: 35px;
			}
			ul {
				li {
					font-size: 12px;
					color: #C1C5C9;
					padding-left: 20px;
					line-height: 20px;
					label {}
					.bar-bg {
						margin-top: 10px;
					}
				}
				li.participants {
					.bar-bg {
						.bar {
							width: 50%;
							background-color: #6e84f7;
							span {
								border-right: 1px solid #6e84f7;
							}
						}
					}
				}
				li.pawn-amount {
					.bar-bg {
						.bar {
							width: 70%;
							background-color: #f64b3e;
							span {
								border-right: 1px solid #f64b3e;
							}
						}
					}
				}
				li.credit-values {
					.bar-bg {
						.bar {
							width: 60%;
							background-color: #82BD39;
							span {
								border-right: 1px solid #82BD39;
							}
						}
					}
				}
			}
			
			.el-pagination {
				padding: 10px 5px;
			}
			.noData {
				height: 168px;
				width: 200px;
				overflow: hidden;
				position: relative;
				background-color: #181f2f;
				border: 1px solid #24426c;
				margin: auto;
				margin-top: 15px;
				text-align: center;
				font-size: 5rem;
				line-height: 150px;
				cursor: pointer;
			}
		}
	}
</style>