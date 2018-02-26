<template>
	<div class="consensusIndex">
		<div class="consensusTop">
			<label>{{$t("message.indexAccountAddress")}}</label>
			<el-select v-model="value" placeholder="请选择">
				<el-option v-for="item in accountAddress" :key="item.value" :label="item.label" :value="item.value">
				</el-option>
			</el-select>
		</div>
		<div class="consensusCenter">
			<h2>
				<label>总抵押金额（全网）：</label>20,000,000NULS,<label>总共识数：</label>264<label>年化收益：</label>0.25%
			</h2>
			<ul>
				<li class="liBg">
					<label>我的总体情况：</label>
				</li>
				<li class="liBg">
					<label>累计收益：</label>188NULS
				</li>
				<li>
					<label>创建节点：</label>0个 (<span title="点击创建节点">创建</span>)
				</li>
				<li>
					<label>委托节点：</label>4个 (<span title="点击委托节点">委托</span>)
				</li>
				<li>
					<label>抵押总数：</label>20，000NULS
				</li>
				<li>
					<label>可用余额：</label>256，222NULS
				</li>
			</ul>
		</div>
		<div class="consensusBottom">
			<template>
				<el-tabs v-model="activeName" @tab-click="handleClick">
					<el-tab-pane label="全部共识" name="first">
						<div class="divIcon">
							<p class="subscript">
								共识中
							</p>
							<h3>雷霆节点</h3>
							<ul>
								<li><label>我的抵押：</label>40，000NULS</li>
								<li><label>累计收益：</label>120NULS</li>
								<li>
									<label>参与人数：</label>
									<span class="bar">
										<span></span>
									</span>
								</li>
								<li><label>抵押金额：</label> </li>
								<li><label>佣金比例：</label>15%S</li>
								<li><label>信用值：</label> </li>
							</ul>
						</div>
					</el-tab-pane>
					<el-tab-pane label="我的共识" name="second">
						我的共识
					</el-tab-pane>
				</el-tabs>
			</template>
		</div>
	</div>
</template>

<script>
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
				activeName: 'second',
			}
		},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
			}
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style");
	.consensusIndex {
		.consensusTop {
			height: 50px;
			margin: auto;
			width: 68%;
			margin-top: 20px;
			label {
				font-size: 14px;
				margin-right: 15px;
			}
			.el-input--suffix .el-input__inner {
				padding-right: 30px;
				border: 1px solid #658ec7;
				width: 410px;
				height: 24px;
				font-size: 12px;
			}
			.el-input__suffix {
				margin-top: 1%;
			}
			.el-select .el-input .el-select__caret {
				font-size: 14px;
			}
		}
		.consensusCenter {
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
				li.liBg {
					background-color: #222d3f;
				}
			}
		}
		.consensusBottom {
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
				}
			}
		}
	}
</style>