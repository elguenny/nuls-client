<template>
	<div class="all-pledge">
		<Back :backTitle="backTitle"></Back>
		<h2>抵押总额明细</h2>
		<el-table :data="pledgeData" :stripe="false">
			<el-table-column prop="pledgeInfoName" label="账户" min-width="50" align='center'>
			</el-table-column>
			<el-table-column prop="pledgeInfoMoney" label="金额" min-width="13" align='center'>
			</el-table-column>
			<el-table-column prop="pledgeInfoState" label="状态" min-width="12" align='center'>
			</el-table-column>
			<el-table-column prop="pledgeInfoTime" label="加入时间" min-width="20" align='center'>
			</el-table-column>
		</el-table>
		<el-pagination layout="prev, pager, next" :total="1000" class="cb"></el-pagination>
	</div>
</template>

<script>
	import Back from './../../components/BackBar.vue'

	export default {
		data() {
			return {
				backTitle: "雷霆节点",
				pledgeData: [{
					pledgeInfoName: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					pledgeInfoMoney: '2000NULS',
					pledgeInfoState: '正在共识',
					pledgeInfoTime: '2017-12-26 12:30:25'
				}, {
					pledgeInfoName: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					pledgeInfoMoney: '2000NULS',
					pledgeInfoState: '等待下一轮',
					pledgeInfoTime: '2017-12-26 12:30:25'

				}, {
					pledgeInfoName: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					pledgeInfoMoney: '2000NULS',
					pledgeInfoState: '等待下一轮',
					pledgeInfoTime: '2017-12-26 12:30:25'

				}]
			}
		},
		components: {
			Back,
		},
		methods: {
			back() {
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.all-pledge {
		h2 {
			font-size: 16px;
			text-align: center;
			line-height: 20px;
			margin-bottom: 28px;
		}
		.el-table {
			width: 85%;
			margin: auto;
		}
	}
</style>