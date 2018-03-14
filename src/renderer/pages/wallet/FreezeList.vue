<template>
	<div class="freeze-list">
		<Back :backTitle="backTitle"></Back>
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
			<!--<el-pagination background layout="prev, pager, next" :total="1000">
			</el-pagination>-->
		</div>
	</div>
</template>

<script>
    import Back from '@/components/BackBar.vue';
	export default {
		data() {
			return {
                backTitle:'钱包管理',
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
            Back,
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
		width: 100%;
		margin: auto;
		.freeze-list-tabs {
			width: 85%;
			margin: auto;
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