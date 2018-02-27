<template>
	<div class="pledge-info">
		<Back :backTitle="backTitle"></Back>
		<h2>我的抵押总额明细</h2>
		<el-table :data="pledgeData" :stripe="false">
			<el-table-column prop="pledgeInfoName" label="节点名称" min-width="20" align='center'>
			</el-table-column>
			<el-table-column prop="pledgeInfoMoney" label="金额" min-width="20" align='center'>
			</el-table-column>
			<el-table-column prop="pledgeInfoState" label="状态" min-width="20" align='center'>
			</el-table-column>
			<el-table-column prop="pledgeInfoTime" label="加入时间" min-width="25" align='center'>
			</el-table-column>
			<el-table-column label="操作" min-width="15" align='center'>
				<template slot-scope="scope">
					<el-button @click="handleClick(scope.row)" type="text" size="small">查看</el-button>
				</template>
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
				backTitle: "共识首页",
				pledgeData: [{
					pledgeInfoName: '雷霆0节点',
					pledgeInfoMoney: '2000NULS',
					pledgeInfoState: '正在共识',
					pledgeInfoTime: '2017-12-26 12:30:25'
				}, {
					pledgeInfoName: '雷霆0节点',
					pledgeInfoMoney: '2000NULS',
					pledgeInfoState: '等待下一轮',
					pledgeInfoTime: '2017-12-26 12:30:25'

				}, {
					pledgeInfoName: '雷霆0节点',
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
			},
			handleClick(row) {
				console.log(row);
			},
			toAddress() {
				this.$router.push({
					path: '/wallet/users/userInfo'
				})
			}
		}
	}
</script>

<style lang="less">
	@import url("../../assets/css/style.less");
	.pledge-info{
		h2{
			font-size:16px;
			text-align: center;
			line-height: 20px;
			margin-bottom: 28px;
		}
		.el-table{
			width: 85%;
			margin: auto;	
		}
		
	}
</style>