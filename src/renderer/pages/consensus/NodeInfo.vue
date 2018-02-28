<template>
	<div class="node-info">
		<Back :backTitle="backTitle"></Back>
		<h2>雷霆节点</h2>
		<ul>
			<li>
				<label>出块状态</label><span>NxaD59D7aAd29654eBC58A1DEaD649153B288928e3</span>
			</li>
			<li>
				<label>状态</label><span>正在共识</span>
			</li>
			<li>
				<label>累计收益</label><span>1266NULS</span>
			</li>
			<li>
				<label>保证金</label><span>20000</span>
			</li>
			<li>
				<label>代理佣金比例</label><span>15%</span>
			</li>
			<li>
				<label>信用值</label><span>0.1</span>
			</li>
			<li>
				<label>参与人数</label><span>2</span>
			</li>
			<li>
				<label>总抵押金额</label><span class="cursor-p text-d" title="点击查看详情" @click="toallPledge">180000</span>
			</li>
			<li>
				<label>节点介绍</label><span>雷霆节点NULS忠实粉丝的选择！</span>
			</li>
		</ul>
		<el-button @click="closedNode()" type="button" class="bottom-btn">关闭节点</el-button>
	</div>
</template>

<script>
	import Back from './../../components/BackBar.vue'

	export default {
		data() {
			return {
				backTitle: "共识首页"
			}
		},
		components: {
			Back,
		},
		methods: {
			closedNode() {
				console.log('closedNode');
			},
			toallPledge() {
				this.$router.push({
					path: '/consensus/nodeInfo/allPledge'
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