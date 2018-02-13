<template>
	<div class="freeze-list">
		<div class="back" @click="back"><i class="el-icon-arrow-left"></i>账户地址</div>
		<div class="freeze-list-tabs">
			<h2>冻结列表</h2>
			<el-table :data="freezeData" style="width: 100%">
				<el-table-column prop="freezeType" label="类型">
				</el-table-column>
				<el-table-column prop="freezeMoney" label="金额">
				</el-table-column>
				<el-table-column prop="lockTime" label="冻结时间">
				</el-table-column>
				<el-table-column prop="outTime" label="解冻时间">
				</el-table-column>
			</el-table>
			<el-pagination background layout="prev, pager, next" :total="1000">
			</el-pagination>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				freezeData: [{
					freezeType: '锁仓',
					freezeMoney: '2565459',
					lockTime: '2018-1-26',
					outTime: '2018-1-26'
				}, {
					freezeType: '锁仓',
					freezeMoney: '2565459',
					lockTime: '2018-1-26',
					outTime: '2018-1-26'
				}, {
					freezeType: '锁仓',
					freezeMoney: '2565459',
					lockTime: '2018-1-26',
					outTime: '2018-1-26'
				}, {
					freezeType: '锁仓',
					freezeMoney: '2565459',
					lockTime: '2018-1-26',
					outTime: '2018-1-26'
				}]

			}
		},
		components: {

		},
		methods: {
			back(){
				this.$router.go(-1);
			}
		}
	}
</script>

<style lang="less">
	.freeze-list {
		width: 90%;
		margin: auto;
		.back {
			width: 100%;
			height: 3rem;
			line-height: 3rem;
			font-size: 1rem;
		}
		.freeze-list-tabs {
			h2 {
				line-height: 3rem;
				text-align: center;
			}
			.el-table th {
				background-color: #17202e;
			}
			.el-table tr {
				background-color: #0c1323;
			}
			.el-pagination {
				margin-top: 1rem;
				text-align: center;
			}
		}
		
	}
</style>