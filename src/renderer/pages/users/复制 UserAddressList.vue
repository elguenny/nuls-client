<template>
	<div class="users">
		<div>
			<el-button type="text" icon="el-icon-arrow-left">钱包管理</el-button>
		</div>
		<el-row>
			<el-col :span="18" class="user-name">
				账户管理
			</el-col>
			<el-col :span="6">
				<el-button type="primary">创建账户</el-button>
				<el-button type="primary">导入账户</el-button>
			</el-col>
		</el-row>

		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="name" label="账户" width="400">
			</el-table-column>
			<el-table-column prop="alias" label="别名" width="80">
			</el-table-column>
			<el-table-column fixed="right" label="操作" >
				<template slot-scope="scope">
					<el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">
						移除
					</el-button>
					<el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">
						备份
					</el-button>
				</template>
			</el-table-column>
		</el-table>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				tableData: [{
					name: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					alias: 'NTER7'
				}, {
					name: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					alias: ''
				}, {
					name: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					alias: 'NTER1'
				}, {
					name: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					alias: 'NTER8'
				}]
			}
		}
	}
</script>
<style>
	.users {
		width: 90%;
		margin: auto;
		margin-top: 5rem;
	}
	
	.user-name {
		text-align: center;
	}
</style>