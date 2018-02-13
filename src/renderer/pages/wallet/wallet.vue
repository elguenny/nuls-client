<template>
	<div class="wallet">
		<div class="search">
			<label>账户地址:</label>
			<template>
				<el-select v-model="value" placeholder="请选择">
					<el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
					</el-option>
				</el-select>
			</template>
			<el-button>点击复制</el-button>
			<el-button @click="funUsers">账户管理</el-button>
		</div>
		<div class="wallet-tab">
			<el-tabs v-model="activeName" @tab-click="handleClick">
				<el-tab-pane label="账户首页" name="first">
					<el-table :data="tableData" style="width: 100%">
						<el-table-column label="资产" width="80">
							<template slot-scope="scope">
								<span>{{ scope.row.assets }}</span>
							</template>
						</el-table-column>
						<el-table-column label="总数量" width="140">
							<template slot-scope="scope">
								<span>{{ scope.row.totalNo }}</span>
							</template>
						</el-table-column>
						<el-table-column label="可用" width="140">
							<template slot-scope="scope">
								<span>{{ scope.row.canNo }}</span>
							</template>
						</el-table-column>
						<el-table-column label="锁定" width="80">
							<template slot-scope="scope">
								<span>{{ scope.row.lockingNo }}</span>
							</template>
						</el-table-column>
						<el-table-column label="隐藏" width="80">
							<template slot-scope="scope">
								<i class="el-icon-view"></i>
							</template>
						</el-table-column>
						<el-table-column label="操作">
							<template slot-scope="scope">
								<el-button size="mini" @click="handleEdit(scope.$index, scope.row)">转账</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-tab-pane>
				<el-tab-pane label="交易记录" name="second">
					交易记录
				</el-tab-pane>
			</el-tabs>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				activeName: 'first',
				options: [{
					value: '选项1',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
					value: '选项2',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
					value: '选项3',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
					value: '选项4',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}, {
					value: '选项5',
					label: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter7）'
				}],
				value: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3（nter9）',
				tableData: [{
					assets: 'NULS',
					totalNo: '1,000,100.1123',
					canNo: '1,000,000',
					lockingNo: '122563'
				}, {
					assets: 'INS',
					totalNo: '1,000,890.1123',
					canNo: '1,890,000',
					lockingNo: '122563'
				}, {
					assets: 'INS',
					totalNo: '1,000,198.1123',
					canNo: '1,089,000',
					lockingNo: '122563'
				}]
			}
		},
		components: {

		},
		methods: {
			handleClick(tab, event) {
				console.log(tab, event);
			},
			funUsers() {
				console.log(123)
				this.$router.push({
					path: '/wallet/userInfo'
				})
			}
		}
	}
</script>

<style>
	.wallet {
		width: 90%;
		margin: auto;
		margin-top: 5rem;
	}
	
	.el-select {
		width: 65%;
	}
</style>