<template>
	<div class="agency-node">
		<Back :backTitle="backTitle"></Back>
		<h2>共识代理节点</h2>
		<div class="agency-node-top">
			<div class="search-div fl">
				<el-input placeholder="请输入别名或地址" v-model="input4">
					<template slot="append">
						<el-button slot="append">搜索</el-button>
					</template>
				</el-input>
			</div>
			<div class="select-div fl">
				<el-select v-model="select" slot="prepend" placeholder="请选择排序方式">
					<el-option label="佣金比例" value="1"></el-option>
					<el-option label="保证金" value="2"></el-option>
					<el-option label="剩余可抵押" value="3"></el-option>
				</el-select>
			</div>
		</div>
		<div class="agency-node-bottom">
			<div class="div-icon cursor-p fl" @click="toNodePage">
				<p class="subscript">
					共识中
				</p>
				<h3>雷霆节点</h3>
				<ul>
					<li><label>节点来源：</label>NTER7</li>
					<li><label>佣金比例：</label>15%</li>
					<li><label>保证金：</label>20000NULS</li>
					<li class="credit-values" @mouseover="toggleShow(0)" @mouseout="toggleShow(0)">
						<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</li>
					<li class="pawn-amount cb">
						<label class="fl">剩余可抵押：</label>
						<ProgressBar colorData="#58a5c9" widthData ="80%"></ProgressBar>
					</li>
				</ul>
				<div class="credit-valuesDiv" v-show="creditValuesShow0">
					<h2>
						<label class="fl">能力系数&nbsp;</label> 
						<ProgressBar colorData="#42b8ad" widthData ="30%"></ProgressBar>
					</h2>
					<p class="cb">根据近100轮出块数量计算</p>
					<h4>
						<label class="fl">责任系数&nbsp;</label> 
						<ProgressBar colorData="#658ec7" widthData ="80%"></ProgressBar>
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
					<li><label>节点来源：</label>NTER7</li>
					<li><label>佣金比例：</label>15%</li>
					<li><label>保证金：</label>20000NULS</li>
					<li class="credit-values" @mouseover="toggleShow(0)" @mouseout="toggleShow(0)">
						<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</li>
					<li class="pawn-amount cb">
						<label class="fl">剩余可抵押：</label>
						<ProgressBar colorData="#58a5c9" widthData ="80%"></ProgressBar>
					</li>
				</ul>
				<div class="credit-valuesDiv" v-show="creditValuesShow1">
					<h2>
						<label class="fl">能力系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</h2>
					<p class="cb">根据近100轮出块数量计算</p>
					<h4>
						<label class="fl">责任系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
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
					<li><label>节点来源：</label>NTER7</li>
					<li><label>佣金比例：</label>15%</li>
					<li><label>保证金：</label>20000NULS</li>
					<li class="credit-values" @mouseover="toggleShow(0)" @mouseout="toggleShow(0)">
						<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</li>
					<li class="pawn-amount cb">
						<label class="fl">剩余可抵押：</label>
						<ProgressBar colorData="#58a5c9" widthData ="80%"></ProgressBar>
					</li>
				</ul>
				<div class="credit-valuesDiv" v-show="creditValuesShow1">
					<h2>
						<label class="fl">能力系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</h2>
					<p class="cb">根据近100轮出块数量计算</p>
					<h4>
						<label class="fl">责任系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
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
					<li><label>节点来源：</label>NTER7</li>
					<li><label>佣金比例：</label>15%</li>
					<li><label>保证金：</label>20000NULS</li>
					<li class="credit-values" @mouseover="toggleShow(0)" @mouseout="toggleShow(0)">
						<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</li>
					<li class="pawn-amount cb">
						<label class="fl">剩余可抵押：</label>
						<ProgressBar colorData="#58a5c9" widthData ="80%"></ProgressBar>
					</li>
				</ul>
				<div class="credit-valuesDiv" v-show="creditValuesShow1">
					<h2>
						<label class="fl">能力系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</h2>
					<p class="cb">根据近100轮出块数量计算</p>
					<h4>
						<label class="fl">责任系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
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
					<li><label>节点来源：</label>NTER7</li>
					<li><label>佣金比例：</label>15%</li>
					<li><label>保证金：</label>20000NULS</li>
					<li class="credit-values" @mouseover="toggleShow(0)" @mouseout="toggleShow(0)">
						<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</li>
					<li class="pawn-amount cb">
						<label class="fl">剩余可抵押：</label>
						<ProgressBar colorData="#58a5c9" widthData ="80%"></ProgressBar>
					</li>
				</ul>
				<div class="credit-valuesDiv" v-show="creditValuesShow1">
					<h2>
						<label class="fl">能力系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</h2>
					<p class="cb">根据近100轮出块数量计算</p>
					<h4>
						<label class="fl">责任系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
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
					<li><label>节点来源：</label>NTER7</li>
					<li><label>佣金比例：</label>15%</li>
					<li><label>保证金：</label>20000NULS</li>
					<li class="credit-values" @mouseover="toggleShow(0)" @mouseout="toggleShow(0)">
						<label class="fl">信用值：&nbsp;&nbsp;&nbsp;</label>
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</li>
					<li class="pawn-amount cb">
						<label class="fl">剩余可抵押：</label>
						<ProgressBar colorData="#58a5c9" widthData ="80%"></ProgressBar>
					</li>
				</ul>
				<div class="credit-valuesDiv" v-show="creditValuesShow2">
					<h2>
						<label class="fl">能力系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData ="40%"></ProgressBar>
					</h2>
					<p class="cb">根据近100轮出块数量计算</p>
					<h4>
						<label class="fl">责任系数&nbsp;</label> 
						<ProgressBar colorData="#f64b3e" widthData="40%"></ProgressBar>
					</h4>
					<p class="cb">根据近100轮违规情况和出块正确性计算</p>
				</div>
			</div>
		</div>
		<el-pagination layout="prev, pager, next" :total="1000" class="cb"></el-pagination>
	</div>
</template>

<script>
	import Back from './../../components/BackBar.vue'
	import ProgressBar from './../../components/ProgressBar.vue'

	export default {
		data() {
			return {
				backTitle: "雷霆节点",
				input4: '',
				select: '',
				creditValuesShow0: false,
				creditValuesShow1: false,
				creditValuesShow2: false,
			}
		},
		components: {
			Back,
			ProgressBar,
		},
		methods: {
			back() {
				this.$router.go(-1);
			},
			toggleShow(e) {
				this.creditValuesShow0 = !this.creditValuesShow0;
			},
			toNodePage(){
				this.$router.push({
					path: '/consensus/nodeInfo/nodePage'
				});
			}
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.agency-node {
		h2 {
			font-size: 16px;
			text-align: center;
			line-height: 20px;
			margin-bottom: 10px;
		}
		.agency-node-top {
			width: 80%;
			margin: auto;
			height: 30px;
			.search-div {
				width: 68%;
				input[type="text"],
				select {
					background-color: #17202e;
					border: 1px solid #658ec7;
				}
				.el-input-group__append {
					border-left: 0;
					background-color: #658ec7;
					border-color: #658ec7;
					border-radius: 0px;
					color: #ffffff;
					font-size: 12px;
				}
			}
			.select-div {
				margin-left: 3%;
			}
		}
		.agency-node-bottom {
			width: 80%;
			margin: auto;
			.div-icon{
				height: 145px;
				margin-top: 15px;
				margin-right: 6px;
			}
		}
	}
</style>