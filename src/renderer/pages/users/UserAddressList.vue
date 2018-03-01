<template>
	<div class="users">
		<Back :backTitle="backTitle"></Back>
		<h2>通讯录</h2>
		<el-table :data="tableData" style="width: 100%">
			<el-table-column prop="name" label="账户" min-width="60" align='center'>
			</el-table-column>
			<el-table-column prop="alias" label="别名" min-width="10" align='center'>
			</el-table-column>
			<el-table-column prop="remark" label="备注" min-width="10" align='center'>
			</el-table-column>
			<el-table-column label="操作" min-width="20" align='center'>
				<template slot-scope="scope">
					<el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">
						编辑
					</el-button>
					<el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">
						删除
					</el-button>
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
				backTitle: "设置",
				tableData: [{
					name: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					alias: 'NTER7',
					remark: 'NTER8'
				}, {
					name: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					alias: '',
					remark: 'NTER8'
				}, {
					name: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					alias: 'NTER1',
					remark: ''
				}, {
					name: 'NxaD59D7aAd29654eBC58A1DEaD649153B288928e3',
					alias: 'NTER8',
					remark: 'NTER8'
				}]
			}
		},
		components: {
			Back,
		}
	}
</script>
<style lang="less">
	@import url("../../assets/css/style.less");
	.users {
		width: 90%;
		margin: auto;
		h2 {
			font-size: 16px;
			text-align: center;
			line-height: 20px;
			margin-bottom: 28px;
		}
		.back{
			margin-left: 0px;
		}
	}
</style>