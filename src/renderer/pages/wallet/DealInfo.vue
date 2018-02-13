<template>
	<div class="deal-info">
		<div class="back" @click="back"><i class="el-icon-arrow-left"></i>交易记录</div>
		<div class="deal-info-top">
			<div class="deal-out fl">
				<p>0x7f80545d8c3147002c752fe8ade665739bf578ca</p>
				<p>0x7f80545d8c3147002c7</p>
			</div>
			<div class="icon fl"><i class="el-icon-back"></i></div>
			<div class="deal-join fl">
				<p>0x7f80545d8c3147002c752fe8ade665739bf578ca</p>
				<p>0x7f80545d8c314</p>
			</div>
			<div class="deal-total fl">
				<p>132.5654856 NULS</p>
				<p>200 NULS</p>
				<h2>363.5693546NULS</h2>
			</div>
		</div>
		<div class="deal-case">
			<div class="deal-case-left fl">
				<h3>概览</h3>
				<ul>
					<li><span>大小 </span>225（字节）</li>
					<li><span>重量 </span>900</li>
					<li><span>接收时间 </span>2017-09-09 08:15:56</li>
					<li><span>锁定时间 </span>区块：484321</li>
					<li><span>在区块内 </span>484321（2017-09-09 08:15:56 + 0时间</li>
					<li><span>确认 </span>21344确认</li>
					<li><span>可视化 </span>浏览树状图</li>
				</ul>
			</div>
			<div class="deal-case-right fr">
				<h3>输入和输出</h3>
				<ul>
					<li><span>输入总额</span>33.2446BTC</li>
					<li><span>输出总额</span>332.33326565BTC</li>
					<li><span>交易费</span>0.00005BTC</li>
					<li><span>每字节交易费用</span>225.65sat/B</li>
					<li><span>每单位重量的费用</span>33.36sat/WU</li>
					<li><span>预计比特币成交 </span>132.56565656 TBC</li>
					<li><span>脚本</span>显示交易脚本& Coinbase信息</li>
				</ul>

			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		components: {

		},
		methods: {
			back() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="less">
	.deal-info {
		width: 96%;
		margin: auto;
		.back {
			width: 100%;
			height: 3rem;
			line-height: 3rem;
			font-size: 1rem;
		}
		.deal-info-top {
			width: 96%;
			height: 5rem;
			margin: auto;
			p {
				line-height: 1.4rem;
				font-size: 0.8rem;
			}
			.deal-out {
				width: 38%;
			}
			.icon {
				width: 8%;
				transform: rotateY(180deg);
				text-align: center;
				line-height: 4rem;
			}
			.deal-join {
				width: 38%;
			}
			.deal-total {
				width: 16%;
				text-align: right;
				h2{
					background-color: #415d85;
					font-size: 0.8rem;
				}
			}
		}
		.deal-case {
			h3 {
				background-color: #17202e;
				line-height: 2rem;
			}
			.deal-case-left {
				width: 48%;
			}
			.deal-case-right {
				width: 48%;
				ul li span {
					width: 8rem;
				}
			}
			ul li{
				border-bottom: 1px solid #1c2738;
				line-height: 2rem;
				font-size: 0.8rem;
				font-weight: 400;
			}
			ul li span {
				display: block;
				width: 5rem;
				float: left;
			}
		}
	}
</style>